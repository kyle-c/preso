import { autoRatePresentation } from './slide-quality-loop'
import { getPresentation, updatePresentation, type Presentation } from './studio-db'
import {
  extractTexts,
  extractDocumentTexts,
  TRANSLATION_LOCALES,
  type PresentationTranslations,
  type TranslationMap,
} from './slide-translations'

const LANG_MAP: Record<string, string> = { 'es-MX': 'es', 'pt-BR': 'pt' }
const MAX_CHARS = 4000

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>
export type TranslateTextBatch = (texts: string[], locale: string) => Promise<string[]>

export interface NormalizedPostSaveJobs {
  translations: boolean
  qualityRating: boolean
}

export interface TranslationJobResult {
  ok: true
  translations?: PresentationTranslations
  translationCounts?: Record<string, number>
}

export interface PostSaveJobResult {
  ok: true
  jobs: {
    translations?: TranslationJobResult
    qualityRating?: Awaited<ReturnType<typeof autoRatePresentation>>
  }
}

async function batchTranslate(texts: string[], tl: string, fetcher: FetchLike): Promise<string[]> {
  const separator = '\n§\n'
  const joined = texts.join(separator)

  try {
    const res = await fetcher(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(joined)}`,
    )
    const data = await res.json()
    const full = (data[0] as [string, ...unknown[]][]).map((segment) => segment[0]).join('')
    const parts = full.split(/\n?§\n?/)
    if (parts.length === texts.length) {
      return parts.map((part) => part.trim())
    }
  } catch {}

  return Promise.all(
    texts.map(async (text) => {
      try {
        const res = await fetcher(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`,
        )
        const data = await res.json()
        return (data[0] as [string, ...unknown[]][])?.map((segment) => segment[0]).join('') ?? text
      } catch {
        return text
      }
    }),
  )
}

export function normalizePostSaveJobRequest(input: unknown): NormalizedPostSaveJobs {
  const body = input && typeof input === 'object' ? input as Record<string, unknown> : {}
  const translations = body.translations === undefined
    ? body.translate !== false
    : body.translations !== false

  return {
    translations,
    qualityRating: body.qualityRating === true,
  }
}

export function collectPresentationTranslationTexts(
  presentation: Pick<Presentation, 'slides' | 'document'>,
): string[] {
  const slideTexts = extractTexts(presentation.slides ?? [])
  const docTexts = extractDocumentTexts(presentation.document)
  return [...new Set([...slideTexts, ...docTexts])]
}

export function getTranslationCounts(translations: PresentationTranslations): Record<string, number> {
  return Object.fromEntries(
    TRANSLATION_LOCALES.map((locale) => [
      locale,
      Object.keys(translations[locale] ?? {}).length,
    ]),
  )
}

export async function translateTexts(
  texts: string[],
  locale: string,
  options: {
    fetcher?: FetchLike
    translateTextBatch?: TranslateTextBatch
  } = {},
): Promise<TranslationMap> {
  if (!texts.length) return {}
  if (options.translateTextBatch) {
    const translated = await options.translateTextBatch(texts, locale)
    return texts.reduce<TranslationMap>((map, text, index) => {
      if (translated[index] && translated[index] !== text) {
        map[text] = translated[index]
      }
      return map
    }, {})
  }

  const tl = LANG_MAP[locale]
  if (!tl) return {}

  const chunks: string[][] = []
  let chunk: string[] = []
  let len = 0

  for (const text of texts) {
    const overhead = text.length + 4
    if (len + overhead > MAX_CHARS && chunk.length > 0) {
      chunks.push(chunk)
      chunk = []
      len = 0
    }
    chunk.push(text)
    len += overhead
  }
  if (chunk.length) chunks.push(chunk)

  const fetcher = options.fetcher ?? fetch
  const results = await Promise.all(chunks.map((textsChunk) => batchTranslate(textsChunk, tl, fetcher)))
  const flat = results.flat()

  return texts.reduce<TranslationMap>((map, text, index) => {
    if (flat[index] && flat[index] !== text) {
      map[text] = flat[index]
    }
    return map
  }, {})
}

export async function buildPresentationTranslations(
  texts: string[],
  options: {
    fetcher?: FetchLike
    translateTextBatch?: TranslateTextBatch
  } = {},
): Promise<PresentationTranslations> {
  const translations: PresentationTranslations = {}
  await Promise.all(
    TRANSLATION_LOCALES.map(async (locale) => {
      translations[locale] = await translateTexts(texts, locale, options)
    }),
  )
  return translations
}

export async function runPresentationTranslationJob(
  presentation: Pick<Presentation, 'id' | 'slides' | 'document'>,
  options: {
    fetcher?: FetchLike
    translateTextBatch?: TranslateTextBatch
  } = {},
): Promise<TranslationJobResult> {
  const allTexts = collectPresentationTranslationTexts(presentation)

  if (allTexts.length === 0) {
    return { ok: true, translations: {} }
  }

  const translations = await buildPresentationTranslations(allTexts, options)
  await updatePresentation(presentation.id, {
    translations: translations as NonNullable<Presentation['translations']>,
  })

  return {
    ok: true,
    translationCounts: getTranslationCounts(translations),
  }
}

export async function runPresentationQualityRatingJob(
  presentation: Pick<Presentation, 'id' | 'slides'>,
) {
  return autoRatePresentation(presentation.id, presentation.slides)
}

export async function runPresentationPostSaveJobs(
  presentation: Pick<Presentation, 'id' | 'slides' | 'document'>,
  jobs: NormalizedPostSaveJobs,
  options: {
    fetcher?: FetchLike
    translateTextBatch?: TranslateTextBatch
  } = {},
): Promise<PostSaveJobResult> {
  const result: PostSaveJobResult = { ok: true, jobs: {} }

  if (jobs.translations) {
    result.jobs.translations = await runPresentationTranslationJob(presentation, options)
  }

  if (jobs.qualityRating) {
    result.jobs.qualityRating = await runPresentationQualityRatingJob(presentation)
  }

  return result
}

export async function getPresentationForPostSaveJob(
  presentationId: string,
  userId: string,
): Promise<Presentation | null> {
  const presentation = await getPresentation(presentationId)
  if (!presentation || presentation.userId !== userId) return null
  return presentation
}
