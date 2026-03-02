'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

// --- Context ---

interface ActionSheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const ActionSheetContext = React.createContext<ActionSheetContextValue | null>(null)

function useActionSheet() {
  const ctx = React.useContext(ActionSheetContext)
  if (!ctx) {
    throw new Error('useActionSheet must be used within an <ActionSheet>')
  }
  return ctx
}

// --- ActionSheet (root) ---

function ActionSheet({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  return (
    <ActionSheetContext.Provider value={{ open, setOpen }}>
      {children}
    </ActionSheetContext.Provider>
  )
}

// --- ActionSheetTrigger ---

function ActionSheetTrigger({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const { setOpen } = useActionSheet()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => setOpen(true),
    })
  }

  return (
    <button
      type="button"
      data-slot="action-sheet-trigger"
      className={className}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

// --- ActionSheetContent ---

function ActionSheetContent({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { open, setOpen } = useActionSheet()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when open
  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, setOpen])

  if (!mounted || !open) return null

  return createPortal(
    <div data-slot="action-sheet-overlay" className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        data-slot="action-sheet-backdrop"
        className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
        onClick={() => setOpen(false)}
      />
      {/* Sheet */}
      <div
        data-slot="action-sheet-content"
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute inset-x-0 bottom-0 rounded-t-2xl bg-white px-4 pb-8 pt-2 dark:bg-card',
          'animate-in slide-in-from-bottom duration-300',
          className,
        )}
        {...props}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-stone" />
        {children}
      </div>
    </div>,
    document.body,
  )
}

// --- ActionSheetHeader ---

function ActionSheetHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="action-sheet-header"
      className={cn('mb-3 px-1', className)}
      {...props}
    />
  )
}

// --- ActionSheetItem ---

function ActionSheetItem({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { setOpen } = useActionSheet()

  return (
    <button
      type="button"
      data-slot="action-sheet-item"
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-medium text-foreground transition-colors',
        'active:bg-stone/60 [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:text-muted-foreground',
        className,
      )}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

// --- ActionSheetCancel ---

function ActionSheetCancel({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const { setOpen } = useActionSheet()

  return (
    <button
      type="button"
      data-slot="action-sheet-cancel"
      className={cn(
        'mt-2 w-full rounded-xl bg-stone py-3 text-center text-base font-semibold text-mocha transition-colors active:bg-stone/80',
        className,
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children ?? 'Cancel'}
    </button>
  )
}

export {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetHeader,
  ActionSheetItem,
  ActionSheetCancel,
}
