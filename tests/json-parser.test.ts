import { describe, it, expect } from 'vitest'
import { parseJSONResponse } from '../lib/json-parser'

describe('parseJSONResponse', () => {
  it('parses plain JSON object', () => {
    const result = parseJSONResponse('{"key": "value"}')
    expect(result).toEqual({ key: 'value' })
  })

  it('parses plain JSON array', () => {
    const result = parseJSONResponse('[1, 2, 3]')
    expect(result).toEqual([1, 2, 3])
  })

  it('strips markdown fences', () => {
    const result = parseJSONResponse('```json\n{"key": "value"}\n```')
    expect(result).toEqual({ key: 'value' })
  })

  it('strips bare markdown fences', () => {
    const result = parseJSONResponse('```\n[1, 2]\n```')
    expect(result).toEqual([1, 2])
  })

  it('extracts JSON from leading text', () => {
    const result = parseJSONResponse('Here is the output:\n{"slides": []}')
    expect(result).toEqual({ slides: [] })
  })

  it('handles nested braces', () => {
    const input = '{"outer": {"inner": {"deep": true}}}'
    expect(parseJSONResponse(input)).toEqual({ outer: { inner: { deep: true } } })
  })

  it('handles strings with braces', () => {
    const input = '{"text": "a { b } c"}'
    expect(parseJSONResponse(input)).toEqual({ text: 'a { b } c' })
  })

  it('handles escaped quotes in strings', () => {
    const input = '{"text": "she said \\"hello\\""}'
    expect(parseJSONResponse(input)).toEqual({ text: 'she said "hello"' })
  })

  it('picks object over array when object comes first', () => {
    const input = 'Result: {"key": 1} and also [1, 2]'
    expect(parseJSONResponse(input)).toEqual({ key: 1 })
  })

  it('picks array when array comes first', () => {
    const input = 'Result: [{"a": 1}]'
    expect(parseJSONResponse(input)).toEqual([{ a: 1 }])
  })

  it('throws on no JSON', () => {
    expect(() => parseJSONResponse('no json here')).toThrow('No JSON found')
  })

  it('throws on incomplete JSON', () => {
    expect(() => parseJSONResponse('{"key": "value"')).toThrow('Incomplete JSON')
  })

  it('handles trailing text after JSON', () => {
    const result = parseJSONResponse('{"done": true}\n\nHope this helps!')
    expect(result).toEqual({ done: true })
  })

  it('handles complex slide-like JSON', () => {
    const input = JSON.stringify({
      slides: [{ type: 'title', title: 'Hello', bg: 'brand' }],
      document: { title: 'Test', sections: [] },
    })
    const result = parseJSONResponse(input)
    expect(result.slides).toHaveLength(1)
    expect(result.slides[0].type).toBe('title')
  })
})
