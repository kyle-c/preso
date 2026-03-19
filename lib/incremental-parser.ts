/**
 * Incremental JSON parser for streaming slide + document generation.
 *
 * Handles two response formats:
 * 1. New: { "slides": [...], "document": {...} }
 * 2. Legacy: [ slide, slide, ... ]
 *
 * Slides are extracted incrementally as they stream in.
 * The document is extracted from the final accumulated text.
 */

import type { SlideData } from '@/components/studio/slide-renderer'
import type { PresentationDocument } from '@/lib/studio-db'

export interface ParseResult {
  slides: SlideData[]
  document: PresentationDocument | null
}

/**
 * Find the first `[` that starts the slides array.
 * In the new format, this is after `"slides":`.
 * In the legacy format, it's the very first `[`.
 */
function findSlidesArrayStart(text: string): number {
  // Try to find "slides" key first (new format)
  const slidesKeyMatch = text.match(/"slides"\s*:\s*\[/)
  if (slidesKeyMatch && slidesKeyMatch.index !== undefined) {
    return text.indexOf('[', slidesKeyMatch.index)
  }
  // Fallback: first `[` (legacy format)
  return text.indexOf('[')
}

/**
 * Extract individual slide objects from a (possibly incomplete) JSON array.
 */
function extractSlides(text: string, arrayStart: number): SlideData[] {
  const slides: SlideData[] = []
  let depth = 0
  let objStart = -1
  let inString = false
  let escaped = false

  for (let i = arrayStart + 1; i < text.length; i++) {
    const ch = text[i]
    if (escaped) { escaped = false; continue }
    if (ch === '\\') { escaped = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{') {
      if (depth === 0) objStart = i
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0 && objStart >= 0) {
        try {
          const slide = JSON.parse(text.slice(objStart, i + 1))
          if (slide.type && slide.title) slides.push(slide)
        } catch { /* incomplete object */ }
        objStart = -1
      }
    } else if (ch === ']' && depth === 0) {
      // End of slides array
      break
    }
  }

  return slides
}

/**
 * Try to extract the document object from the accumulated text.
 * Looks for "document": { ... } in the JSON.
 */
function extractDocument(text: string): PresentationDocument | null {
  const docKeyMatch = text.match(/"document"\s*:\s*\{/)
  if (!docKeyMatch || docKeyMatch.index === undefined) return null

  const start = text.indexOf('{', docKeyMatch.index)
  if (start === -1) return null

  // Find the matching closing brace
  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (escaped) { escaped = false; continue }
    if (ch === '\\') { escaped = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        try {
          const doc = JSON.parse(text.slice(start, i + 1))
          if (doc.title && doc.sections) return doc as PresentationDocument
        } catch { /* incomplete */ }
        return null
      }
    }
  }

  return null
}

/**
 * Parse slides incrementally from streaming text.
 * Call this on every chunk to get the latest slides.
 */
export function parseIncrementalSlides(text: string): SlideData[] {
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '')
  const start = findSlidesArrayStart(clean)
  if (start === -1) return []
  return extractSlides(clean, start)
}

/**
 * Parse both slides and document from the final accumulated text.
 * Call this once generation is complete.
 */
export function parseFinalResult(text: string): ParseResult {
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '')
  let slides = parseIncrementalSlides(text)
  const document = extractDocument(clean)

  // Post-generation validation + auto-fix
  if (slides.length > 0) {
    try {
      const { validateSlides } = require('./slide-validator')
      const result = validateSlides(slides)
      if (result.issues.length > 0) {
        console.log(`[slide-validator] ${result.issues.length} issues found:`, result.issues.map((i: any) => i.message))
      }
      if (result.fixedSlides) {
        console.log('[slide-validator] Auto-fixes applied')
        slides = result.fixedSlides
      }
    } catch (_e) { /* validator not critical */ }
  }

  return { slides, document }
}
