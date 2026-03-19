'use client'

import { useState, useEffect, useRef } from 'react'

const AGENT_LABELS = [
  'Layout', 'Content', 'Design', 'Typography', 'Color', 'Animation',
  'Data', 'Imagery', 'Structure', 'Spacing', 'Hierarchy', 'Narrative',
  'Interaction', 'Flow', 'Tone', 'Contrast', 'Alignment', 'Rhythm',
  'Emphasis', 'Balance', 'Density', 'Clarity', 'Depth', 'Motion',
  'Grid', 'Palette', 'Icons', 'Badges', 'Charts', 'Sections',
  'Cards', 'Bullets', 'Columns', 'Headers', 'Footers', 'Quotes',
]

const AGENT_COLORS = [
  '#2BF2F1', '#F26629', '#6060BF', '#FF6B9D', '#7ED957', '#FFD93D',
  '#4ECDC4', '#FF8A5C', '#A78BFA', '#67E8F9', '#F472B6', '#FBBF24',
  '#60D06F', '#FFCD9C', '#7BA882', '#8DFDFA', '#DCFF00', '#F19D38',
]

interface CursorState {
  x: number
  y: number
  label: string
  color: string
}

interface AgentCursorsProps {
  /** Number of slide tiles on canvas */
  slideCount?: number
  /** Grid columns */
  cols?: number
  /** Bounding rect of the canvas grid */
  canvasBounds: DOMRect | null
  /** Whether to show cursors */
  visible: boolean
}

export function AgentCursors({ slideCount = 12, cols = 4, canvasBounds, visible }: AgentCursorsProps) {
  // 2-3 cursors per slide tile
  const cursorsPerTile = 3
  const totalCursors = Math.min(slideCount * cursorsPerTile, 36)
  const rows = Math.ceil(slideCount / cols)

  const [cursors, setCursors] = useState<CursorState[]>([])
  const intervalRefs = useRef<ReturnType<typeof setInterval>[]>([])

  // Generate a position within a specific grid cell (with some jitter outside)
  const posInCell = (col: number, row: number): { x: number; y: number } => {
    const cellW = 1 / cols
    const cellH = 1 / rows
    // Position within the cell with ±15% bleed into neighbors
    const jitterX = (Math.random() - 0.5) * 0.3 * cellW
    const jitterY = (Math.random() - 0.5) * 0.3 * cellH
    return {
      x: Math.max(0.02, Math.min(0.98, (col + 0.2 + Math.random() * 0.6) * cellW + jitterX)),
      y: Math.max(0.02, Math.min(0.98, (row + 0.2 + Math.random() * 0.6) * cellH + jitterY)),
    }
  }

  useEffect(() => {
    intervalRefs.current.forEach(clearInterval)
    intervalRefs.current = []

    if (!visible || !canvasBounds) return

    // Initialize: spread cursors across all tiles
    const initial: CursorState[] = []
    for (let i = 0; i < totalCursors; i++) {
      const tileIndex = i % slideCount
      const col = tileIndex % cols
      const row = Math.floor(tileIndex / cols)
      const pos = posInCell(col, row)
      initial.push({
        ...pos,
        label: AGENT_LABELS[i % AGENT_LABELS.length],
        color: AGENT_COLORS[i % AGENT_COLORS.length],
      })
    }
    setCursors(initial)

    // Animate: each cursor moves to a new position within its assigned tile area
    const intervals = Array.from({ length: totalCursors }, (_, i) => {
      const baseInterval = 1400 + Math.random() * 1200
      return setInterval(() => {
        setCursors(prev => {
          const next = [...prev]
          // Move to a nearby tile or stay in current area
          const tileIndex = (i + Math.floor(Math.random() * 3)) % slideCount
          const col = tileIndex % cols
          const row = Math.floor(tileIndex / cols)
          const pos = posInCell(col, row)
          next[i] = { ...next[i], ...pos }
          return next
        })
      }, baseInterval)
    })

    intervalRefs.current = intervals
    return () => intervals.forEach(clearInterval)
  }, [totalCursors, slideCount, cols, visible, canvasBounds])

  if (!visible || !canvasBounds || cursors.length === 0) return null

  return (
    <div
      className="absolute pointer-events-none z-[200]"
      style={{
        left: canvasBounds.left,
        top: canvasBounds.top,
        width: canvasBounds.width,
        height: canvasBounds.height,
        opacity: visible ? 1 : 0,
        transition: 'opacity 800ms ease-out',
      }}
    >
      {cursors.map((cursor, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${cursor.x * 100}%`,
            top: `${cursor.y * 100}%`,
            transition: 'left 1.6s cubic-bezier(0.4, 0, 0.2, 1), top 1.6s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: `cursor-bob 2s ease-in-out infinite ${i * 0.15}s`,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill={cursor.color}
            className="drop-shadow-sm"
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
