'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { SlideData } from './slide-renderer'

/* ═══════════════════════════════════════════════════════════ */
/*                     PRESENTER VIEW                          */
/*                                                              */
/*  Fullscreen presenter mode with:                            */
/*  - Large current slide display (left)                       */
/*  - Speaker notes + next slide preview (right panel)         */
/*  - Timer with pause/reset                                   */
/*  - Keyboard navigation (arrows, space, escape)              */
/*  - Slide dot navigation                                     */
/* ═══════════════════════════════════════════════════════════ */

function SlidePreview({ slide, label, onClick }: { slide: SlideData | null; label: string; onClick?: () => void }) {
  if (!slide) {
    return (
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">{label}</p>
        <div className="w-full aspect-video rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-xs text-white/30">End of presentation</p>
        </div>
      </div>
    )
  }

  const bgClass = slide.bg === 'dark'
    ? 'bg-[#082422] text-white'
    : slide.bg === 'brand'
      ? 'bg-[#2BF2F1] text-[#082422]'
      : 'bg-[#EFEBE7] text-[#082422]'

  const content = (
    <div className={cn('w-full aspect-video rounded-lg overflow-hidden p-3 flex flex-col justify-center', bgClass)}>
      {slide.badge && (
        <span className="text-[5px] uppercase tracking-widest opacity-50 mb-0.5">{slide.badge}</span>
      )}
      <p className="font-display font-black text-[9px] leading-tight line-clamp-3">{slide.title}</p>
      {slide.subtitle && (
        <p className="text-[6px] opacity-50 mt-0.5 line-clamp-2">{slide.subtitle}</p>
      )}
    </div>
  )

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">{label}</p>
      {onClick ? (
        <button onClick={onClick} className="w-full hover:opacity-80 transition-opacity text-left" type="button">
          {content}
        </button>
      ) : content}
    </div>
  )
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

interface PresenterViewProps {
  slides: SlideData[]
  currentSlide: number
  onSlideChange: (index: number) => void
  onExit: () => void
  deckTitle?: string
  /** Render the main slide content — parent provides the actual slide renderer */
  renderSlide: (slideIndex: number) => React.ReactNode
}

export function PresenterView({ slides, currentSlide, onSlideChange, onExit, deckTitle, renderSlide }: PresenterViewProps) {
  const [elapsed, setElapsed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const total = slides.length
  const slide = slides[currentSlide]
  const nextSlide = currentSlide < total - 1 ? slides[currentSlide + 1] : null

  const next = useCallback(() => onSlideChange(Math.min(currentSlide + 1, total - 1)), [currentSlide, total, onSlideChange])
  const prev = useCallback(() => onSlideChange(Math.max(currentSlide - 1, 0)), [currentSlide, onSlideChange])

  // Timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  // Request fullscreen on mount
  useEffect(() => {
    const el = containerRef.current
    if (el && document.fullscreenElement !== el) {
      el.requestFullscreen?.().catch(() => {
        // Fullscreen not available — still works as an overlay
      })
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {})
      }
    }
  }, [])

  // Exit on fullscreen change (user pressed Escape via browser)
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) onExit()
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [onExit])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (e.key === 'Escape') { e.preventDefault(); onExit(); return }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      if (e.key === 'Home') { e.preventDefault(); onSlideChange(0) }
      if (e.key === 'End') { e.preventDefault(); onSlideChange(total - 1) }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [next, prev, onExit, onSlideChange, total])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex select-none">
      {/* Left: Current slide (large) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-11 flex items-center justify-between px-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="text-[11px] text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
              type="button"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit
            </button>
            {deckTitle && (
              <>
                <span className="text-white/10">·</span>
                <span className="text-[11px] text-white/25 truncate max-w-[240px]">{deckTitle}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 font-mono tabular-nums">
                {formatTime(elapsed)}
              </span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                type="button"
              >
                {timerRunning ? '⏸' : '▶'}
              </button>
              <button
                onClick={() => { setElapsed(0); setTimerRunning(true) }}
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                type="button"
              >
                ↺
              </button>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-xs font-medium text-white/50 tabular-nums">
              {currentSlide + 1}<span className="text-white/20"> / {total}</span>
            </span>
          </div>
        </div>

        {/* Current slide */}
        <div className="flex-1 flex items-center justify-center p-5 min-h-0">
          <div className="w-full max-w-[900px] aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/[0.06]">
            {renderSlide(currentSlide)}
          </div>
        </div>

        {/* Slide dots */}
        <div className="h-8 flex items-center justify-center gap-1 shrink-0 pb-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => onSlideChange(i)}
              className={cn(
                'h-1 rounded-full transition-all duration-200',
                currentSlide === i
                  ? 'w-6 bg-[#2BF2F1]'
                  : 'w-1 bg-white/15 hover:bg-white/30',
              )}
              aria-label={`Go to slide ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>

      {/* Right: Notes + Next slide preview */}
      <div className="w-[320px] border-l border-white/[0.06] flex flex-col shrink-0 bg-[#0e0e0e]">
        {/* Next slide preview */}
        <div className="p-4 border-b border-white/[0.06] shrink-0">
          <SlidePreview slide={nextSlide} label="Next" onClick={nextSlide ? next : undefined} />
        </div>

        {/* Speaker notes */}
        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Notes</p>
          {slide?.notes ? (
            <div className="text-[13px] text-white/70 leading-relaxed whitespace-pre-wrap font-sans">
              {slide.notes}
            </div>
          ) : (
            <p className="text-[13px] text-white/25 italic">No notes for this slide.</p>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="p-3 border-t border-white/[0.06] flex gap-2 shrink-0">
          <button
            onClick={prev}
            disabled={currentSlide === 0}
            className="flex-1 py-2 rounded-lg bg-white/[0.04] text-white/60 text-xs font-medium hover:bg-white/[0.08] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            ← Prev
          </button>
          <button
            onClick={next}
            disabled={currentSlide === total - 1}
            className="flex-1 py-2 rounded-lg bg-[#2BF2F1] text-[#082422] text-xs font-medium hover:bg-[#2BF2F1]/90 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
