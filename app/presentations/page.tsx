'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock3, FileText, GalleryHorizontalEnd, Loader2, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryDeck {
  id?: string
  title: string
  description: string
  href: string
  slides: number | null
  color: string
  textColor: string
  updatedAt?: number
  createdAt?: number
  source: 'saved' | 'sample'
}

const samplePresentations: GalleryDeck[] = [
  {
    title: 'Felix Investor Deck',
    description: 'Series C investor presentation: Conversational Finance for the New American Majority, powered by AI and stablecoins.',
    href: '/felix-investor',
    slides: 19,
    color: 'bg-slate',
    textColor: 'text-turquoise',
    source: 'sample',
  },
  {
    title: 'Platform Announcement',
    description: 'Platform strategy for 2026: from single app to operating system. Architecture, org structure, and migration plan.',
    href: '/platform-announcement',
    slides: 16,
    color: 'bg-blueberry',
    textColor: 'text-linen',
    source: 'sample',
  },
  {
    title: 'Product Design Roadmap',
    description: 'Q2-Q4 2026 design org plan: centralized but embedded model, team build sequence, and coverage targets.',
    href: '/design-roadmap',
    slides: 12,
    color: 'bg-turquoise',
    textColor: 'text-slate',
    source: 'sample',
  },
  {
    title: 'Consumer Payments',
    description: 'Consumer Payments team strategy, squad missions, themes, and key initiatives.',
    href: '/consumer-payments',
    slides: 14,
    color: 'bg-cactus',
    textColor: 'text-slate',
    source: 'sample',
  },
  {
    title: 'Felix Design System',
    description: 'Overview of the Felix design system: foundations, principles, tokens, components, and patterns.',
    href: '/design-system-preso',
    slides: 18,
    color: 'bg-turquoise',
    textColor: 'text-slate',
    source: 'sample',
  },
  {
    title: 'QBR Colombia and DR',
    description: 'Quarterly business review for Colombia and Dominican Republic market expansion.',
    href: '/qbr-cord',
    slides: 14,
    color: 'bg-mango',
    textColor: 'text-slate',
    source: 'sample',
  },
]

function formatDate(epochSeconds?: number) {
  if (!epochSeconds) return null
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(epochSeconds * 1000))
}

function deckTone(index: number) {
  const tones = [
    ['bg-slate', 'text-turquoise'],
    ['bg-turquoise', 'text-slate'],
    ['bg-evergreen', 'text-linen'],
    ['bg-mango', 'text-slate'],
    ['bg-papaya', 'text-linen'],
  ]
  return tones[index % tones.length]
}

export default function PresentationsPage() {
  const [savedDecks, setSavedDecks] = useState<GalleryDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [needsAuth, setNeedsAuth] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadDecks() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/studio/presentations?tab=mine')
        if (res.status === 401) {
          if (!cancelled) {
            setNeedsAuth(true)
            setSavedDecks([])
          }
          return
        }
        if (!res.ok) throw new Error(`Could not load saved decks (${res.status})`)
        const data = await res.json()
        if (cancelled) return
        const liveDecks = (data.presentations ?? []).map((deck: any, index: number) => {
          const [color, textColor] = deckTone(index)
          return {
            id: deck.id,
            title: deck.title || 'Untitled deck',
            description: deck.prompt || deck.document?.summary || 'Saved presentation from Felix Studio.',
            href: `/create/${deck.id}`,
            slides: Array.isArray(deck.slides) ? deck.slides.length : null,
            color,
            textColor,
            updatedAt: deck.updatedAt,
            createdAt: deck.createdAt,
            source: 'saved' as const,
          }
        })
        setSavedDecks(liveDecks)
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Could not load saved decks')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDecks()
    return () => {
      cancelled = true
    }
  }, [])

  const shownDecks = savedDecks.length > 0 ? savedDecks : samplePresentations
  const filteredDecks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return shownDecks
    return shownDecks.filter(deck =>
      deck.title.toLowerCase().includes(q) ||
      deck.description.toLowerCase().includes(q),
    )
  }, [query, shownDecks])

  const showingSaved = savedDecks.length > 0

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone px-4 py-10 text-foreground sm:px-10 sm:py-14 lg:px-16">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <header className="mb-8 flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
              Preso
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <h1 className="break-words font-display text-4xl font-black leading-tight text-foreground sm:text-5xl">
              Presentations
            </h1>
            <p className="mt-3 max-w-full text-base leading-7 text-muted-foreground sm:text-lg">
              {showingSaved
                ? 'Saved decks from Felix Studio, ready to reopen, edit, share, or merge.'
                : 'A curated set of presentation examples built with the Felix design system.'}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/create" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-slate px-4 py-2 text-sm font-bold text-turquoise transition hover:bg-evergreen sm:w-auto">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New deck
            </Link>
            <Link href="/design-system" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-border bg-white px-4 py-2 text-sm font-bold text-foreground transition hover:border-turquoise sm:w-auto">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Design system
            </Link>
          </div>
        </header>

        <section className="mb-6 grid min-w-0 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search decks"
              className="h-11 w-full rounded-[8px] border border-border bg-white pl-10 pr-4 text-sm outline-none transition focus:border-turquoise focus:ring-2 focus:ring-turquoise/20"
            />
          </label>
          <div className="inline-flex min-h-11 w-full items-center gap-2 rounded-[8px] border border-border bg-white px-4 text-sm font-semibold text-muted-foreground sm:w-auto">
            <GalleryHorizontalEnd className="h-4 w-4" aria-hidden="true" />
            {showingSaved ? `${savedDecks.length} saved` : `${samplePresentations.length} examples`}
          </div>
        </section>

        {loading && (
          <div className="mb-6 flex items-center gap-3 rounded-[8px] border border-border bg-white px-4 py-3 text-sm font-medium text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading saved decks
          </div>
        )}

        {!loading && needsAuth && (
          <div className="mb-6 rounded-[8px] border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
            Sign in from Studio to see your saved decks here. Examples are shown for now.
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 rounded-[8px] border border-papaya/40 bg-papaya/10 px-4 py-3 text-sm text-foreground">
            {error}. Showing examples instead.
          </div>
        )}

        {!loading && showingSaved && filteredDecks.length === 0 && (
          <div className="rounded-[8px] border border-border bg-white px-6 py-10 text-center">
            <h2 className="font-display text-2xl font-black text-foreground">No saved decks match that search.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Clear the search or create a new deck from Studio.</p>
          </div>
        )}

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDecks.map((deck) => {
            const date = formatDate(deck.updatedAt ?? deck.createdAt)
            return (
              <Link
                key={deck.id ?? deck.href}
                href={deck.href}
                className="group min-w-0 overflow-hidden rounded-[8px] border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={cn(deck.color, deck.textColor, 'px-5 py-6')}>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <span className="rounded-full bg-white/18 px-2 py-1 text-[11px] font-bold uppercase leading-none">
                      {deck.source === 'saved' ? 'Saved' : 'Example'}
                    </span>
                    {deck.slides !== null && (
                      <span className="shrink-0 text-xs font-bold uppercase opacity-70">
                        {deck.slides} slides
                      </span>
                    )}
                  </div>
                  <h2 className="break-words font-display text-2xl font-extrabold leading-tight">
                    {deck.title}
                  </h2>
                </div>
                <div className="px-5 py-5">
                  <p className="line-clamp-3 min-h-[4.5rem] break-words text-sm leading-6 text-muted-foreground">{deck.description}</p>
                  <div className="mt-4 flex flex-col items-start gap-2 text-sm font-bold text-foreground transition-colors group-hover:text-link sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="inline-flex items-center gap-2">
                      {deck.source === 'saved' ? 'Open in Studio' : 'Open presentation'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    {date && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        {date}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
