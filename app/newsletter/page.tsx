'use client'

import { FelixLogo } from '@/components/design-system/felix-logo'
import Link from 'next/link'

const principles = [
  {
    number: '01',
    title: 'Conversational, Not Transactional',
    description: 'Warm, human language that reflects relationships — not software talking to users.',
  },
  {
    number: '02',
    title: 'Guide Beginners. Accelerate\u00A0Regulars.',
    description: 'Progressive disclosure that builds trust for new users and speed for returning ones.',
  },
  {
    number: '03',
    title: 'Never Leave Users Guessing',
    description: 'Every interaction acknowledges what happened, shows what\'s next, and sets expectations.',
  },
  {
    number: '04',
    title: 'Protection Without Friction',
    description: 'Smart defaults and real-time validation that feel like help, not obstacles.',
  },
  {
    number: '05',
    title: 'Grow With Your Journey',
    description: 'From first send to full financial management — tools revealed when users are ready.',
  },
]

const systemHighlights = [
  { label: 'WCAG Compliant', value: 'AA+' },
]

export default function NewsletterPage() {
  return (
    <div className="min-h-screen w-full bg-linen text-slate overflow-x-hidden">
      {/* Hero Section — the "slide" */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-[0.04] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-bl from-turquoise to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-turquoise/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-16 sm:mb-20">
            <FelixLogo className="h-6 sm:h-8 text-slate" />
            <span className="text-xs sm:text-sm font-medium text-slate/50 tracking-wide">Design System</span>
          </div>

          {/* Main Message */}
          <div className="mb-16 sm:mb-20">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-turquoise-700 mb-4 sm:mb-6">
              Design System
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 sm:mb-8">
              Designing for{' '}
              <span className="text-turquoise-600">Presence</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-slate/70 leading-relaxed max-w-3xl">
              We&apos;ve been building on our first version of the Felix design system — refining the foundation, expanding our component library, and aligning every pattern to the principles that make our product feel&nbsp;human.
            </p>
          </div>

          {/* Principles Grid */}
          <div className="mb-16 sm:mb-20">
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-turquoise-700 mb-8">
              Five Core Principles
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {principles.map((p) => (
                <div
                  key={p.number}
                  className="group rounded-xl border border-slate/10 bg-white p-5 sm:p-6 transition-colors hover:border-slate/20"
                >
                  <span className="text-xs font-semibold text-turquoise-600 tracking-wider">{p.number}</span>
                  <h3 className="font-display text-sm sm:text-base font-bold text-slate mt-2 mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate/60 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* System Stats + Link */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 lg:gap-16 border-t border-slate/10 pt-8 sm:pt-10">
            {systemHighlights.map((item) => (
              <div key={item.label}>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-turquoise-600 leading-none">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-slate/50 mt-1">
                  {item.label}
                </p>
              </div>
            ))}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-slate px-5 py-2.5 text-sm font-medium text-turquoise transition-colors hover:bg-slate-800"
            >
              Explore the Design System
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* What the System Delivers — secondary content below the fold */}
      <section className="relative px-6 sm:px-12 lg:px-20 py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-turquoise-700 mb-4">
            What We&apos;ve Built
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-12 sm:mb-16">
            A unified language for<br className="hidden sm:block" /> the Felix experience
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card: Colors */}
            <div className="rounded-2xl bg-linen border border-slate/10 p-8 space-y-4">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-turquoise" />
                <div className="w-8 h-8 rounded-full bg-slate" />
                <div className="w-8 h-8 rounded-full bg-stone" />
                <div className="w-8 h-8 rounded-full bg-papaya" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate">Color System</h3>
              <p className="text-sm text-slate/60 leading-relaxed">
                14 purpose-built color scales — from brand turquoise and slate to warm neutrals — all with WCAG-compliant contrast&nbsp;pairings.
              </p>
            </div>

            {/* Card: Typography */}
            <div className="rounded-2xl bg-linen border border-slate/10 p-8 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-extrabold text-slate">Aa</span>
                <span className="text-lg font-light text-slate/50">Aa</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate">Typography</h3>
              <p className="text-sm text-slate/60 leading-relaxed">
                Plain for bold display headings. Saans for readable body text. 11-step type scale from 12px to&nbsp;72px.
              </p>
            </div>

            {/* Card: Components */}
            <div className="rounded-2xl bg-linen border border-slate/10 p-8 space-y-4">
              <div className="flex gap-2">
                <div className="rounded-lg bg-turquoise px-3 py-1.5 text-xs font-semibold text-slate">Button</div>
                <div className="rounded-lg bg-slate/10 px-3 py-1.5 text-xs font-medium text-slate">Card</div>
                <div className="rounded-lg bg-slate/10 px-3 py-1.5 text-xs font-medium text-slate">Input</div>
              </div>
              <h3 className="font-display text-lg font-bold text-slate">Components</h3>
              <p className="text-sm text-slate/60 leading-relaxed">
                58+ production-ready components built on Radix UI — buttons, forms, cards, navigation, data display, and&nbsp;more.
              </p>
            </div>

            {/* Card: Tokens */}
            <div className="rounded-2xl bg-linen border border-slate/10 p-8 space-y-4">
              <div className="font-mono text-xs text-turquoise-700 space-y-1">
                <p>--turquoise: #2BF2F1</p>
                <p>--radius: 1rem</p>
              </div>
              <h3 className="font-display text-lg font-bold text-slate">Design Tokens</h3>
              <p className="text-sm text-slate/60 leading-relaxed">
                200+ tokens for color, spacing, radius, shadows, and typography — bridging design and&nbsp;engineering.
              </p>
            </div>

            {/* Card: Accessibility */}
            <div className="rounded-2xl bg-linen border border-slate/10 p-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-cactus/20 px-3 py-1 text-xs font-bold text-cactus">AA</div>
                <div className="rounded-full bg-cactus/20 px-3 py-1 text-xs font-bold text-cactus">AAA</div>
              </div>
              <h3 className="font-display text-lg font-bold text-slate">Accessibility</h3>
              <p className="text-sm text-slate/60 leading-relaxed">
                WCAG-verified colorways, semantic HTML patterns, and keyboard navigation baked into every&nbsp;component.
              </p>
            </div>

            {/* Card: Guidelines */}
            <div className="rounded-2xl bg-linen border border-slate/10 p-8 space-y-4">
              <div className="flex gap-2 text-xs font-medium">
                <span className="rounded-full bg-blueberry/20 text-blueberry px-3 py-1">Design</span>
                <span className="rounded-full bg-mango/20 text-mango px-3 py-1">Eng</span>
                <span className="rounded-full bg-sky/20 text-sky-800 px-3 py-1">PM</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate">Role Guidelines</h3>
              <p className="text-sm text-slate/60 leading-relaxed">
                Tailored guidance for designers, engineers, PMs, and QA — everyone speaks the same design&nbsp;language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20 border-t border-slate/10 bg-linen">
        <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <FelixLogo className="h-5 sm:h-6 text-slate mb-3" />
            <p className="text-sm text-slate/40">
              Building presence into every pixel.
            </p>
          </div>
          <p className="text-xs text-slate/30">
            Felix Pago Design System v1.0
          </p>
        </div>
      </section>
    </div>
  )
}
