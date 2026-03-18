'use client'

import type { PdfProgress } from './use-slide-pdf'

const statusLabel = (s: PdfProgress['status'], current: number, total: number) => {
  switch (s) {
    case 'rendering': return `Rendering slide ${current} of ${total}…`
    case 'capturing': return `Capturing slide ${current} of ${total}…`
    case 'building':  return 'Building PDF…'
    default:          return ''
  }
}

export function SlidePdfOverlay({ progress, onCancel }: { progress: PdfProgress; onCancel: () => void }) {
  if (progress.status === 'idle' || progress.status === 'done') return null

  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-[340px] flex flex-col gap-5 shadow-2xl">
        {/* Spinner */}
        <div className="flex items-center gap-4">
          <svg className="w-6 h-6 text-turquoise animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <div>
            <p className="font-display font-extrabold text-white text-base leading-snug">Exporting PDF</p>
            <p className="text-xs text-white/40 mt-0.5">{statusLabel(progress.status, progress.current, progress.total)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-turquoise rounded-full transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/30">{pct}% complete</span>
          <button
            onClick={onCancel}
            type="button"
            className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded-full hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
