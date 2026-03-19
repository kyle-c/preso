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
import { CheckCircle2, ArrowRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, Line, ComposedChart,
  LineChart, ResponsiveContainer,
  Cell, PieChart, Pie,
  ScatterChart, Scatter, ZAxis,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip,
} from 'recharts'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

/* ─────────────────────── Slide Data ─────────────────────── */

const principles = [
  'We are obsessed about our customers',
  'We get sh*t done with urgency and focus',
  'We collaborate without ego',
  'We practice extreme ownership',
  'We aim for insanely great',
  'We are insatiably curious',
]

const rules = [
  {
    number: 1,
    title: 'Share Impactful Updates',
    body: 'Focus on key metrics, efficiency, and valuable insights aligned with company values.',
    extra: 'For each highlight or learning, consider: *Does this show impact? How does it connect to our quarterly goals?*',
  },
  {
    number: 2,
    title: 'Be Concise:',
    titleSuffix: ' Keep updates brief and to the point.',
    bullets: [
      'Add the number of minutes you\u2019ll take to present.',
      'If sharing some slides, no more than 4',
    ],
    extra: 'We\u2019ll track your presentation with a timer based on that.',
  },
  {
    number: 3,
    title: 'Limit Demos:',
    titleSuffix: ' Have links ready and keep demos under 2 minutes.',
  },
  {
    number: 4,
    title: 'Use a Clear Structure',
    bullets: [
      { text: 'Objective: Goal of the initiative', bold: false },
      { text: 'Action: What was done', bold: false },
      { text: 'Impact: Results or learnings', bold: true },
      { text: 'Next Steps (If applicable)', bold: false },
    ],
  },
]

const agenda = [
  { label: 'Icebreaker', time: '3 min', link: false },
  { label: 'F\u00e9lixBook', time: '10 min', link: false, notionLink: '#' },
  { label: 'Weekly Recap', time: '5 min', link: false },
  { label: 'F\u00e9lix Weekly Updates', time: '35-40 min', link: false },
]

type StatusColor = 'olive' | 'red' | 'green' | 'yellow'

interface GoalRow {
  kr: string
  krSuffix?: string
  status: StatusColor
  pct: number
  rangeMin: string
  rangeMax: string
}

interface Objective {
  label: string
  bg: 'turquoise' | 'lime' | 'black'
  rows: GoalRow[]
}

const objectives: Objective[] = [
  {
    label: 'Reduce chaos caused\nby the geese',
    bg: 'turquoise',
    rows: [
      { kr: 'Zero goose-related HR incidents', krSuffix: ' (currently 14)', status: 'red', pct: 12, rangeMin: '14', rangeMax: '0' },
      { kr: '85% of visitors not chased by a goose', status: 'olive', pct: 63, rangeMin: '54%', rangeMax: '85%' },
      { kr: 'Successfully relocate Gerald the alpha goose', status: 'red', pct: 0, rangeMin: '', rangeMax: '' },
    ],
  },
  {
    label: 'Convince the capybaras\nto do literally anything',
    bg: 'lime',
    rows: [
      { kr: 'At least 1 capybara visibly awake during zoo hours', status: 'green', pct: 47, rangeMin: '0', rangeMax: '1' },
    ],
  },
  {
    label: 'Urgent Animal Situations',
    bg: 'black',
    rows: [
      { kr: 'Find out who taught the parrot to say "you\'re fired"', status: 'yellow', pct: 0, rangeMin: '', rangeMax: '' },
      { kr: 'Stop the raccoons from unionizing', status: 'olive', pct: 0, rangeMin: '', rangeMax: '' },
    ],
  },
]

/* ──────────────────────── Footer ─────────────────────────── */

function SlideFooter({ num, dark }: { num: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <div className="relative flex items-center justify-between">
        <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-white' : 'text-foreground'}`}>Team Weekly</span>
        <span className={`absolute inset-x-0 text-center text-xs sm:text-sm pointer-events-none ${dark ? 'text-white/50' : 'text-muted-foreground'}`}>felixpago.com</span>
        <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-white' : 'text-foreground'}`}>{num}</span>
      </div>
    </div>
  )
}

/* ──────────────────── Pill Badge ─────────────────────────── */

function PillBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-turquoise px-5 py-1.5 font-display font-extrabold text-slate text-lg sm:text-xl lg:text-2xl">
      {children}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE COMPONENTS                       */
/* ═══════════════════════════════════════════════════════════ */

/* ── Slide 1: Felix North Star ────────────────────────────── */
function SlideNorthStar() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      {/* Decorative collage — scattered money illustrations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Flying dollar bill — top left */}
        <div className="absolute top-[8%] left-[3%] w-[180px] lg:w-[240px] opacity-[0.18] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <object type="image/svg+xml" data="/illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Cloud coin — top center-right */}
        <div className="absolute top-[12%] right-[28%] w-[100px] lg:w-[140px] opacity-[0.15] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <object type="image/svg+xml" data="/illustrations/Cloud%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Dollar bill — right edge */}
        <div className="absolute top-[25%] right-[2%] w-[150px] lg:w-[200px] opacity-[0.16] rotate-[18deg]" style={{ animation: 'ds-float 8s ease-in-out infinite 2s' }}>
          <object type="image/svg+xml" data="/illustrations/Dollar%20bill.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Coin — small accent, top right */}
        <div className="absolute top-[6%] right-[12%] w-[40px] lg:w-[55px] opacity-[0.2]" style={{ animation: 'ds-drift 6s ease-in-out infinite 0.5s' }}>
          <object type="image/svg+xml" data="/illustrations/Coin%20-%20Lime.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Dollar bills + coins — bottom center */}
        <div className="absolute bottom-[6%] left-[35%] w-[220px] lg:w-[300px] opacity-[0.18] rotate-3" style={{ animation: 'ds-float 10s ease-in-out infinite 1.5s' }}>
          <object type="image/svg+xml" data="/illustrations/Dollar%20bills%20%2B%20Coins%20A.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Cloud coin — bottom right */}
        <div className="absolute bottom-[14%] right-[8%] w-[130px] lg:w-[170px] opacity-[0.14] -rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite 3s' }}>
          <object type="image/svg+xml" data="/illustrations/Cloud%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Small coin — left mid */}
        <div className="absolute top-[52%] left-[8%] w-[35px] lg:w-[45px] opacity-[0.22] rotate-12" style={{ animation: 'ds-float 6s ease-in-out infinite' }}>
          <object type="image/svg+xml" data="/illustrations/Coin%20-%20Lime.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 lg:mb-8 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px]">
              <object type="image/svg+xml" data="/illustrations/F%C3%A9lix%20Illo%201.svg" className="h-full w-full" style={{ pointerEvents: 'none' }} aria-label="Félix mascot" />
            </div>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              F&eacute;lix<br />North Star
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Become the companion for Latinos in the United States enabling them to access financial services throughout their journey as immigrants.
            </p>
          </div>

          {/* Right */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm">
            <div className="mb-8 lg:mb-10">
              <PillBadge>Mission</PillBadge>
              <p className="mt-5 text-xl sm:text-2xl lg:text-[28px] text-foreground leading-relaxed">
                To empower Latinos in the US to care for what matters most back home.
              </p>
            </div>

            <div>
              <PillBadge>Key Principles</PillBadge>
              <ul className="mt-6 space-y-4">
                {principles.map((p) => (
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
      <SlideFooter num={2} />
    </div>
  )
}

/* ── Slide 2: Rules of the Land ───────────────────────────── */
function RuleCard({ num, children }: { num: number; children: React.ReactNode }) {
  const scheme = ruleCardColors[(num - 1) % ruleCardColors.length]
  return (
    <div className="relative rounded-xl overflow-hidden p-8 sm:p-10 lg:p-12" style={{ background: scheme.bg }}>
      <span className="absolute right-5 top-1 select-none font-display text-[120px] sm:text-[150px] lg:text-[180px] font-black leading-none pointer-events-none" style={{ color: scheme.num }}>
        {num}
      </span>
      <img
        src={scheme.illo}
        alt=""
        className="absolute bottom-[-10%] right-[-5%] w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] object-contain select-none pointer-events-none"
        style={{ opacity: scheme.illoOpacity }}
      />
      <div className="relative flex flex-col gap-5 max-w-[75%]">
        {children}
      </div>
    </div>
  )
}

function SlideRules() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-16 sm:px-20 lg:px-24 py-8 sm:py-10 overflow-hidden">
        <div className="w-full">
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 sm:mb-8 lg:mb-10">
            Rules of the land
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
            {/* Card 1 — turquoise bg, dark text */}
            <RuleCard num={1}>
              <h3 className="font-display font-extrabold text-slate text-2xl lg:text-3xl leading-snug max-w-[65%]">
                Share What Matters
              </h3>
              <p className="text-xl lg:text-2xl text-slate/60 leading-relaxed">
                Lead with metrics, impact, and insights tied to quarterly goals.
              </p>
              <p className="text-xl lg:text-2xl text-slate/60 leading-relaxed">
                Ask yourself: <em className="text-slate/80">Does this show impact? Does it connect to what we&apos;re building?</em>
              </p>
            </RuleCard>

            {/* Card 2 — blueberry bg, white text */}
            <RuleCard num={2}>
              <h3 className="font-display font-extrabold text-white text-2xl lg:text-3xl leading-snug max-w-[65%]">
                Be Concise
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-white/40 mt-0.5" strokeWidth={1.5} />
                  <span className="text-xl lg:text-2xl text-white/70 leading-relaxed">State your time upfront — we&apos;ll hold you to it.</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-white/40 mt-0.5" strokeWidth={1.5} />
                  <span className="text-xl lg:text-2xl text-white/70 leading-relaxed">Cap slide decks at 4 slides max.</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-white/40 mt-0.5" strokeWidth={1.5} />
                  <span className="text-xl lg:text-2xl text-white/70 leading-relaxed">If it can be a one-liner, make it a one-liner.</span>
                </li>
              </ul>
            </RuleCard>

            {/* Card 3 — cactus bg, dark text */}
            <RuleCard num={3}>
              <h3 className="font-display font-extrabold text-slate text-2xl lg:text-3xl leading-snug max-w-[65%]">
                Limit Demos
              </h3>
              <p className="text-xl lg:text-2xl text-slate/60 leading-relaxed">
                Keep demos under 2 minutes. Have links ready so anyone can dig deeper async.
              </p>
            </RuleCard>

            {/* Card 4 — mango bg, dark text */}
            <RuleCard num={4}>
              <h3 className="font-display font-extrabold text-slate text-2xl lg:text-3xl leading-snug max-w-[65%]">
                Follow the Structure
              </h3>
              <ul className="space-y-4">
                {[
                  'Objective — Goal of the initiative',
                  'Action — What was done',
                  'Impact — Results or learnings',
                  'Next Steps — If applicable',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-slate/40 mt-0.5" strokeWidth={1.5} />
                    <span className="text-xl lg:text-2xl leading-relaxed text-slate/60">{text}</span>
                  </li>
                ))}
              </ul>
            </RuleCard>
          </div>
        </div>
      </div>
      <SlideFooter num={3} />
    </div>
  )
}

/* ── Slide 3: Agenda ──────────────────────────────────────── */
function SlideAgenda() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      {/* Decorative background illustration */}
      <div className="absolute -bottom-4 -right-4 w-[320px] h-[320px] lg:w-[420px] lg:h-[420px] opacity-[0.15] pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <object type="image/svg+xml" data="/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" className="h-full w-full" style={{ pointerEvents: 'none' }} aria-hidden="true" />
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — Agenda card */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm">
            <div className="mb-8 lg:mb-10">
              <PillBadge>Agenda</PillBadge>
            </div>
            <ul className="space-y-6 sm:space-y-8">
              {agenda.map((item) => (
                <li key={item.label} className="flex items-center gap-4">
                  <ArrowRight className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 text-foreground" strokeWidth={2.5} />
                  <span className="text-xl sm:text-2xl lg:text-[28px] text-foreground leading-snug">
                    <span className="font-semibold">{item.label}</span>
                    <span className="font-normal text-muted-foreground"> — {item.time}</span>
                    {'notionLink' in item && (
                      <a href={(item as { notionLink: string }).notionLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-2 text-muted-foreground hover:text-foreground transition-colors align-middle">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Title + Illustration */}
          <div className="flex flex-col justify-start items-start lg:items-end">
            <div className="-mt-16 sm:-mt-20 lg:-mt-28 mb-4 lg:mb-6 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px]">
              <object type="image/svg+xml" data="/illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg" className="h-full w-full" style={{ pointerEvents: 'none' }} aria-label="Paper airplanes and coins" />
            </div>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8 lg:text-right">
              Feb. 23rd —<br />Feb. 27th
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg lg:text-right">
              Weekly sync for all teams. Come prepared with your updates and keep it concise.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter num={5} />
    </div>
  )
}

/* ── Slide 4: Goals for Q1 2026 ───────────────────────────── */

function statusLabel(s: StatusColor) {
  switch (s) {
    case 'green': return 'On Track'
    case 'olive': return 'In Progress'
    case 'red': return 'At Risk'
    case 'yellow': return 'Not Started'
  }
}

function statusBgClass(s: StatusColor) {
  switch (s) {
    case 'green': return 'bg-cactus/15 text-evergreen'
    case 'olive': return 'bg-lime/20 text-slate'
    case 'red': return 'bg-papaya/15 text-papaya'
    case 'yellow': return 'bg-mango/15 text-mango'
  }
}

const accentMap = {
  turquoise: 'bg-turquoise',
  lime: 'bg-lime',
  black: 'bg-slate',
}

function SlideGoals() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute -bottom-4 -right-4 w-[320px] h-[320px] lg:w-[400px] lg:h-[400px] opacity-[0.12] pointer-events-none -rotate-12" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}>
        <object type="image/svg+xml" data="/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" className="h-full w-full" style={{ pointerEvents: 'none' }} aria-hidden="true" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-16 sm:px-20 lg:px-24 pt-14 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 lg:pb-10 overflow-auto relative z-10">
        <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 sm:mb-8 lg:mb-10">
          Zoo Goals for Q1 2025
        </h1>

        <div className="space-y-5 lg:space-y-6 flex-1">
          {objectives.map((obj) => (
            <div key={obj.label} className="rounded-xl border border-border bg-white overflow-hidden">
              {/* Objective header with colored accent */}
              <div className="flex items-stretch">
                <div className={`w-2 ${accentMap[obj.bg]} flex-shrink-0`} />
                <div className="flex-1 px-6 sm:px-8 py-4 sm:py-5 border-b border-border">
                  <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl lg:text-2xl leading-snug">
                    {obj.label.replace(/\n/g, ' ')}
                  </h3>
                </div>
              </div>

              {/* Key Results */}
              <div className="divide-y divide-border/60">
                {obj.rows.map((row) => (
                  <div key={row.kr} className="flex items-center gap-4 sm:gap-6 lg:gap-8 px-8 sm:px-10 py-4 sm:py-5">
                    {/* KR description */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg lg:text-xl text-foreground leading-snug">
                        {row.kr}
                        {row.krSuffix && <span className="text-muted-foreground">{row.krSuffix}</span>}
                      </p>
                    </div>

                    {/* Status pill */}
                    <span className={`flex-shrink-0 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold ${statusBgClass(row.status)}`}>
                      {statusLabel(row.status)}
                    </span>

                    {/* Progress bar or pending */}
                    <div className="flex-shrink-0 w-[200px] sm:w-[260px] lg:w-[320px]">
                      {row.pct > 0 ? (
                        <div>
                          <div className="flex h-7 sm:h-8 w-full overflow-hidden rounded-lg">
                            <div className="bg-turquoise flex items-center justify-center transition-all" style={{ width: `${Math.min(row.pct, 100)}%` }}>
                              {row.pct >= 25 && <span className="text-xs sm:text-sm font-display font-extrabold text-slate">{row.pct}%</span>}
                            </div>
                            <div className="bg-stone flex-1 flex items-center justify-center">
                              {row.pct < 25 && <span className="text-xs sm:text-sm font-display font-extrabold text-muted-foreground">{row.pct}%</span>}
                            </div>
                          </div>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-[10px] sm:text-xs text-muted-foreground/60">{row.rangeMin}</span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground/60">{row.rangeMax}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-7 sm:h-8 w-full items-center justify-center rounded-lg bg-stone">
                          <span className="text-xs sm:text-sm text-muted-foreground/50 italic">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Slide 5: Our Values (fanned deck) ────────────────────── */

const values = [
  {
    num: '01',
    title: 'User-Obsession',
    lines: [
      'We have to earn the right to serve our users every day and never take it for granted.',
      'We always remember the hard work our users went through to send this money.',
      'We are always here for them.',
    ],
    bg: 'bg-slate-950',
    text: 'text-white',
    mutedText: 'text-slate-300',
    numColor: 'text-slate-800',
    illustration: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
  },
  {
    num: '02',
    title: 'Getting Sh*t Done\nWith Urgency',
    lines: [
      'We have a bias towards action.',
      'Champions adjust!',
      'We care less about what others are doing and focus on what we want to accomplish.',
    ],
    bg: 'bg-turquoise-300',
    text: 'text-slate-950',
    mutedText: 'text-slate-800',
    numColor: 'text-turquoise-700/25',
    illustration: '/illustrations/Fast.svg',
  },
  {
    num: '03',
    title: 'Extreme\nOwnership',
    lines: [
      'Each person in the company owns a mission-critical piece of the vision.',
      'No weak links.',
      'No passengers.',
    ],
    bg: 'bg-evergreen',
    text: 'text-white',
    mutedText: 'text-turquoise-200',
    numColor: 'text-slate-800/30',
    illustration: '/illustrations/Heart%20-F%C3%A9lix.svg',
  },
  {
    num: '04',
    title: 'No-Ego\nCollab',
    lines: [
      'We disagree clearly, and we commit once a decision is made.',
      'We break silos, we move in lockstep.',
      'We are a team, not a group of individuals.',
    ],
    bg: 'bg-stone',
    text: 'text-slate-950',
    mutedText: 'text-slate-600',
    numColor: 'text-concrete/40',
    illustration: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    illustrationSize: 'w-36 h-36',
  },
  {
    num: '05',
    title: 'Aim For\nInsanely Great',
    lines: [
      'We elevate the quality of our output by caring deeply.',
      'We obsess about every customer moment.',
    ],
    bg: 'bg-turquoise-300',
    text: 'text-slate-950',
    mutedText: 'text-slate-800',
    numColor: 'text-turquoise-700/25',
    illustration: '/illustrations/ray.svg',
  },
  {
    num: '06',
    title: 'Insatiable\nCuriosity',
    lines: [
      'We listen closely to our users and base our assumptions in data.',
      'We test assumptions and never take anything for granted.',
      'We experiment relentlessly.',
    ],
    bg: 'bg-slate-950',
    text: 'text-white',
    mutedText: 'text-slate-300',
    numColor: 'text-slate-800',
    illustration: '/illustrations/Magnifying%20Glass.svg',
  },
]

/* Card positions: fanned out with slight overlap */
const cardPositions = [
  { rot: -14, tx: -550, ty: 24 },
  { rot: -8.5, tx: -330, ty: 10 },
  { rot: -2.5, tx: -110, ty: 0 },
  { rot: 2.5, tx: 110, ty: 0 },
  { rot: 8.5, tx: 330, ty: 10 },
  { rot: 14, tx: 550, ty: 24 },
]

function SlideValues() {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      {/* Decorative background illustrations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Paper airplane — top left */}
        <div className="absolute top-[4%] left-[2%] w-[160px] lg:w-[220px] opacity-[0.14] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <object type="image/svg+xml" data="/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Cloud coin — top right */}
        <div className="absolute top-[6%] right-[3%] w-[100px] lg:w-[140px] opacity-[0.16] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <object type="image/svg+xml" data="/illustrations/Cloud%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Coin — small accent, left mid */}
        <div className="absolute top-[48%] left-[3%] w-[40px] lg:w-[55px] opacity-[0.2] rotate-12" style={{ animation: 'ds-float 6s ease-in-out infinite 0.5s' }}>
          <object type="image/svg+xml" data="/illustrations/Coin%20-%20Lime.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Dollar bills + coins — bottom left */}
        <div className="absolute bottom-[4%] left-[4%] w-[180px] lg:w-[240px] opacity-[0.15] rotate-3" style={{ animation: 'ds-drift 10s ease-in-out infinite 2s' }}>
          <object type="image/svg+xml" data="/illustrations/Dollar%20bills%20%2B%20Coins%20A.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Rocket — bottom right */}
        <div className="absolute bottom-[2%] right-[2%] w-[200px] lg:w-[280px] opacity-[0.12] -rotate-6" style={{ animation: 'ds-float 9s ease-in-out infinite 1.5s' }}>
          <object type="image/svg+xml" data="/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        {/* Small coin — right mid */}
        <div className="absolute top-[55%] right-[4%] w-[35px] lg:w-[45px] opacity-[0.18]" style={{ animation: 'ds-drift 7s ease-in-out infinite 3s' }}>
          <object type="image/svg+xml" data="/illustrations/Coin%20-%20Lime.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 pb-32 relative z-10">
        {/* Title */}
        <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 sm:mb-8 lg:mb-10 text-center">
          Our Values
        </h1>

        {/* Card deck container */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: '100%', height: 420 }}
        >
          {values.map((v, i) => {
            const isActive = activeCard === i
            const pos = cardPositions[i]

            const baseTransform = `rotate(${pos.rot}deg) translateX(${pos.tx}px) translateY(${pos.ty}px)`
            const activeTransform = `rotate(${pos.rot * 0.3}deg) translateX(${pos.tx}px) translateY(${pos.ty - 30}px) scale(1.05)`

            return (
              <div
                key={v.num}
                className="absolute cursor-pointer"
                style={{
                  width: 260,
                  height: 390,
                  transform: isActive ? activeTransform : baseTransform,
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, filter 0.3s ease',
                  zIndex: isActive ? 50 : 10 + i,
                  filter: !isActive && activeCard !== null ? 'brightness(0.92)' : 'none',
                }}
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div
                  className={`${v.bg} h-full w-full rounded-2xl p-6 flex flex-col shadow-lg overflow-hidden relative`}
                  style={{
                    boxShadow: isActive
                      ? '0 20px 40px -8px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)'
                      : '0 8px 24px -4px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Big background number + illustration overlay */}
                  <div className="relative h-[140px] mb-2">
                    <span
                      className={`absolute inset-0 flex items-center justify-center font-display font-black text-[130px] leading-none select-none pointer-events-none ${v.numColor}`}
                    >
                      {v.num}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <img src={v.illustration} alt="" className={v.illustrationSize ?? 'w-28 h-28'} style={{ pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`relative z-10 font-display font-black text-xl leading-tight mb-4 ${v.text}`}>
                    {v.title.split('\n').map((line, li) => (
                      <span key={li}>
                        {li > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </h3>

                  {/* Body text */}
                  <div className="relative z-10 flex-1 flex flex-col gap-2.5">
                    {v.lines.map((line) => (
                      <p key={line} className={`text-sm leading-snug ${v.mutedText}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <SlideFooter num={6} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*         DATA VISUALIZATION SLIDES (25 chart types)         */
/* ═══════════════════════════════════════════════════════════ */

const C = { turquoise: '#2BF2F1', slate: '#082422', blueberry: '#6060BF', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', sage: '#7BA882', lime: '#DCFF00', lychee: '#FFCD9C', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867' }

const ruleCardColors = [
  { bg: C.turquoise, num: 'rgba(8,36,34,0.08)', illo: '/illustrations/Hand - Stars.svg', illoOpacity: 1 },
  { bg: C.blueberry, num: 'rgba(255,255,255,0.1)', illo: '/illustrations/Fast.svg', illoOpacity: 1 },
  { bg: C.cactus, num: 'rgba(8,36,34,0.08)', illo: '/illustrations/Hand - Cell Phone OK.svg', illoOpacity: 1 },
  { bg: C.mango, num: 'rgba(8,36,34,0.08)', illo: '/illustrations/Check.svg', illoOpacity: 1 },
]

/* ── Background illustration pool ─────────────────────────── */
const bgIllustrations = [
  '/illustrations/Hand - Dollar Bills 1.svg',
  '/illustrations/Hand - Dollar Bills 2.svg',
  '/illustrations/Hand - Card 1.svg',
  '/illustrations/Hand - Cell Phone OK.svg',
  '/illustrations/Hand - Star - Perks.svg',
  '/illustrations/Hand - Stars.svg',
  '/illustrations/Rocket Launch + Coin - Growth - Lime.svg',
  '/illustrations/Paper Airplane + Dollar Bills.svg',
  '/illustrations/Cell Phone + Flying Dollar Bills - Turquoise.svg',
  '/illustrations/Flying Dollar Bills - Turquoise.svg',
  '/illustrations/Gift Box + Coins.svg',
  '/illustrations/Cloud Coin - Turquoise.svg',
  '/illustrations/Calculator + Stack of coins.svg',
  '/illustrations/Speech Bubbles + Hearts.svg',
  '/illustrations/Headphones.svg',
  '/illustrations/Map.svg',
  '/illustrations/Diffusion.svg',
  '/illustrations/Fast.svg',
  '/illustrations/Lock.svg',
  '/illustrations/Party Popper.svg',
  '/illustrations/Dollar bills + Coins A.svg',
  '/illustrations/Coins x2 v1.svg',
  '/illustrations/Stack of coins - Lime.svg',
  '/illustrations/3 Paper Airplanes + Coins.svg',
  '/illustrations/Speaker + Dollar Bill.svg',
]

function getSlideIllustration(num: number) {
  const idx = ((num * 7 + 3) % bgIllustrations.length)
  const positions: { css: React.CSSProperties; deg: number }[] = [
    { css: { right: '-5%', bottom: '-8%' }, deg: 12 },
    { css: { right: '-3%', top: '5%' }, deg: -8 },
    { css: { left: '35%', bottom: '-10%' }, deg: 18 },
    { css: { right: '8%', bottom: '2%' }, deg: -15 },
    { css: { right: '-2%', top: '10%' }, deg: 22 },
  ]
  const pos = positions[num % positions.length]
  return { src: bgIllustrations[idx], css: pos.css, deg: pos.deg }
}

/* ── Shared chart layout ─────────────────────────────────── */
function ChartSlide({ num, bg, dark, brand, badge, title, stat, statLabel, desc, bullets, children }: {
  num: number; bg: string; dark?: boolean; brand?: boolean; badge: string; title: string; stat?: string; statLabel?: string; desc: string; bullets?: string[]; children: React.ReactNode
}) {
  const illo = getSlideIllustration(num)
  // brand = turquoise bg with dark slate text
  const badgeCls = brand ? 'bg-slate/15 text-slate' : dark ? 'bg-white/10 text-turquoise-300' : 'bg-turquoise/20 text-turquoise-700'
  const titleCls = brand ? 'text-slate' : dark ? 'text-white' : 'text-slate'
  const statCls = brand ? 'text-slate' : dark ? 'text-turquoise-400' : 'text-turquoise-700'
  const labelCls = brand ? 'text-slate/60' : dark ? 'text-white/50' : 'text-muted-foreground'
  const descCls = brand ? 'text-slate/60' : dark ? 'text-white/50' : 'text-muted-foreground'
  const dotCls = brand ? 'bg-slate/40' : dark ? 'bg-turquoise-400' : 'bg-turquoise-600'
  const bulletCls = brand ? 'text-slate/50' : dark ? 'text-white/40' : 'text-muted-foreground/80'
  return (
    <div className={`relative h-full w-full ${bg} flex flex-col overflow-hidden`}>
      {/* Semi-transparent background illustration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={illo.src}
          alt=""
          className="absolute w-[320px] h-[320px] object-contain select-none"
          style={{
            ...illo.css,
            opacity: brand ? 0.08 : dark ? 0.04 : 0.06,
            transform: `rotate(${illo.deg}deg)`,
            filter: dark ? 'brightness(2)' : 'none',
          }}
        />
      </div>
      <div className="flex-1 flex pl-24 sm:pl-36 lg:pl-44 pr-2 sm:pr-4 lg:pr-6 pt-8 sm:pt-12 pb-8 relative z-10 gap-6 lg:gap-8">
        {/* Left — editorial text column (wider) */}
        <div className="w-[420px] flex-shrink-0 flex flex-col justify-center">
          <span className={`inline-block rounded-full px-5 py-1.5 text-xs font-bold tracking-wide uppercase mb-3 w-fit ${badgeCls}`}>
            {badge}
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-[0.9] tracking-tight mb-3 ${titleCls}`}>
            {title}
          </h2>
          {stat && (
            <div className="flex items-baseline gap-3 mb-2">
              <span className={`font-display text-5xl lg:text-6xl font-black ${statCls}`}>{stat}</span>
              {statLabel && <span className={`text-sm font-sans ${labelCls}`}>{statLabel}</span>}
            </div>
          )}
          <p className={`text-sm sm:text-base leading-relaxed mb-4 max-w-[380px] ${descCls}`}>{desc}</p>
          {bullets && bullets.length > 0 && (
            <ul className="space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} />
                  <span className={`text-base leading-snug ${bulletCls}`}>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Right — chart card (compact) */}
        <div className="flex-1 min-w-0 flex items-center justify-center max-w-[55%]">
          {children}
        </div>
      </div>
      <SlideFooter num={num} dark={dark || brand} />
    </div>
  )
}

/* ── 5b: Product Demo ────────────────────────────────────── */
function SlideProductDemo() {
  const illo = getSlideIllustration(6)
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src={illo.src} alt="" className="absolute w-[320px] h-[320px] object-contain select-none"
          style={{ ...illo.css, opacity: 0.04, transform: `rotate(${illo.deg}deg)`, filter: 'brightness(2)' }} />
      </div>
      <div className="flex-1 flex items-center justify-center px-32 sm:px-48 lg:px-64 py-8 sm:py-10 relative z-10 gap-12 lg:gap-20">
        {/* Left — editorial content */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <span className="inline-block rounded-full bg-white/10 px-5 py-1.5 text-xs font-bold tracking-wide uppercase text-turquoise-300 mb-4 w-fit">Product Demo</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tight mb-4">
            Send Money<br />in 60 Seconds
          </h2>
          <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-[480px]">
            Our remittance flow is designed for speed and trust. Three screens, one tap to confirm, real-time delivery tracking.
          </p>

          <div className="space-y-6">
            {[
              { label: 'Corridor Selection', desc: 'Auto-detected based on user profile and recent sends. One tap to confirm or change.' },
              { label: 'Amount & FX Lock', desc: 'Live exchange rate with 30-second lock. Recipient sees exact payout in local currency.' },
              { label: 'Review & Confirm', desc: 'Single-screen summary with biometric confirmation. No hidden fees, no surprises.' },
            ].map((step, i) => (
              <div key={step.label} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-turquoise/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-display font-black text-turquoise text-sm">{i + 1}</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-base mb-1">{step.label}</h4>
                  <p className="text-sm text-white/40 leading-relaxed max-w-[400px]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — embedded mobile device */}
        <div className="flex-shrink-0 flex items-center">
          <div className="relative w-[390px]">
            {/* Phone frame */}
            <div className="rounded-[48px] border-[8px] border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-[32px] bg-slate-900 rounded-b-2xl z-10" />
              </div>
              {/* Iframe */}
              <iframe
                src="/fintechtestflow/embed"
                className="w-full border-0"
                style={{ height: '844px' }}
                title="Felix Send Flow Demo"
              />
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[120px] h-[5px] rounded-full bg-white/20" />
          </div>
        </div>
      </div>
      <SlideFooter num={6} dark />
    </div>
  )
}

/* ── 5c: Org Chart ───────────────────────────────────────── */
const orgData = {
  name: 'Manuel Godoy', role: 'CEO', color: C.turquoise, initials: 'MG',
  reports: [
    { name: 'Carlos Reyes', role: 'CTO', color: C.blueberry, initials: 'CR',
      reports: [
        { name: 'Lucía Herrera', role: 'VP Engineering', color: C.cactus, initials: 'LH' },
        { name: 'Diego Solano', role: 'VP Data', color: C.sage, initials: 'DS' },
      ] },
    { name: 'Sofía Delgado', role: 'CFO', color: C.mango, initials: 'SD',
      reports: [
        { name: 'Mateo Ríos', role: 'Dir. Finance', color: C.lychee, initials: 'MR' },
      ] },
    { name: 'Valentina Cruz', role: 'CPO', color: C.papaya, initials: 'VC',
      reports: [
        { name: 'Andrés Peña', role: 'Dir. Product', color: C.lime, initials: 'AP' },
        { name: 'Camila Torres', role: 'Dir. Design', color: C.sky, initials: 'CT' },
      ] },
    { name: 'Ricardo Mora', role: 'COO', color: C.evergreen, initials: 'RM',
      reports: [
        { name: 'Isabel Vargas', role: 'Dir. Ops', color: C.mocha, initials: 'IV' },
      ] },
  ],
}

function OrgAvatar({ name, role, color, initials, size = 'md' }: { name: string; role: string; color: string; initials: string; size?: 'lg' | 'md' }) {
  const dim = size === 'lg' ? 'w-32 h-32' : 'w-20 h-20'
  const textSz = size === 'lg' ? 'text-4xl' : 'text-xl'
  const nameSz = size === 'lg' ? 'text-lg' : 'text-base'
  const roleSz = size === 'lg' ? 'text-base' : 'text-sm'
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`${dim} rounded-full flex items-center justify-center shadow-lg ring-[3px] ring-white/20`} style={{ background: color }}>
        <span className={`font-display font-black text-slate ${textSz}`}>{initials}</span>
      </div>
      <div className="text-center">
        <p className={`font-display font-bold text-white ${nameSz} leading-tight`}>{name}</p>
        <p className={`text-white/50 ${roleSz} leading-tight`}>{role}</p>
      </div>
    </div>
  )
}

function SlideOrgChart() {
  const illo = getSlideIllustration(6)
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src={illo.src} alt="" className="absolute w-[320px] h-[320px] object-contain select-none"
          style={{ ...illo.css, opacity: 0.04, transform: `rotate(${illo.deg}deg)`, filter: 'brightness(2)' }} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-4 relative z-10">
        {/* Title — centered above CEO */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-[10px] font-bold tracking-wide uppercase text-turquoise-300 mb-2">Leadership</span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white leading-[0.9] tracking-tight">Our Team</h2>
        </div>

        {/* CEO */}
        <OrgAvatar {...orgData} size="lg" />

        {/* Connector line from CEO */}
        <div className="w-px h-5 bg-white/15" />

        {/* Horizontal line spanning C-suite */}
        <div className="relative w-[1300px] max-w-full">
          <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-white/15" />

          {/* C-suite row */}
          <div className="flex justify-between pt-0">
            {orgData.reports.map((exec) => (
              <div key={exec.name} className="flex flex-col items-center" style={{ width: `${100 / orgData.reports.length}%` }}>
                {/* Vertical connector from horizontal line */}
                <div className="w-px h-5 bg-white/15" />
                <OrgAvatar {...exec} />

                {/* Director reports */}
                {exec.reports && exec.reports.length > 0 && (
                  <>
                    <div className="w-px h-4 bg-white/10 mt-1.5" />
                    {exec.reports.length > 1 && (
                      <div className="relative w-full">
                        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-white/10" />
                      </div>
                    )}
                    <div className={`flex ${exec.reports.length > 1 ? 'gap-14' : ''} mt-0`}>
                      {exec.reports.map((dir) => (
                        <div key={dir.name} className="flex flex-col items-center">
                          {exec.reports!.length > 1 && <div className="w-px h-3 bg-white/10" />}
                          <OrgAvatar name={dir.name} role={dir.role} color={dir.color} initials={dir.initials} size="md" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={7} dark />
    </div>
  )
}

/* ── 6: Bar Chart (Vertical) ─────────────────────────────── */
const barData = [
  { country: 'Mexico', volume: 4200 }, { country: 'Guatemala', volume: 2800 },
  { country: 'El Salvador', volume: 1900 }, { country: 'Honduras', volume: 1600 },
  { country: 'Colombia', volume: 1200 }, { country: 'Nicaragua', volume: 800 },
  { country: 'Dom. Rep.', volume: 600 },
]
const barConfig = { volume: { label: 'Transactions', color: C.turquoise } } satisfies ChartConfig

function SlideBarChart() {
  return (
    <ChartSlide num={9} bg="bg-slate-950" dark badge="Bar Chart" title="Transaction Volume by Corridor" stat="12.3K" statLabel="weekly transactions" desc="Vertical bar charts compare numerical values across categories. Mexico leads all corridors with 4.2K weekly sends." bullets={['Mexico accounts for 34% of total weekly volume', 'Central America growing 18% month-over-month', 'Dominican Republic corridor launched 6 weeks ago']}>
      <div className="w-full h-[75%] bg-white/5 rounded-2xl border border-white/10 p-5">
        <ChartContainer config={barConfig} className="h-full w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px] [&_.recharts-cartesian-axis-tick_text]:fill-white/50">
          <BarChart data={barData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="country" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
              {barData.map((_, i) => {
                const barColors = [C.turquoise, C.cactus, C.blueberry, C.mango, C.papaya, C.sage, C.lychee]
                return <Cell key={i} fill={barColors[i]} opacity={0.85} />
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 6b: Stacked Bar Chart ────────────────────────────────── */
const stackedBarData = [
  { quarter: 'Q1', remit: 2800, credit: 400, billpay: 300, savings: 150 },
  { quarter: 'Q2', remit: 3200, credit: 600, billpay: 450, savings: 200 },
  { quarter: 'Q3', remit: 3600, credit: 900, billpay: 550, savings: 320 },
  { quarter: 'Q4', remit: 4100, credit: 1200, billpay: 700, savings: 420 },
]
const stackedBarConfig = {
  remit: { label: 'Remittances', color: C.turquoise },
  credit: { label: 'Credit', color: C.blueberry },
  billpay: { label: 'Bill Pay', color: C.mango },
  savings: { label: 'Savings', color: C.cactus },
} satisfies ChartConfig

function SlideStackedBar() {
  return (
    <ChartSlide num={10} bg="bg-turquoise" brand badge="Stacked Bar Chart" title="Revenue Growth by Product" stat="$6.4M" statLabel="Q4 total" desc="Stacked bars reveal both total growth and product mix shifts. Every product line grew, but credit building tripled its share." bullets={['Remittances still anchors 64% of total revenue', 'Credit building tripled from Q1 to Q4', 'Savings launched mid-year, already 7% of mix']}>
      <div className="w-full h-[75%] bg-slate-950/90 rounded-2xl border border-white/10 p-5">
        <ChartContainer config={stackedBarConfig} className="h-full w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
          <BarChart data={stackedBarData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="quarter" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.3)" />
            <YAxis tickLine={false} axisLine={false} width={36} stroke="rgba(255,255,255,0.3)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="savings" stackId="a" fill={C.cactus} radius={[0, 0, 0, 0]} />
            <Bar dataKey="billpay" stackId="a" fill={C.mango} />
            <Bar dataKey="credit" stackId="a" fill={C.blueberry} />
            <Bar dataKey="remit" stackId="a" fill={C.turquoise} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 6c: Horizontal Bar Chart ────────────────────────────── */
const hBarData = [
  { corridor: 'Mexico', nps: 82 },
  { corridor: 'Guatemala', nps: 74 },
  { corridor: 'El Salvador', nps: 71 },
  { corridor: 'Colombia', nps: 68 },
  { corridor: 'Honduras', nps: 65 },
  { corridor: 'Dom. Rep.', nps: 61 },
  { corridor: 'Nicaragua', nps: 58 },
]
const hBarColors = [C.turquoise, C.cactus, C.blueberry, C.papaya, C.mango, C.lychee, C.sage]
const hBarConfig = { nps: { label: 'NPS', color: C.turquoise } } satisfies ChartConfig

function SlideHorizontalBar() {
  return (
    <ChartSlide num={11} bg="bg-slate-950" dark badge="Horizontal Bar Chart" title="NPS by Corridor" stat="+82" statLabel="Mexico NPS" desc="Horizontal bars rank and compare across categories. Mexico leads satisfaction — Nicaragua shows the most room for improvement." bullets={['Top 3 corridors all exceed industry benchmark of 70', 'Nicaragua NPS rose 12 pts after local support launch', 'Corridor NPS correlates 0.91 with repeat send rate']}>
      <div className="w-full h-[75%] bg-white/5 rounded-2xl border border-white/10 p-5">
        <ChartContainer config={hBarConfig} className="h-full w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px] [&_.recharts-cartesian-axis-tick_text]:fill-white/50">
          <BarChart data={hBarData} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} domain={[0, 100]} />
            <YAxis type="category" dataKey="corridor" tickLine={false} axisLine={false} width={80} />
            <Bar dataKey="nps" radius={[0, 4, 4, 0]}>
              {hBarData.map((_, i) => <Cell key={i} fill={hBarColors[i]} opacity={0.85} />)}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 7: Line Chart ────────────────────────────────────────── */
const lineData = [
  { month: 'Jul', users: 42 }, { month: 'Aug', users: 58 }, { month: 'Sep', users: 71 },
  { month: 'Oct', users: 89 }, { month: 'Nov', users: 104 }, { month: 'Dec', users: 118 },
  { month: 'Jan', users: 137 }, { month: 'Feb', users: 156 },
]
const lineConfig = { users: { label: 'MAU (thousands)', color: C.turquoise } } satisfies ChartConfig

function SlideLineChart() {
  return (
    <ChartSlide num={12} bg="bg-stone" badge="Line Chart" title="Monthly Active Users" stat="156K" statLabel="MAU in February" desc="Line charts display trends over continuous intervals. Felix MAU grew 271% in 8 months across all corridors." bullets={['Organic growth drives 62% of new sign-ups', 'Referral program boosted October acquisition by 40%', 'Retention rate holds steady at 78% after 90 days']}>
      <div className="w-full h-[75%] bg-white rounded-2xl border border-border p-5">
        <ChartContainer config={lineConfig} className="h-full w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
          <AreaChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <defs>
              <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.turquoise} stopOpacity={0.2} />
                <stop offset="100%" stopColor={C.turquoise} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="users" fill="url(#mauGrad)" stroke={C.turquoise} strokeWidth={2.5} dot={{ r: 4, fill: C.turquoise, strokeWidth: 0 }} />
          </AreaChart>
        </ChartContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 7b: Multi-Line Chart ─────────────────────────────────── */
const multiLineData = [
  { month: 'Jan', mx: 42, gt: 18, co: 8, sv: 12 },
  { month: 'Feb', mx: 48, gt: 20, co: 11, sv: 14 },
  { month: 'Mar', mx: 55, gt: 22, co: 15, sv: 13 },
  { month: 'Apr', mx: 63, gt: 19, co: 19, sv: 16 },
  { month: 'May', mx: 71, gt: 25, co: 24, sv: 18 },
  { month: 'Jun', mx: 78, gt: 28, co: 28, sv: 20 },
  { month: 'Jul', mx: 84, gt: 31, co: 33, sv: 22 },
  { month: 'Aug', mx: 92, gt: 34, co: 38, sv: 25 },
]
const multiLineConfig = {
  mx: { label: 'Mexico', color: C.turquoise },
  gt: { label: 'Guatemala', color: C.blueberry },
  co: { label: 'Colombia', color: C.mango },
  sv: { label: 'El Salvador', color: C.cactus },
} satisfies ChartConfig

function SlideMultiLine() {
  return (
    <ChartSlide num={12} bg="bg-slate-950" dark badge="Multi-Line Chart" title="Corridor Growth" stat="92K" statLabel="Mexico in August" desc="Multi-line charts compare trends across segments. Mexico leads volume, but Colombia shows the steepest growth trajectory at 375% YTD." bullets={['Colombia grew 375% — fastest corridor in 2026', 'Guatemala recovered after April dip with new agent network', 'El Salvador steady at 18% MoM with high retention']}>
      <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-5">
        <ChartContainer config={multiLineConfig} className="h-[260px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
          <LineChart data={multiLineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.3)" />
            <YAxis tickLine={false} axisLine={false} width={32} stroke="rgba(255,255,255,0.3)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="mx" stroke={C.turquoise} strokeWidth={2.5} dot={{ r: 3, fill: C.turquoise, strokeWidth: 0 }} />
            <Line type="monotone" dataKey="gt" stroke={C.blueberry} strokeWidth={2.5} dot={{ r: 3, fill: C.blueberry, strokeWidth: 0 }} />
            <Line type="monotone" dataKey="co" stroke={C.mango} strokeWidth={2.5} dot={{ r: 3, fill: C.mango, strokeWidth: 0 }} />
            <Line type="monotone" dataKey="sv" stroke={C.cactus} strokeWidth={2.5} dot={{ r: 3, fill: C.cactus, strokeWidth: 0 }} />
          </LineChart>
        </ChartContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 8: Donut Chart ───────────────────────────────────────── */
const donutData = [
  { name: 'Remittances', value: 62 }, { name: 'Credit', value: 18 },
  { name: 'Bill Pay', value: 12 }, { name: 'Savings', value: 8 },
]
const donutColors = [C.turquoise, C.blueberry, C.mango, C.cactus]

function SlideDonutChart() {
  return (
    <ChartSlide num={13} bg="bg-slate-950" dark badge="Donut Chart" title="Revenue by Product" stat="$4.2M" statLabel="monthly revenue" desc="Donut charts show proportions and parts-of-a-whole. Remittances remain the core revenue driver at 62%." bullets={['Credit building launched Q3, already 18% of revenue', 'Bill pay adoption doubles when bundled with remittances', 'Savings feature has highest margin at 42%']}>
      <div className="relative w-[640px] h-[640px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={donutData} cx="50%" cy="50%" innerRadius={160} outerRadius={280} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {donutData.map((_, i) => <Cell key={i} fill={donutColors[i]} />)}
            </Pie>
            <Tooltip formatter={(v: number) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-black text-6xl text-white">62%</span>
          <span className="text-sm text-white/40">Remittances</span>
        </div>
      </div>
      <div className="absolute bottom-24 right-20 flex flex-col gap-2">
        {donutData.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ background: donutColors[i] }} />
            <span className="text-xs text-white/60">{d.name}</span>
            <span className="text-xs font-bold text-white ml-auto">{d.value}%</span>
          </div>
        ))}
      </div>
    </ChartSlide>
  )
}

/* ── 9: Scatter Plot ──────────────────────────────────────── */
const scatterData = Array.from({ length: 40 }, (_, i) => ({
  amount: Math.round(50 + Math.random() * 950),
  frequency: Math.round(1 + Math.random() * 30),
  segment: i % 3,
}))
const scatterColors = [C.turquoise, C.mango, C.blueberry]

function SlideScatterPlot() {
  return (
    <ChartSlide num={14} bg="bg-turquoise" brand badge="Scatter Plot" title="Send Amount vs Frequency" stat="r=0.72" statLabel="correlation" desc="Scatter plots reveal relationships between variables. High-frequency senders cluster around $200-400 amounts." bullets={['Power senders average 8+ transactions per month', 'Amount clustering suggests common family support tiers', 'Outliers often represent business-use accounts']}>
      <div className="w-full h-[75%] bg-slate-950/90 rounded-2xl border border-white/10 p-5">
        <ResponsiveContainer>
          <ScatterChart margin={{ bottom: 20, left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="amount" name="Amount" unit="$" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
            <YAxis dataKey="frequency" name="Sends/mo" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} width={32} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {[0, 1, 2].map(seg => (
              <Scatter key={seg} data={scatterData.filter(d => d.segment === seg)} fill={scatterColors[seg]} opacity={0.7} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 10: Histogram ────────────────────────────────────────── */
const histData = [
  { range: '$0-50', count: 180 }, { range: '$51-100', count: 420 }, { range: '$101-200', count: 680 },
  { range: '$201-300', count: 520 }, { range: '$301-500', count: 340 }, { range: '$501-750', count: 190 },
  { range: '$751-1K', count: 90 }, { range: '$1K+', count: 40 },
]
const histConfig = { count: { label: 'Transactions', color: C.blueberry } } satisfies ChartConfig

function SlideHistogram() {
  return (
    <ChartSlide num={15} bg="bg-slate-950" dark badge="Histogram" title="Transaction Distribution" stat="$201" statLabel="median send" desc="Histograms display frequency distribution. The $101-200 bucket has the highest volume — our sweet spot." bullets={['80% of all sends fall between $50 and $500', 'Average send amount rose 12% year-over-year', 'High-value sends ($1K+) represent just 2% of volume']}>
      <div className="w-full h-[75%] bg-white/5 rounded-2xl border border-white/10 p-5">
        <ChartContainer config={histConfig} className="h-full w-full [&_.recharts-cartesian-axis-tick_text]:text-[9px] [&_.recharts-cartesian-axis-tick_text]:fill-white/50">
          <BarChart data={histData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="range" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {histData.map((_, i) => {
                const histColors = [C.sage, C.cactus, C.turquoise, C.blueberry, C.mango, C.papaya, C.evergreen, C.lychee]
                return <Cell key={i} fill={histColors[i]} opacity={i === 2 ? 1 : 0.75} />
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 11: Heat Map ─────────────────────────────────────────── */
const heatDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const heatHours = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p']
const heatValues = [
  [2,5,8,6,4,3,1,2,1],[3,7,12,9,6,4,2,3,1],[2,6,10,8,7,5,3,2,1],
  [3,8,14,11,8,5,2,3,2],[4,9,15,12,9,6,3,4,2],[6,10,8,5,3,2,1,2,1],[5,8,6,4,2,1,1,1,0]
]

function SlideHeatMap() {
  return (
    <ChartSlide num={16} bg="bg-turquoise" brand badge="Heat Map" title="Send Activity by Time" stat="12–2pm" statLabel="peak window" desc="Heat maps use color intensity to show density. Friday noon is the busiest period — payday sending." bullets={['Friday lunch hour sees 3x average send volume', 'Weekend activity skews toward evening hours', 'Bi-weekly payroll cycles create predictable peaks']}>
      <div className="bg-slate-950/90 rounded-2xl border border-white/10 p-6 w-full">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 pr-2 pt-6">
            {heatDays.map(d => <div key={d} className="h-8 flex items-center text-[10px] text-white/40 font-medium">{d}</div>)}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 mb-1">
              {heatHours.map(h => <div key={h} className="flex-1 text-center text-[9px] text-white/30">{h}</div>)}
            </div>
            {heatValues.map((row, ri) => (
              <div key={ri} className="flex gap-1 mb-1">
                {row.map((v, ci) => {
                  const intensity = v / 15
                  return <div key={ci} className="flex-1 h-8 rounded" style={{ background: C.turquoise, opacity: 0.1 + intensity * 0.9 }} title={`${heatDays[ri]} ${heatHours[ci]}: ${v}`} />
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[9px] text-white/40">Low</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => <div key={o} className="w-4 h-3 rounded-sm" style={{ background: C.turquoise, opacity: o }} />)}
          <span className="text-[9px] text-white/40">High</span>
        </div>
      </div>
    </ChartSlide>
  )
}

/* ── 12: Treemap ──────────────────────────────────────────── */
const treemapData = [
  { name: 'LATAM', value: 68, children: [{ name: 'MX', value: 42 }, { name: 'GT', value: 12 }, { name: 'SV', value: 8 }, { name: 'HN', value: 6 }] },
  { name: 'Caribbean', value: 18, children: [{ name: 'DO', value: 10 }, { name: 'Other', value: 8 }] },
  { name: 'S. America', value: 14, children: [{ name: 'CO', value: 9 }, { name: 'Other', value: 5 }] },
]

function SlideTreemap() {
  const flat = [
    { name: 'Mexico', size: 42 }, { name: 'Guatemala', size: 12 }, { name: 'El Salvador', size: 8 },
    { name: 'Honduras', size: 6 }, { name: 'Dom. Rep.', size: 10 }, { name: 'Caribbean Other', size: 8 },
    { name: 'Colombia', size: 9 }, { name: 'S. America Other', size: 5 },
  ]
  const tmColors = [C.turquoise, C.cactus, C.blueberry, C.sage, C.mango, C.lychee, C.papaya, C.evergreen]
  const total = flat.reduce((s, d) => s + d.size, 0)

  return (
    <ChartSlide num={17} bg="bg-slate-950" dark badge="Treemap" title="Market Share by Region" stat="68%" statLabel="LATAM share" desc="Treemaps visualize hierarchical data using nested rectangles. Size represents transaction volume proportion." bullets={['Mexico alone represents 42% of total market share', 'Caribbean expansion added 18% new volume this year', 'Colombia is the fastest-growing corridor at 45% QoQ']}>
      <div className="w-full h-[80%] flex gap-1.5">
        {/* Mexico – largest tile */}
        <div className="rounded-xl flex flex-col justify-end p-3 relative overflow-hidden" style={{ background: tmColors[0], width: '42%' }}>
          <span className="font-display font-black text-slate-950/20 text-4xl absolute top-2 right-3">42%</span>
          <span className="font-display font-bold text-sm text-slate-950 relative z-10">Mexico</span>
        </div>
        {/* Right column: stacked rows */}
        <div className="flex-1 flex flex-col gap-1.5">
          {/* Top row */}
          <div className="flex gap-1.5 flex-1">
            {flat.slice(1, 4).map((d, i) => (
              <div key={d.name} className="rounded-xl flex flex-col justify-end p-3 relative overflow-hidden flex-1"
                style={{ background: tmColors[i + 1] }}>
                <span className="font-display font-black text-slate-950/20 text-2xl absolute top-1 right-2">{d.size}%</span>
                <span className="font-display font-bold text-xs text-slate-950 relative z-10">{d.name}</span>
              </div>
            ))}
          </div>
          {/* Bottom row */}
          <div className="flex gap-1.5 flex-1">
            {flat.slice(4).map((d, i) => (
              <div key={d.name} className="rounded-xl flex flex-col justify-end p-3 relative overflow-hidden flex-1"
                style={{ background: tmColors[i + 4] }}>
                <span className="font-display font-black text-slate-950/20 text-2xl absolute top-1 right-2">{d.size}%</span>
                <span className="font-display font-bold text-xs text-slate-950 relative z-10">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartSlide>
  )
}

/* ── 13: Sankey Diagram ───────────────────────────────────── */
function SlideSankey() {
  const flows = [
    { from: 'App Open', to: 'Select Corridor', value: 100, y: 0 },
    { from: 'Select Corridor', to: 'Enter Amount', value: 82, y: 0 },
    { from: 'Enter Amount', to: 'Review', value: 71, y: 0 },
    { from: 'Review', to: 'Confirmed', value: 64, y: 0 },
    { from: 'Select Corridor', to: 'Drop-off', value: 18, y: 1 },
    { from: 'Enter Amount', to: 'Drop-off', value: 11, y: 1 },
    { from: 'Review', to: 'Drop-off', value: 7, y: 1 },
  ]
  const nodes = ['App Open', 'Select Corridor', 'Enter Amount', 'Review', 'Confirmed', 'Drop-off']
  const nodeColors: Record<string, string> = { 'App Open': C.turquoise, 'Select Corridor': C.cactus, 'Enter Amount': C.blueberry, 'Review': C.mango, 'Confirmed': C.turquoise, 'Drop-off': C.papaya }

  return (
    <ChartSlide num={18} bg="bg-stone" badge="Sankey Diagram" title="User Send Flow" stat="64%" statLabel="completion rate" desc="Sankey diagrams illustrate flows between stages. The biggest drop-off happens at corridor selection — 18% leave." bullets={['Corridor selection is the single biggest friction point', 'Users who complete first send have 82% retention', 'Streamlining review step could recover 7% of drop-offs']}>
      <div className="w-full h-[75%] bg-white rounded-2xl border border-border p-8 flex items-center">
        <svg viewBox="0 0 600 200" className="w-full h-auto">
          {/* Simplified sankey as stacked flow paths */}
          {[
            { x1: 0, x2: 140, w: 100, color: C.turquoise, label: 'Open', y: 10 },
            { x1: 150, x2: 280, w: 82, color: C.cactus, label: 'Corridor', y: 10 },
            { x1: 290, x2: 420, w: 71, color: C.blueberry, label: 'Amount', y: 10 },
            { x1: 430, x2: 520, w: 64, color: C.mango, label: 'Review', y: 10 },
            { x1: 530, x2: 600, w: 64, color: C.turquoise, label: 'Done', y: 10 },
          ].map((n, i) => (
            <g key={i}>
              <rect x={n.x1} y={n.y} width={n.x2 - n.x1} height={n.w * 1.5} rx={6} fill={n.color} opacity={0.8} />
              <text x={n.x1 + (n.x2 - n.x1) / 2} y={n.y + n.w * 0.75 + 5} textAnchor="middle" className="fill-white font-display" style={{ fontSize: 11, fontWeight: 800 }}>{n.label}</text>
              <text x={n.x1 + (n.x2 - n.x1) / 2} y={n.y + n.w * 1.5 + 16} textAnchor="middle" style={{ fontSize: 10, fill: C.mocha }}>{n.w}%</text>
            </g>
          ))}
          {/* Drop-off flows */}
          <path d="M 180 140 Q 200 180 260 185" stroke={C.papaya} strokeWidth={3} fill="none" opacity={0.4} />
          <path d="M 320 120 Q 340 170 380 180" stroke={C.papaya} strokeWidth={2} fill="none" opacity={0.3} />
          <text x={300} y={198} textAnchor="middle" style={{ fontSize: 9, fill: C.papaya }}>Drop-offs: 36%</text>
        </svg>
      </div>
    </ChartSlide>
  )
}

/* ── 14: Waterfall Chart ──────────────────────────────────── */
const waterfallData = [
  { name: 'Revenue', value: 4200, start: 0, isTotal: false, positive: true },
  { name: 'COGS', value: -1200, start: 4200, isTotal: false, positive: false },
  { name: 'Gross', value: 3000, start: 0, isTotal: true, positive: true },
  { name: 'OpEx', value: -800, start: 3000, isTotal: false, positive: false },
  { name: 'Marketing', value: -400, start: 2200, isTotal: false, positive: false },
  { name: 'Net', value: 1000, start: 0, isTotal: true, positive: true },
]

function SlideWaterfall() {
  return (
    <ChartSlide num={19} bg="bg-slate-950" dark badge="Waterfall Chart" title="Revenue Breakdown" stat="$1.0M" statLabel="net income" desc="Waterfall charts show cumulative effect of sequential values. From $4.2M revenue to $1.0M net income." bullets={['COGS reduced 8% through partner negotiations', 'Marketing spend optimized with 22% lower CAC', 'Net margin improved from 19% to 24% year-over-year']}>
      <div className="w-full h-[75%] bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center">
        <div className="flex items-end gap-4 w-full">
        {waterfallData.map((d) => {
          const maxH = 200
          const scale = maxH / 4200
          const barH = Math.abs(d.value) * scale
          const bottomOffset = d.isTotal ? 0 : (d.positive ? 0 : (d.start + d.value)) * scale
          return (
            <div key={d.name} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-white/80">{d.value > 0 ? '' : '-'}${Math.abs(d.value / 1000).toFixed(1)}M</span>
              <div className="w-full relative" style={{ height: maxH }}>
                <div className="absolute bottom-0 w-full rounded-t-md" style={{
                  height: barH,
                  bottom: bottomOffset,
                  background: d.isTotal ? C.turquoise : d.positive ? C.cactus : C.papaya,
                  opacity: d.isTotal ? 1 : 0.8,
                }} />
              </div>
              <span className="text-[10px] text-white/50 text-center">{d.name}</span>
            </div>
          )
        })}
        </div>
      </div>
    </ChartSlide>
  )
}

/* ── 15: Box Plot ─────────────────────────────────────────── */
function SlideBoxPlot() {
  const corridors = [
    { name: 'MX', min: 2, q1: 8, median: 15, q3: 24, max: 45, color: C.turquoise },
    { name: 'GT', min: 5, q1: 18, median: 30, q3: 42, max: 72, color: C.cactus },
    { name: 'SV', min: 3, q1: 12, median: 22, q3: 35, max: 55, color: C.blueberry },
    { name: 'HN', min: 8, q1: 20, median: 35, q3: 50, max: 80, color: C.mango },
    { name: 'CO', min: 4, q1: 15, median: 25, q3: 38, max: 60, color: C.sage },
  ]
  const maxVal = 85
  const s = (v: number) => (v / maxVal) * 280

  return (
    <ChartSlide num={20} bg="bg-stone" badge="Box Plot" title="Transfer Time by Corridor" stat="15min" statLabel="MX median" desc="Box plots summarize distribution using median, quartiles, and outliers. Mexico has the fastest, most consistent delivery times." bullets={['Mexico delivers 95% of transfers under 30 minutes', 'Honduras variance driven by bank processing delays', 'Real-time rails reduced median by 40% since Q1']}>
      <div className="w-full h-[75%] bg-white rounded-2xl border border-border p-8 flex flex-col items-center justify-center">
        <div className="flex items-end gap-8 w-full">
        {corridors.map((c) => (
          <div key={c.name} className="flex-1 flex flex-col items-center">
            <svg viewBox="0 0 40 300" className="w-10 h-[200px]">
              {/* Whisker line */}
              <line x1="20" y1={280 - s(c.max)} x2="20" y2={280 - s(c.min)} stroke={c.color} strokeWidth={1.5} opacity={0.4} />
              {/* Box */}
              <rect x="5" y={280 - s(c.q3)} width="30" height={s(c.q3) - s(c.q1)} rx="4" fill={c.color} opacity={0.8} />
              {/* Median line */}
              <line x1="5" y1={280 - s(c.median)} x2="35" y2={280 - s(c.median)} stroke="white" strokeWidth={2.5} />
              {/* Whisker caps */}
              <line x1="12" y1={280 - s(c.max)} x2="28" y2={280 - s(c.max)} stroke={c.color} strokeWidth={1.5} />
              <line x1="12" y1={280 - s(c.min)} x2="28" y2={280 - s(c.min)} stroke={c.color} strokeWidth={1.5} />
            </svg>
            <span className="text-xs font-bold text-foreground mt-2">{c.name}</span>
            <span className="text-[10px] text-muted-foreground">{c.median}min</span>
          </div>
        ))}
        </div>
      </div>
    </ChartSlide>
  )
}

/* ── 16: Bubble Chart ─────────────────────────────────────── */
const bubbleData = [
  { x: 4.2, y: 87, z: 1200, name: 'MX', color: C.turquoise },
  { x: 2.8, y: 64, z: 600, name: 'GT', color: C.cactus },
  { x: 1.9, y: 52, z: 400, name: 'SV', color: C.blueberry },
  { x: 1.6, y: 45, z: 350, name: 'HN', color: C.mango },
  { x: 1.2, y: 38, z: 500, name: 'CO', color: C.sage },
  { x: 0.8, y: 24, z: 200, name: 'NI', color: C.papaya },
]

function SlideBubbleChart() {
  return (
    <ChartSlide num={21} bg="bg-slate-950" dark badge="Bubble Chart" title="Market Opportunity" stat="$12B" statLabel="total addressable" desc="Bubble charts scale size to represent magnitude. X = volume, Y = satisfaction, size = market potential." bullets={['Mexico TAM alone exceeds $4B annually', 'Satisfaction correlates strongly with market penetration', 'Colombia and Nicaragua show untapped upside potential']}>
      <div className="w-full h-[75%] bg-white/5 rounded-2xl border border-white/10 p-5">
        <ResponsiveContainer>
          <ScatterChart margin={{ bottom: 20, left: 10, right: 20, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="x" name="Volume (K)" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
            <YAxis dataKey="y" name="CSAT %" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} width={32} />
            <ZAxis dataKey="z" range={[200, 1500]} />
            <Tooltip />
            {bubbleData.map((b) => (
              <Scatter key={b.name} data={[b]} fill={b.color} opacity={0.75} name={b.name} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 17: Radar Chart ──────────────────────────────────────── */
const radarData = [
  { metric: 'Speed', remit: 92, credit: 68, savings: 75 },
  { metric: 'Trust', remit: 88, credit: 85, savings: 82 },
  { metric: 'Simplicity', remit: 90, credit: 62, savings: 78 },
  { metric: 'Adoption', remit: 95, credit: 45, savings: 55 },
  { metric: 'Retention', remit: 82, credit: 78, savings: 70 },
  { metric: 'NPS', remit: 87, credit: 72, savings: 68 },
]

function SlideRadarChart() {
  return (
    <ChartSlide num={22} bg="bg-turquoise" brand badge="Radar Chart" title="Product Comparison" stat="92" statLabel="remit speed score" desc="Radar charts compare multiple variables. Remittances leads across most metrics — credit building has the most room to grow." bullets={['Remittances scores above 80 on all six dimensions', 'Credit building adoption lags but NPS is promising', 'Savings simplicity score jumped after UI redesign']}>
      <div className="w-full h-[85%]">
        <ResponsiveContainer>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="rgba(8,36,34,0.2)" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: C.slate }} />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <Radar name="Remittances" dataKey="remit" stroke={C.turquoise} fill={C.turquoise} fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Credit" dataKey="credit" stroke={C.blueberry} fill={C.blueberry} fillOpacity={0.1} strokeWidth={2} />
            <Radar name="Savings" dataKey="savings" stroke={C.cactus} fill={C.cactus} fillOpacity={0.1} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 18: Gantt Chart ──────────────────────────────────────── */
function SlideGantt() {
  const tasks = [
    { name: 'DS Tokens V2', start: 0, duration: 3, color: C.turquoise },
    { name: 'Component Library', start: 1, duration: 5, color: C.blueberry },
    { name: 'Credit Flow', start: 2, duration: 4, color: C.cactus },
    { name: 'Bill Pay MVP', start: 4, duration: 3, color: C.mango },
    { name: 'Savings Launch', start: 5, duration: 4, color: C.sage },
    { name: 'Multi-currency', start: 6, duration: 3, color: C.papaya },
    { name: 'Illo Library V2', start: 3, duration: 2, color: C.lychee },
  ]
  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

  return (
    <ChartSlide num={23} bg="bg-slate-950" dark badge="Gantt Chart" title="Product Roadmap" stat="Q2–Q4" statLabel="2026 timeline" desc="Gantt charts visualize project schedules. Seven workstreams running in parallel across three quarters." bullets={['DS Tokens V2 unblocks all downstream design work', 'Credit flow and bill pay share common components', 'Multi-currency launch targets three new corridors']}>
      <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-6 overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Month headers */}
          <div className="flex ml-[140px] mb-3">
            {months.map(m => <div key={m} className="flex-1 text-[10px] text-white/30 font-medium">{m}</div>)}
          </div>
          {/* Tasks */}
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.name} className="flex items-center h-8">
                <span className="w-[130px] flex-shrink-0 text-xs text-white/70 font-medium truncate pr-2">{t.name}</span>
                <div className="flex-1 relative h-full">
                  <div className="absolute h-full rounded-md" style={{
                    left: `${(t.start / 8) * 100}%`, width: `${(t.duration / 8) * 100}%`, background: t.color, opacity: 0.8,
                  }}>
                    <span className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-slate-950/80">{t.duration}mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartSlide>
  )
}

/* ── 19: Funnel Chart ─────────────────────────────────────── */
function SlideFunnel() {
  const stages = [
    { name: 'App Downloads', value: 100000, pct: '100%', color: C.turquoise },
    { name: 'Account Created', value: 72000, pct: '72%', color: C.cactus },
    { name: 'KYC Complete', value: 54000, pct: '54%', color: C.blueberry },
    { name: 'First Send', value: 38000, pct: '38%', color: C.mango },
    { name: 'Repeat User', value: 24000, pct: '24%', color: C.sage },
  ]

  return (
    <ChartSlide num={24} bg="bg-stone" badge="Funnel Chart" title="User Conversion Funnel" stat="24%" statLabel="to repeat user" desc="Funnel charts track reduction through stages. KYC is the biggest cliff — investing in smoother verification could unlock 18% more users." bullets={['KYC drop-off accounts for 25% of total loss', 'Biometric verification cut KYC time by 60%', 'Repeat users generate 5x lifetime revenue vs one-time']}>
      <div className="w-full h-[80%] flex flex-col justify-center gap-2 px-8">
        {stages.map((s, i) => {
          const widthPct = 40 + (60 * (stages.length - i) / stages.length)
          return (
            <div key={s.name} className="flex items-center gap-4">
              <div className="relative rounded-lg overflow-hidden h-12" style={{ width: `${widthPct}%`, background: s.color, opacity: 0.85 }}>
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <span className="font-display font-bold text-sm text-slate-950">{s.name}</span>
                  <span className="font-display font-black text-lg text-slate-950/60">{s.pct}</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{(s.value / 1000).toFixed(0)}K</span>
            </div>
          )
        })}
      </div>
    </ChartSlide>
  )
}

/* ── 20: Area Chart ───────────────────────────────────────── */
const areaData = [
  { month: 'Jan', mx: 3200, gt: 1800, sv: 1200, other: 900 },
  { month: 'Feb', mx: 3400, gt: 1900, sv: 1300, other: 1000 },
  { month: 'Mar', mx: 3800, gt: 2100, sv: 1400, other: 1100 },
  { month: 'Apr', mx: 4100, gt: 2300, sv: 1500, other: 1200 },
  { month: 'May', mx: 4500, gt: 2500, sv: 1700, other: 1300 },
  { month: 'Jun', mx: 4800, gt: 2700, sv: 1800, other: 1400 },
]
const areaConfig = { mx: { label: 'Mexico', color: C.turquoise }, gt: { label: 'Guatemala', color: C.cactus }, sv: { label: 'El Salvador', color: C.blueberry }, other: { label: 'Other', color: C.mango } } satisfies ChartConfig

function SlideAreaChart() {
  return (
    <ChartSlide num={25} bg="bg-slate-950" dark badge="Area Chart" title="Volume by Corridor" stat="10.7K" statLabel="June total" desc="Stacked area charts show volume over time. All corridors are growing — Mexico alone accounts for 45% of volume." bullets={['Total send volume up 38% in the first half of 2026', 'Guatemala overtook El Salvador as second largest corridor', 'Seasonal spikes around holidays drive 20% above baseline']}>
      <div className="w-full h-[75%] bg-white/5 rounded-2xl border border-white/10 p-5">
        <ChartContainer config={areaConfig} className="h-full w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px] [&_.recharts-cartesian-axis-tick_text]:fill-white/50">
          <AreaChart data={areaData} stackOffset="none">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="other" stackId="1" fill={C.mango} stroke={C.mango} fillOpacity={0.6} />
            <Area type="monotone" dataKey="sv" stackId="1" fill={C.blueberry} stroke={C.blueberry} fillOpacity={0.6} />
            <Area type="monotone" dataKey="gt" stackId="1" fill={C.cactus} stroke={C.cactus} fillOpacity={0.6} />
            <Area type="monotone" dataKey="mx" stackId="1" fill={C.turquoise} stroke={C.turquoise} fillOpacity={0.6} />
          </AreaChart>
        </ChartContainer>
      </div>
    </ChartSlide>
  )
}

/* ── 21: Bullet Graph ─────────────────────────────────────── */
function SlideBulletGraph() {
  const kpis = [
    { name: 'NPS Score', actual: 72, target: 80, max: 100, color: C.turquoise },
    { name: 'CSAT', actual: 88, target: 85, max: 100, color: C.cactus },
    { name: 'First Send <5min', actual: 64, target: 75, max: 100, color: C.blueberry },
    { name: 'App Rating', actual: 4.6, target: 4.8, max: 5, color: C.mango },
    { name: 'Repeat Rate', actual: 68, target: 70, max: 100, color: C.sage },
  ]

  return (
    <ChartSlide num={26} bg="bg-stone" badge="Bullet Graph" title="KPI Performance" stat="3/5" statLabel="targets met" desc="Bullet graphs compare actual performance against goals. CSAT exceeds target — NPS and first-send speed need focus." bullets={['CSAT at 88% — highest since product launch', 'First-send speed improving with new payment rails', 'App rating of 4.6 approaching category benchmark']}>
      <div className="w-full space-y-6 px-4">
        {kpis.map((k) => {
          const pct = (k.actual / k.max) * 100
          const tgtPct = (k.target / k.max) * 100
          const met = k.actual >= k.target
          return (
            <div key={k.name}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-display font-bold text-foreground">{k.name}</span>
                <span className={`text-sm font-bold ${met ? 'text-cactus' : 'text-papaya'}`}>{k.actual}{k.max === 5 ? '' : '%'}</span>
              </div>
              <div className="relative h-6 bg-concrete/30 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: k.color, opacity: 0.85 }} />
                <div className="absolute inset-y-0 w-0.5 bg-slate-950" style={{ left: `${tgtPct}%` }} />
                <span className="absolute text-[9px] text-slate-950/50 font-medium" style={{ left: `${tgtPct + 1}%`, top: '50%', transform: 'translateY(-50%)' }}>Target</span>
              </div>
            </div>
          )
        })}
      </div>
    </ChartSlide>
  )
}

/* ── 22: Choropleth Map ───────────────────────────────────── */
function SlideChoropleth() {
  const countries = [
    { name: 'Mexico', code: 'MX', volume: '$2.1B', color: C.turquoise, x: 120, y: 95, w: 90, h: 70 },
    { name: 'Guatemala', code: 'GT', volume: '$480M', color: C.cactus, x: 175, y: 155, w: 30, h: 25 },
    { name: 'El Salvador', code: 'SV', volume: '$320M', color: C.blueberry, x: 180, y: 175, w: 25, h: 15 },
    { name: 'Honduras', code: 'HN', volume: '$260M', color: C.mango, x: 200, y: 155, w: 35, h: 25 },
    { name: 'Nicaragua', code: 'NI', volume: '$120M', color: C.sage, x: 210, y: 175, w: 35, h: 30 },
    { name: 'Colombia', code: 'CO', volume: '$380M', color: C.papaya, x: 230, y: 230, w: 50, h: 60 },
    { name: 'Dom. Rep.', code: 'DO', volume: '$290M', color: C.lychee, x: 270, y: 130, w: 25, h: 18 },
  ]

  return (
    <ChartSlide num={27} bg="bg-slate-950" dark badge="Choropleth Map" title="Send-to Markets" stat="7" statLabel="active corridors" desc="Choropleth maps color geographic areas by data intensity. Mexico dominates with $2.1B in annual remittance volume." bullets={['Three new corridors planned for Q4 2026 expansion', 'Rural delivery network covers 94% of Mexico municipalities', 'Dominican Republic volume doubled after WhatsApp integration']}>
      <div className="w-full h-[80%] bg-white/5 rounded-2xl border border-white/10 p-6 relative">
        <svg viewBox="0 0 400 320" className="w-full h-full">
          {/* Simplified map shapes */}
          {countries.map((c) => (
            <g key={c.code}>
              <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={4} fill={c.color} opacity={0.85} />
              <text x={c.x + c.w / 2} y={c.y + c.h / 2 - 4} textAnchor="middle" style={{ fontSize: 9, fontWeight: 800, fill: 'white' }}>{c.code}</text>
              <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 8} textAnchor="middle" style={{ fontSize: 7, fill: 'rgba(255,255,255,0.7)' }}>{c.volume}</text>
            </g>
          ))}
          {/* US origin */}
          <rect x={80} y={20} width={160} height={60} rx={6} fill={C.evergreen} opacity={0.3} />
          <text x={160} y={50} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: 'rgba(255,255,255,0.5)' }}>USA (Origin)</text>
        </svg>
      </div>
    </ChartSlide>
  )
}

/* ── 23: Sunburst Chart ───────────────────────────────────── */
function SlideSunburst() {
  const rings = [
    { segments: [{ label: 'Active', pct: 70, color: C.turquoise }, { label: 'Dormant', pct: 30, color: C.concrete }] },
    { segments: [{ label: 'Repeat', pct: 45, color: C.cactus }, { label: '1-time', pct: 25, color: C.sage }, { label: 'Churned', pct: 30, color: C.papaya }] },
    { segments: [{ label: 'MX', pct: 28, color: C.turquoise }, { label: 'GT', pct: 10, color: C.blueberry }, { label: 'SV', pct: 7, color: C.mango }, { label: 'Other', pct: 55, color: C.evergreen }] },
  ]

  return (
    <ChartSlide num={28} bg="bg-turquoise" brand badge="Sunburst Chart" title="User Segmentation" stat="70%" statLabel="active users" desc="Sunburst charts show hierarchical data radially. Inner ring = active vs dormant, middle = behavior, outer = corridor breakdown." bullets={['Repeat senders make up 45% of the active base', 'Dormant reactivation campaigns recover 12% of churned', 'Mexico corridor users have highest repeat rate at 68%']}>
      <div className="w-[680px] h-[680px] relative">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {rings.map((ring, ri) => {
            const r = 50 + ri * 35
            const rw = 28
            let angle = 0
            return ring.segments.map((seg) => {
              const startAngle = angle
              const sweepAngle = (seg.pct / 100) * 360
              angle += sweepAngle
              const startRad = (startAngle - 90) * Math.PI / 180
              const endRad = (startAngle + sweepAngle - 90) * Math.PI / 180
              const x1 = 150 + (r - rw / 2) * Math.cos(startRad)
              const y1 = 150 + (r - rw / 2) * Math.sin(startRad)
              const x2 = 150 + (r + rw / 2) * Math.cos(startRad)
              const y2 = 150 + (r + rw / 2) * Math.sin(startRad)
              const x3 = 150 + (r + rw / 2) * Math.cos(endRad)
              const y3 = 150 + (r + rw / 2) * Math.sin(endRad)
              const x4 = 150 + (r - rw / 2) * Math.cos(endRad)
              const y4 = 150 + (r - rw / 2) * Math.sin(endRad)
              const largeArc = sweepAngle > 180 ? 1 : 0
              return (
                <path key={`${ri}-${seg.label}`}
                  d={`M ${x1} ${y1} A ${r - rw / 2} ${r - rw / 2} 0 ${largeArc} 1 ${x4} ${y4} L ${x3} ${y3} A ${r + rw / 2} ${r + rw / 2} 0 ${largeArc} 0 ${x2} ${y2} Z`}
                  fill={seg.color} opacity={0.8} stroke="white" strokeWidth={1.5}
                />
              )
            })
          })}
          <circle cx="150" cy="150" r="30" fill="white" />
          <text x="150" y="148" textAnchor="middle" style={{ fontSize: 14, fontWeight: 900, fill: C.slate }} className="font-display">70%</text>
          <text x="150" y="162" textAnchor="middle" style={{ fontSize: 8, fill: C.mocha }}>Active</text>
        </svg>
      </div>
    </ChartSlide>
  )
}

/* ── 24: Parallel Coordinates ─────────────────────────────── */
function SlideParallel() {
  const axes = ['Frequency', 'Amount', 'Tenure', 'Products', 'NPS']
  const profiles = [
    { name: 'Power User', values: [95, 70, 85, 90, 88], color: C.turquoise },
    { name: 'Occasional', values: [30, 55, 60, 25, 72], color: C.mango },
    { name: 'New User', values: [15, 40, 10, 15, 65], color: C.blueberry },
  ]

  return (
    <ChartSlide num={29} bg="bg-slate-950" dark badge="Parallel Coordinates" title="User Behavior Profiles" stat="3" statLabel="user segments" desc="Parallel coordinates visualize high-dimensional data. Power users score high across all axes — new users have high NPS potential." bullets={['Power users represent 18% of base but 52% of volume', 'Occasional senders convert to power at 8% per quarter', 'New user NPS suggests strong word-of-mouth potential']}>
      <div className="w-full h-[75%] bg-white/5 rounded-2xl border border-white/10 p-8">
        <svg viewBox="0 0 500 250" className="w-full h-full">
          {/* Axes */}
          {axes.map((a, i) => {
            const x = 40 + i * 110
            return (
              <g key={a}>
                <line x1={x} y1={20} x2={x} y2={210} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                <text x={x} y={235} textAnchor="middle" style={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}>{a}</text>
              </g>
            )
          })}
          {/* Profile lines */}
          {profiles.map((p) => {
            const points = p.values.map((v, i) => `${40 + i * 110},${210 - (v / 100) * 190}`).join(' ')
            return <polyline key={p.name} points={points} fill="none" stroke={p.color} strokeWidth={2.5} opacity={0.8} />
          })}
          {/* Dots */}
          {profiles.map((p) => p.values.map((v, i) => (
            <circle key={`${p.name}-${i}`} cx={40 + i * 110} cy={210 - (v / 100) * 190} r={4} fill={p.color} />
          )))}
          {/* Legend */}
          {profiles.map((p, i) => (
            <g key={p.name}>
              <rect x={160 + i * 120} y={0} width={10} height={10} rx={2} fill={p.color} />
              <text x={175 + i * 120} y={9} style={{ fontSize: 9, fill: 'rgba(255,255,255,0.6)' }}>{p.name}</text>
            </g>
          ))}
        </svg>
      </div>
    </ChartSlide>
  )
}

/* ── 25: Word Cloud ───────────────────────────────────────── */
function SlideWordCloud() {
  const words = [
    { text: 'Fast', size: 48, color: C.turquoise, x: 42, y: 38 },
    { text: 'Reliable', size: 36, color: C.cactus, x: 20, y: 55 },
    { text: 'Easy', size: 44, color: C.turquoise, x: 65, y: 28 },
    { text: 'Secure', size: 32, color: C.blueberry, x: 70, y: 60 },
    { text: 'Affordable', size: 28, color: C.mango, x: 15, y: 72 },
    { text: 'Trusted', size: 40, color: C.sage, x: 48, y: 68 },
    { text: 'Quick', size: 24, color: C.evergreen, x: 82, y: 45 },
    { text: 'Family', size: 34, color: C.turquoise, x: 30, y: 25 },
    { text: 'Simple', size: 30, color: C.papaya, x: 58, y: 82 },
    { text: 'Home', size: 38, color: C.cactus, x: 78, y: 75 },
    { text: 'Support', size: 22, color: C.blueberry, x: 88, y: 30 },
    { text: 'Cheap', size: 20, color: C.mango, x: 10, y: 42 },
    { text: 'WhatsApp', size: 26, color: C.cactus, x: 35, y: 85 },
    { text: 'Instant', size: 28, color: C.turquoise, x: 55, y: 48 },
  ]

  return (
    <ChartSlide num={30} bg="bg-stone" badge="Word Cloud" title="Customer Feedback Themes" stat="14K" statLabel="reviews analyzed" desc="Word clouds visualize frequency in text data. 'Fast', 'Easy', and 'Trusted' are the top three themes from user reviews." bullets={['Speed-related keywords appear in 47% of 5-star reviews', 'Family and home themes drive emotional connection', 'WhatsApp mentions rising as preferred support channel']}>
      <div className="w-full h-[80%] bg-white rounded-2xl border border-border p-8 relative overflow-hidden">
        {words.map((w) => (
          <span key={w.text} className="absolute font-display font-black select-none" style={{
            fontSize: w.size, color: w.color, left: `${w.x}%`, top: `${w.y}%`,
            transform: 'translate(-50%, -50%)', opacity: 0.85,
          }}>{w.text}</span>
        ))}
      </div>
    </ChartSlide>
  )
}

/* ── 26: Chord Diagram ────────────────────────────────────── */
function SlideChord() {
  const nodes = ['USA', 'MX', 'GT', 'SV', 'HN', 'CO']
  const colors = [C.slate, C.turquoise, C.cactus, C.blueberry, C.mango, C.sage]

  return (
    <ChartSlide num={31} bg="bg-slate-950" dark badge="Chord Diagram" title="Money Flow Corridors" stat="$3.8B" statLabel="annual volume" desc="Chord diagrams show relationships between entities. All flows originate from USA, with Mexico receiving the largest share." bullets={['USA-to-Mexico corridor carries 55% of total flow', 'Central American corridors growing at 2x overall rate', 'Cross-corridor users (multi-destination) are 4% of base']}>
      <div className="w-[680px] h-[680px] -mr-20">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Arcs for each country */}
          {nodes.map((n, i) => {
            const angle = (i / nodes.length) * 360
            const sweep = 360 / nodes.length - 4
            const startRad = ((angle - 90) * Math.PI) / 180
            const endRad = (((angle + sweep) - 90) * Math.PI) / 180
            const r = 130
            return (
              <path key={n} d={`M ${150 + r * Math.cos(startRad)} ${150 + r * Math.sin(startRad)} A ${r} ${r} 0 0 1 ${150 + r * Math.cos(endRad)} ${150 + r * Math.sin(endRad)}`}
                stroke={colors[i]} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.8} />
            )
          })}
          {/* Flow chords from USA to each */}
          {nodes.slice(1).map((n, i) => {
            const srcAngle = ((0 / nodes.length) * 360 + 20 - 90) * Math.PI / 180
            const dstAngle = (((i + 1) / nodes.length) * 360 + 20 - 90) * Math.PI / 180
            const sx = 150 + 100 * Math.cos(srcAngle), sy = 150 + 100 * Math.sin(srcAngle)
            const dx = 150 + 100 * Math.cos(dstAngle), dy = 150 + 100 * Math.sin(dstAngle)
            return <path key={n} d={`M ${sx} ${sy} Q 150 150 ${dx} ${dy}`} stroke={colors[i + 1]} strokeWidth={[0, 8, 4, 3, 3, 4][i + 1]} fill="none" opacity={0.25} />
          })}
          {/* Labels */}
          {nodes.map((n, i) => {
            const angle = ((i / nodes.length) * 360 + 20 - 90) * Math.PI / 180
            const r = 148
            return <text key={n} x={150 + r * Math.cos(angle)} y={150 + r * Math.sin(angle)} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: colors[i] }}>{n}</text>
          })}
        </svg>
      </div>
    </ChartSlide>
  )
}

/* ── 27: Candlestick Chart ────────────────────────────────── */
function SlideCandlestick() {
  const data = [
    { day: 'Mon', open: 17.2, close: 17.5, high: 17.8, low: 17.0 },
    { day: 'Tue', open: 17.5, close: 17.3, high: 17.6, low: 17.1 },
    { day: 'Wed', open: 17.3, close: 17.8, high: 18.0, low: 17.2 },
    { day: 'Thu', open: 17.8, close: 17.6, high: 17.9, low: 17.4 },
    { day: 'Fri', open: 17.6, close: 18.1, high: 18.3, low: 17.5 },
    { day: 'Mon2', open: 18.1, close: 17.9, high: 18.2, low: 17.7 },
    { day: 'Tue2', open: 17.9, close: 18.4, high: 18.6, low: 17.8 },
    { day: 'Wed2', open: 18.4, close: 18.2, high: 18.5, low: 18.0 },
  ]
  const minP = 16.8, maxP = 18.8, range = maxP - minP

  return (
    <ChartSlide num={32} bg="bg-stone" badge="Candlestick Chart" title="MXN/USD Exchange Rate" stat="18.4" statLabel="latest rate" desc="Candlestick charts show price movements. Green = peso strengthened, red = weakened. Trend is favorable for senders this week." bullets={['FX spread locked at 0.5% — best in class for digital', 'Rate alerts drive 15% higher conversion on favorable days', 'Hedging strategy protects margins during volatility']}>
      <div className="w-full h-[75%] bg-white rounded-2xl border border-border p-6 flex flex-col items-center justify-center">
        <div className="flex items-end gap-5 w-full">
        {data.map((d) => {
          const bullish = d.close > d.open
          const bodyTop = Math.max(d.open, d.close)
          const bodyBot = Math.min(d.open, d.close)
          const h = 200
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center relative" style={{ height: h }}>
              {/* Wick */}
              <div className="absolute w-[2px]" style={{
                top: `${((maxP - d.high) / range) * h}px`, bottom: `${((d.low - minP) / range) * h}px`,
                background: bullish ? C.cactus : C.papaya, opacity: 0.5,
              }} />
              {/* Body */}
              <div className="absolute w-6 rounded-sm" style={{
                top: `${((maxP - bodyTop) / range) * h}px`, bottom: `${((bodyBot - minP) / range) * h}px`,
                background: bullish ? C.cactus : C.papaya,
              }} />
            </div>
          )
        })}
        </div>
      </div>
    </ChartSlide>
  )
}

/* ── 28: Violin Plot ──────────────────────────────────────── */
function SlideViolin() {
  const corridors = [
    { name: 'MX', color: C.turquoise, points: [0.1, 0.3, 0.8, 1.0, 0.9, 0.6, 0.3, 0.1] },
    { name: 'GT', color: C.cactus, points: [0.2, 0.5, 0.7, 0.8, 0.9, 0.7, 0.4, 0.2] },
    { name: 'SV', color: C.blueberry, points: [0.1, 0.4, 0.6, 0.9, 0.8, 0.5, 0.3, 0.1] },
    { name: 'CO', color: C.mango, points: [0.2, 0.3, 0.5, 0.7, 0.8, 0.6, 0.3, 0.1] },
  ]

  return (
    <ChartSlide num={33} bg="bg-slate-950" dark badge="Violin Plot" title="Fee Distribution by Corridor" stat="$3.50" statLabel="MX median fee" desc="Violin plots combine box plots with density. Mexico has the tightest fee distribution — Guatemala shows the most variance." bullets={['Flat fee model preferred 3:1 over percentage-based', 'Guatemala variance reflects split between bank and cash', 'Fee transparency cited as top reason users switch to Felix']}>
      <div className="w-full h-[75%] bg-white/5 rounded-2xl border border-white/10 p-8 flex items-center justify-center gap-10">
        {corridors.map((c) => (
          <div key={c.name} className="flex flex-col items-center">
            <svg viewBox="0 0 60 200" className="w-16 h-[180px]">
              {/* Violin shape (mirrored) */}
              <path d={`M 30 10 ${c.points.map((p, i) => `L ${30 + p * 25} ${10 + i * (180 / (c.points.length - 1))}`).join(' ')} L 30 190 ${[...c.points].reverse().map((p, i) => `L ${30 - p * 25} ${190 - i * (180 / (c.points.length - 1))}`).join(' ')} Z`}
                fill={c.color} opacity={0.6} />
              {/* Median line */}
              <line x1="15" y1="100" x2="45" y2="100" stroke="white" strokeWidth={2} />
              {/* Quartile box */}
              <rect x="22" y="70" width="16" height="60" rx="3" fill={c.color} opacity={0.4} />
            </svg>
            <span className="text-xs font-bold text-white mt-2">{c.name}</span>
          </div>
        ))}
      </div>
    </ChartSlide>
  )
}

/* ── 29: Pictorial Chart ──────────────────────────────────── */
function SlidePictorial() {
  const milestones = [
    { icon: '👤', label: 'Signed Up', count: 100, filled: 100 },
    { icon: '✅', label: 'Verified', count: 72, filled: 72 },
    { icon: '💸', label: 'First Send', count: 38, filled: 38 },
    { icon: '🔄', label: 'Repeat', count: 24, filled: 24 },
    { icon: '⭐', label: 'Multi-Product', count: 12, filled: 12 },
  ]

  return (
    <ChartSlide num={34} bg="bg-stone" badge="Pictorial Chart" title="User Journey Milestones" stat="12%" statLabel="reach multi-product" desc="Pictorial charts use icons to represent data. Each dot = 1% of users. Only 12% adopt multiple products — our growth opportunity." bullets={['Verification remains the steepest step in the journey', 'Multi-product users have 3x higher lifetime value', 'In-app nudges increased repeat send rate by 22%']}>
      <div className="w-full space-y-5 px-4">
        {milestones.map((m) => (
          <div key={m.label} className="flex items-center gap-4">
            <span className="text-2xl w-8">{m.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-display font-bold text-foreground">{m.label}</span>
                <span className="text-sm font-bold text-muted-foreground">{m.count}%</span>
              </div>
              <div className="flex gap-[2px]">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="h-3 flex-1 rounded-sm" style={{ background: i < m.filled / 5 ? C.turquoise : C.concrete, opacity: i < m.filled / 5 ? 0.85 : 0.3 }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartSlide>
  )
}

/* ── 30: Gauge Chart ──────────────────────────────────────── */
function SlideGauge() {
  const nps = 72
  const angle = (nps / 100) * 180

  return (
    <ChartSlide num={35} bg="bg-slate-950" dark badge="Gauge Chart" title="Net Promoter Score" stat="+72" statLabel="NPS score" desc="Gauge charts display a single KPI on a radial scale. Felix NPS sits firmly in 'Excellent' territory, up 8 points from last quarter." bullets={['Promoters cite speed and transparency most often', 'Detractor count dropped 34% after support overhaul', 'NPS trend line has been positive for 6 consecutive months']}>
      <div className="w-[360px] h-[260px] relative">
        <svg viewBox="0 0 300 180" className="w-full h-auto">
          {/* Background arc */}
          <path d="M 30 160 A 120 120 0 0 1 270 160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={24} strokeLinecap="round" />
          {/* Colored segments */}
          <path d="M 30 160 A 120 120 0 0 1 90 42" fill="none" stroke={C.papaya} strokeWidth={24} strokeLinecap="round" opacity={0.6} />
          <path d="M 90 42 A 120 120 0 0 1 150 16" fill="none" stroke={C.mango} strokeWidth={24} strokeLinecap="round" opacity={0.6} />
          <path d="M 150 16 A 120 120 0 0 1 210 42" fill="none" stroke={C.cactus} strokeWidth={24} strokeLinecap="round" opacity={0.6} />
          <path d="M 210 42 A 120 120 0 0 1 270 160" fill="none" stroke={C.turquoise} strokeWidth={24} strokeLinecap="round" opacity={0.6} />
          {/* Needle */}
          {(() => {
            const needleAngle = (180 - angle) * Math.PI / 180
            const nx = 150 + 95 * Math.cos(needleAngle)
            const ny = 160 - 95 * Math.sin(needleAngle)
            return <line x1="150" y1="160" x2={nx} y2={ny} stroke="white" strokeWidth={3} strokeLinecap="round" />
          })()}
          <circle cx="150" cy="160" r="8" fill="white" />
          {/* Labels */}
          <text x="25" y="178" style={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}>0</text>
          <text x="272" y="178" style={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}>100</text>
          <text x="150" y="140" textAnchor="middle" style={{ fontSize: 36, fontWeight: 900, fill: 'white' }} className="font-display">{nps}</text>
          <text x="150" y="158" textAnchor="middle" style={{ fontSize: 11, fill: C.turquoise }}>Excellent</text>
        </svg>
      </div>
    </ChartSlide>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                    MAIN PRESENTATION                       */
/* ═══════════════════════════════════════════════════════════ */

const slides = [
  SlideNorthStar, SlideValues, SlideRules, SlideAgenda, SlideGoals,
  SlideProductDemo, SlideOrgChart, SlideBarChart, SlideStackedBar, SlideHorizontalBar, SlideLineChart, SlideMultiLine, SlideDonutChart,
  SlideScatterPlot, SlideHistogram, SlideHeatMap, SlideTreemap, SlideSankey,
  SlideWaterfall, SlideBoxPlot, SlideBubbleChart, SlideRadarChart, SlideGantt,
  SlideFunnel, SlideAreaChart, SlideBulletGraph, SlideChoropleth, SlideSunburst,
  SlideParallel, SlideWordCloud, SlideChord, SlideCandlestick, SlideViolin,
  SlidePictorial, SlideGauge,
]

/* Dark slide indices (0-based) — slides with bg-slate-950 */
const darkSlideSet = new Set([5, 6, 7, 9, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34])
const brandSlideSet = new Set([8, 13, 15, 21, 27])

const slideMeta = [
  { title: 'North Star', subtitle: 'Vision' },
  { title: 'Values', subtitle: 'What We Stand For' },
  { title: 'Rules of the Road', subtitle: 'How We Work' },
  { title: 'Agenda', subtitle: 'Today\u2019s Topics' },
  { title: 'Goals', subtitle: 'What We\u2019re Targeting' },
  { title: 'Product Demo', subtitle: 'Live Walkthrough' },
  { title: 'Org Chart', subtitle: 'Team Structure' },
  { title: 'Bar Chart', subtitle: 'Revenue by Quarter' },
  { title: 'Stacked Bar', subtitle: 'Segment Breakdown' },
  { title: 'Horizontal Bar', subtitle: 'Regional Performance' },
  { title: 'Line Chart', subtitle: 'Growth Trend' },
  { title: 'Multi-Line', subtitle: 'Product Comparison' },
  { title: 'Donut Chart', subtitle: 'Market Share' },
  { title: 'Scatter Plot', subtitle: 'Correlation Analysis' },
  { title: 'Histogram', subtitle: 'Distribution' },
  { title: 'Heat Map', subtitle: 'Activity Patterns' },
  { title: 'Treemap', subtitle: 'Hierarchical View' },
  { title: 'Sankey', subtitle: 'Flow Analysis' },
  { title: 'Waterfall', subtitle: 'Bridge Analysis' },
  { title: 'Box Plot', subtitle: 'Statistical Spread' },
  { title: 'Bubble Chart', subtitle: 'Multi-Dimensional' },
  { title: 'Radar Chart', subtitle: 'Multi-Axis Comparison' },
  { title: 'Gantt Chart', subtitle: 'Project Timeline' },
  { title: 'Funnel', subtitle: 'Conversion Pipeline' },
  { title: 'Area Chart', subtitle: 'Cumulative Trend' },
  { title: 'Bullet Graph', subtitle: 'Target vs Actual' },
  { title: 'Choropleth', subtitle: 'Geographic Data' },
  { title: 'Sunburst', subtitle: 'Nested Categories' },
  { title: 'Parallel Coordinates', subtitle: 'Multi-Variable' },
  { title: 'Word Cloud', subtitle: 'Text Analysis' },
  { title: 'Chord Diagram', subtitle: 'Relationships' },
  { title: 'Candlestick', subtitle: 'Price Movement' },
  { title: 'Violin Plot', subtitle: 'Distribution Shape' },
  { title: 'Pictorial', subtitle: 'Icon-Based Data' },
  { title: 'Gauge', subtitle: 'KPI Score' },
]

// Minimal SlideData stubs for rating component
const slideRatingStubs: SlideData[] = [
  { type: 'two-column', bg: 'light', title: 'Félix North Star', columns: [] },
  { type: 'cards', bg: 'light', title: 'Our Values', cards: [] },
  { type: 'cards', bg: 'light', title: 'Rules of the Land', cards: [] },
  { type: 'bullets', bg: 'light', title: 'Agenda', bullets: [] },
  { type: 'cards', bg: 'light', title: 'Goals', cards: [] },
  { type: 'two-column', bg: 'dark', title: 'Send Money in 60 Seconds', columns: [] },
  { type: 'cards', bg: 'dark', title: 'Our Team', cards: [] },
  { type: 'chart', bg: 'dark', title: 'Bar Chart' },
  { type: 'chart', bg: 'brand', title: 'Stacked Bar' },
  { type: 'chart', bg: 'light', title: 'Horizontal Bar' },
  { type: 'chart', bg: 'dark', title: 'Line Chart' },
  { type: 'chart', bg: 'dark', title: 'Multi-Line' },
  { type: 'chart', bg: 'brand', title: 'Donut Chart' },
  { type: 'chart', bg: 'dark', title: 'Scatter Plot' },
  { type: 'chart', bg: 'light', title: 'Histogram' },
  { type: 'chart', bg: 'dark', title: 'Heat Map' },
  { type: 'chart', bg: 'light', title: 'Treemap' },
  { type: 'chart', bg: 'dark', title: 'Sankey' },
  { type: 'chart', bg: 'light', title: 'Waterfall' },
  { type: 'chart', bg: 'dark', title: 'Box Plot' },
  { type: 'chart', bg: 'light', title: 'Bubble Chart' },
  { type: 'chart', bg: 'dark', title: 'Radar Chart' },
  { type: 'chart', bg: 'brand', title: 'Gantt Chart' },
  { type: 'chart', bg: 'dark', title: 'Funnel' },
  { type: 'chart', bg: 'light', title: 'Area Chart' },
  { type: 'chart', bg: 'dark', title: 'Bullet Graph' },
  { type: 'chart', bg: 'light', title: 'Choropleth' },
  { type: 'chart', bg: 'dark', title: 'Sunburst' },
  { type: 'chart', bg: 'light', title: 'Parallel Coordinates' },
  { type: 'chart', bg: 'dark', title: 'Word Cloud' },
  { type: 'chart', bg: 'light', title: 'Chord Diagram' },
  { type: 'chart', bg: 'dark', title: 'Candlestick' },
  { type: 'chart', bg: 'light', title: 'Violin Plot' },
  { type: 'chart', bg: 'dark', title: 'Pictorial' },
  { type: 'chart', bg: 'light', title: 'Gauge' },
]

export default function PresoSamplePage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('preso-sample-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('preso-sample.pdf')
  const { locale, setLocale } = useLocale()
  const slideRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(slideRef, locale, current)
  const total = slides.length

  /* ── Hash sync ──────────────────────────────────────────── */
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

  /* ── Keyboard ───────────────────────────────────────────── */
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

  /* ── Touch / swipe ──────────────────────────────────────── */
  const [touchX, setTouchX] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => setTouchX(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return
    const diff = touchX - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    setTouchX(null)
  }

  /* ── Render ─────────────────────────────────────────────── */
  const Slide = slides[current]
  const isDark = darkSlideSet.has(current)
  const isBrand = brandSlideSet.has(current)

  // Chrome color helpers — brand slides use slate-based chrome for contrast on turquoise
  const pillBg = isBrand ? 'bg-slate/20 border-slate/20' : isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border shadow-xs'
  const pillText = isBrand ? 'text-slate/80' : isDark ? 'text-white/70' : 'text-foreground'
  const hintText = isBrand ? 'text-slate/50' : isDark ? 'text-white/40' : 'text-muted-foreground'
  const trackBg = isBrand ? 'bg-slate/10' : isDark ? 'bg-white/10' : 'bg-concrete/30'
  const trackFill = isBrand ? 'bg-slate/60' : isDark ? 'bg-turquoise-400' : 'bg-turquoise-600'
  const dotActive = isBrand ? 'bg-slate/70' : isDark ? 'bg-turquoise-400' : 'bg-turquoise-600'
  const dotInactive = isBrand ? 'bg-slate/20 hover:bg-slate/30' : isDark ? 'bg-white/20 hover:bg-white/30' : 'bg-concrete hover:bg-concrete/70'
  const btnCls = isBrand ? 'bg-slate/15 border-slate/15 hover:bg-slate/25' : isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'
  const btnIcon = isBrand ? 'text-slate/70' : isDark ? 'text-white/70' : 'text-foreground'

  return (
    <PresentationPassword>
    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-colors duration-500 ${trackBg}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${trackFill}`}
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
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

      {/* Slide content with crossfade */}
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
            source="preso-sample"
            dark={darkSlideSet.has(current)}
          />
        </div>
      </div>

      {/* Dot indicators */}
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

      {/* Prev / Next buttons — desktop */}
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

      {/* Mobile swipe hint */}
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
