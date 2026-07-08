'use client'

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SAVE_STATUS_COPY, type SaveStatus } from '@/lib/studio-create-controller'

interface SaveStatusPillProps {
  done: boolean
  status: SaveStatus
  error: string
  retryAvailable: boolean
  onRetry: () => void
}

export function SaveStatusPill({
  done,
  status,
  error,
  retryAvailable,
  onRetry,
}: SaveStatusPillProps) {
  if (!done || status === 'idle') return null

  const details = SAVE_STATUS_COPY[status]

  return (
    <div className="fixed top-20 left-1/2 z-[280] w-[min(calc(100vw-2rem),32rem)] -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md',
        status === 'error'
          ? 'border-red-500/25 bg-red-950/85 text-red-100'
          : status === 'pending-quality'
            ? 'border-amber-500/25 bg-amber-950/85 text-amber-100'
            : 'border-white/10 bg-slate-950/85 text-white',
      )}>
        <div className="mt-0.5 shrink-0">
          {(status === 'saving' || status === 'syncing') && (
            <Loader2 className="h-4 w-4 animate-spin text-turquoise" />
          )}
          {status === 'saved' && (
            <CheckCircle2 className="h-4 w-4 text-cactus" />
          )}
          {(status === 'error' || status === 'pending-quality') && (
            <AlertTriangle className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{details.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed opacity-70">
            {error || details.body}
          </p>
        </div>
        {status === 'error' && retryAvailable && (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}
