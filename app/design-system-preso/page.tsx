'use client'

import { useState, useEffect, useCallback } from 'react'
import { XCircle } from 'lucide-react'

/* ─────────────────────── Shared Components ─────────────────────── */

function SlideFooter({ num, dark }: { num: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Design Systems</span>
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/50' : 'text-muted-foreground'}`}>felixpago.com</span>
      <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-linen' : 'text-foreground'}`}>{num}</span>
    </div>
  )
}

function PillBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-turquoise px-5 py-1.5 font-display font-extrabold text-slate text-lg sm:text-xl lg:text-2xl">
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

/* ─────────────────────── New Visual Patterns ─────────────────────── */

function QuoteBlock({ quote, attribution }: { quote: string; attribution?: string }) {
  return (
    <div className="bg-white rounded-2xl lg:rounded-3xl p-8 sm:p-10 lg:p-14 border border-border shadow-sm relative overflow-hidden">
      <span className="absolute top-4 left-6 sm:top-6 sm:left-8 text-turquoise font-display text-[100px] sm:text-[130px] lg:text-[160px] leading-none select-none pointer-events-none opacity-40">&ldquo;</span>
      <p className="relative z-10 font-display font-extrabold text-foreground text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] leading-snug pt-10 sm:pt-12 lg:pt-14">
        {quote}
      </p>
      {attribution && (
        <p className="relative z-10 mt-5 text-lg sm:text-xl text-muted-foreground">{attribution}</p>
      )}
    </div>
  )
}

function IconGridCard({ illoSrc, title, description }: { illoSrc: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm flex flex-col items-center text-center gap-3">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mb-1">
        <Illo src={illoSrc} className="w-full h-full" />
      </div>
      <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl lg:text-2xl leading-snug">{title}</h3>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function ChannelCard({ title, description, accentColor, illoSrc }: { title: string; description: string; accentColor: string; illoSrc: string }) {
  return (
    <div className="flex items-stretch bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className={`w-2 flex-shrink-0 ${accentColor}`} />
      <div className="flex items-center gap-4 sm:gap-5 px-5 sm:px-6 py-4 sm:py-5 flex-1">
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
          <Illo src={illoSrc} className="w-full h-full" />
        </div>
        <div>
          <h4 className="font-display font-extrabold text-foreground text-base sm:text-lg lg:text-xl leading-snug">{title}</h4>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  )
}

function StatCallout({ stat, label, description, illoSrc }: { stat: string; label: string; description: string; illoSrc: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-border shadow-sm relative overflow-hidden">
      <div className="absolute top-4 right-4 w-12 h-12 sm:w-14 sm:h-14 opacity-20">
        <Illo src={illoSrc} className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <span className="font-display font-black text-turquoise-700 text-5xl sm:text-6xl lg:text-7xl leading-none">{stat}</span>
        <h4 className="font-display font-extrabold text-foreground text-xl sm:text-2xl leading-snug mt-3">{label}</h4>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-2">{description}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                         SLIDE COMPONENTS                           */
/* ═══════════════════════════════════════════════════════════════════ */

/* ── Slide 1: Title Hook ────────────────────────────────────────── */
function SlideTitleHook() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      {/* Decorative illustration collage */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.18] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Tool.svg" />
        </div>
        <div className="absolute top-[8%] right-[8%] w-[90px] lg:w-[120px] opacity-[0.16] rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite 1s' }}>
          <Illo src="Hand%20-%20Stars.svg" />
        </div>
        <div className="absolute bottom-[18%] left-[6%] w-[80px] lg:w-[110px] opacity-[0.15] rotate-3" style={{ animation: 'ds-float 9s ease-in-out infinite 2s' }}>
          <Illo src="Magnifying%20Glass.svg" />
        </div>
        <div className="absolute bottom-[12%] right-[4%] w-[100px] lg:w-[130px] opacity-[0.14] -rotate-6" style={{ animation: 'ds-drift 7s ease-in-out infinite 0.5s' }}>
          <Illo src="Bot.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="mb-6 lg:mb-8 w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] lg:w-[220px] lg:h-[220px]">
            <Illo src="F%C3%A9lix%20Illo%201.svg" className="h-full w-full" label="Félix mascot" />
          </div>
          <div className="mb-5 lg:mb-6">
            <PillBadge>Design Systems</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
            A Product Serving Products
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            How a unified design system accelerates every team, every channel, and every experience we build.
          </p>
        </div>
      </div>
      <SlideFooter num={1} />
    </div>
  )
}

/* ── Slide 2: The Problem ────────────────────────────────────────── */
const problems = [
  'Inconsistent UI across products and platforms',
  'Designers and engineers reinvent the wheel',
  'Brand drift as teams scale independently',
  'Accessibility regressions ship unnoticed',
  'Onboarding takes weeks instead of days',
]

function SlideProblem() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -bottom-8 -right-8 w-[280px] h-[280px] lg:w-[360px] lg:h-[360px] opacity-[0.1] pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
        <Illo src="Speech%20Bubbles.svg" className="w-full h-full" />
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — text */}
          <div className="flex flex-col justify-center">
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
              Without a System,<br />Chaos Scales
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Every new product, team, or channel compounds inconsistency. The cost is invisible until it&apos;s enormous.
            </p>
          </div>

          {/* Right — problem card */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 border border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-4 right-4 w-[120px] h-[120px] opacity-[0.08] pointer-events-none">
              <Illo src="Attention.svg" className="w-full h-full" />
            </div>
            <ul className="space-y-5 sm:space-y-6 relative z-10">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3.5">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 text-papaya mt-0.5" strokeWidth={1.5} />
                  <span className="text-lg sm:text-xl lg:text-2xl text-foreground leading-snug">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SlideFooter num={2} />
    </div>
  )
}

/* ── Slide 3: Definition ─────────────────────────────────────────── */
const miniDefs = [
  { title: 'Not a Style Guide', desc: 'Style guides document; a design system delivers.' },
  { title: 'Not a Component Library', desc: 'Libraries are code; a design system is process + code + people.' },
  { title: 'A Living Product', desc: 'It evolves with every product it serves.' },
]

function SlideDefinition() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      {/* Decorative illo */}
      <div className="absolute top-[8%] right-[4%] w-[120px] lg:w-[160px] opacity-[0.12] pointer-events-none rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite' }}>
        <Illo src="F%C3%A9lix%20Illo%203.svg" className="w-full h-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-4xl">
          <QuoteBlock
            quote="A design system is a product serving products. It provides the shared language, components, and guidelines that let every team build faster and more consistently."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
            {miniDefs.map((d) => (
              <div key={d.title} className="bg-white rounded-xl p-5 sm:p-6 border border-border shadow-sm text-center">
                <h4 className="font-display font-extrabold text-foreground text-base sm:text-lg leading-snug mb-2">{d.title}</h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={3} />
    </div>
  )
}

/* ── Slide 4: Anatomy / Components ───────────────────────────────── */
const anatomy = [
  { title: 'Design Tokens', desc: 'Colors, spacing, typography — the atomic building blocks.', illo: 'Stack%20of%20coins%20-%20Lime.svg' },
  { title: 'Components', desc: 'Reusable UI pieces from buttons to complex layouts.', illo: 'Hand%20-%20Tool.svg' },
  { title: 'Patterns', desc: 'Recipes that combine components into common flows.', illo: 'Map.svg' },
  { title: 'Guidelines', desc: 'Voice, tone, accessibility, and interaction standards.', illo: 'Survey.svg' },
  { title: 'Brand Assets', desc: 'Illustrations, icons, and media that define the brand.', illo: 'F%C3%A9lix%20Illo%202.svg' },
  { title: 'Governance', desc: 'The process for proposing, reviewing, and shipping changes.', illo: 'Lock.svg' },
]

function SlideComponents() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 sm:mb-8 lg:mb-10 text-center">
            What Lives Inside
          </h1>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {anatomy.map((item) => (
              <IconGridCard key={item.title} illoSrc={item.illo} title={item.title} description={item.desc} />
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={4} />
    </div>
  )
}

/* ── Slide 5: Cross-Channel ──────────────────────────────────────── */
const channels = [
  { title: 'Mobile App', desc: 'Native iOS & Android experiences.', accent: 'bg-turquoise', illo: 'Hand%20-%20Cell%20Phone%20OK.svg' },
  { title: 'Web Platform', desc: 'Dashboard, marketing, and self-service.', accent: 'bg-lime', illo: 'Laptop%20Dark.svg' },
  { title: 'Messaging & Support', desc: 'Chatbots, WhatsApp, and help flows.', accent: 'bg-blueberry', illo: 'Speech%20Bubbles.svg' },
  { title: 'Shared Touchpoints', desc: 'Emails, push notifications, and print.', accent: 'bg-mango', illo: 'Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg' },
]

function SlideCrossChannel() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — text + illo */}
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[180px] lg:h-[180px]">
              <Illo src="F%C3%A9lix%20Illo%204.svg" className="h-full w-full" label="Félix cross-channel" />
            </div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
              One System,<br />Every Channel
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              A design system isn&apos;t just for the web app. It extends across every touchpoint where customers meet your brand.
            </p>
          </div>

          {/* Right — channel cards */}
          <div className="flex flex-col gap-4 justify-center">
            {channels.map((ch) => (
              <ChannelCard key={ch.title} title={ch.title} description={ch.desc} accentColor={ch.accent} illoSrc={ch.illo} />
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={5} />
    </div>
  )
}

/* ── Slide 6: Benefits / ROI ─────────────────────────────────────── */
const benefits = [
  { stat: '34%', label: 'Faster Development', desc: 'Teams ship features in a fraction of the time with ready-made components.', illo: 'Fast.svg' },
  { stat: '~60%', label: 'Fewer Inconsistencies', desc: 'A single source of truth eliminates UI drift across products.', illo: 'Check.svg' },
  { stat: '2×', label: 'Easier Onboarding', desc: 'New designers and engineers get productive in days, not weeks.', illo: 'Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg' },
  { stat: '1', label: 'Source of Truth', desc: 'One shared language for design, engineering, and product.', illo: 'Magnifying%20Glass.svg' },
]

function SlideBenefits() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -bottom-6 -right-6 w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] opacity-[0.1] pointer-events-none rotate-12" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <Illo src="Party%20Popper.svg" className="w-full h-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 sm:mb-8 lg:mb-10 text-center">
            The ROI is Real
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {benefits.map((b) => (
              <StatCallout key={b.label} stat={b.stat} label={b.label} description={b.desc} illoSrc={b.illo} />
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={6} />
    </div>
  )
}

/* ── Slide 7: Contribute ─────────────────────────────────────────── */
const steps = [
  { number: 1, title: 'Use the System', body: 'Start every project from the design system. File bugs when something breaks.' },
  { number: 2, title: 'Report Gaps', body: 'Missing a component or pattern? Open an issue so the team can prioritize it.' },
  { number: 3, title: 'Propose & Build', body: 'Draft an RFC, get feedback, and contribute code or design assets.' },
  { number: 4, title: 'Spread the Word', body: 'Champion adoption in your squad. Teach others and share wins.' },
]

function StepCard({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-border bg-white overflow-hidden p-6 sm:p-8">
      <span className="absolute right-4 top-0 select-none font-display text-[100px] sm:text-[120px] font-black leading-none text-concrete/20 pointer-events-none">
        {num}
      </span>
      <div className="relative flex flex-col gap-3">
        {children}
      </div>
    </div>
  )
}

function SlideContribute() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-[5%] right-[3%] w-[90px] lg:w-[120px] opacity-[0.14] pointer-events-none rotate-6" style={{ animation: 'ds-drift 7s ease-in-out infinite' }}>
        <Illo src="Hand%20-%20Stars.svg" className="w-full h-full" />
      </div>
      <div className="absolute bottom-[10%] left-[4%] w-[80px] lg:w-[100px] opacity-[0.12] pointer-events-none -rotate-6" style={{ animation: 'ds-float 8s ease-in-out infinite 1s' }}>
        <Illo src="Letter%20in%20Envelope.svg" className="w-full h-full" />
      </div>

      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — text + illo */}
          <div className="flex flex-col justify-center">
            <div className="mb-5 lg:mb-6 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[180px] lg:h-[180px]">
              <Illo src="F%C3%A9lix%20Illo%205.svg" className="h-full w-full" label="Félix contribute" />
            </div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
              It Takes<br />a Village
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              A design system thrives when everyone contributes. Here&apos;s how to get involved.
            </p>
          </div>

          {/* Right — step cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s) => (
              <StepCard key={s.number} num={s.number}>
                <h3 className="font-display font-extrabold text-foreground text-xl sm:text-2xl leading-snug max-w-[70%]">
                  {s.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{s.body}</p>
              </StepCard>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={7} />
    </div>
  )
}

/* ── Slide 8: CTA (Dark) ─────────────────────────────────────────── */
const ctaItems = [
  { label: 'Explore', desc: 'Browse the component library and design tokens.' },
  { label: 'Connect', desc: 'Join the #design-system Slack channel.' },
  { label: 'Contribute', desc: 'Pick up a good-first-issue and ship your first PR.' },
]

function SlideCTA() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[4%] w-[100px] lg:w-[140px] opacity-[0.12]" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Gift%20Box%20%2B%20Coins.svg" className="w-full h-full" />
        </div>
        <div className="absolute top-[10%] right-[6%] w-[90px] lg:w-[120px] opacity-[0.1] rotate-12" style={{ animation: 'ds-drift 9s ease-in-out infinite 1.5s' }}>
          <Illo src="3%20Paper%20Airplanes%20%2B%20Coins.svg" className="w-full h-full" />
        </div>
        <div className="absolute bottom-[12%] right-[10%] w-[80px] lg:w-[100px] opacity-[0.1] -rotate-6" style={{ animation: 'ds-float 7s ease-in-out infinite 0.5s' }}>
          <Illo src="Heart%20-F%C3%A9lix.svg" className="w-full h-full" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="mb-6 lg:mb-8 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px]">
          <Illo src="F%C3%A9lix%20Illo%201.svg" className="h-full w-full" label="Félix mascot" />
        </div>
        <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
          Let&apos;s Build This<br />Together
        </h1>

        <div className="bg-turquoise/10 border border-turquoise/30 rounded-2xl lg:rounded-3xl p-7 sm:p-9 lg:p-12 w-full max-w-2xl">
          <div className="space-y-5 sm:space-y-6">
            {ctaItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-turquoise flex items-center justify-center">
                  <span className="font-display font-extrabold text-slate text-sm">→</span>
                </span>
                <div>
                  <h4 className="font-display font-extrabold text-turquoise text-xl sm:text-2xl leading-snug">{item.label}</h4>
                  <p className="text-base sm:text-lg text-linen/70 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={8} dark />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                       MAIN PRESENTATION                            */
/* ═══════════════════════════════════════════════════════════════════ */

const slides = [
  SlideTitleHook,
  SlideProblem,
  SlideDefinition,
  SlideComponents,
  SlideCrossChannel,
  SlideBenefits,
  SlideContribute,
  SlideCTA,
]

export default function DesignSystemPresoPage() {
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
