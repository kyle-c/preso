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
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Design Org</span>
      <span className={`text-xs sm:text-sm absolute left-1/2 -translate-x-1/2 ${dark ? 'text-linen/50' : 'text-muted-foreground'}`}>felixpago.com</span>
      <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-linen' : 'text-foreground'}`}>{num} / {total}</span>
    </div>
  )
}

function PillBadge({ children, dark, color }: { children: React.ReactNode; dark?: boolean; color?: string }) {
  if (color) return (
    <span className="inline-block rounded-full px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] border" style={{ backgroundColor: color + '20', color, borderColor: color + '30' }}>
      {children}
    </span>
  )
  return (
    <span className={`inline-block rounded-full px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] ${dark ? 'bg-turquoise/20 text-turquoise' : 'bg-turquoise text-slate'}`}>
      {children}
    </span>
  )
}

function WarnBox({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-xl px-4 py-3 ${dark ? 'bg-mango/5 border border-mango/15' : 'bg-mango/10 border border-mango/20'}`}>
      <span className="text-mango text-lg leading-none flex-shrink-0">⚠</span>
      <p className={`text-sm leading-relaxed ${dark ? 'text-linen/60' : 'text-muted-foreground'}`}>{children}</p>
    </div>
  )
}

const TOTAL = 13

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE COMPONENTS                       */
/* ═══════════════════════════════════════════════════════════ */

/* ── 1: Title ───────────────────────────────────────────── */
function SlideTitle() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[4%] w-[120px] lg:w-[180px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Stars.svg" />
        </div>
        <div className="absolute bottom-[10%] right-[4%] w-[140px] lg:w-[200px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Speech%20Bubbles%20%2B%20Hearts.svg" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl">
          <div className="mb-6 lg:mb-8">
            <PillBadge dark>Aggressive Hiring Timeline</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
            Product Design Org Build{'\u00A0'}Plan
          </h1>
          <p className="text-lg sm:text-xl text-linen/50 leading-relaxed max-w-2xl">
            All reqs open in parallel. Full core team target: July 2026.{'\u00A0'}Full org target: September{'\u00A0'}2026.
          </p>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} dark />
    </div>
  )
}

/* ── 2: Baseline — March 2026 ───────────────────────────── */
function SlideBaseline() {
  const team = [
    { person: 'You', role: 'Head of Design', type: 'FTE', status: 'Active — stepping out of IC by April', color: C.turquoise },
    { person: 'PD #1', role: 'WhatsApp / Consumer Payments', type: 'FTE', status: 'Good — growing into independence', color: C.cactus },
    { person: 'PD #2', role: 'Checkout / Design Systems', type: 'FTE', status: 'Outgoing — being replaced via aug immediately', color: C.papaya },
    { person: 'Researcher #1', role: 'UX Research', type: 'FTE', status: 'Signed — starts March 23', color: C.blueberry },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[160px] lg:w-[220px] opacity-[0.07] pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
        <Illo src="Survey.svg" />
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[1000px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>March 2026</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-10 lg:mb-12 text-center">
            Baseline
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((t) => (
              <div key={t.person} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 p-5 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-black text-sm text-slate mb-4" style={{ backgroundColor: t.color + '40' }}>
                  {t.person === 'You' ? 'HD' : t.person.replace(/\s/g, '').slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-display font-bold text-base text-foreground mb-1">{t.person}</h3>
                <p className="text-sm text-muted-foreground leading-snug mb-3">{t.role}</p>
                <span className="text-xs text-muted-foreground bg-stone/80 rounded-full px-3 py-1 leading-snug">{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={2} total={TOTAL} />
    </div>
  )
}

/* ── 3: Staff Aug — Single Placement ──────────────────────── */
function SlideStaffAug() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[800px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge>Brief This Week</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-3 text-center">
            Staff Aug — 1{'\u00A0'}Placement
          </h2>
          <p className="text-center text-muted-foreground text-sm sm:text-base mb-7 lg:mb-8 max-w-xl mx-auto">
            Briefed to your vendor this week. Start week of Mar 16 through Sept{'\u00A0'}2026.
          </p>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-6 py-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-display font-black text-xs bg-turquoise text-slate">A1</span>
              <h3 className="font-display font-bold text-lg text-foreground leading-snug">Senior PD, Checkout +{'\u00A0'}Design{'\u00A0'}Systems</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Senior IC. Design systems + checkout/conversion UX. Figma tokens fluency. Ramps in days, not{'\u00A0'}weeks.</p>
            <ul className="space-y-1.5">
              {[
                'Own design system audit &\u00A0execution',
                'Support checkout UI rebuild + future\u00A0redesign',
                'Start system docs before FTE\u00A0arrives',
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-snug">
                  <span className="text-turquoise mt-0.5 flex-shrink-0">○</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-evergreen font-medium">Evaluate month{'\u00A0'}4 (July) — offer before Sept if{'\u00A0'}exceptional</p>
          </div>
        </div>
      </div>
      <SlideFooter num={3} total={TOTAL} />
    </div>
  )
}

/* ── 6: FTE Hiring Phase Title ──────────────────────────── */
function SlideFTETitle() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="mb-4">
            <PillBadge dark>All Reqs Open Now</PillBadge>
          </div>
          <h2 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            FTE Hiring
          </h2>
          <p className="text-xl sm:text-2xl text-linen/50 leading-relaxed">
            6–8 week time-to-hire means every week you delay opening a req is a week pushed off the end{'\u00A0'}date.
          </p>
        </div>
      </div>
      <SlideFooter num={4} total={TOTAL} dark />
    </div>
  )
}

/* ── 7: Hires #1–3 — First Wave FTEs ───────────────────── */
function SlideFirstWave() {
  const hires = [
    {
      num: '1',
      badge: 'Highest Urgency FTE',
      badgeColor: 'text-papaya',
      numBg: 'bg-papaya text-linen',
      title: 'Content Design Lead',
      profile: 'Fintech or regulated industry experience. Localization workflows. Point of view on voice and tone, not just execution. Comfortable working across multiple teams simultaneously.',
      note: 'Unblocks Geos & Pricing immediately',
      noteColor: 'bg-papaya/10 border-papaya/20 text-muted-foreground',
    },
    {
      num: '2',
      badge: 'FTE · Target: Mid May',
      badgeColor: '',
      numBg: 'bg-turquoise text-slate',
      title: 'Senior PD, Checkout + Design Systems',
      profile: 'Has owned a design system end-to-end. Strong checkout UX. Figma variables and tokens expertise. 4-month overlap with Aug #1 for knowledge transfer.',
      note: 'Aug #1 overlap: May–Sept',
      noteColor: 'bg-turquoise/10 border-turquoise/20 text-muted-foreground',
    },
    {
      num: '3',
      badge: 'FTE · Target: Late May',
      badgeColor: '',
      numBg: 'bg-cactus text-slate',
      title: 'PD, Conversational Experiences',
      profile: 'Supports existing WhatsApp designer. Strong conversational and transactional UX. Collaborative — works with your PD, not above them. Good at critique and structured feedback.',
      note: 'Paired support for WhatsApp PD',
      noteColor: 'bg-cactus/10 border-cactus/20 text-muted-foreground',
    },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>All Reqs Open Now</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            First Wave — 3{'\u00A0'}FTEs
          </h2>

          <div className="flex flex-col gap-4">
            {hires.map((h) => (
              <div key={h.num} className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-5 py-4">
                <div className="flex items-start gap-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-display font-black text-sm flex-shrink-0 mt-0.5 ${h.numBg}`}>{h.num}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display font-bold text-lg text-foreground leading-snug">{h.title}</h3>
                      <span className={`text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground flex-shrink-0 ${h.badgeColor}`}>{h.badge}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{h.profile}</p>
                    <span className={`inline-block text-xs font-medium rounded-full px-3 py-1 border ${h.noteColor}`}>{h.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={5} total={TOTAL} />
    </div>
  )
}


/* ── 11: Hire #4 — Credit PD ────────────────────────────── */
function SlideHire4() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-turquoise text-slate font-display font-black text-sm">4</span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">FTE · Target Start: Late June</span>
            </div>
            <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4">
              Product Designer, Credit
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Credit needs dedicated design ownership as the product scales into Series C. High-stakes UX — compliance and trust implications mean this can't be a junior hire.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Req opens', value: 'April' },
                { label: 'Target offer', value: 'Mid June' },
                { label: 'Target start', value: 'Late June' },
              ].map((d) => (
                <div key={d.label} className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">{d.label}</p>
                  <p className="font-display font-bold text-sm text-foreground">{d.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-5 py-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-[0.1em] text-evergreen mb-3">What to look for</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Has designed credit or lending products. Strong interaction design fundamentals. Understands the emotional weight of financial decision-making — anxiety, trust, and clarity are the design problems here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={6} total={TOTAL} />
    </div>
  )
}

/* ── 12: Hire #5 — Researcher #2 ────────────────────────── */
function SlideHire5() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blueberry text-linen font-display font-black text-sm">5</span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">FTE · Target Start: September</span>
            </div>
            <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4">
              UX Researcher{'\u00A0'}#2
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Researcher #1 covers all verticals until Credit and Advisor have dedicated PDs. Once those land, the research load splits. Researcher #2 focuses on Credit, SoV, and Financial Advisor.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Req opens', value: 'July' },
                { label: 'Target offer', value: 'August' },
                { label: 'Target start', value: 'September' },
              ].map((d) => (
                <div key={d.label} className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">{d.label}</p>
                  <p className="font-display font-bold text-sm text-foreground">{d.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-5 py-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-[0.1em] text-evergreen mb-3">What to look for</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comfort with early-stage product research — generative and exploratory. Financial products experience a plus. Can work alongside a more senior researcher and own a research domain independently.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={7} total={TOTAL} />
    </div>
  )
}

/* ── 13: Hire #6 — SoV + Advisor PD ─────────────────────── */
function SlideHire6() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-turquoise text-slate font-display font-black text-sm">6</span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">FTE · Target Start: Late June</span>
            </div>
            <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4">
              Product Designer, SoV + Financial{'\u00A0'}Advisor
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              SoV and Financial Advisor are your Series C narrative. Hiring in parallel with Credit PD means both can onboard together in July — a strong cohort moment.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Req opens', value: 'April' },
                { label: 'Target offer', value: 'Mid June' },
                { label: 'Target start', value: 'Late June' },
              ].map((d) => (
                <div key={d.label} className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">{d.label}</p>
                  <p className="font-display font-bold text-sm text-foreground">{d.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-5 py-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-[0.1em] text-evergreen mb-3">What to look for</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comfort with ambiguity and early-stage product definition. AI-native and conversational UX experience a strong plus for the Advisor surface. Strong interaction design across screen-based and conversational patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} />
    </div>
  )
}

/* ── 10: Org Model — Service vs Embedded ────────────────── */
function SlideOrgModel() {
  const verticals = [
    { name: 'Consumer\nPayments', pds: ['PD #1', 'PD Conversational', 'Sr. PD Geos'], color: C.turquoise },
    { name: 'Checkout +\nSystems', pds: ['Sr. PD Systems'], color: C.cactus },
    { name: 'Credit', pds: ['Credit PD'], color: C.blueberry },
    { name: 'SoV +\nAdvisor', pds: ['SoV/Advisor PD'], color: C.mango },
  ]

  const horizontals = [
    { name: 'UX Research', people: ['Researcher #1', 'Researcher #2'], color: C.blueberry, desc: 'Informs roadmap, not just validates. Domain split at September.' },
    { name: 'Content Design', people: ['Content Design Lead'], color: C.papaya, desc: 'Seat at kickoff, not handoff. Language is product.' },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge dark>How the Org Works</PillBadge>
          </div>
          <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Embedded + Service Model
          </h2>

          {/* Vertical columns — Embedded PDs */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-turquoise" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-turquoise">Embedded into Squads (Verticals)</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {verticals.map((v) => (
                <div key={v.name} className="rounded-xl border p-4 flex flex-col" style={{ borderColor: v.color + '25', backgroundColor: v.color + '08' }}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3 whitespace-pre-line leading-tight" style={{ color: v.color }}>{v.name}</p>
                  <div className="flex flex-col gap-1.5 flex-1">
                    {v.pds.map((pd) => (
                      <span key={pd} className="text-xs font-medium text-linen/70 bg-white/5 rounded-full px-2.5 py-1 text-center">{pd}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal bars — Service Roles */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-mango" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-mango">Service-Based (Horizontals)</span>
            </div>
            <div className="flex flex-col gap-3">
              {horizontals.map((h) => (
                <div key={h.name} className="rounded-xl border px-5 py-3.5 flex items-center gap-5" style={{ borderColor: h.color + '25', backgroundColor: h.color + '08' }}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] flex-shrink-0 w-28" style={{ color: h.color }}>{h.name}</p>
                  <div className="flex gap-2 flex-shrink-0">
                    {h.people.map((p) => (
                      <span key={p} className="text-xs font-medium text-linen/70 bg-white/5 rounded-full px-2.5 py-1">{p}</span>
                    ))}
                  </div>
                  <p className="text-xs text-linen/30 leading-relaxed ml-auto hidden lg:block">{h.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-linen/25 mt-3 text-center leading-relaxed">
              Research and Content Design support all verticals simultaneously — prioritized by org-wide impact, not squad allegiance.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter num={9} total={TOTAL} dark />
    </div>
  )
}

/* ── 15: Timeline at a Glance ───────────────────────────── */
function SlideTimeline() {
  const milestones = [
    { date: 'Mar 9–14', label: 'Brief aug vendor. Open FTE reqs #1, #2, #3. Set expectation with Carla.', urgent: true },
    { date: 'Mar 16', label: 'Aug #1 and #2 placed and onboarding. You step back from IC work.' },
    { date: 'Mar 23', label: 'Researcher #1 starts. Orientation week — no active projects.' },
    { date: 'Late Apr', label: 'Offers out for Content Design Lead, Systems PD, and Conversational PD.' },
    { date: 'Early May', label: 'Open reqs for Credit PD and SoV + Advisor PD.' },
    { date: 'Mid May', label: 'First wave FTEs start. Aug #1 overlap begins.' },
    { date: 'Late May', label: 'Content Design Lead starts. Full Payments coverage achieved.' },
    { date: 'Mid June', label: 'Offers out for Hire #4 (Credit) and Hire #6 (SoV/Advisor).' },
    { date: 'Late Jun', label: 'Hire #4 and #6 start. Core team fully onboarded.' },
    { date: 'July', label: 'Evaluate Aug #1 conversion. Open Hire #5 req. Reassess Payment Bets.' },
    { date: 'Sept', label: 'Aug contracts close. Researcher #2 starts. Full org in place.' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[1000px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>At a Glance</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Timeline
          </h2>

          <div className="space-y-1.5">
            {milestones.map((m, i) => (
              <div key={i} className={`flex gap-4 items-start rounded-lg px-4 py-2.5 ${m.urgent ? 'bg-papaya/10 border border-papaya/20' : 'bg-white/40'}`}>
                <span className={`flex-shrink-0 w-[72px] text-right font-display font-bold text-xs ${m.urgent ? 'text-papaya' : 'text-foreground'}`}>{m.date}</span>
                <div className={`w-px self-stretch flex-shrink-0 ${m.urgent ? 'bg-papaya/30' : 'bg-border'}`} />
                <p className={`text-sm leading-relaxed ${m.urgent ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={10} total={TOTAL} />
    </div>
  )
}

/* ── 16: End State — September 2026 ─────────────────────── */
function SlideEndState() {
  const roles = [
    { role: 'You — Head of Design', type: 'FTE', vertical: 'Org-wide', color: C.turquoise },
    { role: 'PD #1 (existing)', type: 'FTE', vertical: 'WhatsApp / Consumer Payments', color: C.turquoise },
    { role: 'Senior PD — Checkout + Systems', type: 'FTE', vertical: 'Platform + Checkout', color: C.turquoise },
    { role: 'PD — Conversational Experiences', type: 'FTE', vertical: 'Consumer Payments', color: C.turquoise },
    { role: 'Content Design Lead', type: 'FTE', vertical: 'All verticals', color: C.papaya },
    { role: 'Researcher #1', type: 'FTE', vertical: 'Consumer Payments', color: C.blueberry },
    { role: 'Credit PD', type: 'FTE', vertical: 'Credit', color: C.turquoise },
    { role: 'SoV + Advisor PD', type: 'FTE', vertical: 'Store of Value + Advisor', color: C.turquoise },
    { role: 'Researcher #2', type: 'FTE', vertical: 'Credit + SoV + Advisor', color: C.blueberry },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 text-center">
            <PillBadge dark>September 2026</PillBadge>
          </div>
          <h2 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            End State
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {roles.map((r) => (
              <div key={r.role} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-linen truncate">{r.role}</p>
                  <p className="text-xs text-linen/40 truncate">{r.vertical}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="font-display font-black text-3xl sm:text-4xl text-turquoise">9 ICs + you = 10</p>
          </div>
        </div>
      </div>
      <SlideFooter num={11} total={TOTAL} dark />
    </div>
  )
}

/* ── 17: Leadership Notes ───────────────────────────────── */
function SlideLeadershipNotes() {
  const notes = [
    {
      title: 'This week is the highest-leverage week',
      body: 'Everything downstream depends on actions taken before March 14. Aug brief, FTE reqs open, Carla expectation set. If these slip a week, every date shifts a week.',
    },
    {
      title: 'You exit IC when aug lands',
      body: 'March 16 aug placements means fully out of hands-on design by March 23 — the same week your researcher starts. That\'s when you become a design leader.',
    },
    {
      title: 'Run the July cohort as a team moment',
      body: 'Hire #4 and #6 starting together is an opportunity. Onboard as a cohort — a shared first week builds cross-vertical relationships.',
    },
    {
      title: 'Researcher split at September',
      body: 'When Researcher #2 lands, have an explicit conversation about domain ownership. Avoid both pulling toward the same high-visibility projects.',
    },
    {
      title: 'Aug #1 conversion is a July decision',
      body: 'By July you\'ll know if they\'re exceptional. The conversion offer needs to happen before they start looking elsewhere. Don\'t wait until August.',
    },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[160px] lg:w-[220px] opacity-[0.07] pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
        <Illo src="Hand%20-%20Stars.svg" />
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Leadership</PillBadge>
          </div>
          <h2 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Notes for You
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((n, i) => (
              <div key={i} className={`bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 px-5 py-4 ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                <h3 className="font-display font-bold text-foreground text-sm leading-snug mb-2">{n.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={12} total={TOTAL} />
    </div>
  )
}

/* ── 18: Closing ────────────────────────────────────────── */
function SlideClosing() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] right-[6%] w-[100px] lg:w-[140px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Star%20-%20Perks.svg" />
        </div>
        <div className="absolute bottom-[10%] left-[4%] w-[120px] lg:w-[160px] opacity-[0.05] -rotate-12" style={{ animation: 'ds-float 9s ease-in-out infinite 1s' }}>
          <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <h2 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
            Build the team that builds the{'\u00A0'}product
          </h2>
          <p className="text-lg sm:text-xl text-linen/50 leading-relaxed max-w-2xl">
            Every hire is a chance to raise the quality bar. Start this{'\u00A0'}week.
          </p>
        </div>
      </div>
      <SlideFooter num={13} total={TOTAL} dark />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE SHELL                             */
/* ═══════════════════════════════════════════════════════════ */

const slides = [
  SlideTitle, SlideBaseline, SlideStaffAug,
  SlideFTETitle, SlideFirstWave,
  SlideHire4, SlideHire5, SlideHire6, SlideOrgModel,
  SlideTimeline, SlideEndState, SlideLeadershipNotes, SlideClosing,
]

const slideMeta = [
  { title: 'Design Org Build Plan', subtitle: 'Aggressive Hiring Timeline' },
  { title: 'Baseline — March 2026', subtitle: 'Current Team' },
  { title: 'Staff Aug — 2 Placements', subtitle: 'Brief This Week' },
  { title: 'FTE Hiring', subtitle: 'All Reqs Open Now' },
  { title: 'First Wave — 3 FTEs', subtitle: 'Content · Systems · Conversational' },
  { title: 'Hire #4: Credit PD', subtitle: 'Target: Late June' },
  { title: 'Hire #5: Researcher #2', subtitle: 'Target: September' },
  { title: 'Hire #6: SoV + Advisor PD', subtitle: 'Target: Late June' },
  { title: 'Embedded + Service Model', subtitle: 'How the Org Works' },
  { title: 'Timeline', subtitle: 'At a Glance' },
  { title: 'End State', subtitle: 'September 2026' },
  { title: 'Leadership Notes', subtitle: 'For You' },
  { title: 'Build the Team', subtitle: 'Closing' },
]

const darkSlideSet = new Set([0, 3, 8, 10, 12])

export default function DesignOrgPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('design-org-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('design-org.pdf')
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
