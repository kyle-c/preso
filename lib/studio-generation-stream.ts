import { parseFinalResult, parseIncrementalSlides } from './incremental-parser'
import type { SlideData } from '@/components/studio/slide-renderer'

type GenerationMode = 'parallel' | 'sequential'

export interface GenerationReadyPayload {
  slides: SlideData[]
  mode: GenerationMode
  document?: unknown
}

export interface GenerationStreamCallbacks {
  onHint?: (hint: string) => void
  onSlides?: (slides: SlideData[]) => void
  onDocument?: (document: unknown) => void
  onOutline?: (outline: unknown) => void
  onDeckQuality?: (quality: unknown) => void
  onError?: (message: string) => void
  onReady?: (payload: GenerationReadyPayload) => void | Promise<void>
  onEmpty?: (message: string) => void
}

export interface GenerationStreamResult {
  ok: boolean
  slides: SlideData[]
  mode: GenerationMode | null
  error?: string
}

function isUsableSlide(slide: unknown): slide is SlideData {
  return !!slide && typeof slide === 'object' && !!(slide as SlideData).type && !!(slide as SlideData).title
}

async function emitReady(
  callbacks: GenerationStreamCallbacks,
  payload: GenerationReadyPayload,
): Promise<void> {
  callbacks.onSlides?.(payload.slides)
  await callbacks.onReady?.(payload)
}

export async function consumeGenerationStream(
  response: Response,
  callbacks: GenerationStreamCallbacks,
): Promise<GenerationStreamResult> {
  const reader = response.body?.getReader()
  if (!reader) {
    const error = 'No response stream'
    callbacks.onError?.(error)
    return { ok: false, slides: [], mode: null, error }
  }

  const decoder = new TextDecoder()
  let accumulated = ''
  let isParallelMode = false
  let parallelSlides: SlideData[] = []
  let slidesFinalized = false
  let finalSlides: SlideData[] = []
  let finalMode: GenerationMode | null = null

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6)
      if (payload === '[DONE]') continue

      try {
        const event = JSON.parse(payload)

        if (event.hint) {
          callbacks.onHint?.(event.hint)
          continue
        }

        if (event.outline && Array.isArray(event.outline)) {
          isParallelMode = true
          parallelSlides = event.outline as SlideData[]
        } else if (event.outline) {
          callbacks.onOutline?.(event.outline)
        } else if (event.batch && typeof event.startIndex === 'number') {
          isParallelMode = true
          const batch = event.batch as SlideData[]
          for (let i = 0; i < batch.length; i++) {
            parallelSlides[event.startIndex + i] = batch[i]
          }
          callbacks.onSlides?.([...parallelSlides])
        } else if (event.slidesReady && isParallelMode && !slidesFinalized) {
          slidesFinalized = true
          finalSlides = parallelSlides.filter(isUsableSlide)
          finalMode = 'parallel'
          await emitReady(callbacks, { slides: finalSlides, mode: finalMode })
        } else if (event.document) {
          callbacks.onDocument?.(event.document)
        } else if (event.deckQuality) {
          callbacks.onDeckQuality?.(event.deckQuality)
        } else if (event.error) {
          const error = String(event.error)
          callbacks.onError?.(error)
          return { ok: false, slides: finalSlides, mode: finalMode, error }
        } else if (event.text) {
          accumulated += event.text
        } else if (event.content) {
          accumulated += event.content
        }
      } catch {
        accumulated += payload
      }
    }

    if (!isParallelMode && accumulated) {
      const parsed = parseIncrementalSlides(accumulated)
      if (parsed.length > 0) callbacks.onSlides?.(parsed)
    }
  }

  if (isParallelMode && !slidesFinalized) {
    finalSlides = parallelSlides.filter(isUsableSlide)
    if (finalSlides.length > 0) {
      finalMode = 'parallel'
      await emitReady(callbacks, { slides: finalSlides, mode: finalMode })
      return { ok: true, slides: finalSlides, mode: finalMode }
    }

    const error = 'Generation did not produce slides. Please try again.'
    callbacks.onEmpty?.(error)
    return { ok: false, slides: [], mode: 'parallel', error }
  }

  if (!isParallelMode) {
    const result = parseFinalResult(accumulated)
    if (result.slides.length > 0) {
      finalSlides = result.slides
      finalMode = 'sequential'
      await emitReady(callbacks, { slides: finalSlides, mode: finalMode, document: result.document })
      return { ok: true, slides: finalSlides, mode: finalMode }
    }

    const error = 'Could not parse slides from the response. Please try again.'
    callbacks.onEmpty?.(error)
    return { ok: false, slides: [], mode: 'sequential', error }
  }

  return { ok: true, slides: finalSlides, mode: finalMode }
}
