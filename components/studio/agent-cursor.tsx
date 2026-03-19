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

interface AgentCursorsProps {
  /** Ref to the grid container — used to read actual tile positions */
  gridRef: React.RefObject<HTMLDivElement | null>
  /** Current animation phase */
  phase: 'placeholders' | 'colors' | 'headlines' | 'details' | 'complete'
}

interface CursorData {
  x: number
  y: number
  label: string
  color: string
}

export function AgentCursors({ gridRef, phase }: AgentCursorsProps) {
  const [cursors, setCursors] = useState<CursorData[]>([])
  const [scattered, setScattered] = useState(false)
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([])
  const tilesRef = useRef<DOMRect[]>([])

  // Read actual tile positions from the DOM
  const readTilePositions = useCallback(() => {
    if (!gridRef.current) return []
    const tiles = gridRef.current.querySelectorAll('[data-slide-tile]')
    return Array.from(tiles).map(t => t.getBoundingClientRect())
  }, [gridRef])

  // Generate a random point inside a tile rect
  const pointInTile = (rect: DOMRect): { x: number; y: number } => ({
    x: rect.left + rect.width * (0.15 + Math.random() * 0.7),
    y: rect.top + rect.height * (0.15 + Math.random() * 0.7),
  })

  // Initialize and animate cursors
  useEffect(() => {
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []

    if (phase === 'complete') {
      // Scatter off screen
      setScattered(true)
      return
    }

    setScattered(false)

    // Wait a beat for tiles to render
    const initTimer = setTimeout(() => {
      const tiles = readTilePositions()
      tilesRef.current = tiles
      if (tiles.length === 0) return

      const count = Math.min(tiles.length * 3, 36)

      // Start all cursors at screen center
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const initial: CursorData[] = Array.from({ length: count }, (_, i) => ({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        label: LABELS[i % LABELS.length],
        color: COLORS[i % COLORS.length],
      }))
      setCursors(initial)

      // After a short pause, disperse to tiles
      const disperseTimer = setTimeout(() => {
        const freshTiles = readTilePositions()
        if (freshTiles.length > 0) tilesRef.current = freshTiles

        setCursors(prev => prev.map((c, i) => {
          const tileIndex = i % tilesRef.current.length
          const pos = pointInTile(tilesRef.current[tileIndex])
          return { ...c, ...pos }
        }))

        // Ongoing movement: drift within assigned tile
        const intervals = Array.from({ length: count }, (_, i) => {
          const interval = 1800 + Math.random() * 1400
          return setInterval(() => {
            // Re-read positions in case of resize
            const currentTiles = readTilePositions()
            if (currentTiles.length > 0) tilesRef.current = currentTiles

            setCursors(prev => {
              const next = [...prev]
              // Occasionally hop to a neighboring tile
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
      }, 400) // 400ms delay before dispersing from center

      return () => clearTimeout(disperseTimer)
    }, 200)

    return () => {
      clearTimeout(initTimer)
      intervalsRef.current.forEach(clearInterval)
    }
  }, [phase, readTilePositions])

  // Cleanup on unmount
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
            left: scattered
              ? `${Math.random() < 0.5 ? -100 : window.innerWidth + 100}px`
              : `${cursor.x}px`,
            top: scattered
              ? `${(Math.random() - 0.5) * window.innerHeight * 2}px`
              : `${cursor.y}px`,
            transition: scattered
              ? `left 0.8s cubic-bezier(0.4, 0, 1, 1) ${i * 30}ms, top 0.8s cubic-bezier(0.4, 0, 1, 1) ${i * 30}ms`
              : 'left 1.4s cubic-bezier(0.4, 0, 0.2, 1), top 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: scattered ? 'none' : `cursor-bob 2s ease-in-out infinite ${i * 0.12}s`,
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 16 16"
            fill={cursor.color} className="drop-shadow-sm"
            style={{ filter: `drop-shadow(0 0 8px ${cursor.color}50)` }}
          >
            <path d="M1 1l5.5 14L8 9l6-1.5z" />
          </svg>
          <div
            className="absolute left-3.5 top-2.5 whitespace-nowrap rounded-full px-1.5 py-[1px] text-[8px] font-semibold"
            style={{
              backgroundColor: cursor.color,
              color: '#082422',
              boxShadow: `0 2px 10px ${cursor.color}40`,
            }}
          >
            {cursor.label}
          </div>
        </div>
      ))}
    </div>
  )
}
