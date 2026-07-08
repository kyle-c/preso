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
    const slides = [makeSlide({ type: 'cards', cards })] as any
    const result = postProcessSlides(slides)
    expect(result[0].cards.length).toBe(4)
  })

  it('fixes 7 cards to 4 (card count fix then slot cap)', () => {
    const cards = Array(7).fill(null).map((_, i) => ({ title: `Card ${i + 1}`, body: `Body ${i + 1}` }))
    const slides = [makeSlide({ type: 'cards', cards })] as any
    const result = postProcessSlides(slides)
    // fixCardCounts: 7 → 6 (moves 7th to notes), then enforceSlotLimits: 6 → 4 (cards maxCards)
    expect(result[0].cards.length).toBe(4)
    expect(result[0].notes).toContain('Card 7')
  })

  // ── Slot-enforced body truncation ──

  it('truncates body text beyond slot limit', () => {
    // content type has maxBodyWords: 50
    const body = Array(70).fill('word').join(' ')
    const slides = [makeSlide({ body })] as any
    const result = postProcessSlides(slides)
    const resultWords = result[0].body.split(/\s+/).length
    expect(resultWords).toBeLessThanOrEqual(51)
    expect(result[0].notes).toContain('Full body text')
  })

  it('does not truncate body text under slot limit', () => {
    const body = Array(40).fill('word').join(' ')
    const slides = [makeSlide({ body })] as any
    const result = postProcessSlides(slides)
    expect(result[0].body).toBe(body)
  })

  // ── Slot-enforced bullet truncation ──

  it('caps bullet count per slot limit', () => {
    // bullets type has maxBullets: 5
    const bullets = Array(8).fill(null).map((_, i) => ({ text: `Bullet ${i + 1} text here` }))
    const slides = [makeSlide({ type: 'bullets', bullets })] as any
    const result = postProcessSlides(slides)
    expect(result[0].bullets.length).toBe(5)
    expect(result[0].notes).toContain('Bullet 6')
  })

  it('truncates long bullets to word limit', () => {
    // bullets type has maxBulletWords: 15
    const bullets = [{ text: Array(25).fill('word').join(' ') }]
    const slides = [makeSlide({ type: 'bullets', bullets })] as any
    const result = postProcessSlides(slides)
    expect(result[0].bullets[0].text.split(/\s+/).length).toBeLessThanOrEqual(16)
  })

  // ── Slot-enforced card truncation ──

  it('truncates card bodies beyond slot limit', () => {
    // cards type has maxCardBodyWords: 20
    const cards = [{ title: 'Card', body: Array(35).fill('word').join(' ') }]
    const slides = [makeSlide({ type: 'cards', cards })] as any
    const result = postProcessSlides(slides)
    expect(result[0].cards[0].body.split(/\s+/).length).toBeLessThanOrEqual(21)
  })

  it('preserves card bodies under slot limit', () => {
    const cards = [{ title: 'Card', body: 'Short card body text' }]
    const slides = [makeSlide({ type: 'cards', cards })] as any
    const result = postProcessSlides(slides)
    expect(result[0].cards[0].body).toBe('Short card body text')
  })

  // ── Slot-enforced column truncation ──

  it('truncates column body beyond slot limit', () => {
    // two-column has maxColumnWords: 40
    const columns = [
      { heading: 'Left', body: Array(55).fill('word').join(' ') },
      { heading: 'Right', body: 'Short column' },
    ]
    const slides = [makeSlide({ type: 'two-column', columns })] as any
    const result = postProcessSlides(slides)
    expect(result[0].columns[0].body.split(/\s+/).length).toBeLessThanOrEqual(41)
    expect(result[0].notes).toContain('Column "Left"')
  })

  it('caps column bullet count', () => {
    // two-column has maxBullets: 3 per column
    const columns = [
      { heading: 'Left', bullets: Array(7).fill(null).map((_, i) => ({ text: `Item ${i}` })) },
      { heading: 'Right', body: 'Short' },
    ]
    const slides = [makeSlide({ type: 'two-column', columns })] as any
    const result = postProcessSlides(slides)
    expect(result[0].columns[0].bullets.length).toBe(3)
  })

  // ── Quote truncation ──

  it('truncates quote beyond slot limit', () => {
    // quote type has maxQuoteWords: 25
    const quote = { text: Array(40).fill('word').join(' '), author: 'Someone' }
    const slides = [makeSlide({ type: 'quote', quote })] as any
    const result = postProcessSlides(slides)
    expect(result[0].quote.text.split(/\s+/).length).toBeLessThanOrEqual(26)
    expect(result[0].notes).toContain('Full quote')
  })

  // ── Section slides ──

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

  // ── Overflow goes to notes ──

  it('moves overflow content to notes', () => {
    const body = Array(70).fill('word').join(' ')
    const slides = [makeSlide({ body, notes: 'Existing note' })] as any
    const result = postProcessSlides(slides)
    expect(result[0].notes).toContain('Existing note')
    expect(result[0].notes).toContain('Full body text')
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
    const { valid } = validateLayout(slides)
    expect(valid).toBe(false)
  })

  it('flags non-closing last slide', () => {
    const slides = [
      makeSlide({ type: 'title', bg: 'dark' }),
      makeSlide({ type: 'content', bg: 'light' }),
    ] as any
    const { valid } = validateLayout(slides)
    expect(valid).toBe(false)
  })

  it('flags slides with 5 or 7 cards', () => {
    const slides = [
      makeSlide({ cards: Array(5).fill({ title: 'C', body: 'B' }) }),
    ] as any
    const { issues } = validateLayout(slides)
    expect(issues.some(i => i.includes('5 cards'))).toBe(true)
  })
})
