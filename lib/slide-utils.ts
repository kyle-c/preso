/**
 * Shared slide utility functions.
 *
 * Single source of truth for word counting and text analysis
 * used across the quality pipeline: coach, validator, layout engine.
 */

/** Count words in a string. Returns 0 for undefined/empty. */
export function countWords(text: string | undefined | null): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}
