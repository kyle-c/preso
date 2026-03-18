'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Loader2 } from 'lucide-react'

interface ViewPromptBarProps {
  onSubmit: (prompt: string) => void
  generating?: boolean
  hint?: string | null
  onCancel?: () => void
  placeholder?: string
}

export function ViewPromptBar({ onSubmit, generating, hint, onCancel, placeholder = 'Ask AI to edit this content…' }: ViewPromptBarProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!generating) inputRef.current?.focus()
  }, [generating])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || generating) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <div className="sticky bottom-0 z-10 bg-white border-t border-slate-950/8 px-4 py-2.5 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {generating ? (
        <>
          <Loader2 className="w-4 h-4 text-evergreen animate-spin shrink-0" />
          <span className="text-sm text-slate-950/50 truncate flex-1">{hint || 'Generating…'}</span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="shrink-0 p-1.5 rounded-full text-slate-950/40 hover:text-slate-950/60 hover:bg-slate-950/5 transition-colors"
              aria-label="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 text-evergreen/60 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
              if (e.key === 'Escape') inputRef.current?.blur()
            }}
            placeholder={placeholder}
            className="flex-1 text-sm text-slate-950 placeholder:text-slate-950/30 bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="shrink-0 p-1.5 rounded-full text-evergreen hover:bg-evergreen/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  )
}
