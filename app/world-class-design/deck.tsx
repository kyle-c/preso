'use client'

import { useState, useEffect, useCallback } from 'react'

/* ─────────────────────── Shared Components ─────────────────────── */

function Kicker({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <p className={`font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.28em] mb-3 sm:mb-4 ${muted ? 'text-evergreen' : 'text-papaya'}`}>
      {children}
    </p>
  )
}

function CardLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`font-sans font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.1em] mb-2 ${dark ? 'text-linen/80' : 'text-slate/60'}`}>
      {children}
    </p>
  )
}

function OrangeRule({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 w-[3px] self-stretch rounded-full bg-papaya flex-shrink-0" />
      <p className={`text-sm sm:text-base font-bold leading-relaxed ${dark ? 'text-linen' : 'text-slate'}`}>{children}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                         SLIDE COMPONENTS                           */
/* ═══════════════════════════════════════════════════════════════════ */

/* ── Slide 1: Title (slate) ──────────────────────────────────────── */
function SlideTitle() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col justify-center px-[8%] py-10">
        <Kicker>Design Org</Kicker>
        <h1 className="font-display font-extrabold text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] tracking-tight mb-5 lg:mb-6 max-w-4xl">
          Building a world&#8209;class design team
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-medium leading-relaxed max-w-xl mb-6 lg:mb-8">
          The thesis and bar for shaping the design at Félix.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Getting the right shit done', 'Building strong relationships', 'Improving the team', 'High craft bar'].map((o) => (
            <span key={o} className="inline-flex items-center rounded-full bg-white/5 border border-white/15 px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-300">
              {o}
            </span>
          ))}
        </div>
      </div>
      <p className="absolute bottom-[7%] left-[8%] font-sans font-bold text-xs uppercase tracking-[0.08em] text-turquoise">Félix Pago</p>
    </div>
  )
}

/* ── Slide 2: Executive Summary (linen) ──────────────────────────── */
function SlideExecSummary() {
  const claims = [
    { claim: 'Craft is the gate.', support: 'Quality means clearing every layer, from doesn’t fail to feels great, and craft is the one skill that can’t be faked.' },
    { claim: 'Evidence over averaging.', support: 'Candidates are scored on eight dimensions from evidence we can cite, and failing a gate is a no regardless of the rest. The work is measured the same way, layer by layer.' },
    { claim: 'The bar is a system, not a person.', support: 'A written craft standard replaces taste debates before the first lead arrives.' },
    { claim: 'Generalists first. Specialists follow the work.', support: 'Structure one step ahead of growth.' },
    { claim: 'An open req stays open, never filled at bar\u2011minus\u2011one.', support: 'A high bar on a small team means false negatives and slow fills. That\u2019s the trade we accept.' },
  ]

  return (
    <div className="relative h-full w-full bg-linen flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible flex flex-col justify-start lg:justify-center px-[8%] py-10 pb-16 lg:pb-10">
        <Kicker>Executive summary</Kicker>
        <h1 className="font-display font-extrabold text-slate text-3xl sm:text-4xl lg:text-5xl leading-[1.02] tracking-tight mb-2 max-w-3xl">
          The short version.
        </h1>
        <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed max-w-3xl mb-5 lg:mb-7">
          The (abbreviated) thesis and bar for shaping the design at Félix.
        </p>

        <div className="flex flex-col max-w-5xl divide-y divide-slate-200/70">
          {claims.map((c, i) => (
            <div key={c.claim} className="flex items-start gap-5 py-4 lg:py-5 first:pt-0 last:pb-0">
              <span className="font-display font-extrabold text-papaya text-2xl sm:text-3xl leading-[1.1] w-9 flex-shrink-0">{i + 1}</span>
              <div>
                <h3 className="font-display font-extrabold text-slate text-xl sm:text-2xl lg:text-3xl leading-[1.1] mb-1">{c.claim}</h3>
                <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">{c.support}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Slide 3: Thesis + Why Craft First (linen) ───────────────────── */
function SlideThesis() {
  const points = [
    { title: 'Craft is how judgment becomes real', desc: 'States, edges, recovery, and restraint are the experience, not polish on top of it.' },
    { title: 'Without a craft bar, teams stop early', desc: 'They clear "right functionality" and call it done. UX reasoning is arguable; craft gaps are dismissible.' },
    { title: 'Craft is the slow skill', desc: 'It takes years to build and can’t be faked in an interview or a portfolio.' },
  ]

  return (
    <div className="relative h-full w-full bg-linen flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible flex flex-col justify-start lg:justify-center px-[8%] py-10 pb-16 lg:pb-10">
        <Kicker>The thesis</Kicker>
        <h1 className="font-display font-extrabold text-slate text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.02] tracking-tight mb-4 lg:mb-5 max-w-3xl">
          A bar, not a headcount.
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-800 font-medium leading-relaxed max-w-3xl mb-6 lg:mb-8">
          A world-class team is defined by the standard it holds, not the number of seats it fills.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-6 lg:mb-8">
          {points.map((p) => (
            <div key={p.title} className="bg-stone rounded-xl p-5 sm:p-6">
              <h3 className="font-display font-extrabold text-slate text-lg sm:text-xl leading-snug mb-2">{p.title}</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <OrangeRule>Craft is the slow skill and the one that can&apos;t be faked, so it&apos;s the gate we never compromise first.</OrangeRule>
      </div>
    </div>
  )
}

/* ── Slide 4: The Hierarchy (slate) ──────────────────────────────── */
function SlideHierarchy() {
  const layers = [
    { n: 5, title: 'Looks and feels great', desc: 'Can’t be faked.', inst: 'Repeat use, share of wallet · desirability studies', frame: 'Delightful · the bar', hero: true },
    { n: 4, title: 'Effortless', desc: 'Minimal steps, nothing to figure out.', inst: 'Completion, drop-off · usability testing', frame: 'Usable' },
    { n: 3, title: 'Fast', desc: 'Real and perceived speed.', inst: 'Latency metrics · speed probes in sessions', frame: 'Usable' },
    { n: 2, title: 'Right functionality', desc: 'Solves the actual problem.', inst: 'Conversion, adoption · discovery interviews', frame: 'Useful' },
    { n: 1, title: 'Doesn’t fail', desc: 'Every state, edge, and failure handled.', inst: 'Error rates, support contacts · replays and tickets', frame: 'Useful' },
  ]

  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible flex flex-col justify-start lg:justify-center px-[8%] py-10 pb-16 lg:pb-10">
        <Kicker>Magical experiences</Kicker>
        <h1 className="font-display font-extrabold text-linen text-3xl sm:text-4xl lg:text-5xl leading-[1.02] tracking-tight mb-2 max-w-3xl">
          Magic is every layer cleared, not a layer added on top.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mb-5 lg:mb-7">
          Each layer depends on the one below it, and every layer has an instrument: quant finds the leak, qual explains why, and the transcript shows both.
        </p>

        <div className="flex flex-col gap-1.5 mb-5 lg:mb-6">
          {layers.map((l) => (
            <div key={l.n} className={`${l.hero ? 'bg-papaya' : 'bg-white/[0.07]'} text-linen rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 grid grid-cols-1 md:grid-cols-[15rem_1fr_10rem] gap-1 md:gap-4 md:items-baseline`}>
              <div className="flex items-baseline gap-3">
                <span className="font-display font-extrabold text-base sm:text-lg leading-none opacity-50 w-4 flex-shrink-0">{l.n}</span>
                <h3 className="font-display font-extrabold text-sm sm:text-base leading-snug">{l.title}</h3>
              </div>
              <p className={`text-xs sm:text-sm leading-snug ${l.hero ? 'text-linen/90' : 'text-linen/70'}`}>
                {l.desc} <span className={l.hero ? 'text-linen/70' : 'text-linen/40'}>{l.inst}</span>
              </p>
              <span className={`hidden md:block text-right font-sans font-extrabold text-[10px] uppercase tracking-[0.1em] ${l.hero ? 'text-linen' : 'text-linen/40'}`}>{l.frame}</span>
            </div>
          ))}
        </div>

        <OrangeRule dark>Useful and usable are table stakes. Delightful and magical are the bar. A designer&apos;s craft score is the layer their shipped work reliably reaches.</OrangeRule>
      </div>
    </div>
  )
}

/* ── Slide 6: The Bar (linen) ────────────────────────────────────── */
function SlideBar() {
  const additive = [
    { title: 'Autonomy and ownership', desc: 'Drives without being driven and owns the outcome through shipping. Grit on hard problems. Calibration, not lone-wolf independence.' },
    { title: 'Communication', desc: 'Complex ideas made legible; proactive.' },
    { title: 'Collaboration & values', desc: 'Partnership, and behavior when wrong or uncredited.' },
    { title: 'Growth & coachability', desc: 'Slope under pushback. AI as a tool: what they built, what they stopped doing by hand.' },
  ]

  return (
    <div className="relative h-full w-full bg-linen flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible flex flex-col justify-start lg:justify-center px-[8%] py-10 pb-16 lg:pb-10">
        <Kicker>The bar</Kicker>
        <h1 className="font-display font-extrabold text-slate text-3xl sm:text-4xl lg:text-5xl leading-[1.02] tracking-tight mb-2 max-w-3xl">
          Eight dimensions. Two are gates.
        </h1>
        <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed max-w-3xl mb-5 lg:mb-6">
          Score 1–4 from cited evidence. A 1 on a gate declines regardless of everything else.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-3 lg:mb-4">
          <div className="bg-slate rounded-xl p-4 sm:p-5">
            <CardLabel dark>Gate</CardLabel>
            <h3 className="font-display font-extrabold text-linen text-lg sm:text-xl leading-snug mb-1.5">Craft</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">Visual design, animation, voice and tone, tactility, interactivity. Adaptable: range, speed, maintain quality within real constraints. Rigor, not specialism.</p>
          </div>
          <div className="bg-slate rounded-xl p-4 sm:p-5">
            <CardLabel dark>Gate</CardLabel>
            <h3 className="font-display font-extrabold text-linen text-lg sm:text-xl leading-snug mb-1.5">UX/IxD and Product thinking</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">User-focused, business-aware: tradeoffs, outcomes, evidence. Seniority is systems thinking: a mid solves the screen, a senior reframes the pattern, a staff designer designs the rules.</p>
          </div>
          <div className="bg-slate rounded-xl p-4 sm:p-5">
            <p className="font-sans font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.1em] mb-2 text-papaya">Near-gate</p>
            <h3 className="font-display font-extrabold text-linen text-lg sm:text-xl leading-snug mb-1.5">Designs for the medium</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">Every medium demands its own craft. Ours is conversational and AI&#8209;native on every surface: failure, latency, trust, act vs. ask. Evidence, not enthusiasm.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-5">
          {additive.map((a) => (
            <div key={a.title} className="bg-stone rounded-xl p-4 sm:p-5">
              <CardLabel>Additive</CardLabel>
              <h3 className="font-display font-extrabold text-slate text-base sm:text-lg leading-snug mb-1">{a.title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        <OrangeRule>The eighth dimension is <span className="font-display">motivation &amp; domain fit</span>, a simple pass or flag.</OrangeRule>
      </div>
    </div>
  )
}

/* ── Individual Expectations (linen) ─────────────────────────────── */
function SlideExpectations() {
  const expectations = [
    { title: 'Getting the right shit done', support: 'Do what we say we\u2019ll do on the problems that matter most, own the outcome, and push through when it gets hard.' },
    { title: 'Building strong relationships', support: 'Product development is a team sport. Designers stay deeply engaged with their cross-functional partners.' },
    { title: 'Improving the team', support: 'Brown bags, proactive help, and shaping the team itself. Improving the team means raising the layer the team reaches.' },
    { title: 'High craft bar', support: 'The skills you were hired for. In the operating rubric, craft is the hierarchy layer your shipped work reliably reaches.' },
  ]

  return (
    <div className="relative h-full w-full bg-linen flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible flex flex-col justify-start lg:justify-center px-[8%] py-10 pb-16 lg:pb-10">
        <Kicker>Once they&apos;re here</Kicker>
        <h1 className="font-display font-extrabold text-slate text-3xl sm:text-4xl lg:text-5xl leading-[1.02] tracking-tight mb-5 lg:mb-7 max-w-3xl">
          Individual expectations.
        </h1>

        <div className="flex flex-col max-w-5xl divide-y divide-slate-200/70">
          {expectations.map((e) => (
            <div key={e.title} className="flex flex-col py-4 lg:py-5 first:pt-0 last:pb-0">
              <h3 className="font-display font-extrabold text-slate text-xl sm:text-2xl lg:text-3xl leading-[1.1] mb-1">{e.title}</h3>
              <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">{e.support}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Slide 10: Shape by Size (linen) ─────────────────────────────── */
function SlideShape() {
  const stages = [
    {
      phase: '1–5 designers',
      points: ['80–100% senior; no juniors', 'Head as player-coach', 'Generalists own product areas', 'Content and research are the first non-generalist seats'],
    },
    {
      phase: '6–10 designers',
      points: ['60–70% senior; 0–1 junior', 'First lead; Head leaves IC work', 'Systems as a senior’s part-time ownership', 'IC track defined'],
    },
    {
      phase: '11–20 designers',
      points: ['~50% senior; 10–20% junior', '2–3 managers; Head manages managers at ~15', 'First Staff IC', 'Systems and ops become seats'],
    },
  ]

  return (
    <div className="relative h-full w-full bg-linen flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible flex flex-col justify-start lg:justify-center px-[8%] py-10 pb-16 lg:pb-10">
        <Kicker>The shape</Kicker>
        <h1 className="font-display font-extrabold text-slate text-3xl sm:text-4xl lg:text-5xl leading-[1.02] tracking-tight mb-2 max-w-4xl">
          Generalists first. Structure by capacity, not budget.
        </h1>
        <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed max-w-3xl mb-5 lg:mb-7">
          Mentoring capacity sets the junior ratio; span of control sets when managers appear. Those transitions are where the bar is most at risk.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-5 lg:mb-6">
          {stages.map((s) => (
            <div key={s.phase} className="bg-stone rounded-xl p-5 sm:p-6">
              <CardLabel>{s.phase}</CardLabel>
              <div className="flex flex-col gap-2 mt-3">
                {s.points.map((p) => (
                  <p key={p} className="text-sm sm:text-base text-slate-700 leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-stone rounded-xl px-5 py-3.5 flex flex-col gap-1.5 mb-5 lg:mb-6">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed"><span className="font-display font-extrabold text-slate">Depth first:</span> Content design · Research · Localization</p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed"><span className="font-display font-extrabold text-slate">Earn their seat:</span> Illustration · Motion · 3D. A seat opens when there&apos;s a quarter of full&#8209;time work a generalist is doing badly. Until then, contractors cover the surge.</p>
        </div>

        <OrangeRule>The best craftsperson goes to the IC track; the best multiplier becomes the lead. Craft calibration lives off the reporting line.</OrangeRule>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                       MAIN PRESENTATION                            */
/* ═══════════════════════════════════════════════════════════════════ */

const allSlides = [
  SlideTitle,        // 1
  SlideExecSummary,  // 2
  SlideThesis,       // 3
  SlideBar,          // 4
  SlideExpectations, // 5
  SlideShape,        // 6 (omitted in the v2 variant)
  SlideHierarchy,    // 7
]

export default function WorldClassDeck({ includeShape = true }: { includeShape?: boolean }) {
  const slides = includeShape ? allSlides : allSlides.filter((s) => s !== SlideShape)
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
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
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); document.documentElement.requestFullscreen?.() }
      else if (e.key === 'Home') { e.preventDefault(); setCurrent(0) }
      else if (e.key === 'End') { e.preventDefault(); setCurrent(total - 1) }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [mounted, total, next, prev])

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

  return (
    <div
      className="h-screen w-screen overflow-hidden relative bg-[#0A1211] flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 16:9 stage on md+, full-viewport below */}
      <div className="relative w-full h-full md:w-[min(100vw,177.78vh)] md:h-[min(56.25vw,100vh)]">
        <div className="h-full w-full" key={current}>
          <div className="h-full w-full animate-in fade-in duration-300">
            <Slide />
          </div>
        </div>
      </div>

      {/* Deck chrome on the page frame */}
      <p className="absolute bottom-4 left-5 text-xs font-medium tracking-[0.03em] text-[#5A6A69] hidden sm:block">
        &larr; &rarr; or Space to navigate · F for fullscreen
      </p>
      <p className="absolute bottom-4 right-5 text-[13px] font-semibold tracking-[0.04em] text-[#6D7D7C]">
        {current + 1} / {total}
      </p>

      {/* Mobile swipe hint */}
      <p className="absolute bottom-4 left-5 text-xs font-medium text-[#5A6A69] sm:hidden">Swipe to navigate</p>
    </div>
  )
}
