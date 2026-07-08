import { describe, it, expect } from 'vitest'
import { validateSlides } from '../lib/slide-validator'

const makeSlide = (overrides: Record<string, unknown> = {}) => ({
  type: 'content',
  bg: 'dark',
  title: 'Test Slide',
  body: 'This is a test slide with enough words to pass basic density checks for validation purposes right here.',
  notes: 'Speaker notes here.',
  ...overrides,
})

describe('validateSlides', () => {
  it('returns valid for well-formed slides', () => {
    const slides = [
      makeSlide({ type: 'title', bg: 'brand' }),
      makeSlide({ bg: 'light' }),
      makeSlide({ bg: 'dark', type: 'closing' }),
    ]
    const { valid, issues } = validateSlides(slides)
    // May have minor issues but no errors
    const errors = issues.filter(i => i.severity === 'error')
    expect(errors.length).toBe(0)
  })

  // Card count validation
  it('flags 5 cards as error', () => {
    const cards = Array(5).fill({ title: 'Card', body: 'This is a card with enough body text to pass the minimum word count check easily.' })
    const { issues } = validateSlides([makeSlide({ cards })])
    expect(issues.some(i => i.field === 'cards' && i.severity === 'error')).toBe(true)
  })

  it('flags 7 cards as error', () => {
    const cards = Array(7).fill({ title: 'Card', body: 'This is a card with enough body text to pass the minimum word count check easily.' })
    const { issues } = validateSlides([makeSlide({ cards })])
    expect(issues.some(i => i.field === 'cards' && i.severity === 'error')).toBe(true)
  })

  it('accepts 4 and 6 cards', () => {
    const body = 'This is a card with enough body text to pass the minimum word count check easily.'
    const slides4 = [makeSlide({ cards: Array(4).fill({ title: 'Card', body }) })]
    const slides6 = [makeSlide({ cards: Array(6).fill({ title: 'Card', body }) })]
    expect(validateSlides(slides4).issues.some(i => i.field === 'cards' && i.message.includes('orphaned'))).toBe(false)
    expect(validateSlides(slides6).issues.some(i => i.field === 'cards' && i.message.includes('orphaned'))).toBe(false)
  })

  // Card body density
  it('flags card bodies under 15 words', () => {
    const cards = [{ title: 'Thin Card', body: 'Too short' }]
    const { issues } = validateSlides([makeSlide({ cards })])
    expect(issues.some(i => i.field.includes('cards[') && i.severity === 'error')).toBe(true)
  })

  it('flags card bodies over 60 words', () => {
    const longBody = Array(65).fill('word').join(' ')
    const cards = [{ title: 'Dense Card', body: longBody }]
    const { issues } = validateSlides([makeSlide({ cards })])
    expect(issues.some(i => i.field.includes('cards[') && i.severity === 'warning')).toBe(true)
  })

  // Card density balance
  it('flags imbalanced card density', () => {
    const cards = [
      { title: 'A', body: Array(40).fill('word').join(' ') },
      { title: 'B', body: Array(40).fill('word').join(' ') },
      { title: 'C', body: Array(40).fill('word').join(' ') },
      { title: 'D', body: 'short' },
    ]
    const { issues } = validateSlides([makeSlide({ cards })])
    expect(issues.some(i => i.message.includes('imbalance'))).toBe(true)
  })

  // Bullet validation
  it('flags too few bullets', () => {
    const bullets = [{ text: 'Only one bullet point here with some words' }]
    const { issues } = validateSlides([makeSlide({ bullets })])
    expect(issues.some(i => i.field === 'bullets' && i.message.includes('Only 1'))).toBe(true)
  })

  it('flags short bullets', () => {
    const bullets = [
      { text: 'Hi' },
      { text: 'OK' },
      { text: 'Yes' },
    ]
    const { issues } = validateSlides([makeSlide({ bullets })])
    expect(issues.some(i => i.field.includes('bullets[') && i.severity === 'warning')).toBe(true)
  })

  it('flags low average bullet density', () => {
    const bullets = [
      { text: 'short' },
      { text: 'also' },
      { text: 'thin' },
    ]
    const { issues } = validateSlides([makeSlide({ bullets })])
    expect(issues.some(i => i.field === 'bullets' && i.message.includes('Average'))).toBe(true)
  })

  // Body density
  it('flags body under 15 words on content slides', () => {
    const { issues } = validateSlides([makeSlide({ body: 'Too short' })])
    expect(issues.some(i => i.field === 'body' && i.severity === 'error')).toBe(true)
  })

  // Two-column balance
  it('flags empty column', () => {
    const columns = [
      { body: 'This column has content and some words for density' },
      { body: '' },
    ]
    const { issues } = validateSlides([makeSlide({ type: 'two-column', columns })])
    expect(issues.some(i => i.field === 'columns' && i.message.includes('empty'))).toBe(true)
  })

  it('flags thin column', () => {
    const columns = [
      { body: 'This column has enough content to pass the minimum word check here.' },
      { body: 'Short col' },
    ]
    const { issues } = validateSlides([makeSlide({ type: 'two-column', columns })])
    expect(issues.some(i => i.field === 'columns' && i.message.includes('min'))).toBe(true)
  })

  it('flags extreme column imbalance', () => {
    const columns = [
      { body: Array(50).fill('word').join(' '), bullets: [] },
      { body: Array(5).fill('word').join(' '), bullets: [] },
    ]
    const { issues } = validateSlides([makeSlide({ type: 'two-column', columns })])
    expect(issues.some(i => i.field === 'columns' && i.message.includes('imbalance'))).toBe(true)
  })

  // Background alternation
  it('flags consecutive same background', () => {
    const slides = [
      makeSlide({ bg: 'dark' }),
      makeSlide({ bg: 'dark' }),
    ]
    const { issues } = validateSlides(slides)
    expect(issues.some(i => i.field === 'bg')).toBe(true)
  })

  it('auto-fixes consecutive backgrounds', () => {
    const slides = [
      makeSlide({ bg: 'dark' }),
      makeSlide({ bg: 'dark' }),
    ]
    const { fixedSlides } = validateSlides(slides)
    expect(fixedSlides).not.toBeNull()
    expect(fixedSlides![1].bg).toBe('light')
  })

  // Emoji detection
  it('flags emoji icons on bullets', () => {
    const bullets = [
      { text: 'Bullet one with enough words', icon: '🚀' },
      { text: 'Bullet two with enough words', icon: '✓' },
    ]
    const { issues } = validateSlides([makeSlide({ bullets })])
    expect(issues.some(i => i.field === 'bullets.icon')).toBe(true)
  })

  it('does not flag functional icons', () => {
    const bullets = [
      { text: 'Bullet with check', icon: '✓' },
      { text: 'Bullet with arrow', icon: '→' },
    ]
    const { issues } = validateSlides([makeSlide({ bullets })])
    expect(issues.some(i => i.field === 'bullets.icon')).toBe(false)
  })

  // Deck-level checks
  it('flags if first slide is not title', () => {
    const { issues } = validateSlides([makeSlide({ type: 'content' })])
    expect(issues.some(i => i.field === 'type' && i.message.includes('title'))).toBe(true)
  })

  it('flags if last slide is not closing', () => {
    const slides = [
      makeSlide({ type: 'title', bg: 'brand' }),
      makeSlide({ bg: 'light' }),
    ]
    const { issues } = validateSlides(slides)
    expect(issues.some(i => i.field === 'type' && i.message.includes('closing'))).toBe(true)
  })

  it('flags low type variety', () => {
    const slides = Array(10).fill(null).map((_, i) =>
      makeSlide({ type: 'content', bg: i % 2 === 0 ? 'dark' : 'light' })
    )
    const { issues } = validateSlides(slides)
    expect(issues.some(i => i.field === 'variety')).toBe(true)
  })

  it('flags low illustration coverage', () => {
    const slides = Array(8).fill(null).map((_, i) =>
      makeSlide({ type: i === 0 ? 'title' : 'content', bg: i % 2 === 0 ? 'dark' : 'light' })
    )
    const { issues } = validateSlides(slides)
    expect(issues.some(i => i.field === 'imageUrl')).toBe(true)
  })

  // Missing notes
  it('flags missing notes', () => {
    const { issues } = validateSlides([makeSlide({ notes: undefined })])
    expect(issues.some(i => i.field === 'notes')).toBe(true)
  })

  // Title length
  it('flags long titles', () => {
    const longTitle = 'One Two Three Four Five Six Seven Eight Nine Ten Eleven'
    const { issues } = validateSlides([makeSlide({ title: longTitle })])
    expect(issues.some(i => i.field === 'title')).toBe(true)
  })
})
