'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SlideToc, SlideTocChrome } from '@/components/slide-toc'
import { useComments, SlideCommentLayer } from '@/components/slide-comments'
import { useLocale, useSlideTranslation, SlidePreTranslator } from '@/components/slide-translation'
import { useSlidePdf } from '@/components/use-slide-pdf'
import { SlidePdfOverlay } from '@/components/slide-pdf-overlay'
import { PresentationPassword } from '@/components/presentation-password'
import { SlideRating } from '@/components/studio/slide-rating'
import type { SlideData } from '@/components/studio/slide-renderer'
import { CheckCircle2 } from 'lucide-react'

/* ─────────────────────── Colors ─────────────────────── */

const C = { turquoise: '#2BF2F1', slate: '#082422', blueberry: '#6060BF', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', sage: '#7BA882', lime: '#DCFF00', lychee: '#FFCD9C', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867' }

/* ─────────────────────── Shared Components ─────────────────────── */

const TOTAL = 14

function Illo({ src, className, label }: { src: string; className?: string; label?: string }) {
  return (
    <object
      type="image/svg+xml"
      data={`/illustrations/${src}`}
      className={className ?? 'w-full h-auto'}
      style={{ pointerEvents: 'none' }}
      aria-label={label}
      aria-hidden={!label}
    />
  )
}

function SlideFooter({ num, dark }: { num: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Consumer Payments</span>
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/50' : 'text-muted-foreground'} absolute left-1/2 -translate-x-1/2`}>felixpago.com</span>
      <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-linen' : 'text-foreground'}`}>{num} / {TOTAL}</span>
    </div>
  )
}

function PillBadge({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-block rounded-full px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] ${dark ? 'bg-turquoise/20 text-turquoise' : 'bg-turquoise text-slate'}`}>
      {children}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE COMPONENTS                       */
/* ═══════════════════════════════════════════════════════════ */

/* ── Slide 1: Title — Consumer Payments Mission ────────────── */
function SlideTitle() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[3%] w-[140px] lg:w-[200px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Cell%20Phone%20%2B%20Flying%20Dollar%20Bills%20-%20Turquoise.svg" />
        </div>
        <div className="absolute top-[12%] right-[20%] w-[60px] lg:w-[80px] opacity-[0.08]" style={{ animation: 'ds-float 6s ease-in-out infinite 0.5s' }}>
          <Illo src="Coin%20-%20Lime.svg" />
        </div>
        <div className="absolute bottom-[8%] left-[30%] w-[180px] lg:w-[260px] opacity-[0.05] rotate-3" style={{ animation: 'ds-drift 10s ease-in-out infinite 1.5s' }}>
          <Illo src="Dollar%20bills%20%2B%20Coins%20A.svg" />
        </div>
        <div className="absolute bottom-[15%] right-[5%] w-[100px] lg:w-[140px] opacity-[0.06] -rotate-6" style={{ animation: 'ds-float 9s ease-in-out infinite 2s' }}>
          <Illo src="Cloud%20Coin%20-%20Turquoise.svg" />
        </div>
      </div>

      {/* Felix logo top left */}
      <div className="absolute top-8 left-8 sm:top-10 sm:left-10 z-20">
        <span className="font-display font-black text-turquoise text-2xl sm:text-3xl">F&eacute;lix</span>
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — Title */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
              Consumer<br />Payments<br />Mission
            </h1>
          </div>

          {/* Right — Phone mockup */}
          <div className="hidden lg:flex items-center justify-center relative overflow-hidden">
            {/* Chat bubble */}
            <div className="absolute top-[15%] left-[10%] w-12 h-8 rounded-full flex items-center justify-center z-10" style={{ background: C.lime }}>
              <span className="text-slate font-bold text-lg">&bull;&bull;&bull;</span>
            </div>

            {/* Stylized phone frame */}
            <div className="relative w-[300px]">
              <div className="rounded-[36px] border-[6px] border-lime/30 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.turquoise }}>
                    <span className="font-display font-black text-slate text-sm">F</span>
                  </div>
                  <span className="font-display font-bold text-linen text-lg">F&eacute;lix</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-linen/60 text-xs">&iquest;C&oacute;mo puedo mejorar tu&nbsp;d&iacute;a?</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-linen/60 text-xs">El tipo de cambio de hoy es de <span className="font-bold text-turquoise">$20.08</span> pesos por&nbsp;d&oacute;lar.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-turquoise/20 text-turquoise">Quiero enviar dinero</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-linen/40">Recomienda y&nbsp;gana</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FX notification bubble */}
            <div className="absolute bottom-[15%] right-[2%] bg-turquoise rounded-xl px-4 py-2.5 shadow-lg z-10">
              <p className="text-slate text-xs font-semibold">El tipo de cambio subi&oacute; a&nbsp;17.70</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confidential + footer */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
        <div className="flex items-center gap-2">
          <span className="text-linen/30 text-xs">&#x1f512;</span>
          <span className="text-linen/30 text-xs">Confidential information</span>
        </div>
        <span className="text-linen/50 text-xs sm:text-sm absolute left-1/2 -translate-x-1/2">felixpago.com</span>
        <span className="text-xs sm:text-sm font-medium text-linen">1 / {TOTAL}</span>
      </div>
    </div>
  )
}

/* ── Slide 2: Org Chart (Dark) ────────────────────────────── */
function SlideOrgChart() {
  const directs = [
    { name: 'Hernan A.', title: 'Activation', role: 'Product Lead', color: C.turquoise, initials: 'HA', reports: [] as { name: string; role: string; color: string; initials: string }[] },
    { name: 'Santi S.', title: 'Core Send', role: 'Product Lead', color: C.turquoise, initials: 'SS',
      reports: [{ name: 'Hiring', role: 'Core 2 \u00b7 PM', color: C.concrete, initials: '?' }]
    },
    { name: 'Carla C.', title: 'Geos and\u00A0pricing', role: 'Product Director', color: C.turquoise, initials: 'CC',
      reports: [
        { name: 'Dani R.', role: 'Geo Launch \u00b7 PM', color: C.turquoise, initials: 'DR' },
        { name: 'Hiring', role: 'Geo Scale \u00b7 PM', color: C.concrete, initials: '?' },
        { name: 'Hiring', role: 'Pricing \u00b7 PM', color: C.concrete, initials: '?' },
      ]
    },
    { name: 'Diego V.', title: 'Payment\u00A0Bets', role: 'Sr. PM', color: C.turquoise, initials: 'DV', reports: [] as { name: string; role: string; color: string; initials: string }[] },
    { name: 'Kyle C.', title: 'Product\u00A0Design', role: 'Head', color: C.cactus, initials: 'KC',
      reports: [
        { name: 'Pato Beltran', role: 'Prod. Designer', color: C.cactus, initials: 'PB' },
        { name: 'Hiring', role: 'Prod. Designer', color: C.concrete, initials: '?' },
        { name: 'Hiring', role: 'Prod. Designer', color: C.concrete, initials: '?' },
        { name: 'Jose SM', role: 'Research \u00b7 PM', color: C.lime, initials: 'JS' },
      ]
    },
    { name: 'Fabricio Q.', title: 'Data', role: 'Analyst', color: C.lychee, initials: 'FQ', reports: [] as { name: string; role: string; color: string; initials: string }[] },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] right-[3%] w-[120px] lg:w-[160px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
        </div>
        <div className="absolute bottom-[8%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.05] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
          <Illo src="Speech%20Bubbles%20%2B%20Hearts.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 py-6 relative z-10">
        <div className="text-center mb-6">
          <PillBadge dark>Team Structure</PillBadge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-linen leading-[0.95] tracking-tight mt-4">Consumer&nbsp;Payments</h2>
        </div>

        {/* VP */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/15" style={{ background: C.turquoise }}>
            <span className="font-display font-black text-slate text-sm lg:text-base">SC</span>
          </div>
          <p className="font-display font-bold text-sm lg:text-base mt-2 text-center text-turquoise">Sam&nbsp;C.</p>
          <p className="text-linen/50 text-xs lg:text-sm text-center italic">Product&nbsp;VP</p>
        </div>

        <div className="w-px h-5 bg-white/15" />

        {/* Directs row */}
        <div className="flex gap-4 lg:gap-6 justify-center flex-wrap">
          {directs.map((d) => (
            <div key={d.name + d.title} className="flex flex-col items-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/15" style={{ background: d.color }}>
                <span className="font-display font-black text-slate text-xs lg:text-sm">{d.initials}</span>
              </div>
              <p className="font-display font-bold text-xs lg:text-sm mt-1.5 text-center" style={{ color: d.color }}>{d.title}</p>
              <p className="text-linen/60 text-[10px] lg:text-xs text-center">{d.name}</p>
              <p className="text-linen/30 text-[9px] lg:text-[10px] text-center italic">{d.role}</p>

              {d.reports.length > 0 && (
                <>
                  <div className="w-px h-3 bg-white/10 mt-1.5" />
                  <div className="flex gap-2 lg:gap-3 mt-0">
                    {d.reports.map((r, ri) => (
                      <div key={`${d.name}-${ri}`} className="flex flex-col items-center">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ring-1 ring-white/10" style={{ background: r.color }}>
                          <span className="font-display font-bold text-slate text-[9px] lg:text-[10px]">{r.initials}</span>
                        </div>
                        <p className="text-linen/50 text-[9px] lg:text-[10px] mt-1 text-center font-medium max-w-[65px]">{r.name}</p>
                        <p className="text-linen/25 text-[8px] lg:text-[9px] text-center max-w-[65px]">{r.role}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <SlideFooter num={2} dark />
    </div>
  )
}

/* ── Slide 3: Activation Squad Mission ────────────────────── */
function SlideActivationMission() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] right-[4%] w-[120px] lg:w-[170px] opacity-[0.14] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Stars.svg" />
        </div>
        <div className="absolute bottom-[10%] left-[3%] w-[110px] lg:w-[150px] opacity-[0.12] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute top-[45%] right-[2%] w-[40px] lg:w-[55px] opacity-[0.18] rotate-12" style={{ animation: 'ds-float 6s ease-in-out infinite 0.5s' }}>
          <Illo src="Coin%20-%20Lime.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — Editorial */}
          <div className="flex flex-col justify-center">
            {/* F icon */}
            <div className="mb-5 lg:mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: C.turquoise }}>
              <span className="font-display font-black text-slate text-2xl sm:text-3xl">F</span>
            </div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              Activation{'\u00A0'}Squad
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Bridging the gap between discovery and habit, ensuring every user&apos;s introduction to our product is the start of a lasting financial&nbsp;relationship.
            </p>
          </div>

          {/* Right — Mission card */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm">
            <div className="mb-8 lg:mb-10">
              <PillBadge>Mission</PillBadge>
              <p className="mt-5 text-xl sm:text-2xl lg:text-[28px] text-foreground leading-relaxed">
                <span style={{ background: C.lime, padding: '2px 6px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' as never }}>
                  Bridge the gap between discovery and habit, ensuring every user&apos;s introduction is the start of a lasting financial&nbsp;relationship.
                </span>
              </p>
            </div>
            <div>
              <PillBadge>How We Achieve This</PillBadge>
              <ul className="mt-6 space-y-4">
                {['Nail the signup before the first\u00A0send', 'Get money to the recipient with minimal\u00A0friction', 'Assist at each drop-off until habit\u00A0forms'].map((p) => (
                  <li key={p} className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
                    <span className="text-lg sm:text-xl lg:text-[22px] text-foreground leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={3} />
    </div>
  )
}

/* ── Slide 4: Activation Bridge (Dark) ────────────────────── */
function SlideActivationBridge() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] left-[3%] w-[120px] lg:w-[160px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[5%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute top-[50%] right-[2%] w-[40px] lg:w-[50px] opacity-[0.08]" style={{ animation: 'ds-float 6s ease-in-out infinite 0.5s' }}>
          <Illo src="Coin%20-%20Lime.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="mb-5 lg:mb-6">
          <PillBadge dark>Activation Squad</PillBadge>
        </div>
        <p className="text-center text-linen/30 text-xs mb-8">Product Offsite March&nbsp;2026</p>

        {/* Bridge diagram */}
        <div className="relative w-full max-w-4xl">
          {/* Speech bubbles */}
          <div className="flex justify-between mb-6 px-12 sm:px-16">
            <div className="bg-white/10 rounded-xl px-4 py-3 max-w-[180px] border border-white/5">
              <p className="text-linen/60 text-xs sm:text-sm text-center">What is felix, does it&nbsp;work?</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 max-w-[180px] border border-white/5">
              <p className="text-linen/60 text-xs sm:text-sm text-center">Felix is&nbsp;amazing!</p>
            </div>
          </div>

          {/* Bridge arc */}
          <div className="relative mx-auto">
            <svg className="w-full h-[120px] sm:h-[160px]" viewBox="0 0 800 160" fill="none" preserveAspectRatio="xMidYMid meet">
              <path d="M 50 130 Q 400 -20 750 130" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" />
              <line x1="100" y1="130" x2="100" y2="155" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <line x1="700" y1="130" x2="700" y2="155" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            </svg>

            {/* Labels on bridge */}
            <div className="absolute inset-0 flex items-end justify-between px-4 sm:px-8 pb-2">
              <div className="rounded-lg px-4 py-2 bg-turquoise/20">
                <p className="font-display font-extrabold text-linen text-lg sm:text-xl">Acquisition</p>
              </div>
              <div className="absolute inset-x-0 text-center bottom-0">
                <p className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-none">Activation</p>
              </div>
              <div className="rounded-lg px-4 py-2 bg-turquoise/20">
                <p className="font-display font-extrabold text-linen text-lg sm:text-xl">Product</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between mt-8 mx-8 sm:mx-16">
            <div className="text-center">
              <p className="font-display font-extrabold text-linen text-base sm:text-lg">Signup</p>
              <p className="text-linen/40 text-xs">(Pre-first transaction)</p>
            </div>
            <div className="flex-1 h-px bg-white/15 mx-4 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[8px] border-l-white/30 border-y-[4px] border-y-transparent" />
            </div>
            <div className="text-center">
              <p className="font-display font-extrabold text-linen text-base sm:text-lg">Aha!</p>
              <p className="text-linen/40 text-xs">(1-2&nbsp;trx)</p>
            </div>
            <div className="flex-1 h-px bg-white/15 mx-4 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[8px] border-l-white/30 border-y-[4px] border-y-transparent" />
            </div>
            <div className="text-center">
              <p className="font-display font-extrabold text-linen text-base sm:text-lg">Habit</p>
              <p className="text-linen/40 text-xs">(3-6&nbsp;trx)</p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={4} dark />
    </div>
  )
}

/* ── Slide 5: Activation Themes ───────────────────────────── */
function SlideActivationThemes() {
  const cards = [
    { title: 'Make it easy \u2014\u00A0non tech-savvy', subtitle: 'Remove friction at every\u00A0step', bullets: ['Non-text inputs for key data (e.g., account\u00A0photo)', 'Seamless web \u2192 WhatsApp handoff with full\u00A0context', 'Step-by-step flow with clear\u00A0guidance'] },
    { title: 'Make it easy \u2014\u00A0tech-savvy', subtitle: 'Give them the\u00A0wheel', bullets: ['Capture preferences early (e.g., FX\u00A0alerts)', 'Skip steps, fewer confirmations, faster path to\u00A0send', 'Surface richer information on\u00A0demand'] },
    { title: 'Nudges', subtitle: 'Assist at every drop-off\u00A0point', bullets: ['FX nudges timed to\u00A0convert', 'Proactive nudges for slow users (25\u2013105\u00A0min)', 'Next-day re-engagement for late-night\u00A0users', '50-day\u00A0follow-up'] },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] right-[3%] w-[100px] lg:w-[140px] opacity-[0.14] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Cloud%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[6%] left-[3%] w-[120px] lg:w-[160px] opacity-[0.12] -rotate-6" style={{ animation: 'ds-float 8s ease-in-out infinite 2s' }}>
          <Illo src="Hand%20-%20Cell%20Phone%20OK.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 sm:mb-10 lg:mb-12">
          Activation&nbsp;Themes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-8 lg:p-10 border border-border shadow-sm relative overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 h-2 rounded-b-2xl lg:rounded-b-3xl" style={{ background: C.turquoise }} />
              <h3 className="font-display font-extrabold text-foreground text-xl sm:text-2xl leading-snug mb-2">{card.title}</h3>
              <p className="font-semibold text-foreground text-sm sm:text-base mb-5 leading-snug">{card.subtitle}</p>
              <ul className="space-y-3">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base text-muted-foreground leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter num={5} />
    </div>
  )
}

/* ── Slide 6: Core Send Squad Mission (Dark) ──────────────── */
function SlideCoreSendMission() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] right-[3%] w-[120px] lg:w-[160px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Fast.svg" />
        </div>
        <div className="absolute bottom-[8%] left-[4%] w-[100px] lg:w-[140px] opacity-[0.05] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
          <Illo src="Hand%20-%20Cell%20Phone%20OK.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — Editorial */}
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: C.turquoise }}>
              <span className="font-display font-black text-slate text-2xl sm:text-3xl">F</span>
            </div>
            <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              Core Send{'\u00A0'}Squad
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-linen/60 leading-relaxed max-w-lg">
              Making every send so reliable, effortless, and intelligent that users don&apos;t need to ask for help &mdash; and the experience gets better the longer they&nbsp;stay.
            </p>
          </div>

          {/* Right — Mission card */}
          <div className="bg-white/5 rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-white/10">
            <div className="mb-8 lg:mb-10">
              <PillBadge dark>Mission</PillBadge>
              <p className="mt-5 text-xl sm:text-2xl lg:text-[28px] text-linen/80 leading-relaxed">
                <span style={{ background: C.lime, color: C.slate, padding: '2px 6px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' as never }}>
                  Make every send so reliable and intelligent that users never need a human &mdash; unless they truly want&nbsp;one.
                </span>
              </p>
            </div>
            <div>
              <PillBadge dark>Themes</PillBadge>
              <ul className="mt-6 space-y-4">
                {[
                  { label: 'Quality:', desc: 'Self-serve by default. Human by\u00A0choice.' },
                  { label: 'Power Users:', desc: 'The longer you stay, the better Felix\u00A0gets.' },
                  { label: 'UX Horizontal:', desc: 'Same trusted partner in every\u00A0room.' },
                  { label: 'Experience:', desc: 'Make every interaction\u00A0smoother.' },
                ].map((p) => (
                  <li key={p.label} className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-turquoise/60 mt-0.5" strokeWidth={1.5} />
                    <span className="text-lg sm:text-xl text-linen/70 leading-snug"><strong className="text-linen">{p.label}</strong> {p.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={6} dark />
    </div>
  )
}

/* ── Slide 7: Quality Themes ──────────────────────────────── */
function SlideQualityThemes() {
  const cards = [
    {
      title: 'Prevent the Problem',
      bullets: [
        { label: 'Errors:', text: 'Error handling, bot failure\u00A0recovery' },
        { label: 'Reliability:', text: 'Kill Switch, Catalogs/Limits fix, speed indicators per payout\u00A0method' },
      ],
      cta: 'Users never hit a dead-end we could have\u00A0prevented',
    },
    {
      title: 'Let Them Solve It',
      bullets: [
        { label: 'Self-service:', text: 'Cancellations, modifications, transaction\u00A0status' },
        { label: 'Options Menu:', text: 'Make every button\u00A0functional' },
        { label: 'Account Mgmt:', text: 'Self-service beneficiary\u00A0deletion' },
      ],
      cta: 'If something does happen, users resolve it\u00A0themselves',
    },
    {
      title: 'Enhanced Ninjas',
      bullets: [
        { label: 'Process automation:', text: 'Holds & payment ops\u00A0streamlined' },
        { label: 'The guardrail:', text: 'Felix is never a bot carousel that blocks users from reaching help when they REALLY need\u00A0it' },
      ],
      cta: 'When a human is truly needed, they arrive informed and\u00A0fast',
    },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[5%] right-[3%] w-[140px] lg:w-[200px] opacity-[0.1] rotate-6" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Cell%20Phone%20OK.svg" />
        </div>
        <div className="absolute top-[6%] left-[3%] w-[80px] lg:w-[110px] opacity-[0.14] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Lock.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="mb-8 sm:mb-10">
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight">
            <span className="font-black">Quality</span>{' '}
            <span className="font-bold text-2xl sm:text-3xl lg:text-4xl">means users never need a human &mdash; until they truly want&nbsp;one</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-8 lg:p-10 border border-border shadow-sm relative overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 h-2 rounded-b-2xl lg:rounded-b-3xl" style={{ background: C.turquoise }} />
              <h3 className="font-display font-extrabold text-foreground text-xl sm:text-2xl leading-snug mb-5">{card.title}</h3>
              <ul className="space-y-4 mb-6">
                {card.bullets.map((b) => (
                  <li key={b.label} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base text-muted-foreground leading-snug">
                      <strong className="text-foreground">{b.label}</strong> {b.text}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm italic text-foreground/60 leading-snug">{card.cta}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter num={7} />
    </div>
  )
}

/* ── Slide 8: Core Send — Loyalty & Consistency (Dark) ────── */
function SlideCoreSendThemes() {
  const cards = [
    { title: 'Power Users', subtitle: 'Reward loyalty with\u00A0efficiency', bullets: ['Define the power user segment, then build for\u00A0them:', 'Skip-steps', 'Recurring\u00A0sends', 'Rate benefits &\u00A0alerts', 'Saved\u00A0recipients', 'Higher limits\u00A0(L3)'] },
    { title: 'UX Horizontal', subtitle: 'Same partner in every\u00A0room.', bullets: ['Multi-product\u00A0consistency', 'Tone of voice and communication protocol for message\u00A0orchestration'] },
    { title: 'Experience Improvements', subtitle: 'Make every interaction\u00A0smoother', bullets: ['WhatsApp Flows to improve chat\u00A0usability', 'Post-TXN Revamp: better communication after payment is\u00A0completed'] },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[6%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}>
          <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
        </div>
        <div className="absolute top-[5%] left-[3%] w-[90px] lg:w-[130px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
          <Illo src="Heart%20-F%C3%A9lix.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-8 sm:mb-10 lg:mb-12">
          Core Send &mdash; Building for Loyalty &&nbsp;Consistency
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white/5 rounded-2xl lg:rounded-3xl p-7 sm:p-8 lg:p-10 border border-white/10 relative overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 h-2 rounded-b-2xl lg:rounded-b-3xl" style={{ background: C.turquoise }} />
              <h3 className="font-display font-extrabold text-linen text-xl sm:text-2xl leading-snug mb-2">{card.title}</h3>
              <p className="font-semibold text-linen/60 text-sm sm:text-base mb-5 leading-snug">{card.subtitle}</p>
              <ul className="space-y-3">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-turquoise/40 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base text-linen/50 leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter num={8} dark />
    </div>
  )
}

/* ── Slide 9: Geo Expansion Squad Mission ─────────────────── */
function SlideGeoMission() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] right-[4%] w-[120px] lg:w-[170px] opacity-[0.14] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Map.svg" />
        </div>
        <div className="absolute bottom-[10%] left-[3%] w-[130px] lg:w-[180px] opacity-[0.12] -rotate-6" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
          <Illo src="3%20Paper%20Airplanes%20%2B%20Coins.svg" />
        </div>
        <div className="absolute top-[50%] left-[5%] w-[40px] lg:w-[55px] opacity-[0.18]" style={{ animation: 'ds-float 6s ease-in-out infinite 0.5s' }}>
          <Illo src="Coin%20-%20Lime.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: C.turquoise }}>
              <span className="font-display font-black text-slate text-2xl sm:text-3xl">F</span>
            </div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              Geo Expansion{'\u00A0'}Squad
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Expanding Felix into new markets and optimizing non-MX corridors, which represent ~60% of US &rarr;LatAm&nbsp;remittances.
            </p>
          </div>

          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm">
            <div className="mb-8 lg:mb-10">
              <PillBadge>Mission</PillBadge>
              <p className="mt-5 text-xl sm:text-2xl lg:text-[28px] text-foreground leading-relaxed">
                <span style={{ background: C.lime, padding: '2px 6px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' as never }}>
                  Expand Felix into new markets and optimize non-MX corridors, which represent ~60% of US &rarr;LatAm&nbsp;remittances.
                </span>
              </p>
            </div>
            <div>
              <PillBadge>How We Achieve This</PillBadge>
              <ul className="mt-6 space-y-4">
                {[
                  'Launch ~11 new countries in\u00A02026',
                  'Launch velocity \u2014 streamline process &\u00A0technology',
                  'Graduation & Scaling \u2014 Launch\u2192Land\u2192Scale\u00A0framework',
                  'Country Optimization (360 view) \u2014 take to MX\u00A0levels',
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
                    <span className="text-lg sm:text-xl lg:text-[22px] text-foreground leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={9} />
    </div>
  )
}

/* ── Slide 10: Geo Expansion Themes (Dark) ────────────────── */
function SlideGeoThemes() {
  const cards = [
    { title: 'Launch velocity', subtitle: 'Tech & processes to launch many countries\u00A0fast', bullets: ['Processes to help us speed up and act smarter on each\u00A0launch', 'Tech capability for rapid, repeatable\u00A0launches', 'Multi-language capability for non-Spanish\u00A0corridors'] },
    { title: 'Graduation & Scale', subtitle: 'Healthy standards from launch to\u00A0scale', bullets: ['Reviewing and executing launch & land criterias that go together with company-wide\u00A0needs'] },
    { title: 'Country Optimizations', subtitle: 'Improve every scaling non-MX\u00A0corridor', bullets: ['Country-specific action plans and\u00A0ownership', 'Target metrics: conversion, NPS, disbursement success, bot failures, margins (360\u00A0approach)'] },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[6%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}>
          <Illo src="Map.svg" />
        </div>
        <div className="absolute top-[5%] left-[3%] w-[90px] lg:w-[130px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
          <Illo src="Paper%20Airplane%20%2B%20Dollar%20Bills.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 sm:mb-10 lg:mb-12">
          Geo Expansion&nbsp;Themes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white/5 rounded-2xl lg:rounded-3xl p-7 sm:p-8 lg:p-10 border border-white/10 relative overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 h-2 rounded-b-2xl lg:rounded-b-3xl" style={{ background: C.turquoise }} />
              <h3 className="font-display font-extrabold text-linen text-xl sm:text-2xl leading-snug mb-2">{card.title}</h3>
              <p className="font-semibold text-linen/60 text-sm sm:text-base mb-5 leading-snug">{card.subtitle}</p>
              <ul className="space-y-3">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-turquoise/40 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base text-linen/50 leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter num={10} dark />
    </div>
  )
}

/* ── Slide 11: Pricing Squad Mission ──────────────────────── */
function SlidePricingMission() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] right-[4%] w-[120px] lg:w-[170px] opacity-[0.14] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Calculator%20%2B%20Stack%20of%20coins.svg" />
        </div>
        <div className="absolute bottom-[10%] left-[3%] w-[110px] lg:w-[150px] opacity-[0.12] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1.5s' }}>
          <Illo src="Stack%20of%20coins%20-%20Lime.svg" />
        </div>
        <div className="absolute top-[48%] right-[2%] w-[40px] lg:w-[55px] opacity-[0.18]" style={{ animation: 'ds-float 6s ease-in-out infinite' }}>
          <Illo src="Coin%20-%20Lime.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: C.turquoise }}>
              <span className="font-display font-black text-slate text-2xl sm:text-3xl">F</span>
            </div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              Pricing{'\u00A0'}Squad
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Maximizing the value we deliver to users and capture as a business &mdash; through research, experimentation, and user-centric&nbsp;thinking.
            </p>
          </div>

          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm">
            <div className="mb-8 lg:mb-10">
              <PillBadge>Mission</PillBadge>
              <p className="mt-5 text-xl sm:text-2xl lg:text-[28px] text-foreground leading-relaxed">
                <span style={{ background: C.lime, padding: '2px 6px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' as never }}>
                  Maximize the value we deliver to users and capture as a business &mdash; through research, experimentation, and user-centric&nbsp;thinking.
                </span>
              </p>
            </div>
            <div>
              <PillBadge>How We Achieve This</PillBadge>
              <ul className="mt-6 space-y-4">
                {['Infrastructure & Foundations for\u00A0Experimentation', 'Pricing Discovery & Optimization (structures, levels &\u00A0UX)', 'Loyalty &\u00A0Multi-Product'].map((p) => (
                  <li key={p} className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
                    <span className="text-lg sm:text-xl lg:text-[22px] text-foreground leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={11} />
    </div>
  )
}

/* ── Slide 12: Pricing Squad Themes (Dark) ────────────────── */
function SlidePricingThemes() {
  const cards = [
    { title: 'Infrastructure &\u00A0Foundations', subtitle: 'Build the engine to\u00A0experiment', bullets: ['Migrate pricing logic from chat to\u00A0glucose', 'Enable experimentation in\u00A0Amplitude', 'Ongoing assessments for infra enhancements depending on experimentation\u00A0needs'] },
    { title: 'Pricing Discovery &\u00A0Optimization', subtitle: 'Research, structure, price levels and UX, per\u00A0corridor', bullets: ['Test pricing structures informed by user\u00A0research', 'Sensitivity testing per country and\u00A0corridor', 'Pricing transparency and E2E\u00A0UX'] },
    { title: 'Loyalty &\u00A0Multi-product', subtitle: 'High-leverage retention\u00A0plays', bullets: ['New pricing products: Subscription models, Reward loyalty with pricing\u00A0benefits', 'Multi-product pricing\u00A0strategy', 'Clear value communication throughout E2E\u00A0journey'] },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[6%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}>
          <Illo src="Dollar%20bills%20%2B%20Coins%20A.svg" />
        </div>
        <div className="absolute top-[5%] left-[3%] w-[90px] lg:w-[130px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
          <Illo src="Magnifying%20Glass.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 sm:mb-10 lg:mb-12">
          Pricing Squad&nbsp;Themes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white/5 rounded-2xl lg:rounded-3xl p-7 sm:p-8 lg:p-10 border border-white/10 relative overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 h-2 rounded-b-2xl lg:rounded-b-3xl" style={{ background: C.turquoise }} />
              <h3 className="font-display font-extrabold text-linen text-xl sm:text-2xl leading-snug mb-2">{card.title}</h3>
              <p className="font-semibold text-linen/60 text-sm sm:text-base mb-5 leading-snug">{card.subtitle}</p>
              <ul className="space-y-3">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-turquoise/40 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base text-linen/50 leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter num={12} dark />
    </div>
  )
}

/* ── Slide 13: New Bets Squad Mission (two-column) ────────── */
function SlideNewBetsMission() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] right-[4%] w-[120px] lg:w-[170px] opacity-[0.14] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Gift%20Box%20%2B%20Coins.svg" />
        </div>
        <div className="absolute bottom-[10%] left-[3%] w-[110px] lg:w-[150px] opacity-[0.12] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1.5s' }}>
          <Illo src="Diffusion.svg" />
        </div>
        <div className="absolute top-[50%] right-[2%] w-[40px] lg:w-[55px] opacity-[0.18]" style={{ animation: 'ds-float 6s ease-in-out infinite 0.5s' }}>
          <Illo src="Coin%20-%20Lime.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: C.turquoise }}>
              <span className="font-display font-black text-slate text-2xl sm:text-3xl">F</span>
            </div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              New Bets{'\u00A0'}Squad
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Expanding F&eacute;lix&apos;s consumer payments offering by launching new products that give users more reasons to not&nbsp;leave.
            </p>
          </div>

          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm">
            <div className="mb-8 lg:mb-10">
              <PillBadge>Mission</PillBadge>
              <p className="mt-5 text-xl sm:text-2xl lg:text-[28px] text-foreground leading-relaxed">
                <span style={{ background: C.lime, padding: '2px 6px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' as never }}>
                  Expand Felix&apos;s consumer payments offering by launching new products that give users more reasons to not&nbsp;leave.
                </span>
              </p>
            </div>
            <div>
              <PillBadge>How We Achieve This</PillBadge>
              <ul className="mt-6 space-y-4">
                {[
                  { label: 'Engagement:', desc: 'Give users new reasons to open Felix between remittance\u00A0cycles' },
                  { label: 'Moat:', desc: 'Reduce the need for users to leave Felix by bundling adjacent financial\u00A0services' },
                  { label: 'Moonshot:', desc: 'Experiment and validate unproven ideas (voice notes, zelle,\u00A0etc.)' },
                ].map((p) => (
                  <li key={p.label} className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
                    <span className="text-lg sm:text-xl text-foreground leading-snug"><strong>{p.label}</strong> {p.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={13} />
    </div>
  )
}

/* ── Slide 14: New Bets Themes (Dark) ─────────────────────── */
function SlideNewBetsThemes() {
  const cards = [
    { title: 'Increased Session Frequency', subtitle: 'Increase the number of jobs-to-be-done for which Felix provides a\u00A0solution', bullets: ['Top-ups', 'Domestic\u00A0P2P', 'International bill\u00A0payments', 'Domestic bill\u00A0payments', 'Merchant\u00A0payments'] },
    { title: 'Drive deeper ecosystem loyalty', subtitle: 'Helping users forget about the\u00A0competition', bullets: ['Loyalty/Subscription\u00A0program'] },
    { title: 'Moonshot exploration', subtitle: 'Try the things that don\u2019t fit in any\u00A0roadmap', bullets: ['Outbound voice note\u00A0messaging', 'Sending remittance with phone number\u00A0only', 'Recipient link (user creates link for others to send\u00A0money)'] },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[6%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}>
          <Illo src="Gift%20Box%20%2B%20Coins.svg" />
        </div>
        <div className="absolute top-[5%] left-[3%] w-[90px] lg:w-[130px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
          <Illo src="Speaker%20%2B%20Dollar%20Bill.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 sm:mb-10 lg:mb-12">
          New Bets&nbsp;Themes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white/5 rounded-2xl lg:rounded-3xl p-7 sm:p-8 lg:p-10 border border-white/10 relative overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 h-2 rounded-b-2xl lg:rounded-b-3xl" style={{ background: C.turquoise }} />
              <h3 className="font-display font-extrabold text-linen text-xl sm:text-2xl leading-snug mb-2">{card.title}</h3>
              <p className="font-semibold text-linen/60 text-sm sm:text-base mb-5 leading-snug">{card.subtitle}</p>
              <ul className="space-y-3">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-turquoise/40 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base text-linen/50 leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-linen/30">Note: These are not all planned projects but themes to be explored and&nbsp;tested</p>
      </div>
      <SlideFooter num={14} dark />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE SHELL                             */
/* ═══════════════════════════════════════════════════════════ */

const slides = [
  SlideTitle,              // 0 — dark
  SlideOrgChart,           // 1 — dark
  SlideActivationMission,  // 2 — stone
  SlideActivationBridge,   // 3 — dark
  SlideActivationThemes,   // 4 — stone
  SlideCoreSendMission,    // 5 — dark
  SlideQualityThemes,      // 6 — stone
  SlideCoreSendThemes,     // 7 — dark
  SlideGeoMission,         // 8 — stone
  SlideGeoThemes,          // 9 — dark
  SlidePricingMission,     // 10 — stone
  SlidePricingThemes,      // 11 — dark
  SlideNewBetsMission,     // 12 — stone
  SlideNewBetsThemes,      // 13 — dark
]

const slideMeta = [
  { title: 'Consumer Payments Mission', subtitle: 'Title' },
  { title: 'Org Chart', subtitle: 'Team Structure' },
  { title: 'Activation Squad', subtitle: 'Mission' },
  { title: 'Activation Bridge', subtitle: 'User Journey' },
  { title: 'Activation Themes', subtitle: 'Strategy Pillars' },
  { title: 'Core Send Squad', subtitle: 'Mission' },
  { title: 'Quality', subtitle: 'Core Send Theme' },
  { title: 'Core Send Themes', subtitle: 'Loyalty & Consistency' },
  { title: 'Geo Expansion Squad', subtitle: 'Mission' },
  { title: 'Geo Expansion Themes', subtitle: 'Strategy Pillars' },
  { title: 'Pricing Squad', subtitle: 'Mission' },
  { title: 'Pricing Squad Themes', subtitle: 'Strategy Pillars' },
  { title: 'New Bets Squad', subtitle: 'Mission' },
  { title: 'New Bets Themes', subtitle: 'Strategy Pillars' },
]

const darkSlideSet = new Set([0, 1, 3, 5, 7, 9, 11, 13])

const slideRatingStubs: SlideData[] = slides.map((_, i) => ({
  type: 'bullets' as const,
  bg: darkSlideSet.has(i) ? 'dark' as const : 'light' as const,
  title: slideMeta[i]?.title ?? '',
  bullets: [],
}))

export default function ConsumerPaymentsPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('consumer-payments-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('consumer-payments-mission.pdf')
  const { locale, setLocale } = useLocale()
  const slideRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(slideRef, locale, current)
  const total = slides.length

  useEffect(() => {
    setMounted(true)
    const hash = window.location.hash
    if (hash) {
      const n = parseInt(hash.replace('#slide-', ''), 10)
      if (!isNaN(n) && n >= 0 && n < total) setCurrent(n)
    }
  }, [total])

  useEffect(() => {
    if (mounted) window.history.replaceState(null, '', `#slide-${current}`)
  }, [current, mounted])

  const next = useCallback(() => setCurrent((p) => Math.min(p + 1, total - 1)), [total])
  const prev = useCallback(() => setCurrent((p) => Math.max(p - 1, 0)), [])

  useEffect(() => {
    if (!mounted) return
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (e.key === 'Escape' && tocOpen) { e.preventDefault(); setTocOpen(false); return }
      if (e.key === 'Escape' && commentMode) { e.preventDefault(); setCommentMode(false); return }
      if (e.key === 'c' || e.key === 'C') { e.preventDefault(); setCommentMode(m => !m); return }
      if (tocOpen || commentMode) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      else if (e.key === 'Home') { e.preventDefault(); setCurrent(0) }
      else if (e.key === 'End') { e.preventDefault(); setCurrent(total - 1) }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [mounted, total, next, prev, tocOpen])

  const [touchX, setTouchX] = useState<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => setTouchX(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return
    const diff = touchX - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    setTouchX(null)
  }

  const Slide = slides[current]
  const isDark = darkSlideSet.has(current)

  const pillBg = isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border shadow-xs'
  const pillText = isDark ? 'text-white/70' : 'text-foreground'
  const hintText = isDark ? 'text-white/40' : 'text-muted-foreground'
  const trackBg = isDark ? 'bg-white/10' : 'bg-concrete/30'
  const trackFill = isDark ? 'bg-turquoise-400' : 'bg-turquoise-600'
  const dotActive = isDark ? 'bg-turquoise-400' : 'bg-turquoise-600'
  const dotInactive = isDark ? 'bg-white/20 hover:bg-white/30' : 'bg-concrete hover:bg-concrete/70'
  const btnCls = isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'
  const btnIcon = isDark ? 'text-white/70' : 'text-foreground'

  return (
    <PresentationPassword>
    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-colors duration-500 ${trackBg}`}>
        <div className={`h-full transition-all duration-500 ease-out ${trackFill}`} style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}>
          <span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${pillText}`}>{current + 1} / {total}</span>
        </div>
      </div>

      <SlideTocChrome
        tocOpen={tocOpen}
        onToggle={() => setTocOpen(!tocOpen)}
        tocView={tocView}
        onViewChange={setTocView}
        pillBg={pillBg}
        pillText={pillText}
        hintText={hintText}
        onReset={() => setCurrent(0)}
        commentMode={commentMode}
        onToggleComments={() => setCommentMode(!commentMode)}
        locale={locale}
        onLocaleChange={setLocale}
        onDownloadPdf={() => downloadPdf({ slideRef, total, currentSlide: current, goToSlide: setCurrent })}
      />

      <div ref={slideRef} className="group/slide h-full w-full relative" key={current}>
        <div className="h-full w-full animate-in fade-in duration-300">
          <Slide />
        </div>
        <SlideCommentLayer
          slideIndex={current}
          commentMode={commentMode}
          comments={comments}
          onAddComment={addComment}
          onEditComment={editComment}
          onDeleteComment={deleteComment}
          onFlagComment={flagComment}
          onResolveComment={(id, resolved) => resolveComment(id, resolved)}
          onAddReply={addReply}
          onDeleteReply={deleteReply}
          onExitCommentMode={() => setCommentMode(false)}
        />
        <div className="absolute bottom-12 right-6 z-[60] opacity-0 group-hover/slide:opacity-100 transition-opacity duration-200">
          <SlideRating
            slide={slideRatingStubs[current]}
            slideIndex={current}
            source="consumer-payments"
            dark={darkSlideSet.has(current)}
          />
        </div>
      </div>

      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${current === i ? `w-8 sm:w-12 ${dotActive}` : `w-1.5 sm:w-2 ${dotInactive}`}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button onClick={prev} disabled={current === 0} className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === 0 ? 'opacity-0 pointer-events-none' : ''}`} aria-label="Previous slide" type="button">
        <svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={next} disabled={current === total - 1} className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === total - 1 ? 'opacity-0 pointer-events-none' : ''}`} aria-label="Next slide" type="button">
        <svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}>
          <span className={`text-xs transition-colors duration-500 ${hintText}`}>Swipe to navigate</span>
        </div>
      </div>

      <SlideToc open={tocOpen} onClose={() => setTocOpen(false)} slides={slides} slideMeta={slideMeta} darkSlideSet={darkSlideSet} current={current} view={tocView} onSelect={(i) => { setCurrent(i); setTocOpen(false) }} />
      <SlidePreTranslator slides={slides} locale={locale} />
      <SlidePdfOverlay progress={pdfProgress} onCancel={cancelPdf} />
    </div>
    </PresentationPassword>
  )
}
