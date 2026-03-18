// ---------------------------------------------------------------------------
// Slide-level translation: extract texts, translate, store map
// ---------------------------------------------------------------------------

import type { Locale } from '@/components/slide-translation'

export const TRANSLATION_LOCALES: Locale[] = ['es-MX', 'pt-BR']

/** A flat map from original text → translated text for a given locale */
export type TranslationMap = Record<string, string>

/** All translations stored on a presentation */
export type PresentationTranslations = Partial<Record<Locale, TranslationMap>>

// ---------------------------------------------------------------------------
// Extract all translatable strings from slides
// ---------------------------------------------------------------------------

export function extractTexts(slides: any[]): string[] {
  const texts = new Set<string>()

  function add(v: unknown) {
    if (typeof v === 'string' && v.trim().length >= 2) {
      texts.add(v.trim())
    }
  }

  for (const slide of slides) {
    if (!slide) continue
    add(slide.title)
    add(slide.subtitle)
    add(slide.body)
    add(slide.badge)
    add(slide.imageCaption)
    add(slide.notes)

    if (Array.isArray(slide.bullets)) {
      for (const b of slide.bullets) {
        add(b?.text)
      }
    }
    if (Array.isArray(slide.cards)) {
      for (const c of slide.cards) {
        add(c?.title)
        add(c?.body)
      }
    }
    if (Array.isArray(slide.columns)) {
      for (const col of slide.columns) {
        add(col?.heading)
        add(col?.body)
        if (Array.isArray(col?.bullets)) {
          for (const b of col.bullets) {
            add(b?.text)
          }
        }
      }
    }
    if (slide.quote) {
      add(slide.quote.text)
      add(slide.quote.attribution)
    }
    if (slide.chart) {
      add(slide.chart.yLabel)
      add(slide.chart.xLabel)
    }
  }

  return [...texts]
}

// ---------------------------------------------------------------------------
// Extract translatable strings from a document
// ---------------------------------------------------------------------------

export function extractDocumentTexts(doc: any): string[] {
  if (!doc) return []
  const texts = new Set<string>()

  function add(v: unknown) {
    if (typeof v === 'string' && v.trim().length >= 2) {
      texts.add(v.trim())
    }
  }

  add(doc.title)
  add(doc.summary)

  if (Array.isArray(doc.sections)) {
    for (const section of doc.sections) {
      add(section.title)
      // Split markdown content into translatable paragraphs
      if (typeof section.content === 'string') {
        const paragraphs = section.content.split(/\n\n+/)
        for (const p of paragraphs) {
          const trimmed = p.trim()
          if (trimmed.length >= 2) texts.add(trimmed)
        }
      }
    }
  }

  return [...texts]
}

// ---------------------------------------------------------------------------
// Apply translation map to slides (returns new translated slide array)
// ---------------------------------------------------------------------------

export function applyTranslations(slides: any[], map: TranslationMap): any[] {
  function t(v: unknown): any {
    if (typeof v === 'string') {
      return map[v.trim()] ?? v
    }
    return v
  }

  return slides.map(slide => {
    if (!slide) return slide
    const out = { ...slide }
    if (out.title) out.title = t(out.title)
    if (out.subtitle) out.subtitle = t(out.subtitle)
    if (out.body) out.body = t(out.body)
    if (out.badge) out.badge = t(out.badge)
    if (out.imageCaption) out.imageCaption = t(out.imageCaption)
    if (out.notes) out.notes = t(out.notes)

    if (Array.isArray(out.bullets)) {
      out.bullets = out.bullets.map((b: any) => ({ ...b, text: t(b.text) }))
    }
    if (Array.isArray(out.cards)) {
      out.cards = out.cards.map((c: any) => ({ ...c, title: t(c.title), body: t(c.body) }))
    }
    if (Array.isArray(out.columns)) {
      out.columns = out.columns.map((col: any) => ({
        ...col,
        heading: t(col.heading),
        body: t(col.body),
        bullets: Array.isArray(col.bullets)
          ? col.bullets.map((b: any) => ({ ...b, text: t(b.text) }))
          : col.bullets,
      }))
    }
    if (out.quote) {
      out.quote = { ...out.quote, text: t(out.quote.text), attribution: t(out.quote.attribution) }
    }
    if (out.chart) {
      out.chart = { ...out.chart, yLabel: t(out.chart.yLabel), xLabel: t(out.chart.xLabel) }
    }
    return out
  })
}

// ---------------------------------------------------------------------------
// Apply translation map to a document
// ---------------------------------------------------------------------------

export function applyDocumentTranslations(doc: any, map: TranslationMap): any {
  if (!doc) return doc
  const out = { ...doc }

  function t(v: unknown): any {
    if (typeof v === 'string') return map[v.trim()] ?? v
    return v
  }

  out.title = t(out.title)
  out.summary = t(out.summary)

  if (Array.isArray(out.sections)) {
    out.sections = out.sections.map((section: any) => {
      const s = { ...section }
      s.title = t(s.title)
      if (typeof s.content === 'string') {
        // Translate paragraph-by-paragraph, preserving structure
        s.content = s.content
          .split(/\n\n+/)
          .map((p: string) => {
            const trimmed = p.trim()
            return map[trimmed] ?? p
          })
          .join('\n\n')
      }
      return s
    })
  }
  return out
}
