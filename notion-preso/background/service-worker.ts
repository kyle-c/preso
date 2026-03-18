import { SYSTEM_PROMPT, OUTLINE_PROMPT, buildUserMessage, buildOutlineUserMessage, buildFromOutlineMessage } from './claude-prompt'
import type { ExtractedPage, SlideData, StreamMessage } from '../shared/types'

/* ── Service Worker: handles API calls + streaming ── */

// Standard message handler (non-streaming, backward compat)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GENERATE_PRESO') {
    const forceRefresh = !!message.forceRefresh
    handleGenerate(message.payload as ExtractedPage, forceRefresh)
      .then(slides => sendResponse({ type: 'PRESO_RESULT', payload: { slides } }))
      .catch(err => sendResponse({ type: 'PRESO_ERROR', payload: { error: err.message || String(err) } }))
    return true
  }

  if (message.type === 'PRE_PROCESS') {
    handlePreProcess(message.payload as ExtractedPage)
      .then(result => sendResponse({ type: 'PRE_PROCESS_DONE', payload: result }))
      .catch(() => sendResponse({ type: 'PRE_PROCESS_DONE', payload: { hash: '', hasOutline: false } }))
    return true
  }
})

// Port-based streaming handler
chrome.runtime.onConnect.addListener(port => {
  if (port.name !== 'preso-stream') return

  port.onMessage.addListener(async (message) => {
    if (message.type === 'GENERATE_STREAM') {
      try {
        await handleStreamGenerate(
          message.payload as ExtractedPage,
          !!message.forceRefresh,
          port
        )
      } catch (err) {
        const msg: StreamMessage = {
          type: 'STREAM_ERROR',
          error: err instanceof Error ? err.message : String(err)
        }
        try { port.postMessage(msg) } catch { /* port disconnected */ }
      }
    }
  })
})

/* ── Content-hash cache ── */

async function hashContent(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

interface CacheEntry {
  hash: string
  slides: SlideData[]
  timestamp: number
}

interface OutlineEntry {
  hash: string
  outline: string
  timestamp: number
}

const CACHE_PREFIX = 'preso-cache:'
const OUTLINE_PREFIX = 'preso-outline:'
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

async function getCached(hash: string): Promise<SlideData[] | null> {
  return new Promise(resolve => {
    chrome.storage.local.get(CACHE_PREFIX + hash, result => {
      const entry = result[CACHE_PREFIX + hash] as CacheEntry | undefined
      if (entry && Date.now() - entry.timestamp < CACHE_MAX_AGE) {
        resolve(entry.slides)
      } else {
        resolve(null)
      }
    })
  })
}

async function setCache(hash: string, slides: SlideData[]): Promise<void> {
  const entry: CacheEntry = { hash, slides, timestamp: Date.now() }
  return new Promise(resolve => {
    chrome.storage.local.set({ [CACHE_PREFIX + hash]: entry }, resolve)
  })
}

async function getOutline(hash: string): Promise<string | null> {
  return new Promise(resolve => {
    chrome.storage.local.get(OUTLINE_PREFIX + hash, result => {
      const entry = result[OUTLINE_PREFIX + hash] as OutlineEntry | undefined
      if (entry && Date.now() - entry.timestamp < CACHE_MAX_AGE) {
        resolve(entry.outline)
      } else {
        resolve(null)
      }
    })
  })
}

async function setOutline(hash: string, outline: string): Promise<void> {
  const entry: OutlineEntry = { hash, outline, timestamp: Date.now() }
  return new Promise(resolve => {
    chrome.storage.local.set({ [OUTLINE_PREFIX + hash]: entry }, resolve)
  })
}

async function evictStaleCache(): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.local.get(null, all => {
      const stale: string[] = []
      for (const [key, val] of Object.entries(all)) {
        if (key.startsWith(CACHE_PREFIX) || key.startsWith(OUTLINE_PREFIX)) {
          const entry = val as { timestamp: number }
          if (Date.now() - entry.timestamp > CACHE_MAX_AGE) stale.push(key)
        }
      }
      if (stale.length) chrome.storage.local.remove(stale, resolve)
      else resolve()
    })
  })
}

/* ── Provider settings ── */

interface Settings {
  provider: 'anthropic' | 'openrouter'
  apiKey: string
  model: string
}

const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'
const DEFAULT_OPENROUTER_MODEL = 'anthropic/claude-haiku-4.5'

// Cheap models for background pre-processing
const CHEAP_ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001'
const CHEAP_OPENROUTER_MODEL = 'google/gemini-2.5-flash-lite'

async function getSettings(): Promise<Settings> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      ['provider', 'anthropicKey', 'anthropicModel', 'openrouterKey', 'openrouterModel',
       'claudeApiKey', 'claudeModel'],
      result => {
        if (result.claudeApiKey && !result.anthropicKey) {
          result.provider = 'anthropic'
          result.anthropicKey = result.claudeApiKey
          result.anthropicModel = result.claudeModel
        }

        const provider = result.provider || 'anthropic'

        if (provider === 'openrouter') {
          if (!result.openrouterKey) return reject(new Error('No OpenRouter API key configured. Go to extension settings.'))
          resolve({
            provider: 'openrouter',
            apiKey: result.openrouterKey,
            model: result.openrouterModel || DEFAULT_OPENROUTER_MODEL,
          })
        } else {
          if (!result.anthropicKey) return reject(new Error('No API key configured. Go to extension settings.'))
          resolve({
            provider: 'anthropic',
            apiKey: result.anthropicKey,
            model: result.anthropicModel || DEFAULT_ANTHROPIC_MODEL,
          })
        }
      }
    )
  })
}

/* ── Serialization ── */

function serializeBlocks(page: ExtractedPage): string {
  return page.blocks.map(b => {
    const prefix =
      b.type === 'heading1' ? '# ' :
      b.type === 'heading2' ? '## ' :
      b.type === 'heading3' ? '### ' :
      b.type === 'bullet' ? '- ' :
      b.type === 'numbered' ? '1. ' :
      b.type === 'todo' ? `[${b.checked ? 'x' : ' '}] ` :
      b.type === 'callout' ? '> 💡 ' :
      b.type === 'quote' ? '> ' :
      b.type === 'code' ? '```\n' :
      b.type === 'divider' ? '---' :
      b.type === 'image' ? `[Image: ${b.imageUrl || ''}] ` :
      ''
    const suffix = b.type === 'code' ? '\n```' : ''
    let result = `${prefix}${b.text}${suffix}`
    if (b.children) {
      result += '\n' + b.children.map(c => `  - ${c.text}`).join('\n')
    }
    return result
  }).join('\n')
}

function serializeComments(page: ExtractedPage): string {
  if (page.comments.length === 0) return ''
  return page.comments.map(c => {
    let s = `[${c.author}] on "${c.blockText}": ${c.text}`
    c.replies.forEach(r => { s += `\n  ↳ [${r.author}]: ${r.text}` })
    return s
  }).join('\n')
}

/* ── Non-streaming API calls (for pre-processing) ── */

async function callApiNonStream(
  settings: Settings,
  systemPrompt: string,
  userMessage: string,
  model?: string
): Promise<string> {
  const useModel = model || settings.model

  if (settings.provider === 'openrouter') {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
        'HTTP-Referer': 'https://felix.pago',
        'X-OpenRouter-Title': 'Doc Preso',
      },
      body: JSON.stringify({
        model: useModel,
        max_tokens: 4096,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(`OpenRouter API error (${response.status}): ${err}`)
    }
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  } else {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: useModel,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Anthropic API error (${response.status}): ${err}`)
    }
    const data = await response.json()
    return data.content?.[0]?.text || ''
  }
}

/* ── Streaming API calls ── */

async function* streamAnthropic(settings: Settings, userMessage: string): AsyncGenerator<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 16384,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API error (${response.status}): ${err}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') return

      try {
        const event = JSON.parse(data)
        if (event.type === 'content_block_delta' && event.delta?.text) {
          yield event.delta.text
        }
      } catch { /* skip unparseable lines */ }
    }
  }
}

async function* streamOpenRouter(settings: Settings, userMessage: string): AsyncGenerator<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
      'HTTP-Referer': 'https://felix.pago',
      'X-OpenRouter-Title': 'Doc Preso',
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 16384,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter API error (${response.status}): ${err}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') return

      try {
        const event = JSON.parse(data)
        const content = event.choices?.[0]?.delta?.content
        if (content) yield content
      } catch { /* skip */ }
    }
  }
}

/* ── Incremental JSON slide parser ── */

class IncrementalSlideParser {
  private buffer = ''
  private slides: SlideData[] = []
  private depth = 0
  private inString = false
  private escaped = false
  private objectStart = -1
  private inArray = false

  addChunk(chunk: string): SlideData[] {
    const newSlides: SlideData[] = []

    for (const ch of chunk) {
      this.buffer += ch

      if (this.escaped) { this.escaped = false; continue }
      if (ch === '\\' && this.inString) { this.escaped = true; continue }
      if (ch === '"') { this.inString = !this.inString; continue }
      if (this.inString) continue

      if (ch === '[' && !this.inArray) {
        this.inArray = true
        continue
      }

      if (ch === '{') {
        if (this.depth === 0) this.objectStart = this.buffer.length - 1
        this.depth++
      } else if (ch === '}') {
        this.depth--
        if (this.depth === 0 && this.objectStart >= 0) {
          const objStr = this.buffer.slice(this.objectStart)
          try {
            const slide = JSON.parse(objStr) as SlideData
            newSlides.push(slide)
            this.slides.push(slide)
          } catch { /* incomplete or malformed, continue */ }
          this.objectStart = -1
        }
      }
    }

    return newSlides
  }

  getAll(): SlideData[] { return this.slides }
  getRawBuffer(): string { return this.buffer }
}

/* ── JSON repair (fallback for non-streaming) ── */

function parseJsonWithRepair(raw: string): SlideData[] {
  try { return JSON.parse(raw) }
  catch { /* continue */ }

  let json = raw.replace(/,\s*([}\]])/g, '$1')
  try { return JSON.parse(json) }
  catch { /* continue */ }

  json = json.replace(/"([^"]*?)"/g, (_match, content: string) => {
    const escaped = content
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
    return `"${escaped}"`
  })
  try { return JSON.parse(json) }
  catch { /* continue */ }

  json = raw.replace(/,\s*([}\]])/g, '$1')
  json = json.replace(/:\s*"((?:[^"\\]|\\.)*)"/g, (_match, content: string) => {
    const fixed = content.replace(/(?<!\\)"/g, '\\"')
    return `: "${fixed}"`
  })
  try { return JSON.parse(json) }
  catch { /* continue */ }

  json = raw.replace(/,\s*([}\]])/g, '$1')
  let bracketDepth = 0, braceDepth = 0, lastValidEnd = -1
  for (let i = 0; i < json.length; i++) {
    const ch = json[i]
    if (ch === '[') bracketDepth++
    else if (ch === ']') { bracketDepth--; if (bracketDepth === 0) lastValidEnd = i }
    else if (ch === '{') braceDepth++
    else if (ch === '}') braceDepth--
  }
  if (lastValidEnd > 0) {
    try { return JSON.parse(json.slice(0, lastValidEnd + 1)) }
    catch { /* continue */ }
  }

  let repaired = json.trimEnd()
  repaired = repaired.replace(/,\s*"[^"]*$/, '')
  repaired = repaired.replace(/,\s*{[^}]*$/, '')
  repaired = repaired.replace(/:\s*"[^"]*$/, ': ""')

  let openBraces = 0, openBrackets = 0
  let inStr = false, esc = false
  for (const ch of repaired) {
    if (esc) { esc = false; continue }
    if (ch === '\\') { esc = true; continue }
    if (ch === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (ch === '{') openBraces++
    else if (ch === '}') openBraces--
    else if (ch === '[') openBrackets++
    else if (ch === ']') openBrackets--
  }
  for (let i = 0; i < openBraces; i++) repaired += '}'
  for (let i = 0; i < openBrackets; i++) repaired += ']'

  try { return JSON.parse(repaired) }
  catch (e) {
    throw new Error(`Failed to parse slide JSON: ${(e as Error).message}`)
  }
}

/* ── Pre-processing: background outline generation ── */

async function handlePreProcess(page: ExtractedPage): Promise<{ hash: string; hasOutline: boolean }> {
  const content = serializeBlocks(page)
  const userMessage = buildOutlineUserMessage(page.title, content)
  const hash = await hashContent(userMessage)

  // Check if we already have slides cached for this content
  const cachedSlides = await getCached(hash)
  if (cachedSlides) return { hash, hasOutline: true }

  // Check if we already have an outline
  const cachedOutline = await getOutline(hash)
  if (cachedOutline) return { hash, hasOutline: true }

  // Generate outline with cheap model
  try {
    const settings = await getSettings()
    const cheapModel = settings.provider === 'openrouter'
      ? CHEAP_OPENROUTER_MODEL
      : CHEAP_ANTHROPIC_MODEL

    const truncated = userMessage.length > 80000
      ? userMessage.slice(0, 80000) + '\n\n[Content truncated due to length]'
      : userMessage

    const outline = await callApiNonStream(settings, OUTLINE_PROMPT, truncated, cheapModel)
    await setOutline(hash, outline)
    return { hash, hasOutline: true }
  } catch {
    // Pre-processing failure is non-critical — generation will work without outline
    return { hash, hasOutline: false }
  }
}

/* ── Streaming generation handler ── */

async function handleStreamGenerate(
  page: ExtractedPage,
  forceRefresh: boolean,
  port: chrome.runtime.Port
): Promise<void> {
  const content = serializeBlocks(page)
  const comments = serializeComments(page)
  const fullUserMessage = buildUserMessage(page.title, content, comments)

  const hash = await hashContent(fullUserMessage)

  // Check cache
  if (!forceRefresh) {
    const cached = await getCached(hash)
    if (cached) {
      const startMsg: StreamMessage = { type: 'STREAM_START', estimatedTotal: cached.length }
      port.postMessage(startMsg)
      cached.forEach((slide, i) => {
        const slideMsg: StreamMessage = { type: 'STREAM_SLIDE', slide, index: i }
        port.postMessage(slideMsg)
      })
      const doneMsg: StreamMessage = { type: 'STREAM_DONE', slides: cached }
      port.postMessage(doneMsg)
      return
    }
  }

  evictStaleCache()
  const settings = await getSettings()

  // Check for cached outline — use it for faster generation
  let userMessage: string
  const outlineHash = await hashContent(buildOutlineUserMessage(page.title, content))
  const outline = await getOutline(outlineHash)

  if (outline) {
    // Use outline as primary input — much smaller, faster
    userMessage = buildFromOutlineMessage(page.title, outline)
    // If there are comments, append them
    if (comments) {
      userMessage += `\n\n## Document Comments\n${comments}`
    }
  } else {
    userMessage = fullUserMessage
  }

  const truncated = userMessage.length > 80000
    ? userMessage.slice(0, 80000) + '\n\n[Content truncated due to length]'
    : userMessage

  // Estimate slide count from headings
  const headingCount = (content.match(/^#{1,2} /gm) || []).length
  const estimatedTotal = Math.max(6, Math.min(12, headingCount + 2))

  const startMsg: StreamMessage = { type: 'STREAM_START', estimatedTotal }
  port.postMessage(startMsg)

  // Stream the response
  const parser = new IncrementalSlideParser()
  const stream = settings.provider === 'openrouter'
    ? streamOpenRouter(settings, truncated)
    : streamAnthropic(settings, truncated)

  for await (const chunk of stream) {
    const newSlides = parser.addChunk(chunk)
    for (const slide of newSlides) {
      const slideMsg: StreamMessage = {
        type: 'STREAM_SLIDE',
        slide,
        index: parser.getAll().length - newSlides.length + newSlides.indexOf(slide)
      }
      try { port.postMessage(slideMsg) } catch { return }
    }
  }

  let slides = parser.getAll()

  // If streaming parser didn't extract any slides, fall back to full text repair
  if (slides.length === 0) {
    const rawText = parser.getRawBuffer()
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      const errMsg: StreamMessage = { type: 'STREAM_ERROR', error: 'Failed to parse slide data from model response' }
      port.postMessage(errMsg)
      return
    }
    slides = parseJsonWithRepair(jsonMatch[0])
    // Send all slides at once since streaming didn't work
    slides.forEach((slide, i) => {
      const slideMsg: StreamMessage = { type: 'STREAM_SLIDE', slide, index: i }
      try { port.postMessage(slideMsg) } catch { /* disconnected */ }
    })
  }

  // Cache and finalize
  await setCache(hash, slides)
  const doneMsg: StreamMessage = { type: 'STREAM_DONE', slides }
  try { port.postMessage(doneMsg) } catch { /* disconnected */ }
}

/* ── Non-streaming generation (backward compat) ── */

async function handleGenerate(page: ExtractedPage, forceRefresh = false): Promise<SlideData[]> {
  const content = serializeBlocks(page)
  const comments = serializeComments(page)
  const fullUserMessage = buildUserMessage(page.title, content, comments)

  const hash = await hashContent(fullUserMessage)

  if (!forceRefresh) {
    const cached = await getCached(hash)
    if (cached) return cached
  }

  evictStaleCache()
  const settings = await getSettings()

  // Check for cached outline
  let userMessage: string
  const outlineHash = await hashContent(buildOutlineUserMessage(page.title, content))
  const outline = await getOutline(outlineHash)

  if (outline) {
    userMessage = buildFromOutlineMessage(page.title, outline)
    if (comments) userMessage += `\n\n## Document Comments\n${comments}`
  } else {
    userMessage = fullUserMessage
  }

  const truncated = userMessage.length > 80000
    ? userMessage.slice(0, 80000) + '\n\n[Content truncated due to length]'
    : userMessage

  const text = await callApiNonStream(settings, SYSTEM_PROMPT, truncated)

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Failed to parse slide data from model response')
  }

  const slides: SlideData[] = parseJsonWithRepair(jsonMatch[0])
  await setCache(hash, slides)
  return slides
}
