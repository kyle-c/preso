import { describe, it, expect } from 'vitest'
import { analyzeSlides, coachSummary } from '../lib/slide-coach'

const makeSlide = (overrides: Record<string, unknown> = {}) => ({
  type: 'content',
  bg: 'dark',
  title: 'Test Slide',
  ...overrides,
})

describe('analyzeSlides', () => {
  it('returns empty array for no slides', () => {
    expect(analyzeSlides([])).toEqual([])
  })

  it('flags cover titles longer than 6 words', () => {
    const slides = [makeSlide({ type: 'title', title: 'This Is A Very Long Cover Title Here' })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'title-length')).toBe(true)
  })

  it('does not flag short cover titles', () => {
    const slides = [makeSlide({ type: 'title', title: 'Short Title' })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'title-length')).toBe(false)
  })

  it('flags content titles longer than 12 words', () => {
    const slides = [makeSlide({ title: 'One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen' })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'title-length')).toBe(true)
  })

  it('flags slides with more than 150 words as errors', () => {
    const body = Array(151).fill('word').join(' ')
    const slides = [makeSlide({ body })]
    const suggestions = analyzeSlides(slides as any)
    const densitySuggestion = suggestions.find(s => s.rule === 'word-density')
    expect(densitySuggestion?.severity).toBe('error')
  })

  it('flags slides with 121-150 words as warnings', () => {
    const body = Array(130).fill('word').join(' ')
    const slides = [makeSlide({ body })]
    const suggestions = analyzeSlides(slides as any)
    const densitySuggestion = suggestions.find(s => s.rule === 'word-density')
    expect(densitySuggestion?.severity).toBe('warning')
  })

  it('flags 5 cards as error', () => {
    const cards = Array(5).fill({ title: 'Card', body: 'Body' })
    const slides = [makeSlide({ cards })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'card-count')).toBe(true)
  })

  it('flags 7 cards as error', () => {
    const cards = Array(7).fill({ title: 'Card', body: 'Body' })
    const slides = [makeSlide({ cards })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'card-count')).toBe(true)
  })

  it('allows 4 and 6 cards', () => {
    const slides4 = [makeSlide({ cards: Array(4).fill({ title: 'Card', body: 'Body' }) })]
    const slides6 = [makeSlide({ cards: Array(6).fill({ title: 'Card', body: 'Body' }) })]
    expect(analyzeSlides(slides4 as any).some(s => s.rule === 'card-count')).toBe(false)
    expect(analyzeSlides(slides6 as any).some(s => s.rule === 'card-count')).toBe(false)
  })

  it('flags consecutive same background', () => {
    const slides = [
      makeSlide({ bg: 'dark' }),
      makeSlide({ bg: 'dark' }),
    ]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'bg-alternation')).toBe(true)
  })

  it('does not flag alternating backgrounds', () => {
    const slides = [
      makeSlide({ bg: 'dark' }),
      makeSlide({ bg: 'light' }),
    ]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'bg-alternation')).toBe(false)
  })

  it('flags more than 7 bullets', () => {
    const bullets = Array(8).fill({ text: 'Bullet point' })
    const slides = [makeSlide({ bullets })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'bullet-count')).toBe(true)
  })

  it('flags missing notes', () => {
    const slides = [makeSlide()]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'missing-notes')).toBe(true)
  })

  it('does not flag slides with notes', () => {
    const slides = [makeSlide({ notes: 'Speaker notes here' })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'missing-notes')).toBe(false)
  })

  it('flags thin content slides with fewer than 30 words as errors', () => {
    const slides = [makeSlide({ body: 'Just a few words' })]
    const suggestions = analyzeSlides(slides as any)
    const thin = suggestions.find(s => s.rule === 'thin-content')
    expect(thin?.severity).toBe('error')
  })

  it('warns on slides with 30-49 words', () => {
    const body = Array(35).fill('word').join(' ')
    const slides = [makeSlide({ body })]
    const suggestions = analyzeSlides(slides as any)
    const thin = suggestions.find(s => s.rule === 'thin-content')
    expect(thin?.severity).toBe('warning')
  })

  it('does not flag thin content on title/section/closing slides', () => {
    const slides = [makeSlide({ type: 'title', body: 'Short' })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'thin-content')).toBe(false)
  })

  it('does not flag content slides with 50+ words', () => {
    const body = Array(55).fill('word').join(' ')
    const slides = [makeSlide({ body })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'thin-content')).toBe(false)
  })

  it('flags data-as-text when 3+ numbers in text', () => {
    const slides = [makeSlide({ body: 'Revenue grew 45% to $2.3M with 150 new customers' })]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'data-viz')).toBe(true)
  })

  it('flags 3 consecutive same type', () => {
    const slides = [
      makeSlide({ type: 'bullets' }),
      makeSlide({ type: 'bullets', bg: 'light' }),
      makeSlide({ type: 'bullets' }),
    ]
    const suggestions = analyzeSlides(slides as any)
    expect(suggestions.some(s => s.rule === 'type-variety')).toBe(true)
  })
})

describe('coachSummary', () => {
  it('returns perfect score for no suggestions', () => {
    const summary = coachSummary([])
    expect(summary).toEqual({ errors: 0, warnings: 0, info: 0, score: 100 })
  })

  it('deducts 15 per error', () => {
    const suggestions = [
      { slideIndex: 0, severity: 'error' as const, rule: 'test', message: 'Test' },
    ]
    expect(coachSummary(suggestions).score).toBe(85)
  })

  it('deducts 5 per warning', () => {
    const suggestions = [
      { slideIndex: 0, severity: 'warning' as const, rule: 'test', message: 'Test' },
    ]
    expect(coachSummary(suggestions).score).toBe(95)
  })

  it('deducts 1 per info', () => {
    const suggestions = [
      { slideIndex: 0, severity: 'info' as const, rule: 'test', message: 'Test' },
    ]
    expect(coachSummary(suggestions).score).toBe(99)
  })

  it('never goes below 0', () => {
    const suggestions = Array(10).fill({
      slideIndex: 0, severity: 'error' as const, rule: 'test', message: 'Test',
    })
    expect(coachSummary(suggestions).score).toBe(0)
  })
})
