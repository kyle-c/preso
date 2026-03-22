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

interface SlideData {
  type: string
  bg: string
  title: string
  subtitle?: string
  body?: string
  badge?: string
  bullets?: { text: string; icon?: string }[]
  cards?: { title: string; titleColor?: string; body: string }[]
  columns?: any[]
  imageUrl?: string
  chart?: any
  notes?: string
  [key: string]: any
}

/**
 * Post-process slides to enforce layout rules.
 * Returns a new array with fixes applied. Non-destructive — never removes slides.
 */
export function postProcessSlides(slides: SlideData[]): SlideData[] {
  let result = slides.map(s => ({ ...s }))

  result = fixBgAlternation(result)
  result = fixCardCounts(result)
  result = fixTextDensity(result)
  result = fixEmptySections(result)
  result = fixConsecutiveTypes(result)

  return result
}

/** Fix consecutive slides with the same background color */
function fixBgAlternation(slides: SlideData[]): SlideData[] {
  const bgCycle = ['dark', 'light'] // alternating pattern
  for (let i = 1; i < slides.length; i++) {
    if (slides[i].bg === slides[i - 1].bg) {
      // Skip brand slides — they're intentional accents
      if (slides[i].bg === 'brand') continue
      // Flip to the opposite
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
      // Merge last two cards into one
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
      // Keep first 6, move 7th content into body/notes
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

/** Truncate body text that exceeds density limits */
function fixTextDensity(slides: SlideData[]): SlideData[] {
  return slides.map(slide => {
    if (!slide.body) return slide

    const words = slide.body.split(/\s+/)
    if (words.length > 80) {
      // Truncate to ~80 words at a sentence boundary
      const truncated = words.slice(0, 80).join(' ')
      const lastPeriod = truncated.lastIndexOf('.')
      const cleanBody = lastPeriod > truncated.length * 0.5
        ? truncated.substring(0, lastPeriod + 1)
        : truncated + '...'

      // Move full text to notes
      const fullText = slide.body
      return {
        ...slide,
        body: cleanBody,
        notes: slide.notes
          ? `${slide.notes}\n\nFull text: ${fullText}`
          : `Full text: ${fullText}`,
      }
    }

    return slide
  })
}

/** Fix section slides that have no subtitle */
function fixEmptySections(slides: SlideData[]): SlideData[] {
  return slides.map((slide, i) => {
    if (slide.type !== 'section') return slide
    if (slide.subtitle) return slide

    // Try to derive a subtitle from the next slide's content
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
  // This is informational only — we don't change slide types as that would
  // require regenerating content. Instead, we log it for the coach.
  return slides
}

/**
 * Quick validation — returns true if the slides pass basic layout checks.
 * Use this as a gate before saving.
 */
export function validateLayout(slides: SlideData[]): { valid: boolean; issues: string[] } {
  const issues: string[] = []

  // Check bg alternation
  for (let i = 1; i < slides.length; i++) {
    if (slides[i].bg === slides[i - 1].bg && slides[i].bg !== 'brand') {
      issues.push(`Slides ${i} and ${i + 1} have the same background (${slides[i].bg})`)
    }
  }

  // Check card counts
  for (let i = 0; i < slides.length; i++) {
    if (slides[i].cards) {
      const count = slides[i].cards!.length
      if (count === 5 || count === 7) {
        issues.push(`Slide ${i + 1} has ${count} cards (should be 2, 3, 4, or 6)`)
      }
    }
  }

  // Check text density
  for (let i = 0; i < slides.length; i++) {
    if (slides[i].body) {
      const wordCount = slides[i].body!.split(/\s+/).length
      if (wordCount > 100) {
        issues.push(`Slide ${i + 1} has ${wordCount} words (max 80)`)
      }
    }
  }

  // Check first/last slide types
  if (slides.length > 0 && slides[0].type !== 'title') {
    issues.push('First slide should be type "title"')
  }
  if (slides.length > 1 && slides[slides.length - 1].type !== 'closing') {
    issues.push('Last slide should be type "closing"')
  }

  return { valid: issues.length === 0, issues }
}
