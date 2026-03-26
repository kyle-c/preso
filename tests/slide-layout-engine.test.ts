import { describe, it, expect } from 'vitest'
import { postProcessSlides, validateLayout } from '../lib/slide-layout-engine'

const makeSlide = (overrides: Record<string, unknown> = {}) => ({
  type: 'content',
  bg: 'dark',
  title: 'Test Slide',
  ...overrides,
})

describe('postProcessSlides', () => {
  it('returns empty array for empty input', () => {
    expect(postProcessSlides([])).toEqual([])
  })

  it('does not mutate input array', () => {
    const slides = [makeSlide({ bg: 'dark' }), makeSlide({ bg: 'dark' })] as any
    const original = JSON.parse(JSON.stringify(slides))
    postProcessSlides(slides)
    expect(slides).toEqual(original)
  })

  it('fixes consecutive same backgrounds', () => {
    const slides = [
      makeSlide({ bg: 'dark' }),
      makeSlide({ bg: 'dark' }),
      makeSlide({ bg: 'dark' }),
    ] as any
    const result = postProcessSlides(slides)
    expect(result[0].bg).toBe('dark')
    expect(result[1].bg).toBe('light')
    expect(result[2].bg).toBe('dark')
  })

  it('preserves brand backgrounds', () => {
    const slides = [
      makeSlide({ bg: 'brand' }),
      makeSlide({ bg: 'brand' }),
    ] as any
    const result = postProcessSlides(slides)
    expect(result[0].bg).toBe('brand')
    expect(result[1].bg).toBe('brand')
  })

  it('fixes 5 cards to 4', () => {
    const cards = Array(5).fill(null).map((_, i) => ({ title: `Card ${i + 1}`, body: `Body ${i + 1}` }))
    const slides = [makeSlide({ cards })] as any
    const result = postProcessSlides(slides)
    expect(result[0].cards.length).toBe(4)
  })

  it('fixes 7 cards to 6', () => {
    const cards = Array(7).fill(null).map((_, i) => ({ title: `Card ${i + 1}`, body: `Body ${i + 1}` }))
    const slides = [makeSlide({ cards })] as any
    const result = postProcessSlides(slides)
    expect(result[0].cards.length).toBe(6)
    expect(result[0].notes).toContain('Card 7')
  })

  it('truncates body text over 80 words', () => {
    const body = Array(100).fill('word').join(' ')
    const slides = [makeSlide({ body })] as any
    const result = postProcessSlides(slides)
    const resultWords = result[0].body.split(/\s+/).length
    expect(resultWords).toBeLessThanOrEqual(81) // 80 + possible trailing "..."
    expect(result[0].notes).toContain('Full text:')
  })

  it('does not truncate body text under 80 words', () => {
    const body = Array(50).fill('word').join(' ')
    const slides = [makeSlide({ body })] as any
    const result = postProcessSlides(slides)
    expect(result[0].body).toBe(body)
  })

  it('adds subtitle to empty section slides', () => {
    const slides = [
      makeSlide({ type: 'section' }),
      makeSlide({ title: 'Next Topic' }),
    ] as any
    const result = postProcessSlides(slides)
    expect(result[0].subtitle).toBeTruthy()
  })

  it('does not overwrite existing section subtitles', () => {
    const slides = [makeSlide({ type: 'section', subtitle: 'Existing' })] as any
    const result = postProcessSlides(slides)
    expect(result[0].subtitle).toBe('Existing')
  })
})

describe('validateLayout', () => {
  it('passes for well-formed slides', () => {
    const slides = [
      makeSlide({ type: 'title', bg: 'dark' }),
      makeSlide({ type: 'content', bg: 'light' }),
      makeSlide({ type: 'closing', bg: 'dark' }),
    ] as any
    const { valid, issues } = validateLayout(slides)
    expect(valid).toBe(true)
    expect(issues).toEqual([])
  })

  it('flags non-title first slide', () => {
    const slides = [
      makeSlide({ type: 'content', bg: 'dark' }),
      makeSlide({ type: 'closing', bg: 'light' }),
    ] as any
    const { valid, issues } = validateLayout(slides)
    expect(valid).toBe(false)
    expect(issues.some(i => i.includes('title'))).toBe(true)
  })

  it('flags non-closing last slide', () => {
    const slides = [
      makeSlide({ type: 'title', bg: 'dark' }),
      makeSlide({ type: 'content', bg: 'light' }),
    ] as any
    const { valid, issues } = validateLayout(slides)
    expect(valid).toBe(false)
    expect(issues.some(i => i.includes('closing'))).toBe(true)
  })

  it('flags slides with 5 or 7 cards', () => {
    const slides = [
      makeSlide({ cards: Array(5).fill({ title: 'C', body: 'B' }) }),
    ] as any
    const { issues } = validateLayout(slides)
    expect(issues.some(i => i.includes('5 cards'))).toBe(true)
  })

  it('flags body text over 100 words', () => {
    const body = Array(105).fill('word').join(' ')
    const slides = [makeSlide({ body })] as any
    const { issues } = validateLayout(slides)
    expect(issues.some(i => i.includes('words'))).toBe(true)
  })
})
