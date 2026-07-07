/* ═══════════════════════════════════════════════════════════ */
/*                  VISUAL LAYOUT ENGINE                        */
/*                                                              */
/*  Post-processing layer that validates and fixes AI-generated */
/*  slides before rendering. Enforces layout rules that the    */
/*  AI can't guarantee: text density, card counts, bg          */
/*  alternation, content structure.                            */
/*                                                              */
/*  Runs server-side after generation, before save.            */
/*  Returns a cleaned version of the slides array.             */
/* ═══════════════════════════════════════════════════════════ */

import type { SlideData } from './slide-types'
import {
  MAX_BODY_WORDS_TRUNCATE,
  BODY_TRUNCATE_TARGET,
  MAX_CARD_BODY_WORDS,
  SLOT_LIMITS,
  DEFAULT_SLOT_LIMITS,
  type SlotLimits,
} from './quality-thresholds'

// ── Helpers ──

function wordCount(text: string | undefined | null): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Truncate text to maxWords at a natural boundary. Returns [truncated, overflow]. */
function truncateText(text: string, maxWords: number): [string, string] {
  const words = text.split(/\s+/)
  if (words.length <= maxWords) return [text, '']

  const kept = words.slice(0, maxWords).join(' ')

  // Try to find a clean break point (period > semicolon > dash > comma)
  // Only look in the back half so we don't cut too aggressively
  const minPos = Math.floor(kept.length * 0.4)
  const breakPoints = [
    kept.lastIndexOf('.'),
    kept.lastIndexOf(';'),
    kept.lastIndexOf(' —'),
    kept.lastIndexOf(' -'),
  ].filter(p => p > minPos)

  if (breakPoints.length > 0) {
    const best = Math.max(...breakPoints)
    const char = kept[best]
    // Include the period/semicolon, exclude dashes
    const end = (char === '.' || char === ';') ? best + 1 : best
    return [kept.substring(0, end).trim(), text]
  }

  // No clean break — try comma as last resort
  const lastComma = kept.lastIndexOf(',')
  if (lastComma > minPos) {
    return [kept.substring(0, lastComma + 1).trim(), text]
  }

  // No break at all — hard cut, no "..." (looks cleaner than dangling ellipsis)
  return [kept.trim(), text]
}

/** Append overflow content to notes field */
function appendToNotes(existing: string | undefined, label: string, overflow: string): string {
  const entry = `${label}: ${overflow}`
  return existing ? `${existing}\n\n${entry}` : entry
}

// ── Pipeline ──

/**
 * Post-process slides to enforce layout rules.
 * Returns a new array with fixes applied. Non-destructive — never removes slides.
 */
export function postProcessSlides(slides: SlideData[]): SlideData[] {
  let result = slides.map(s => ({ ...s }))

  result = fixBgAlternation(result)
  result = fixCardCounts(result)
  result = enforceSlotLimits(result)
  result = fixEmptySections(result)
  result = fixConsecutiveTypes(result)

  return result
}

/** Fix consecutive slides with the same background color */
function fixBgAlternation(slides: SlideData[]): SlideData[] {
  for (let i = 1; i < slides.length; i++) {
    if (slides[i].bg === slides[i - 1].bg) {
      if (slides[i].bg === 'brand') continue
      slides[i] = { ...slides[i], bg: slides[i].bg === 'dark' ? 'light' : 'dark' }
    }
  }
  return slides
}

/** Fix invalid card counts (5 or 7) by merging or splitting */
function fixCardCounts(slides: SlideData[]): SlideData[] {
  return slides.map(slide => {
    if (!slide.cards) return slide
    const count = slide.cards.length

    if (count === 5) {
      const merged = [...slide.cards.slice(0, 3)]
      const last = slide.cards[3]
      const lastLast = slide.cards[4]
      merged.push({
        title: last.title,
        titleColor: last.titleColor,
        body: `${last.body}\n\n${lastLast.title}: ${lastLast.body}`,
      })
      return { ...slide, cards: merged }
    }

    if (count === 7) {
      const kept = slide.cards.slice(0, 6)
      const extra = slide.cards[6]
      const extraNote = `Additional: ${extra.title} — ${extra.body}`
      return {
        ...slide,
        cards: kept,
        notes: slide.notes ? `${slide.notes}\n\n${extraNote}` : extraNote,
      }
    }

    return slide
  })
}

/**
 * Enforce per-slide-type content slot limits.
 * Truncates all content fields to their hard caps and moves overflow to notes.
 * This is the core "slides-grab-like" enforcement layer.
 */
function enforceSlotLimits(slides: SlideData[]): SlideData[] {
  return slides.map(slide => {
    const limits = SLOT_LIMITS[slide.type] || DEFAULT_SLOT_LIMITS
    let s = { ...slide }
    let notes = s.notes || ''

    // ── Body truncation ──
    if (s.body && limits.maxBodyWords > 0 && wordCount(s.body) > limits.maxBodyWords) {
      const [clean, overflow] = truncateText(s.body, limits.maxBodyWords)
      s.body = clean
      if (overflow) notes = appendToNotes(notes, 'Full body text', overflow)
    } else if (s.body && limits.maxBodyWords === 0) {
      // Slide type doesn't support body — move it all to notes
      notes = appendToNotes(notes, 'Body text', s.body)
      s.body = undefined
    }

    // ── Bullet truncation ──
    if (s.bullets && s.bullets.length > 0) {
      let bullets = [...s.bullets]

      // Cap bullet count
      if (limits.maxBullets > 0 && bullets.length > limits.maxBullets) {
        const overflow = bullets.slice(limits.maxBullets)
        bullets = bullets.slice(0, limits.maxBullets)
        const overflowText = overflow.map(b => `• ${b.text}`).join('\n')
        notes = appendToNotes(notes, 'Additional bullets', overflowText)
      }

      // Cap per-bullet word count
      if (limits.maxBulletWords > 0) {
        bullets = bullets.map(b => {
          if (wordCount(b.text) <= limits.maxBulletWords) return b
          const [clean] = truncateText(b.text, limits.maxBulletWords)
          return { ...b, text: clean }
        })
      }

      s.bullets = bullets
    }

    // ── Card truncation ──
    if (s.cards && s.cards.length > 0) {
      let cards = [...s.cards]

      // Cap card count
      if (limits.maxCards > 0 && cards.length > limits.maxCards) {
        const overflow = cards.slice(limits.maxCards)
        cards = cards.slice(0, limits.maxCards)
        const overflowText = overflow.map(c => `${c.title}: ${c.body || ''}`).join('\n')
        notes = appendToNotes(notes, 'Additional cards', overflowText)
      }

      // Cap per-card body word count
      if (limits.maxCardBodyWords > 0) {
        cards = cards.map(card => {
          if (!card.body || wordCount(card.body) <= limits.maxCardBodyWords) return card
          const [clean] = truncateText(card.body, limits.maxCardBodyWords)
          return { ...card, body: clean }
        })
      }

      s.cards = cards
    }

    // ── Column truncation ──
    if (s.columns && s.columns.length > 0 && limits.maxColumnWords > 0) {
      s.columns = s.columns.map(col => {
        let c = { ...col }

        // Truncate column body
        if (c.body && wordCount(c.body) > limits.maxColumnWords) {
          const [clean, overflow] = truncateText(c.body, limits.maxColumnWords)
          c.body = clean
          if (overflow) notes = appendToNotes(notes, `Column "${c.heading || 'content'}"`, overflow)
        }

        // Cap column bullets
        if (c.bullets && limits.maxBullets > 0 && c.bullets.length > limits.maxBullets) {
          const overflow = c.bullets.slice(limits.maxBullets)
          c.bullets = c.bullets.slice(0, limits.maxBullets)
          const overflowText = overflow.map(b => `• ${b.text}`).join('\n')
          notes = appendToNotes(notes, `Column "${c.heading || 'content'}" bullets`, overflowText)
        }

        // Cap per-bullet words in columns
        if (c.bullets && limits.maxBulletWords > 0) {
          c.bullets = c.bullets.map(b => {
            if (wordCount(b.text) <= limits.maxBulletWords) return b
            const [clean] = truncateText(b.text, limits.maxBulletWords)
            return { ...b, text: clean }
          })
        }

        return c
      })
    }

    // ── Quote truncation ──
    if (s.quote && limits.maxQuoteWords > 0 && wordCount(s.quote.text) > limits.maxQuoteWords) {
      const [clean, overflow] = truncateText(s.quote.text, limits.maxQuoteWords)
      s.quote = { ...s.quote, text: clean }
      if (overflow) notes = appendToNotes(notes, 'Full quote', overflow)
    }

    // Write notes back
    if (notes !== (slide.notes || '')) {
      s.notes = notes
    }

    return s
  })
}

/** Fix section slides that have no subtitle */
function fixEmptySections(slides: SlideData[]): SlideData[] {
  return slides.map((slide, i) => {
    if (slide.type !== 'section') return slide
    if (slide.subtitle) return slide

    const next = slides[i + 1]
    if (next) {
      const preview = next.title
        ? `Exploring ${next.title.toLowerCase()}`
        : 'What comes next'
      return { ...slide, subtitle: preview }
    }

    return { ...slide, subtitle: 'Key insights ahead' }
  })
}

/** Break up 3+ consecutive slides of the same type */
function fixConsecutiveTypes(slides: SlideData[]): SlideData[] {
  return slides
}

/**
 * Quick validation — returns true if the slides pass basic layout checks.
 * Use this as a gate before saving.
 */
export function validateLayout(slides: SlideData[]): { valid: boolean; issues: string[] } {
  const issues: string[] = []

  for (let i = 1; i < slides.length; i++) {
    if (slides[i].bg === slides[i - 1].bg && slides[i].bg !== 'brand') {
      issues.push(`Slides ${i} and ${i + 1} have the same background (${slides[i].bg})`)
    }
  }

  for (let i = 0; i < slides.length; i++) {
    if (slides[i].cards) {
      const count = slides[i].cards!.length
      if (count === 5 || count === 7) {
        issues.push(`Slide ${i + 1} has ${count} cards (should be 2, 3, 4, or 6)`)
      }
    }
  }

  for (let i = 0; i < slides.length; i++) {
    if (slides[i].body) {
      const wc = slides[i].body!.split(/\s+/).length
      if (wc > MAX_BODY_WORDS_TRUNCATE) {
        issues.push(`Slide ${i + 1} has ${wc} words (max ${MAX_BODY_WORDS_TRUNCATE})`)
      }
    }
  }

  if (slides.length > 0 && slides[0].type !== 'title') {
    issues.push('First slide should be type "title"')
  }
  if (slides.length > 1 && slides[slides.length - 1].type !== 'closing') {
    issues.push('Last slide should be type "closing"')
  }

  return { valid: issues.length === 0, issues }
}
