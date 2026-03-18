import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { getPresentation, updatePresentation } from '@/lib/studio-db'
import {
  extractTexts,
  extractDocumentTexts,
  TRANSLATION_LOCALES,
  type TranslationMap,
  type PresentationTranslations,
} from '@/lib/slide-translations'

export const maxDuration = 120

const LANG_MAP: Record<string, string> = { 'es-MX': 'es', 'pt-BR': 'pt' }
const LANG_NAMES: Record<string, string> = { 'es-MX': 'Mexican Spanish', 'pt-BR': 'Brazilian Portuguese' }
const MAX_CHARS = 4000

// ---------------------------------------------------------------------------
// Google Translate (batched with separator)
// ---------------------------------------------------------------------------

async function batchTranslate(texts: string[], tl: string): Promise<string[]> {
  const SEP = '\n§\n'
  const joined = texts.join(SEP)

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(joined)}`,
    )
    const data = await res.json()
    const full = (data[0] as [string, ...unknown[]][]).map(s => s[0]).join('')
    const parts = full.split(/\n?§\n?/)
    if (parts.length === texts.length) {
      return parts.map(p => p.trim())
    }
  } catch {}

  // Fallback: individual calls (slower but reliable)
  return Promise.all(
    texts.map(async (text) => {
      try {
        const r = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`,
        )
        const d = await r.json()
        return (d[0] as [string, ...unknown[]][])?.map(s => s[0]).join('') ?? text
      } catch {
        return text
      }
    }),
  )
}

async function translateTexts(texts: string[], locale: string): Promise<TranslationMap> {
  if (!texts.length) return {}
  const tl = LANG_MAP[locale]
  if (!tl) return {}

  // Chunk texts to stay under Google's URL limit
  const chunks: string[][] = []
  let chunk: string[] = []
  let len = 0

  for (const t of texts) {
    const overhead = t.length + 4
    if (len + overhead > MAX_CHARS && chunk.length > 0) {
      chunks.push(chunk)
      chunk = []
      len = 0
    }
    chunk.push(t)
    len += overhead
  }
  if (chunk.length) chunks.push(chunk)

  const results = await Promise.all(chunks.map(c => batchTranslate(c, tl)))
  const flat = results.flat()

  const map: TranslationMap = {}
  texts.forEach((t, i) => {
    if (flat[i] && flat[i] !== t) {
      map[t] = flat[i]
    }
  })
  return map
}

// ---------------------------------------------------------------------------
// POST: Trigger translation for a presentation
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { presentationId } = await req.json()
    if (!presentationId) {
      return NextResponse.json({ error: 'Missing presentationId' }, { status: 400 })
    }

    const pres = await getPresentation(presentationId)
    if (!pres || pres.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Collect all unique translatable text
    const slideTexts = extractTexts(pres.slides ?? [])
    const docTexts = extractDocumentTexts(pres.document)
    const allTexts = [...new Set([...slideTexts, ...docTexts])]

    if (allTexts.length === 0) {
      return NextResponse.json({ ok: true, translations: {} })
    }

    // Translate to all target locales in parallel
    const translations: PresentationTranslations = {}
    await Promise.all(
      TRANSLATION_LOCALES.map(async (locale) => {
        translations[locale] = await translateTexts(allTexts, locale)
      }),
    )

    // Store translations on the presentation
    await updatePresentation(presentationId, { translations } as any)

    return NextResponse.json({ ok: true, translationCounts: {
      'es-MX': Object.keys(translations['es-MX'] ?? {}).length,
      'pt-BR': Object.keys(translations['pt-BR'] ?? {}).length,
    }})
  } catch (err) {
    console.error('[studio/translate]', err)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
