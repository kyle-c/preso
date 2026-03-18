'use client'

import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Layers } from 'lucide-react'
import type { SlideData } from './slide-renderer'
import { DocumentSkeleton, DocumentView } from './deck-views'
import { AgentCursors } from './agent-cursor'
import type { PresentationDocument, PresentationOutline } from '@/lib/studio-db'

/* ─────────────────────── Outline Generation View ─────────────────────── */

interface OutlineGenerationViewProps {
  slides: SlideData[]
  outline: PresentationOutline | null
  generating: boolean
  done: boolean
  savedId: string | null
  hint?: string | null
  onCancel: () => void
  onRestart?: () => void
}

/** Skeleton shown while the outline is being generated — same layout as DocumentSkeleton but with outline-shaped wireframes */
function OutlineSkeleton({ onExit }: { onExit: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardBounds, setCardBounds] = useState<DOMRect | null>(null)
  const [rowRects, setRowRects] = useState<DOMRect[]>([])

  useEffect(() => {
    const measure = () => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      setCardBounds(rect)

      const rowCount = 8
      const padX = rect.width * 0.06
      const padTop = rect.height * 0.06
      const usableH = rect.height * 0.88
      const rowH = usableH / rowCount
      const rects: DOMRect[] = []
      const offsets = [0, 0.8, 1.9, 2.5, 3.6, 4.5, 5.6, 6.7]
      for (let i = 0; i < rowCount; i++) {
        const y = rect.top + padTop + offsets[i] * (usableH / 7)
        rects.push(new DOMRect(rect.left + padX, y, rect.width - padX * 2, rowH * 0.6))
      }
      setRowRects(rects)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div className="fixed inset-0 z-[180] bg-linen overflow-hidden" data-view="outline">
      {/* Status pill */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[260]">
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
          <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse" />
          <span className="text-xs text-white/70 font-medium">Generating outline...</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-20 sm:py-24">
          <div ref={cardRef} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-950/[0.06] px-10 sm:px-16 py-14 sm:py-20 relative overflow-hidden">
            {/* Title skeleton */}
            <div className="mb-12 animate-pulse">
              <div className="h-10 w-3/4 bg-slate-950/[0.06] rounded-lg mb-4" />
              <div className="h-5 w-full bg-slate-950/[0.04] rounded-lg mb-2" />
              <div className="h-5 w-1/2 bg-slate-950/[0.04] rounded-lg" />
            </div>

            {/* Section card skeletons — outline style */}
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="mb-6 rounded-xl bg-slate-950/[0.02] ring-1 ring-slate-950/[0.04] p-6 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="h-5 w-8 bg-slate-950/[0.06] rounded shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-950/[0.06] rounded-lg" style={{ width: `${40 + (i * 17) % 35}%` }} />
                    <div className="h-4 w-full bg-slate-950/[0.04] rounded" />
                    <div className="h-4 w-4/5 bg-slate-950/[0.04] rounded" />
                    {/* Subsection dots */}
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-2 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-950/[0.06]" />
                        <div className="h-3.5 bg-slate-950/[0.04] rounded" style={{ width: `${50 + (i * 11) % 30}%` }} />
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-950/[0.06]" />
                        <div className="h-3.5 bg-slate-950/[0.04] rounded" style={{ width: `${35 + (i * 19) % 40}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exit button */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[200] animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="inline-flex items-center py-1 px-1.5 backdrop-blur-sm rounded-full border border-slate-950/10 bg-white/80 gap-[3px] shadow-sm">
          <button
            type="button"
            onClick={onExit}
            className="h-7 px-2 rounded-full inline-flex items-center gap-1.5 transition-colors text-slate-950/60 hover:bg-slate-950/5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-xs font-medium">Exit</span>
          </button>
        </div>
      </div>

      {/* Agent cursors */}
      <AgentCursors
        count={8}
        canvasBounds={cardBounds}
        cardRects={rowRects}
        mode="working"
      />
    </div>
  )
}

/** Render finished outline content inside a white card, matching the document view aesthetic */
function OutlineContent({ outline, slides }: { outline: PresentationOutline; slides: SlideData[] }) {
  return (
    <div className="fixed inset-0 z-[180] bg-linen overflow-y-auto" data-view="outline">
      <div className="flex-1 min-w-0 overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-20 sm:py-24">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-950/[0.06] px-10 sm:px-16 py-14 sm:py-20">
            {/* Title */}
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-950 leading-tight">
                {outline.title}
              </h1>
              {outline.thesis && (
                <p className="text-base text-mocha mt-3 max-w-3xl leading-relaxed">{outline.thesis}</p>
              )}
            </div>

            {/* Section cards */}
            <div className="space-y-5">
              {outline.sections.map((section, si) => (
                <div
                  key={si}
                  className="rounded-xl bg-slate-950/[0.015] ring-1 ring-slate-950/[0.05] p-6 sm:p-7 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${si * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <span className="font-display font-black text-lg text-concrete shrink-0 pt-0.5">
                      {String(si + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display font-bold text-xl leading-snug text-slate-950">{section.title}</h2>
                      <p className="mt-2 text-[15px] text-slate-950/60 leading-relaxed">{section.summary}</p>

                      {section.subsections && section.subsections.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {section.subsections.map((sub, ssi) => (
                            <div key={ssi} className="flex gap-3 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-evergreen/40 mt-2 shrink-0" />
                              <div>
                                <span className="font-semibold text-sm text-slate-950/80">{sub.title}</span>
                                {sub.detail && (
                                  <span className="text-sm text-slate-950/50 ml-1.5">— {sub.detail}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Slide references */}
                      {section.slideIndices && section.slideIndices.length > 0 && (
                        <div className="mt-4 flex items-center gap-1.5">
                          <span className="text-[11px] text-concrete uppercase tracking-wider">Slides:</span>
                          {section.slideIndices.map(idx => (
                            <span
                              key={idx}
                              className="text-[11px] font-semibold text-evergreen bg-evergreen/10 px-2 py-0.5 rounded-full"
                            >
                              {idx + 1}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OutlineGenerationView({
  slides,
  outline,
  generating,
  done,
  savedId,
  hint,
  onCancel,
  onRestart,
}: OutlineGenerationViewProps) {
  const router = useRouter()
  const isFullyDone = done && !!outline

  // Before outline arrives — show skeleton with floating cursors
  if (!outline) {
    return (
      <>
        <OutlineSkeleton onExit={onCancel} />
        {hint && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[280]">
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse" />
              <span className="text-xs text-white/70 font-medium">{hint}</span>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <OutlineContent outline={outline} slides={slides} />

      {/* Status pill */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[260]">
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
          {isFullyDone ? (
            <div className="w-2 h-2 bg-cactus rounded-full" />
          ) : (
            <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse" />
          )}
          <span className="text-xs text-white/70 font-medium">
            {hint ?? (isFullyDone ? 'Your outline is ready!' : 'Finishing outline...')}
          </span>
        </div>
      </div>

      {/* Exit / back + restart pill */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[200] animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="inline-flex items-center py-1 px-1.5 backdrop-blur-sm rounded-full border border-slate-950/10 bg-white/80 gap-[3px] shadow-sm">
          <button
            type="button"
            onClick={onCancel}
            className="h-7 px-2 rounded-full inline-flex items-center gap-1.5 transition-colors text-slate-950/60 hover:bg-slate-950/5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-xs font-medium">Exit</span>
          </button>
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="h-7 px-2 rounded-full inline-flex items-center gap-1.5 transition-colors text-slate-950/60 hover:bg-slate-950/5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M20.015 4.356v4.992m0 0l-3.181-3.183a8.25 8.25 0 00-13.803 3.7" />
              </svg>
              <span className="text-xs font-medium">Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Action buttons — bottom right when done */}
      {isFullyDone && savedId && (
        <div className="fixed bottom-8 right-8 z-[200] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            type="button"
            onClick={() => router.push(`/create/${savedId}?view=outline`)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-950/10 shadow-lg text-sm font-semibold text-slate-950 hover:bg-slate-50 transition-colors"
          >
            Edit Outline
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push(`/create/${savedId}`)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-950 shadow-lg text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Open Presentation
          </button>
        </div>
      )}
    </>
  )
}

/* ─────────────────────── Document Generation View ─────────────────────── */

interface DocumentGenerationViewProps {
  slides: SlideData[]
  document: PresentationDocument | null
  generating: boolean
  generatingDoc: boolean
  done: boolean
  savedId: string | null
  hint?: string | null
  onCancel: () => void
  onRestart?: () => void
}

export function DocumentGenerationView({
  slides,
  document: doc,
  generating,
  generatingDoc,
  done,
  savedId,
  hint,
  onCancel,
  onRestart,
}: DocumentGenerationViewProps) {
  const router = useRouter()
  const isFullyDone = done && !!doc

  // When document hasn't arrived yet, show DocumentSkeleton (self-contained full-screen component)
  // When document arrives, show DocumentView with isGenerating flag
  if (!doc) {
    return (
      <>
        <DocumentSkeleton onExit={onCancel} />
        {/* Override the skeleton's status pill with a more specific message */}
        {hint && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[280]">
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse" />
              <span className="text-xs text-white/70 font-medium">{hint}</span>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <DocumentView
        document={doc}
        slides={slides}
        onGoToSlide={() => {}}
        isGenerating={!isFullyDone}
      />

      {/* Status pill */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[260]">
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
          {isFullyDone ? (
            <div className="w-2 h-2 bg-cactus rounded-full" />
          ) : (
            <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse" />
          )}
          <span className="text-xs text-white/70 font-medium">
            {hint ?? (isFullyDone ? 'Your document is ready!' : 'Writing document...')}
          </span>
        </div>
      </div>

      {/* Exit / back + restart pill */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[200] animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="inline-flex items-center py-1 px-1.5 backdrop-blur-sm rounded-full border border-slate-950/10 bg-white/80 gap-[3px] shadow-sm">
          <button
            type="button"
            onClick={onCancel}
            className="h-7 px-2 rounded-full inline-flex items-center gap-1.5 transition-colors text-slate-950/60 hover:bg-slate-950/5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-xs font-medium">Exit</span>
          </button>
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="h-7 px-2 rounded-full inline-flex items-center gap-1.5 transition-colors text-slate-950/60 hover:bg-slate-950/5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M20.015 4.356v4.992m0 0l-3.181-3.183a8.25 8.25 0 00-13.803 3.7" />
              </svg>
              <span className="text-xs font-medium">Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Action buttons — bottom right when done */}
      {isFullyDone && savedId && (
        <div className="fixed bottom-8 right-8 z-[200] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            type="button"
            onClick={() => router.push(`/create/${savedId}?view=document`)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-950/10 shadow-lg text-sm font-semibold text-slate-950 hover:bg-slate-50 transition-colors"
          >
            Edit Document
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push(`/create/${savedId}`)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-950 shadow-lg text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Open Presentation
          </button>
        </div>
      )}
    </>
  )
}
