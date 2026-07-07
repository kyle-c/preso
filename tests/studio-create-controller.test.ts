import { describe, expect, it } from 'vitest'
import {
  buildCreateGenerationPayload,
  buildMergeGenerationPayload,
  createDeckTitle,
  filterPresentationLibrary,
  getSlideSearchText,
  getSelectedDecksForMerge,
  predictCreateSlideCount,
  predictMergeSlideCount,
  presentationFetchFailure,
  sortPresentationDecks,
} from '../lib/studio-create-controller'

const settings = {
  provider: 'anthropic',
  apiKey: 'sk-test',
  model: 'claude-sonnet-4',
}

describe('studio create controller', () => {
  it('builds the create generation payload from prompt, files, model settings, and template', () => {
    const payload = buildCreateGenerationPayload({
      prompt: 'Create a launch deck',
      enrichedContext: 'Context: revenue up. ',
      files: [
        { name: 'metrics.csv', type: 'data', data: 'mrr,100' },
        { name: 'hero.png', type: 'image', data: 'base64-image' },
      ],
      settings,
      selectedTemplate: {
        title: 'Board update',
        slideCount: 8,
        sections: [{ type: 'title', title: 'Open' }],
      },
    })

    expect(payload).toMatchObject({
      prompt: 'Context: revenue up. Create a launch deck',
      provider: 'anthropic',
      apiKey: 'sk-test',
      model: 'claude-sonnet-4',
      parallel: true,
      templateStructure: {
        title: 'Board update',
        slideCount: 8,
      },
    })
    expect(payload.files).toEqual([
      { name: 'metrics.csv', type: 'data', data: 'mrr,100' },
      { name: 'hero.png', type: 'image', data: 'base64-image' },
    ])
  })

  it('selects merge decks in selected order and builds source material once', () => {
    const decks = [
      { id: 'deck-a', title: 'A', slides: [{ type: 'title', title: 'One' } as any] },
      { id: 'deck-b', title: 'B', slides: [{ type: 'title', title: 'Two' } as any] },
    ]
    const selectedDecks = getSelectedDecksForMerge(['deck-b', 'missing', 'deck-a'], decks)
    const payload = buildMergeGenerationPayload({
      selectedIds: ['deck-b', 'deck-a'],
      selectedDecks,
      mergePrompt: '',
      mergeMode: 'narrative',
      settings,
    })

    expect(selectedDecks.map((deck) => deck.id)).toEqual(['deck-b', 'deck-a'])
    expect(payload.prompt).toBe('Merge these 2 presentations')
    expect(payload.merge.sourceIds).toEqual(['deck-b', 'deck-a'])
    expect(payload.merge.sourceMaterial).toContain('=== Deck: "B" (1 slides) ===')
    expect(payload.merge.sourceMaterial).toContain('"title": "Two"')
  })

  it('predicts create and merge slide counts conservatively', () => {
    expect(predictCreateSlideCount('Write a PRD for onboarding')).toBeGreaterThanOrEqual(10)
    expect(predictMergeSlideCount([
      { id: 'a', slides: new Array(12).fill({ type: 'title', title: 'Slide' } as any) },
      { id: 'b', slides: new Array(20).fill({ type: 'title', title: 'Slide' } as any) },
    ], 'narrative')).toBe(24)
    expect(predictMergeSlideCount([
      { id: 'a', slides: new Array(25).fill({ type: 'title', title: 'Slide' } as any) },
      { id: 'b', slides: new Array(25).fill({ type: 'title', title: 'Slide' } as any) },
    ], 'deduplicate')).toBe(40)
  })

  it('keeps generated deck titles deterministic', () => {
    expect(createDeckTitle([{ type: 'title', title: 'Customer Story' } as any], 'Ignored', 'Untitled')).toBe('Customer Story')
    expect(createDeckTitle([], 'A'.repeat(80), 'Untitled')).toBe('A'.repeat(60))
    expect(createDeckTitle([], '   ', 'Untitled')).toBe('Untitled')
  })

  it('classifies stale sessions separately from empty libraries', () => {
    expect(presentationFetchFailure(401)).toEqual({
      status: 'unauthorized',
      message: 'Your Studio session has expired. Refresh and sign in again to see your decks.',
    })
    expect(presentationFetchFailure(500, 'Redis unavailable')).toEqual({
      status: 'error',
      message: 'Redis unavailable',
    })
  })

  it('extracts searchable text from nested slide content', () => {
    const text = getSlideSearchText({
      type: 'cards',
      bg: 'light',
      title: 'Quarterly Plan',
      cards: [{ title: 'Retention', titleColor: '#000', body: 'Expansion motions' }],
      columns: [{ heading: 'North star', bullets: [{ text: 'Activation rate' }] }],
      quote: { text: 'Ship the learning loop', attribution: 'Team' },
    })

    expect(text).toContain('quarterly plan')
    expect(text).toContain('expansion motions')
    expect(text).toContain('activation rate')
    expect(text).toContain('ship the learning loop')
  })

  it('sorts presentation libraries by created, edited, or comments', () => {
    const decks = [
      { id: 'a', title: 'A', createdAt: 10, updatedAt: 15, commentCount: 2 },
      { id: 'b', title: 'B', createdAt: 30, updatedAt: 12, commentCount: 8 },
      { id: 'c', title: 'C', createdAt: 20, updatedAt: 45, commentCount: 1 },
    ]

    expect(sortPresentationDecks(decks, 'created').map(deck => deck.id)).toEqual(['b', 'c', 'a'])
    expect(sortPresentationDecks(decks, 'edited').map(deck => deck.id)).toEqual(['c', 'a', 'b'])
    expect(sortPresentationDecks(decks, 'comments').map(deck => deck.id)).toEqual(['b', 'a', 'c'])
  })

  it('filters decks and matching slides from one library query', () => {
    const decks = [
      {
        id: 'growth',
        title: 'Growth Review',
        createdAt: 20,
        slides: [
          { type: 'title', bg: 'dark', title: 'Acquisition' } as any,
          { type: 'content', bg: 'light', title: 'Retention loop', body: 'Churn down' } as any,
        ],
      },
      {
        id: 'sales',
        title: 'Sales Update',
        createdAt: 40,
        slides: [
          { type: 'content', bg: 'light', title: 'Pipeline', body: 'Enterprise retention' } as any,
        ],
      },
    ]

    const result = filterPresentationLibrary(decks, 'retention', 'created')

    expect(result.filteredDecks.map(deck => deck.id)).toEqual(['sales', 'growth'])
    expect(result.matchingSlides.map(match => `${match.deckId}:${match.slideIndex}`)).toEqual(['growth:1', 'sales:0'])
  })
})
