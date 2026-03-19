'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const LABELS = [
  'Layout', 'Content', 'Design', 'Typography', 'Color', 'Animation',
  'Data', 'Imagery', 'Structure', 'Spacing', 'Hierarchy', 'Narrative',
  'Interaction', 'Flow', 'Tone', 'Contrast', 'Alignment', 'Rhythm',
  'Emphasis', 'Balance', 'Density', 'Clarity', 'Depth', 'Motion',
  'Grid', 'Palette', 'Icons', 'Badges', 'Charts', 'Sections',
  'Cards', 'Bullets', 'Columns', 'Headers', 'Footers', 'Quotes',
]

const COLORS = [
  '#2BF2F1', '#F26629', '#6060BF', '#FF6B9D', '#7ED957', '#FFD93D',
  '#4ECDC4', '#FF8A5C', '#A78BFA', '#67E8F9', '#F472B6', '#FBBF24',
  '#60D06F', '#FFCD9C', '#7BA882', '#8DFDFA', '#DCFF00', '#F19D38',
]

interface CursorData {
  x: number
  y: number
  label: string
  color: string
}

interface AgentCursorsProps {
  gridRef: React.RefObject<HTMLDivElement | null>
  phase: 'placeholders' | 'colors' | 'headlines' | 'details' | 'complete'
  /** Expected total slide count — used to create the right number of cursors immediately */
  expectedCount?: number
}

export function AgentCursors({ gridRef, phase, expectedCount = 12 }: AgentCursorsProps) {
  const CURSOR_COUNT = Math.min(expectedCount * 3, 36)
  const [cursors, setCursors] = useState<CursorData[]>([])
  const [scattered, setScattered] = useState(false)
  const [dispersed, setDispersed] = useState(false)
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([])
  const tilesRef = useRef<DOMRect[]>([])

  const readTilePositions = useCallback(() => {
    if (!gridRef.current) return []
    const tiles = gridRef.current.querySelectorAll('[data-slide-tile]')
    return Array.from(tiles).map(t => t.getBoundingClientRect())
  }, [gridRef])

  const pointInTile = (rect: DOMRect): { x: number; y: number } => ({
    x: rect.left + rect.width * (0.15 + Math.random() * 0.7),
    y: rect.top + rect.height * (0.15 + Math.random() * 0.7),
  })

  // Phase 1: Create all cursors at center immediately
  useEffect(() => {
    if (phase === 'complete') {
      setScattered(true)
      intervalsRef.current.forEach(clearInterval)
      intervalsRef.current = []
      return
    }

    setScattered(false)

    // Create all cursors at screen center right away
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const initial: CursorData[] = Array.from({ length: CURSOR_COUNT }, (_, i) => ({
      x: cx + (Math.random() - 0.5) * 60,
      y: cy + (Math.random() - 0.5) * 60,
      label: LABELS[i % LABELS.length],
      color: COLORS[i % COLORS.length],
    }))
    setCursors(initial)
    setDispersed(false)
  }, [phase, CURSOR_COUNT])

  // Phase 2: Disperse to tiles once they're rendered (poll until enough tiles exist)
  useEffect(() => {
    if (phase === 'complete' || dispersed) return

    const pollTimer = setInterval(() => {
      const tiles = readTilePositions()
      if (tiles.length < 4) return // Wait for at least 4 tiles

      tilesRef.current = tiles
      clearInterval(pollTimer)
      setDispersed(true)

      // Disperse cursors to tile positions
      setCursors(prev => prev.map((c, i) => {
        const tileIndex = i % tiles.length
        const pos = pointInTile(tiles[tileIndex])
        return { ...c, ...pos }
      }))

      // Start ongoing movement
      const intervals = Array.from({ length: CURSOR_COUNT }, (_, i) => {
        const interval = 1600 + Math.random() * 1200
        return setInterval(() => {
          const currentTiles = readTilePositions()
          if (currentTiles.length > 0) tilesRef.current = currentTiles

          setCursors(prev => {
            const next = [...prev]
            if (!tilesRef.current.length) return next
            const hop = Math.random() < 0.3
            const tileIndex = hop
              ? Math.floor(Math.random() * tilesRef.current.length)
              : i % tilesRef.current.length
            if (tilesRef.current[tileIndex]) {
              const pos = pointInTile(tilesRef.current[tileIndex])
              next[i] = { ...next[i], ...pos }
            }
            return next
          })
        }, interval)
      })

      intervalsRef.current = intervals
    }, 150) // Poll every 150ms

    return () => clearInterval(pollTimer)
  }, [phase, dispersed, readTilePositions])

  // Cleanup
  useEffect(() => {
    return () => intervalsRef.current.forEach(clearInterval)
  }, [])

  if (cursors.length === 0) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[200]"
      style={{
        opacity: scattered ? 0 : 1,
        transition: 'opacity 600ms ease-out',
      }}
    >
      {cursors.map((cursor, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: scattered ? `${Math.random() < 0.5 ? -100 : window.innerWidth + 100}px` : `${cursor.x}px`,
            top: scattered ? `${(Math.random() - 0.5) * window.innerHeight * 2}px` : `${cursor.y}px`,
            transition: scattered
              ? `left 0.8s cubic-bezier(0.4, 0, 1, 1) ${i * 30}ms, top 0.8s cubic-bezier(0.4, 0, 1, 1) ${i * 30}ms`
              : 'left 1.4s cubic-bezier(0.4, 0, 0.2, 1), top 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: scattered ? 'none' : `cursor-bob 2s ease-in-out infinite ${i * 0.12}s`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill={cursor.color} style={{ filter: `drop-shadow(0 0 8px ${cursor.color}50)` }}>
            <path d="M1 1l5.5 14L8 9l6-1.5z" />
          </svg>
          <div
            className="absolute left-3.5 top-2.5 whitespace-nowrap rounded-full px-1.5 py-[1px] text-[8px] font-semibold"
            style={{ backgroundColor: cursor.color, color: '#082422', boxShadow: `0 2px 10px ${cursor.color}40` }}
          >
            {cursor.label}
          </div>
        </div>
      ))}
    </div>
  )
}
