import { describe, it, expect } from 'vitest'
import {
  normalizeModel,
  guessImageMediaType,
  modelSupportsVision,
  buildUserContent,
  buildVisionHint,
  FALLBACK_MODEL,
} from '../lib/provider-adapter'

describe('normalizeModel', () => {
  it('resolves short 4.0 aliases to dated IDs', () => {
    expect(normalizeModel('claude-opus-4')).toBe('claude-opus-4-20250514')
    expect(normalizeModel('claude-sonnet-4')).toBe('claude-sonnet-4-20250514')
  })

  it('passes through short 4.6 IDs unchanged', () => {
    expect(normalizeModel('claude-opus-4-6')).toBe('claude-opus-4-6')
    expect(normalizeModel('claude-sonnet-4-6')).toBe('claude-sonnet-4-6')
  })

  it('fixes legacy dated 4.6 IDs to short form', () => {
    expect(normalizeModel('claude-opus-4-6-20250627')).toBe('claude-opus-4-6')
    expect(normalizeModel('claude-sonnet-4-6-20250627')).toBe('claude-sonnet-4-6')
    expect(normalizeModel('claude-opus-4-6-20250514')).toBe('claude-opus-4-6')
    expect(normalizeModel('claude-sonnet-4-6-20250514')).toBe('claude-sonnet-4-6')
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
