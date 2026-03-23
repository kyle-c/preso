'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrandColors, type BrandColors } from '@/lib/brand-context'
import { SlideToc, SlideTocChrome, type SlideMeta } from '@/components/slide-toc'
import { useLocale, useSlideTranslation } from '@/components/slide-translation'
import { applyTranslations, applyDocumentTranslations } from '@/lib/slide-translations'
import { useSlidePdf } from '@/components/use-slide-pdf'
import { SlidePdfOverlay } from '@/components/slide-pdf-overlay'
import { useComments, SlideCommentLayer } from '@/components/slide-comments'
import { SlideChartViz } from './slide-chart'
import { SlideRating } from './slide-rating'
import { SlideRegenerate } from './slide-regenerate'
import { ViewModeToggle, OutlineView, DocumentView, DocumentSkeleton, type ViewMode, type OutlineEditPanelProps, type SectionFilesMap } from './deck-views'
import type { UploadedFile } from './file-uploader'
import type { PresentationDocument, PresentationOutline } from '@/lib/studio-db'
import { parseInlineContent, type InlineSegment } from '@/lib/link-utils'

/* ═══════════════════════════════════════════════════════════ */
/*                          TYPES                             */
/* ═══════════════════════════════════════════════════════════ */

export interface ChartSpec {
  chartType: 'bar' | 'horizontal-bar' | 'stacked-bar' | 'line' | 'multi-line' | 'area' | 'donut' | 'scatter' | 'radar'
    | 'waterfall' | 'funnel' | 'gauge' | 'heatmap' | 'treemap' | 'bubble' | 'combo' | 'histogram' | 'candlestick' | 'pictorial' | 'gantt'
  data: Record<string, any>[]
  xKey: string
  yKeys: string[]
  colors?: string[]
  yLabel?: string
  xLabel?: string
  /** For bubble charts: key for dot size */
  zKey?: string
  /** For combo charts: which yKeys render as lines (rest are bars) */
  lineKeys?: string[]
  /** For gauge: max value (default 100) */
  max?: number
  /** For heatmap: column labels */
  columns?: string[]
}

export interface SlideData {
  type: 'title' | 'section' | 'content' | 'bullets' | 'two-column' | 'cards' | 'quote' | 'image' | 'checklist' | 'closing' | 'chart'
  bg: 'dark' | 'light' | 'brand'
  badge?: string
  title: string
  subtitle?: string
  body?: string
  bullets?: { text: string; icon?: string }[]
  cards?: { title: string; titleColor: string; body: string }[]
  columns?: { heading?: string; body?: string; bullets?: { text: string; icon?: string }[] }[]
  quote?: { text: string; attribution?: string }
  imageUrl?: string
  imageCaption?: string
  chart?: ChartSpec
  /** Layout hint for the renderer — controls which variant of the slide type to use */
  layout?: '2x2-grid' | 'agenda' | 'timeline' | 'pros-cons' | 'section-divider' | 'hero-metric' | 'three-column' | 'key-takeaways'
  /** Speaker notes */
  notes?: string
  /** URL to embed in a mobile device frame (content slides only) */
  embedUrl?: string
  /** Google Drive video URL — rendered as embedded player. Use format: https://drive.google.com/file/d/{ID}/preview */
  videoUrl?: string
}

/** Chrome color classes exposed to parent via render props */
export interface ChromeColors {
  btnCls: string
  btnIcon: string
  pillBg: string
  pillText: string
  /** Whether the mouse is hovering the top 10% of the viewport */
  hoverTop: boolean
  /** Lock/unlock hover state — prevents chrome from hiding while dropdowns are open */
  lockHover: (locked: boolean) => void
}

export interface SlideRendererProps {
  slides: SlideData[]
  title: string
  deckId: string
  isFullScreen?: boolean
  onClose?: () => void
  /** When set, forces the renderer to show this slide index */
  forceSlide?: number
  /** Extra element to render in the top-right area (e.g. streaming indicator) */
  topRightExtra?: React.ReactNode | ((chrome: ChromeColors) => React.ReactNode)
  /** Extra element to render in the top-left area after the counter pill — receives chrome colors */
  topLeftExtra?: React.ReactNode | ((chrome: ChromeColors) => React.ReactNode)
  /** If true, the built-in back/close button in top-right is hidden (parent handles its own) */
  hideCloseButton?: boolean
  /** Optional document for Document view mode */
  document?: PresentationDocument | null
  /** Optional LLM-generated outline for Outline view mode */
  outline?: PresentationOutline | null
  /** If provided, called when switching to document/outline/presentation mode — parent can handle views externally */
  onViewModeChange?: (mode: ViewMode) => void
  /** Callback for share action — shown in the overflow menu */
  onShare?: () => void
  /** Callback for edit toggle */
  onEdit?: () => void
  /** Whether edit mode is currently active */
  editActive?: boolean
  /** Called when slides are edited inline (outline view) */
  onSlidesChange?: (slides: SlideData[]) => void
  /** Called when document is edited inline (document view) */
  onDocumentChange?: (doc: PresentationDocument) => void
  /** Called when outline is edited inline (outline view) */
  onOutlineChange?: (outline: PresentationOutline) => void
  /** Called when user clicks "Rebuild Presentation" after inline edits */
  onRebuild?: () => void
  /** Initial view mode (for deep-linked URLs) */
  initialViewMode?: ViewMode
  /** Called whenever the view mode changes (for URL sync) */
  onViewModeChanged?: (mode: ViewMode) => void
  /** When provided (shared view), enables viewer dwell-time tracking */
  shareToken?: string
  /** Pre-computed translations for instant locale switching */
  translations?: Record<string, Record<string, string>> | null
  /** Called when user clicks "Generate" on missing document. Returns false if generation couldn't start (e.g. no API key). */
  onGenerateDocument?: () => boolean | void
  /** Whether document is currently being generated */
  isGeneratingDocument?: boolean
  /** Whether a document generation attempt has failed */
  documentGenFailed?: boolean
  /** When set, enables slide rating UI (thumbs up/down for training) */
  ratingSource?: string
  /** Permission level for shared viewers — gates edit/comment features */
  sharePermission?: 'viewer' | 'commenter' | 'editor'
  /** Called when user requests regeneration of a single slide with feedback */
  onSlideRegenerate?: (slideIndex: number, feedback: string) => void
  /** Whether a slide is currently being regenerated */
  regeneratingSlide?: number | null
  /** Edit panel props for the right-column edit panel in document view */
  documentEditPanel?: {
    editPrompt: string
    onPromptChange: (p: string) => void
    editScope: 'comments' | 'deck'
    onScopeChange: (s: 'comments' | 'deck') => void
    onGenerate: () => void
    generating: boolean
    comments: { id: string; slideIndex: number; x: number; y: number; name: string; email?: string; text: string; timestamp: number; replies: { id: string; name: string; text: string; timestamp: number }[]; flaggedForRebuild?: boolean; resolved?: boolean }[]
    commentsLoading: boolean
    flaggedIds: Set<string>
    onToggleFlag: (id: string) => void
    files: { id: string; name: string; type: 'image' | 'pdf' | 'data'; data: string; size: number; preview?: string }[]
    onFilesChange: (files: { id: string; name: string; type: 'image' | 'pdf' | 'data'; data: string; size: number; preview?: string }[]) => void
  }
  /** Edit panel props for the right-column edit panel in outline view */
  outlineEditPanel?: OutlineEditPanelProps
  /** AI edit via text selection in document/outline views */
  onSelectionAIEdit?: (prompt: string, selectionContext: { sectionIndex: number; selectedText: string }) => void
  /** Per-section file attachments (shared between outline and document views) */
  sectionFiles?: SectionFilesMap
  onSectionFilesChange?: (sectionIndex: number, files: UploadedFile[]) => void
}

/* ═══════════════════════════════════════════════════════════ */
/*                     HELPER UTILITIES                       */
/* ═══════════════════════════════════════════════════════════ */

/** Parse **bold** markers and [text](url) / bare URLs into React nodes */
function parseBold(text: string): React.ReactNode {
  const segments = parseInlineContent(text)
  if (segments.length === 1 && segments[0].type === 'text') return text
  return segments.map((seg, i) => {
    if (seg.type === 'bold') return <strong key={i} className="font-bold">{seg.content}</strong>
    if (seg.type === 'link') return <a key={i} href={seg.url} target="_blank" rel="noopener noreferrer" className="underline decoration-current/30 underline-offset-2 hover:decoration-current/60 transition-colors">{seg.content}</a>
    return <span key={i}>{seg.content}</span>
  })
}

/** Like parseBold, but renders **bold** segments in the accent color (turquoise on dark) */
function parseBoldAccent(text: string, bg: SlideData['bg']): React.ReactNode {
  const accentCls = bg === 'dark' ? 'text-turquoise' : bg === 'brand' ? 'text-slate-950' : 'text-evergreen'
  const segments = parseInlineContent(text)
  if (segments.length === 1 && segments[0].type === 'text') return text
  return segments.map((seg, i) => {
    if (seg.type === 'bold') return <strong key={i} className={cn('font-black', accentCls)}>{seg.content}</strong>
    if (seg.type === 'link') return <a key={i} href={seg.url} target="_blank" rel="noopener noreferrer" className="underline decoration-current/30 underline-offset-2 hover:decoration-current/60 transition-colors">{seg.content}</a>
    return <span key={i}>{seg.content}</span>
  })
}

/** Background + text classes for a given bg mode */
/**
 * Brand-aware background classes. Uses CSS custom properties set by the
 * SlideRenderer from the active brand kit, falling back to Félix defaults.
 * The container uses inline style for the bg color; text classes remain
 * Tailwind since they're contrast-based (dark bg → white text).
 */
function bgClasses(bg: SlideData['bg']) {
  switch (bg) {
    case 'dark': return { container: 'slide-bg-dark', text: 'text-white', muted: 'text-white/60', accent: 'text-turquoise', bgVar: '--brand-dark-bg' }
    case 'brand': return { container: 'slide-bg-brand', text: 'text-slate-950', muted: 'text-slate-950/60', accent: 'text-slate-950', bgVar: '--brand-brand-bg' }
    case 'light':
    default: return { container: 'slide-bg-light', text: 'text-foreground', muted: 'text-muted-foreground', accent: 'text-evergreen', bgVar: '--brand-light-bg' }
  }
}

/* ═══════════════════════════════════════════════════════════ */
/*              FLOATING BACKGROUND ILLUSTRATIONS              */
/* ═══════════════════════════════════════════════════════════ */

const ILLUSTRATION_POOL = [
  '/illustrations/Dollar%20bills%20%2B%20Coins%20A.svg',
  '/illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg',
  '/illustrations/Cloud%20Coin%20-%20Turquoise.svg',
  '/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg',
  '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
  '/illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg',
  '/illustrations/ray.svg',
  '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
  '/illustrations/Hand%20-%20Stars.svg',
  '/illustrations/Hand%20-%20Cell%20Phone%20OK.svg',
  '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
  '/illustrations/Speech%20Bubble.svg',
  '/illustrations/Party%20Popper.svg',
  '/illustrations/Heart%20-F%C3%A9lix.svg',
  '/illustrations/Fast.svg',
  '/illustrations/Magnifying%20Glass.svg',
  '/illustrations/Lock.svg',
  '/illustrations/Survey.svg',
  '/illustrations/F%C3%A9lix%20Illo%201.svg',
  '/illustrations/F%C3%A9lix%20Illo%202.svg',
]

/** Simple seeded PRNG so each slide gets a deterministic set of illustrations */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Precomputed positions for floating illustrations (4 corners + edges) */
const FLOAT_POSITIONS = [
  { top: '4%', left: '2%', rot: -12, anim: 'ds-float', dur: '8s', delay: '0s' },
  { top: '6%', right: '3%', rot: 6, anim: 'ds-drift', dur: '9s', delay: '1s' },
  { bottom: '12%', left: '4%', rot: 3, anim: 'ds-drift', dur: '10s', delay: '2s' },
  { bottom: '8%', right: '3%', rot: -6, anim: 'ds-float', dur: '7s', delay: '0.5s' },
]

function FloatingIllos({ slideIndex }: { slideIndex: number }) {
  const rand = seededRandom(slideIndex * 7919 + 31)
  // Shuffle pool and pick 3-4
  const shuffled = [...ILLUSTRATION_POOL].sort(() => rand() - 0.5)
  const count = 3 + Math.floor(rand() * 2) // 3 or 4
  const picks = shuffled.slice(0, count)

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {picks.map((src, i) => {
        const pos = FLOAT_POSITIONS[i % FLOAT_POSITIONS.length]
        const opacity = 0.06 + rand() * 0.08 // 0.06 – 0.14
        const size = 100 + Math.floor(rand() * 80) // 100 – 180px
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: pos.top,
              left: (pos as any).left,
              right: (pos as any).right,
              bottom: (pos as any).bottom,
              width: size,
              height: size,
              opacity,
              transform: `rotate(${pos.rot}deg)`,
              animation: `${pos.anim} ${pos.dur} ease-in-out infinite ${pos.delay}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full" style={{ pointerEvents: 'none' }} />
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*              ANCHOR ILLUSTRATION (from imageUrl)            */
/* ═══════════════════════════════════════════════════════════ */

/** Renders the slide's imageUrl as a prominent illustration anchored to the bottom-right or side */
function AnchorIllustration({ imageUrl, bg }: { imageUrl: string; bg: SlideData['bg'] }) {
  return (
    <div
      className="absolute bottom-[8%] right-[4%] pointer-events-none z-[1]"
      style={{ width: 200, height: 200 }}
    >
      <div style={{ opacity: bg === 'brand' ? 0.25 : 0.35 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="w-full h-full object-contain" style={{ pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

/** Chrome color tokens based on current slide bg */
function chromeColors(bg: SlideData['bg']) {
  const isBrand = bg === 'brand'
  const isDark = bg === 'dark'
  return {
    pillBg: isBrand ? 'bg-slate-950/20 border-slate-950/20' : isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border shadow-xs',
    pillText: isBrand ? 'text-slate-950/80' : isDark ? 'text-white/70' : 'text-foreground',
    hintText: isBrand ? 'text-slate-950/50' : isDark ? 'text-white/40' : 'text-muted-foreground',
    trackBg: isBrand ? 'bg-slate-950/10' : isDark ? 'bg-white/10' : 'bg-concrete/30',
    trackFill: isBrand ? 'bg-slate-950/60' : isDark ? 'bg-turquoise' : 'bg-evergreen',
    dotActive: isBrand ? 'bg-slate-950/70' : isDark ? 'bg-turquoise' : 'bg-evergreen',
    dotInactive: isBrand ? 'bg-slate-950/20 hover:bg-slate-950/30' : isDark ? 'bg-white/20 hover:bg-white/30' : 'bg-concrete hover:bg-concrete/70',
    btnCls: isBrand ? 'bg-slate-950/15 border-slate-950/15 hover:bg-slate-950/25' : isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md',
    btnIcon: isBrand ? 'text-slate-950/70' : isDark ? 'text-white/70' : 'text-foreground',
    closeBg: isBrand ? 'bg-slate-950/15 hover:bg-slate-950/25' : isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white/90 hover:bg-white',
    closeIcon: isBrand ? 'text-slate-950/70' : isDark ? 'text-white/70' : 'text-foreground',
  }
}

/* ═══════════════════════════════════════════════════════════ */
/*                    VIDEO EMBED                              */
/* ═══════════════════════════════════════════════════════════ */

function VideoEmbed({ videoUrl, bg }: { videoUrl: string; bg: SlideData['bg'] }) {
  // Normalize Google Drive URLs to embed format
  const embedSrc = videoUrl.includes('drive.google.com/file/d/')
    ? videoUrl.replace(/\/view(\?.*)?$/, '/preview').replace(/\/(edit|open)(\?.*)?$/, '/preview')
    : videoUrl

  return (
    <div className="flex-shrink-0 w-full max-w-[640px]">
      <div className={cn(
        'relative rounded-2xl overflow-hidden shadow-2xl border',
        bg === 'dark' ? 'border-white/10' : 'border-black/10'
      )}>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={embedSrc}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Embedded video"
          />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                    SLIDE FOOTER                            */
/* ═══════════════════════════════════════════════════════════ */

function SlideFooter({ num, total, bg, deckTitle }: { num: number; total: number; bg: SlideData['bg']; deckTitle: string }) {
  const c = bgClasses(bg)
  // Truncate long deck titles to keep footer clean
  const shortTitle = deckTitle.length > 50 ? deckTitle.slice(0, 47) + '…' : deckTitle
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={cn('font-display font-extrabold text-xs sm:text-sm max-w-[40%] truncate', c.text)}>{shortTitle}</span>
      <span className={cn('text-xs sm:text-sm absolute left-1/2 -translate-x-1/2', c.muted)}>felixpago.com</span>
      <span className={cn('text-xs sm:text-sm font-medium', c.text)}>{num} / {total}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                    BADGE PILL                              */
/* ═══════════════════════════════════════════════════════════ */

function Badge({ children, bg }: { children: React.ReactNode; bg: SlideData['bg'] }) {
  const cls = bg === 'dark'
    ? 'bg-turquoise/20 text-turquoise'
    : bg === 'brand'
      ? 'bg-slate-950/15 text-slate-950'
      : 'bg-turquoise text-slate-950'
  return (
    <span className={cn('inline-block rounded-full px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em]', cls)}>
      {children}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                 INDIVIDUAL SLIDE RENDERERS                 */
/* ═══════════════════════════════════════════════════════════ */

function SlideTitle({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      <div className="flex-1 flex items-center justify-center px-14 sm:px-20 lg:px-24 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-[1050px]">
          {/* Hero illustration — large and centered above the title */}
          {slide.imageUrl && (
            <div className="mb-6 lg:mb-8 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.imageUrl} alt="" className="w-full h-full object-contain" style={{ pointerEvents: 'none' }} />
            </div>
          )}
          {slide.badge && <div className="mb-5 lg:mb-6" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
          <h1 data-slide-field="title" className={cn('font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight', c.text)}>
            {parseBold(slide.title)}
          </h1>
          {slide.subtitle && (
            <p data-slide-field="subtitle" className={cn('mt-5 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl', c.muted)}>
              {parseBold(slide.subtitle)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function SlideSection({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      {slide.imageUrl && <AnchorIllustration imageUrl={slide.imageUrl} bg={slide.bg} />}
      <div className="flex-1 flex items-center justify-center px-14 sm:px-20 lg:px-24 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-[1050px]">
          {slide.badge && <div className="mb-6" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
          <h1 data-slide-field="title" className={cn('font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight', c.text)}>
            {parseBold(slide.title)}
          </h1>
          {slide.subtitle && (
            <p data-slide-field="subtitle" className={cn('mt-5 text-lg sm:text-xl lg:text-2xl leading-relaxed', c.muted)}>
              {parseBold(slide.subtitle)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function SlideContent({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  const hasEmbed = !!slide.embedUrl
  const hasVideo = !!slide.videoUrl
  const hasSidebar = hasEmbed || hasVideo

  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      {slide.imageUrl && !hasSidebar && <AnchorIllustration imageUrl={slide.imageUrl} bg={slide.bg} />}
      <div className={cn('flex-1 flex items-center py-10 relative z-10', hasSidebar ? 'px-10 sm:px-16 lg:px-20 gap-8 lg:gap-14' : 'px-14 sm:px-20 lg:px-24')}>
        <div className={cn('w-full', hasSidebar ? 'flex-1 min-w-0' : 'max-w-[1050px] mx-auto')}>
          {slide.badge && <div className="mb-6" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
          <h1 data-slide-field="title" className={cn('font-display font-black leading-[1.05] tracking-tight mb-6', c.text, hasSidebar ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-3xl sm:text-4xl lg:text-5xl')}>
            {parseBold(slide.title)}
          </h1>
          {slide.body && (
            <p data-slide-field="body" className={cn('leading-relaxed line-clamp-6', c.muted, hasSidebar ? 'text-base sm:text-lg lg:text-xl max-w-xl' : 'text-lg sm:text-xl lg:text-2xl max-w-3xl')}>
              {parseBold(slide.body)}
            </p>
          )}
        </div>
        {hasVideo && !hasEmbed && (
          <VideoEmbed videoUrl={slide.videoUrl!} bg={slide.bg} />
        )}
        {hasEmbed && (
          <div className="flex-shrink-0 flex items-center">
            <div className="relative">
              {/* Phone frame */}
              <div className={cn('rounded-[40px] border-[6px] overflow-hidden shadow-2xl', slide.bg === 'dark' ? 'border-white/10 bg-slate-900' : 'border-black/10 bg-white')}>
                {/* Notch */}
                <div className="relative">
                  <div className={cn('absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[26px] rounded-b-2xl z-10', slide.bg === 'dark' ? 'bg-slate-900' : 'bg-white')} />
                </div>
                <iframe
                  src={slide.embedUrl}
                  className="w-[320px] border-0"
                  style={{ height: '692px' }}
                  title={slide.title}
                />
              </div>
              {/* Home indicator */}
              <div className={cn('absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full', slide.bg === 'dark' ? 'bg-white/20' : 'bg-black/15')} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SlideBullets({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)

  // Detect day-based schedule pattern (e.g. "**Monday** — ..." or "**Day 1** — ...")
  // If all bullets start with bold text followed by a dash, render as column cards
  const isDaySchedule = slide.bullets && slide.bullets.length >= 3 && slide.bullets.length <= 7 &&
    slide.bullets.every(b => /^\*\*[^*]+\*\*\s*[—–-]/.test(b.text))

  if (isDaySchedule && slide.bullets) {
    // Parse each bullet into day heading + items
    const days = slide.bullets.map(b => {
      const match = b.text.match(/^\*\*([^*]+)\*\*\s*[—–-]\s*(.+)$/)
      if (!match) return { day: '', items: [b.text] }
      return {
        day: match[1],
        items: match[2].split(/[,;]\s*/).map(s => s.trim()).filter(Boolean),
      }
    })
    const gridCols = days.length <= 3 ? 'sm:grid-cols-3' : days.length <= 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-3 lg:grid-cols-6'

    return (
      <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
        <FloatingIllos slideIndex={slideIndex} />
        {slide.imageUrl && <AnchorIllustration imageUrl={slide.imageUrl} bg={slide.bg} />}
        <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
          <div className="w-full max-w-[1300px]">
            {slide.badge && <div className="mb-5 lg:mb-6 text-center" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
            <h1 data-slide-field="title" className={cn('font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center', c.text)}>
              {parseBold(slide.title)}
            </h1>
            <div data-slide-field="bullets" className={cn('grid grid-cols-1 gap-4', gridCols)}>
              {days.map((d, di) => (
                <div
                  key={di}
                  className={cn(
                    'rounded-xl p-5 border',
                    slide.bg === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-border shadow-sm',
                  )}
                >
                  <h3 className={cn('font-display font-extrabold text-base mb-4', c.text)}>{d.day}</h3>
                  <ul className="space-y-3">
                    {d.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full bg-evergreen flex-shrink-0 mt-2')} />
                        <span className={cn('text-sm leading-snug', c.muted)}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Standard bullet list layout
  const hasVideo = !!slide.videoUrl
  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      {slide.imageUrl && !hasVideo && <AnchorIllustration imageUrl={slide.imageUrl} bg={slide.bg} />}
      <div className={cn('flex-1 flex items-center py-10 relative z-10', hasVideo ? 'px-10 sm:px-16 lg:px-20 gap-8 lg:gap-14' : 'px-14 sm:px-20 lg:px-24')}>
        <div className={cn('w-full', hasVideo ? 'flex-1 min-w-0' : 'max-w-[1050px] mx-auto')}>
          {slide.badge && <div className="mb-6" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
          <h1 data-slide-field="title" className={cn('font-display font-black leading-[1.05] tracking-tight mb-8', c.text, hasVideo ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-3xl sm:text-4xl lg:text-5xl')}>
            {parseBold(slide.title)}
          </h1>
          {slide.bullets && (
            <ul data-slide-field="bullets" className="space-y-4 sm:space-y-5">
              {slide.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  {bullet.icon ? (
                    <span className="text-xl flex-shrink-0 mt-0.5">{bullet.icon}</span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-evergreen flex-shrink-0 mt-2.5" />
                  )}
                  <span className={cn('text-lg sm:text-xl lg:text-[22px] leading-snug', c.text)}>
                    {parseBold(bullet.text)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {hasVideo && <VideoEmbed videoUrl={slide.videoUrl!} bg={slide.bg} />}
      </div>
    </div>
  )
}

function SlideTwoColumn({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  const hasVideo = !!slide.videoUrl
  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      {/* Subtle background echo of the illustration */}
      {slide.imageUrl && !hasVideo && (
        <div className="absolute -bottom-8 -right-8 w-[200px] lg:w-[280px] opacity-[0.08] pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.imageUrl} alt="" className="w-full h-full" />
        </div>
      )}
      <div className="flex-1 flex items-center px-10 sm:px-14 lg:px-20 py-10 relative z-10">
        <div data-slide-field="columns" className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto items-center">
          {/* Left column — title area with inline illustration */}
          <div className="flex flex-col overflow-hidden">
            {slide.imageUrl && !slide.columns?.[0]?.body && !slide.body && !slide.quote && (
              <div className="mb-4 lg:mb-6 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[140px] lg:h-[140px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.imageUrl} alt="" className="h-full w-full object-contain" style={{ pointerEvents: 'none' }} />
              </div>
            )}
            {slide.badge && <div className="mb-4 lg:mb-5" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
            <h1 data-slide-field="title" className={cn('font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4 lg:mb-6', c.text)}>
              {parseBold(slide.title)}
            </h1>
            {slide.subtitle && (
              <p className={cn('text-xl sm:text-2xl lg:text-3xl leading-snug max-w-xl font-display font-black mb-2', c.text)}>
                {parseBoldAccent(slide.subtitle, slide.bg)}
              </p>
            )}
            {/* First column's body/content rendered as descriptive text under the title */}
            {slide.columns?.[0] && (
              <>
                {slide.columns[0].heading && (
                  <h2 className={cn('font-display font-bold text-sm uppercase tracking-widest mb-3', c.muted)}>{slide.columns[0].heading}</h2>
                )}
                {slide.columns[0].body && (
                  slide.quote ? (
                    <div className={cn(
                      'rounded-2xl p-5 sm:p-6 border mb-4',
                      slide.bg === 'dark' ? 'bg-white/5 border-white/10' :
                      slide.bg === 'brand' ? 'bg-white/90 border-slate-950/10 shadow-sm' :
                      'bg-white border-border shadow-sm',
                    )}>
                      {slide.columns[0].body.split('\n\n').map((para, pi) => (
                        <p key={pi} className={cn('text-base sm:text-lg leading-relaxed', pi > 0 && 'mt-3', c.muted)}>
                          {parseBold(para)}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className={cn('text-lg sm:text-xl leading-relaxed max-w-lg line-clamp-6', c.muted)}>
                      {parseBold(slide.columns[0].body)}
                    </p>
                  )
                )}
                {slide.columns[0].bullets && (
                  <ul className="mt-3 space-y-2">
                    {slide.columns[0].bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3">
                        {b.icon ? (
                          <span className="text-base flex-shrink-0 mt-0.5">{b.icon}</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-evergreen flex-shrink-0 mt-1.5" />
                        )}
                        <span className={cn('text-base sm:text-lg leading-snug', c.text)}>
                          {parseBold(b.text)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {/* Fallback: render slide.body when columns[0] doesn't have body */}
            {!slide.columns?.[0]?.body && slide.body && (
              <p className={cn('text-lg sm:text-xl leading-relaxed max-w-lg', c.muted)}>
                {parseBold(slide.body)}
              </p>
            )}
            {/* Fallback: render slide.bullets when columns[0] doesn't have bullets */}
            {!slide.columns?.[0]?.bullets && slide.bullets && (() => {
              // Split bullets into stat-style (short "**LABEL: VALUE**") and narrative
              const statPattern = /^\*\*(.+?):\s*(.+?)\*\*\s*[—–-]\s*(.+)$/
              const statBullets = slide.bullets!.filter(b => statPattern.test(b.text))
              const narrativeBullets = slide.bullets!.filter(b => !statPattern.test(b.text))
              return (
                <div className="mt-4 space-y-3">
                  {statBullets.length >= 2 && (
                    <div className={cn('grid gap-3', statBullets.length === 3 ? 'grid-cols-3' : statBullets.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4')}>
                      {statBullets.map((b, j) => {
                        const m = b.text.match(statPattern)!
                        return (
                          <div key={j} className={cn(
                            'rounded-xl p-4 border',
                            slide.bg === 'dark' ? 'bg-white/5 border-white/10' :
                            slide.bg === 'brand' ? 'bg-slate-950/10 border-slate-950/10' :
                            'bg-white border-border shadow-sm',
                          )}>
                            <span className={cn('text-[9px] font-bold uppercase tracking-wider', c.muted)}>{m[1]}</span>
                            <div className={cn('font-display font-black text-2xl leading-tight mt-0.5', c.text)}>{m[2]}</div>
                            <div className={cn('text-[10px] mt-1', c.muted)}>{m[3]}</div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {narrativeBullets.map((b, j) => (
                    <div key={j} className={cn(
                      'rounded-xl p-4 border',
                      slide.bg === 'dark' ? 'bg-white/5 border-white/10' :
                      slide.bg === 'brand' ? 'bg-slate-950/10 border-slate-950/10' :
                      'bg-white border-border shadow-sm',
                    )}>
                      <p className={cn('text-sm leading-relaxed', c.muted)}>
                        {parseBold(b.text)}
                      </p>
                    </div>
                  ))}
                </div>
              )
            })()}
            {/* Pull quote below body */}
            {slide.quote && (
              <div className="relative pl-5 border-l-4 border-papaya mt-1">
                <p className={cn('text-lg sm:text-xl font-display font-extrabold leading-snug', c.text)}>
                  {parseBold(slide.quote.text)}
                </p>
                {slide.quote.attribution && (
                  <p className={cn('text-sm mt-2', c.muted)}>— {slide.quote.attribution}</p>
                )}
              </div>
            )}
          </div>

          {/* Right column — embed, video, chart, or card panel */}
          {slide.embedUrl ? (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className={cn('rounded-[40px] border-[6px] overflow-hidden shadow-2xl', slide.bg === 'dark' ? 'border-white/10 bg-slate-900' : 'border-black/10 bg-white')}>
                  <div className="relative">
                    <div className={cn('absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[26px] rounded-b-2xl z-10', slide.bg === 'dark' ? 'bg-slate-900' : 'bg-white')} />
                  </div>
                  <iframe src={slide.embedUrl} className="w-[320px] border-0" style={{ height: '692px' }} title={slide.title} />
                </div>
                <div className={cn('absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full', slide.bg === 'dark' ? 'bg-white/20' : 'bg-black/15')} />
              </div>
            </div>
          ) : hasVideo ? (
            <div className="flex items-center justify-center">
              <VideoEmbed videoUrl={slide.videoUrl!} bg={slide.bg} />
            </div>
          ) : !slide.columns?.[1]?.heading && !slide.columns?.[1]?.body && !slide.columns?.[1]?.bullets && slide.chart ? (
            /* When no right column content but chart exists, render chart */
            <div className="flex flex-col justify-center">
              <div data-slide-field="chart" className="w-full max-h-[55vh]">
                <SlideChartViz chart={slide.chart} dark={slide.bg === 'dark'} />
              </div>
            </div>
          ) : slide.columns?.[1] && (() => {
            const col = slide.columns![1]
            const hasMeta = !!(col.heading || col.body)
            // Numbered bullet pattern: "**01 — Title:** body" → render as separate cards
            const isNumberedCards = !hasMeta && col.bullets?.every(b => /^\*\*\d{2}\s/.test(b.text))

            if (isNumberedCards && col.bullets) {
              return (
                <div className="flex flex-col justify-center gap-4">
                  {col.bullets.map((b, j) => {
                    // Parse "**01 — Title:** body" or "**01 — Title:** body"
                    const m = b.text.match(/^\*\*(\d{2})\s*[—–-]\s*(.+?):\*\*\s*(.+)$/)
                    const num = m?.[1] ?? String(j + 1).padStart(2, '0')
                    const heading = m?.[2] ?? ''
                    const body = m?.[3] ?? b.text
                    return (
                      <div
                        key={j}
                        className={cn(
                          'rounded-2xl p-5 sm:p-6 flex gap-4 border animate-in slide-in-from-right-8 fade-in duration-700',
                          slide.bg === 'dark' ? 'bg-white/[0.04] border-white/10' :
                          slide.bg === 'brand' ? 'bg-white/90 border-slate-950/10 shadow-sm' :
                          'bg-white border-border shadow-sm',
                        )}
                        style={{ animationDelay: `${j * 150}ms`, animationFillMode: 'both' }}
                      >
                        <span className={cn('font-display font-black text-3xl leading-none flex-shrink-0 mt-0.5', c.accent)}>{num}</span>
                        <div>
                          {heading && <h3 className={cn('font-display font-extrabold text-base mb-1', c.text)}>{heading}</h3>}
                          <p className={cn('text-sm leading-relaxed', c.muted)}>{body}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }

            // Stat bullet pattern: "**STAT** — Label (sub)" → separate stat cards with colored numbers
            const isStatCards = !hasMeta && col.bullets?.every(b => /^\*\*[^*]+\*\*\s*[—–-]\s*.+/.test(b.text))

            if (isStatCards && col.bullets) {
              const statColors = ['#F26629', '#F19D38', '#6060BF', '#7BA882', '#2BF2F1', '#60D06F']
              return (
                <div className="flex flex-col justify-center gap-4">
                  {col.bullets.map((b, j) => {
                    const m = b.text.match(/^\*\*(.+?)\*\*\s*[—–-]\s*(.+?)(?:\s*\((.+)\))?$/)
                    const stat = m?.[1] ?? ''
                    const label = m?.[2] ?? b.text
                    const sub = m?.[3] ?? ''
                    const color = statColors[j % statColors.length]
                    return (
                      <div
                        key={j}
                        className={cn(
                          'rounded-2xl p-5 flex gap-4 items-start border animate-in slide-in-from-right-8 fade-in duration-700',
                          slide.bg === 'dark' ? 'bg-white/5 border-white/10' :
                          slide.bg === 'brand' ? 'bg-white/90 border-slate-950/10 shadow-sm' :
                          'bg-white border-border shadow-sm',
                        )}
                        style={{ animationDelay: `${j * 150}ms`, animationFillMode: 'both' }}
                      >
                        <div className="font-display font-black text-3xl sm:text-4xl leading-none flex-shrink-0 mt-0.5" style={{ color }}>{stat}</div>
                        <div>
                          <p className={cn('font-semibold text-sm sm:text-base leading-snug', c.text)}>{label}</p>
                          {sub && <p className={cn('text-xs mt-0.5', c.muted)}>{sub}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }

            // Default: single card wrapping all content
            return (
              <div className={cn(
                'rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 border',
                slide.bg === 'dark' ? 'bg-white/5 border-white/10' :
                slide.bg === 'brand' ? 'bg-white/90 border-slate-950/10 shadow-sm' :
                'bg-white border-border shadow-sm',
              )}>
                {col.heading && (
                  <h2 className={cn('font-display font-bold text-sm uppercase tracking-widest mb-5', c.muted)}>{col.heading}</h2>
                )}
                {col.body && (
                  <p className={cn('text-lg sm:text-xl leading-relaxed mb-5', c.text)}>
                    {parseBold(col.body)}
                  </p>
                )}
                {col.bullets && (
                  <ul className="space-y-3">
                    {col.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3">
                        {b.icon === '✓' || b.icon === '✗' ? (
                          <span className={cn('flex-shrink-0 mt-0.5', b.icon === '✓' ? c.accent : c.muted)}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              {b.icon === '✓' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              )}
                            </svg>
                          </span>
                        ) : b.icon ? (
                          <span className="text-base flex-shrink-0 mt-0.5">{b.icon}</span>
                        ) : (
                          <span className={cn('flex-shrink-0 mt-0.5', c.accent)}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        )}
                        <span className={cn('text-base sm:text-lg leading-snug', c.text)}>
                          {parseBold(b.text)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

/** Determine if a hex color is "light" (luminance > 0.4) */
function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '')
  if (c.length < 6) return true
  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  return lum > 0.4
}

/** Card background palettes cycling through brand colors */
const BRAND_COLORS = ['#2BF2F1', '#6060BF', '#60D06F', '#F19D38', '#F26629', '#7BA882']

const CARD_BG_CYCLE = [
  '#082422',  // slate (dark)
  '#2BF2F1',  // turquoise (light)
  '#35605F',  // evergreen (dark)
  '#EFEBE7',  // stone (light)
  '#2BF2F1',  // turquoise (light)
  '#082422',  // slate (dark)
]

/** Illustrations assigned to cards by position */
const CARD_ILLUSTRATIONS = [
  '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
  '/illustrations/Fast.svg',
  '/illustrations/Heart%20-F%C3%A9lix.svg',
  '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
  '/illustrations/ray.svg',
  '/illustrations/Magnifying%20Glass.svg',
  '/illustrations/Hand%20-%20Stars.svg',
  '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
  '/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg',
  '/illustrations/Cloud%20Coin%20-%20Turquoise.svg',
]

/** Compute fanned card positions for N cards */
function computeFanPositions(count: number) {
  const positions: { rot: number; tx: number; ty: number }[] = []
  const maxRot = count <= 3 ? 8 : count <= 4 ? 10 : 14
  const spacing = count <= 3 ? 240 : count <= 4 ? 200 : count <= 6 ? 220 : 180
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1 // -1 to 1
    positions.push({
      rot: t * maxRot,
      tx: t * spacing * (count / 2),
      ty: Math.abs(t) * 24,
    })
  }
  return positions
}

function SlideCards({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const cardCount = slide.cards?.length ?? 0

  // Fanned card layout ONLY for "values" slides (title must contain "values" or "value").
  // Everything else uses the clean grid layout.
  const isValuesSlide = /\bvalues?\b/i.test(slide.title)
  const useFan = isValuesSlide && cardCount >= 3 && cardCount <= 6

  if (!useFan) {
    // Clean grid layout (toolkit-style from jose deck)
    const gridCols = cardCount <= 2 ? 'lg:grid-cols-2'
      : cardCount === 3 ? 'lg:grid-cols-3'
      : cardCount === 4 ? 'sm:grid-cols-2 lg:grid-cols-2'
      : cardCount <= 6 ? 'sm:grid-cols-2 lg:grid-cols-3'
      : 'sm:grid-cols-2 lg:grid-cols-4'
    return (
      <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
        <FloatingIllos slideIndex={slideIndex} />
        {slide.imageUrl && <AnchorIllustration imageUrl={slide.imageUrl} bg={slide.bg} />}
        <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
          <div className="w-full max-w-[1100px]">
            {slide.badge && <div className="mb-5 lg:mb-6 text-center" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
            <h1 data-slide-field="title" className={cn('font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center', c.text)}>
              {parseBold(slide.title)}
            </h1>
            {slide.subtitle && (
              <p data-slide-field="subtitle" className={cn('text-base sm:text-lg leading-relaxed mb-8 -mt-4 text-center max-w-2xl mx-auto', c.muted)}>
                {parseBold(slide.subtitle)}
              </p>
            )}
            {slide.cards && (
              <div data-slide-field="cards" className={cn('grid grid-cols-1 gap-4', gridCols)}>
                {slide.cards.map((card, i) => {
                  // Detect phase-style titles like "Days 1-30: Immerse"
                  const phaseMatch = card.title.match(/^(Days?\s+\d[\d\s–—-]*\d*)\s*[:–—-]\s*(.+)$/i)
                  const accentColor = card.titleColor || BRAND_COLORS[i % BRAND_COLORS.length]

                  // Parse body into list items if it contains bullets or newline-separated items
                  const bodyLines = card.body
                    ? card.body.split(/\n/).map(l => l.replace(/^[\s]*[•\-\*]\s*/, '').trim()).filter(Boolean)
                    : []
                  const isList = card.body && (
                    /[•\-\*]\s/.test(card.body) ||
                    bodyLines.length >= 2
                  )

                  return (
                    <div
                      key={i}
                      className={cn(
                        'rounded-2xl p-7 sm:p-8 border',
                        slide.bg === 'dark' ? 'bg-white/5 border-white/10' :
                        slide.bg === 'brand' ? 'bg-white/90 border-slate-950/10 shadow-sm' :
                        'bg-white border-border shadow-sm',
                      )}
                    >
                      {phaseMatch ? (
                        <>
                          <span
                            className="inline-block rounded-full px-4 py-1 text-sm font-semibold text-slate-950 mb-4"
                            style={{ background: accentColor }}
                          >
                            {phaseMatch[1]}
                          </span>
                          <h3 className={cn('font-display font-extrabold text-2xl lg:text-3xl leading-snug mb-5', c.text)}>
                            {parseBold(phaseMatch[2])}
                          </h3>
                        </>
                      ) : (
                        <h3
                          className={cn('font-display font-extrabold text-lg leading-snug mb-3', c.text)}
                          style={card.titleColor ? { color: card.titleColor } : undefined}
                        >
                          {parseBold(card.title)}
                        </h3>
                      )}
                      {isList ? (
                        <ul className="space-y-3">
                          {bodyLines.map((item, j) => (
                            <li key={j} className="flex items-start gap-3">
                              <CheckCircle2
                                className="h-5 w-5 flex-shrink-0 mt-0.5 opacity-40"
                                strokeWidth={1.5}
                                style={{ color: accentColor }}
                              />
                              <span className={cn('text-base leading-snug', c.muted)}>
                                {parseBold(item)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={cn('text-sm leading-relaxed', c.muted)}>
                          {parseBold(card.body)}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Fanned card layout (jose-style)
  const positions = computeFanPositions(cardCount)

  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      {slide.imageUrl && <AnchorIllustration imageUrl={slide.imageUrl} bg={slide.bg} />}

      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 pb-32 relative z-10">
        {slide.badge && <div className="mb-6"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
        <h1 data-slide-field="title" className={cn('font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 sm:mb-8 lg:mb-10 text-center', c.text)}>
          {parseBold(slide.title)}
        </h1>
        {slide.subtitle && (
          <p data-slide-field="subtitle" className={cn('text-base sm:text-lg leading-relaxed mb-6 text-center max-w-2xl', c.muted)}>
            {parseBold(slide.subtitle)}
          </p>
        )}

        <div className="relative flex items-center justify-center" style={{ width: '100%', height: 420 }}>
          {slide.cards!.map((card, i) => {
            const isActive = activeCard === i
            const pos = positions[i]
            const cardBg = CARD_BG_CYCLE[i % CARD_BG_CYCLE.length]
            const light = isLightColor(cardBg)
            const textColor = light ? '#082422' : '#ffffff'
            const mutedColor = light ? 'rgba(8,36,34,0.6)' : 'rgba(255,255,255,0.6)'
            const numColor = light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'
            const num = String(i + 1).padStart(2, '0')
            const illo = CARD_ILLUSTRATIONS[i % CARD_ILLUSTRATIONS.length]

            const baseTransform = `rotate(${pos.rot}deg) translateX(${pos.tx}px) translateY(${pos.ty}px)`
            const activeTransform = `rotate(${pos.rot * 0.3}deg) translateX(${pos.tx}px) translateY(${pos.ty - 30}px) scale(1.05)`

            return (
              <div
                key={i}
                className="absolute cursor-pointer"
                style={{
                  width: 260,
                  height: 390,
                  transform: isActive ? activeTransform : baseTransform,
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, filter 0.3s ease',
                  zIndex: isActive ? 50 : 10 + i,
                  filter: !isActive && activeCard !== null ? 'brightness(0.92)' : 'none',
                }}
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div
                  className="h-full w-full rounded-2xl p-6 flex flex-col overflow-hidden relative"
                  style={{
                    background: cardBg,
                    boxShadow: isActive
                      ? '0 20px 40px -8px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)'
                      : '0 8px 24px -4px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Number + illustration overlay */}
                  <div className="relative h-[140px] mb-2">
                    <span
                      className="absolute inset-0 flex items-center justify-center font-display font-black text-[130px] leading-none select-none pointer-events-none"
                      style={{ color: numColor }}
                    >
                      {num}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={illo} alt="" className="w-28 h-28" style={{ pointerEvents: 'none' }} />
                    </div>
                  </div>

                  <h3
                    className="relative z-10 font-display font-black text-xl leading-tight mb-4"
                    style={{ color: textColor }}
                  >
                    {parseBold(card.title)}
                  </h3>

                  <div className="relative z-10 flex-1 flex flex-col gap-2.5">
                    {card.body.split(/\\n|\n/).map((line, li) => (
                      <p key={li} className="text-sm leading-snug" style={{ color: mutedColor }}>
                        {parseBold(line)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SlideQuote({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      {slide.imageUrl && <AnchorIllustration imageUrl={slide.imageUrl} bg={slide.bg} />}
      <div className="flex-1 flex items-center justify-center px-14 sm:px-20 lg:px-24 py-10 relative z-10">
        <div className="max-w-[900px] text-center">
          {slide.badge && <div className="mb-6"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
          {slide.quote && (
            <>
              <blockquote data-slide-field="quote" className={cn('font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-snug italic', c.text)}>
                &ldquo;{parseBold(slide.quote.text)}&rdquo;
              </blockquote>
              {slide.quote.attribution && (
                <p className={cn('mt-6 sm:mt-8 text-base sm:text-lg', c.muted)}>
                  &mdash; {slide.quote.attribution}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SlideImage({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      <div className="flex-1 flex items-center px-14 sm:px-20 lg:px-24 py-10 relative z-10">
        <div className="w-full max-w-[1050px] mx-auto flex flex-col items-center">
          {slide.badge && <div className="mb-6"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
          <h1 className={cn('font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight mb-8 text-center', c.text)}>
            {parseBold(slide.title)}
          </h1>
          {slide.imageUrl && (
            <div className="w-full max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageUrl}
                alt={slide.imageCaption ?? slide.title}
                className="w-full h-auto object-contain max-h-[40vh]"
              />
              {slide.imageCaption && (
                <p className={cn('mt-4 text-sm sm:text-base text-center', c.muted)}>
                  {slide.imageCaption}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SlideChecklist({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />
      {slide.imageUrl && <AnchorIllustration imageUrl={slide.imageUrl} bg={slide.bg} />}
      <div className="flex-1 flex items-center px-14 sm:px-20 lg:px-24 py-10 relative z-10">
        <div className="w-full max-w-[1050px] mx-auto">
          {slide.badge && <div className="mb-6" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
          <h1 data-slide-field="title" className={cn('font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight mb-8', c.text)}>
            {parseBold(slide.title)}
          </h1>
          {slide.bullets && (
            <ul data-slide-field="bullets" className="space-y-4 sm:space-y-5">
              {slide.bullets.map((item, i) => {
                const isCheck = item.icon !== 'x'
                return (
                  <li key={i} className="flex items-start gap-3.5">
                    <span className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-sm font-bold',
                      isCheck
                        ? slide.bg === 'dark' ? 'bg-turquoise/20 text-turquoise' : 'bg-evergreen/15 text-evergreen'
                        : slide.bg === 'dark' ? 'bg-white/10 text-white/40' : 'bg-foreground/10 text-foreground/40',
                    )}>
                      {isCheck ? '\u2713' : '\u2717'}
                    </span>
                    <span className={cn('text-lg sm:text-xl lg:text-[22px] leading-snug', c.text)}>
                      {parseBold(item.text)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function SlideClosing({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  // Parse subtitle into resource badges (split by · or comma)
  const resourceBadges = slide.subtitle
    ? slide.subtitle.split(/\s*[·|,]\s*/).map(s => s.trim()).filter(Boolean)
    : []
  const hasResourceBadges = resourceBadges.length > 1 // Only show as badges if there are multiple items

  return (
    <div className={cn('h-full w-full flex flex-col relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />

      <div className="flex-1 flex items-center justify-center px-14 sm:px-20 lg:px-24 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-[1050px]">
          {/* Hero illustration — centered with radial mask for cinematic feel */}
          {slide.imageUrl && (
            <div
              className="mb-6 lg:mb-8 w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] lg:w-[220px] lg:h-[220px]"
              style={{
                mask: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 70%)',
                WebkitMask: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 70%)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.imageUrl} alt="" className="w-full h-full object-contain" style={{ pointerEvents: 'none' }} />
            </div>
          )}
          {slide.badge && <div className="mb-6" data-slide-field="badge"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
          <h1 data-slide-field="title" className={cn('font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight', c.text)}>
            {parseBold(slide.title)}
          </h1>
          {slide.body && (
            <p data-slide-field="body" className={cn('mt-5 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl line-clamp-5', c.muted)}>
              {parseBold(slide.body)}
            </p>
          )}
          {/* Resource badges (parsed from subtitle) */}
          {hasResourceBadges ? (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {resourceBadges.map((badge, i) => (
                <span
                  key={i}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border',
                    slide.bg === 'dark'
                      ? 'bg-turquoise/10 border-turquoise/20 text-turquoise'
                      : slide.bg === 'brand'
                        ? 'bg-slate-950/10 border-slate-950/15 text-slate-950/70'
                        : 'bg-evergreen/10 border-evergreen/20 text-evergreen',
                  )}
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : slide.subtitle && (
            <p className={cn('mt-5 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl', c.muted)}>
              {parseBold(slide.subtitle)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     CHART SLIDE                            */
/* ═══════════════════════════════════════════════════════════ */

function SlideChart({ slide, slideIndex }: { slide: SlideData; slideIndex: number }) {
  const c = bgClasses(slide.bg)
  return (
    <div className={cn('h-full w-full flex relative overflow-hidden', c.container)}>
      <FloatingIllos slideIndex={slideIndex} />

      {/* Left side: title + description */}
      <div className="w-[35%] flex flex-col justify-center pl-14 sm:pl-20 lg:pl-24 pr-6 py-10 relative z-10 shrink-0">
        {slide.badge && <div className="mb-4"><Badge bg={slide.bg}>{slide.badge}</Badge></div>}
        <h2 data-slide-field="title" className={cn('font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight mb-4', c.text)}>
          {parseBold(slide.title)}
        </h2>
        {slide.body && (
          <p data-slide-field="body" className={cn('text-sm sm:text-base leading-relaxed line-clamp-4', c.muted)}>
            {parseBold(slide.body)}
          </p>
        )}
        {slide.bullets && slide.bullets.length > 0 && (
          <ul data-slide-field="bullets" className="mt-4 space-y-2">
            {slide.bullets.map((b, i) => (
              <li key={i} className={cn('flex items-start gap-2 text-sm', c.muted)}>
                {b.icon && <span className="shrink-0 mt-0.5">{b.icon}</span>}
                <span>{parseBold(b.text)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right side: chart */}
      <div className="flex-1 flex items-center justify-center pl-4 pr-14 sm:pr-20 lg:pr-24 py-10 relative z-10">
        {slide.chart ? (
          <div data-slide-field="chart" className="w-full h-full max-h-[55vh]">
            <SlideChartViz chart={slide.chart} dark={slide.bg === 'dark'} />
          </div>
        ) : (
          <div className={cn('text-sm', c.muted)}>No chart data</div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                   SLIDE DISPATCHER                         */
/* ═══════════════════════════════════════════════════════════ */

const SLIDE_COMPONENTS: Record<SlideData['type'], React.FC<{ slide: SlideData; slideIndex: number }>> = {
  title: SlideTitle,
  section: SlideSection,
  content: SlideContent,
  bullets: SlideBullets,
  'two-column': SlideTwoColumn,
  cards: SlideCards,
  quote: SlideQuote,
  image: SlideImage,
  checklist: SlideChecklist,
  closing: SlideClosing,
  chart: SlideChart,
}

/* ═══════════════════════════════════════════════════════════ */
/*                  MAIN SLIDE RENDERER                       */
/* ═══════════════════════════════════════════════════════════ */

export function SlideRenderer({ slides: rawSlides, title, deckId, onClose, forceSlide, topRightExtra, topLeftExtra, hideCloseButton, document: rawDoc, outline, onViewModeChange, onShare, onEdit, editActive, onSlidesChange, onDocumentChange, onOutlineChange, onRebuild, initialViewMode, onViewModeChanged, shareToken, translations, onGenerateDocument, isGeneratingDocument, documentGenFailed, ratingSource, sharePermission, onSlideRegenerate, regeneratingSlide, documentEditPanel, outlineEditPanel, onSelectionAIEdit, sectionFiles, onSectionFilesChange }: SlideRendererProps) {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)
  const brandColors = useBrandColors()

  /* ── Hover zone (top 10% of viewport) ── */
  const [hoverTop, setHoverTopRaw] = useState(false)
  const hoverLockRef = useRef(false)
  const setHoverTop = useCallback((v: boolean) => {
    if (!v && hoverLockRef.current) return // Don't hide while a dropdown is open
    setHoverTopRaw(v)
  }, [])
  const lockHover = useCallback((locked: boolean) => { hoverLockRef.current = locked; if (locked) setHoverTopRaw(true) }, [])

  /* ── Idle detection — hide arrows after 4s of inactivity ── */
  const [idle, setIdle] = useState(false)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resetIdle = useCallback(() => {
    setIdle(false)
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setIdle(true), 4000)
  }, [])
  useEffect(() => {
    resetIdle()
    const onActivity = () => resetIdle()
    window.addEventListener('mousemove', onActivity)
    window.addEventListener('keydown', onActivity)
    window.addEventListener('touchstart', onActivity)
    return () => {
      window.removeEventListener('mousemove', onActivity)
      window.removeEventListener('keydown', onActivity)
      window.removeEventListener('touchstart', onActivity)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [resetIdle])

  /* ── View mode (presentation / outline / document) ── */
  const [viewMode, setViewModeRaw] = useState<ViewMode>(initialViewMode ?? 'presentation')
  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeRaw(mode)
    onViewModeChanged?.(mode)
  }, [onViewModeChanged])

  /* ── TOC state ── */
  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const [tocEditMode, setTocEditMode] = useState(false)

  // Reset TOC edit mode when TOC closes
  useEffect(() => { if (!tocOpen) setTocEditMode(false) }, [tocOpen])

  /* ── Locale / translation ── */
  const { locale, setLocale } = useLocale()

  // If pre-computed translations exist, apply them at the data level (instant)
  // Otherwise fall back to the DOM-based translation hook
  const hasPreTranslations = !!(translations && locale !== 'en-US' && translations[locale])
  const slides: SlideData[] = useMemo(() => {
    if (hasPreTranslations && translations![locale]) {
      return applyTranslations(rawSlides, translations![locale]) as SlideData[]
    }
    return rawSlides
  }, [rawSlides, locale, hasPreTranslations, translations])
  const doc = useMemo(() => {
    if (hasPreTranslations && translations![locale] && rawDoc) {
      return applyDocumentTranslations(rawDoc, translations![locale])
    }
    return rawDoc
  }, [rawDoc, locale, hasPreTranslations, translations])

  // Fall back to DOM-based translation only when no pre-computed translations
  useSlideTranslation(slideRef, hasPreTranslations ? 'en-US' : locale, current)

  const total = slides.length

  /* ── PDF export ── */
  const { progress: pdfProgress, download: downloadPdf, downloadView: downloadViewPdf, cancel: cancelPdf } = useSlidePdf(`${title || 'presentation'}.pdf`)

  /* ── Comments ── */
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments(deckId)


  /* ── Viewer dwell-time beacon (shared presentations only) ── */
  const beaconSessionId = useRef(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))
  const dwellStart = useRef(Date.now())
  const sessionStart = useRef(Date.now())
  const slidesViewed = useRef(new Set<number>())
  const prevSlideForBeacon = useRef(0)

  useEffect(() => {
    if (!shareToken) return
    // Send beacon for the previous slide when navigating
    const prevIdx = prevSlideForBeacon.current
    const dwellMs = Date.now() - dwellStart.current
    if (dwellMs > 500) {
      try {
        navigator.sendBeacon('/api/studio/analytics', JSON.stringify({
          type: 'beacon',
          beacon: {
            shareToken,
            slideIndex: prevIdx,
            dwellMs,
            action: 'view',
            sessionId: beaconSessionId.current,
            timestamp: Math.floor(Date.now() / 1000),
          },
        }))
      } catch { /* sendBeacon may not be available */ }
    }
    dwellStart.current = Date.now()
    slidesViewed.current.add(current)
    prevSlideForBeacon.current = current
  }, [current, shareToken])

  useEffect(() => {
    if (!shareToken) return
    slidesViewed.current.add(0) // initial slide
    const handleUnload = () => {
      // Send final dwell beacon
      const dwellMs = Date.now() - dwellStart.current
      if (dwellMs > 500) {
        try {
          navigator.sendBeacon('/api/studio/analytics', JSON.stringify({
            type: 'beacon',
            beacon: { shareToken, slideIndex: current, dwellMs, action: 'exit', sessionId: beaconSessionId.current, timestamp: Math.floor(Date.now() / 1000) },
          }))
        } catch {}
      }
      // Send session summary
      try {
        navigator.sendBeacon('/api/studio/analytics', JSON.stringify({
          type: 'session_end',
          session: {
            sessionId: beaconSessionId.current,
            shareToken,
            startedAt: Math.floor(sessionStart.current / 1000),
            endedAt: Math.floor(Date.now() / 1000),
            slidesViewed: slidesViewed.current.size,
            totalSlides: total,
            totalDwellMs: Date.now() - sessionStart.current,
            completed: slidesViewed.current.size >= total * 0.8,
          },
        }))
      } catch {}
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [shareToken, total]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Derived data for TOC ── */
  const slideMeta: SlideMeta[] = useMemo(() =>
    slides.map((s) => ({ title: s.title, subtitle: s.badge })),
  [slides])

  const darkSlideSet = useMemo(() => {
    const set = new Set<number>()
    slides.forEach((s, i) => { if (s.bg === 'dark') set.add(i) })
    return set
  }, [slides])

  const slideComponents = useMemo(() =>
    slides.map((s, i) => {
      const Comp = SLIDE_COMPONENTS[s.type] ?? SlideContent
      return () => <Comp slide={s} slideIndex={i} />
    }),
  [slides])

  useEffect(() => {
    setMounted(true)
    const hash = window.location.hash
    if (hash) {
      const n = parseInt(hash.replace('#slide-', ''), 10)
      if (!isNaN(n) && n >= 0 && n < total) setCurrent(n)
    }
  }, [total])

  /* Honor forceSlide from parent (e.g. during streaming) */
  useEffect(() => {
    if (forceSlide !== undefined && forceSlide >= 0 && forceSlide < total) {
      setCurrent(forceSlide)
    }
  }, [forceSlide, total])

  useEffect(() => {
    if (mounted) window.history.replaceState(null, '', `#slide-${current}`)
  }, [current, mounted])

  const next = useCallback(() => setCurrent((p) => Math.min(p + 1, total - 1)), [total])
  const prev = useCallback(() => setCurrent((p) => Math.max(p - 1, 0)), [])

  /* Keyboard navigation */
  useEffect(() => {
    if (!mounted) return
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'Escape') { e.preventDefault(); if (viewMode !== 'presentation') { setViewMode('presentation'); onViewModeChange?.('presentation') } else if (commentMode) { setCommentMode(false) } else if (tocOpen) { setTocOpen(false) } else { onClose?.() }; return }
      // Only capture navigation keys in presentation mode — document/outline need them for text editing
      if (viewMode !== 'presentation') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      else if (e.key === 'Home') { e.preventDefault(); setCurrent(0) }
      else if (e.key === 'End') { e.preventDefault(); setCurrent(total - 1) }
      else if (e.key === 'c' || e.key === 'C') { setCommentMode(!commentMode) }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [mounted, total, next, prev, onClose, tocOpen, commentMode, setCommentMode, viewMode, onViewModeChange])

  /* Touch navigation */
  const [touchX, setTouchX] = useState<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => setTouchX(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return
    const diff = touchX - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    setTouchX(null)
  }

  if (slides.length === 0) return null

  // Clamp current index to valid range (avoids crash during streaming when slide count changes)
  const safeCurrent = Math.min(current, slides.length - 1)
  const slide = slides[safeCurrent]
  const chrome = chromeColors(slide.bg)
  const SlideComponent = SLIDE_COMPONENTS[slide.type] ?? SlideContent
  const chromeProps: ChromeColors = { btnCls: chrome.btnCls, btnIcon: chrome.btnIcon, pillBg: chrome.pillBg, pillText: chrome.pillText, hoverTop, lockHover }

  const topLeftContent = topLeftExtra
    ? typeof topLeftExtra === 'function' ? topLeftExtra(chromeProps) : topLeftExtra
    : null

  const topRightContent = topRightExtra
    ? typeof topRightExtra === 'function' ? topRightExtra(chromeProps) : topRightExtra
    : null

  return (
    <>
    {/* Centered view mode toggle — rendered outside the overflow-hidden slide container */}
    <div
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[190] transition-opacity duration-200"
      style={{ opacity: hoverTop || viewMode !== 'presentation' ? 1 : 0, pointerEvents: hoverTop || viewMode !== 'presentation' ? 'auto' : 'none' }}
      onMouseEnter={() => setHoverTop(true)}
      onMouseLeave={() => setHoverTop(false)}
      onMouseEnter={() => setHoverTop(true)}
      onMouseLeave={() => setHoverTop(false)}
    >
      <ViewModeToggle
        mode={viewMode}
        onModeChange={(m) => {
          setViewMode(m)
          if (m === 'presentation' && tocOpen) setTocOpen(false)
          onViewModeChange?.(m)
        }}
        hasDocument={!!doc}
        onGenerateDocument={onGenerateDocument ? () => {
          const result = onGenerateDocument()
          if (result === false) return
          setViewMode('document')
          onViewModeChange?.('document')
        } : undefined}
        isGeneratingDocument={isGeneratingDocument}
      />
    </div>

    {/* Outline overlay */}
    {viewMode === 'outline' && (
      <OutlineView
        slides={slides}
        currentSlide={safeCurrent}
        onGoToSlide={(i) => { setCurrent(i); setViewMode('presentation'); onViewModeChange?.('presentation') }}
        onSlidesChange={onSlidesChange}
        onRebuild={onRebuild}
        onExit={onClose}
        commentActions={{ comments, addComment, deleteComment, editComment, addReply, deleteReply, flagComment, resolveComment }}
        commentMode={commentMode}
        locale={locale}
        outline={outline}
        onOutlineChange={onOutlineChange}
        onAIEdit={onSelectionAIEdit}
        editPanel={outlineEditPanel}
        sectionFiles={sectionFiles}
        onSectionFilesChange={onSectionFilesChange}
      />
    )}

    {/* Document overlay */}
    {viewMode === 'document' && (
      doc ? (
        <DocumentView
          document={doc}
          slides={slides}
          onGoToSlide={(i) => { setCurrent(i); setViewMode('presentation'); onViewModeChange?.('presentation') }}
          onDocumentChange={onDocumentChange}
          onRebuild={onRebuild}
          onExit={() => { setViewMode('presentation'); onViewModeChange?.('presentation') }}
          commentActions={{ comments, addComment, deleteComment, editComment, addReply, deleteReply, flagComment, resolveComment }}
          commentMode={commentMode}
          locale={locale}
          isGenerating={isGeneratingDocument}
          onAIEdit={onSelectionAIEdit}
          editPanel={documentEditPanel}
          sectionFiles={sectionFiles}
          onSectionFilesChange={onSectionFilesChange}
        />
      ) : isGeneratingDocument ? (
        <DocumentSkeleton onExit={() => { setViewMode('presentation'); onViewModeChange?.('presentation') }} />
      ) : documentGenFailed ? (
        <div className="fixed inset-0 z-[180] bg-linen flex items-center justify-center" data-view="document">
          <div className="text-center max-w-md px-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Document generation failed</h3>
            <p className="text-sm text-slate-500 mb-6">Something went wrong while generating the document. Please try again.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => { setViewMode('presentation'); onViewModeChange?.('presentation') }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back to slides
              </button>
              {onGenerateDocument && (
                <button
                  type="button"
                  onClick={() => { onGenerateDocument() }}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      ) : onGenerateDocument ? (
        <div className="fixed inset-0 z-[180] bg-linen flex items-center justify-center" data-view="document">
          <div className="text-center max-w-md px-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No document yet</h3>
            <p className="text-sm text-slate-500 mb-6">Generate a narrative document from your presentation slides.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => { setViewMode('presentation'); onViewModeChange?.('presentation') }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back to slides
              </button>
              <button
                type="button"
                onClick={() => { onGenerateDocument() }}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Generate document
              </button>
            </div>
          </div>
        </div>
      ) : (
        <DocumentSkeleton onExit={() => { setViewMode('presentation'); onViewModeChange?.('presentation') }} />
      )
    )}

    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      style={{
        backgroundColor: brandColors.darkBg,
        '--brand-dark-bg': brandColors.darkBg,
        '--brand-light-bg': brandColors.lightBg,
        '--brand-brand-bg': brandColors.brandBg,
        '--brand-accent': brandColors.accent,
      } as React.CSSProperties}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={(e) => {
        const inTop = e.clientY < window.innerHeight * 0.1
        if (inTop !== hoverTop) setHoverTop(inTop)
      }}
      onMouseLeave={() => setHoverTop(false)}
    >
      {/* Progress bar */}
      <div className={cn('absolute top-0 inset-x-0 h-1 z-50 transition-colors duration-500', chrome.trackBg)}>
        <div
          className={cn('h-full transition-all duration-500 ease-out', chrome.trackFill)}
          style={{ width: `${((safeCurrent + 1) / total) * 100}%` }}
        />
      </div>

      {/* Top-left extra — presentation mode only */}
      {viewMode === 'presentation' && (
        <div
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 transition-opacity duration-200"
          style={{ opacity: hoverTop ? 1 : 0, pointerEvents: 'auto' }}
          onMouseEnter={() => setHoverTop(true)}
        >
          {topLeftContent}
        </div>
      )}

      {/* Slide content */}
      <div ref={slideRef} className="h-full w-full relative" key={safeCurrent}>
        <div className="h-full w-full animate-in fade-in duration-300">
          <SlideComponent slide={slide} slideIndex={safeCurrent} />
          <SlideFooter num={safeCurrent + 1} total={total} bg={slide.bg} deckTitle={title} />
        </div>

        {/* Slide regenerate + rating — bottom-right, hover-visible */}
        {(ratingSource || onSlideRegenerate) && (
          <div
            className="absolute bottom-12 right-6 z-[60] transition-opacity duration-200 flex items-end gap-3"
            style={{ opacity: hoverTop ? 1 : 0, pointerEvents: hoverTop ? 'auto' : 'none' }}
            onMouseEnter={() => setHoverTop(true)}
          >
            {onSlideRegenerate && !sharePermission && (
              <SlideRegenerate
                slideIndex={safeCurrent}
                slideData={slide}
                totalSlides={total}
                prevSlide={safeCurrent > 0 ? slides[safeCurrent - 1] : undefined}
                nextSlide={safeCurrent < total - 1 ? slides[safeCurrent + 1] : undefined}
                onRegenerate={onSlideRegenerate}
                generating={regeneratingSlide === safeCurrent}
                dark={slide.bg === 'dark'}
              />
            )}
            {ratingSource && (
              <SlideRating
                slide={slide}
                slideIndex={safeCurrent}
                source={ratingSource}
                dark={slide.bg === 'dark'}
              />
            )}
          </div>
        )}

        {/* Comment layer — hidden for viewer-only shared access */}
        {(!sharePermission || sharePermission !== 'viewer') && (
          <SlideCommentLayer
            slideIndex={safeCurrent}
            commentMode={commentMode}
            comments={comments}
            onAddComment={addComment}
            onEditComment={editComment}
            onDeleteComment={deleteComment}
            onFlagComment={flagComment}
            onResolveComment={(id, resolved) => resolveComment(id, resolved)}
            onAddReply={addReply}
            onDeleteReply={deleteReply}
            onExitCommentMode={() => setCommentMode(false)}
          />
        )}
      </div>

      {/* Dot navigation — presentation mode only */}
      {viewMode === 'presentation' && <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'h-1.5 sm:h-2 rounded-full transition-all duration-300',
              safeCurrent === i
                ? cn('w-8 sm:w-12', chrome.dotActive)
                : cn('w-1.5 sm:w-2', chrome.dotInactive),
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>}

      {viewMode === 'presentation' && <>
      {/* Arrow navigation (desktop) — hidden when hovering top chrome */}
      <button
        onClick={prev}
        disabled={current === 0}
        className={cn(
          'hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500',
          chrome.btnCls,
          (safeCurrent === 0 || hoverTop || idle) && 'opacity-0 pointer-events-none',
        )}
        aria-label="Previous slide"
        type="button"
      >
        <svg className={cn('w-5 h-5 transition-colors duration-500', chrome.btnIcon)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        disabled={current === total - 1}
        className={cn(
          'hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500',
          chrome.btnCls,
          (safeCurrent === total - 1 || hoverTop || idle) && 'opacity-0 pointer-events-none',
        )}
        aria-label="Next slide"
        type="button"
      >
        <svg className={cn('w-5 h-5 transition-colors duration-500', chrome.btnIcon)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* TOC overlay */}
      <SlideToc
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        slides={slideComponents}
        slideMeta={slideMeta}
        darkSlideSet={darkSlideSet}
        current={current}
        view={tocView}
        onSelect={(i) => { setCurrent(i); setTocOpen(false) }}
        editMode={tocEditMode}
        slideData={slides}
        onSlidesChange={onSlidesChange}
      />

      {/* Mobile swipe hint */}
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className={cn('px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500', chrome.pillBg)}>
          <span className={cn('text-xs transition-colors duration-500', chrome.hintText)}>Swipe to navigate</span>
        </div>
      </div>
      </>}

      {/* TOC chrome — renders in all view modes (adapts layout per mode) */}
      <SlideTocChrome
        tocOpen={tocOpen}
        onToggle={() => setTocOpen(!tocOpen)}
        tocView={tocView}
        onViewChange={setTocView}
        pillBg={chrome.pillBg}
        pillText={chrome.pillText}
        hintText={chrome.hintText}
        visible={hoverTop}
        onReset={() => setCurrent(0)}
        currentSlide={safeCurrent}
        commentMode={commentMode}
        onToggleComments={(!sharePermission || sharePermission !== 'viewer') ? () => { if (!commentMode && tocOpen) setTocOpen(false); setCommentMode(!commentMode) } : undefined}
        locale={locale}
        onLocaleChange={setLocale}
        onDownloadPdf={() => {
          if (viewMode === 'outline' || viewMode === 'document') {
            downloadViewPdf({ viewMode })
          } else {
            downloadPdf({ slideRef, total, currentSlide: current, goToSlide: setCurrent })
          }
        }}
        onDownloadPptx={async () => {
          try {
            const res = await fetch('/api/studio/export/pptx', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slides, title }),
            })
            if (!res.ok) throw new Error('Export failed')
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${(title || 'presentation').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase()}.pptx`
            a.click()
            URL.revokeObjectURL(url)
          } catch (err) {
            console.error('[PPTX export]', err)
          }
        }}
        onHover={() => setHoverTop(true)}
        onShare={onShare}
        onEdit={sharePermission === 'editor' || !sharePermission ? (tocOpen ? () => setTocEditMode(!tocEditMode) : onEdit) : undefined}
        editActive={tocOpen ? tocEditMode : editActive}
        contentViewMode={viewMode}
      >
        {topRightContent}
        {onClose && !hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className={cn('p-2.5 rounded-full backdrop-blur-sm border transition-all duration-500 inline-flex items-center gap-1.5', chrome.btnCls)}
            aria-label="Back to presentations"
          >
            <ArrowLeft className={cn('w-4 h-4 transition-colors duration-500', chrome.btnIcon)} />
            <span className={cn('text-xs font-medium pr-1 transition-colors duration-500', chrome.btnIcon)}>Back</span>
          </button>
        )}
      </SlideTocChrome>

      {/* PDF export overlay */}
      <SlidePdfOverlay progress={pdfProgress} onCancel={cancelPdf} />
    </div>
    </>
  )
}
