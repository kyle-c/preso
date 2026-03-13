'use client'

import { useState, useEffect, useRef } from 'react'

const CURSOR_AGENTS = [
  { label: 'Layout', color: '#2BF2F1' },       // turquoise
  { label: 'Content', color: '#F26629' },       // papaya
  { label: 'Design', color: '#6060BF' },        // blueberry
  { label: 'Typography', color: '#FF6B9D' },    // pink
  { label: 'Color', color: '#7ED957' },         // green
  { label: 'Animation', color: '#FFD93D' },     // gold
  { label: 'Data', color: '#4ECDC4' },          // teal
  { label: 'Imagery', color: '#FF8A5C' },       // coral
  { label: 'Structure', color: '#A78BFA' },     // violet
  { label: 'Spacing', color: '#67E8F9' },       // cyan
  { label: 'Hierarchy', color: '#F472B6' },     // rose
  { label: 'Narrative', color: '#FBBF24' },     // amber
]

interface AgentCursorsProps {
  /** Number of cursors to show */
  count?: number
  /** Bounding rect of the canvas grid */
  canvasBounds: DOMRect | null
  /** Whether to show cursors */
  visible: boolean
}

export function AgentCursors({ count = 8, canvasBounds, visible }: AgentCursorsProps) {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>(() =>
    Array.from({ length: count }, () => ({ x: 0.5, y: 0.5 }))
  )
  const intervalRefs = useRef<ReturnType<typeof setInterval>[]>([])

  useEffect(() => {
    // Clean up previous intervals
    intervalRefs.current.forEach(clearInterval)
    intervalRefs.current = []

    if (!visible || !canvasBounds) return

    // Start each cursor on a jittered interval
    const intervals = Array.from({ length: count }, (_, i) => {
      const baseInterval = 1200 + Math.random() * 1000 // 1.2 - 2.2s (faster)
      return setInterval(() => {
        setPositions((prev) => {
          const next = [...prev]
          next[i] = {
            x: 0.05 + Math.random() * 0.9,
            y: 0.05 + Math.random() * 0.9,
          }
          return next
        })
      }, baseInterval)
    })

    intervalRefs.current = intervals

    // Initial random positions spread across the canvas
    setPositions(
      Array.from({ length: count }, () => ({
        x: 0.1 + Math.random() * 0.8,
        y: 0.1 + Math.random() * 0.8,
      }))
    )

    return () => intervals.forEach(clearInterval)
  }, [count, visible, canvasBounds])

  if (!visible || !canvasBounds) return null

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
      {CURSOR_AGENTS.slice(0, count).map((agent, i) => {
        const pos = positions[i] ?? { x: 0.5, y: 0.5 }
        return (
          <div
            key={agent.label}
            className="absolute"
            style={{
              left: `${pos.x * 100}%`,
              top: `${pos.y * 100}%`,
              transition: 'left 1.4s cubic-bezier(0.4, 0, 0.2, 1), top 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: `cursor-bob 2s ease-in-out infinite ${i * 0.3}s`,
            }}
          >
            {/* Cursor arrow */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill={agent.color}
              className="drop-shadow-sm"
              style={{ filter: `drop-shadow(0 0 8px ${agent.color}50)` }}
            >
              <path d="M1 1l5.5 14L8 9l6-1.5z" />
            </svg>
            {/* Label pill */}
            <div
              className="absolute left-3.5 top-2.5 whitespace-nowrap rounded-full px-1.5 py-[1px] text-[8px] font-semibold"
              style={{
                backgroundColor: agent.color,
                color: '#082422',
                boxShadow: `0 2px 10px ${agent.color}40`,
              }}
            >
              {agent.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
