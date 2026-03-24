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
    title: 'Product Design Roadmap',
    description: 'Q2–Q4 2026 design org plan — centralized but embedded model, team build sequence, and coverage\u00A0targets.',
    href: '/design-roadmap',
    slides: 12,
    color: 'bg-turquoise',
    textColor: 'text-slate',
  },
  {
    title: 'Consumer Payments',
    description: 'Consumer Payments team strategy, squad missions, themes, and key\u00A0initiatives.',
    href: '/consumer-payments',
    slides: 14,
    color: 'bg-cactus',
    textColor: 'text-slate',
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
    title: 'Content Design',
    description: 'Content design vision, principles, and systems strategy for Félix\u00A0Pago.',
    href: '/content-design',
    slides: 20,
    color: 'bg-papaya',
    textColor: 'text-linen',
  },
  {
    title: 'Content Design Lead Onboarding',
    description: 'Welcome deck for the Content Design Lead — role, team, 90-day plan, and conversational\u00A0guidelines.',
    href: '/content-design-lead',
    slides: 10,
    color: 'bg-sage',
    textColor: 'text-slate',
  },
  {
    title: 'Design Org Build Plan',
    description: 'Hiring timeline for the Product Design org — aug placements, FTE hires, and org model through\u00A0September.',
    href: '/design-org',
    slides: 13,
    color: 'bg-evergreen',
    textColor: 'text-linen',
  },
  {
    title: 'QBR — Colombia & DR',
    description: 'Quarterly business review for Colombia and Dominican Republic market\u00A0expansion.',
    href: '/qbr-cord',
    slides: 14,
    color: 'bg-mango',
    textColor: 'text-slate',
  },
  {
    title: 'Senior Product Designer Onboarding',
    description: 'Welcome deck for Senior Product Designer hires — role definition, team, first\u00A090\u00A0days.',
    href: '/sr-product-designer',
    slides: 10,
    color: 'bg-slate',
    textColor: 'text-cactus',
  },
  {
    title: 'Researcher Onboarding',
    description: 'Onboarding presentation for UX Research — role, team, 90-day plan, and first\u00A0week.',
    href: '/jose',
    slides: 9,
    color: 'bg-slate',
    textColor: 'text-linen',
  },
  {
    title: 'ICP Executive Summary',
    description: 'Stat-led ICP at-a-glance for leadership — user archetypes, behaviors, blockers, and strategic\u00A0bets.',
    href: '/icp-summary/exec#v2',
    slides: null,
    color: 'bg-slate',
    textColor: 'text-turquoise',
  },
  {
    title: 'Copy Quality Plan',
    description: 'Short-term fixes and long-term system for WhatsApp copy quality — anti-patterns, principles, and\u00A0measurement.',
    href: '/cd-summary',
    slides: null,
    color: 'bg-blueberry',
    textColor: 'text-linen',
  },
  {
    title: 'KYC Explorations',
    description: 'KYC flow design explorations and patterns for identity\u00A0verification.',
    href: '/kyc-explorations',
    slides: null,
    color: 'bg-papaya',
    textColor: 'text-linen',
  },
  {
    title: 'Presentation Template',
    description: 'Sample presentation showcasing charts, data visualization, and slide layout\u00A0patterns.',
    href: '/preso-sample',
    slides: null,
    color: 'bg-mango',
    textColor: 'text-slate',
  },
  {
    title: 'Multi-Surface Vision',
    description: 'Fanned phone mockups — multi-surface experience\u00A0vision.',
    href: '/multisurface',
    slides: 1,
    color: 'bg-turquoise',
    textColor: 'text-slate',
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
