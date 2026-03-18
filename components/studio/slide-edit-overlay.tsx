'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { AgentCursors, type CursorMode } from './agent-cursor'

interface SlideEditOverlayProps {
  mode: 'slide' | 'comments'
  generating: boolean
  done: boolean
  affectedSlides: number[]
  /** Fields that have changed — cursors target these elements specifically */
  changedFields?: string[]
  onNavigate: (slideIndex: number) => void
  onComplete: () => void
  onCancel?: () => void
}

export function SlideEditOverlay({
  mode,
  generating,
  done,
  affectedSlides,
  changedFields,
  onNavigate,
  onComplete,
  onCancel,
}: SlideEditOverlayProps) {
  const [cursorMode, setCursorMode] = useState<CursorMode>('working')
  const [bounds, setBounds] = useState<DOMRect | null>(null)
  const [elementRects, setElementRects] = useState<DOMRect[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const rotationRef = useRef(0)

  // Measure container (full viewport)
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setBounds(containerRef.current.getBoundingClientRect())
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Measure slide element rects for targeted cursor placement
  useEffect(() => {
    if (cursorMode !== 'working') return

    const measure = () => {
      // Find all data-slide-field elements in the visible slide
      const allFieldEls = document.querySelectorAll('[data-slide-field]')
      if (allFieldEls.length === 0) return

      const rects: DOMRect[] = []

      if (changedFields && changedFields.length > 0) {
        // Target only changed fields
        for (const el of allFieldEls) {
          const field = el.getAttribute('data-slide-field')
          if (field && changedFields.includes(field)) {
            rects.push(el.getBoundingClientRect())
          }
        }
      }

      // Fallback: if no changed fields specified or none found, use all visible field elements
      if (rects.length === 0) {
        for (const el of allFieldEls) {
          const rect = el.getBoundingClientRect()
          // Only include elements that are visible (non-zero size and within viewport)
          if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
            rects.push(rect)
          }
        }
      }

      if (rects.length > 0) {
        setElementRects(rects)
      }
    }

    measure()
    // Re-measure periodically as the slide content may update during streaming
    const interval = setInterval(measure, 800)
    return () => clearInterval(interval)
  }, [cursorMode, changedFields])

  // Navigate to first affected slide on mount (comments mode)
  useEffect(() => {
    if (mode === 'comments' && affectedSlides.length > 0) {
      onNavigate(affectedSlides[0])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Comments mode: rotate through affected slides while generating
  useEffect(() => {
    if (mode !== 'comments' || !generating || affectedSlides.length <= 1) return
    const interval = setInterval(() => {
      rotationRef.current = (rotationRef.current + 1) % affectedSlides.length
      onNavigate(affectedSlides[rotationRef.current])
    }, 3500)
    return () => clearInterval(interval)
  }, [mode, generating, affectedSlides, onNavigate])

  // Done: celebrate → step through affected slides (comments) → exit
  useEffect(() => {
    if (!done) return

    setCursorMode('celebrating')

    if (mode === 'comments' && affectedSlides.length > 1) {
      let delay = 1000
      for (let i = 0; i < affectedSlides.length; i++) {
        const t = setTimeout(() => onNavigate(affectedSlides[i]), delay)
        timersRef.current.push(t)
        delay += 800
      }
      const t = setTimeout(() => setCursorMode('exiting'), delay + 200)
      timersRef.current.push(t)
    } else {
      const t = setTimeout(() => setCursorMode('exiting'), 1500)
      timersRef.current.push(t)
    }
  }, [done]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleExitComplete = useCallback(() => {
    setCursorMode('hidden')
    onComplete()
  }, [onComplete])

  // Cleanup
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  const cursorCount = mode === 'slide' ? 6 : Math.min(Math.max(affectedSlides.length * 2, 6), 10)

  const statusText = generating
    ? mode === 'slide'
      ? 'Updating slide...'
      : `Applying feedback across ${affectedSlides.length} slide${affectedSlides.length !== 1 ? 's' : ''}...`
    : mode === 'slide'
      ? 'Slide updated!'
      : 'Feedback applied!'

  if (cursorMode === 'hidden') return null

  return (
    <div ref={containerRef} className="fixed inset-0 z-[250] pointer-events-none">
      {/* Subtle darkening overlay while working */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)',
          opacity: generating ? 1 : 0,
        }}
      />

      {/* Status pill */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[260]">
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
          {generating ? (
            <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse" />
          ) : (
            <div className="w-2 h-2 bg-cactus rounded-full" />
          )}
          <span className="text-xs text-white/70 font-medium">{statusText}</span>
        </div>
      </div>

      {/* Cancel button — pointer-events-auto so it's clickable */}
      {generating && onCancel && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[260] pointer-events-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Cursor swarm — targets specific slide elements when available */}
      <AgentCursors
        count={cursorCount}
        canvasBounds={bounds}
        cardRects={elementRects.length > 0 ? elementRects : undefined}
        mode={cursorMode}
        onExitComplete={handleExitComplete}
      />
    </div>
  )
}
