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
  return (
    <div className="relative rounded-xl border border-border bg-white overflow-hidden p-8 sm:p-10 lg:p-12">
      <span className="absolute right-5 top-1 select-none font-display text-[120px] sm:text-[150px] lg:text-[180px] font-black leading-none text-concrete/20 pointer-events-none">
        {num}
      </span>
      <div className="relative flex flex-col gap-5">
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
            {/* Card 1 — Share Impactful Updates */}
            <RuleCard num={1}>
              <h3 className="font-display font-extrabold text-foreground text-2xl lg:text-3xl leading-snug max-w-[65%]">
                Share Impactful Updates
              </h3>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Focus on key metrics, efficiency, and valuable insights aligned with company values.
              </p>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                For each highlight or learning, consider: <em className="text-foreground/70">Does this show impact? How does it connect to our quarterly goals?</em>
              </p>
            </RuleCard>

            {/* Card 2 — Be Concise */}
            <RuleCard num={2}>
              <h3 className="font-display font-extrabold text-foreground text-2xl lg:text-3xl leading-snug max-w-[65%]">
                Be Concise:
              </h3>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Keep updates brief and to the point.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-foreground/50 mt-0.5" strokeWidth={1.5} />
                  <span className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">Add the number of minutes you&apos;ll take to present.</span>
                </li>
              </ul>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                We&apos;ll track your presentation with a timer based on that.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-foreground/50 mt-0.5" strokeWidth={1.5} />
                  <span className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">If sharing some slides, no more than 4</span>
                </li>
              </ul>
            </RuleCard>

            {/* Card 3 — Limit Demos */}
            <RuleCard num={3}>
              <h3 className="font-display font-extrabold text-foreground text-2xl lg:text-3xl leading-snug max-w-[65%]">
                Limit Demos:
              </h3>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Have links ready and keep demos under 2 minutes.
              </p>
            </RuleCard>

            {/* Card 4 — Use a Clear Structure */}
            <RuleCard num={4}>
              <h3 className="font-display font-extrabold text-foreground text-2xl lg:text-3xl leading-snug max-w-[65%]">
                Use a Clear Structure
              </h3>
              <ul className="space-y-4">
                {[
                  { text: 'Objective: Goal of the initiative', bold: false },
                  { text: 'Action: What was done', bold: false },
                  { text: 'Impact: Results or learnings', bold: true },
                  { text: 'Next Steps (If applicable)', bold: false },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-foreground/50 mt-0.5" strokeWidth={1.5} />
                    <span className={`text-xl lg:text-2xl leading-relaxed ${item.bold ? 'font-display font-extrabold text-foreground' : 'text-muted-foreground'}`}>
                      {item.text}
                    </span>
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
                    {item.link ? (
                      <span className="underline underline-offset-4 font-semibold">{item.label}</span>
                    ) : (
                      <span className="font-semibold">{item.label}</span>
                    )}
                    <span className="font-normal text-muted-foreground"> — {item.time}</span>
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
      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-2">
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
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-border">
          <span className="text-xs text-muted-foreground">Swipe to navigate</span>
        </div>
      </div>
    </div>
  )
}
