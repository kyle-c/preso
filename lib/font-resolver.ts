/* ═══════════════════════════════════════════════════════════ */
/*                     FONT RESOLVER                           */
/*                                                              */
/*  Checks Google Fonts API for typefaces specified in a        */
/*  brand kit. Returns match status for each font so the UI    */
/*  can show confirmation or prompt for upload.                */
/* ═══════════════════════════════════════════════════════════ */

const GOOGLE_FONTS_CSS_URL = 'https://fonts.googleapis.com/css2'

export interface FontMatch {
  /** The font name as specified in the brand file */
  query: string
  /** Cleaned font family name (without weight/style info) */
  family: string
  /** Whether the font was found on Google Fonts */
  found: boolean
  /** Google Fonts CSS URL to load this font (if found) */
  cssUrl?: string
  /** Weights available (if found) */
  weights?: string[]
}

/**
 * Extract a clean font family name from a brand file font string.
 * e.g. "Inter (font-weight 400-700)" → "Inter"
 *      "Plain Bold 800-900" → "Plain"
 *      "Saans (font-weight 300-600)" → "Saans"
 */
function cleanFontName(raw: string): string {
  return raw
    .replace(/\(.*?\)/g, '') // Remove parenthetical notes
    .replace(/font-?weight\s*\d+[-–]\d+/gi, '') // Remove weight ranges
    .replace(/\b(bold|italic|light|regular|medium|semibold|thin|black|heavy)\b/gi, '') // Remove style keywords
    .replace(/\b\d{3,4}\b/g, '') // Remove numeric weights
    .replace(/[-–]/g, ' ') // Dashes to spaces
    .trim()
    .replace(/\s+/g, ' ') // Collapse whitespace
}

/**
 * Check if a font family exists on Google Fonts by requesting its CSS.
 * This is a lightweight check — we request the CSS and see if we get a 200.
 */
async function checkGoogleFont(family: string): Promise<{ found: boolean; cssUrl?: string }> {
  const encodedFamily = encodeURIComponent(family)
  // Request with a common weight range
  const cssUrl = `${GOOGLE_FONTS_CSS_URL}?family=${encodedFamily}:wght@300;400;500;600;700;800;900&display=swap`

  try {
    const res = await fetch(cssUrl, {
      headers: {
        // Google Fonts requires a user-agent to return proper CSS
        'User-Agent': 'Mozilla/5.0 (compatible; FelixStudio/1.0)',
      },
    })

    if (res.ok) {
      const css = await res.text()
      // Verify it actually contains font-face declarations (not an error page)
      if (css.includes('@font-face')) {
        return { found: true, cssUrl }
      }
    }
    return { found: false }
  } catch {
    return { found: false }
  }
}

/**
 * Resolve an array of font specifications from a brand kit.
 * Returns match status for each font.
 */
export async function resolveFonts(fontSpecs: string[]): Promise<FontMatch[]> {
  const results: FontMatch[] = []

  for (const spec of fontSpecs) {
    if (!spec || spec === 'System default') continue

    const family = cleanFontName(spec)
    if (!family) continue

    const { found, cssUrl } = await checkGoogleFont(family)

    results.push({
      query: spec,
      family,
      found,
      cssUrl,
    })
  }

  return results
}
