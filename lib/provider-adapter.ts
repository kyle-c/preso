/**
 * Provider adapter — LLM API abstraction layer.
 *
 * Handles Anthropic, Google, and OpenRouter providers with:
 * - Model normalization (alias resolution)
 * - Timeout-aware fetch
 * - Non-streaming calls with provider-specific payloads
 * - Vision preprocessing for non-vision models
 * - Multimodal content building
 */

import { parseJSONResponse } from './json-parser'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FileAttachment {
  type: 'image' | 'pdf' | 'data'
  data: string
  name: string
}

export interface ProviderConfig {
  provider: 'anthropic' | 'google' | 'openrouter'
  apiKey: string
  model: string
}

// ---------------------------------------------------------------------------
// Model normalization
// ---------------------------------------------------------------------------

/** Fallback model for retry paths. Update this when rotating models. */
export const FALLBACK_MODEL = 'claude-sonnet-4-20250514'

const MODEL_ALIASES: Record<string, string> = {
  // Short-form 4.x aliases → dated IDs (API requires date suffix for 4.0 models)
  'claude-opus-4': 'claude-opus-4-20250514',
  'claude-sonnet-4': 'claude-sonnet-4-20250514',
  // Short-form 4.6 → dated IDs (safety: ensure API always gets a dated ID)
  'claude-opus-4-6': 'claude-opus-4-6-20250627',
  'claude-sonnet-4-6': 'claude-sonnet-4-6-20250627',
  // Legacy dated IDs with wrong dates → canonical dated form
  'claude-opus-4-6-20250514': 'claude-opus-4-6-20250627',
  'claude-sonnet-4-6-20250514': 'claude-sonnet-4-6-20250627',
}

export function normalizeModel(model: string): string {
  return MODEL_ALIASES[model] ?? model
}

// ---------------------------------------------------------------------------
// Image / vision helpers
// ---------------------------------------------------------------------------

export function guessImageMediaType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'png': return 'image/png'
    case 'gif': return 'image/gif'
    case 'webp': return 'image/webp'
    case 'svg': return 'image/svg+xml'
    default: return 'image/jpeg'
  }
}

/** Known models that do NOT support image/vision input */
const NON_VISION_MODELS = new Set([
  'deepseek/deepseek-r1-0528',
  'deepseek/deepseek-r1',
  'openai/o3',
  'openai/o4-mini',
])

export function modelSupportsVision(model: string): boolean {
  return !NON_VISION_MODELS.has(model)
}

/**
 * Use a cheap vision-capable model to describe uploaded images in detail.
 * Returns a text description suitable for injecting into a text-only prompt.
 */
export async function describeImagesWithVision(
  images: FileAttachment[],
  config: ProviderConfig,
): Promise<string> {
  if (images.length === 0) return ''

  const describePrompt = `Describe each image in detail. For each image, include:
- What type of content it shows (screenshot, photo, diagram, chart, mockup, etc.)
- Layout, structure, and visual hierarchy
- All visible text (transcribe exactly)
- Colors, typography, and design details
- Data points, numbers, or metrics if present
- Any branding or logo elements

Be thorough — your description will be used to recreate or reference this content in a presentation.`

  try {
    if (config.provider === 'anthropic') {
      const content: any[] = [{ type: 'text', text: describePrompt }]
      for (const img of images) {
        const mediaType = guessImageMediaType(img.name)
        const base64 = img.data.includes(',') ? img.data.split(',')[1] : img.data
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        })
      }

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4000,
          messages: [{ role: 'user', content }],
        }),
      })

      if (!res.ok) throw new Error(`Anthropic vision error: ${res.status}`)
      const data = await res.json()
      return data.content?.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('') ?? ''

    } else {
      const visionModel = config.provider === 'google'
        ? 'gemini-2.5-flash'
        : 'google/gemini-2.5-flash-lite'

      const content: any[] = [{ type: 'text', text: describePrompt }]
      for (const img of images) {
        const mediaType = guessImageMediaType(img.name)
        const dataUrl = img.data.startsWith('data:') ? img.data : `data:${mediaType};base64,${img.data}`
        content.push({ type: 'image_url', image_url: { url: dataUrl } })
      }

      const url = config.provider === 'google'
        ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
        : 'https://openrouter.ai/api/v1/chat/completions'

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      }
      if (config.provider === 'openrouter') headers['HTTP-Referer'] = 'https://felix.pago'

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: visionModel,
          max_tokens: 4000,
          temperature: 0.3,
          messages: [{ role: 'user', content }],
        }),
      })

      if (!res.ok) throw new Error(`Vision model error: ${res.status}`)
      const data = await res.json()
      return data.choices?.[0]?.message?.content ?? ''
    }
  } catch (err) {
    console.warn('[provider-adapter] Vision pre-processing failed:', err)
    return ''
  }
}

/** Build a user-facing hint about vision model support */
export function buildVisionHint(currentModel: string, provider: string): string {
  const visionModels: Record<string, string[]> = {
    anthropic: ['Claude Sonnet 4.6', 'Claude Opus 4.6', 'Claude Haiku 4.5'],
    google: ['Gemini 2.5 Flash', 'Gemini 2.5 Pro', 'Gemini 3 Flash', 'Gemini 3 Pro'],
    openrouter: ['Claude Sonnet 4.6', 'Gemini 2.5 Flash', 'GPT-4.1', 'Gemini 2.5 Pro'],
  }
  const suggestions = visionModels[provider] ?? visionModels.openrouter
  const modelLabel = currentModel.split('/').pop()?.replace(/-/g, ' ') ?? currentModel
  return `Your model (${modelLabel}) doesn't support image input directly. We described your image via a vision model and passed the description along. For native image understanding, try: ${suggestions.join(', ')}.`
}

// ---------------------------------------------------------------------------
// Fetch with timeout
// ---------------------------------------------------------------------------

export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    clearTimeout(timeoutId)
    return res
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err?.name === 'AbortError') {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)}s`)
    }
    throw err
  }
}

// ---------------------------------------------------------------------------
// Multimodal content building
// ---------------------------------------------------------------------------

/** Build multimodal user content array from text + optional file attachments */
export function buildUserContent(
  userMessage: string,
  files: FileAttachment[] | undefined,
  provider: 'anthropic' | 'openrouter' | 'google',
): any {
  if (!files || files.length === 0) return userMessage

  if (provider === 'anthropic') {
    const content: any[] = [{ type: 'text', text: userMessage }]
    for (const file of files) {
      if (file.type === 'image') {
        const mediaType = guessImageMediaType(file.name)
        const base64 = file.data.includes(',') ? file.data.split(',')[1] : file.data
        content.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } })
      } else if (file.type === 'pdf') {
        const base64 = file.data.includes(',') ? file.data.split(',')[1] : file.data
        content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } })
      } else if (file.type === 'data') {
        content.push({ type: 'text', text: `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---` })
      }
    }
    return content
  }

  // OpenRouter / Google: inline data files as text, images as data URLs
  let text = userMessage
  for (const file of files) {
    if (file.type === 'data') {
      text += `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---`
    } else if (file.type === 'pdf') {
      text += `\n\n[PDF attached: ${file.name} — analyze its content to recreate this presentation]`
    }
  }
  return text
}

// ---------------------------------------------------------------------------
// Non-streaming LLM call
// ---------------------------------------------------------------------------

export interface NonStreamingCallOptions {
  config: ProviderConfig
  systemPrompt: string
  userMessage: string
  maxTokens?: number
  enableCache?: boolean
  timeoutMs?: number
  files?: FileAttachment[]
}

/**
 * Make a non-streaming API call and return the text response.
 * Supports Anthropic, Google, and OpenRouter providers.
 */
export async function makeNonStreamingCall(opts: NonStreamingCallOptions): Promise<string> {
  const {
    config,
    systemPrompt,
    userMessage,
    maxTokens = 16000,
    enableCache = false,
    timeoutMs = 60000,
    files,
  } = opts

  const isExtendedThinking = config.model.includes('sonnet-4-5')
  const userContent = buildUserContent(userMessage, files, config.provider)

  if (config.provider === 'anthropic') {
    const systemContent = enableCache
      ? [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }]
      : systemPrompt

    const payload: any = {
      model: config.model,
      max_tokens: isExtendedThinking ? 16000 : maxTokens,
      stream: false,
      system: systemContent,
      messages: [{ role: 'user', content: userContent }],
    }
    if (!isExtendedThinking) payload.temperature = 0.7
    if (isExtendedThinking) {
      payload.thinking = { type: 'enabled', budget_tokens: 5000 }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    }
    const betaFeatures: string[] = []
    if (isExtendedThinking) betaFeatures.push('interleaved-thinking-2025-05-14')
    if (enableCache) betaFeatures.push('prompt-caching-2024-07-31')
    if (betaFeatures.length > 0) headers['anthropic-beta'] = betaFeatures.join(',')

    const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }, timeoutMs)

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Anthropic error (${res.status}): ${err}`)
    }

    const data = await res.json()
    return data.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')
  } else if (config.provider === 'google') {
    const res = await fetchWithTimeout('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      }),
    }, timeoutMs)

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Google Gemini error (${res.status}): ${err}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? ''
  } else {
    const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'HTTP-Referer': 'https://felix.pago',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      }),
    }, timeoutMs)

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`OpenRouter error (${res.status}): ${err}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? ''
  }
}
