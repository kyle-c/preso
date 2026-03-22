'use client'

import { useState, useEffect, useMemo } from 'react'
import type { BrandKit, BrandColor } from '@/lib/brand-kit'
import * as PhosphorIcons from '@phosphor-icons/react'

/* ═══════════════════════════════════════════════════════════ */
/*                   BRAND PREVIEW PAGE                        */
/*                                                              */
/*  Renders the brand's design system using the brand's own    */
/*  tokens — colors, fonts, spacing, and patterns. Loads       */
/*  Google Fonts dynamically. Shows Phosphor icons rendered.   */
/* ═══════════════════════════════════════════════════════════ */

interface FontResult { query: string; family: string; found: boolean; cssUrl?: string }
interface ProcessedBrand {
  kit: BrandKit
  fonts: FontResult[]
  extras: {
    icons?: { library: string; weight: string; browsUrl?: string; categories?: { name: string; examples: string[] }[] }
    tokens?: { spacing?: Record<string, string>; radius?: Record<string, string>; shadows?: Record<string, string> }
    typography?: { principle?: string; scale?: { style: string; size: string; lineHeight: string; letterSpacing: string; font: string; weight: number }[] }
    fontWeights?: { display?: { value: number; name: string }[]; body?: { value: number; name: string }[] }
  }
}

function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '')
  if (c.length < 6) return false
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

function contrastText(bg: string) { return isColorDark(bg) ? '#ffffff' : '#000000' }
function contrastMuted(bg: string) { return isColorDark(bg) ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)' }
function contrastSubtle(bg: string) { return isColorDark(bg) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }

/** Resolve a Phosphor icon component by name */
function PhosphorIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const Icon = (PhosphorIcons as any)[name]
  if (!Icon) return <span className={`text-[10px] opacity-40 ${className}`}>{name}</span>
  return <Icon size={size} weight="duotone" className={className} />
}

// ---------------------------------------------------------------------------
// Loading screen
// ---------------------------------------------------------------------------

function LoadingScreen({ step }: { step: string }) {
  const [dots, setDots] = useState(0)
  useEffect(() => { const id = setInterval(() => setDots(d => (d + 1) % 4), 400); return () => clearInterval(id) }, [])
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-6">
      <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#2BF2F1" strokeWidth="2" />
        <path className="opacity-80" d="M4 12a8 8 0 018-8" stroke="#2BF2F1" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="text-sm text-white/60">{step}{'.'.repeat(dots)}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page — styled using the brand's own design system
// ---------------------------------------------------------------------------

export default function BrandPreviewPage() {
  const [processed, setProcessed] = useState<ProcessedBrand | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadStep, setLoadStep] = useState('Loading brand kit')
  const [error, setError] = useState('')

  useEffect(() => {
    async function process() {
      try {
        setLoadStep('Loading brand kit')
        const kitRes = await fetch('/api/studio/brand-kit')
        const kitData = await kitRes.json()
        if (!kitData.brandKit) { setError('No brand kit configured'); setLoading(false); return }
        const kit = kitData.brandKit as BrandKit

        setLoadStep('Resolving typefaces')
        const fontSpecs = [kit.displayFont, kit.bodyFont].filter(f => f && f !== 'System default')
        let fonts: FontResult[] = []
        if (fontSpecs.length > 0) {
          const fontRes = await fetch('/api/studio/fonts/resolve', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fonts: fontSpecs }),
          })
          if (fontRes.ok) fonts = (await fontRes.json()).results || []
        }

        setLoadStep('Loading typefaces')
        for (const f of fonts) {
          if (f.found && f.cssUrl) {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = f.cssUrl
            document.head.appendChild(link)
          }
        }
        await document.fonts.ready
        await new Promise(r => setTimeout(r, 400))

        setLoadStep('Processing design tokens')
        let extras: ProcessedBrand['extras'] = {}
        if (kit.rawSource) {
          try {
            const raw = JSON.parse(kit.rawSource)
            const src = raw.designSystem || raw.brand || raw
            extras = {
              icons: src.icons,
              tokens: src.tokens,
              typography: src.typography,
              fontWeights: {
                display: src.fonts?.display?.weights,
                body: src.fonts?.body?.weights,
              },
            }
          } catch {}
        }

        setProcessed({ kit, fonts, extras })
      } catch { setError('Failed to process brand kit') }
      setLoading(false)
    }
    process()
  }, [])

  const cssVars = useMemo(() => {
    if (!processed) return {}
    const df = processed.fonts.find(f => f.query === processed.kit.displayFont)
    const bf = processed.fonts.find(f => f.query === processed.kit.bodyFont)
    return {
      '--brand-display': df?.found ? `"${df.family}"` : 'system-ui',
      '--brand-body': bf?.found ? `"${bf.family}"` : 'system-ui',
    } as React.CSSProperties
  }, [processed])

  if (loading) return <LoadingScreen step={loadStep} />
  if (error || !processed) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-neutral-500">{error || 'No brand kit configured'}</p>
    </div>
  )

  const { kit, fonts, extras } = processed
  const allColors = [...kit.primaryColors, ...kit.secondaryColors, ...kit.neutralColors]
  const displayFontResult = fonts.find(f => f.query === kit.displayFont)
  const bodyFontResult = fonts.find(f => f.query === kit.bodyFont)

  // Brand-derived style helpers
  // Find the lightest neutral or use lightBg as the card surface
  const surfaceColor = kit.neutralColors.length > 0
    ? kit.neutralColors.reduce((lightest, c) => {
        const cl = c.hex.replace('#', '')
        const ll = lightest.hex.replace('#', '')
        const lum = (h: string) => { const r = parseInt(h.substring(0,2),16); const g = parseInt(h.substring(2,4),16); const b = parseInt(h.substring(4,6),16); return r*299+g*587+b*114 }
        return lum(cl) > lum(ll) ? c : lightest
      }).hex
    : kit.lightBg
  const pageText = '#1a1a1a'
  const pageMuted = '#888888'
  const cardBg = surfaceColor
  const cardBorder = 'rgba(0,0,0,0.06)'
  const innerCardBg = '#ffffff'
  const innerCardBorder = 'rgba(0,0,0,0.04)'
  const sectionLabel = { fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: pageMuted, fontFamily: 'var(--brand-body)' }

  return (
    <div className="min-h-screen bg-white" style={cssVars}>
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Single card containing the entire design system */}
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="px-12 py-16 space-y-14" style={{ color: pageText }}>

        {/* ── Hero ── */}
        <div className="space-y-4">
          <p style={sectionLabel}>Design System</p>
          <h1 className="text-6xl font-black leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--brand-display)' }}>
            {kit.name}
          </h1>
          {kit.description && <p className="text-xl max-w-2xl leading-relaxed" style={{ color: pageMuted, fontFamily: 'var(--brand-body)' }}>{kit.description}</p>}
          {kit.mission && (
            <blockquote className="border-l-4 pl-4 mt-4 italic" style={{ borderColor: kit.brandBg, color: pageMuted, fontFamily: 'var(--brand-body)' }}>
              {kit.mission}
            </blockquote>
          )}
          {kit.tone && <p className="text-sm mt-2" style={{ color: pageMuted, fontFamily: 'var(--brand-body)' }}><strong style={{ color: pageText }}>Tone:</strong> {kit.tone}</p>}
        </div>

        {/* ── Colors ── */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--brand-display)' }}>Color Palette</h2>

          <p style={sectionLabel}>Slide Backgrounds</p>
          <div className="grid grid-cols-3 gap-4">
            {[{ hex: kit.darkBg, label: 'Dark' }, { hex: kit.lightBg, label: 'Light' }, { hex: kit.brandBg, label: 'Brand' }].map(bg => (
              <div key={bg.label} className="rounded-2xl p-6 min-h-[140px] flex flex-col justify-between" style={{ backgroundColor: bg.hex, border: `1px solid ${contrastSubtle(bg.hex)}` }}>
                <p style={{ ...sectionLabel, color: contrastMuted(bg.hex) }}>{bg.label}</p>
                <div>
                  <p className="text-3xl font-black" style={{ color: contrastText(bg.hex), fontFamily: 'var(--brand-display)' }}>Aa</p>
                  <p className="font-mono text-xs mt-1" style={{ color: contrastMuted(bg.hex) }}>{bg.hex.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>

          {kit.primaryColors.length > 0 && (
            <div>
              <p style={sectionLabel} className="mb-3">Primary</p>
              <div className="grid grid-cols-4 gap-3">
                {kit.primaryColors.map((c, i) => (
                  <div key={i} className="rounded-2xl p-5 min-h-[120px] flex flex-col justify-end" style={{ backgroundColor: c.hex }}>
                    <p className="text-xs font-semibold" style={{ color: contrastText(c.hex) }}>{c.name}</p>
                    <p className="font-mono text-[10px]" style={{ color: contrastMuted(c.hex) }}>{c.hex.toUpperCase()}</p>
                    {c.usage && <p className="text-[9px] mt-0.5" style={{ color: contrastMuted(c.hex) }}>{c.usage}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {kit.secondaryColors.length > 0 && (
            <div>
              <p style={sectionLabel} className="mb-3">Secondary</p>
              <div className={`grid gap-3 ${kit.secondaryColors.length <= 4 ? 'grid-cols-4' : kit.secondaryColors.length <= 6 ? 'grid-cols-6' : 'grid-cols-6'}`}>
                {kit.secondaryColors.map((c, i) => (
                  <div key={i} className="rounded-xl p-3 min-h-[72px] flex flex-col justify-end" style={{ backgroundColor: c.hex }}>
                    <p className="text-[10px] font-semibold" style={{ color: contrastText(c.hex) }}>{c.name}</p>
                    <p className="font-mono text-[9px]" style={{ color: contrastMuted(c.hex) }}>{c.hex.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {kit.neutralColors.length > 0 && (
            <div>
              <p style={sectionLabel} className="mb-3">Neutral</p>
              <div className="grid grid-cols-5 gap-3">
                {kit.neutralColors.map((c, i) => (
                  <div key={i} className="rounded-xl p-3 min-h-[64px] flex flex-col justify-end" style={{ backgroundColor: c.hex, border: `1px solid ${contrastSubtle(c.hex)}` }}>
                    <p className="text-[10px] font-semibold" style={{ color: contrastText(c.hex) }}>{c.name}</p>
                    <p className="font-mono text-[9px]" style={{ color: contrastMuted(c.hex) }}>{c.hex.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allColors.length > 0 && (
            <div className="flex rounded-2xl overflow-hidden h-10 mt-4">
              {allColors.map((c, i) => <div key={i} className="flex-1 transition-all hover:flex-[2]" style={{ backgroundColor: c.hex }} title={`${c.name} ${c.hex}`} />)}
            </div>
          )}
        </section>

        {/* ── Typography ── */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--brand-display)' }}>Typography</h2>
          {extras.typography?.principle && (
            <p className="text-sm -mt-2" style={{ color: pageMuted, fontFamily: 'var(--brand-body)' }}>{extras.typography.principle}</p>
          )}

          {/* Font families */}
          <div className="grid grid-cols-2 gap-4">
            {kit.displayFont && kit.displayFont !== 'System default' && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <p style={sectionLabel}>Display</p>
                  {displayFontResult && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: displayFontResult.found ? kit.brandBg + '20' : '#f59e0b20', color: displayFontResult.found ? kit.brandBg : '#f59e0b' }}>
                      {displayFontResult.found ? '✓ Google Fonts' : '⚠ Custom'}
                    </span>
                  )}
                </div>
                <p className="text-5xl font-black leading-[1.0] tracking-tight" style={{ fontFamily: 'var(--brand-display)' }}>Aa</p>
                <p className="text-sm mt-2" style={{ color: pageMuted }}>
                  {displayFontResult?.family || kit.displayFont}
                </p>
                {Array.isArray(extras.fontWeights?.display) && extras.fontWeights.display.length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {extras.fontWeights.display.map((w: any) => (
                      <div key={w.value || w} className="text-center">
                        <p className="text-xl" style={{ fontFamily: 'var(--brand-display)', fontWeight: w.value || w }}>Ag</p>
                        <p className="text-[8px] mt-0.5" style={{ color: pageMuted }}>{w.value || w}</p>
                        {w.name && <p className="text-[7px]" style={{ color: pageMuted }}>{w.name}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {kit.bodyFont && kit.bodyFont !== 'System default' && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <p style={sectionLabel}>Body</p>
                  {bodyFontResult && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: bodyFontResult.found ? kit.brandBg + '20' : '#f59e0b20', color: bodyFontResult.found ? kit.brandBg : '#f59e0b' }}>
                      {bodyFontResult.found ? '✓ Google Fonts' : '⚠ Custom'}
                    </span>
                  )}
                </div>
                <p className="text-4xl font-normal leading-tight" style={{ fontFamily: 'var(--brand-body)' }}>Aa</p>
                <p className="text-sm mt-2" style={{ color: pageMuted }}>
                  {bodyFontResult?.family || kit.bodyFont}
                </p>
                {Array.isArray(extras.fontWeights?.body) && extras.fontWeights.body.length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {extras.fontWeights.body.map((w: any) => (
                      <div key={w.value || w} className="text-center">
                        <p className="text-xl" style={{ fontFamily: 'var(--brand-body)', fontWeight: w.value || w }}>Ag</p>
                        <p className="text-[8px] mt-0.5" style={{ color: pageMuted }}>{w.value || w}</p>
                        {w.name && <p className="text-[7px]" style={{ color: pageMuted }}>{w.name}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Full type scale — in context */}
          {extras.typography?.scale && extras.typography.scale.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${innerCardBorder}` }}>
                <p style={sectionLabel}>Type Scale</p>
                <p className="text-[9px] font-mono" style={{ color: pageMuted }}>size · line-height · tracking</p>
              </div>
              <div>
                {extras.typography.scale.map((level, i) => {
                  const isDisplay = level.font === 'display'
                  // Generate sample text from the brand's own language
                  const brandWords = (kit.name + ' ' + (kit.description || '') + ' ' + (kit.mission || '')).split(/\s+/).filter(Boolean)
                  const pick = (count: number, offset: number) => brandWords.slice(offset % brandWords.length, (offset % brandWords.length) + count).join(' ')
                  const sampleTexts: Record<string, string> = {
                    'Display XL': kit.name,
                    'Display LG': kit.mission ? kit.mission.split(/[.!,]/).filter(Boolean)[0]?.trim().split(' ').slice(0, 4).join(' ') || kit.name : kit.name,
                    'Display MD': kit.description ? kit.description.split(' ').slice(0, 5).join(' ') : kit.name,
                    'Heading 1': kit.mission || kit.description || kit.name,
                    'Heading 2': kit.description ? kit.description.split(' ').slice(0, 6).join(' ') : kit.name,
                    'Heading 3': kit.tone ? kit.tone.split(/[.,]/).filter(Boolean)[0]?.trim() || kit.name : kit.name,
                    'Heading 4': pick(4, 0) || kit.name,
                    'Body Large': kit.description || kit.mission || 'A comprehensive design system built for consistency and clarity across every touchpoint.',
                    'Body': kit.mission || kit.description || 'Every design decision reflects a commitment to quality, accessibility, and user experience.',
                    'Body Small': kit.tone || 'Consistent application of these tokens ensures brand cohesion across all platforms.',
                    'Caption': (kit.name + ' · Design System · ' + new Date().getFullYear()).toUpperCase(),
                  }
                  return (
                    <div key={i} className="flex items-baseline gap-6 px-6 py-4" style={{ borderBottom: i < extras.typography!.scale!.length - 1 ? `1px solid ${innerCardBorder}` : undefined }}>
                      <div className="w-20 shrink-0">
                        <p className="text-[9px] font-mono" style={{ color: pageMuted }}>{level.size}</p>
                        <p className="text-[8px] font-mono" style={{ color: pageMuted }}>{level.lineHeight} · {level.letterSpacing || '0'}</p>
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p
                          style={{
                            fontFamily: isDisplay ? 'var(--brand-display), system-ui' : 'var(--brand-body), system-ui',
                            fontSize: level.size,
                            lineHeight: level.lineHeight,
                            letterSpacing: level.letterSpacing || undefined,
                            fontWeight: level.weight,
                            color: pageText,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {sampleTexts[level.style] || level.style}
                        </p>
                        <p className="text-[9px] mt-1" style={{ color: pageMuted }}>{level.style}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* ── Icons ── */}
        {extras.icons && (
          <section className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--brand-display)' }}>Icon Library</h2>
            <div className="flex items-center gap-3">
              <p className="text-sm" style={{ fontFamily: 'var(--brand-body)' }}>
                <strong>{extras.icons.library}</strong>
                {extras.icons.weight && <span style={{ color: pageMuted }}> · {extras.icons.weight}</span>}
              </p>
              {extras.icons.browsUrl && (
                <a href={extras.icons.browsUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline underline-offset-2" style={{ color: kit.brandBg }}>
                  Browse all ↗
                </a>
              )}
            </div>
            {extras.icons.categories && (
              <div className="grid grid-cols-2 gap-4">
                {extras.icons.categories.map((cat, i) => (
                  <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                    <p className="text-xs font-semibold mb-3" style={{ fontFamily: 'var(--brand-body)' }}>{cat.name}</p>
                    <div className="flex flex-wrap gap-3">
                      {cat.examples.map((icon, j) => (
                        <div key={j} className="flex flex-col items-center gap-1.5 w-14">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                            <PhosphorIcon name={icon} size={22} />
                          </div>
                          <span className="text-[8px] text-center leading-tight truncate w-full" style={{ color: pageMuted }}>{icon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Illustrations ── */}
        {kit.illustrations.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--brand-display)' }}>
              Illustrations <span className="text-lg font-normal" style={{ color: pageMuted }}>({kit.illustrations.length})</span>
            </h2>
            {(() => {
              const byCategory = new Map<string, typeof kit.illustrations>()
              for (const ill of kit.illustrations) {
                const list = byCategory.get(ill.category) || []
                list.push(ill)
                byCategory.set(ill.category, list)
              }
              return Array.from(byCategory.entries()).map(([cat, items]) => (
                <div key={cat}>
                  <p style={sectionLabel} className="mb-2">{cat} ({items.length})</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {items.map((ill, i) => (
                      <div key={i} className="w-12 h-12 rounded-lg flex items-center justify-center group relative" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }} title={ill.description}>
                        <img src={ill.url} alt={ill.description} className="max-h-7 max-w-7 object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            })()}
          </section>
        )}

        {/* ── Design Tokens ── */}
        {extras.tokens && (
          <section className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--brand-display)' }}>Design Tokens</h2>
            <div className="grid grid-cols-3 gap-6">
              {extras.tokens.spacing && (
                <div className="rounded-2xl p-6" style={{ backgroundColor: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                  <p style={sectionLabel} className="mb-4">Spacing</p>
                  <div className="space-y-2.5">
                    {Object.entries(extras.tokens.spacing).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[10px] font-mono w-8" style={{ color: pageMuted }}>{key}</span>
                        <div className="h-4 rounded-sm" style={{ width: val, backgroundColor: kit.brandBg, opacity: 0.5 }} />
                        <span className="text-[10px]" style={{ color: pageMuted }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {extras.tokens.radius && (
                <div className="rounded-2xl p-6" style={{ backgroundColor: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                  <p style={sectionLabel} className="mb-4">Border Radius</p>
                  <div className="space-y-3">
                    {Object.entries(extras.tokens.radius).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[10px] font-mono w-8" style={{ color: pageMuted }}>{key}</span>
                        <div className="w-10 h-10" style={{ borderRadius: val, border: `2px solid ${kit.brandBg}`, opacity: 0.6 }} />
                        <span className="text-[10px]" style={{ color: pageMuted }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {extras.tokens.shadows && (
                <div className="rounded-2xl p-6" style={{ backgroundColor: innerCardBg, border: `1px solid ${innerCardBorder}` }}>
                  <p style={sectionLabel} className="mb-4">Shadows</p>
                  <div className="space-y-3">
                    {Object.entries(extras.tokens.shadows).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[10px] font-mono w-12" style={{ color: pageMuted }}>{key}</span>
                        <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: cardBg, boxShadow: val }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Slide Previews ── */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--brand-display)' }}>Slide Previews</h2>
          <p className="text-sm -mt-2" style={{ color: pageMuted, fontFamily: 'var(--brand-body)' }}>How presentations look with this brand.</p>
          <div className="grid grid-cols-3 gap-5">
            {[
              { bg: kit.lightBg, badge: kit.name, title: 'Welcome to the Team', sub: 'Senior Product Designer · Q2 2026' },
              { bg: kit.darkBg, badge: 'Mission', title: kit.mission || 'Our Mission', sub: undefined },
              { bg: kit.brandBg, badge: undefined, title: kit.name, sub: kit.description },
            ].map((slide, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: slide.bg, border: `1px solid ${contrastSubtle(slide.bg)}` }}>
                {slide.badge && <p className="text-[8px] uppercase tracking-[0.15em] mb-2" style={{ color: contrastMuted(slide.bg), fontFamily: 'var(--brand-body)' }}>{slide.badge}</p>}
                <p className="text-xl font-black leading-tight" style={{ color: contrastText(slide.bg), fontFamily: 'var(--brand-display)' }}>{slide.title}</p>
                {slide.sub && <p className="text-xs mt-2 max-w-[200px]" style={{ color: contrastMuted(slide.bg), fontFamily: 'var(--brand-body)' }}>{slide.sub}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <div className="pt-8 text-center" style={{ borderTop: `1px solid ${innerCardBorder}` }}>
          <p className="text-[11px]" style={{ color: pageMuted, fontFamily: 'var(--brand-body)' }}>
            Generated by Felix Studio · {kit.name}
          </p>
        </div>

          </div>{/* end inner padding */}
        </div>{/* end card */}
      </div>{/* end max-w container */}
    </div>
  )
}
