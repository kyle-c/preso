'use client'

import { useState, useEffect, useCallback, useRef, Component } from 'react'
import type { ReactNode } from 'react'

/* ── Types ── */
export type Locale = 'en-US' | 'es-MX' | 'pt-BR'

export const LOCALE_OPTIONS: { id: Locale; short: string }[] = [
  { id: 'en-US', short: 'EN' },
  { id: 'es-MX', short: 'ES' },
  { id: 'pt-BR', short: 'PT' },
]

/* ── Locale preference (persisted across sessions) ── */
const LOCALE_KEY = 'preso-locale'

export function useLocale() {
  const [locale, _set] = useState<Locale>('en-US')

  useEffect(() => {
    try {
      const s = localStorage.getItem(LOCALE_KEY) as Locale | null
      if (s && LOCALE_OPTIONS.some(o => o.id === s)) _set(s)
    } catch {}
  }, [])

  const setLocale = useCallback((l: Locale) => {
    _set(l)
    try { localStorage.setItem(LOCALE_KEY, l) } catch {}
  }, [])

  return { locale, setLocale }
}

/* ── Translation cache (localStorage, persists across sessions) ── */
function readCache(locale: Locale): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(`t9n-${locale}`) ?? '{}') } catch { return {} }
}

function writeCache(locale: Locale, entries: Record<string, string>) {
  try {
    const prev = readCache(locale)
    localStorage.setItem(`t9n-${locale}`, JSON.stringify({ ...prev, ...entries }))
  } catch {}
}

/* ── API fetch ── */
function getLlmSettings(): { provider?: string; apiKey?: string; model?: string } {
  try {
    const provider = localStorage.getItem('studio-provider') ?? undefined
    const apiKey = provider === 'openrouter'
      ? localStorage.getItem('studio-openrouter-key') ?? undefined
      : localStorage.getItem('studio-anthropic-key') ?? undefined
    const model = provider === 'openrouter'
      ? localStorage.getItem('studio-openrouter-model') ?? undefined
      : localStorage.getItem('studio-anthropic-model') ?? undefined
    return { provider, apiKey, model }
  } catch { return {} }
}

async function fetchTranslations(texts: string[], locale: Locale): Promise<Record<string, string>> {
  if (!texts.length) return {}
  try {
    const llm = getLlmSettings()
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, locale, ...llm }),
    })
    if (!res.ok) return {}
    const { translations } = await res.json()
    const out: Record<string, string> = {}
    texts.forEach((t, i) => { out[t] = translations[i] ?? t })
    return out
  } catch { return {} }
}

/* ── DOM text-node helpers ── */
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'])
const NUM_ONLY = /^[\d\s.,\/%:;()+→←↺●○·•\-–—&<>|#@!?'"\[\]{}§]+$/

function collectText(root: Element): Text[] {
  const out: Text[] = []
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement
      if (!p || SKIP.has(p.tagName) || p.closest('svg') || p.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT
      const t = n.textContent?.trim() ?? ''
      if (!t || t.length < 2 || NUM_ONLY.test(t)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (w.nextNode()) out.push(w.currentNode as Text)
  return out
}

function applyToNodes(nodes: Text[], originals: Map<Text, string>, cache: Record<string, string>) {
  nodes.forEach(node => {
    const raw = originals.get(node) ?? node.textContent ?? ''
    const key = raw.trim()
    const t = cache[key]
    if (t && node.parentElement) {
      const lead = raw.match(/^\s*/)?.[0] ?? ''
      const trail = raw.match(/\s*$/)?.[0] ?? ''
      node.textContent = lead + t + trail
    }
  })
}

/* ── Per-slide DOM translation hook ── */
export function useSlideTranslation(
  containerRef: React.RefObject<HTMLElement | null>,
  locale: Locale,
  slideIndex: number,
) {
  const originals = useRef(new Map<Text, string>())
  const busy = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Restore previous originals
    originals.current.forEach((txt, node) => {
      if (node.parentElement) node.textContent = txt
    })
    originals.current.clear()

    if (locale === 'en-US') return

    let dead = false

    ;(async () => {
      // Brief delay to let React paint
      await new Promise(r => setTimeout(r, 30))
      if (dead) return

      const nodes = collectText(el)
      if (!nodes.length) return

      nodes.forEach(n => originals.current.set(n, n.textContent!))
      const unique = [...new Set([...originals.current.values()].map(s => s.trim()))]
      const cache = readCache(locale)
      const missing = unique.filter(t => !(t in cache))

      // Phase 1: apply cached translations immediately (instant)
      if (Object.keys(cache).length > 0) {
        busy.current = true
        applyToNodes(nodes, originals.current, cache)
        busy.current = false
      }

      // Phase 2: fetch missing translations (only for uncached strings)
      if (missing.length) {
        const fetched = await fetchTranslations(missing, locale)
        if (dead) return
        writeCache(locale, fetched)
        Object.assign(cache, fetched)
        busy.current = true
        applyToNodes(nodes, originals.current, cache)
        busy.current = false
      }
    })()

    // Observe dynamic content changes (comment popovers, etc.)
    const observer = new MutationObserver(() => {
      if (busy.current || dead || locale === 'en-US') return
      const nodes = collectText(el)
      const newNodes = nodes.filter(n => !originals.current.has(n))
      if (!newNodes.length) return

      newNodes.forEach(n => originals.current.set(n, n.textContent!))
      const cache = readCache(locale)

      // Apply cached immediately
      busy.current = true
      applyToNodes(newNodes, originals.current, cache)
      busy.current = false

      // Fetch any uncached
      const uncached = [...new Set(newNodes.map(n => (originals.current.get(n) ?? '').trim()))].filter(t => !(t in cache))
      if (uncached.length) {
        fetchTranslations(uncached, locale).then(fetched => {
          if (dead) return
          writeCache(locale, fetched)
          Object.assign(cache, fetched)
          busy.current = true
          applyToNodes(newNodes, originals.current, cache)
          busy.current = false
        })
      }
    })
    observer.observe(el, { childList: true, subtree: true })

    return () => {
      dead = true
      observer.disconnect()
    }
  }, [locale, slideIndex, containerRef])
}

/* ── Error boundary for safe offscreen slide rendering ── */
class SlideBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() { return this.state.error ? null : this.props.children }
}

/* ── Pre-translator: renders all slides offscreen, scans text, batch-translates ── */
export function SlidePreTranslator({
  slides,
  locale,
}: {
  slides: (() => React.JSX.Element)[]
  locale: Locale
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'idle' | 'render' | 'done'>('idle')

  // Kick off pre-translation when locale changes to non-English
  useEffect(() => {
    if (locale === 'en-US') { setPhase('idle'); return }

    // Check if already completed this session
    try {
      if (sessionStorage.getItem(`t9n-pre-${locale}`)) { setPhase('done'); return }
    } catch {}

    setPhase('render')
  }, [locale])

  // Once hidden slides are rendered, scan and translate
  useEffect(() => {
    if (phase !== 'render' || !containerRef.current) return

    let dead = false

    // Wait for React to paint the hidden slides
    const timer = setTimeout(async () => {
      if (dead) return
      const el = containerRef.current
      if (!el) return

      try {
        const nodes = collectText(el)
        const unique = [...new Set(nodes.map(n => n.textContent!.trim()))]
        const cache = readCache(locale)
        const missing = unique.filter(t => !(t in cache))

        if (missing.length > 0) {
          const fetched = await fetchTranslations(missing, locale)
          if (dead) return
          writeCache(locale, fetched)
        }
      } catch {}

      if (dead) return
      try { sessionStorage.setItem(`t9n-pre-${locale}`, '1') } catch {}
      setPhase('done')
    }, 100)

    return () => { dead = true; clearTimeout(timer) }
  }, [phase, locale])

  // Nothing to render when idle, done, or English
  if (phase !== 'render' || locale === 'en-US') return null

  return (
    <div
      ref={containerRef}
      className="fixed -left-[200vw] top-0 w-screen h-screen overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ contain: 'strict' }}
    >
      {/* Suppress media autoplay in offscreen renders */}
      <style>{`[data-pretranslate] video, [data-pretranslate] audio, [data-pretranslate] iframe { display: none !important; }`}</style>
      <div data-pretranslate>
        {slides.map((S, i) => (
          <div key={i} className="w-screen h-screen overflow-hidden">
            <SlideBoundary><S /></SlideBoundary>
          </div>
        ))}
      </div>
    </div>
  )
}
