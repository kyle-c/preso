'use client'

import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Layers, ListOrdered, Paperclip, Sparkles, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type StarterActionKind = 'prompt' | 'import' | 'merge'

interface StarterAction {
  label: string
  description: string
  icon: LucideIcon
  iconClassName: string
  kind: StarterActionKind
  prompt?: string
}

interface MorphRect {
  top: number
  left: number
  width: number
  height: number
}

interface MorphOverlay {
  action: StarterAction
  startRect: MorphRect
  targetRect: MorphRect
}

interface CreateStarterActionsProps {
  onPromptSelect: (prompt: string, label: string) => void
  onImport: () => void
  onMerge: () => void
  onActionStart?: (label: string) => void
  onActionEnd?: () => void
  getMorphTargetRect?: () => DOMRect | null
}

const STARTER_ACTIONS: StarterAction[] = [
  {
    label: 'Pitch deck',
    description: 'Investor-ready draft',
    icon: Sparkles,
    iconClassName: 'text-evergreen',
    kind: 'prompt',
    prompt: 'Create a concise investor pitch deck for Felix Pago. Focus on the customer problem, product wedge, traction, market, business model, and next raise.',
  },
  {
    label: 'QBR',
    description: 'Exec review flow',
    icon: ListOrdered,
    iconClassName: 'text-concrete',
    kind: 'prompt',
    prompt: 'Create an executive QBR presentation. Summarize goals, progress, risks, metrics, customer learnings, and next-quarter priorities.',
  },
  {
    label: 'Import',
    description: 'Use source files',
    icon: Paperclip,
    iconClassName: 'text-mocha',
    kind: 'import',
  },
  {
    label: 'Merge',
    description: 'Combine decks',
    icon: Layers,
    iconClassName: 'text-turquoise',
    kind: 'merge',
  },
]

const toMorphRect = (rect: DOMRect): MorphRect => ({
  top: rect.top,
  left: rect.left,
  width: rect.width,
  height: rect.height,
})

export function CreateStarterActions({
  onPromptSelect,
  onImport,
  onMerge,
  onActionStart,
  onActionEnd,
  getMorphTargetRect,
}: CreateStarterActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [overlay, setOverlay] = useState<MorphOverlay | null>(null)
  const [overlaySettled, setOverlaySettled] = useState(false)
  const [overlayLeaving, setOverlayLeaving] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const overlayCleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (overlayCleanupRef.current) clearTimeout(overlayCleanupRef.current)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const completeAction = (action: StarterAction) => {
    if (action.kind === 'prompt' && action.prompt) {
      onPromptSelect(action.prompt, action.label)
      return
    }

    if (action.kind === 'import') {
      onImport()
      return
    }

    onMerge()
  }

  const runWithSelection = (
    event: MouseEvent<HTMLButtonElement>,
    action: StarterAction,
  ) => {
    if (activeAction) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (overlayCleanupRef.current) clearTimeout(overlayCleanupRef.current)
    if (frameRef.current) cancelAnimationFrame(frameRef.current)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targetRect = getMorphTargetRect?.()

    if (prefersReducedMotion || !targetRect) {
      completeAction(action)
      onActionEnd?.()
      return
    }

    setActiveAction(action.label)
    setOverlay({
      action,
      startRect: toMorphRect(event.currentTarget.getBoundingClientRect()),
      targetRect: toMorphRect(targetRect),
    })
    setOverlaySettled(false)
    setOverlayLeaving(false)
    onActionStart?.(action.label)

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = requestAnimationFrame(() => setOverlaySettled(true))
    })

    timeoutRef.current = setTimeout(() => {
      completeAction(action)
      setActiveAction(null)
      setOverlayLeaving(true)
      onActionEnd?.()
      overlayCleanupRef.current = setTimeout(() => {
        setOverlay(null)
        setOverlaySettled(false)
        setOverlayLeaving(false)
      }, 180)
    }, 760)
  }

  const actionClassName = (key: string) => cn(
    'group relative min-h-[88px] overflow-hidden rounded-xl border border-border bg-white px-4 py-4 text-left shadow-sm outline-none',
    'transition-[border-color,background-color,box-shadow,opacity,transform] duration-500 ease-out',
    'hover:-translate-y-1 hover:border-evergreen/40 hover:bg-stone/25 hover:shadow-md',
    'active:translate-y-0 focus-visible:ring-2 focus-visible:ring-evergreen/30',
    activeAction === key && 'starter-action-origin-hidden border-evergreen/50 bg-stone/35 shadow-lg',
    activeAction && activeAction !== key && 'starter-action-dimmed',
  )

  const renderAction = (action: StarterAction) => {
    const Icon = action.icon
    const isActive = activeAction === action.label

    return (
      <button
        key={action.label}
        type="button"
        onClick={(event) => runWithSelection(event, action)}
        className={actionClassName(action.label)}
        aria-pressed={isActive}
      >
        <span className={cn('pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300', isActive && 'opacity-100')}>
          <span className="starter-action-sheen absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-turquoise/20 to-transparent" />
        </span>
        <span className="relative block">
          <Icon className={cn('mb-3 h-5 w-5 transition-transform duration-300 ease-out group-hover:scale-110', action.iconClassName)} />
          <span className="block text-base font-semibold leading-tight text-foreground">{action.label}</span>
          <span className="mt-1.5 block text-sm leading-snug text-muted-foreground">{action.description}</span>
        </span>
        <span className={cn('absolute inset-x-4 bottom-3 h-px origin-left scale-x-0 bg-evergreen/25 transition-transform duration-300 ease-out group-hover:scale-x-100', isActive && 'scale-x-100 bg-turquoise')} />
      </button>
    )
  }

  const morphStyle = overlay ? {
    top: overlaySettled ? overlay.targetRect.top : overlay.startRect.top,
    left: overlaySettled ? overlay.targetRect.left : overlay.startRect.left,
    width: overlaySettled ? overlay.targetRect.width : overlay.startRect.width,
    height: overlaySettled ? overlay.targetRect.height : overlay.startRect.height,
  } : undefined

  const OverlayIcon = overlay?.action.icon
  const previewText = overlay?.action.prompt ?? overlay?.action.description ?? ''

  return (
    <>
      <div className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4',
        activeAction && 'starter-actions-exiting',
      )}>
        {STARTER_ACTIONS.map(renderAction)}
      </div>

      {overlay && OverlayIcon && typeof document !== 'undefined'
        ? createPortal(
          <div
            className={cn(
              'starter-morph-overlay',
              overlaySettled && 'starter-morph-overlay-settled',
              overlayLeaving && 'starter-morph-overlay-leaving',
            )}
            style={morphStyle}
            aria-hidden="true"
          >
            <div className="starter-morph-card-copy absolute inset-0 px-4 py-4">
              <OverlayIcon className={cn('mb-3 h-5 w-5', overlay.action.iconClassName)} />
              <span className="block text-base font-semibold leading-tight text-foreground">{overlay.action.label}</span>
              <span className="mt-1.5 block text-sm leading-snug text-muted-foreground">{overlay.action.description}</span>
            </div>
            <div className="starter-morph-input-copy absolute inset-0 flex flex-col px-5 py-4">
              <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-evergreen/15 bg-stone/45 px-2.5 py-1 text-[11px] font-semibold text-evergreen">
                <OverlayIcon className="h-3.5 w-3.5" />
                <span>{overlay.action.label}</span>
              </div>
              <p className="line-clamp-3 max-w-3xl text-base leading-relaxed text-foreground/72">
                {previewText}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="h-8 w-40 rounded-lg bg-stone/60" />
                <div className="h-10 w-32 rounded-full bg-evergreen" />
              </div>
            </div>
          </div>,
          document.body,
        )
        : null}
    </>
  )
}
