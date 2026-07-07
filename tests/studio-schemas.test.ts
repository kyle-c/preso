import { describe, expect, it } from 'vitest'
import { generateSchema } from '../lib/studio-schemas'

describe('generateSchema', () => {
  const validRequest = {
    prompt: 'Create a launch update deck',
    provider: 'anthropic',
    apiKey: 'sk-test',
    model: 'claude-sonnet-4',
    parallel: true,
  }

  it('accepts the standard generation payload', () => {
    const result = generateSchema.safeParse(validRequest)
    expect(result.success).toBe(true)
  })

  it('accepts reverse-engineering slides without a prompt', () => {
    const result = generateSchema.safeParse({
      provider: 'google',
      apiKey: 'test-key',
      model: 'gemini-2.5-flash',
      reverseEngineer: true,
      slides: [{ title: 'Existing slide', nested: { data: [1, 2, 3] } }],
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.prompt).toBe('')
    }
  })

  it('rejects unknown providers and top-level keys', () => {
    expect(generateSchema.safeParse({ ...validRequest, provider: 'local' }).success).toBe(false)
    expect(generateSchema.safeParse({ ...validRequest, admin: true }).success).toBe(false)
  })

  it('caps large user-controlled payloads', () => {
    expect(generateSchema.safeParse({ ...validRequest, prompt: 'x'.repeat(100_001) }).success).toBe(false)
    expect(generateSchema.safeParse({
      ...validRequest,
      merge: {
        mode: 'narrative',
        sourceIds: ['deck-1'],
        sourceMaterial: 'x'.repeat(250_001),
      },
    }).success).toBe(false)
  })
})
