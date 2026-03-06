'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, ArrowRight, Calendar, Users, BookOpen, Target, Lightbulb, Heart } from 'lucide-react'

/* ─────────────────────── Colors ─────────────────────── */

const C = { turquoise: '#2BF2F1', slate: '#082422', blueberry: '#6060BF', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', sage: '#7BA882', lime: '#DCFF00', lychee: '#FFCD9C', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867' }

/* ─────────────────────── Shared Components ─────────────────────── */

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

function SlideFooter({ num, total, dark }: { num: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Félix Onboarding</span>
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

const TOTAL = 10

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE COMPONENTS                       */
/* ═══════════════════════════════════════════════════════════ */

/* ── Slide 1: Welcome ──────────────────────────────────────── */
function SlideWelcome() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[3%] w-[120px] lg:w-[160px] opacity-[0.16] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Stars.svg" />
        </div>
        <div className="absolute top-[10%] right-[6%] w-[100px] lg:w-[140px] opacity-[0.14] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Magnifying%20Glass.svg" />
        </div>
        <div className="absolute bottom-[15%] left-[5%] w-[110px] lg:w-[150px] opacity-[0.13] rotate-3" style={{ animation: 'ds-float 8s ease-in-out infinite 2s' }}>
          <Illo src="Speech%20Bubbles%20%2B%20Hearts.svg" />
        </div>
        <div className="absolute bottom-[12%] right-[4%] w-[120px] lg:w-[160px] opacity-[0.12] -rotate-6" style={{ animation: 'ds-drift 7s ease-in-out infinite 0.5s' }}>
          <Illo src="Survey.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="mb-6 lg:mb-8 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]">
            <Illo src="Party%20Popper.svg" className="h-full w-full" label="Welcome celebration" />
          </div>
          <div className="mb-5 lg:mb-6">
            <PillBadge>Welcome to Félix</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
            Bienvenido,{'\u00A0'}José!
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            UX Researcher · Design Team · Starting March 2026
          </p>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} />
    </div>
  )
}

/* ── Slide 2: Who We Are ────────────────────────────────────── */
function SlideWhoWeAre() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute -bottom-8 -right-8 w-[200px] lg:w-[280px] opacity-[0.08] pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
        <Illo src="F%C3%A9lix%20Illo%201.svg" className="w-full h-full" />
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-6 lg:mb-8 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px]">
              <Illo src="F%C3%A9lix%20Illo%201.svg" className="h-full w-full" label="Félix mascot" />
            </div>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              Who We{'\u00A0'}Are
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Félix is the companion for Latinos in the US — helping them access financial services throughout their journey as immigrants.
            </p>
          </div>

          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm">
            <div className="mb-8 lg:mb-10">
              <PillBadge>Our Mission</PillBadge>
              <p className="mt-5 text-xl sm:text-2xl lg:text-[28px] text-foreground leading-relaxed">
                To empower Latinos in the US to care for what matters most back home.
              </p>
            </div>
            <div>
              <PillBadge>What We Build</PillBadge>
              <ul className="mt-6 space-y-4">
                {['Remittances to Latin America', 'Mobile top-ups & bill pay', 'Credit building products', 'Digital wallets & accounts'].map((p) => (
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
      <SlideFooter num={2} total={TOTAL} />
    </div>
  )
}

/* ── Slide 3: Our Values (card deck from preso-sample) ────────── */

const values = [
  {
    num: '01', title: 'User-Obsession',
    lines: ['We have to earn the right to serve our users every day and never take it for granted.', 'We always remember the hard work our users went through to send this money.', 'We are always here for them.'],
    bg: 'bg-slate-950', text: 'text-white', mutedText: 'text-slate-300', numColor: 'text-slate-800',
    illustration: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
  },
  {
    num: '02', title: 'Getting Sh*t Done\nWith Urgency',
    lines: ['We have a bias towards action.', 'Champions adjust!', 'We care less about what others are doing and focus on what we want to accomplish.'],
    bg: 'bg-turquoise-300', text: 'text-slate-950', mutedText: 'text-slate-800', numColor: 'text-turquoise-700/25',
    illustration: '/illustrations/Fast.svg',
  },
  {
    num: '03', title: 'Extreme\nOwnership',
    lines: ['Each person in the company owns a mission-critical piece of the vision.', 'No weak links.', 'No passengers.'],
    bg: 'bg-evergreen', text: 'text-white', mutedText: 'text-turquoise-200', numColor: 'text-slate-800/30',
    illustration: '/illustrations/Heart%20-F%C3%A9lix.svg',
  },
  {
    num: '04', title: 'No-Ego\nCollab',
    lines: ['We disagree clearly, and we commit once a decision is made.', 'We break silos, we move in lockstep.', 'We are a team, not a group of individuals.'],
    bg: 'bg-stone', text: 'text-slate-950', mutedText: 'text-slate-600', numColor: 'text-concrete/40',
    illustration: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    illustrationSize: 'w-36 h-36',
  },
  {
    num: '05', title: 'Aim For\nInsanely Great',
    lines: ['We elevate the quality of our output by caring deeply.', 'We obsess about every customer moment.'],
    bg: 'bg-turquoise-300', text: 'text-slate-950', mutedText: 'text-slate-800', numColor: 'text-turquoise-700/25',
    illustration: '/illustrations/ray.svg',
  },
  {
    num: '06', title: 'Insatiable\nCuriosity',
    lines: ['We listen closely to our users and base our assumptions in data.', 'We test assumptions and never take anything for granted.', 'We experiment relentlessly.'],
    bg: 'bg-slate-950', text: 'text-white', mutedText: 'text-slate-300', numColor: 'text-slate-800',
    illustration: '/illustrations/Magnifying%20Glass.svg',
  },
]

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
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[4%] left-[2%] w-[160px] lg:w-[220px] opacity-[0.14] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute top-[6%] right-[3%] w-[100px] lg:w-[140px] opacity-[0.16] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Cloud%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[4%] left-[4%] w-[180px] lg:w-[240px] opacity-[0.15] rotate-3" style={{ animation: 'ds-drift 10s ease-in-out infinite 2s' }}>
          <Illo src="Dollar%20bills%20%2B%20Coins%20A.svg" />
        </div>
        <div className="absolute bottom-[2%] right-[2%] w-[200px] lg:w-[280px] opacity-[0.12] -rotate-6" style={{ animation: 'ds-float 9s ease-in-out infinite 1.5s' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 pb-32 relative z-10">
        <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 sm:mb-8 lg:mb-10 text-center">
          Our Values
        </h1>

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
                  width: 260, height: 390,
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
                  <div className="relative h-[140px] mb-2">
                    <span className={`absolute inset-0 flex items-center justify-center font-display font-black text-[130px] leading-none select-none pointer-events-none ${v.numColor}`}>
                      {v.num}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={v.illustration} alt="" className={v.illustrationSize ?? 'w-28 h-28'} style={{ pointerEvents: 'none' }} />
                    </div>
                  </div>

                  <h3 className={`relative z-10 font-display font-black text-xl leading-tight mb-4 ${v.text}`}>
                    {v.title.split('\n').map((line, li) => (
                      <span key={li}>{li > 0 && <br />}{line}</span>
                    ))}
                  </h3>

                  <div className="relative z-10 flex-1 flex flex-col gap-2.5">
                    {v.lines.map((line) => (
                      <p key={line} className={`text-sm leading-snug ${v.mutedText}`}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <SlideFooter num={3} total={TOTAL} />
    </div>
  )
}

/* ── Slide 4: Your Role (Dark) ──────────────────────────────── */
function SlideYourRole() {
  const responsibilities = [
    'Lead discovery research for new product areas',
    'Run usability testing across remittances, top-ups, and credit',
    'Build and maintain our user persona library',
    'Synthesize insights into actionable recommendations',
    'Partner with PMs and designers to define research roadmaps',
    'Champion the voice of the user in every decision',
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute top-[5%] right-[3%] w-[120px] lg:w-[160px] opacity-[0.08] pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
        <Illo src="Survey.svg" />
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6">
              <PillBadge dark>Your Role</PillBadge>
            </div>
            <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              UX{'\u00A0'}Researcher
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-linen/60 leading-relaxed max-w-lg">
              You&apos;ll be the bridge between our users and the product team — making sure we build for real needs, not assumptions.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-white/10">
            <h3 className="font-display font-extrabold text-linen text-xl sm:text-2xl mb-6">What you&apos;ll do</h3>
            <ul className="space-y-4">
              {responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-turquoise/60 mt-0.5" strokeWidth={1.5} />
                  <span className="text-lg sm:text-xl text-linen/70 leading-snug">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SlideFooter num={4} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 5: Meet Your Team ─────────────────────────────────── */
function SlideTeam() {
  const team = [
    { name: 'Maria Chen', role: 'Head of Design', emoji: '👩‍🎨' },
    { name: 'Carlos Ruiz', role: 'Senior Product Designer', emoji: '🎨' },
    { name: 'Ana Torres', role: 'UX Writer', emoji: '✍️' },
    { name: 'David Kim', role: 'Design Engineer', emoji: '🛠️' },
    { name: 'You!', role: 'UX Researcher', emoji: '🔬' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[8%] right-[5%] w-[150px] lg:w-[200px] opacity-[0.1] pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Love.svg" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[1000px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Your People</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Meet the Design Team
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {team.map((t) => (
              <div key={t.name} className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col items-center text-center gap-2 ${t.name === 'You!' ? 'border-turquoise shadow-lg ring-2 ring-turquoise/20' : 'border-border'}`}>
                <span className="text-4xl lg:text-5xl mb-2">{t.emoji}</span>
                <h3 className="font-display font-extrabold text-foreground text-base sm:text-lg leading-snug">{t.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={5} total={TOTAL} />
    </div>
  )
}

/* ── Slide 6: Your First 90 Days (Dark) ──────────────────────── */
function SlideFirst90() {
  const phases = [
    { phase: 'Days 1–30', title: 'Learn', color: C.turquoise, items: ['Shadow user interviews & usability sessions', 'Read all existing research documentation', 'Meet every PM and designer 1:1', 'Complete compliance & tool onboarding'] },
    { phase: 'Days 31–60', title: 'Contribute', color: C.cactus, items: ['Run your first usability study', 'Present findings to the product team', 'Start building the persona library', 'Join sprint planning as research voice'] },
    { phase: 'Days 61–90', title: 'Lead', color: C.mango, items: ['Own the Q3 research roadmap', 'Establish a regular research cadence', 'Mentor the team on research methods', 'Ship your first research playbook'] },
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1300px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge dark>Your Roadmap</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            First 90 Days
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {phases.map((p) => (
              <div key={p.phase} className="bg-white/5 rounded-2xl p-7 sm:p-8 border border-white/10">
                <span className="inline-block rounded-full px-4 py-1 text-sm font-semibold text-slate mb-4" style={{ background: p.color }}>{p.phase}</span>
                <h3 className="font-display font-extrabold text-linen text-2xl lg:text-3xl leading-snug mb-5">{p.title}</h3>
                <ul className="space-y-3">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 opacity-40" strokeWidth={1.5} style={{ color: p.color }} />
                      <span className="text-base sm:text-lg text-linen/60 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={6} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 7: Tools & Access ─────────────────────────────────── */
function SlideTools() {
  const tools = [
    { name: 'Figma', desc: 'Design files, prototypes, and the design system', category: 'Design' },
    { name: 'Notion', desc: 'Research repos, meeting notes, and documentation', category: 'Knowledge' },
    { name: 'Slack', desc: '#design, #ux-research, #product-feedback', category: 'Communication' },
    { name: 'Maze / UserTesting', desc: 'Remote usability testing and surveys', category: 'Research' },
    { name: 'Dovetail', desc: 'Research analysis, tagging, and synthesis', category: 'Research' },
    { name: 'Linear', desc: 'Project tracking and sprint management', category: 'Project Management' },
    { name: 'Loom', desc: 'Async video updates and research walkthroughs', category: 'Communication' },
    { name: 'GitHub', desc: 'Design system code and component library', category: 'Engineering' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Getting Set Up</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Your Toolkit
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-5 border border-border shadow-sm">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-mocha mb-2">{t.category}</span>
                <h3 className="font-display font-extrabold text-foreground text-lg leading-snug mb-1">{t.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={7} total={TOTAL} />
    </div>
  )
}

/* ── Slide 8: Our Users (Brand slide — turquoise bg) ─────────── */
function SlideOurUsers() {
  const personas = [
    { name: 'María, 34', location: 'Houston, TX → Guadalajara', need: 'Sends $200/month to her mom. Needs it fast and affordable.', emoji: '👩‍👧' },
    { name: 'Roberto, 28', location: 'LA, CA → San Salvador', need: 'Just started sending money home. Confused by fees and exchange rates.', emoji: '👨‍💻' },
    { name: 'Gloria, 52', location: 'Chicago, IL → Bogotá', need: 'Helps her whole family. Sends to 3 different people monthly.', emoji: '👵' },
  ]

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ background: C.turquoise }}>
      <div className="absolute bottom-[5%] right-[3%] w-[180px] lg:w-[240px] opacity-[0.15] pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6">
              <span className="inline-block rounded-full bg-slate/15 px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] text-slate/80">
                Who You&apos;ll Research
              </span>
            </div>
            <h1 className="font-display font-black text-slate text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              Our{'\u00A0'}Users
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate/60 leading-relaxed max-w-lg">
              Latinos in the US caring for loved ones across borders. Your research will help us truly understand their lives.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {personas.map((p) => (
              <div key={p.name} className="bg-white/90 rounded-2xl p-6 sm:p-7 border border-slate/10 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <h4 className="font-display font-extrabold text-foreground text-lg leading-snug">{p.name}</h4>
                    <span className="text-sm text-muted-foreground">{p.location}</span>
                  </div>
                </div>
                <p className="text-base text-foreground/70 leading-relaxed">{p.need}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} />
    </div>
  )
}

/* ── Slide 9: Week 1 Checklist ────────────────────────────────── */
function SlideWeekOne() {
  const days = [
    { day: 'Monday', items: ['HR orientation & benefits enrollment', 'Laptop setup & tool access', 'Lunch with Maria (manager)'] },
    { day: 'Tuesday', items: ['Design team all-hands', 'Figma & Notion walkthrough', 'Shadow a usability session'] },
    { day: 'Wednesday', items: ['1:1 with each PM', 'Read the research repository', 'Compliance training'] },
    { day: 'Thursday', items: ['Product deep-dive with Carlos', 'Attend sprint planning', 'Set up Dovetail workspace'] },
    { day: 'Friday', items: ['Coffee chat with engineering lead', 'Write your first research brief', 'Week 1 retro with Maria'] },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1300px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Getting Started</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Your First Week
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {days.map((d) => (
              <div key={d.day} className="bg-white rounded-xl p-5 border border-border shadow-sm">
                <h3 className="font-display font-extrabold text-foreground text-base mb-4">{d.day}</h3>
                <ul className="space-y-3">
                  {d.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded border-2 border-concrete flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/70 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={9} total={TOTAL} />
    </div>
  )
}

/* ── Slide 10: Let's Go! (Dark) ───────────────────────────────── */
function SlideLetsGo() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.08] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[10%] right-[5%] w-[120px] lg:w-[160px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Hand%20-%20Star%20-%20Perks.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="mb-8 lg:mb-10 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[320px] lg:h-[320px]">
            <Illo src="Rocket%20Launch%20%2B%20Coin%20-%20Growth%20-%20Lime.svg" className="h-full w-full" label="Rocket launch" />
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
            Let&apos;s build{'\u00A0'}something great.
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-linen/50 leading-relaxed max-w-2xl mb-8">
            We&apos;re so glad you&apos;re here, José. The team is excited to have you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-turquoise/10 border border-turquoise/20 px-4 py-2 text-sm font-medium text-turquoise">
              <Heart className="h-4 w-4" /> #design on Slack
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-turquoise/10 border border-turquoise/20 px-4 py-2 text-sm font-medium text-turquoise">
              <Users className="h-4 w-4" /> Maria Chen (manager)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-turquoise/10 border border-turquoise/20 px-4 py-2 text-sm font-medium text-turquoise">
              <BookOpen className="h-4 w-4" /> Notion: Research Hub
            </span>
          </div>
        </div>
      </div>
      <SlideFooter num={10} total={TOTAL} dark />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE SHELL                             */
/* ═══════════════════════════════════════════════════════════ */

const slides = [
  SlideWelcome, SlideWhoWeAre, SlideValues, SlideYourRole, SlideTeam,
  SlideFirst90, SlideTools, SlideOurUsers, SlideWeekOne, SlideLetsGo,
]

const darkSlideSet = new Set([3, 5, 9])
const brandSlideSet = new Set([7])

export default function JoseOnboardingPage() {
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
  const isDark = darkSlideSet.has(current)
  const isBrand = brandSlideSet.has(current)

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

      <div className="hidden md:block absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}>
          <span className={`text-xs transition-colors duration-500 ${hintText}`}>&larr; &rarr; to navigate</span>
        </div>
      </div>

      <div className="h-full w-full" key={current}>
        <div className="h-full w-full animate-in fade-in duration-300">
          <Slide />
        </div>
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
    </div>
  )
}
