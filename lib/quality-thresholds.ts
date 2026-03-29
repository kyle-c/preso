/**
 * Quality thresholds — single source of truth.
 *
 * All density/count constants live here. Coach, validator, and layout engine
 * import from this file. System prompt references these same values.
 *
 * Aligned with SYSTEM_PROMPT content density rules:
 * - Every content slide: ≥50 words visible content
 * - Body text: 40-100 words for content slides
 * - Each bullet: ≥8 words
 * - Card body: ≥20 words
 * - Column content: ≥15 words each
 */

// ── Total slide word counts (title + subtitle + body + bullets + cards + columns) ──
export const MIN_SLIDE_WORDS_ERROR = 30     // error: critically thin
export const MIN_SLIDE_WORDS_WARNING = 50   // warning: below target density
export const MAX_SLIDE_WORDS_WARNING = 120  // warning: getting dense
export const MAX_SLIDE_WORDS_ERROR = 150    // error: too dense for presentation

// ── Per-field minimums ──
export const MIN_BODY_WORDS = 15            // content slide body minimum
export const MIN_CARD_BODY_WORDS = 15       // card body minimum (substantive content)
export const MAX_CARD_BODY_WORDS = 40       // card body maximum (before it's a paragraph)
export const MIN_BULLET_WORDS = 5           // single bullet minimum (complete thought)
export const MIN_AVG_BULLET_WORDS = 6       // average across all bullets
export const MIN_COLUMN_WORDS = 10          // per-column minimum

// ── Body text density (layout engine truncation) ──
export const MAX_BODY_WORDS_TRUNCATE = 120  // layout engine truncates above this
export const BODY_TRUNCATE_TARGET = 80      // truncation target word count

// ── Card counts ──
export const VALID_CARD_COUNTS = new Set([2, 3, 4, 6])

// ── Title length ──
export const MAX_COVER_TITLE_WORDS = 6
export const MAX_CONTENT_TITLE_WORDS = 12

// ── Deck-level ──
export const MIN_SLIDE_TYPE_VARIETY = 4     // minimum different types in a deck
export const MIN_ILLUSTRATION_PERCENT = 0.25 // 25% of slides should have illustrations
