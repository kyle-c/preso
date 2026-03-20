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
import {
  Rocket, Handshake, Users, Sparkle, Lightning, Globe,
  MagnifyingGlass, ChatDots, PaperPlaneTilt, Gear, BookOpen,
  CalendarBlank, Shield, ChartLineUp, DeviceMobile, Heart,
  Flag, UserCircle, Clipboard, CreditCard, Wallet, Star,
} from '@/components-next/phosphor-icons'

const C = { turquoise: '#2BF2F1', slate: '#082422', blueberry: '#6060BF', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', sage: '#7BA882', lime: '#DCFF00', lychee: '#FFCD9C', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867' }
const TOTAL = 12

function Illo({ src, className }: { src: string; className?: string }) {
  return <object type="image/svg+xml" data={`/illustrations/${src}`} className={className ?? 'w-full h-auto'} style={{ pointerEvents: 'none' }} aria-hidden="true" />
}

function SlideFooter({ num, dark }: { num: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Product Design Roadmap</span>
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/60' : 'text-muted-foreground'} absolute left-1/2 -translate-x-1/2`}>felixpago.com</span>
      <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-linen' : 'text-foreground'}`}>{num} / {TOTAL}</span>
    </div>
  )
}

function PillBadge({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`inline-block rounded-full px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] ${dark ? 'bg-turquoise/20 text-turquoise' : 'bg-turquoise text-slate'}`}>{children}</span>
}

/* ═══════════════════════════════════════════════ SLIDES ═══ */

function SlideCover() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[3%] w-[140px] lg:w-[200px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" /></div>
        <div className="absolute bottom-[10%] right-[4%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}><Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" /></div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="mb-6 lg:mb-8"><PillBadge dark>Q2–Q4 2026 &amp;&nbsp;Beyond</PillBadge></div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">Product Design{'\u00A0'}Roadmap</h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-linen/60 leading-relaxed max-w-2xl">Establishing a centralized, embedded design organization to support Felix&apos;s core platform + business&nbsp;units</p>
        </div>
      </div>
      <SlideFooter num={1} dark />
    </div>
  )
}

function SlideVision() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] right-[3%] w-[120px] lg:w-[160px] opacity-[0.14] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}><Illo src="Hand%20-%20Stars.svg" /></div>
        <div className="absolute bottom-[8%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.12] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}><Illo src="Heart%20-F%C3%A9lix.svg" /></div>
      </div>
      <div className="flex-1 flex items-center px-10 sm:px-14 lg:px-20 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6"><PillBadge>Vision</PillBadge></div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6 lg:mb-8">Design&apos;s Role at&nbsp;Felix</h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">&ldquo;Trusted Financial Companion&rdquo; is an <strong className="text-foreground">experience claim</strong>, not a feature claim. Design is how we deliver&nbsp;on&nbsp;it.</p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${C.turquoise}20` }}>
                <Handshake size={28} style={{ color: C.evergreen }} />
              </div>
              <span className="inline-block rounded-full px-4 py-1.5 text-sm sm:text-base font-bold text-slate mb-4" style={{ background: C.turquoise }}>One experience, every surface</span>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">Platform gives speed. Business lines give depth. Design makes it all feel like&nbsp;Felix.</p>
            </div>
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${C.cactus}20` }}>
                <Globe size={28} style={{ color: C.evergreen }} />
              </div>
              <span className="inline-block rounded-full px-4 py-1.5 text-sm sm:text-base font-bold text-slate mb-4" style={{ background: C.cactus }}>Design once, ship everywhere</span>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">One system, many surfaces. WhatsApp, app, web — consistent quality without rebuilding from scratch every&nbsp;time.</p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={2} />
    </div>
  )
}

/* ── Slide 3: Where We Are Today (NEW) ────────────────────── */
function SlideToday() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[6%] left-[3%] w-[120px] lg:w-[170px] opacity-[0.05] -rotate-6 pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite' }}><Illo src="Magnifying%20Glass.svg" /></div>
      <div className="flex-1 flex items-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — Title */}
          <div className="flex flex-col justify-center">
            <div className="mb-5"><PillBadge dark>Today</PillBadge></div>
            <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-4">Where We Are&nbsp;Now</h1>
            <p className="text-lg sm:text-xl text-linen/60 leading-relaxed max-w-lg">A small, talented team punching above its weight — but stretched thin across too many&nbsp;teams.</p>
          </div>

          {/* Right — Two cards */}
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 rounded-2xl p-6 sm:p-7 border border-white/10" style={{ borderTopWidth: 4, borderTopColor: C.cactus }}>
              <h3 className="font-display font-extrabold text-linen text-lg sm:text-xl mb-4">What we&nbsp;have</h3>
              <ul className="space-y-2.5">
                {['Head of Design (Kyle)', '2 Product Designers (Pato, Patricia)', '1 UX Researcher (Jose)', 'Newly defined design system (pre-launch)', 'Support primarily for Consumer Payments + Fintech Checkout\u00A0Team'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-cactus/60" strokeWidth={1.5} /><span className="text-base text-linen/70 leading-snug">{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 sm:p-7 border border-white/10" style={{ borderTopWidth: 4, borderTopColor: C.papaya }}>
              <h3 className="font-display font-extrabold text-linen text-lg sm:text-xl mb-4">What we&apos;re&nbsp;missing</h3>
              <ul className="space-y-2.5">
                {['Design system defined but not yet launched', 'Inconsistent voice, tone, and conversational\u00A0structures', 'No coverage for Credit, Wallet, New\u00A0Bets', 'No research infrastructure or\u00A0tooling', 'No app designer — not ready for\u00A0multisurface'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-papaya/60" strokeWidth={1.5} /><span className="text-base text-linen/70 leading-snug">{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={3} dark />
    </div>
  )
}

function SlideOrgModel() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[6%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}><Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5 text-center"><PillBadge dark>Org Model</PillBadge></div>
          <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-3 text-center">Centralized but&nbsp;Embedded</h1>
          <p className="text-center text-linen/60 text-lg mb-8">Two design functions aligned to the platform&nbsp;architecture</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="bg-white/5 rounded-2xl p-7 border border-white/10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${C.cactus}20` }}>
                <Users size={24} style={{ color: C.turquoise }} />
              </div>
              <span className="inline-block rounded-full px-4 py-1 text-sm font-semibold text-slate mb-3" style={{ background: C.cactus }}>Surface &amp; UX Platform</span>
              <p className="font-display font-black text-linen text-3xl mb-2">5–6 <span className="text-lg font-semibold text-linen/60">designers</span></p>
              <p className="text-base sm:text-lg text-linen/60 leading-relaxed">Design system, content design, UX research, app design, conversational UX&nbsp;(future)</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-7 border border-white/10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${C.papaya}20` }}>
                <Rocket size={24} style={{ color: C.turquoise }} />
              </div>
              <span className="inline-block rounded-full px-4 py-1 text-sm font-semibold text-slate mb-3" style={{ background: C.papaya }}>Embedded in Business Lines</span>
              <p className="font-display font-black text-linen text-3xl mb-2">5–6 <span className="text-lg font-semibold text-linen/60">designers</span></p>
              <p className="text-base sm:text-lg text-linen/60 leading-relaxed">Consumer Payments (2-3), Credit (1), Wallet/Store of Value (1), Fintech Core&nbsp;(1)</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div><p className="font-display font-bold text-linen text-lg sm:text-xl">Total team: 10–12&nbsp;people</p><p className="text-base text-linen/60">Including Head of Design · ~50% platform / ~50%&nbsp;embedded</p></div>
            <div className="text-right text-base text-linen/60"><p>+ 1–2 staff aug contractors</p><p>for design system &amp; app&nbsp;production</p></div>
          </div>
        </div>
      </div>
      <SlideFooter num={3} dark />
    </div>
  )
}

function SlideCoverageTarget() {
  const dedicated = [
    { pm: 'Santi', product: 'Core Send', coverage: 'Lead Designer' },
    { pm: 'Hernan', product: 'Activation', coverage: 'Senior Designer' },
    { pm: 'Sebas', product: 'Credit', coverage: 'Senior Designer' },
    { pm: 'Diego', product: 'New Bets', coverage: 'Designer' },
    { pm: 'Eva', product: 'Checkout', coverage: 'Designer' },
    { pm: 'Memo', product: 'Wallet', coverage: 'Designer' },
  ]
  const shared = [
    { pm: 'Dani', product: 'New Geos', coverage: 'Shared Designer' },
    { pm: 'Samu', product: 'Tools', coverage: 'Shared Designer' },
    { pm: 'Tomas', product: 'Disbursements', coverage: 'Shared Designer' },
    { pm: 'Carla', product: 'Pricing / Multilingual', coverage: 'Content Design Lead + Shared Designer' },
    { pm: 'Lexie', product: 'AI', coverage: 'Content Design Lead + Shared Designer' },
  ]
  const platform = [
    { role: 'Design Systems', person: 'Product Designer' },
    { role: 'Conversational Guidelines', person: 'Content Design Lead' },
    { role: 'Research', person: 'Research Lead' },
    { role: 'Multi-surface + App', person: 'Product Designer' },
  ]
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge dark>End of Year Proposal</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">11 PMs. Full Design&nbsp;Coverage.</h1>
          <p className="text-linen/60 text-lg mb-6">Coverage model pairs senior ownership with shared product, content, and research&nbsp;support.</p>

          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-4">
            <div className="px-5 py-2 bg-white/[0.05] border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Dedicated</span>
            </div>
            <div className="grid grid-cols-[1fr_2fr_3fr_1fr] gap-x-6 px-5 py-2.5 bg-white/[0.03] border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">PM</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Product Area</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Design Coverage</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Status</span>
            </div>
            {dedicated.map((a, i) => (
              <div key={a.pm} className={`grid grid-cols-[1fr_2fr_3fr_1fr] gap-x-6 px-5 py-2.5 items-center ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'} border-b border-white/5`}>
                <span className="text-sm font-medium text-linen/80">{a.pm}</span>
                <span className="text-sm text-linen/50">{a.product}</span>
                <span className="text-sm font-medium text-linen/80">{a.coverage}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: `${C.cactus}20`, color: C.cactus }}>Covered</span>
              </div>
            ))}
            <div className="px-5 py-2 bg-white/[0.05] border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Shared Support</span>
            </div>
            {shared.map((a, i) => (
              <div key={a.pm} className={`grid grid-cols-[1fr_2fr_3fr_1fr] gap-x-6 px-5 py-2.5 items-center ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'} ${i < shared.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-sm font-medium text-linen/80">{a.pm}</span>
                <span className="text-sm text-linen/50">{a.product}</span>
                <span className="text-sm font-medium text-linen/80">{a.coverage}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: `${C.cactus}20`, color: C.cactus }}>Covered</span>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-4">
            <div className="px-5 py-2.5 bg-white/[0.03] border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Platform + Shared Design Roles</span>
            </div>
            <div className="flex divide-x divide-white/10">
              {platform.map((p) => (
                <div key={p.role} className="flex-1 px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-linen/80">{p.role}</p>
                    <p className="text-xs text-linen/50">{p.person}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: `${C.cactus}20`, color: C.cactus }}>Covered</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-linen/40 mt-4">Coverage model preserves ownership without one-to-one staffing</p>
        </div>
      </div>
      <SlideFooter num={5} dark />
    </div>
  )
}

function SlideTeamDetail() {
  const platformRoles = [
    'UX Researcher',
    'Product Designer: Design Systems',
    'Content Design Lead',
    'Multi-Surface + App',
    'UX Researcher',
  ]
  const embeddedLines = [
    { name: 'Consumer\u00A0Payments', count: '3', color: C.papaya },
    { name: 'Fintech\u00A0Core', count: '1', color: C.sage },
    { name: 'Credit', count: '1', color: C.mango },
    { name: 'Wallet', count: '1', color: C.lychee },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[5%] right-[3%] w-[130px] lg:w-[180px] opacity-[0.1] rotate-3 pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}><Illo src="Hand%20-%20Stars.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5"><PillBadge>Org Model</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Alignment with Business&nbsp;Units</h1>
          <p className="text-muted-foreground text-lg mb-8">Platform creates leverage. Embedded creates&nbsp;depth.</p>

          {/* Vertical columns — Embedded business lines */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {embeddedLines.map((line) => (
              <div key={line.name} className="rounded-2xl p-5 border border-border shadow-sm bg-white text-center" style={{ borderTopWidth: 4, borderTopColor: line.color }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: `${line.color}20` }}>
                  <Lightning size={18} style={{ color: C.evergreen }} />
                </div>
                <p className="font-display font-extrabold text-foreground text-base mb-1">{line.name}</p>
                <p className="font-display font-black text-2xl" style={{ color: line.color }}>{line.count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">designer{line.count !== '1' ? 's' : ''}</p>
              </div>
            ))}
          </div>

          {/* Horizontal bar — Surface & UX Platform */}
          <div className="rounded-2xl p-5 border border-border shadow-sm" style={{ background: `${C.cactus}10`, borderBottomWidth: 4, borderBottomColor: C.cactus }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.cactus}20` }}>
                <Gear size={18} style={{ color: C.evergreen }} />
              </div>
              <h3 className="font-display font-extrabold text-foreground text-lg">Surface &amp; UX Platform</h3>
              <span className="text-sm text-muted-foreground ml-auto">5 roles — horizontal leverage</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {platformRoles.map((r) => (
                <span key={r} className="text-sm font-medium px-3 py-1.5 rounded-lg bg-white border border-border text-foreground">{r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={7} />
    </div>
  )
}

function SlideCoverage() {
  const assignments = [
    { pm: 'Santi', product: 'Core Send', designer: 'Pato', status: 'covered' as const },
    { pm: 'Hernan', product: 'Activation', designer: 'Pato', status: 'covered' as const },
    { pm: 'Carla', product: 'Pricing / Multilingual', designer: 'Kyle', status: 'stretched' as const },
    { pm: 'Dani', product: 'New Geos', designer: 'Pato', status: 'stretched' as const },
    { pm: 'Diego', product: 'New Bets', designer: 'Kyle', status: 'stretched' as const },
    { pm: 'Eva', product: 'Checkout', designer: 'Patricia', status: 'covered' as const },
    { pm: 'Samu', product: 'Tools', designer: 'Patricia', status: 'stretched' as const },
    { pm: 'Tomas', product: 'Disbursements', designer: 'Patricia', status: 'stretched' as const },
    { pm: 'Lexie', product: 'AI', designer: 'No designer', status: 'gap' as const },
    { pm: 'Memo', product: 'Wallet', designer: 'No designer', status: 'gap' as const },
    { pm: 'Sebas', product: 'Credit', designer: 'No designer', status: 'gap' as const },
  ]
  const platform = [
    { role: 'Design System', person: 'Kyle', status: 'stretched' as const },
    { role: 'Conv. Guidelines', person: 'TBH', status: 'gap' as const },
    { role: 'Research', person: 'Jose', status: 'covered' as const },
  ]
  const statusColor = { covered: C.cactus, stretched: C.mango, gap: C.papaya }
  const statusLabel = { covered: 'Covered', stretched: 'Stretched', gap: 'No designer' }

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge>Today</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">11 PMs. 3&nbsp;Designers.</h1>
          <p className="text-muted-foreground text-lg mb-6">Current coverage — the team is stretched&nbsp;thin</p>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-x-6 px-5 py-2.5 bg-foreground/[0.03] border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">PM</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Designer</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
            </div>
            {assignments.map((a, i) => (
              <div key={a.pm} className={`grid grid-cols-[1fr_2fr_1fr_1fr] gap-x-6 px-5 py-2.5 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-foreground/[0.02]'} ${i < assignments.length - 1 ? 'border-b border-border/50' : ''}`}>
                <span className="text-sm font-medium text-foreground">{a.pm}</span>
                <span className="text-sm text-muted-foreground">{a.product}</span>
                <span className={`text-sm font-medium ${a.status === 'gap' ? 'text-papaya' : 'text-foreground'}`}>{a.designer}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: `${statusColor[a.status]}20`, color: statusColor[a.status] }}>{statusLabel[a.status]}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-2.5 bg-foreground/[0.03] border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform &amp; Shared Roles</span>
            </div>
            <div className="flex divide-x divide-border/50">
              {platform.map((p) => (
                <div key={p.role} className="flex-1 px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.role}</p>
                    <p className={`text-xs ${p.status === 'gap' ? 'text-papaya font-semibold' : 'text-muted-foreground'}`}>{p.person}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: `${statusColor[p.status]}20`, color: statusColor[p.status] }}>{statusLabel[p.status]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5 mt-4">
            {Object.entries(statusLabel).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor[key as keyof typeof statusColor] }} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
            <span className="text-xs text-muted-foreground ml-auto">3 products with no design coverage · 4 designers splitting 11+ workstreams</span>
          </div>
        </div>
      </div>
      <SlideFooter num={4} />
    </div>
  )
}

function SlideHiring() {
  const phases = [
    { phase: 'Now', time: 'Q1', label: 'Foundation', color: C.cactus, hires: [
      { name: 'Senior Designer', note: 'Consumer Payments' },
      { name: 'Designer', note: 'Checkout' },
      { name: 'UX Researcher', note: 'Platform' },
    ], aug: '+ 1 contractor for design system build-out (Darwoft)' },
    { phase: 'Next', time: 'Q2', label: 'Build capability', color: C.sky, hires: [
      { name: 'Lead Designer', note: 'Consumer Payments' },
      { name: 'Senior Designer', note: 'Credit' },
      { name: 'Senior Designer', note: 'Consumer Payments' },
      { name: 'Content Design Lead', note: 'Platform' },
    ], aug: '' },
    { phase: 'Later', time: 'Q3 & Beyond', label: 'Scale', color: C.mango, hires: [
      { name: 'Designer', note: 'Multi-surface / App' },
      { name: 'Designer', note: 'Wallet (tentative)' },
      { name: 'UX Researcher', note: 'Platform (tentative)' },
    ], aug: 'Steady-state: 1 permanent + flex contractors' },
  ]
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] right-[4%] w-[110px] lg:w-[150px] opacity-[0.06] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}><Illo src="3%20Paper%20Airplanes%20%2B%20Coins.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge dark>For Discussion</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Team Build&nbsp;Sequence</h1>
          <p className="text-linen/60 text-lg mb-8">Existing roles, new hires, and future additions — phased to the&nbsp;reorg</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {phases.map((p) => (
              <div key={p.phase} className="bg-white/5 rounded-2xl p-6 sm:p-7 border border-white/10" style={{ borderTopWidth: 4, borderTopColor: p.color }}>
                <div className="mb-4">
                  <h3 className="font-display font-extrabold text-xl" style={{ color: p.color }}>{p.phase} · {p.time}</h3>
                  <p className="text-base text-linen/60">{p.label}</p>
                </div>
                <ul className="space-y-3">
                  {p.hires.map((h) => (
                    <li key={h.name + h.note} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-turquoise/40" strokeWidth={1.5} />
                      <div>
                        <p className="text-base text-linen font-medium leading-snug">{h.name}</p>
                        {h.note && <p className="text-sm text-linen/60 mt-0.5">{h.note}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
                {p.aug && <p className="text-sm text-linen/60 mt-5 pt-4 border-t border-white/10">{p.aug}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={6} dark />
    </div>
  )
}

function SlideStaffAug() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[6%] left-[3%] w-[110px] lg:w-[150px] opacity-[0.12] -rotate-12 pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Fast.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge>Org Model</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Staff Augmentation&nbsp;Strategy</h1>
          <p className="text-muted-foreground text-base mb-8">Contractors extend capacity — they don&apos;t replace&nbsp;ownership</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {[
              { title: 'Good fit for contractors', color: C.cactus, items: ['Design system production (components, docs, Figma libraries)', 'App UI screen production', 'Consumer Payments overflow during launches or geo expansion'] },
              { title: 'Situational', color: C.mango, items: ['Fintech core pattern execution (under FTE direction)', 'Usability test moderation and analysis support'] },
              { title: 'Must be full-time', color: C.papaya, items: ['Content design', 'UX research', 'Credit/Wallet embedded designers', 'Design system IC (strategist, not production)'] },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-6 border border-border shadow-sm" style={{ borderTopWidth: 3, borderTopColor: c.color }}>
                <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl mb-4">{c.title}</h3>
                <ul className="space-y-2">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-foreground/30" strokeWidth={1.5} />
                      <span className="text-base text-muted-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed"><strong className="text-foreground">Key prerequisite:</strong> Staff aug only works once the design system has enough coverage to provide guardrails. A contractor without a design system is a freelancer making things up. A contractor with a design system produces on-brand, consistent work from week&nbsp;one.</p>
          </div>
        </div>
      </div>
      <SlideFooter num={8} />
    </div>
  )
}

function SlideRoadmapOverview() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[5%] left-[3%] w-[120px] lg:w-[170px] opacity-[0.05] -rotate-6 pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite' }}><Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5 text-center"><PillBadge dark>Roadmap</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2 text-center">What This Team&nbsp;Unlocks</h1>
          <p className="text-center text-linen/60 text-base mb-8">With the org at full build, two design tracks run in&nbsp;parallel</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { title: 'Track 1: Design Foundation', color: C.cactus, icon: Clipboard, sub: 'Consistency and quality at scale — so every surface feels like Felix', items: ['Multi-surface + AI design patterns', 'Design system & pattern library', 'Content & conversational UX patterns', 'Research infrastructure & practice', 'Cross-surface experience coherence'] },
              { title: 'Track 2: Design in Product', color: C.papaya, icon: DeviceMobile, sub: 'Driving conversion, retention, and trust across every product touchpoint', items: ['Multi-product discovery framework', 'Core Conversion and Retention UX', 'Checkout flow restructuring', 'Credit & wallet product definition', 'Geo expansion experience design'] },
            ].map((t) => (
              <div key={t.title} className="bg-white/5 rounded-2xl p-7 border border-white/10" style={{ borderTopWidth: 3, borderTopColor: t.color }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${t.color}20` }}>
                  <t.icon size={24} style={{ color: t.color }} />
                </div>
                <h3 className="font-display font-extrabold text-linen text-xl sm:text-2xl mb-1">{t.title}</h3>
                <p className="text-base text-linen/60 mb-5">{t.sub}</p>
                <ul className="space-y-3">{t.items.map((item) => <li key={item} className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-turquoise/40 mt-0.5" strokeWidth={1.5} /><span className="text-base sm:text-lg text-linen/60">{item}</span></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={9} dark />
    </div>
  )
}

/* SlideNow removed — content folded into roadmap */

function SlideNow() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.12] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}><Illo src="Magnifying%20Glass.svg" /></div>
      <div className="flex-1 flex items-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — Title + context */}
          <div className="flex flex-col justify-center">
            <div className="mb-5"><PillBadge>Roadmap</PillBadge></div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-4">Now — Q2&nbsp;2026</h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">Stand up the org, establish credibility, support current&nbsp;priorities</p>
          </div>

          {/* Right — Two track groups */}
          <div className="flex flex-col gap-6">
            {/* Product track */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-border shadow-sm" style={{ borderTopWidth: 3, borderTopColor: C.papaya }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${C.papaya}15` }}>
                <CreditCard size={22} style={{ color: C.evergreen }} />
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl mb-4" style={{ color: C.papaya }}>Design in&nbsp;Product</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-foreground/30" strokeWidth={1.5} />
                  <div><p className="font-display font-bold text-foreground text-base">Multi-product discovery</p><p className="text-sm text-muted-foreground mt-0.5">Scalable framework for top-ups, bill pay, and credit in&nbsp;WhatsApp</p></div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-foreground/30" strokeWidth={1.5} />
                  <div><p className="font-display font-bold text-foreground text-base">Checkout improvements</p><p className="text-sm text-muted-foreground mt-0.5">UX restructuring for scalable payment methods across business&nbsp;lines</p></div>
                </li>
              </ul>
            </div>

            {/* Foundation track */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-border shadow-sm" style={{ borderTopWidth: 3, borderTopColor: C.cactus }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${C.cactus}15` }}>
                <Gear size={22} style={{ color: C.evergreen }} />
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl mb-4" style={{ color: C.cactus }}>Design&nbsp;Foundation</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-foreground/30" strokeWidth={1.5} />
                  <div><p className="font-display font-bold text-foreground text-base">Design system</p><p className="text-sm text-muted-foreground mt-0.5">Expand components for checkout, wallet, top-ups. UX guidelines across WhatsApp and&nbsp;web/app</p></div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-foreground/30" strokeWidth={1.5} />
                  <div><p className="font-display font-bold text-foreground text-base">Research foundation</p><p className="text-sm text-muted-foreground mt-0.5">Empower PMs and engineers to research more regularly. User recruitment&nbsp;pipelines</p></div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-foreground/30" strokeWidth={1.5} />
                  <div><p className="font-display font-bold text-foreground text-base">Content design</p><p className="text-sm text-muted-foreground mt-0.5">Felix voice &amp; tone system. Conversational flow patterns. Bilingual content&nbsp;guidelines</p></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={10} />
    </div>
  )
}

function SlideResearch() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.06] -rotate-12 pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Magnifying%20Glass.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge dark>Appendix</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Research&nbsp;Model</h1>
          <p className="text-linen/60 text-base mb-8">Building the practice from scratch with a staggered two-researcher&nbsp;approach</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10" style={{ borderLeftWidth: 3, borderLeftColor: C.sky }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${C.sky}15` }}>
                <MagnifyingGlass size={22} style={{ color: C.sky }} />
              </div>
              <h3 className="font-display font-bold text-linen text-lg sm:text-xl mb-1">Researcher 1 — Platform</h3>
              <p className="text-sm mb-4" style={{ color: C.sky }}>Hired in Phase 1 · Surface &amp; UX team</p>
              <ul className="space-y-2">
                {['Foundational studies to support multi-product', 'Build research practice: templates, pipelines, insight repo', 'Teach designers and PMs to self-serve on evaluative research'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-turquoise/40" strokeWidth={1.5} /><span className="text-base text-linen/60 leading-snug">{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10" style={{ borderLeftWidth: 3, borderLeftColor: C.sky }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${C.sky}15` }}>
                <Globe size={22} style={{ color: C.sky }} />
              </div>
              <h3 className="font-display font-bold text-linen text-lg sm:text-xl mb-1">Researcher 2 — Roaming</h3>
              <p className="text-sm mb-4" style={{ color: C.sky }}>Hired at month 6–9 · Rotates across business lines</p>
              <ul className="space-y-2">
                {['6–8 week sprints on highest-priority product decisions', 'Usability testing, concept validation, funnel analysis', 'Quarterly rotation planning with Head of\u00A0Design'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-turquoise/40" strokeWidth={1.5} /><span className="text-base text-linen/60 leading-snug">{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-base text-linen/60 leading-relaxed"><strong className="text-linen">Why stagger:</strong> R1 needs 2–3 months to establish how research works. Once those rails exist, R2 rides them from day one — producing research, not building&nbsp;infrastructure.</p>
          </div>
        </div>
      </div>
      <SlideFooter num={11} dark />

    </div>
  )
}

function SlideContentDesign() {
  const projects = [
    { project: 'Felix Voice &\u00A0Tone', timeline: 'Foundational', color: C.turquoise, icon: ChatDots, desc: 'How Felix speaks across every touchpoint. Bilingual guidelines, emotional tone calibration by moment type, writing principles for the whole\u00A0team.' },
    { project: 'Conversational Flow\u00A0Patterns', timeline: 'Next', color: C.cactus, icon: BookOpen, desc: 'Standardized patterns for greetings, disambiguation, confirmations, error recovery, and product introduction within\u00A0conversation.' },
    { project: 'AI Agent Personality', timeline: 'Soon', color: C.mango, icon: Sparkle, desc: 'Personality parameters for the LLM agent. Behavioral rules, tone constraints, things Felix should never\u00A0say.' },
    { project: 'Cross-Channel\u00A0Adaptation', timeline: 'Later', color: C.papaya, icon: DeviceMobile, desc: 'WhatsApp (conversational), app (scannable), push (action-oriented), SMS (ultra-concise). Same personality, different\u00A0expression.' },
  ]
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[6%] right-[4%] w-[130px] lg:w-[180px] opacity-[0.1] rotate-3 pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}><Illo src="Speech%20Bubbles%20%2B%20Hearts.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5 text-center"><PillBadge>Appendix</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2 text-center">Content Design&nbsp;Lead</h1>
          <p className="text-muted-foreground text-lg mb-8 text-center">Shaping how Felix communicates across every surface, language, and&nbsp;interaction</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((p) => {
              const Icon = p.icon
              return (
              <div key={p.project} className="bg-white rounded-2xl p-7 sm:p-8 lg:p-9 border border-border shadow-sm" style={{ borderTopWidth: 4, borderTopColor: p.color }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${p.color}15` }}>
                    <Icon size={26} style={{ color: C.evergreen }} />
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full font-semibold" style={{ background: `${p.color}20`, color: C.evergreen }}>{p.timeline}</span>
                </div>
                <h3 className="font-display font-extrabold text-foreground text-xl sm:text-2xl leading-snug mb-3">{p.project}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            )})}

          </div>
        </div>
      </div>
      <SlideFooter num={12} />
    </div>
  )
}

function SlideClosingGoal() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}><Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" /></div>
        <div className="absolute bottom-[10%] right-[5%] w-[120px] lg:w-[160px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}><Illo src="Hand%20-%20Stars.svg" /></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-10 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 text-center"><PillBadge dark>The Transformation</PillBadge></div>
          <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-10 text-center">Today vs. End of&nbsp;Year</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Today */}
            <div className="bg-white/5 rounded-2xl p-6 sm:p-7 border border-white/10" style={{ borderTopWidth: 4, borderTopColor: C.papaya }}>
              <h3 className="font-display font-extrabold text-lg sm:text-xl mb-4" style={{ color: C.papaya }}>Today</h3>
              <ul className="space-y-2.5">
                {['Design system defined but not yet launched', 'No content design or research infra', 'Reactive to product requests', 'Single-surface focus (WhatsApp)', 'Single-product focus (remittances)'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-papaya/50" strokeWidth={1.5} /><span className="text-base text-linen/60 leading-snug">{item}</span></li>
                ))}
              </ul>
            </div>

            {/* End of Year */}
            <div className="bg-white/5 rounded-2xl p-6 sm:p-7 border border-white/10" style={{ borderTopWidth: 4, borderTopColor: C.cactus }}>
              <h3 className="font-display font-extrabold text-lg sm:text-xl mb-4" style={{ color: C.cactus }}>End of&nbsp;Year</h3>
              <ul className="space-y-2.5">
                {['Unified design system + pattern library', 'Content design, research, and app coverage', 'Proactive — shaping product direction', 'Multi-surface: WhatsApp, app, web, and\u00A0beyond', 'Multi-product: Payments, Credit, Wallet, and\u00A0more'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-cactus/60" strokeWidth={1.5} /><span className="text-base text-linen/60 leading-snug">{item}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
            <p className="text-base text-linen/60 leading-relaxed">Let&apos;s prepare ourselves for a period of learnings and iterating. It will be an adjustment that will take energy — but will make us&nbsp;stronger.</p>
          </div>
        </div>
      </div>
      <SlideFooter num={10} dark />
    </div>
  )
}

/* ═══════════════════════════════════════ SHELL ════════════ */

const slides = [SlideCover, SlideVision, SlideToday, SlideCoverage, SlideCoverageTarget, SlideHiring, SlideTeamDetail, SlideStaffAug, SlideRoadmapOverview, SlideClosingGoal, SlideResearch, SlideContentDesign]
const darkSlideSet = new Set([0, 2, 4, 5, 8, 10])
const slideMeta = [
  { title: 'Product Design Roadmap', subtitle: 'Cover' },
  { title: "Design's Role at Felix", subtitle: 'Vision' },
  { title: 'Where We Are Now', subtitle: 'Today' },
  { title: 'Current Coverage', subtitle: 'Today' },
  { title: 'With New Hires', subtitle: 'Target' },
  { title: 'Team Build Sequence', subtitle: 'Timeline' },
  { title: 'Team Composition', subtitle: 'Roles' },
  { title: 'Staff Augmentation', subtitle: 'Strategy' },
  { title: 'What This Unlocks', subtitle: 'Roadmap' },
  { title: 'Today vs. End of Year', subtitle: 'Closing' },
  { title: 'Research Model', subtitle: 'Appendix' },
  { title: 'Content Design', subtitle: 'Appendix' },
]
const slideRatingStubs: SlideData[] = slides.map((_, i) => ({ type: 'bullets' as const, bg: darkSlideSet.has(i) ? 'dark' as const : 'light' as const, title: slideMeta[i]?.title ?? '', bullets: [] }))

export default function DesignRoadmapPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('design-roadmap-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('design-roadmap.pdf')
  const { locale, setLocale } = useLocale()
  const slideRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(slideRef, locale, current)
  const total = slides.length

  useEffect(() => { setMounted(true); const h = window.location.hash; if (h) { const n = parseInt(h.replace('#slide-', ''), 10); if (!isNaN(n) && n >= 0 && n < total) setCurrent(n) } }, [total])
  useEffect(() => { if (mounted) window.history.replaceState(null, '', `#slide-${current}`) }, [current, mounted])

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
  const handleTouchEnd = (e: React.TouchEvent) => { if (touchX === null) return; const diff = touchX - e.changedTouches[0].clientX; if (diff > 50) next(); else if (diff < -50) prev(); setTouchX(null) }

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
    <>
    <div className="h-screen w-screen overflow-hidden relative select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-colors duration-500 ${trackBg}`}><div className={`h-full transition-all duration-500 ease-out ${trackFill}`} style={{ width: `${((current + 1) / total) * 100}%` }} /></div>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50"><div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}><span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${pillText}`}>{current + 1} / {total}</span></div></div>
      <SlideTocChrome tocOpen={tocOpen} onToggle={() => setTocOpen(!tocOpen)} tocView={tocView} onViewChange={setTocView} pillBg={pillBg} pillText={pillText} hintText={hintText} onReset={() => setCurrent(0)} commentMode={commentMode} onToggleComments={() => setCommentMode(!commentMode)} locale={locale} onLocaleChange={setLocale} onDownloadPdf={() => downloadPdf({ slideRef, total, currentSlide: current, goToSlide: setCurrent })} />
      <div ref={slideRef} className="group/slide h-full w-full relative" key={current}>
        <div className="h-full w-full animate-in fade-in duration-300"><Slide /></div>
        <SlideCommentLayer slideIndex={current} commentMode={commentMode} comments={comments} onAddComment={addComment} onEditComment={editComment} onDeleteComment={deleteComment} onFlagComment={flagComment} onResolveComment={(id, resolved) => resolveComment(id, resolved)} onAddReply={addReply} onDeleteReply={deleteReply} onExitCommentMode={() => setCommentMode(false)} />
        <div className="absolute bottom-12 right-6 z-[60] opacity-0 group-hover/slide:opacity-100 transition-opacity duration-200"><SlideRating slide={slideRatingStubs[current]} slideIndex={current} source="design-roadmap" dark={darkSlideSet.has(current)} /></div>
      </div>
      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-2">{slides.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${current === i ? `w-8 sm:w-12 ${dotActive}` : `w-1.5 sm:w-2 ${dotInactive}`}`} aria-label={`Go to slide ${i + 1}`} />)}</div>
      <button onClick={prev} disabled={current === 0} className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === 0 ? 'opacity-0 pointer-events-none' : ''}`} aria-label="Previous slide" type="button"><svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
      <button onClick={next} disabled={current === total - 1} className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === total - 1 ? 'opacity-0 pointer-events-none' : ''}`} aria-label="Next slide" type="button"><svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40"><div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}><span className={`text-xs transition-colors duration-500 ${hintText}`}>Swipe to navigate</span></div></div>
      <SlideToc open={tocOpen} onClose={() => setTocOpen(false)} slides={slides} slideMeta={slideMeta} darkSlideSet={darkSlideSet} current={current} view={tocView} onSelect={(i) => { setCurrent(i); setTocOpen(false) }} />
      <SlidePreTranslator slides={slides} locale={locale} />
      <SlidePdfOverlay progress={pdfProgress} onCancel={cancelPdf} />
    </div>
    </>
  )
}
