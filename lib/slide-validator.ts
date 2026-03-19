/**
 * Post-generation slide validator.
 *
 * Checks each slide against structural rules and content density
 * minimums. Returns issues that the generation prompt should have
 * prevented but didn't — used for logging, quality tracking,
 * and optional auto-fix.
 */

interface SlideIssue {
  slideIndex: number
  field: string
  severity: 'error' | 'warning'
  message: string
}

interface ValidationResult {
  valid: boolean
  issues: SlideIssue[]
  /** Slides with auto-fixes applied (orphan cards split, etc.) */
  fixedSlides: any[] | null
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function validateSlides(slides: any[]): ValidationResult {
  const issues: SlideIssue[] = []
  let needsFix = false
  const fixed = slides.map((s, i) => ({ ...s }))

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    if (!slide) continue

    // ── Card count validation ──
    if (slide.cards && Array.isArray(slide.cards)) {
      const count = slide.cards.length
      if (count === 5 || count === 7) {
        issues.push({
          slideIndex: i,
          field: 'cards',
          severity: 'error',
          message: `Card count ${count} creates orphaned bottom row. Must be 2, 3, 4, or 6.`,
        })
      }

      // Card body density
      for (let j = 0; j < slide.cards.length; j++) {
        const card = slide.cards[j]
        const wc = wordCount(card.body || '')
        if (wc < 10) {
          issues.push({
            slideIndex: i,
            field: `cards[${j}].body`,
            severity: 'warning',
            message: `Card "${card.title}" body is only ${wc} words (min 10). Content may feel thin.`,
          })
        }
        if (wc > 60) {
          issues.push({
            slideIndex: i,
            field: `cards[${j}].body`,
            severity: 'warning',
            message: `Card "${card.title}" body is ${wc} words (max ~40). Use bold lead + bullet points instead of dense paragraphs.`,
          })
        }
      }

      // Card density balance (for 4+ cards)
      if (count >= 4) {
        const lengths = slide.cards.map((c: any) => wordCount(c.body || ''))
        const max = Math.max(...lengths)
        const min = Math.min(...lengths)
        if (max > 0 && min > 0 && max / min > 3) {
          issues.push({
            slideIndex: i,
            field: 'cards',
            severity: 'warning',
            message: `Card density imbalance: longest body is ${max} words, shortest is ${min}. Aim for ±30% balance.`,
          })
        }
      }
    }

    // ── Bullet count validation ──
    if (slide.bullets && Array.isArray(slide.bullets)) {
      if (slide.bullets.length < 3) {
        issues.push({
          slideIndex: i,
          field: 'bullets',
          severity: 'warning',
          message: `Only ${slide.bullets.length} bullets. Minimum 3-4 for visual balance.`,
        })
      }

      // Check for short bullets
      for (let j = 0; j < slide.bullets.length; j++) {
        const bullet = slide.bullets[j]
        if (bullet.text && wordCount(bullet.text) < 5) {
          issues.push({
            slideIndex: i,
            field: `bullets[${j}]`,
            severity: 'warning',
            message: `Bullet "${bullet.text}" is only ${wordCount(bullet.text)} words. Each should be a complete thought.`,
          })
        }
      }
    }

    // ── Two-column balance ──
    if (slide.columns && Array.isArray(slide.columns) && slide.columns.length === 2) {
      const col0 = slide.columns[0]
      const col1 = slide.columns[1]
      const w0 = wordCount((col0.body || '') + (col0.bullets || []).map((b: any) => b.text).join(' '))
      const w1 = wordCount((col1.body || '') + (col1.bullets || []).map((b: any) => b.text).join(' '))
      if (w0 > 0 && w1 > 0 && (w0 / w1 > 4 || w1 / w0 > 4)) {
        issues.push({
          slideIndex: i,
          field: 'columns',
          severity: 'warning',
          message: `Column imbalance: left ${w0} words, right ${w1} words. Both should have similar weight.`,
        })
      }
      // Check for empty column
      if (w0 === 0 || w1 === 0) {
        issues.push({
          slideIndex: i,
          field: 'columns',
          severity: 'error',
          message: `One column is empty. Both must be populated.`,
        })
      }
    }

    // ── Title length ──
    if (slide.title) {
      const titleWords = wordCount(slide.title)
      if (titleWords > 10) {
        issues.push({
          slideIndex: i,
          field: 'title',
          severity: 'warning',
          message: `Title is ${titleWords} words (max ~8). Long titles may wrap and create orphaned words.`,
        })
      }
    }

    // ── Background alternation ──
    if (i > 0 && slides[i - 1]?.bg === slide.bg && slide.bg !== 'brand') {
      issues.push({
        slideIndex: i,
        field: 'bg',
        severity: 'warning',
        message: `Same background "${slide.bg}" as previous slide. Should alternate dark/light.`,
      })
      // Auto-fix: toggle bg
      fixed[i] = { ...fixed[i], bg: slide.bg === 'dark' ? 'light' : 'dark' }
      needsFix = true
    }

    // ── Emoji detection ──
    if (slide.bullets) {
      const hasEmoji = slide.bullets.some((b: any) =>
        b.icon && b.icon !== '✓' && b.icon !== '→' && b.icon !== '✗' && b.icon !== '•' && /[\u{1F300}-\u{1F9FF}]/u.test(b.icon)
      )
      if (hasEmoji) {
        issues.push({
          slideIndex: i,
          field: 'bullets.icon',
          severity: 'warning',
          message: `Emoji icons detected. Should use functional indicators only (✓, →, ✗) or omit.`,
        })
        // Auto-fix: strip emoji icons
        fixed[i] = {
          ...fixed[i],
          bullets: slide.bullets.map((b: any) => {
            if (b.icon && /[\u{1F300}-\u{1F9FF}]/u.test(b.icon)) {
              const { icon, ...rest } = b
              return rest
            }
            return b
          }),
        }
        needsFix = true
      }
    }

    // ── Missing notes ──
    if (!slide.notes) {
      issues.push({
        slideIndex: i,
        field: 'notes',
        severity: 'warning',
        message: 'Missing speaker notes.',
      })
    }
  }

  // ── Deck-level checks ──
  if (slides.length > 0) {
    if (slides[0]?.type !== 'title') {
      issues.push({
        slideIndex: 0,
        field: 'type',
        severity: 'error',
        message: 'First slide should be type "title".',
      })
    }
    const last = slides[slides.length - 1]
    if (last?.type !== 'closing') {
      issues.push({
        slideIndex: slides.length - 1,
        field: 'type',
        severity: 'warning',
        message: 'Last slide should be type "closing".',
      })
    }

    // Type variety
    const types = new Set(slides.map((s: any) => s.type))
    if (types.size < 4 && slides.length >= 8) {
      issues.push({
        slideIndex: -1,
        field: 'variety',
        severity: 'warning',
        message: `Only ${types.size} different slide types used. Aim for ≥4 for visual variety.`,
      })
    }

    // Illustration coverage
    const withIllos = slides.filter((s: any) => s.imageUrl).length
    const illoPct = withIllos / slides.length
    if (illoPct < 0.25 && slides.length >= 6) {
      issues.push({
        slideIndex: -1,
        field: 'imageUrl',
        severity: 'warning',
        message: `Only ${Math.round(illoPct * 100)}% of slides have illustrations. Target ≥30%.`,
      })
    }
  }

  return {
    valid: issues.filter((i) => i.severity === 'error').length === 0,
    issues,
    fixedSlides: needsFix ? fixed : null,
  }
}
