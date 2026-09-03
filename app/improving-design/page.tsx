'use client'

import { useState, useEffect, useCallback } from 'react'

/* ─────────────────────── Shared Components ─────────────────────── */

function SlideFooter({ num, total, dark }: { num: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Félix Design Org</span>
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/50' : 'text-muted-foreground'}`}>felixpago.com</span>
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

/* ═══════════════════════════════════════════════════════════════════ */
/*                         SLIDE COMPONENTS                           */
/* ═══════════════════════════════════════════════════════════════════ */

const TOTAL = 9

/* ── Slide 1: Title ──────────────────────────────────────────────── */
function SlideTitle() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl">
          <div className="mb-6 lg:mb-8 w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] lg:w-[210px] lg:h-[210px]">
            <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" className="h-full w-full" label="Two hands holding phones together" />
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-5 lg:mb-6">
            Building a Design Team<br className="hidden sm:block" /> Worth Talking About
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            A product design organization built for quality, speed, learning, and scale.
          </p>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} />
    </div>
  )
}

/* ── Slide 2: The Ambition ───────────────────────────────────────── */
function SlideAmbition() {
  const qualities = [
    { title: 'Deeply Informed by Customers', accent: 'bg-turquoise' },
    { title: 'Unusually Trustworthy', accent: 'bg-blueberry' },
    { title: 'Distinctively Conversational', accent: 'bg-mango' },
    { title: 'Growing From Remittance Into a Broader Financial Relationship', accent: 'bg-cactus' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible flex px-8 sm:px-12 lg:px-16 py-10 pb-16 md:pb-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full max-w-[1300px] mx-auto my-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <PillBadge>The Ambition</PillBadge>
            </div>
            <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.98] tracking-tight mb-5 lg:mb-7">
              Build the Best&#8209;Designed Financial Product for Latinos in the&nbsp;US
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
              The ambition is bigger than better design. Félix should not imitate Silicon Valley fintech — it should create a distinctive standard of its own.
            </p>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] lg:w-[210px] lg:h-[210px]">
              <Illo src="Hand%20-%20Cell%20Phone%20OK.svg" className="w-full h-full" label="A Félix product moment" />
            </div>
            <div className="flex flex-col gap-3 w-full max-w-md">
              {qualities.map((q) => (
                <div key={q.title} className="flex items-stretch bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className={`w-2 flex-shrink-0 ${q.accent}`} />
                  <div className="px-5 py-3.5 flex items-center">
                    <h4 className="font-display font-extrabold text-foreground text-sm sm:text-base leading-snug">{q.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={2} total={TOTAL} />
    </div>
  )
}

/* ── Slide 3: The Standard ───────────────────────────────────────── */
function SlideStandard() {
  const qualities = [
    { title: 'Product Judgment', desc: 'Determine what to build and why.', illo: 'Magnifying%20Glass.svg' },
    { title: 'Customer Understanding', desc: 'Design for the realities of cross-border finance.', illo: 'Survey.svg' },
    { title: 'Experience Craft', desc: 'Shape how Félix looks, speaks, moves, responds, and feels.', illo: 'Hand%20-%20Tool.svg' },
    { title: 'Execution', desc: 'Turn ambitious ideas into high-quality shipped products.', illo: 'Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg' },
    { title: 'Impact', desc: 'Improve customer behavior and business outcomes.', illo: 'Credit%20Score%20%2B%20Calculator.svg' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible flex flex-col items-center px-8 sm:px-12 lg:px-16 py-8 pb-16 md:pb-8 relative z-10">
        <div className="w-full my-auto max-w-[1250px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge>The Standard</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2 text-center">
            The Bar Is the Complete Customer Outcome
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-center mb-6 lg:mb-8 max-w-2xl mx-auto">
            Great design must shape, ship, and perform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 mb-5 lg:mb-6">
            {qualities.map((q, i) => (
              <div key={q.title} className="bg-white rounded-2xl p-4 sm:p-5 border border-border shadow-sm flex flex-col items-center text-center gap-2.5">
                <span className="font-display font-black text-turquoise-700 text-2xl sm:text-3xl leading-none">{`0${i + 1}`}</span>
                <div className="w-14 h-14 sm:w-16 sm:h-16">
                  <Illo src={q.illo} className="w-full h-full" />
                </div>
                <h3 className="font-display font-extrabold text-foreground text-base sm:text-lg leading-snug">{q.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{q.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-center mx-auto max-w-4xl">
            <p className="text-sm sm:text-base lg:text-lg text-linen leading-relaxed">
              The standard is not beautiful work in Figma. It is <span className="font-bold text-turquoise">a differentiated product thesis</span>, shipped with exceptional quality, and proven through customer behavior.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter num={3} total={TOTAL} />
    </div>
  )
}

/* ── Slide 4: Principles — Resolve Tensions (dark) ───────────────── */
function SlideTensions() {
  const tensions = [
    {
      label: 'Quality × Speed',
      accent: 'bg-turquoise',
      quote: 'Quality without shipping is unrealized potential. Shipping without quality erodes trust.',
      support: 'Ship the smallest valuable experience that preserves the product thesis.',
    },
    {
      label: 'Timeless × Timely',
      accent: 'bg-mango',
      quote: 'Timeless at the core. Timely at the edge.',
      support: 'Build enduring foundations — trust, clarity, accessibility, voice, and behavior — while evolving the expressive layer with customers, culture, and technology.',
    },
    {
      label: 'Cutting Edge × Customer-Centered',
      accent: 'bg-cactus',
      quote: 'Experiment aggressively inside the team. Introduce new technology to customers purposefully.',
      support: 'Technology must earn its place by improving value, usability, desirability, or trust.',
    },
  ]

  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[4%] w-[90px] lg:w-[130px] opacity-[0.1]" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="3%20Paper%20Airplanes%20%2B%20Coins.svg" className="w-full h-full" />
        </div>
        <div className="absolute bottom-0 right-0 w-[150px] lg:w-[220px] opacity-[0.08] -rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Speech%20Bubbles.svg" className="w-full h-full" />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible flex flex-col items-center px-8 sm:px-12 lg:px-16 py-8 pb-16 md:pb-8 relative z-10">
        <div className="w-full my-auto max-w-[1150px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge dark>Our Principles</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.98] tracking-tight mb-2 text-center">
            Resolve Tensions.<br />Don&apos;t Choose Sides.
          </h1>
          <p className="text-base sm:text-lg text-linen/60 text-center mb-6 lg:mb-8 max-w-2xl mx-auto">
            The strongest teams hold both ends of each tension at once.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
            {tensions.map((t) => (
              <div key={t.label} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                <div className={`h-1.5 ${t.accent}`} />
                <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
                  <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-[0.12em] text-linen/50">{t.label}</span>
                  <p className="font-display font-extrabold text-linen text-lg sm:text-xl leading-snug">{t.quote}</p>
                  <p className="text-sm sm:text-base text-linen/60 leading-relaxed mt-auto">{t.support}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={4} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 5: The People ─────────────────────────────────────────── */
function SlidePeople() {
  const identity = [
    'Product thinker',
    'Experience craftsperson',
    'Proactive communicator',
    'Cross-functional leader',
    'Constant learner',
    'Reliable shipper',
  ]
  const behaviors = [
    'Identifies opportunities instead of waiting for briefs',
    'Develops a clear point of view',
    'Builds relationships before needing something',
    'Shares early and surfaces disagreement directly',
    'Holds strong opinions while remaining open to evidence',
    'Owns quality through implementation and measurement',
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible flex flex-col items-center px-8 sm:px-12 lg:px-16 py-8 pb-16 md:pb-8 relative z-10">
        <div className="w-full my-auto max-w-[1150px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge>The People</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2 text-center">
            More Than Strong Individual Craft
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-center mb-5 lg:mb-6 max-w-2xl mx-auto">
            Hire people who make the work and the team better.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4 lg:gap-5 mb-4 lg:mb-5">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
              <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl mb-3 sm:mb-4">The Félix designer</h3>
              <div className="flex flex-wrap gap-2">
                {identity.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-turquoise/10 border border-turquoise/20 px-3.5 py-1.5 text-sm font-semibold text-turquoise-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-turquoise" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
              <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl mb-3 sm:mb-4">Behavioral proof</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {behaviors.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-cactus flex-shrink-0" />
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-mango/30 shadow-sm flex items-center gap-5 px-5 sm:px-6 py-3 sm:py-3.5">
            <div className="w-2 h-10 rounded-full bg-mango flex-shrink-0" />
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              <span className="font-display font-extrabold text-foreground">Proactive communication is not more activity.</span>{' '}
              It is creating clarity, alignment, and momentum.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter num={5} total={TOTAL} />
    </div>
  )
}

/* ── Slide 6: The Product Trio ───────────────────────────────────── */
function SlideTrio() {
  const trio = [
    { role: 'Design', desc: 'Customer understanding and the complete experience.', accent: 'bg-turquoise', illo: 'Hand%20-%20Cell%20Phone%20OK.svg' },
    { role: 'Product', desc: 'Outcomes, priorities, and tradeoffs.', accent: 'bg-blueberry', illo: 'Map%20%2B%20F%20symbol.svg' },
    { role: 'Engineering', desc: 'Technical insight, reliability, and implementation quality.', accent: 'bg-cactus', illo: 'Hand%20-%20Tool.svg' },
  ]
  const shared = ['What ships', 'The quality customers receive', 'The pace of learning', 'Customer and business outcomes']

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible flex flex-col items-center px-8 sm:px-12 lg:px-16 py-8 pb-16 md:pb-8 relative z-10">
        <div className="w-full my-auto max-w-[1100px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge>The Product Team</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2 text-center">
            The Product Trio Owns<br className="hidden sm:block" /> the Outcome Together
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-center mb-5 lg:mb-6 max-w-2xl mx-auto">
            Great design requires great PMs and engineers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-4 lg:mb-5">
            {trio.map((t) => (
              <div key={t.role} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
                <div className={`h-2 ${t.accent}`} />
                <div className="p-5 sm:p-6 flex flex-col items-center text-center gap-2 flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mb-1">
                    <Illo src={t.illo} className="w-full h-full" />
                  </div>
                  <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl leading-snug">{t.role}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 mb-4 lg:mb-5">
            <span className="font-display font-extrabold text-foreground text-sm sm:text-base mr-1">Shared ownership:</span>
            {shared.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-blueberry/10 border border-blueberry/20 px-3.5 py-1 text-sm font-semibold text-blueberry">
                <span className="w-1.5 h-1.5 rounded-full bg-blueberry" />
                {s}
              </span>
            ))}
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground text-center leading-relaxed max-w-3xl mx-auto">
            A great designer inside a weak product team will have limited impact. <span className="font-bold text-foreground">A strong product trio compounds everyone&apos;s abilities.</span>
          </p>
        </div>
      </div>
      <SlideFooter num={6} total={TOTAL} />
    </div>
  )
}

/* ── Slide 7: One Designer, Two Teams ────────────────────────────── */
function SlideTwoTeams() {
  const primary = [
    'Owns a durable customer or business outcome',
    'Builds deep relationships',
    'Shares accountability for delivery and impact',
  ]
  const secondary = [
    'Maintains the experience bar',
    'Develops talent and craft',
    'Creates shared foundations',
    'Protects coherence across Félix',
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible flex flex-col items-center px-8 sm:px-12 lg:px-16 py-8 pb-16 md:pb-8 relative z-10">
        <div className="w-full my-auto max-w-[1150px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge>One Designer, Two Teams</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4 lg:mb-5 text-center">
            Local Ownership.<br className="hidden sm:block" /> Company&#8209;Wide Coherence.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-10 items-center mb-3 lg:mb-4">
            {/* Two-circle relationship */}
            <div className="relative flex items-center justify-center h-[200px] sm:h-[240px]" aria-label="Every designer sits at the intersection of their product team and the design organization">
              <div className="absolute left-1/2 -translate-x-[72%] w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full bg-turquoise/25 border-2 border-turquoise flex items-center justify-center">
                <span className="font-display font-extrabold text-slate text-sm sm:text-base text-center leading-snug -translate-x-12 sm:-translate-x-14">Product<br />team</span>
              </div>
              <div className="absolute left-1/2 -translate-x-[28%] w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full bg-blueberry/20 border-2 border-blueberry flex items-center justify-center">
                <span className="font-display font-extrabold text-slate text-sm sm:text-base text-center leading-snug translate-x-12 sm:translate-x-14">Design<br />org</span>
              </div>
              <span className="relative z-10 rounded-full bg-white border border-border shadow-md px-3.5 py-1.5 font-display font-extrabold text-foreground text-xs sm:text-sm">
                The designer
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-turquoise/30 shadow-sm p-4 sm:p-5">
                <span className="inline-block rounded-full bg-turquoise/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-turquoise-700 mb-3">Primary · Cross-functional product team</span>
                <div className="flex flex-col gap-2">
                  {primary.map((p) => (
                    <div key={p} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-turquoise flex-shrink-0" />
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-blueberry/30 shadow-sm p-4 sm:p-5">
                <span className="inline-block rounded-full bg-blueberry/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blueberry mb-3">Secondary · Design organization</span>
                <div className="flex flex-col gap-2">
                  {secondary.map((s) => (
                    <div key={s} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-blueberry flex-shrink-0" />
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground text-center leading-relaxed max-w-3xl mx-auto">
            <span className="font-bold text-foreground">The primary team creates accountability.</span>{' '}
            <span className="font-bold text-foreground">The design team creates coherence.</span>
          </p>
        </div>
      </div>
      <SlideFooter num={7} total={TOTAL} />
    </div>
  )
}

/* ── Slide 8: Scaling ────────────────────────────────────────────── */
function SlideScaling() {
  const stages = [
    {
      phase: 'One Studio',
      color: 'bg-turquoise',
      borderColor: 'border-turquoise/30',
      points: [
        'Designers embedded in product teams',
        'Shared critique and standards',
        'Horizontal research, content, systems, and prototyping',
      ],
    },
    {
      phase: 'Journey Groups',
      color: 'bg-cactus',
      borderColor: 'border-cactus/30',
      points: [
        'Designers organized around durable customer journeys',
        'Senior player-coaches maintain direction and quality',
        'Horizontal capabilities scale with product design',
      ],
    },
    {
      phase: 'Federated Organization',
      color: 'bg-mango',
      borderColor: 'border-mango/30',
      points: [
        'Designers remain embedded',
        'Leads own broader journeys',
        'Staff designers solve cross-product problems',
        'Managers focus on talent and organizational health',
      ],
    },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible flex flex-col items-center px-8 sm:px-12 lg:px-16 py-8 pb-16 md:pb-8 relative z-10">
        <div className="w-full my-auto max-w-[1150px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge>Scaling</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2 text-center">
            Add Structure One Step<br className="hidden sm:block" /> Ahead of Growth
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-center mb-5 lg:mb-6 max-w-2xl mx-auto">
            Scale the model without scaling bureaucracy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-4 lg:mb-5">
            {stages.map((s) => (
              <div key={s.phase} className={`bg-white rounded-2xl border ${s.borderColor} shadow-sm overflow-hidden`}>
                <div className={`${s.color} px-5 py-2`}>
                  <span className="font-display font-extrabold text-white text-sm uppercase tracking-wider">{s.phase}</span>
                </div>
                <div className="p-4 sm:p-5 flex flex-col gap-2">
                  {s.points.map((p) => (
                    <div key={p} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-concrete flex-shrink-0" />
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-blueberry/30 shadow-sm flex items-center gap-5 px-5 sm:px-6 py-3 sm:py-3.5">
            <div className="w-2 h-10 rounded-full bg-blueberry flex-shrink-0" />
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              <span className="font-display font-extrabold text-foreground">Headcount follows the importance and complexity of the work</span> — it does not automatically mirror PM headcount.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} />
    </div>
  )
}

/* ── Slide 9: A System That Compounds ────────────────────────────── */
function SlideCompounds() {
  const flywheel = [
    'Hire and develop strong people',
    'Concentrate them on important customer problems',
    'Ship distinctive, high-quality experiences',
    'Measure outcomes and capture learning',
    'Build reusable foundations',
    'Attract stronger talent and raise the bar again',
  ]
  const actions = [
    'Align on the Félix experience principles and quality bar',
    'Identify one or two flagship customer journeys',
    'Assess design, PM, and engineering capability against the ambition',
    'Establish critique, live-product review, and post-launch learning',
    'Define the next stage of hiring and organizational structure',
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible flex flex-col items-center px-8 sm:px-12 lg:px-16 py-8 pb-16 md:pb-8 relative z-10">
        <div className="w-full my-auto max-w-[1150px]">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge>A System That Compounds</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-6 lg:mb-8 text-center">
            Strong People Raise the Work.<br className="hidden sm:block" /> Strong Work Raises the Bar.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mb-4 lg:mb-5">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
              <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl mb-3 sm:mb-4">The flywheel</h3>
              <div className="flex flex-col gap-2">
                {flywheel.map((f, i) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="font-display font-black text-turquoise-700 text-base sm:text-lg leading-none w-7 flex-shrink-0">{`0${i + 1}`}</span>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{f}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-cactus/40 shadow-sm p-5 sm:p-6">
              <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl mb-3 sm:mb-4">Near-term actions</h3>
              <div className="flex flex-col gap-2.5">
                {actions.map((a) => (
                  <div key={a} className="flex items-start gap-3">
                    <svg className="mt-0.5 w-4 h-4 text-cactus flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-center">
            <p className="text-sm sm:text-base lg:text-lg text-linen leading-relaxed max-w-4xl mx-auto">
              The goal is not a larger design department. It is <span className="font-bold text-turquoise">a compounding product-development system</span> that ships better experiences faster, earns deeper customer trust, and creates work the entire company is proud to share.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter num={9} total={TOTAL} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                       MAIN PRESENTATION                            */
/* ═══════════════════════════════════════════════════════════════════ */

const slides = [
  SlideTitle,     // 1
  SlideAmbition,  // 2
  SlideStandard,  // 3
  SlideTensions,  // 4
  SlidePeople,    // 5
  SlideTrio,      // 6
  SlideTwoTeams,  // 7
  SlideScaling,   // 8
  SlideCompounds, // 9
]

const darkSlides = new Set([3]) // 0-indexed: slide 4

export default function ImprovingDesignPresoPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const total = slides.length
  const isDark = darkSlides.has(current)

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
      className="h-screen w-screen overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-all duration-300 ${isDark ? 'bg-white/10' : 'bg-concrete/30'}`}>
        <div
          className="h-full bg-turquoise-600 transition-all duration-500 ease-out"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border shadow-xs transition-colors duration-300 ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border'}`}>
          <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${isDark ? 'text-white/60' : 'text-foreground'}`}>
            {current + 1} / {total}
          </span>
        </div>
      </div>

      {/* Nav hint */}
      <div className="hidden md:block absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border shadow-xs transition-colors duration-300 ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border'}`}>
          <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>&larr; &rarr; to navigate</span>
        </div>
      </div>

      {/* Slide content */}
      <div className="h-full w-full" key={current}>
        <div className="h-full w-full animate-in fade-in duration-300">
          <Slide />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              current === i
                ? `w-6 sm:w-10 ${isDark ? 'bg-turquoise/60' : 'bg-turquoise-600'}`
                : `w-1.5 sm:w-2 ${isDark ? 'bg-white/20 hover:bg-white/30' : 'bg-concrete hover:bg-concrete/70'}`
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        disabled={current === 0}
        className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all ${isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'} ${
          current === 0 ? 'opacity-0 pointer-events-none' : ''
        }`}
        aria-label="Previous slide"
        type="button"
      >
        <svg className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        disabled={current === total - 1}
        className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all ${isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'} ${
          current === total - 1 ? 'opacity-0 pointer-events-none' : ''
        }`}
        aria-label="Next slide"
        type="button"
      >
        <svg className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
