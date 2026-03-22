'use client'

import { createContext, useContext, useState, useEffect } from 'react'

/* ═══════════════════════════════════════════════════════════ */
/*                     BRAND CONTEXT                           */
/*                                                              */
/*  Provides active brand colors to the slide renderer and     */
/*  other components. Falls back to Félix defaults.            */
/* ═══════════════════════════════════════════════════════════ */

export interface BrandColors {
  darkBg: string
  lightBg: string
  brandBg: string
  /** Accent color for progress bars, dots, badges */
  accent: string
}

const FELIX_DEFAULTS: BrandColors = {
  darkBg: '#082422',
  lightBg: '#EFEBE7',
  brandBg: '#2BF2F1',
  accent: '#2BF2F1',
}

const BrandContext = createContext<BrandColors>(FELIX_DEFAULTS)

export function useBrandColors() {
  return useContext(BrandContext)
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<BrandColors>(FELIX_DEFAULTS)

  useEffect(() => {
    fetch('/api/studio/brand-kit')
      .then(res => res.json())
      .then(data => {
        if (data.brandKit) {
          setColors({
            darkBg: data.brandKit.darkBg || FELIX_DEFAULTS.darkBg,
            lightBg: data.brandKit.lightBg || FELIX_DEFAULTS.lightBg,
            brandBg: data.brandKit.brandBg || FELIX_DEFAULTS.brandBg,
            accent: data.brandKit.brandBg || FELIX_DEFAULTS.accent,
          })
        }
      })
      .catch(() => {})
  }, [])

  return <BrandContext.Provider value={colors}>{children}</BrandContext.Provider>
}

/** Map slide bg type to actual hex colors from the active brand */
export function resolveBgHex(bg: 'dark' | 'light' | 'brand', brand: BrandColors): string {
  switch (bg) {
    case 'dark': return brand.darkBg
    case 'brand': return brand.brandBg
    case 'light':
    default: return brand.lightBg
  }
}
