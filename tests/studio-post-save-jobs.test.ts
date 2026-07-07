import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  autoRatePresentation: vi.fn(),
  getPresentation: vi.fn(),
  updatePresentation: vi.fn(),
}))

vi.mock('../lib/slide-quality-loop', () => ({
  autoRatePresentation: mocks.autoRatePresentation,
}))

vi.mock('../lib/studio-db', () => ({
  getPresentation: mocks.getPresentation,
  updatePresentation: mocks.updatePresentation,
}))

import {
  collectPresentationTranslationTexts,
  getPresentationForPostSaveJob,
  normalizePostSaveJobRequest,
  runPresentationPostSaveJobs,
  runPresentationTranslationJob,
} from '../lib/studio-post-save-jobs'

describe('studio post-save jobs', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.updatePresentation.mockResolvedValue({})
  })

  it('normalizes post-save job requests with translation enabled by default', () => {
    expect(normalizePostSaveJobRequest({})).toEqual({
      translations: true,
      qualityRating: false,
    })
    expect(normalizePostSaveJobRequest({ translations: false, qualityRating: true })).toEqual({
      translations: false,
      qualityRating: true,
    })
    expect(normalizePostSaveJobRequest({ translate: false })).toEqual({
      translations: false,
      qualityRating: false,
    })
  })

  it('collects unique translatable slide and document text', () => {
    const texts = collectPresentationTranslationTexts({
      slides: [
        {
          type: 'content',
          bg: 'light',
          title: 'Launch Plan',
          body: 'Revenue is up',
          bullets: [{ text: 'Net retention' }],
        },
      ],
      document: {
        title: 'Launch Plan',
        type: 'brief',
        summary: 'Board-ready narrative',
        sections: [
          { title: 'Executive summary', content: 'Revenue is up\n\nNext steps' },
        ],
      },
    } as any)

    expect(texts).toEqual([
      'Launch Plan',
      'Revenue is up',
      'Net retention',
      'Board-ready narrative',
      'Executive summary',
      'Next steps',
    ])
  })

  it('stores generated translations and returns locale counts', async () => {
    const presentation = {
      id: 'pres-1',
      slides: [
        { type: 'title', bg: 'dark', title: 'Launch Plan' },
        { type: 'content', bg: 'light', title: 'Revenue', body: 'Revenue is up' },
      ],
      document: null,
    } as any
    const textCount = collectPresentationTranslationTexts(presentation).length

    const result = await runPresentationTranslationJob(presentation, {
      translateTextBatch: async (texts, locale) => texts.map((text) => `${locale}:${text}`),
    })

    expect(result).toEqual({
      ok: true,
      translationCounts: {
        'es-MX': textCount,
        'pt-BR': textCount,
      },
    })
    expect(mocks.updatePresentation).toHaveBeenCalledWith('pres-1', {
      translations: {
        'es-MX': {
          'Launch Plan': 'es-MX:Launch Plan',
          Revenue: 'es-MX:Revenue',
          'Revenue is up': 'es-MX:Revenue is up',
        },
        'pt-BR': {
          'Launch Plan': 'pt-BR:Launch Plan',
          Revenue: 'pt-BR:Revenue',
          'Revenue is up': 'pt-BR:Revenue is up',
        },
      },
    })
  })

  it('skips translation storage when there is no translatable text', async () => {
    const result = await runPresentationTranslationJob({
      id: 'empty',
      slides: [],
      document: null,
    } as any)

    expect(result).toEqual({ ok: true, translations: {} })
    expect(mocks.updatePresentation).not.toHaveBeenCalled()
  })

  it('runs requested post-save jobs against the saved presentation', async () => {
    mocks.autoRatePresentation.mockResolvedValue({ promoted: 1, demoted: 0, score: 92 })
    const presentation = {
      id: 'pres-2',
      slides: [{ type: 'title', bg: 'dark', title: 'Clean title' }],
      document: null,
    } as any

    const result = await runPresentationPostSaveJobs(presentation, {
      translations: false,
      qualityRating: true,
    })

    expect(mocks.autoRatePresentation).toHaveBeenCalledWith('pres-2', presentation.slides)
    expect(result.jobs.qualityRating).toEqual({ promoted: 1, demoted: 0, score: 92 })
  })

  it('returns a presentation only for the owning user', async () => {
    mocks.getPresentation.mockResolvedValue({ id: 'pres-3', userId: 'owner' })

    await expect(getPresentationForPostSaveJob('pres-3', 'owner')).resolves.toEqual({
      id: 'pres-3',
      userId: 'owner',
    })
    await expect(getPresentationForPostSaveJob('pres-3', 'other')).resolves.toBeNull()
  })
})
