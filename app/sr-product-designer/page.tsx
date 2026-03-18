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
import { CheckCircle2, Heart, Users, Layers, Monitor, Smartphone, Globe } from 'lucide-react'

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
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/50' : 'text-muted-foreground'} absolute left-1/2 -translate-x-1/2`}>felixpago.com</span>
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
          <Illo src="Diffusion.svg" />
        </div>
        <div className="absolute bottom-[15%] left-[5%] w-[110px] lg:w-[150px] opacity-[0.13] rotate-3" style={{ animation: 'ds-float 8s ease-in-out infinite 2s' }}>
          <Illo src="Hand%20-%20Cell%20Phone%20OK.svg" />
        </div>
        <div className="absolute bottom-[12%] right-[4%] w-[120px] lg:w-[160px] opacity-[0.12] -rotate-6" style={{ animation: 'ds-drift 7s ease-in-out infinite 0.5s' }}>
          <Illo src="Laptop%20Dark.svg" />
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
            Bienvenido!
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            Senior Product Designer · Design Systems &{'\u00A0'}Multisurface
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
              Félix is the companion for Latinos in the US — helping them access financial services throughout their journey as{'\u00A0'}immigrants.
            </p>
          </div>

          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm">
            <div className="mb-8 lg:mb-10">
              <PillBadge>Our Mission</PillBadge>
              <p className="mt-5 text-xl sm:text-2xl lg:text-[28px] text-foreground leading-relaxed">
                To empower Latinos in the US to care for what matters most back{'\u00A0'}home.
              </p>
            </div>
            <div>
              <PillBadge>What We Build</PillBadge>
              <ul className="mt-6 space-y-4">
                {['Remittances to Latin\u00A0America', 'Mobile top-ups & bill\u00A0pay', 'Credit building\u00A0products', 'Digital wallets &\u00A0accounts'].map((p) => (
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

/* ── Slide 3: Our Values (card deck) ────────── */

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
    'Own and evolve the Félix Design System — tokens, components, patterns, and\u00A0documentation',
    'Design across web, mobile (iOS & Android), and emerging surfaces (WhatsApp, kiosks, agent\u00A0tools)',
    'Build scalable, accessible components that work in English and\u00A0Spanish',
    'Partner with engineering to ship pixel-perfect, production-ready\u00A0implementations',
    'Define and maintain design guidelines, contribution models, and quality\u00A0standards',
    'Drive design consistency across every touchpoint — from onboarding to\u00A0cash\u00A0pickup',
  ]

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute top-[5%] right-[3%] w-[120px] lg:w-[160px] opacity-[0.08] pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
        <Illo src="Diffusion.svg" />
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6">
              <PillBadge dark>Your Role</PillBadge>
            </div>
            <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              Systems &{'\u00A0'}Surfaces
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-linen/60 leading-relaxed max-w-lg">
              You&apos;ll be the connective tissue between every product surface Félix touches. Your design system work will scale the team&apos;s output and ensure every user gets the same world-class{'\u00A0'}experience.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-white/10">
            <h3 className="font-display font-extrabold text-linen text-xl sm:text-2xl mb-6">What you&apos;ll own</h3>
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
    { name: 'Kyle\nCooney', role: 'Head of Product\u00A0Design', initials: 'KC', highlight: false },
    { name: 'Patricia\nCaballero', role: 'Product\u00A0Designer', initials: 'PC', highlight: false },
    { name: 'Patricia\nBeltran', role: 'Product\u00A0Designer', initials: 'PB', highlight: false },
    { name: 'Jose Soto\nMarquez', role: 'Senior UX\u00A0Researcher', initials: 'JS', highlight: false },
    { name: 'You', role: 'Sr. Product Designer\nDesign Systems', initials: '✦', highlight: true },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[8%] right-[5%] w-[150px] lg:w-[200px] opacity-[0.1] pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Love.svg" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Your People</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Meet the Design Team
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {team.map((t) => (
              <div key={t.name} className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col items-center text-center gap-2 ${t.highlight ? 'border-turquoise shadow-lg ring-2 ring-turquoise/20' : 'border-border'}`}>
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-2 ${t.highlight ? 'bg-turquoise/20' : 'bg-stone'}`}>
                  <span className="font-display font-black text-xl lg:text-2xl text-foreground/60">{t.initials}</span>
                </div>
                <h3 className="font-display font-extrabold text-foreground text-base sm:text-lg leading-snug whitespace-pre-line">{t.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{t.role}</p>
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
    { phase: 'Days 1–30', title: 'Immerse', color: C.turquoise, items: [
      'Audit the existing design system — tokens, components, and\u00A0coverage\u00A0gaps',
      'Map every product surface: mobile app, web, agent portal, WhatsApp\u00A0flows',
      'Meet every PM, designer, and eng\u00A0lead\u00A01:1',
      'Review the codebase — understand how tokens and components are\u00A0implemented',
      'Identify the top 5 consistency pain points across\u00A0surfaces',
      'Write your design system assessment\u00A0report',
    ] },
    { phase: 'Days 31–60', title: 'Build', color: C.cactus, items: [
      'Publish the updated Félix component library in\u00A0Figma',
      'Define the token architecture — color, spacing, type, motion,\u00A0elevation',
      'Ship 3–5 refactored components to\u00A0production with\u00A0engineering',
      'Create the contribution model — how other designers add to the\u00A0system',
      'Stand up a design system documentation\u00A0site',
    ] },
    { phase: 'Days 61–90', title: 'Scale', color: C.mango, items: [
      'Launch the multisurface pattern library — adaptive layouts, responsive\u00A0tokens',
      'Run a design system workshop with the full\u00A0team',
      'Embed accessibility standards into every\u00A0component',
      'Present the system roadmap and adoption\u00A0metrics',
      'Deliver your first quarterly design system\u00A0review',
    ] },
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
    { name: 'Figma', desc: 'Design system source of truth — components, tokens, and\u00A0prototypes', category: 'Design' },
    { name: 'Storybook', desc: 'Component documentation, visual testing, and interactive\u00A0playground', category: 'Dev' },
    { name: 'GitHub', desc: 'Design system codebase — Tailwind tokens, React components,\u00A0CI/CD', category: 'Code' },
    { name: 'Slack', desc: 'Team communication — #design-crew, #design-system,\u00A0#eng-frontend', category: 'Communication' },
    { name: 'ClickUp', desc: 'Project tracking, design system backlog, and sprint\u00A0management', category: 'Project Management' },
    { name: 'Notion', desc: 'Design guidelines, pattern documentation, and team\u00A0wikis', category: 'Knowledge' },
    { name: 'Claude: Max Plan', desc: 'AI assistant for prototyping, code generation, and design\u00A0exploration', category: 'AI' },
    { name: 'Chromatic', desc: 'Visual regression testing for component\u00A0changes across\u00A0surfaces', category: 'QA' },
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

/* ── Slide 8: The Design System Challenge (Brand slide — turquoise bg) ─── */
function SlideSystemChallenge() {
  const challenges = [
    { title: 'Multisurface coherence', desc: 'Mobile, web, agent portal, WhatsApp — the experience must feel unified across every surface without being\u00A0identical.', icon: Monitor },
    { title: 'Scale without bloat', desc: 'As we add corridors and products, the system must grow gracefully. Every new token and component needs to earn its\u00A0place.', icon: Layers },
    { title: 'Bilingual by design', desc: 'Spanish text is ~30% longer than English. Every component must be designed for both languages from\u00A0day\u00A0one.', icon: Globe },
  ]

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ background: C.turquoise }}>
      <div className="absolute bottom-[5%] right-[3%] w-[180px] lg:w-[240px] opacity-[0.15] pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <Illo src="Diffusion.svg" />
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6">
              <span className="inline-block rounded-full bg-slate/15 px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] text-slate/80">
                The Challenge
              </span>
            </div>
            <h1 className="font-display font-black text-slate text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              One System,<br />Every{'\u00A0'}Surface
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate/60 leading-relaxed max-w-lg">
              Félix lives on phones, laptops, agent tablets, and WhatsApp. You&apos;ll create the design system that makes every surface feel like Félix — consistent, accessible, and built for the people who need it{'\u00A0'}most.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {challenges.map((c) => {
              const Icon = c.icon
              return (
                <div key={c.title} className="bg-white/90 rounded-2xl p-6 sm:p-7 border border-slate/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-slate/70" strokeWidth={1.5} />
                    </div>
                    <h4 className="font-display font-extrabold text-foreground text-lg leading-snug">{c.title}</h4>
                  </div>
                  <p className="text-base text-foreground/70 leading-relaxed">{c.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} />
    </div>
  )
}

/* ── Slide 9: Week 1 Checklist ────────────────────────────────── */

const WEEK1_STORAGE_KEY = 'sr-pd-ds-week1-checks'

const week1Days = [
  { day: 'Monday', items: ['HR orientation &\u00A0benefits', 'Laptop setup &\u00A0tool\u00A0access', 'Lunch with Kyle (Head of Product\u00A0Design)'] },
  { day: 'Tuesday', items: ['Design team\u00A0all-hands', 'Figma walkthrough — current component\u00A0library', 'Codebase tour with frontend\u00A0eng'] },
  { day: 'Wednesday', items: ['1:1 with each PM and squad\u00A0lead', 'Review design tokens in\u00A0code', 'Compliance\u00A0training'] },
  { day: 'Thursday', items: ['Audit existing components across mobile &\u00A0web', 'Map surface coverage\u00A0gaps', 'Meet the QA and accessibility\u00A0team'] },
  { day: 'Friday', items: ['Sketch initial system\u00A0architecture', 'Draft your 90-day plan\u00A0outline', 'Week 1 retro with\u00A0Kyle'] },
]

function SlideWeekOne() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WEEK1_STORAGE_KEY)
      if (stored) setChecked(JSON.parse(stored))
    } catch {}
  }, [])

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem(WEEK1_STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

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
            {week1Days.map((d, di) => (
              <div key={d.day} className="bg-white rounded-xl p-5 border border-border shadow-sm">
                <h3 className="font-display font-extrabold text-foreground text-base mb-4">{d.day}</h3>
                <ul className="space-y-3">
                  {d.items.map((item, ii) => {
                    const key = `${di}-${ii}`
                    const isChecked = !!checked[key]
                    return (
                      <li key={key} className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-turquoise border-turquoise' : 'border-concrete hover:border-mocha'
                          }`}
                          aria-label={`Mark "${item}" as ${isChecked ? 'incomplete' : 'complete'}`}
                        >
                          {isChecked && (
                            <svg className="w-2.5 h-2.5 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <span className={`text-sm leading-snug transition-colors ${isChecked ? 'text-foreground/40 line-through' : 'text-foreground/70'}`}>{item}</span>
                      </li>
                    )
                  })}
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
            <Illo src="Diffusion.svg" className="h-full w-full" label="Design system" />
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
            Build the{'\u00A0'}system.
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-linen/50 leading-relaxed max-w-2xl mb-8">
            You&apos;re going to define the design language that scales Félix across every surface. Your system will multiply the team&apos;s impact. Let&apos;s make something{'\u00A0'}great.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-turquoise/10 border border-turquoise/20 px-4 py-2 text-sm font-medium text-turquoise">
              <Heart className="h-4 w-4" /> #design-crew on Slack
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-turquoise/10 border border-turquoise/20 px-4 py-2 text-sm font-medium text-turquoise">
              <Users className="h-4 w-4" /> Kyle Cooney (manager)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-turquoise/10 border border-turquoise/20 px-4 py-2 text-sm font-medium text-turquoise">
              <Layers className="h-4 w-4" /> #design-system on Slack
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
  SlideFirst90, SlideTools, SlideSystemChallenge, SlideWeekOne, SlideLetsGo,
]

const darkSlideSet = new Set([3, 5, 9])
const brandSlideSet = new Set([7])

const slideMeta = [
  { title: 'Welcome to Felix', subtitle: 'Onboarding' },
  { title: 'Who We Are', subtitle: 'Company Overview' },
  { title: 'Our Values', subtitle: 'What We Believe' },
  { title: 'Your Role', subtitle: 'What You\u2019ll Do' },
  { title: 'The Team', subtitle: 'Who You\u2019ll Work With' },
  { title: 'First 90 Days', subtitle: 'Getting Started' },
  { title: 'Tools & Access', subtitle: 'Your Setup' },
  { title: 'One System, Every Surface', subtitle: 'The Challenge' },
  { title: 'Week One', subtitle: 'Checklist' },
  { title: 'Let\u2019s Go!', subtitle: 'Next Steps' },
]

const slideRatingStubs: SlideData[] = [
  { type: 'title', bg: 'light', title: 'Bienvenido!' },
  { type: 'two-column', bg: 'light', title: 'Who We Are', columns: [] },
  { type: 'cards', bg: 'light', title: 'Our Values', cards: [] },
  { type: 'two-column', bg: 'dark', title: 'Systems & Surfaces', columns: [] },
  { type: 'cards', bg: 'light', title: 'Meet the Team', cards: [] },
  { type: 'cards', bg: 'dark', title: 'First 90 Days', cards: [] },
  { type: 'cards', bg: 'light', title: 'Your Toolkit', cards: [] },
  { type: 'two-column', bg: 'brand', title: 'One System, Every Surface', columns: [] },
  { type: 'bullets', bg: 'light', title: 'Your First Week', bullets: [] },
  { type: 'closing', bg: 'dark', title: 'Build the system.' },
]

export default function SrProductDesignerOnboardingPage() {
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

  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('sr-pd-ds-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('sr-product-designer-onboarding.pdf')
  const { locale, setLocale } = useLocale()
  const slideRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(slideRef, locale, current)

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
            source="sr-product-designer"
            dark={darkSlideSet.has(current)}
          />
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
