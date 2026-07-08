import { describe, it, expect } from 'vitest'
import { countWords } from '../lib/slide-utils'

describe('countWords', () => {
  it('counts words in a normal string', () => {
    expect(countWords('hello world')).toBe(2)
    expect(countWords('one two three four five')).toBe(5)
  })

  it('returns 0 for undefined', () => {
    expect(countWords(undefined)).toBe(0)
  })

  it('returns 0 for null', () => {
    expect(countWords(null)).toBe(0)
  })

  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
  })

  it('handles extra whitespace', () => {
    expect(countWords('  hello   world  ')).toBe(2)
    expect(countWords('one\ttwo\nthree')).toBe(3)
  })

  it('handles markdown bold', () => {
    expect(countWords('**bold text** here')).toBe(3)
  })
})
