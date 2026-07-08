import { detectIntent } from './prompt-strengthener'
import type { SlideData } from '@/components/studio/slide-renderer'
import type { TemplateSectionSkeleton } from './studio-db'

export type GenerateMode = 'presentation' | 'outline' | 'document'
export type SaveStatus = 'idle' | 'pending-quality' | 'saving' | 'syncing' | 'saved' | 'error'
export type TabKey = 'mine' | 'shared-by-me' | 'shared-with-me' | 'archived'
export type PresentationListStatus = 'idle' | 'loading' | 'ready' | 'error' | 'unauthorized'
export type MergeMode = 'narrative' | 'deduplicate'
export type PresentationSortKey = 'created' | 'edited' | 'comments'

export interface StudioGenerationSettings {
  provider: string
  apiKey: string
  model: string
}

export interface StudioSourceFile {
  name: string
  type: string
  data: string
}

export interface CreateTemplateSelection {
  title: string
  slideCount: number
  sections: TemplateSectionSkeleton[]
}

export interface MergeSourceDeck {
  id: string
  title?: string
  slides?: SlideData[]
}

export interface PresentationLibraryDeck extends MergeSourceDeck {
  createdAt?: number
  updatedAt?: number
  commentCount?: number
}

export interface MatchingSlide {
  deckId: string
  deckTitle: string
  slideIndex: number
  slide: SlideData
}

export interface PresentationFetchFailure {
  status: Extract<PresentationListStatus, 'error' | 'unauthorized'>
  message: string
}

const INTENT_SLIDE_COUNTS: Record<string, number> = {
  onboarding: 10,
  prd: 14,
  launch: 12,
  review: 14,
  research: 14,
  proposal: 12,
  strategy: 12,
  general: 12,
}

export const SAVE_STATUS_COPY: Record<SaveStatus, { title: string; body: string }> = {
  idle: { title: '', body: '' },
  'pending-quality': {
    title: 'Review before saving',
    body: 'Quality checks found issues. Choose whether to revise or save anyway.',
  },
  saving: {
    title: 'Saving deck',
    body: 'Keeping this draft in your Studio library.',
  },
  syncing: {
    title: 'Syncing details',
    body: 'Attaching the outline, document, and follow-up metadata.',
  },
  saved: {
    title: 'Saved to Studio',
    body: 'You can open, edit, share, or export this deck.',
  },
  error: {
    title: 'Save needs attention',
    body: 'The deck is still visible here, but Studio could not save every artifact.',
  },
}

export function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback
}

export async function readResponseError(res: Response, fallback: string) {
  const data = await res.json().catch(() => null)
  if (data?.error) return data.error as string
  return `${fallback} (${res.status})`
}

export function predictCreateSlideCount(prompt: string) {
  return INTENT_SLIDE_COUNTS[detectIntent(prompt.trim())] ?? INTENT_SLIDE_COUNTS.general
}

export function predictMergeSlideCount(decks: MergeSourceDeck[], mode: MergeMode) {
  const slideSizes = decks.map((deck) => deck.slides?.length ?? 0)
  if (slideSizes.length === 0) return 0
  if (mode === 'narrative') return Math.min(Math.max(...slideSizes) + 4, 30)
  return Math.min(slideSizes.reduce((sum, count) => sum + count, 0), 40)
}

export function createDeckTitle(slides: SlideData[], prompt: string, fallback: string) {
  return slides[0]?.title || prompt.trim().slice(0, 60) || fallback
}

export function buildCreateGenerationPayload({
  prompt,
  enrichedContext,
  files,
  settings,
  selectedTemplate,
}: {
  prompt: string
  enrichedContext?: string
  files: StudioSourceFile[]
  settings: StudioGenerationSettings
  selectedTemplate: CreateTemplateSelection | null
}) {
  return {
    prompt: enrichedContext ? enrichedContext + prompt.trim() : prompt.trim(),
    files: files.map((file) => ({ name: file.name, type: file.type, data: file.data })),
    provider: settings.provider,
    apiKey: settings.apiKey,
    model: settings.model,
    parallel: true,
    ...(selectedTemplate && {
      templateStructure: {
        title: selectedTemplate.title,
        slideCount: selectedTemplate.slideCount,
        sections: selectedTemplate.sections,
      },
    }),
  }
}

export function getSelectedDecksForMerge(
  selectedIds: Iterable<string>,
  availableDecks: MergeSourceDeck[],
) {
  const deckMap = new Map(availableDecks.map((deck) => [deck.id, deck]))
  return [...selectedIds]
    .map((id) => deckMap.get(id))
    .filter((deck): deck is MergeSourceDeck => Boolean(deck))
}

export function buildMergeSourceMaterial(decks: MergeSourceDeck[]) {
  return decks.map((deck) =>
    `=== Deck: "${deck.title ?? 'Untitled'}" (${deck.slides?.length ?? 0} slides) ===\n${JSON.stringify(deck.slides ?? [], null, 1)}`
  ).join('\n\n')
}

export function buildMergeGenerationPayload({
  selectedIds,
  selectedDecks,
  mergePrompt,
  mergeMode,
  settings,
}: {
  selectedIds: Iterable<string>
  selectedDecks: MergeSourceDeck[]
  mergePrompt: string
  mergeMode: MergeMode
  settings: StudioGenerationSettings
}) {
  return {
    prompt: mergePrompt.trim() || `Merge these ${selectedDecks.length} presentations`,
    provider: settings.provider,
    apiKey: settings.apiKey,
    model: settings.model,
    parallel: true,
    merge: {
      mode: mergeMode,
      sourceIds: [...selectedIds],
      sourceMaterial: buildMergeSourceMaterial(selectedDecks),
    },
  }
}

export function presentationFetchFailure(status: number, message?: string): PresentationFetchFailure {
  if (status === 401) {
    return {
      status: 'unauthorized',
      message: 'Your Studio session has expired. Refresh and sign in again to see your decks.',
    }
  }

  return {
    status: 'error',
    message: message || 'Could not load presentations. Please try again.',
  }
}

export function getSlideSearchText(slide: SlideData): string {
  const parts = [slide.title, slide.subtitle, slide.body, slide.badge]
  if (slide.bullets) parts.push(...slide.bullets.map((bullet) => bullet.text))
  if (slide.cards) parts.push(...slide.cards.flatMap((card) => [card.title, card.body]))
  if (slide.columns) {
    parts.push(...slide.columns.flatMap((column) => [
      column.heading,
      column.body,
      ...(column.bullets?.map((bullet) => bullet.text) ?? []),
    ]))
  }
  if (slide.quote) parts.push(slide.quote.text, slide.quote.attribution)
  return parts.filter(Boolean).join(' ').toLowerCase()
}

export function sortPresentationDecks<T extends PresentationLibraryDeck>(
  decks: T[],
  sortBy: PresentationSortKey,
): T[] {
  return [...decks].sort((a, b) => {
    if (sortBy === 'comments') return (b.commentCount ?? 0) - (a.commentCount ?? 0)
    if (sortBy === 'edited') return (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0)
    return (b.createdAt ?? 0) - (a.createdAt ?? 0)
  })
}

export function filterPresentationLibrary<T extends PresentationLibraryDeck>(
  presentations: T[],
  searchQuery: string,
  sortBy: PresentationSortKey,
): { filteredDecks: T[]; matchingSlides: MatchingSlide[] } {
  const q = searchQuery.trim().toLowerCase()
  if (!q) {
    return { filteredDecks: sortPresentationDecks(presentations, sortBy), matchingSlides: [] }
  }

  const decks = presentations.filter((presentation) =>
    presentation.title?.toLowerCase().includes(q) ||
    presentation.slides?.some((slide) => getSlideSearchText(slide).includes(q))
  )

  const matchingSlides: MatchingSlide[] = []
  for (const presentation of presentations) {
    if (!presentation.slides) continue
    for (let i = 0; i < presentation.slides.length; i++) {
      const slide = presentation.slides[i]
      if (getSlideSearchText(slide).includes(q)) {
        matchingSlides.push({
          deckId: presentation.id,
          deckTitle: presentation.title ?? 'Untitled',
          slideIndex: i,
          slide,
        })
      }
    }
  }

  return { filteredDecks: sortPresentationDecks(decks, sortBy), matchingSlides }
}
