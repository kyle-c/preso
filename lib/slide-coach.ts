/* ═══════════════════════════════════════════════════════════ */
/*                      SLIDE COACH                            */
/*                                                              */
/*  Rules-based quality checker that reviews generated slides   */
/*  and flags issues. Runs client-side, no LLM calls needed.  */
/*  Returns actionable suggestions per slide.                  */
/* ═══════════════════════════════════════════════════════════ */

import { countWords } from './slide-utils'
import {
  MAX_COVER_TITLE_WORDS,
  MAX_CONTENT_TITLE_WORDS,
  MAX_SLIDE_WORDS_WARNING,
  MAX_SLIDE_WORDS_ERROR,
  MAX_CARD_BODY_WORDS,
  MIN_SLIDE_WORDS_ERROR,
  MIN_SLIDE_WORDS_WARNING,
} from './quality-thresholds'

export interface CoachSuggestion {
  slideIndex: number
  severity: 'info' | 'warning' | 'error'
  rule: string
  message: string
  fix?: string
}

interface SlideInput {
  type: string
  bg: string
  title: string
  subtitle?: string
  body?: string
  bullets?: { text: string }[]
  cards?: { title: string; body: string }[]
  columns?: { heading?: string; body?: string; bullets?: { text: string }[] }[]
  imageUrl?: string
  chart?: any
  notes?: string
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

export function totalSlideWords(slide: SlideInput): number {
  let count = countWords(slide.title) + countWords(slide.subtitle) + countWords(slide.body)
  for (const b of slide.bullets || []) count += countWords(b.text)
  for (const c of slide.cards || []) count += countWords(c.title) + countWords(c.body)
  for (const col of slide.columns || []) {
    count += countWords(col.heading) + countWords(col.body)
    for (const b of col.bullets || []) count += countWords(b.text)
  }
  return count
}

export function analyzeSlides(slides: SlideInput[]): CoachSuggestion[] {
  const suggestions: CoachSuggestion[] = []

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    const prevSlide = i > 0 ? slides[i - 1] : null

    // ── Title length ──
    const titleWords = countWords(slide.title)
    if (slide.type === 'title' && titleWords > MAX_COVER_TITLE_WORDS) {
      suggestions.push({
        slideIndex: i, severity: 'warning', rule: 'title-length',
        message: `Cover title is ${titleWords} words — aim for ${MAX_COVER_TITLE_WORDS} or fewer for impact.`,
        fix: 'Shorten to a punchy headline. Move details to the subtitle.',
      })
    } else if (titleWords > MAX_CONTENT_TITLE_WORDS) {
      suggestions.push({
        slideIndex: i, severity: 'info', rule: 'title-length',
        message: `Title is ${titleWords} words — consider tightening for scannability.`,
      })
    }

    // ── Word density ──
    const wordCount = totalSlideWords(slide)
    if (wordCount > MAX_SLIDE_WORDS_ERROR) {
      suggestions.push({
        slideIndex: i, severity: 'error', rule: 'word-density',
        message: `This slide has ${wordCount} words — too dense for a presentation.`,
        fix: 'Split into two slides, or convert dense text to bullet points or a chart.',
      })
    } else if (wordCount > MAX_SLIDE_WORDS_WARNING) {
      suggestions.push({
        slideIndex: i, severity: 'warning', rule: 'word-density',
        message: `${wordCount} words on this slide — consider reducing for clarity.`,
        fix: 'Remove filler words, or move secondary points to speaker notes.',
      })
    }

    // ── Card count ──
    if (slide.cards) {
      const count = slide.cards.length
      if (count === 5 || count === 7) {
        suggestions.push({
          slideIndex: i, severity: 'error', rule: 'card-count',
          message: `${count} cards creates an orphaned bottom row.`,
          fix: count === 5 ? 'Use 4 or 6 cards for a clean grid.' : 'Use 6 cards or split into two slides.',
        })
      }
      // Card body density
      for (const card of slide.cards) {
        if (countWords(card.body) > MAX_CARD_BODY_WORDS) {
          suggestions.push({
            slideIndex: i, severity: 'warning', rule: 'card-density',
            message: `Card "${card.title}" has ${countWords(card.body)} words — cards should be 20-${MAX_CARD_BODY_WORDS} words.`,
            fix: 'Use structured format: 1 bold sentence + 2-3 short bullet points.',
          })
        }
      }
    }

    // ── Consecutive same background ──
    if (prevSlide && slide.bg === prevSlide.bg) {
      suggestions.push({
        slideIndex: i, severity: 'warning', rule: 'bg-alternation',
        message: `Same background color as previous slide (${slide.bg}).`,
        fix: 'Alternate dark and light backgrounds for visual rhythm.',
      })
    }

    // ── Consecutive same type ──
    if (i >= 2 && slides[i].type === slides[i-1].type && slides[i-1].type === slides[i-2].type) {
      suggestions.push({
        slideIndex: i, severity: 'info', rule: 'type-variety',
        message: `Three consecutive ${slide.type} slides — consider varying the layout.`,
        fix: 'Use a different slide type (cards, two-column, quote) to break the pattern.',
      })
    }

    // ── Missing illustration streak ──
    if (i >= 3) {
      const streak = [slides[i], slides[i-1], slides[i-2], slides[i-3]]
      if (streak.every(s => !s.imageUrl)) {
        suggestions.push({
          slideIndex: i, severity: 'info', rule: 'illustration-variety',
          message: '4 consecutive slides without an illustration.',
          fix: 'Add an illustration to at least one of these slides for visual interest.',
        })
      }
    }

    // ── Data as text instead of chart ──
    const bodyText = (slide.body || '') + (slide.bullets?.map(b => b.text).join(' ') || '')
    const numberMatches = bodyText.match(/\d+(\.\d+)?%|\$[\d,.]+|\d+x|\d{2,}/g)
    if (numberMatches && numberMatches.length >= 3 && !slide.chart) {
      suggestions.push({
        slideIndex: i, severity: 'info', rule: 'data-viz',
        message: `${numberMatches.length} numbers in text — this might work better as a chart.`,
        fix: 'Consider a bar chart, line chart, or metric cards instead of inline numbers.',
      })
    }

    // ── Missing notes ──
    if (!slide.notes) {
      suggestions.push({
        slideIndex: i, severity: 'info', rule: 'missing-notes',
        message: 'No speaker notes on this slide.',
      })
    }

    // ── Thin content ──
    if (!['title', 'section', 'closing', 'image', 'quote', 'chart'].includes(slide.type)) {
      if (wordCount < MIN_SLIDE_WORDS_ERROR) {
        suggestions.push({
          slideIndex: i, severity: 'error', rule: 'thin-content',
          message: `Only ${wordCount} words — this slide needs more substance.`,
          fix: `Add specific details, data points, examples, or actionable items. Every content slide should have at least ${MIN_SLIDE_WORDS_WARNING} words.`,
        })
      } else if (wordCount < MIN_SLIDE_WORDS_WARNING) {
        suggestions.push({
          slideIndex: i, severity: 'warning', rule: 'thin-content',
          message: `Only ${wordCount} words — could use more detail.`,
          fix: `Add supporting details or context. Aim for at least ${MIN_SLIDE_WORDS_WARNING} words of visible content.`,
        })
      }
    }

    // ── Bullet count ──
    if (slide.bullets && slide.bullets.length > 7) {
      suggestions.push({
        slideIndex: i, severity: 'warning', rule: 'bullet-count',
        message: `${slide.bullets.length} bullet points — too many for one slide.`,
        fix: 'Keep 4-6 bullets max. Split into two slides or group into categories.',
      })
    }
  }

  return suggestions
}

/** Summarize coach results */
export function coachSummary(suggestions: CoachSuggestion[]): { errors: number; warnings: number; info: number; score: number } {
  const errors = suggestions.filter(s => s.severity === 'error').length
  const warnings = suggestions.filter(s => s.severity === 'warning').length
  const info = suggestions.filter(s => s.severity === 'info').length
  // Score: start at 100, deduct for issues
  const score = Math.max(0, Math.min(100, 100 - errors * 15 - warnings * 5 - info * 1))
  return { errors, warnings, info, score }
}
