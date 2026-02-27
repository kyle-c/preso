'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, ArrowRight } from 'lucide-react'

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
  { label: 'F\u00e9lixBook', time: '10 min', link: true },
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
    label: 'Fortify & aggressively\ngrow remittances to top 3',
    bg: 'turquoise',
    rows: [
      { kr: '3.6 million transactions', krSuffix: ' in Q1', status: 'olive', pct: 56, rangeMin: '2M', rangeMax: '3.6M' },
      { kr: '91% error-free transactions', status: 'red', pct: 97, rangeMin: '88.2%', rangeMax: '91.1%' },
      { kr: '55.3% new users 30 day moving retention rate (4 weeks moving avg)', status: 'green', pct: 105, rangeMin: '58.2%', rangeMax: '55.3%' },
    ],
  },
  {
    label: 'Scale SNPL to Sustainable\nProduct-Market Fit',
    bg: 'lime',
    rows: [
      { kr: 'Originate 5.8k loans', status: 'green', pct: 52, rangeMin: '3k', rangeMax: '5.8k' },
    ],
  },
  {
    label: 'Must-Win Battles (MWB)',
    bg: 'black',
    rows: [
      { kr: 'Launch Ecuador and Peru', status: 'yellow', pct: 0, rangeMin: '', rangeMax: '' },
      { kr: 'Produce a single, aligned roadmap for multi-product readiness', status: 'olive', pct: 0, rangeMin: '', rangeMax: '' },
    ],
  },
]

/* ─────────────────── Status Dot Colors ──────────────────── */

function statusDotClass(s: StatusColor) {
  switch (s) {
    case 'olive': return 'bg-[#A8B38B]'
    case 'red': return 'bg-[#C0392B]'
    case 'green': return 'bg-[#4B7F52]'
    case 'yellow': return 'bg-[#F1D71F]'
  }
}

/* ──────────────────────── Footer ─────────────────────────── */

function SlideFooter({ num }: { num: number }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className="font-display font-extrabold text-foreground text-xs sm:text-sm">Team Weekly</span>
      <span className="text-muted-foreground text-xs sm:text-sm">felixpago.com</span>
      <span className="text-foreground text-xs sm:text-sm font-medium">{num}</span>
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

/* ──────────────────── Progress Bar ───────────────────────── */

function ProgressBarCell({ pct }: { pct: number }) {
  const filled = Math.min(pct, 100)
  return (
    <div className="relative w-full">
      <div className="flex h-7 sm:h-8 w-full overflow-hidden rounded-sm">
        <div className="bg-turquoise flex items-center justify-center transition-all" style={{ width: `${filled}%` }}>
          <span className="text-[10px] sm:text-xs font-semibold text-slate">{pct}%</span>
        </div>
        <div className="bg-slate flex-1" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE COMPONENTS                       */
/* ═══════════════════════════════════════════════════════════ */

/* ── Slide 1: Felix North Star ────────────────────────────── */
function SlideNorthStar() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col">
      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full max-w-[1400px] mx-auto">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1] tracking-tight mb-6 lg:mb-8">
              F&eacute;lix North Star
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-foreground/80 leading-relaxed max-w-lg">
              Become the companion for Latinos in the United States enabling them to access financial services throughout their journey as immigrants.
            </p>
          </div>

          {/* Right */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="mb-6">
              <PillBadge>Mission</PillBadge>
              <p className="mt-4 text-base sm:text-lg text-foreground leading-relaxed">
                To empower Latinos in the US to care for what matters most back home.
              </p>
            </div>

            <div>
              <PillBadge>Key Principles</PillBadge>
              <ul className="mt-5 space-y-3">
                {principles.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base text-foreground leading-snug">{p}</span>
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
function SlideRules() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col">
      <div className="flex-1 flex flex-col px-8 sm:px-12 lg:px-16 py-8 sm:py-12 overflow-hidden">
        <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1] tracking-tight mb-6 lg:mb-8">
          Rules of the land
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 flex-1 max-w-[1400px] w-full">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-turquoise flex items-center justify-center mb-4">
              <span className="font-display font-extrabold text-slate text-sm sm:text-base">1</span>
            </div>
            <p className="font-display font-extrabold text-foreground text-sm sm:text-base mb-2">Share Impactful Updates</p>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-3">
              Focus on key metrics, efficiency, and valuable insights aligned with company values.
            </p>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
              For each highlight or learning, consider: <em>Does this show impact? How does it connect to our quarterly goals?</em>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col md:row-start-1 md:col-start-2">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-turquoise flex items-center justify-center mb-4">
              <span className="font-display font-extrabold text-slate text-sm sm:text-base">3</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
              <span className="font-display font-extrabold text-foreground">Limit Demos:</span> Have links ready and keep demos under 2 minutes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col md:row-start-2 md:col-start-1">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-turquoise flex items-center justify-center mb-4">
              <span className="font-display font-extrabold text-slate text-sm sm:text-base">2</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-2">
              <span className="font-display font-extrabold text-foreground">Be Concise:</span> Keep updates brief and to the point.
            </p>
            <ul className="space-y-1 mb-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-foreground/60 mt-0.5" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-foreground/80 leading-relaxed">Add the number of minutes you&apos;ll take to present.</span>
              </li>
            </ul>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-2">
              We&apos;ll track your presentation with a timer based on that.
            </p>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-foreground/60 mt-0.5" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-foreground/80 leading-relaxed">If sharing some slides, no more than 4</span>
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col md:row-start-2 md:col-start-2">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-turquoise flex items-center justify-center mb-4">
              <span className="font-display font-extrabold text-slate text-sm sm:text-base">4</span>
            </div>
            <p className="font-display font-extrabold text-foreground text-sm sm:text-base mb-3">Use a Clear Structure</p>
            <ul className="space-y-2">
              {[
                { text: 'Objective: Goal of the initiative', bold: false },
                { text: 'Action: What was done', bold: false },
                { text: 'Impact: Results or learnings', bold: true },
                { text: 'Next Steps (If applicable)', bold: false },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-foreground/60 mt-0.5" strokeWidth={1.5} />
                  <span className={`text-xs sm:text-sm leading-relaxed ${item.bold ? 'font-display font-extrabold text-foreground' : 'text-foreground/80'}`}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
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
    <div className="relative h-full w-full bg-stone flex flex-col">
      <div className="flex-1 flex flex-col px-8 sm:px-12 lg:px-16 py-8 sm:py-12">
        <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1] tracking-tight mb-8 lg:mb-10">
          Feb. 23th - Feb. 27th
        </h1>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-[1400px] w-full">
          {/* Illustration */}
          <div className="flex items-center justify-center rounded-2xl border border-border bg-white p-6 sm:p-8 h-full max-h-[400px]">
            <object
              type="image/svg+xml"
              data="/illustrations/3 Paper Airplanes + Coins.svg"
              className="h-full w-full max-h-[320px]"
              style={{ pointerEvents: 'none' }}
              aria-label="Paper airplanes and coins illustration"
            />
          </div>

          {/* Agenda */}
          <div>
            <h2 className="font-display font-extrabold text-foreground text-2xl sm:text-3xl mb-6 sm:mb-8">
              Agenda
            </h2>
            <ul className="space-y-4 sm:space-y-5">
              {agenda.map((item) => (
                <li key={item.label} className="flex items-baseline gap-3">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-foreground mt-1" strokeWidth={2} />
                  <span className="text-base sm:text-lg lg:text-xl text-foreground leading-snug">
                    {item.link ? (
                      <span className="underline underline-offset-4 font-semibold">{item.label}</span>
                    ) : (
                      <span className="font-semibold">{item.label}</span>
                    )}
                    <span className="font-normal text-foreground/70"> - {item.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SlideFooter num={5} />
    </div>
  )
}

/* ── Slide 4: Goals for Q1 2026 ───────────────────────────── */

function ObjectiveBadge({ label, bg }: { label: string; bg: 'turquoise' | 'lime' | 'black' }) {
  const bgMap = {
    turquoise: 'bg-turquoise text-slate',
    lime: 'bg-lime text-slate',
    black: 'bg-slate text-linen',
  }
  return (
    <div className={`rounded-xl px-4 py-4 sm:py-5 ${bgMap[bg]}`}>
      <p className="font-display font-extrabold text-xs sm:text-sm leading-snug whitespace-pre-line">
        {label}
      </p>
    </div>
  )
}

function SlideGoals() {
  return (
    <div className="relative h-full w-full bg-linen flex flex-col">
      <div className="flex-1 flex flex-col px-5 sm:px-8 lg:px-12 py-6 sm:py-8 overflow-auto">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1] tracking-tight">
            Goals for Q1 2026
          </h1>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold flex-shrink-0 mt-1">
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-5 sm:h-4 sm:w-6 rounded-sm bg-turquoise" /> Progress</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-5 sm:h-4 sm:w-6 rounded-sm bg-slate" /> Road ahead</span>
          </div>
        </div>

        {/* Column headers */}
        <div className="grid gap-2 sm:gap-3 mb-3 sm:mb-4" style={{ gridTemplateColumns: '1fr 1.4fr 0.5fr 1.2fr' }}>
          <p className="font-display font-extrabold text-foreground text-xs sm:text-sm">Annual Objectives</p>
          <p className="font-display font-extrabold text-foreground text-xs sm:text-sm">Q1 Key Results</p>
          <p className="font-display font-extrabold text-foreground text-xs sm:text-sm text-center">Q Status</p>
          <p className="font-display font-extrabold text-foreground text-xs sm:text-sm">QTD progress</p>
        </div>

        {/* Rows */}
        <div className="space-y-3 sm:space-y-4 flex-1">
          {objectives.map((obj) => (
            <div key={obj.label} className="grid gap-2 sm:gap-3 items-start" style={{ gridTemplateColumns: '1fr 1.4fr 0.5fr 1.2fr' }}>
              {/* Objective badge spanning its rows */}
              <div className="row-span-full flex items-stretch">
                <ObjectiveBadge label={obj.label} bg={obj.bg} />
              </div>

              {/* Key results */}
              <div className="space-y-3 sm:space-y-4 col-start-2 col-end-5">
                {obj.rows.map((row) => (
                  <div key={row.kr} className="grid gap-2 sm:gap-3 items-center" style={{ gridTemplateColumns: '1.4fr 0.5fr 1.2fr' }}>
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-foreground flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-foreground leading-snug">
                        <span className="font-semibold">{row.kr}</span>
                        {row.krSuffix && <span className="font-normal">{row.krSuffix}</span>}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <div className={`h-6 w-6 sm:h-7 sm:w-7 rounded-full ${statusDotClass(row.status)}`} />
                    </div>
                    <div>
                      {row.pct > 0 ? (
                        <div>
                          <ProgressBarCell pct={row.pct} />
                          <div className="flex justify-between mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{row.rangeMin}</span>
                            <span className="text-[10px] text-muted-foreground">{row.rangeMax}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-7 sm:h-8" />
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

/* ═══════════════════════════════════════════════════════════ */
/*                    MAIN PRESENTATION                       */
/* ═══════════════════════════════════════════════════════════ */

const slides = [SlideNorthStar, SlideRules, SlideAgenda, SlideGoals]

export default function PresoSamplePage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
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
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      else if (e.key === 'Home') { e.preventDefault(); setCurrent(0) }
      else if (e.key === 'End') { e.preventDefault(); setCurrent(total - 1) }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [mounted, total, next, prev])

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

  return (
    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-concrete/30 z-50">
        <div
          className="h-full bg-turquoise-600 transition-all duration-500 ease-out"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-border shadow-xs">
          <span className="text-xs sm:text-sm font-medium text-foreground">
            {current + 1} / {total}
          </span>
        </div>
      </div>

      {/* Nav hint */}
      <div className="hidden md:block absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-border shadow-xs">
          <span className="text-xs text-muted-foreground">&larr; &rarr; to navigate</span>
        </div>
      </div>

      {/* Slide content with crossfade */}
      <div className="h-full w-full" key={current}>
        <div className="h-full w-full animate-in fade-in duration-300">
          <Slide />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              current === i
                ? 'w-8 sm:w-12 bg-turquoise-600'
                : 'w-1.5 sm:w-2 bg-concrete hover:bg-concrete/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next buttons — desktop */}
      <button
        onClick={prev}
        disabled={current === 0}
        className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full bg-white/90 backdrop-blur-sm border border-border hover:bg-white hover:shadow-md transition-all ${
          current === 0 ? 'opacity-0 pointer-events-none' : ''
        }`}
        aria-label="Previous slide"
        type="button"
      >
        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        disabled={current === total - 1}
        className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full bg-white/90 backdrop-blur-sm border border-border hover:bg-white hover:shadow-md transition-all ${
          current === total - 1 ? 'opacity-0 pointer-events-none' : ''
        }`}
        aria-label="Next slide"
        type="button"
      >
        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Mobile swipe hint */}
      <div className="md:hidden absolute bottom-14 left-1/2 -translate-x-1/2 z-40">
        <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-border">
          <span className="text-xs text-muted-foreground">Swipe to navigate</span>
        </div>
      </div>
    </div>
  )
}
