'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Loader2, MessageSquare } from 'lucide-react'

const IDENTITY_KEY = 'slide-commenter-identity'

function loadIdentity(): { name: string; email?: string } | null {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveIdentity(id: { name: string; email?: string }) {
  try { localStorage.setItem(IDENTITY_KEY, JSON.stringify(id)) } catch {}
}

interface SelectionTooltipProps {
  containerRef: React.RefObject<HTMLElement | null>
  onAIEdit?: (prompt: string, selectionContext: { sectionIndex: number; selectedText: string }) => void
  onAddComment?: (sectionIndex: number, name: string, text: string, email?: string) => void
  generating?: boolean
}

export function SelectionTooltip({ containerRef, onAIEdit, onAddComment, generating }: SelectionTooltipProps) {
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState<'actions' | 'ai-edit' | 'comment-identity' | 'comment'>('actions')
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [value, setValue] = useState('')
  const [identity, setIdentity] = useState<{ name: string; email?: string } | null>(null)
  const [idName, setIdName] = useState('')
  const [idEmail, setIdEmail] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const dismiss = useCallback(() => {
    setShow(false)
    setValue('')
    setMode('actions')
    setIdName('')
    setIdEmail('')
  }, [])

  const checkSelection = useCallback(() => {
    if (generating) return
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      if (mode === 'actions') setShow(false)
      return
    }

    const container = containerRef.current
    if (!container || !container.contains(sel.anchorNode)) {
      if (mode === 'actions') setShow(false)
      return
    }

    const text = sel.toString().trim()
    if (!text) {
      if (mode === 'actions') setShow(false)
      return
    }

    // Find section index by walking up from anchorNode
    let node: Node | null = sel.anchorNode
    let secIdx = 0
    while (node && node !== container) {
      if (node instanceof HTMLElement) {
        const id = node.id
        if (id && id.startsWith('doc-section-')) {
          secIdx = parseInt(id.replace('doc-section-', ''), 10)
          break
        }
        const dsIdx = node.dataset.sectionIndex
        if (dsIdx !== undefined) {
          secIdx = parseInt(dsIdx, 10)
          break
        }
      }
      node = node.parentNode
    }

    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    setPosition({
      top: rect.top - containerRect.top - 48,
      left: rect.left - containerRect.left + rect.width / 2,
    })
    setSelectedText(text)
    setSectionIndex(secIdx)
    if (!show) setMode('actions')
    setShow(true)
  }, [containerRef, generating, show, mode])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const handler = () => {
      clearTimeout(timer)
      timer = setTimeout(checkSelection, 300)
    }
    document.addEventListener('selectionchange', handler)
    return () => {
      document.removeEventListener('selectionchange', handler)
      clearTimeout(timer)
    }
  }, [checkSelection])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [dismiss])

  useEffect(() => {
    if (show && mode === 'ai-edit') setTimeout(() => inputRef.current?.focus(), 50)
    if (show && mode === 'comment') setTimeout(() => commentRef.current?.focus(), 50)
    if (show && mode === 'comment-identity') setTimeout(() => nameRef.current?.focus(), 50)
  }, [show, mode])

  useEffect(() => {
    if (!show) return
    const handler = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) dismiss()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [show, dismiss])

  const startComment = () => {
    const stored = typeof window !== 'undefined' ? loadIdentity() : null
    if (stored) {
      setIdentity(stored)
      setMode('comment')
    } else {
      setMode('comment-identity')
    }
  }

  const handleIdentitySubmit = () => {
    if (!idName.trim()) return
    const id = { name: idName.trim(), email: idEmail.trim() || undefined }
    saveIdentity(id)
    setIdentity(id)
    setMode('comment')
    setIdName('')
    setIdEmail('')
  }

  const handleAISubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || !onAIEdit) return
    onAIEdit(trimmed, { sectionIndex, selectedText })
    dismiss()
    window.getSelection()?.removeAllRanges()
  }

  const handleCommentSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || !onAddComment || !identity) return
    onAddComment(sectionIndex, identity.name, trimmed, identity.email)
    dismiss()
    window.getSelection()?.removeAllRanges()
  }

  if (!show) return null

  return (
    <div
      ref={tooltipRef}
      className="absolute z-50 animate-in fade-in zoom-in-95 duration-150"
      style={{ top: position.top, left: position.left, transform: 'translateX(-50%)' }}
    >
      {mode === 'actions' ? (
        <div className="flex items-center gap-0.5 bg-slate-950 text-white rounded-xl shadow-xl px-1.5 py-1 border border-white/10">
          {onAIEdit && (
            <button
              type="button"
              onClick={() => setMode('ai-edit')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-turquoise" />
              Edit with AI
            </button>
          )}
          {onAIEdit && onAddComment && (
            <div className="w-px h-4 bg-white/15" />
          )}
          {onAddComment && (
            <button
              type="button"
              onClick={startComment}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-white/60" />
              Comment
            </button>
          )}
        </div>
      ) : mode === 'ai-edit' ? (
        <div className="flex items-center gap-1.5 bg-slate-950 text-white rounded-xl shadow-xl px-2 py-1.5 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-turquoise shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAISubmit()
              if (e.key === 'Escape') dismiss()
            }}
            placeholder="Rewrite this…"
            className="w-48 text-xs bg-transparent outline-none placeholder:text-white/30"
          />
          <button
            type="button"
            onClick={handleAISubmit}
            disabled={!value.trim()}
            className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30"
            aria-label="Submit"
          >
            {generating ? (
              <Loader2 className="w-3 h-3 text-turquoise animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-turquoise" />
            )}
          </button>
        </div>
      ) : mode === 'comment-identity' ? (
        <div className="bg-slate-950/95 backdrop-blur-md text-white rounded-xl shadow-2xl px-4 py-3 border border-white/15 w-64">
          <form onSubmit={e => { e.preventDefault(); handleIdentitySubmit() }} className="space-y-2">
            <p className="text-xs text-white/40 mb-2">Who are you?</p>
            <input
              ref={nameRef}
              value={idName}
              onChange={e => setIdName(e.target.value)}
              placeholder="Name *"
              required
              className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40"
            />
            <input
              value={idEmail}
              onChange={e => setIdEmail(e.target.value)}
              placeholder="Email (optional)"
              type="email"
              className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40"
            />
            <button
              type="submit"
              disabled={!idName.trim()}
              className="w-full px-3 py-1.5 rounded-lg bg-turquoise/20 text-turquoise text-sm font-medium disabled:opacity-30 hover:bg-turquoise/30 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-950/95 backdrop-blur-md text-white rounded-xl shadow-2xl px-4 py-3 border border-white/15 w-64">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-white/30">Commenting as <span className="text-white/60 font-medium">{identity?.name}</span></p>
            <button onClick={() => setMode('comment-identity')} className="text-[10px] text-white/20 hover:text-white/50 transition-colors">Change</button>
          </div>
          <textarea
            ref={commentRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Leave a comment..."
            rows={2}
            className="w-full text-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2 resize-none text-white placeholder:text-white/30 outline-none focus:border-white/40"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCommentSubmit()
              if (e.key === 'Escape') dismiss()
            }}
          />
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" onClick={() => { setMode('actions'); setValue('') }} className="text-xs text-white/40 hover:text-white/60 px-1.5 py-0.5 transition-colors">Cancel</button>
            <button type="button" onClick={handleCommentSubmit} disabled={!value.trim()} className="text-xs text-turquoise font-medium px-1.5 py-0.5 disabled:opacity-30 hover:text-turquoise/80 transition-colors">Post</button>
          </div>
        </div>
      )}
      {/* Triangle pointer */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-950" />
    </div>
  )
}
