'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SlideData } from './slide-renderer'
import { CanvasSlideCard, type Phase } from './canvas-slide-card'
import { AgentCursors } from './agent-cursor'

/* ─── Props ─── */

interface GenerationCanvasProps {
  slides: SlideData[]
  generating: boolean
  done: boolean
  expectedCount?: number
  onSlideClick: (index: number) => void
  onCancel?: () => void
  onRestart?: () => void
}

/* ─── Status messages ─── */

const PHASE_MESSAGES: Record<Phase, string> = {
  placeholders: 'Preparing your presentation...',
  colors: 'Setting the mood...',
  headlines: 'Crafting headlines...',
  details: 'Adding the finishing touches...',
  complete: 'Your presentation is ready!',
}

/* ─── Component ─── */

export function GenerationCanvas({
  slides,
  generating,
  done,
  expectedCount = 10,
  onSlideClick,
  onCancel,
  onRestart,
}: GenerationCanvasProps) {
  const [phase, setPhase] = useState<Phase>('placeholders')
  const [displayCount, setDisplayCount] = useState(0)
  const [zoomIndex, setZoomIndex] = useState<number | null>(null)

  const gridRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Determine how many cards to show
  const targetCount = generating ? Math.max(slides.length, expectedCount) : slides.length
  const finalCount = done ? slides.length : targetCount

  // Animate placeholders appearing one by one
  useEffect(() => {
    if (displayCount >= finalCount) return
    const timer = setTimeout(() => {
      setDisplayCount((c) => Math.min(c + 1, finalCount))
    }, displayCount === 0 ? 100 : 120)
    timersRef.current.push(timer)
    return () => clearTimeout(timer)
  }, [displayCount, finalCount])

  // Phase transitions
  useEffect(() => {
    if (phase !== 'placeholders') return
    if (!generating && slides.length > 0 && displayCount >= slides.length) {
      const t = setTimeout(() => setPhase('colors'), 400)
      timersRef.current.push(t)
      return () => clearTimeout(t)
    }
  }, [phase, generating, slides.length, displayCount])

  useEffect(() => {
    if (phase !== 'colors') return
    const t = setTimeout(() => setPhase('headlines'), 600)
    timersRef.current.push(t)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'headlines') return
    const t = setTimeout(() => setPhase('details'), 500)
    timersRef.current.push(t)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'details') return
    const t = setTimeout(() => setPhase('complete'), 800)
    timersRef.current.push(t)
    return () => clearTimeout(t)
  }, [phase])

  // Auto-zoom to slide 1 when generation is complete
  useEffect(() => {
    if (phase !== 'complete') return
    const t = setTimeout(() => {
      setZoomIndex(0)
      setTimeout(() => onSlideClick(0), 700)
    }, 1200) // Pause 1.2s on "complete" before zooming
    timersRef.current.push(t)
    return () => clearTimeout(t)
  }, [phase, onSlideClick])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  // Responsive grid columns based on count
  const cols = finalCount <= 4 ? 2 : finalCount <= 9 ? 3 : 4

  return (
    <div
      className="fixed inset-0 bg-[#050505] flex flex-col z-50"
      style={{
        transition: zoomIndex !== null ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease-out' : undefined,
        transform: zoomIndex !== null ? 'scale(3)' : 'scale(1)',
        opacity: zoomIndex !== null ? 0 : 1,
        transformOrigin: zoomIndex !== null
          ? `${((zoomIndex % cols) + 0.5) / cols * 100}% ${(Math.floor(zoomIndex / cols) + 0.5) / Math.ceil(finalCount / cols) * 100}%`
          : 'center center',
      }}
    >
      {/* Status bar */}
      <div className="h-14 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          {phase !== 'complete' && (
            <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse" />
          )}
          {phase === 'complete' && (
            <div className="w-2 h-2 bg-cactus rounded-full" />
          )}
          <span className="text-sm text-white/60 font-sans">
            {PHASE_MESSAGES[phase]}
          </span>
          {generating && (
            <span className="text-xs text-white/30 font-mono ml-2">
              {slides.length} slide{slides.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {phase === 'complete' && (
            <span className="text-xs text-white/30">Click a slide to present</span>
          )}
          {generating && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Canvas area — responsive grid that fills the viewport */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-6 sm:p-8 lg:p-10">
        <div
          ref={gridRef}
          className="w-full h-full grid gap-3 sm:gap-4 lg:gap-5"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridAutoRows: '1fr',
            maxHeight: '100%',
          }}
        >
          {Array.from({ length: displayCount }).map((_, i) => (
            <div key={i} className="min-h-0 flex items-center justify-center" data-slide-tile>
              <div className="w-full" style={{ maxHeight: '100%', aspectRatio: '16/9' }}>
                <CanvasSlideCard
                  index={i}
                  slide={slides[i] ?? null}
                  phase={phase}
                  entranceDelay={i * 120}
                  onClick={phase === 'complete' ? () => {
                    setZoomIndex(i)
                    setTimeout(() => onSlideClick(i), 600)
                  } : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent cursors — read actual tile positions from DOM */}
      <AgentCursors gridRef={gridRef} phase={phase} />
    </div>
  )
}
