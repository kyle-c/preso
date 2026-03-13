'use client'

import Link from 'next/link'

const presentations = [
  {
    title: 'Félix Investor Deck',
    description: 'Series C investor presentation — Conversational Finance for the New American Majority, powered by AI\u00A0&\u00A0Stablecoins.',
    href: '/felix-investor',
    slides: 19,
    color: 'bg-slate',
    textColor: 'text-turquoise',
  },
  {
    title: 'Platform Announcement',
    description: 'Platform strategy for 2026 — from single app to operating system. Architecture, org structure, and migration\u00A0plan.',
    href: '/platform-announcement',
    slides: 16,
    color: 'bg-blueberry',
    textColor: 'text-linen',
  },
  {
    title: 'Félix Design System',
    description: 'Comprehensive overview of the Félix design system — foundations, principles, tokens, components, and\u00A0patterns.',
    href: '/design-system-preso',
    slides: 18,
    color: 'bg-turquoise',
    textColor: 'text-slate',
  },
  {
    title: 'Consumer Payments',
    description: 'Q2 2026 Consumer Payments team strategy, org structure, and\u00A0roadmap.',
    href: '/consumer-payments',
    slides: 14,
    color: 'bg-cactus',
    textColor: 'text-slate',
  },
  {
    title: 'Presentation Template',
    description: 'Sample presentation showcasing charts, data visualization, and slide layout\u00A0patterns.',
    href: '/preso-sample',
    slides: 12,
    color: 'bg-mango',
    textColor: 'text-slate',
  },
  {
    title: 'Researcher Onboarding',
    description: 'Onboarding presentation for our founding UX Researcher — role, team, 90-day plan, and first\u00A0week.',
    href: '/jose',
    slides: 10,
    color: 'bg-slate',
    textColor: 'text-linen',
  },
  {
    title: 'Design Org Build Plan',
    description: 'Aggressive hiring timeline for the Product Design org — aug placements, 6 FTE hires, and org model through September\u00A02026.',
    href: '/design-org',
    slides: 13,
    color: 'bg-evergreen',
    textColor: 'text-linen',
  },
]

export default function PresentationsPage() {
  return (
    <div className="min-h-screen bg-stone px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl tracking-tight mb-3">
            Presentations
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            All slide decks built with the Félix design system. Click any card to launch the&nbsp;presentation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {presentations.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group rounded-2xl border border-border bg-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className={`${p.color} ${p.textColor} px-6 py-8 relative overflow-hidden`}>
                <h2 className="font-display font-extrabold text-2xl leading-tight tracking-tight relative z-10">
                  {p.title}
                </h2>
                <span className="absolute top-3 right-4 text-xs font-semibold uppercase tracking-widest opacity-50">
                  {p.slides} slides
                </span>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-foreground group-hover:text-turquoise transition-colors">
                  Open presentation
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
