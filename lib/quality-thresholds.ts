/**
 * Quality thresholds — single source of truth.
 *
 * All density/count constants AND per-slide-type slot definitions live here.
 * Coach, validator, and layout engine import from this file.
 *
 * The slot definitions (SLOT_LIMITS) are the hard enforcement layer.
 * The layout engine truncates any content exceeding these limits and
 * moves overflow to speaker notes. This guarantees slides-grab-like
 * density regardless of what the LLM generates.
 */

// ── Total slide word counts (title + subtitle + body + bullets + cards + columns) ──
export const MIN_SLIDE_WORDS_ERROR = 20     // error: critically thin
export const MIN_SLIDE_WORDS_WARNING = 30   // warning: below target density
export const MAX_SLIDE_WORDS_WARNING = 80   // warning: getting dense
export const MAX_SLIDE_WORDS_ERROR = 100    // error: too dense for presentation

// ── Per-field minimums ──
export const MIN_BODY_WORDS = 10            // content slide body minimum
export const MIN_CARD_BODY_WORDS = 8        // card body minimum
export const MAX_CARD_BODY_WORDS = 25       // card body maximum (before it's a paragraph)
export const MIN_BULLET_WORDS = 5           // single bullet minimum (complete thought)
export const MIN_AVG_BULLET_WORDS = 6       // average across all bullets
export const MIN_COLUMN_WORDS = 8           // per-column minimum

// ── Body text density (layout engine truncation) ──
export const MAX_BODY_WORDS_TRUNCATE = 60   // layout engine truncates above this
export const BODY_TRUNCATE_TARGET = 40      // truncation target word count

// ── Card counts ──
export const VALID_CARD_COUNTS = new Set([2, 3, 4, 6])

// ── Title length ──
export const MAX_COVER_TITLE_WORDS = 6
export const MAX_CONTENT_TITLE_WORDS = 12

// ── Deck-level ──
export const MIN_SLIDE_TYPE_VARIETY = 4     // minimum different types in a deck
export const MIN_ILLUSTRATION_PERCENT = 0.25 // 25% of slides should have illustrations

// ── Content slot definitions (renderer-enforced hard caps) ──
// Overflow beyond these limits is moved to speaker notes automatically.

export interface SlotLimits {
  maxTotalWords: number      // hard cap on all visible content
  maxBodyWords: number       // body field
  maxBullets: number         // bullet count
  maxBulletWords: number     // per-bullet word limit
  maxCards: number           // card count
  maxCardBodyWords: number   // per-card body word limit
  maxColumnWords: number     // per-column word limit
  maxQuoteWords: number      // quote text word limit
}

export const SLOT_LIMITS: Record<string, SlotLimits> = {
  title:      { maxTotalWords: 25,  maxBodyWords: 0,   maxBullets: 0, maxBulletWords: 0,  maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 0  },
  closing:    { maxTotalWords: 30,  maxBodyWords: 20,  maxBullets: 0, maxBulletWords: 0,  maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 0  },
  section:    { maxTotalWords: 15,  maxBodyWords: 0,   maxBullets: 0, maxBulletWords: 0,  maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 0  },
  quote:      { maxTotalWords: 30,  maxBodyWords: 0,   maxBullets: 0, maxBulletWords: 0,  maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 20 },
  image:      { maxTotalWords: 25,  maxBodyWords: 12,  maxBullets: 0, maxBulletWords: 0,  maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 0  },
  content:    { maxTotalWords: 50,  maxBodyWords: 40,  maxBullets: 0, maxBulletWords: 0,  maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 0  },
  bullets:    { maxTotalWords: 65,  maxBodyWords: 15,  maxBullets: 5, maxBulletWords: 12, maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 0  },
  cards:      { maxTotalWords: 70,  maxBodyWords: 0,   maxBullets: 0, maxBulletWords: 0,  maxCards: 4, maxCardBodyWords: 15, maxColumnWords: 0,  maxQuoteWords: 0  },
  'two-column': { maxTotalWords: 65, maxBodyWords: 12, maxBullets: 3, maxBulletWords: 12, maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 30, maxQuoteWords: 0  },
  chart:      { maxTotalWords: 30,  maxBodyWords: 20,  maxBullets: 0, maxBulletWords: 0,  maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 0  },
  checklist:  { maxTotalWords: 65,  maxBodyWords: 12,  maxBullets: 7, maxBulletWords: 10, maxCards: 0, maxCardBodyWords: 0,  maxColumnWords: 0,  maxQuoteWords: 0  },
}

// Fallback for unknown slide types
export const DEFAULT_SLOT_LIMITS: SlotLimits = {
  maxTotalWords: 65, maxBodyWords: 40, maxBullets: 5, maxBulletWords: 12,
  maxCards: 4, maxCardBodyWords: 15, maxColumnWords: 30, maxQuoteWords: 20,
}
