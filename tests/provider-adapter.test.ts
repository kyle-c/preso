import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  normalizeModel,
  guessImageMediaType,
  modelSupportsVision,
  buildUserContent,
  buildVisionHint,
  fetchWithTimeout,
  describeImagesWithVision,
  makeNonStreamingCall,
  FALLBACK_MODEL,
} from '../lib/provider-adapter'

describe('normalizeModel', () => {
  it('resolves short 4.0 aliases to dated IDs', () => {
    expect(normalizeModel('claude-opus-4')).toBe('claude-opus-4-20250514')
    expect(normalizeModel('claude-sonnet-4')).toBe('claude-sonnet-4-20250514')
  })

  it('resolves short 4.6 aliases to dated IDs', () => {
    expect(normalizeModel('claude-opus-4-6')).toBe('claude-opus-4-6-20250627')
    expect(normalizeModel('claude-sonnet-4-6')).toBe('claude-sonnet-4-6-20250627')
  })

  it('passes through canonical dated 4.6 IDs unchanged', () => {
    expect(normalizeModel('claude-opus-4-6-20250627')).toBe('claude-opus-4-6-20250627')
    expect(normalizeModel('claude-sonnet-4-6-20250627')).toBe('claude-sonnet-4-6-20250627')
  })

  it('fixes legacy wrong-date 4.6 IDs to canonical dated form', () => {
    expect(normalizeModel('claude-opus-4-6-20250514')).toBe('claude-opus-4-6-20250627')
    expect(normalizeModel('claude-sonnet-4-6-20250514')).toBe('claude-sonnet-4-6-20250627')
  })

  it('passes through unknown models unchanged', () => {
    expect(normalizeModel('gpt-4.1')).toBe('gpt-4.1')
    expect(normalizeModel('gemini-2.5-flash')).toBe('gemini-2.5-flash')
  })
})

describe('guessImageMediaType', () => {
  it('detects png', () => {
    expect(guessImageMediaType('photo.png')).toBe('image/png')
  })

  it('detects gif', () => {
    expect(guessImageMediaType('animation.gif')).toBe('image/gif')
  })

  it('detects webp', () => {
    expect(guessImageMediaType('photo.webp')).toBe('image/webp')
  })

  it('detects svg', () => {
    expect(guessImageMediaType('icon.svg')).toBe('image/svg+xml')
  })

  it('defaults to jpeg', () => {
    expect(guessImageMediaType('photo.jpg')).toBe('image/jpeg')
    expect(guessImageMediaType('photo.jpeg')).toBe('image/jpeg')
    expect(guessImageMediaType('unknown.bmp')).toBe('image/jpeg')
  })
})

describe('modelSupportsVision', () => {
  it('returns false for known non-vision models', () => {
    expect(modelSupportsVision('deepseek/deepseek-r1-0528')).toBe(false)
    expect(modelSupportsVision('openai/o3')).toBe(false)
    expect(modelSupportsVision('openai/o4-mini')).toBe(false)
  })

  it('returns true for vision-capable models', () => {
    expect(modelSupportsVision('claude-sonnet-4-6-20250627')).toBe(true)
    expect(modelSupportsVision('gemini-2.5-flash')).toBe(true)
  })
})

describe('buildUserContent', () => {
  it('returns plain text when no files', () => {
    expect(buildUserContent('hello', undefined, 'anthropic')).toBe('hello')
    expect(buildUserContent('hello', [], 'google')).toBe('hello')
  })

  it('builds Anthropic multimodal content with image', () => {
    const files = [{ type: 'image' as const, data: 'base64data', name: 'photo.png' }]
    const result = buildUserContent('describe this', files, 'anthropic')
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toEqual({ type: 'text', text: 'describe this' })
    expect(result[1].type).toBe('image')
    expect(result[1].source.media_type).toBe('image/png')
  })

  it('builds Anthropic multimodal content with data file', () => {
    const files = [{ type: 'data' as const, data: 'col1,col2\n1,2', name: 'data.csv' }]
    const result = buildUserContent('analyze this', files, 'anthropic')
    expect(Array.isArray(result)).toBe(true)
    expect(result[1].text).toContain('Data file: data.csv')
  })

  it('inlines data files as text for OpenRouter', () => {
    const files = [{ type: 'data' as const, data: 'col1,col2\n1,2', name: 'data.csv' }]
    const result = buildUserContent('analyze this', files, 'openrouter')
    expect(typeof result).toBe('string')
    expect(result).toContain('Data file: data.csv')
  })
})

describe('buildVisionHint', () => {
  it('includes model label and suggestions', () => {
    const hint = buildVisionHint('deepseek/deepseek-r1', 'openrouter')
    expect(hint).toContain('deepseek r1')
    expect(hint).toContain('Claude Sonnet 4.6')
  })
})

describe('FALLBACK_MODEL', () => {
  it('is a valid Anthropic model ID', () => {
    expect(FALLBACK_MODEL).toMatch(/^claude-/)
    expect(FALLBACK_MODEL).toContain('20250514')
  })
})

// ---------------------------------------------------------------------------
// Mock-based tests for network functions
// ---------------------------------------------------------------------------

describe('buildUserContent — PDF handling', () => {
  it('builds Anthropic PDF as base64 document block', () => {
    const files = [{ type: 'pdf' as const, data: 'data:application/pdf;base64,AAAA', name: 'report.pdf' }]
    const result = buildUserContent('analyze this', files, 'anthropic')
    expect(Array.isArray(result)).toBe(true)
    expect(result[1].type).toBe('document')
    expect(result[1].source.media_type).toBe('application/pdf')
    expect(result[1].source.data).toBe('AAAA')
  })

  it('builds Anthropic PDF with raw base64 (no data: prefix)', () => {
    const files = [{ type: 'pdf' as const, data: 'AAAA', name: 'report.pdf' }]
    const result = buildUserContent('analyze this', files, 'anthropic')
    expect(result[1].source.data).toBe('AAAA')
  })

  it('inlines PDF as text note for OpenRouter', () => {
    const files = [{ type: 'pdf' as const, data: 'AAAA', name: 'report.pdf' }]
    const result = buildUserContent('analyze this', files, 'openrouter')
    expect(typeof result).toBe('string')
    expect(result).toContain('[PDF attached: report.pdf')
  })

  it('inlines PDF as text note for Google', () => {
    const files = [{ type: 'pdf' as const, data: 'AAAA', name: 'report.pdf' }]
    const result = buildUserContent('analyze this', files, 'google')
    expect(typeof result).toBe('string')
    expect(result).toContain('[PDF attached: report.pdf')
  })
})

describe('fetchWithTimeout', () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('returns response on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    const res = await fetchWithTimeout('https://example.com', { method: 'GET' }, 5000)
    expect(res.status).toBe(200)
  })

  it('throws on timeout', async () => {
    globalThis.fetch = vi.fn().mockImplementation((_url, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
      })
    })
    await expect(fetchWithTimeout('https://example.com', { method: 'GET' }, 50)).rejects.toThrow('timed out')
  })

  it('rethrows non-abort errors', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network failure'))
    await expect(fetchWithTimeout('https://example.com', { method: 'GET' }, 5000)).rejects.toThrow('Network failure')
  })
})

describe('describeImagesWithVision', () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('returns empty string for no images', async () => {
    const result = await describeImagesWithVision([], { provider: 'anthropic', apiKey: 'key', model: 'claude-sonnet-4-6' })
    expect(result).toBe('')
  })

  it('calls Anthropic API and returns text', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      content: [{ type: 'text', text: 'A photo of a cat' }],
    }), { status: 200 }))

    const images = [{ type: 'image' as const, data: 'base64data', name: 'cat.png' }]
    const result = await describeImagesWithVision(images, { provider: 'anthropic', apiKey: 'key', model: 'claude-sonnet-4-6' })
    expect(result).toBe('A photo of a cat')
    expect(globalThis.fetch).toHaveBeenCalledWith('https://api.anthropic.com/v1/messages', expect.anything())
  })

  it('calls Google API for google provider', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: 'A chart' } }],
    }), { status: 200 }))

    const images = [{ type: 'image' as const, data: 'base64data', name: 'chart.png' }]
    const result = await describeImagesWithVision(images, { provider: 'google', apiKey: 'key', model: 'gemini-2.5-flash' })
    expect(result).toBe('A chart')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('generativelanguage.googleapis.com'),
      expect.anything(),
    )
  })

  it('calls OpenRouter API for openrouter provider', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: 'A diagram' } }],
    }), { status: 200 }))

    const images = [{ type: 'image' as const, data: 'base64data', name: 'dia.png' }]
    const result = await describeImagesWithVision(images, { provider: 'openrouter', apiKey: 'key', model: 'google/gemini-2.5-flash' })
    expect(result).toBe('A diagram')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('openrouter.ai'),
      expect.anything(),
    )
  })

  it('returns empty string on API error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('error', { status: 500 }))

    const images = [{ type: 'image' as const, data: 'base64data', name: 'cat.png' }]
    const result = await describeImagesWithVision(images, { provider: 'anthropic', apiKey: 'key', model: 'claude-sonnet-4-6' })
    expect(result).toBe('')
  })
})

describe('makeNonStreamingCall', () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('calls Anthropic API and extracts text', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      content: [{ type: 'text', text: '{"slides": []}' }],
    }), { status: 200 }))

    const result = await makeNonStreamingCall({
      config: { provider: 'anthropic', apiKey: 'key', model: 'claude-sonnet-4-20250514' },
      systemPrompt: 'You are helpful.',
      userMessage: 'Generate slides',
    })
    expect(result).toBe('{"slides": []}')
  })

  it('calls Google API and extracts content', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: '{"slides": []}' } }],
    }), { status: 200 }))

    const result = await makeNonStreamingCall({
      config: { provider: 'google', apiKey: 'key', model: 'gemini-2.5-flash' },
      systemPrompt: 'You are helpful.',
      userMessage: 'Generate slides',
    })
    expect(result).toBe('{"slides": []}')
  })

  it('calls OpenRouter API and extracts content', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: '{"slides": []}' } }],
    }), { status: 200 }))

    const result = await makeNonStreamingCall({
      config: { provider: 'openrouter', apiKey: 'key', model: 'openai/gpt-4.1' },
      systemPrompt: 'You are helpful.',
      userMessage: 'Generate slides',
    })
    expect(result).toBe('{"slides": []}')
    const fetchCall = (globalThis.fetch as any).mock.calls[0]
    expect(fetchCall[1].headers['HTTP-Referer']).toBe('https://felix.pago')
  })

  it('enables extended thinking for sonnet-4-5', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      content: [{ type: 'thinking', thinking: '...' }, { type: 'text', text: 'result' }],
    }), { status: 200 }))

    const result = await makeNonStreamingCall({
      config: { provider: 'anthropic', apiKey: 'key', model: 'claude-sonnet-4-5-20250514' },
      systemPrompt: 'You are helpful.',
      userMessage: 'Think about this',
    })
    expect(result).toBe('result')
    const body = JSON.parse((globalThis.fetch as any).mock.calls[0][1].body)
    expect(body.thinking).toEqual({ type: 'enabled', budget_tokens: 5000 })
    expect(body.temperature).toBeUndefined()
  })

  it('throws on Anthropic API error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('{"error": "invalid"}', { status: 400 }))

    await expect(makeNonStreamingCall({
      config: { provider: 'anthropic', apiKey: 'key', model: 'claude-sonnet-4-20250514' },
      systemPrompt: 'You are helpful.',
      userMessage: 'Generate',
    })).rejects.toThrow('Anthropic error (400)')
  })

  it('throws on Google API error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('error', { status: 500 }))

    await expect(makeNonStreamingCall({
      config: { provider: 'google', apiKey: 'key', model: 'gemini-2.5-flash' },
      systemPrompt: 'You are helpful.',
      userMessage: 'Generate',
    })).rejects.toThrow('Google Gemini error (500)')
  })

  it('throws on OpenRouter API error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('error', { status: 429 }))

    await expect(makeNonStreamingCall({
      config: { provider: 'openrouter', apiKey: 'key', model: 'openai/gpt-4.1' },
      systemPrompt: 'You are helpful.',
      userMessage: 'Generate',
    })).rejects.toThrow('OpenRouter error (429)')
  })
})
