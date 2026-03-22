'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Locale } from '@/components/slide-translation'
import { LOCALE_OPTIONS } from '@/components/slide-translation'
import type { SlideData } from '@/components/studio/slide-renderer'

/* ── Types ── */
export interface SlideMeta {
  title: string
  subtitle?: string
}

interface SlideTocProps {
  open: boolean
  onClose: () => void
  slides: (() => React.JSX.Element)[]
  slideMeta: SlideMeta[]
  darkSlideSet: Set<number>
  current: number
  onSelect: (index: number) => void
  view: 'list' | 'cards'
  /** Edit mode — enables drag-reorder, add, delete */
  editMode?: boolean
  /** Raw slide data for mutations */
  slideData?: SlideData[]
  /** Called when slides are reordered, added, or deleted */
  onSlidesChange?: (slides: SlideData[]) => void
}

/* ── Thumbnail wrapper — mutes media in TOC previews ── */
function TocSlideWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const muteAll = () => {
      el.querySelectorAll('video, audio').forEach((m) => {
        (m as HTMLMediaElement).muted = true
      })
      // Mute YouTube iframes by appending mute=1
      el.querySelectorAll('iframe').forEach((f) => {
        const src = f.getAttribute('src') ?? ''
        if (src && !src.includes('mute=1')) {
          f.setAttribute('src', src + (src.includes('?') ? '&' : '?') + 'mute=1')
        }
      })
    }
    muteAll()
    const observer = new MutationObserver(muteAll)
    observer.observe(el, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="pointer-events-none h-full w-full">
      {children}
    </div>
  )
}

/* ── Preview Card ── */
function PreviewCard({
  index,
  SlideComp,
  isCurrent,
  isFocused,
  isDark,
  title,
  onSelect,
  onHover,
  vpWidth,
  vpHeight,
}: {
  index: number
  SlideComp: () => React.JSX.Element
  isCurrent: boolean
  isFocused: boolean
  isDark: boolean
  title: string
  onSelect: () => void
  onHover: () => void
  vpWidth: number
  vpHeight: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / vpWidth)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [vpWidth])

  const ringCls = isFocused
    ? 'ring-2 ring-turquoise ring-offset-2 ring-offset-slate-950'
    : isCurrent
      ? 'ring-2 ring-turquoise/50 ring-offset-2 ring-offset-slate-950'
      : 'ring-1 ring-white/10'

  return (
    <button
      data-toc-index={index}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`group relative w-full rounded-xl overflow-hidden text-left transition-all hover:scale-[1.02] hover:shadow-2xl ${ringCls}`}
      type="button"
    >
      <div ref={wrapRef} className="relative overflow-hidden rounded-t-xl" style={{ aspectRatio: `${vpWidth}/${vpHeight}` }}>
        <div
          className="absolute top-0 left-0 origin-top-left pointer-events-none"
          style={{ width: `${vpWidth}px`, height: `${vpHeight}px`, transform: `scale(${scale})` }}
        >
          <TocSlideWrapper><SlideComp /></TocSlideWrapper>
        </div>
      </div>
      <div className={`flex items-center gap-3 px-4 py-3 ${isDark ? 'bg-slate-900' : 'bg-white/5'}`}>
        <span className={`flex-shrink-0 font-display font-black text-xs ${isCurrent || isFocused ? 'text-turquoise' : 'text-linen/30'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className={`font-display font-bold text-sm leading-snug truncate ${isCurrent || isFocused ? 'text-turquoise' : 'text-linen/70 group-hover:text-linen'}`}>
          {title}
        </h3>
        {isCurrent && <span className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-turquoise" />}
      </div>
    </button>
  )
}

/* ── List Item with hover thumbnail ── */
function ListItem({
  index,
  meta,
  SlideComp,
  isCurrent,
  isFocused,
  onSelect,
  onHover,
  vpWidth,
  vpHeight,
}: {
  index: number
  meta: SlideMeta
  SlideComp: () => React.JSX.Element
  isCurrent: boolean
  isFocused: boolean
  onSelect: () => void
  onHover: () => void
  vpWidth: number
  vpHeight: number
}) {
  const [hovered, setHovered] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [thumbPos, setThumbPos] = useState<{ top: number; right: number } | null>(null)
  const thumbScale = 240 / vpWidth
  const thumbH = vpHeight * thumbScale

  const showThumb = hovered || isFocused

  useEffect(() => {
    if (!showThumb || !btnRef.current) { setThumbPos(null); return }
    const rect = btnRef.current.getBoundingClientRect()
    let top = rect.top + rect.height / 2 - thumbH / 2
    if (top < 8) top = 8
    if (top + thumbH > window.innerHeight - 8) top = window.innerHeight - 8 - thumbH
    setThumbPos({ top, right: 40 })
  }, [showThumb, thumbH, isFocused])

  const isHighlighted = isCurrent || isFocused

  return (
    <>
      <button
        ref={btnRef}
        data-toc-index={index}
        onClick={onSelect}
        onMouseEnter={() => { setHovered(true); onHover() }}
        onMouseLeave={() => setHovered(false)}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all group ${
          isFocused ? 'bg-turquoise/15' : isCurrent ? 'bg-turquoise/10' : 'hover:bg-white/5'
        }`}
        type="button"
      >
        <span className={`flex-shrink-0 w-8 text-right font-display font-black text-sm ${isHighlighted ? 'text-turquoise' : 'text-linen/25'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className={`h-px flex-shrink-0 w-6 transition-colors ${isHighlighted ? 'bg-turquoise/40' : 'bg-linen/10'}`} />
        <div className="flex-1 min-w-0">
          <h3 className={`font-display font-bold text-base sm:text-lg leading-snug truncate transition-colors ${isHighlighted ? 'text-turquoise' : 'text-linen/80 group-hover:text-linen'}`}>
            {meta.title}
          </h3>
          {meta.subtitle && (
            <p className={`text-xs mt-0.5 truncate ${isHighlighted ? 'text-turquoise/60' : 'text-linen/30'}`}>
              {meta.subtitle}
            </p>
          )}
        </div>
        {isCurrent && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-turquoise" />}
      </button>

      {/* Hover thumbnail — fixed positioning, appears in-place next to the row */}
      {showThumb && thumbPos && (
        <div
          className="hidden lg:block fixed z-[300] w-[240px] rounded-lg overflow-hidden ring-1 ring-white/15 shadow-2xl pointer-events-none"
          style={{ top: thumbPos.top, right: thumbPos.right }}
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: `${vpWidth}/${vpHeight}` }}>
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{ width: `${vpWidth}px`, height: `${vpHeight}px`, transform: `scale(${thumbScale})` }}
            >
              <TocSlideWrapper><SlideComp /></TocSlideWrapper>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Hook: track viewport size (slides use 100vw/100vh) ── */
function useViewportSize() {
  const [size, setSize] = useState({ w: 1600, h: 900 })
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}

/* ── Hook: get visible grid columns from a grid container ── */
function useGridCols(ref: React.RefObject<HTMLDivElement | null>) {
  const [cols, setCols] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const style = getComputedStyle(el)
      const templateCols = style.gridTemplateColumns
      setCols(templateCols ? templateCols.split(' ').length : 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return cols
}

/* ── Main TOC Overlay ── */
export function SlideToc({ open, onClose, slides, slideMeta, darkSlideSet, current, onSelect, view, editMode, slideData, onSlidesChange }: SlideTocProps) {
  const total = slides.length
  const vp = useViewportSize()
  const [focused, setFocused] = useState(current)
  const gridRef = useRef<HTMLDivElement>(null)
  const listScrollRef = useRef<HTMLDivElement>(null)
  const cardsScrollRef = useRef<HTMLDivElement>(null)
  const cols = useGridCols(gridRef)

  // Recently moved slide — for animation feedback
  const [justMoved, setJustMoved] = useState<number | null>(null)

  // Reset focus when TOC opens
  useEffect(() => {
    if (open) setFocused(current)
  }, [open, current])

  // Scroll focused item into view
  useEffect(() => {
    if (!open) return
    const container = view === 'list' ? listScrollRef.current : cardsScrollRef.current
    if (!container) return
    const el = container.querySelector(`[data-toc-index="${focused}"]`) as HTMLElement | null
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focused, open, view])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (!editMode) onSelect(focused)
        return
      }
      let next = focused
      if (view === 'list') {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = Math.min(focused + 1, total - 1)
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = Math.max(focused - 1, 0)
        else return
      } else {
        if (e.key === 'ArrowDown') next = Math.min(focused + cols, total - 1)
        else if (e.key === 'ArrowUp') next = Math.max(focused - cols, 0)
        else if (e.key === 'ArrowRight') next = Math.min(focused + 1, total - 1)
        else if (e.key === 'ArrowLeft') next = Math.max(focused - 1, 0)
        else return
      }
      e.preventDefault()
      setFocused(next)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, focused, total, view, cols, onSelect, editMode])

  // Edit mode handlers
  const handleMoveUp = useCallback((index: number) => {
    if (!slideData || !onSlidesChange || index <= 0) return
    const updated = [...slideData]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onSlidesChange(updated)
    setJustMoved(index - 1)
    setTimeout(() => setJustMoved(null), 400)
  }, [slideData, onSlidesChange])

  const handleMoveDown = useCallback((index: number) => {
    if (!slideData || !onSlidesChange || index >= slideData.length - 1) return
    const updated = [...slideData]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onSlidesChange(updated)
    setJustMoved(index + 1)
    setTimeout(() => setJustMoved(null), 400)
  }, [slideData, onSlidesChange])

  const handleDelete = useCallback((index: number) => {
    if (!slideData || !onSlidesChange || slideData.length <= 1) return
    const updated = slideData.filter((_, i) => i !== index)
    onSlidesChange(updated)
  }, [slideData, onSlidesChange])

  const handleAddAfter = useCallback((index: number) => {
    if (!slideData || !onSlidesChange) return
    const source = slideData[index]
    const newSlide: SlideData = {
      type: 'content',
      bg: source.bg,
      title: 'New Slide',
      body: '',
    }
    const updated = [...slideData]
    updated.splice(index + 1, 0, newSlide)
    onSlidesChange(updated)
  }, [slideData, onSlidesChange])

  if (!open) return null

  const canEdit = editMode && slideData && onSlidesChange

  return (
    <div className="fixed inset-0 z-[200] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 flex flex-col h-full w-full mx-auto px-6 sm:px-10 py-8 sm:py-12 animate-in fade-in duration-200 max-w-[1800px]">
        {/* Content — both views rendered, crossfade between them */}
        <div className="flex-1 relative">
          {/* List view */}
          <div
            ref={listScrollRef}
            className="absolute inset-0 overflow-y-auto -mx-4 px-4 transition-opacity duration-150"
            style={{
              opacity: view === 'list' ? 1 : 0,
              pointerEvents: view === 'list' ? 'auto' : 'none',
              zIndex: view === 'list' ? 1 : 0,
            }}
          >
            <div className="max-w-5xl mx-auto pb-4">
              {/* Header — inside list container so it aligns with items */}
              <div className="mb-8 px-4">
                <h2 className="font-display font-black text-linen text-2xl sm:text-3xl lg:text-4xl">Table of Contents</h2>
                <p className="text-linen/40 text-sm mt-1">
                  {total} slides{canEdit && <span className="text-turquoise/60 ml-2">· Drag to reorder</span>}
                </p>
              </div>
              <div className="space-y-1">
                {slideMeta.map((meta, i) => (
                  <div key={i} className={`relative group/item transition-all duration-200 ${justMoved === i ? 'bg-turquoise/5 rounded-xl' : ''}`}>
                    <div className="flex items-center gap-0">
                      {/* Move up/down buttons */}
                      {canEdit && (
                        <div className="flex-shrink-0 flex flex-col items-center gap-0.5 mr-1">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(i)}
                            disabled={i === 0}
                            className="w-6 h-5 flex items-center justify-center rounded text-linen/25 hover:text-turquoise disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            aria-label="Move up"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(i)}
                            disabled={i === total - 1}
                            className="w-6 h-5 flex items-center justify-center rounded text-linen/25 hover:text-turquoise disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            aria-label="Move down"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <ListItem
                          index={i}
                          meta={meta}
                          SlideComp={slides[i]}
                          isCurrent={current === i}
                          isFocused={view === 'list' && focused === i}
                          onSelect={() => { if (!editMode) onSelect(i) }}
                          onHover={() => setFocused(i)}
                          vpWidth={vp.w}
                          vpHeight={vp.h}
                        />
                      </div>
                      {/* Edit actions */}
                      {canEdit && (
                        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity mr-2">
                          <button
                            type="button"
                            onClick={() => handleAddAfter(i)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-linen/30 hover:text-cactus hover:bg-cactus/10 transition-colors"
                            aria-label="Add slide after"
                            title="Add slide after"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                          {slideData!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDelete(i)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-linen/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                              aria-label="Delete slide"
                              title="Delete slide"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cards view */}
          <div
            ref={cardsScrollRef}
            className="absolute inset-0 overflow-y-auto -mx-4 px-4 transition-opacity duration-150"
            style={{
              opacity: view === 'cards' ? 1 : 0,
              pointerEvents: view === 'cards' ? 'auto' : 'none',
              zIndex: view === 'cards' ? 1 : 0,
            }}
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="font-display font-black text-linen text-2xl sm:text-3xl lg:text-4xl">All Slides</h2>
              <p className="text-linen/40 text-sm mt-1">
                {total} slides{canEdit && <span className="text-turquoise/60 ml-2">· Drag to reorder</span>}
              </p>
            </div>
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 pb-4">
              {slides.map((SlideComp, i) => (
                <div
                  key={i}
                  className={`relative group/card transition-all duration-200 ${justMoved === i ? 'ring-2 ring-turquoise/50 rounded-xl' : ''}`}
                >
                  <PreviewCard
                    index={i}
                    SlideComp={SlideComp}
                    isCurrent={current === i}
                    isFocused={view === 'cards' && focused === i}
                    isDark={darkSlideSet.has(i)}
                    title={slideMeta[i]?.title ?? `Slide ${i + 1}`}
                    onSelect={() => { if (!editMode) onSelect(i) }}
                    onHover={() => setFocused(i)}
                    vpWidth={vp.w}
                    vpHeight={vp.h}
                  />
                  {/* Card edit controls */}
                  {canEdit && (
                    <>
                      {/* Top-right: add + delete */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
                        <button
                          type="button"
                          onClick={() => handleAddAfter(i)}
                          className="w-7 h-7 rounded-full bg-slate-950/60 backdrop-blur-sm flex items-center justify-center text-linen/50 hover:text-cactus hover:bg-cactus/20 transition-colors"
                          aria-label="Add slide after"
                          title="Add slide after"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                        {slideData!.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDelete(i)}
                            className="w-7 h-7 rounded-full bg-slate-950/60 backdrop-blur-sm flex items-center justify-center text-linen/50 hover:text-red-400 hover:bg-red-400/20 transition-colors"
                            aria-label="Delete slide"
                            title="Delete slide"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {/* Top-left: move up/down */}
                      <div className="absolute top-2 left-2 flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(i)}
                          disabled={i === 0}
                          className="w-7 h-7 rounded-full bg-slate-950/60 backdrop-blur-sm flex items-center justify-center text-linen/50 hover:text-turquoise disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move left"
                          title="Move earlier"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(i)}
                          disabled={i === total - 1}
                          className="w-7 h-7 rounded-full bg-slate-950/60 backdrop-blur-sm flex items-center justify-center text-linen/50 hover:text-turquoise disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move right"
                          title="Move later"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── View-mode icons ── */

function IconPresent({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
      <line x1="5.5" y1="14" x2="10.5" y2="14" />
      <line x1="8" y1="11.5" x2="8" y2="14" />
    </svg>
  )
}

function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1.5" y1="3" x2="14.5" y2="3" />
      <line x1="1.5" y1="8" x2="14.5" y2="8" />
      <line x1="1.5" y1="13" x2="14.5" y2="13" />
    </svg>
  )
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  )
}

/* ── TOC Chrome (2-icon view toggle + controls) ── */
export function SlideTocChrome({
  tocOpen,
  onToggle,
  tocView,
  onViewChange,
  pillBg,
  pillText,
  hintText,
  visible = true,
  children,
  onReset,
  currentSlide = 0,
  commentMode,
  onToggleComments,
  markersHidden,
  onToggleMarkers,
  flaggedCount,
  onClearFlagged,
  locale,
  onLocaleChange,
  onDownloadPdf,
  onDownloadPptx,
  onShare,
  onEdit,
  editActive,
  contentViewMode = 'presentation',
  onHover,
}: {
  tocOpen: boolean
  onToggle: () => void
  tocView: 'list' | 'cards'
  onViewChange: (v: 'list' | 'cards') => void
  pillBg: string
  pillText: string
  hintText: string
  /** Controls visibility — fades in/out. Defaults to true (always visible). */
  visible?: boolean
  /** Extra buttons to render left of the toggle (e.g. close button) */
  children?: React.ReactNode
  onReset?: () => void
  /** Current slide index (0-based) — used to gate restart button visibility */
  currentSlide?: number
  commentMode?: boolean
  onToggleComments?: () => void
  markersHidden?: boolean
  onToggleMarkers?: () => void
  flaggedCount?: number
  onClearFlagged?: () => void
  locale?: Locale
  onLocaleChange?: (l: Locale) => void
  onDownloadPdf?: () => void
  onDownloadPptx?: () => void
  onShare?: () => void
  /** Called when user hovers over the chrome — used to trigger visibility */
  onHover?: () => void
  /** Callback for edit toggle */
  onEdit?: () => void
  /** Whether edit mode is currently active */
  editActive?: boolean
  /** The current content view mode — TOC toggle only shows in 'presentation' */
  contentViewMode?: 'presentation' | 'outline' | 'document'
}) {
  const handleTocButton = (mode: 'list' | 'cards') => {
    if (tocOpen && tocView === mode) {
      // Already showing this view — close
      onToggle()
    } else if (tocOpen) {
      // Switch to the other view
      onViewChange(mode)
    } else {
      // Open in this view — close comments if open
      if (commentMode && onToggleComments) onToggleComments()
      onViewChange(mode)
      onToggle()
    }
  }

  const [controlsOpen, setControlsOpen] = useState(false)
  const showChrome = visible || tocOpen
  const showTocToggle = contentViewMode === 'presentation'
  const isDocOrOutline = contentViewMode === 'outline' || contentViewMode === 'document'
  const hasOverflow = onLocaleChange || onDownloadPdf || onToggleMarkers || onClearFlagged || onShare

  // In outline/document mode, use light-bg-friendly colors
  const effectivePillBg = isDocOrOutline ? 'bg-white/90 border-slate-950/10 shadow-xs' : (tocOpen ? 'bg-white/10 border-white/10' : pillBg)
  const effectivePillText = isDocOrOutline ? 'text-slate-950/60' : pillText
  const effectiveDivider = isDocOrOutline ? 'bg-slate-950/10' : 'bg-white/15'
  const effectiveHover = isDocOrOutline ? 'hover:bg-slate-950/5' : 'hover:bg-white/10'
  // Active highlight for locale/comment toggles — use dark style on brand/light backgrounds where turquoise lacks contrast
  const isBrandOrLight = pillText.includes('slate-950') || isDocOrOutline
  const activeHighlight = isBrandOrLight ? 'bg-slate-950/15 text-slate-950' : 'bg-turquoise/20 text-turquoise'

  return (
    <div
      className={`${isDocOrOutline ? 'fixed' : 'absolute'} top-4 right-4 sm:top-6 sm:right-6 z-[250] flex items-center gap-2 transition-opacity duration-200`}
      onMouseEnter={onHover}
      style={{
        opacity: isDocOrOutline ? 1 : (showChrome ? 1 : 0),
        pointerEvents: 'auto',
      }}
    >
      {/* Extra children (close button, etc.) — only in presentation mode */}
      {!isDocOrOutline && children}

      {/* Unified control pill */}
      <div className={`hidden md:flex items-center py-1 px-1.5 backdrop-blur-sm rounded-full border gap-[3px] ${effectivePillBg}`} data-no-translate>

        {/* ══ Outline / Document mode: flat layout — share, locale, PDF, comments ══ */}
        {isDocOrOutline && (
          <>
            {onShare && (
              <button onClick={onShare} type="button" className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${effectivePillText} ${effectiveHover}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Share
              </button>
            )}
            {onLocaleChange && (
              <>
                {onShare && <div className={`w-px h-3.5 flex-shrink-0 ${effectiveDivider}`} />}
                {LOCALE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onLocaleChange(opt.id)}
                    type="button"
                    className={`px-1.5 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-colors ${
                      locale === opt.id ? activeHighlight : `${effectivePillText} ${effectiveHover}`
                    }`}
                  >
                    {opt.short}
                  </button>
                ))}
              </>
            )}
            {onDownloadPdf && (
              <>
                <div className={`w-px h-3.5 flex-shrink-0 ${effectiveDivider}`} />
                <button onClick={onDownloadPdf} type="button" className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${effectivePillText} ${effectiveHover}`}>
                  ↓ PDF
                </button>
              </>
            )}
            {onDownloadPptx && (
              <button onClick={onDownloadPptx} type="button" className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${effectivePillText} ${effectiveHover}`}>
                ↓ PPTX
              </button>
            )}
            {onToggleComments && !isDocOrOutline && (
              <>
                <div className={`w-px h-3.5 flex-shrink-0 ${effectiveDivider}`} />
                <button
                  onClick={onToggleComments}
                  type="button"
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 ${
                    commentMode
                      ? activeHighlight
                      : `${effectivePillText} ${effectiveHover}`
                  }`}
                  aria-label={commentMode ? 'Exit comment mode' : 'Comment mode'}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                </button>
              </>
            )}
          </>
        )}

        {/* ══ Presentation mode: overflow | comments, toc, cards | edit ══ */}
        {!isDocOrOutline && (
          <>
            {/* ── Overflow: chevron + expandable menu ── */}
            {hasOverflow && !tocOpen && (
              <>
                {!controlsOpen && (
                  <button
                    onClick={() => setControlsOpen(true)}
                    type="button"
                    className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${pillText} hover:bg-white/10`}
                    aria-label="Expand controls"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                <div
                  className="overflow-hidden flex items-center transition-all duration-250 ease-out"
                  style={{
                    maxWidth: controlsOpen ? '500px' : '0px',
                    opacity: controlsOpen ? 1 : 0,
                  }}
                >
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    {onShare && (
                      <button onClick={onShare} type="button" className={`px-2 py-1 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${pillText} hover:bg-white/10`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                        Share
                      </button>
                    )}
                    {onToggleMarkers && (
                      <button onClick={onToggleMarkers} type="button" className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${markersHidden ? `bg-white/15 ${pillText}` : `${pillText} hover:bg-white/10`}`}>
                        {markersHidden ? '◌' : '◉'}
                      </button>
                    )}
                    {onClearFlagged && flaggedCount != null && flaggedCount > 0 && (
                      <button onClick={onClearFlagged} type="button" className="px-2 py-1 rounded-full text-xs font-medium transition-colors text-papaya/70 hover:bg-papaya/10 hover:text-papaya">
                        ✕ {flaggedCount}
                      </button>
                    )}
                    {onLocaleChange && (
                      <>
                        <div className="w-px h-3.5 flex-shrink-0 bg-white/15" />
                        {LOCALE_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => onLocaleChange(opt.id)}
                            type="button"
                            className={`px-1.5 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-colors ${
                              locale === opt.id ? activeHighlight : `${pillText} hover:bg-white/10`
                            }`}
                          >
                            {opt.short}
                          </button>
                        ))}
                      </>
                    )}
                    {onDownloadPdf && (
                      <>
                        <div className="w-px h-3.5 flex-shrink-0 bg-white/15" />
                        <button onClick={onDownloadPdf} type="button" className={`px-2 py-1 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${pillText} hover:bg-white/10`}>
                          ↓ PDF
                        </button>
                      </>
                    )}
                    {onDownloadPptx && (
                      <button onClick={onDownloadPptx} type="button" className={`px-2 py-1 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${pillText} hover:bg-white/10`}>
                        ↓ PPTX
                      </button>
                    )}
                  </div>
                </div>

                {controlsOpen && (
                  <button
                    onClick={() => setControlsOpen(false)}
                    type="button"
                    className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${pillText} hover:bg-white/10`}
                    aria-label="Collapse controls"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Divider after overflow */}
                {(onToggleComments || showTocToggle || onEdit) && <div className="w-px h-4 flex-shrink-0 bg-white/15" />}
              </>
            )}

            {/* ── Comments button (hidden when TOC is open) ── */}
            {onToggleComments && !tocOpen && (
              <button
                onClick={onToggleComments}
                type="button"
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 ${
                  commentMode
                    ? activeHighlight
                    : `${pillText} hover:bg-white/10`
                }`}
                aria-label={commentMode ? 'Exit comment mode' : 'Comment mode'}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
              </button>
            )}

            {/* ── TOC buttons: list & cards (presentation mode only) ── */}
            {showTocToggle && (
              <>
                <button
                  onClick={() => handleTocButton('list')}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 ${
                    tocOpen && tocView === 'list'
                      ? 'bg-turquoise text-slate-950'
                      : tocOpen ? 'text-linen/50 hover:text-linen/80' : `${pillText} hover:bg-white/10`
                  }`}
                  aria-label={tocOpen && tocView === 'list' ? 'Close list view' : 'List view'}
                  type="button"
                >
                  {tocOpen && tocView === 'list' ? <IconClose /> : <IconList />}
                </button>

                <button
                  onClick={() => handleTocButton('cards')}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 ${
                    tocOpen && tocView === 'cards'
                      ? 'bg-turquoise text-slate-950'
                      : tocOpen ? 'text-linen/50 hover:text-linen/80' : `${pillText} hover:bg-white/10`
                  }`}
                  aria-label={tocOpen && tocView === 'cards' ? 'Close grid view' : 'Grid view'}
                  type="button"
                >
                  {tocOpen && tocView === 'cards' ? <IconClose /> : <IconGrid />}
                </button>
              </>
            )}

            {/* ── Divider before edit ── */}
            {onEdit && (onToggleComments || showTocToggle) && <div className="w-px h-4 flex-shrink-0 bg-white/15" />}

            {/* ── Edit button ── */}
            {onEdit && (
              <button
                onClick={onEdit}
                type="button"
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 ${
                  editActive
                    ? 'bg-turquoise text-slate-950'
                    : `${pillText} hover:bg-white/10`
                }`}
                aria-label="Edit presentation"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
