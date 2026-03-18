import { NextRequest, NextResponse } from 'next/server'

const LANG_MAP: Record<string, string> = { 'es-MX': 'es', 'pt-BR': 'pt' }
const LANG_NAMES: Record<string, string> = { 'es-MX': 'Mexican Spanish', 'pt-BR': 'Brazilian Portuguese' }
const MAX_CHARS = 4000 // conservative limit per Google request

// ---------------------------------------------------------------------------
// LLM-powered translation
// ---------------------------------------------------------------------------

async function llmTranslate(
  texts: string[],
  locale: string,
  provider: string,
  apiKey: string,
  model: string,
): Promise<string[]> {
  const langName = LANG_NAMES[locale] ?? locale
  const SEP = '\n§§§\n'
  const joined = texts.join(SEP)

  const prompt = `Translate the following text segments from English to ${langName}. The segments are separated by §§§. Return ONLY the translated segments separated by §§§, in the same order. Preserve formatting, numbers, and proper nouns. Do not add any commentary or explanation.

${joined}`

  let url: string
  let headers: Record<string, string>
  let body: string

  if (provider === 'anthropic') {
    url = 'https://api.anthropic.com/v1/messages'
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    }
    body = JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })
  } else {
    url = 'https://openrouter.ai/api/v1/chat/completions'
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }
    body = JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })
  }

  const res = await fetch(url, { method: 'POST', headers, body })
  if (!res.ok) throw new Error(`LLM returned ${res.status}`)

  const data = await res.json()
  let output: string

  if (provider === 'anthropic') {
    output = data.content?.[0]?.text ?? ''
  } else {
    output = data.choices?.[0]?.message?.content ?? ''
  }

  const parts = output.split(/\n?§§§\n?/)
  if (parts.length === texts.length) {
    return parts.map((p: string) => p.trim())
  }

  // If separator count doesn't match, fall back to returning what we got
  // for the first N texts and original for the rest
  return texts.map((t, i) => parts[i]?.trim() ?? t)
}

// ---------------------------------------------------------------------------
// Google Translate fallback
// ---------------------------------------------------------------------------

/** Translate a batch of texts using §-separator in a single Google call */
async function batchTranslate(texts: string[], tl: string): Promise<string[]> {
  const SEP = '\n§\n'
  const joined = texts.join(SEP)

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(joined)}`,
    )
    const data = await res.json()
    const full = (data[0] as [string, ...unknown[]][]).map(s => s[0]).join('')
    const parts = full.split(/\n?§\n?/)

    // If the separator survived translation and count matches, we're good
    if (parts.length === texts.length) {
      return parts.map(p => p.trim())
    }
  } catch {}

  // Fallback: individual parallel calls
  return Promise.all(
    texts.map(async (text) => {
      try {
        const r = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`,
        )
        const d = await r.json()
        return (d[0] as [string, ...unknown[]][])?.map(s => s[0]).join('') ?? text
      } catch {
        return text
      }
    }),
  )
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const { texts, locale, provider, apiKey, model } = await req.json()
    const tl = LANG_MAP[locale]
    if (!tl || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // If LLM settings are provided, use LLM-powered translation
    if (provider && apiKey && model) {
      try {
        const translations = await llmTranslate(texts, locale, provider, apiKey, model)
        return NextResponse.json({ translations })
      } catch (err) {
        console.error('[translate] LLM translation failed, falling back to Google:', err)
        // Fall through to Google Translate
      }
    }

    // Google Translate fallback
    const chunks: string[][] = []
    let chunk: string[] = []
    let len = 0

    for (const t of texts) {
      const overhead = t.length + 4 // §\n overhead
      if (len + overhead > MAX_CHARS && chunk.length > 0) {
        chunks.push(chunk)
        chunk = []
        len = 0
      }
      chunk.push(t)
      len += overhead
    }
    if (chunk.length) chunks.push(chunk)

    // Translate all chunks in parallel (typically 1-3 calls instead of 20+)
    const results = await Promise.all(chunks.map(c => batchTranslate(c, tl)))

    return NextResponse.json({ translations: results.flat() })
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
