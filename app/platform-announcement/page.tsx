'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SlideToc, SlideTocChrome } from '@/components/slide-toc'
import { useComments, SlideCommentLayer } from '@/components/slide-comments'
import { useLocale, useSlideTranslation, SlidePreTranslator } from '@/components/slide-translation'
import { useSlidePdf } from '@/components/use-slide-pdf'
import { SlidePdfOverlay } from '@/components/slide-pdf-overlay'
import { PresentationPassword } from '@/components/presentation-password'

/* ─────────────────────── Colors ─────────────────────── */

const C = {
  turquoise: '#2BF2F1', slate: '#082422', blueberry: '#6060BF',
  evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38',
  papaya: '#F26629', lime: '#DCFF00', lychee: '#FFCD9C',
  sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867',
}

/* ─────────────────────── Shared Components ─────────────────────── */

function Illo({ src, className }: { src: string; className?: string }) {
  return (
    <object
      type="image/svg+xml"
      data={`/illustrations/${src}`}
      className={className ?? 'w-full h-auto'}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}

function SlideFooter({ num, total, dark }: { num: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Platform Announcement</span>
      <span className={`text-xs sm:text-sm absolute left-1/2 -translate-x-1/2 ${dark ? 'text-linen/50' : 'text-muted-foreground'}`}>felixpago.com</span>
      <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-linen' : 'text-foreground'}`}>{num} / {total}</span>
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

const TOTAL = 16

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE COMPONENTS                       */
/* ═══════════════════════════════════════════════════════════ */

/* ── Slide 1: Title ────────────────────────────────────────── */
function SlideTitle() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[4%] w-[120px] lg:w-[180px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[10%] right-[4%] w-[140px] lg:w-[200px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl">
          <div className="mb-6 lg:mb-8">
            <PillBadge dark>2026</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
            Platform{'\u00A0'}Announcement
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-linen/50 leading-relaxed max-w-2xl">
            From a single product to a multi-product platform. A fundamental shift in how we build.
          </p>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 2: Agenda ────────────────────────────────────────── */
function SlideAgenda() {
  const items = [
    { num: '01', label: 'Vision & Why', color: C.turquoise },
    { num: '02', label: 'Platform Principles', color: C.cactus },
    { num: '03', label: 'Platform vs. Business Lines', color: C.blueberry },
    { num: '04', label: 'Migration Plan', color: C.mango },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[800px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Overview</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-10 lg:mb-14 text-center">
            Agenda
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.num} className="flex items-center gap-5 bg-white rounded-xl px-6 py-5 border border-border shadow-sm">
                <span className="font-display font-black text-2xl" style={{ color: item.color }}>{item.num}</span>
                <div className="h-px flex-1 max-w-6" style={{ background: item.color, opacity: 0.3 }} />
                <h3 className="font-display font-bold text-xl text-foreground">{item.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={2} total={TOTAL} />
    </div>
  )
}

/* ── Slide 3: What Users Tell Us ────────────────────────────── */
function SlideUserInsights() {
  const insights = [
    { emoji: '\uD83D\uDCB8', title: 'Remittances Are Priority', desc: 'The first financial product they need when navigating a new life in the US. Everything starts here.', color: C.turquoise },
    { emoji: '\uD83D\uDCAC', title: 'Users Trust Human Experiences', desc: 'Trust comes from human interaction, not just slick UX. We replicate the warmth of "la tiendita" — digitally.', color: C.cactus },
    { emoji: '\uD83E\uDD33', title: 'WhatsApp Is Already Home', desc: 'Users already use WhatsApp for receipts & updates. We meet them where they live.', color: C.blueberry },
    { emoji: '\uD83E\uDD11', title: 'Users Want to Grow Wealth', desc: 'Low cost, high value solutions are critical. They are savers — remittances are a form of savings.', color: C.mango },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute top-[6%] right-[3%] w-[110px] lg:w-[160px] opacity-[0.06] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="Hand%20-%20Star%20-%20Perks.svg" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge dark>Vision</PillBadge>
          </div>
          <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4 text-center">
            What Users Have Told{'\u00A0'}Us
          </h2>
          <p className="text-center text-linen/40 text-lg mb-8 lg:mb-10 max-w-2xl mx-auto">
            Felix&apos;s vision is to be the Trusted Financial Companion for Latinos in the{'\u00A0'}US.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((ins) => (
              <div key={ins.title} className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ins.color }} />
                <span className="text-3xl mb-3 block">{ins.emoji}</span>
                <h3 className="font-display font-extrabold text-linen text-base leading-snug mb-2">{ins.title}</h3>
                <p className="text-sm text-linen/50 leading-relaxed">{ins.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={3} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 4: Master Plan - WhatsApp First ──────────────────── */
function SlideMasterPlan1() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[6%] right-[3%] w-[130px] lg:w-[180px] opacity-[0.1] pointer-events-none rotate-6" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
        <Illo src="Hand%20-%20Cell%20Phone%20OK.svg" />
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-3xl text-center">
          <div className="mb-5 lg:mb-6">
            <PillBadge>Master Plan</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
            Start With a Human Experience on{'\u00A0'}WhatsApp
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
            Start with WhatsApp, then evolve to multi-channel strategically.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['WhatsApp', 'Instagram', 'SMS', 'Mobile App', 'Website', 'Voice'].map((ch, i) => (
              <span key={ch} className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${i === 0 ? 'bg-cactus/20 text-evergreen border-2 border-cactus/30' : 'bg-white border border-border text-muted-foreground'}`}>
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={4} total={TOTAL} />
    </div>
  )
}

/* ── Slide 5: Master Plan - Money Movement ──────────────────── */
function SlideMasterPlan2() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute top-[8%] left-[3%] w-[100px] lg:w-[150px] opacity-[0.06] -rotate-12 pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <Illo src="Dollar%20Bills%20%2B%20Coins.svg" />
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-[1200px] w-full items-center">
          <div>
            <div className="mb-5 lg:mb-6">
              <PillBadge dark>Engine</PillBadge>
            </div>
            <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-6">
              World-Class Money Movement{'\u00A0'}Engine
            </h2>
            <p className="text-lg text-linen/50 leading-relaxed">
              Leveraging Crypto (Stablecoins) and TradFi strategically to power seamless payments.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-turquoise/10 border border-turquoise/20 rounded-2xl p-6">
              <h3 className="font-display font-bold text-turquoise text-sm uppercase tracking-wider mb-3">Now &amp; Beyond &apos;26</h3>
              <ul className="space-y-2">
                {['Seamless and various pay-ins', 'Optimal FX rates', 'Instant pay-out', 'Cash universal availability'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: C.turquoise }} />
                    <span className="text-base text-linen/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-display font-bold text-linen/40 text-sm uppercase tracking-wider mb-3">Later (&apos;27+)</h3>
              <ul className="space-y-2">
                {['DeFi lending', 'Yield generation via staking'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-linen/30" />
                    <span className="text-base text-linen/50">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={5} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 6: Full Financial Ecosystem ──────────────────────── */
function SlideEcosystem() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[5%] left-[3%] w-[120px] lg:w-[170px] opacity-[0.1] pointer-events-none -rotate-6" style={{ animation: 'ds-drift 10s ease-in-out infinite 1s' }}>
        <Illo src="Map%20%2B%20F%20symbol.svg" />
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-3xl text-center">
          <div className="mb-5 lg:mb-6">
            <PillBadge>Ecosystem</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
            Full Service Financial{'\u00A0'}Ecosystem
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
            Create an ecosystem of products adjacent to the remittance, solving our users&apos; pain points. Build stickiness, retention, and replace remittance margins if{'\u00A0'}needed.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Consumer Payments', sub: 'Remittances, top-ups, bill pay', color: C.turquoise },
              { label: 'Consumer Credit', sub: 'SNPL, personal loans', color: C.blueberry },
              { label: 'Store of Value', sub: 'Wallets with yield', color: C.cactus },
              { label: 'And More\u2026', sub: 'Financial advisor, etc.', color: C.mango },
            ].map((p) => (
              <div key={p.label} className="bg-white rounded-xl p-4 border border-border shadow-sm text-left">
                <div className="w-2 h-2 rounded-full mb-3" style={{ background: p.color }} />
                <h3 className="font-display font-bold text-sm text-foreground leading-snug mb-1">{p.label}</h3>
                <p className="text-xs text-muted-foreground leading-snug">{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={6} total={TOTAL} />
    </div>
  )
}

/* ── Slide 7: Emulate the Best ──────────────────────────────── */
function SlideEmulate() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute top-[5%] right-[4%] w-[110px] lg:w-[160px] opacity-[0.06] rotate-12 pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 max-w-[1200px] w-full items-center">
          <div>
            <div className="mb-5 lg:mb-6">
              <PillBadge dark>Approach</PillBadge>
            </div>
            <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-6">
              Emulate the Best Consumer{'\u00A0'}Fintechs
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-4">
              <p className="text-sm text-linen/40 italic leading-relaxed">This is not a magic bullet. It will take time and iterations — we should be comfortable with the{'\u00A0'}journey.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-turquoise/10 border border-turquoise/20 rounded-2xl p-6">
              <h3 className="font-display font-bold text-turquoise text-sm uppercase tracking-wider mb-3">Product Lines</h3>
              <ul className="space-y-2">
                {['Consumer payments: remittances, top-ups, bill pay', 'Consumer credit: SNPL, personal loans', 'Store of value with yield capabilities'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: C.turquoise }} />
                    <span className="text-sm text-linen/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-display font-bold text-linen/50 text-sm uppercase tracking-wider mb-3">Shared Platforms</h3>
              <ul className="space-y-2">
                {['Smartly share messaging infra, identity, money movement, ledgers', 'Fundamental shift in how product & engineering operate'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-linen/30" />
                    <span className="text-sm text-linen/50">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={7} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 8: Platform Principles ───────────────────────────── */
function SlidePrinciples() {
  const principles = [
    { num: '01', title: 'Build Once, Deploy\u00A0Everywhere', desc: 'Decouple logic from UI to sync updates across surfaces.', color: C.turquoise },
    { num: '02', title: 'Plug-and-Play\u00A0Products', desc: 'Standardize "Lego block" services to launch new features in weeks, not months.', color: C.cactus },
    { num: '03', title: 'Single Source of\u00A0Truth', desc: '100% consistency in business rules and data, regardless of device.', color: C.blueberry },
    { num: '04', title: 'Drastic\u00A0Velocity', desc: 'Eliminate redundant engineering work across teams.', color: C.mango },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute top-[6%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.1] pointer-events-none -rotate-6" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
        <Illo src="Hand%20-%20Tool%20-%20Spanner%20Dark.svg" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Principles</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Platform{'\u00A0'}Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {principles.map((p) => (
              <div key={p.num} className="bg-white rounded-2xl p-7 sm:p-8 border border-border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: p.color }} />
                <span className="absolute top-4 right-5 font-display font-black text-[72px] leading-none opacity-[0.05] select-none pointer-events-none">{p.num}</span>
                <h3 className="font-display font-extrabold text-foreground text-xl leading-snug mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} />
    </div>
  )
}

/* ── Slide 9: The Stack ─────────────────────────────────────── */
function SlideStack() {
  const layers = [
    { label: 'Business Lines', items: ['Consumer Payments', 'Credit', 'Store of Value', 'Advisor', 'Etc.'], color: C.turquoise, bg: 'bg-turquoise/15 border-turquoise/20' },
    { label: 'Surface & UX', items: ['WhatsApp', 'IG', 'SMS', 'App', 'Web'], color: C.cactus, bg: 'bg-cactus/15 border-cactus/20' },
    { label: 'Omnichannel & Applied AI', items: ['Agents', 'LLMs', 'Orchestration'], color: C.blueberry, bg: 'bg-blueberry/15 border-blueberry/20' },
    { label: 'Fintech Core', items: ['Payments', 'Disbursements', 'FX', 'Fraud', 'Identity'], color: C.mango, bg: 'bg-mango/15 border-mango/20' },
    { label: 'Infra', items: ['AWS', 'etc.'], color: C.concrete, bg: 'bg-white/5 border-white/10' },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[900px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge dark>Architecture</PillBadge>
          </div>
          <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            The{'\u00A0'}Stack
          </h2>
          <div className="space-y-3">
            {layers.map((l) => (
              <div key={l.label} className={`rounded-xl border p-4 sm:p-5 ${l.bg}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h3 className="font-display font-bold text-sm sm:text-base shrink-0 min-w-[180px]" style={{ color: l.color }}>{l.label}</h3>
                  <div className="flex flex-wrap gap-2 ml-auto justify-end">
                    {l.items.map((item) => (
                      <span key={item} className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-white/10 text-linen/60">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={9} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 10: From App to OS ───────────────────────────────── */
function SlideAppToOS() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[8%] right-[4%] w-[140px] lg:w-[200px] opacity-[0.1] pointer-events-none rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="Fast.svg" />
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-3xl text-center">
          <h2 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
            From a single app to an operating{'\u00A0'}system
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            The platform provides the kernel. Business lines are the{'\u00A0'}apps.
          </p>
        </div>
      </div>
      <SlideFooter num={10} total={TOTAL} />
    </div>
  )
}

/* ── Slide 11: Platform vs Business Lines ───────────────────── */
function SlidePlatformVsBiz() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge dark>Structure</PillBadge>
          </div>
          <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Platforms vs. Business{'\u00A0'}Lines
          </h2>

          <div className="relative w-full max-w-[1100px] mx-auto">
            {/* Business line vertical bars */}
            <div className="flex gap-3 mb-4">
              {[
                { name: 'Consumer Payments', items: ['Remittances', 'Top-ups', 'P2P', 'Bill pay'] },
                { name: 'Credit', items: ['SNPL', 'Personal loans', 'Credit card'] },
                { name: 'Store of Value', items: ['Deposits', 'Yield', 'Investments'] },
                { name: 'Financial Advisor', items: ['And other bets…'] },
              ].map((b) => (
                <div key={b.name} className="flex-1 rounded-xl border-2 border-turquoise/30 bg-turquoise/[0.08] pt-4 pb-4 px-4">
                  <h4 className="font-display font-bold text-sm text-turquoise text-center leading-tight mb-3">{b.name}</h4>
                  <div className="space-y-1.5">
                    {b.items.map((item) => (
                      <div key={item} className="bg-white/[0.06] rounded-md px-2.5 py-1.5 text-center">
                        <span className="text-[11px] text-linen/50 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Platform horizontal bands below */}
            <div className="space-y-2">
              {[
                { name: 'Surface & UX', sub: 'WhatsApp, IG, SMS, Mobile App, Website', color: C.cactus },
                { name: 'Omnichannel & Applied AI', sub: 'Agents, LLMs, Infra', color: C.blueberry },
                { name: 'Fintech Core', sub: 'Payments, Disbursements, FX, Fraud, Identity', color: C.mango },
                { name: 'Infra', sub: 'AWS, etc.', color: C.concrete },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-3 rounded-lg border border-dashed px-5 py-3" style={{ borderColor: `${p.color}35`, background: `${p.color}08` }}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className="font-display font-bold text-sm text-linen/80 shrink-0">{p.name}</span>
                  <span className="text-sm text-linen/40 ml-auto">{p.sub}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded border-2 border-turquoise/60 bg-turquoise/[0.08]" />
                <span className="text-sm font-semibold text-turquoise uppercase tracking-wider">Business Lines</span>
                <span className="text-xs text-linen/40 ml-1">define steps, funnel, prices & KPIs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded border border-dashed border-linen/40" />
                <span className="text-sm font-semibold text-linen/60 uppercase tracking-wider">Platforms</span>
                <span className="text-xs text-linen/40 ml-1">define experience regardless of product</span>
              </div>
            </div>

            <p className="text-xs text-linen/40 text-center mt-3 italic">Note: Enterprise AI is a separate chapter</p>
          </div>
        </div>
      </div>
      <SlideFooter num={11} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 12: Eng Org ──────────────────────────────────────── */
function SlideEngOrg() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1000px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Engineering</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4 text-center">
            Product Eng{'\u00A0'}Org
          </h2>

          {/* Leader */}
          <p className="text-center text-muted-foreground text-lg mb-8">
            <span className="font-display font-bold text-foreground">Rodrigo Lima</span> · Director of Product Engineering
          </p>

          {/* Squads organized as vertical columns by category */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { color: C.turquoise, squads: ['Chat Upper Funnel', 'Partners'] },
              { color: C.blueberry, squads: ['Chat Lower Funnel', 'Front End (Web, App)', 'SNPL Conversational Flow'] },
              { color: C.cactus, squads: ['Bets', 'Promos'] },
              { color: C.mango, squads: ['Geo Expansion'] },
            ].map((col, i) => (
              <div key={i} className="rounded-2xl border-2 p-4 space-y-2.5 shadow-sm" style={{ borderColor: `${col.color}50`, background: `${col.color}10` }}>
                {col.squads.map((s) => (
                  <div key={s} className="bg-white rounded-lg px-3 py-2.5 text-center border border-border shadow-sm">
                    <span className="font-display font-semibold text-sm text-foreground leading-snug">{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={12} total={TOTAL} />
    </div>
  )
}

/* ── Slide 13: Omnichannel Layer ────────────────────────────── */
function SlideOmnichannel() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute bottom-[6%] left-[3%] w-[120px] lg:w-[170px] opacity-[0.06] pointer-events-none -rotate-6" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <Illo src="Hand%20-%20Speech%20Bubbles.svg" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[900px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge dark>Platform</PillBadge>
          </div>
          <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4 text-center">
            Omnichannel Platform{'\u00A0'}Layer
          </h2>
          <p className="text-center text-linen/40 text-lg mb-8 lg:mb-10">
            Nacho Varela leading the omnichannel{'\u00A0'}platform
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Omni-Channel Messaging', desc: 'End-to-end messaging pipes across all surfaces', color: C.turquoise },
              { title: 'Support Infra', desc: 'TBD: support infrastructure layer', color: C.blueberry },
              { title: 'Current Messaging', desc: 'Existing messaging end-to-end', color: C.cactus },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: item.color }} />
                <h3 className="font-display font-extrabold text-sm leading-snug mb-2" style={{ color: item.color }}>{item.title}</h3>
                <p className="text-sm text-linen/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={13} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 14: Migration Plan ───────────────────────────────── */
function SlideMigration() {
  const phases = [
    { phase: 'Q1', title: 'Basic Changes', color: C.turquoise, items: ['Same OKRs', 'Chat product becomes "Consumer Payments"', 'Chat engineers split: some stay in Consumer Payments (Rodrigo Lima), some move to Omnichannel (Nacho Varela)'] },
    { phase: 'Q2', title: 'Detailed Changes', color: C.cactus, items: ['Transition begins with new OKRs', 'Second-order organizational changes', 'Continue iterating on structure'] },
    { phase: 'Q3-Q4', title: 'Iterate & Optimize', color: C.mango, items: ['Continue optimizing the migration', 'Refine platform boundaries', 'Stabilize new team structures'] },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute top-[5%] right-[3%] w-[110px] lg:w-[150px] opacity-[0.1] pointer-events-none rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="3%20Paper%20Airplanes%20%2B%20Coins.svg" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Migration</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Migration{'\u00A0'}Plan
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {phases.map((p) => (
              <div key={p.phase} className="bg-white rounded-2xl p-7 sm:p-8 border border-border shadow-sm">
                <span className="inline-block rounded-full px-4 py-1 text-sm font-semibold text-slate mb-4" style={{ background: p.color }}>{p.phase}</span>
                <h3 className="font-display font-extrabold text-foreground text-2xl lg:text-3xl leading-snug mb-5">{p.title}</h3>
                <ul className="space-y-3">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: p.color }} />
                      <span className="text-sm text-muted-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={14} total={TOTAL} />
    </div>
  )
}

/* ── Slide 16: Closing ──────────────────────────────────────── */
function SlideClosing() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.08] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[10%] right-[5%] w-[120px] lg:w-[160px] opacity-[0.08] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <span className="text-6xl mb-6">{'\uD83D\uDCAA'}</span>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
            It Will Make Us{'\u00A0'}Stronger
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            Let&apos;s prepare for a period of learnings and iterating. It will be an adjustment that takes energy, but will make us{'\u00A0'}stronger.
          </p>
        </div>
      </div>
      <SlideFooter num={16} total={TOTAL} />
    </div>
  )
}

/* ── Slide 17: Let's Finish the Job ────────────────────────── */
function SlideFinishTheJob() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.08] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[10%] right-[5%] w-[120px] lg:w-[160px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="mb-4 lg:mb-6 w-[400px] h-[300px] sm:w-[540px] sm:h-[405px] lg:w-[700px] lg:h-[525px]" style={{ mask: 'linear-gradient(to right, transparent 5%, black 25%, black 75%, transparent 95%), linear-gradient(to bottom, transparent 5%, black 25%, black 75%, transparent 95%)', maskComposite: 'intersect', WebkitMask: 'linear-gradient(to right, transparent 5%, black 25%, black 75%, transparent 95%), linear-gradient(to bottom, transparent 5%, black 25%, black 75%, transparent 95%)', WebkitMaskComposite: 'source-in' }}>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/fY7l2pcxdHM?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0"
              title="Job not finished"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
            Let&apos;s finish the{'\u00A0'}job.
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-linen/50 leading-relaxed max-w-2xl">
            The platform is the path. The team is ready. Now we{'\u00A0'}execute.
          </p>
        </div>
      </div>
      <SlideFooter num={18} total={TOTAL} dark />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE SHELL                             */
/* ═══════════════════════════════════════════════════════════ */

const slides = [
  SlideTitle, SlideAgenda, SlideUserInsights, SlideMasterPlan1,
  SlideMasterPlan2, SlideEcosystem, SlideEmulate, SlidePrinciples,
  SlideStack, SlideAppToOS, SlidePlatformVsBiz, SlideEngOrg,
  SlideOmnichannel, SlideMigration, SlideClosing, SlideFinishTheJob,
]

const slideMeta = [
  { title: 'Platform Announcement', subtitle: '2026' },
  { title: 'Agenda', subtitle: 'Overview' },
  { title: 'What Users Have Told Us', subtitle: 'Vision' },
  { title: 'WhatsApp First', subtitle: 'Master Plan' },
  { title: 'Money Movement Engine', subtitle: 'Master Plan' },
  { title: 'Financial Ecosystem', subtitle: 'Ecosystem' },
  { title: 'Emulate the Best', subtitle: 'Approach' },
  { title: 'Platform Principles', subtitle: 'Principles' },
  { title: 'The Stack', subtitle: 'Architecture' },
  { title: 'From App to Operating System', subtitle: 'Analogy' },
  { title: 'Platforms vs. Business Lines', subtitle: 'Structure' },
  { title: 'Product Eng Org', subtitle: 'Engineering' },
  { title: 'Omnichannel Layer', subtitle: 'Platform' },
  { title: 'Migration Plan', subtitle: 'Transition' },
  { title: 'It Will Make Us Stronger', subtitle: 'Closing' },
  { title: 'Let\'s Finish the Job', subtitle: 'Closing' },
]

const darkSlideSet = new Set([0, 2, 4, 6, 8, 10, 12, 15])

export default function PlatformAnnouncementPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('platform-announcement-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('platform-announcement.pdf')
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
        <div
          className={`h-full transition-all duration-500 ease-out ${trackFill}`}
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}>
          <span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${pillText}`}>
            {current + 1} / {total}
          </span>
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

      <div ref={slideRef} className="h-full w-full relative" key={current}>
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
      </div>

      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              current === i
                ? `w-8 sm:w-12 ${dotActive}`
                : `w-1.5 sm:w-2 ${dotInactive}`
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={prev}
        disabled={current === 0}
        className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        aria-label="Previous slide"
        type="button"
      >
        <svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        disabled={current === total - 1}
        className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === total - 1 ? 'opacity-0 pointer-events-none' : ''}`}
        aria-label="Next slide"
        type="button"
      >
        <svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}>
          <span className={`text-xs transition-colors duration-500 ${hintText}`}>Swipe to navigate</span>
        </div>
      </div>

      <SlideToc
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        slides={slides}
        slideMeta={slideMeta}
        darkSlideSet={darkSlideSet}
        current={current}
        view={tocView}
        onSelect={(i) => { setCurrent(i); setTocOpen(false) }}
      />
      <SlidePreTranslator slides={slides} locale={locale} />
        <SlidePdfOverlay progress={pdfProgress} onCancel={cancelPdf} />
    </div>
    </PresentationPassword>
  )
}
