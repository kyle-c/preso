'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type CursorMode = 'working' | 'entering' | 'exiting'

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
  // ── New grid-based API (generation canvas) ──
  gridRef?: React.RefObject<HTMLDivElement | null>
  phase?: 'placeholders' | 'colors' | 'headlines' | 'details' | 'complete'
  expectedCount?: number
  // ── Legacy bounds-based API (deck-views, slide-edit-overlay) ──
  count?: number
  canvasBounds?: DOMRect | null
  cardRects?: DOMRect[]
  mode?: CursorMode
  visible?: boolean
  onExitComplete?: () => void
}

function pointInRect(rect: DOMRect): { x: number; y: number } {
  return {
    x: rect.left + rect.width * (0.15 + Math.random() * 0.7),
    y: rect.top + rect.height * (0.15 + Math.random() * 0.7),
  }
}

export function AgentCursors(props: AgentCursorsProps) {
  const { gridRef, phase, expectedCount = 12, count = 12, canvasBounds, cardRects, mode = 'working', visible = true, onExitComplete } = props
  const isGridMode = !!gridRef
  const cursorCount = isGridMode ? Math.min(expectedCount * 3, 36) : count

  const [cursors, setCursors] = useState<CursorData[]>([])
  const [scattered, setScattered] = useState(false)
  const [dispersed, setDispersed] = useState(false)
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([])

  const readTilePositions = useCallback(() => {
    if (!gridRef?.current) return []
    const tiles = gridRef.current.querySelectorAll('[data-slide-tile]')
    return Array.from(tiles).map(t => t.getBoundingClientRect())
  }, [gridRef])

  // ── Cleanup helper ──
  const clearIntervals = useCallback(() => {
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []
  }, [])

  // ── Grid mode (generation canvas) ──
  useEffect(() => {
    if (!isGridMode) return

    if (phase === 'complete') {
      setScattered(true)
      clearIntervals()
      return
    }

    setScattered(false)

    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const initial: CursorData[] = Array.from({ length: cursorCount }, (_, i) => ({
      x: cx + (Math.random() - 0.5) * 60,
      y: cy + (Math.random() - 0.5) * 60,
      label: LABELS[i % LABELS.length],
      color: COLORS[i % COLORS.length],
    }))
    setCursors(initial)
    setDispersed(false)
  }, [isGridMode, phase, cursorCount, clearIntervals])

  // Disperse to tiles (grid mode)
  useEffect(() => {
    if (!isGridMode || phase === 'complete' || dispersed) return

    const pollTimer = setInterval(() => {
      const tiles = readTilePositions()
      if (tiles.length < 4) return

      clearInterval(pollTimer)
      setDispersed(true)

      setCursors(prev => prev.map((c, i) => ({
        ...c,
        ...pointInRect(tiles[i % tiles.length]),
      })))

      // Ongoing movement
      clearIntervals()
      const intervals = Array.from({ length: cursorCount }, (_, i) => {
        return setInterval(() => {
          const currentTiles = readTilePositions()
          if (!currentTiles.length) return
          setCursors(prev => {
            const next = [...prev]
            const tileIndex = Math.random() < 0.3
              ? Math.floor(Math.random() * currentTiles.length)
              : i % currentTiles.length
            if (currentTiles[tileIndex]) {
              next[i] = { ...next[i], ...pointInRect(currentTiles[tileIndex]) }
            }
            return next
          })
        }, 1600 + Math.random() * 1200)
      })
      intervalsRef.current = intervals
    }, 150)

    return () => clearInterval(pollTimer)
  }, [isGridMode, phase, dispersed, cursorCount, readTilePositions, clearIntervals])

  // ── Legacy bounds mode (deck-views, slide-edit-overlay) ──
  useEffect(() => {
    if (isGridMode) return
    if (!canvasBounds || mode === 'exiting') {
      if (mode === 'exiting') {
        setScattered(true)
        setTimeout(() => onExitComplete?.(), 800)
      }
      return
    }

    setScattered(false)

    const rects = cardRects && cardRects.length > 0 ? cardRects : null
    const initial: CursorData[] = Array.from({ length: cursorCount }, (_, i) => {
      const target = rects ? rects[i % rects.length] : canvasBounds
      return {
        ...pointInRect(target),
        label: LABELS[i % LABELS.length],
        color: COLORS[i % COLORS.length],
      }
    })
    setCursors(initial)

    clearIntervals()
    const intervals = Array.from({ length: cursorCount }, (_, i) => {
      return setInterval(() => {
        setCursors(prev => {
          const next = [...prev]
          const target = rects ? rects[Math.floor(Math.random() * rects.length)] : canvasBounds
          next[i] = { ...next[i], ...pointInRect(target) }
          return next
        })
      }, 1400 + Math.random() * 1000)
    })
    intervalsRef.current = intervals

    return clearIntervals
  }, [isGridMode, canvasBounds, cardRects, mode, cursorCount, clearIntervals, onExitComplete])

  // Cleanup on unmount
  useEffect(() => () => clearIntervals(), [clearIntervals])

  const shouldHide = isGridMode ? scattered : (scattered || mode === 'exiting' || !visible)

  if (cursors.length === 0) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[200]"
      style={{
        opacity: shouldHide ? 0 : 1,
        transition: 'opacity 600ms ease-out',
      }}
    >
      {cursors.map((cursor, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: shouldHide ? `${Math.random() < 0.5 ? -100 : window.innerWidth + 100}px` : `${cursor.x}px`,
            top: shouldHide ? `${(Math.random() - 0.5) * window.innerHeight * 2}px` : `${cursor.y}px`,
            transition: shouldHide
              ? `left 0.8s cubic-bezier(0.4, 0, 1, 1) ${i * 30}ms, top 0.8s cubic-bezier(0.4, 0, 1, 1) ${i * 30}ms`
              : 'left 1.4s cubic-bezier(0.4, 0, 0.2, 1), top 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: shouldHide ? 'none' : `cursor-bob 2s ease-in-out infinite ${i * 0.12}s`,
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
