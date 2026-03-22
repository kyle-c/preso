import { analyzeSlides, coachSummary, type CoachSuggestion } from './slide-coach'
import { rateSlide } from './studio-db'

/* ═══════════════════════════════════════════════════════════ */
/*                  QUALITY FEEDBACK LOOP                      */
/*                                                              */
/*  Automatically promotes high-quality slides as exemplars    */
/*  and demotes low-quality slides as anti-exemplars based     */
/*  on Slide Coach analysis. Runs server-side after save.      */
/* ═══════════════════════════════════════════════════════════ */

/**
 * Run quality analysis on a presentation and auto-rate slides
 * based on Slide Coach results. Called after presentation save.
 *
 * Rules:
 * - Slides with 0 coach issues → auto-rate as exemplar (1)
 * - Slides with errors → auto-rate as anti-exemplar (-1)
 * - Slides with only info → no auto-rating (neutral)
 */
export async function autoRatePresentation(
  presId: string,
  slides: any[],
): Promise<{ promoted: number; demoted: number; score: number }> {
  const suggestions = analyzeSlides(slides)
  const summary = coachSummary(suggestions)

  // Group suggestions by slide
  const issuesBySlide = new Map<number, CoachSuggestion[]>()
  for (const s of suggestions) {
    const list = issuesBySlide.get(s.slideIndex) || []
    list.push(s)
    issuesBySlide.set(s.slideIndex, list)
  }

  let promoted = 0
  let demoted = 0

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    if (!slide || !slide.type || !slide.title) continue

    const issues = issuesBySlide.get(i) || []
    const hasErrors = issues.some(s => s.severity === 'error')
    const hasWarnings = issues.some(s => s.severity === 'warning')
    const hasOnlyInfo = issues.length > 0 && !hasErrors && !hasWarnings

    if (issues.length === 0) {
      // Clean slide — promote as exemplar
      await rateSlide(
        slide.type,
        slide.bg,
        1,
        slide,
        presId,
        i,
        'Auto-promoted: zero coach issues',
      )
      promoted++
    } else if (hasErrors) {
      // Problematic slide — demote as anti-exemplar
      const errorMessages = issues
        .filter(s => s.severity === 'error')
        .map(s => s.rule)
        .join(', ')
      await rateSlide(
        slide.type,
        slide.bg,
        -1,
        slide,
        presId,
        i,
        `Auto-demoted: ${errorMessages}`,
      )
      demoted++
    }
    // Info-only or warning-only: no auto-rating
  }

  return { promoted, demoted, score: summary.score }
}
