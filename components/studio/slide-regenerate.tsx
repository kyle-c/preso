'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════ */
/*                  SLIDE REGENERATION                         */
/*                                                              */
/*  Per-slide "Regenerate" button with quick feedback pills.   */
/*  Sends feedback + slide context to the generation API.      */
/* ═══════════════════════════════════════════════════════════ */

const QUICK_FEEDBACK = [
  { label: 'Too text-heavy', prompt: 'This slide has too much text. Reduce the word count by 50%, use bullet points instead of paragraphs, and keep only the most essential information.' },
  { label: 'More visual', prompt: 'This slide needs more visual impact. Add an illustration from the brand library, or convert the content to a more visual slide type (cards, chart, two-column with image).' },
  { label: 'Make it a chart', prompt: 'Convert the data/metrics on this slide into a chart visualization. Choose the best chart type for this data (bar, line, donut, etc.).' },
  { label: 'Simplify', prompt: 'Simplify this slide. One key message, fewer words, bigger type. Think billboard, not document.' },
  { label: 'Split into 2', prompt: 'This slide tries to cover too much. Split it into two focused slides, each with one clear idea.' },
]

interface SlideRegenerateProps {
  slideIndex: number
  slideData: any
  totalSlides: number
  prevSlide?: any
  nextSlide?: any
  onRegenerate: (slideIndex: number, feedback: string) => void
  generating?: boolean
  dark?: boolean
  /** Lock the parent hover state while the popover is open */
  onOpenChange?: (open: boolean) => void
}

export function SlideRegenerate({ slideIndex, slideData, totalSlides, prevSlide, nextSlide, onRegenerate, generating, dark, onOpenChange }: SlideRegenerateProps) {
  const [expanded, setExpanded] = useState(false)
  const [customFeedback, setCustomFeedback] = useState('')

  const handleRegenerate = useCallback((feedback: string) => {
    const context = `Regenerate slide ${slideIndex + 1} of ${totalSlides}.
Current slide: ${JSON.stringify(slideData, null, 1)}
${prevSlide ? `Previous slide title: "${prevSlide.title}"` : ''}
${nextSlide ? `Next slide title: "${nextSlide.title}"` : ''}

Feedback: ${feedback}

Generate ONLY the replacement for this single slide. Keep the same bg color (${slideData.bg}) and badge (${slideData.badge || 'none'}). The slide must fit naturally between the previous and next slides.`

    onRegenerate(slideIndex, context)
    setExpanded(false)
    setCustomFeedback('')
    onOpenChange?.(false)
  }, [slideIndex, slideData, totalSlides, prevSlide, nextSlide, onRegenerate])

  if (generating) {
    return (
      <div className={cn('flex items-center gap-2 text-xs', dark ? 'text-white/50' : 'text-foreground/50')}>
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Regenerating...
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={() => { const next = !expanded; setExpanded(next); onOpenChange?.(next) }}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all',
          dark
            ? 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            : 'bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground',
        )}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
        Regenerate
      </button>

      {expanded && (
        <div className={cn(
          'rounded-xl p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150 w-64',
          dark ? 'bg-white/10 backdrop-blur-md' : 'bg-white border border-border shadow-lg',
        )}>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_FEEDBACK.map((fb) => (
              <button
                key={fb.label}
                type="button"
                onClick={() => handleRegenerate(fb.prompt)}
                className={cn(
                  'px-2 py-1 rounded-full text-[10px] font-medium transition-colors',
                  dark
                    ? 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground',
                )}
              >
                {fb.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={customFeedback}
              onChange={e => setCustomFeedback(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && customFeedback.trim()) handleRegenerate(customFeedback.trim()) }}
              placeholder="Custom feedback..."
              className={cn(
                'flex-1 px-2 py-1 rounded-lg text-[11px] outline-none',
                dark
                  ? 'bg-white/5 text-white placeholder:text-white/30 border border-white/10'
                  : 'bg-foreground/5 text-foreground placeholder:text-foreground/30 border border-border',
              )}
            />
            <button
              type="button"
              onClick={() => customFeedback.trim() && handleRegenerate(customFeedback.trim())}
              disabled={!customFeedback.trim()}
              className={cn(
                'px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors',
                dark
                  ? 'bg-turquoise text-slate-950 disabled:opacity-30'
                  : 'bg-foreground text-white disabled:opacity-30',
              )}
            >
              Go
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
