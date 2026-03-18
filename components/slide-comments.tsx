'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/* ── Brand colors for comment markers ── */
const COMMENT_COLORS = [
  { bg: '#6060BF', tint: 'rgba(96,96,191,0.3)', name: 'blueberry' },
  { bg: '#60D06F', tint: 'rgba(96,208,111,0.3)', name: 'cactus' },
  { bg: '#F19D38', tint: 'rgba(241,157,56,0.3)', name: 'mango' },
  { bg: '#F26629', tint: 'rgba(242,102,41,0.3)', name: 'papaya' },
  { bg: '#2BF2F1', tint: 'rgba(43,242,241,0.3)', name: 'turquoise' },
]

function pickColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  return COMMENT_COLORS[Math.abs(hash) % COMMENT_COLORS.length]
}

/* ── Types ── */
export interface Reply {
  id: string
  name: string
  text: string
  timestamp: number
}

export interface Comment {
  id: string
  deckId: string
  slideIndex: number
  x: number
  y: number
  name: string
  email?: string
  text: string
  timestamp: number
  replies: Reply[]
  flaggedForRebuild?: boolean
  resolved?: boolean
  resolvedAt?: number
  resolvedBy?: string
}

/* ── Identity storage (localStorage) ── */
const IDENTITY_KEY = 'slide-commenter-identity'

interface Identity { name: string; email?: string }

function loadIdentity(): Identity | null {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveIdentity(id: Identity) {
  try { localStorage.setItem(IDENTITY_KEY, JSON.stringify(id)) } catch {}
}

/* ── API helpers ── */
async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, opts)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<T>
}

/* ── localStorage fallback ── */
function lsKey(deckId: string) { return `comments:${deckId}` }

function lsLoad(deckId: string): Comment[] {
  try {
    const raw = localStorage.getItem(lsKey(deckId))
    return raw ? (JSON.parse(raw) as Comment[]) : []
  } catch { return [] }
}

function lsSave(deckId: string, comments: Comment[]) {
  try { localStorage.setItem(lsKey(deckId), JSON.stringify(comments)) } catch {}
}

/* ── Hook: useComments ── */
export function useComments(deckId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentMode, setCommentMode] = useState(false)
  const [loading, setLoading] = useState(true)
  // Track whether API is available so we can skip retries after first failure
  const apiOk = useRef(true)

  // Load from server, fall back to localStorage
  const reload = useCallback(async () => {
    if (apiOk.current) {
      try {
        const data = await apiFetch<Comment[]>(`/api/comments?deck=${encodeURIComponent(deckId)}`)
        setComments(data)
        setLoading(false)
        return
      } catch {
        apiOk.current = false
      }
    }
    // localStorage fallback
    setComments(lsLoad(deckId))
    setLoading(false)
  }, [deckId])

  useEffect(() => { reload() }, [reload])

  const addComment = useCallback(async (slideIndex: number, x: number, y: number, name: string, text: string, email?: string) => {
    if (apiOk.current) {
      try {
        const comment = await apiFetch<Comment>('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId, slideIndex, x, y, name, email, text }),
        })
        setComments(prev => [...prev, comment])
        return comment
      } catch {
        apiOk.current = false
      }
    }
    // localStorage fallback
    const comment: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      deckId, slideIndex, x, y, name, email, text,
      timestamp: Date.now(), replies: [], flaggedForRebuild: false,
    }
    setComments(prev => {
      const next = [...prev, comment]
      lsSave(deckId, next)
      return next
    })
    return comment
  }, [deckId])

  const deleteComment = useCallback(async (id: string) => {
    setComments(prev => {
      const next = prev.filter(c => c.id !== id)
      if (!apiOk.current) lsSave(deckId, next)
      return next
    })
    if (apiOk.current) {
      try { await fetch(`/api/comments/${id}?deck=${encodeURIComponent(deckId)}`, { method: 'DELETE' }) }
      catch { apiOk.current = false }
    }
  }, [deckId])

  const editComment = useCallback(async (id: string, text: string) => {
    setComments(prev => {
      const next = prev.map(c => c.id === id ? { ...c, text } : c)
      if (!apiOk.current) lsSave(deckId, next)
      return next
    })
    if (apiOk.current) {
      try {
        await apiFetch(`/api/comments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId, text }),
        })
      } catch { apiOk.current = false }
    }
  }, [deckId])

  const flagComment = useCallback(async (id: string, flaggedForRebuild: boolean) => {
    setComments(prev => {
      const next = prev.map(c => c.id === id ? { ...c, flaggedForRebuild } : c)
      if (!apiOk.current) lsSave(deckId, next)
      return next
    })
    if (apiOk.current) {
      try {
        await apiFetch(`/api/comments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId, flaggedForRebuild }),
        })
      } catch { apiOk.current = false }
    }
  }, [deckId])

  const addReply = useCallback(async (commentId: string, name: string, text: string) => {
    if (apiOk.current) {
      try {
        await apiFetch(`/api/comments/${commentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId, reply: { name, text } }),
        })
        await reload()
        return
      } catch { apiOk.current = false }
    }
    // localStorage fallback
    const newReply: Reply = { id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name, text, timestamp: Date.now() }
    setComments(prev => {
      const next = prev.map(c => c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c)
      lsSave(deckId, next)
      return next
    })
  }, [deckId, reload])

  const deleteReply = useCallback(async (commentId: string, replyId: string) => {
    setComments(prev => {
      const next = prev.map(c => c.id === commentId ? { ...c, replies: c.replies.filter(r => r.id !== replyId) } : c)
      if (!apiOk.current) lsSave(deckId, next)
      return next
    })
    if (apiOk.current) {
      try {
        await apiFetch(`/api/comments/${commentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId, deleteReplyId: replyId }),
        })
      } catch { apiOk.current = false }
    }
  }, [deckId])

  const resolveComment = useCallback(async (id: string, resolved: boolean, resolvedBy?: string) => {
    setComments(prev => {
      const next = prev.map(c => c.id === id ? {
        ...c,
        resolved,
        resolvedAt: resolved ? Date.now() : undefined,
        resolvedBy: resolved ? resolvedBy : undefined,
      } : c)
      if (!apiOk.current) lsSave(deckId, next)
      return next
    })
    if (apiOk.current) {
      try {
        await apiFetch(`/api/comments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId, resolved, resolvedBy }),
        })
      } catch { apiOk.current = false }
    }
  }, [deckId])

  const clearFlagged = useCallback(async () => {
    setComments(prev => {
      const next = prev.filter(c => !c.flaggedForRebuild)
      if (!apiOk.current) lsSave(deckId, next)
      return next
    })
    if (apiOk.current) {
      try { await fetch(`/api/comments/flagged?deck=${encodeURIComponent(deckId)}`, { method: 'DELETE' }) }
      catch { apiOk.current = false }
    }
  }, [deckId])

  return { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply, clearFlagged, loading }
}

/* ── Identity Step (name + optional email) ── */
function IdentityStep({ onSubmit }: { onSubmit: (id: Identity) => void }) {
  const stored = typeof window !== 'undefined' ? loadIdentity() : null
  const [name, setName] = useState(stored?.name ?? '')
  const [email, setEmail] = useState(stored?.email ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!name.trim()) return
        const id = { name: name.trim(), email: email.trim() || undefined }
        saveIdentity(id)
        onSubmit(id)
      }}
      className="space-y-2"
    >
      <p className="text-xs text-white/40 mb-2">Who are you?</p>
      <input
        ref={inputRef}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name *"
        required
        className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40"
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email (optional)"
        type="email"
        className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full px-3 py-1.5 rounded-lg bg-turquoise/20 text-turquoise text-sm font-medium disabled:opacity-30 hover:bg-turquoise/30 transition-colors"
      >
        Continue
      </button>
    </form>
  )
}

/* ── Comment Form ── */
function CommentForm({ onSubmit, onCancel, placeholder }: { onSubmit: (text: string) => void; onCancel?: () => void; placeholder?: string }) {
  const [text, setText] = useState('')
  const textRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { textRef.current?.focus() }, [])
  return (
    <form onSubmit={e => { e.preventDefault(); if (text.trim()) { onSubmit(text.trim()); setText('') } }} className="space-y-2">
      <textarea
        ref={textRef}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder || 'Leave a comment...'}
        rows={2}
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40 resize-none"
        onKeyDown={e => { if (e.key === 'Enter' && e.metaKey && text.trim()) { e.preventDefault(); onSubmit(text.trim()); setText('') } }}
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-3 py-1 rounded-lg text-xs text-white/40 hover:text-white/60 transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" disabled={!text.trim()} className="px-3 py-1 rounded-lg bg-turquoise/20 text-turquoise text-xs font-medium disabled:opacity-30 hover:bg-turquoise/30 transition-colors">
          Post
        </button>
      </div>
    </form>
  )
}

/* ── Single Reply ── */
function ReplyBubble({ reply, onDelete }: { reply: Reply; onDelete: () => void }) {
  const color = pickColor(reply.id)
  return (
    <div className="flex gap-2 items-start group/reply">
      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: color.bg }}>
        {reply.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-white/80">{reply.name}</span>
          <span className="text-[10px] text-white/30">{new Date(reply.timestamp).toLocaleDateString()}</span>
          <button onClick={onDelete} className="text-[10px] text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover/reply:opacity-100 ml-auto">
            Delete
          </button>
        </div>
        <p className="text-xs text-white/60 leading-relaxed mt-0.5">{reply.text}</p>
      </div>
    </div>
  )
}

/* ── Comment Popover ── */
function CommentPopover({
  comment, onClose, onEdit, onDelete, onReply, onDeleteReply, onFlag, onResolve,
}: {
  comment: Comment
  onClose: () => void
  onEdit: (text: string) => void
  onDelete: () => void
  onReply: (name: string, text: string) => void
  onDeleteReply: (replyId: string) => void
  onFlag: (flagged: boolean) => void
  onResolve: (resolved: boolean) => void
}) {
  const color = pickColor(comment.id)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const [replyStep, setReplyStep] = useState<'idle' | 'identity' | 'form'>('idle')
  const [replyIdentity, setReplyIdentity] = useState<Identity | null>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const isFlagged = comment.flaggedForRebuild

  useEffect(() => {
    const stored = loadIdentity()
    if (stored) setReplyIdentity(stored)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={popRef}
      className="absolute z-[300] w-72 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
      style={{ left: `${comment.x}%`, top: `${comment.y}%`, transform: 'translate(-8px, 8px)' }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ backgroundColor: color.bg }}>
          {comment.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-white/90">{comment.name}</span>
            {comment.email && <span className="text-[10px] text-white/30 truncate">{comment.email}</span>}
            <span className="text-[10px] text-white/30 ml-auto">{new Date(comment.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors p-0.5 flex-shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Body */}
      {editing ? (
        <form onSubmit={e => { e.preventDefault(); onEdit(editText.trim()); setEditing(false) }} className="space-y-2">
          <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white outline-none focus:border-white/40 resize-none" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setEditing(false)} className="px-2 py-1 text-xs text-white/40 hover:text-white/60">Cancel</button>
            <button type="submit" className="px-2 py-1 rounded-lg bg-turquoise/20 text-turquoise text-xs font-medium hover:bg-turquoise/30">Save</button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-white/70 leading-relaxed">{comment.text}</p>
      )}

      {/* Resolved banner */}
      {comment.resolved && !editing && (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-cactus/15 border border-cactus/25 text-xs text-cactus/80">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Resolved{comment.resolvedBy ? ` by ${comment.resolvedBy}` : ''}</span>
          <button onClick={() => onResolve(false)} className="ml-auto text-[10px] text-cactus/50 hover:text-cactus transition-colors">Reopen</button>
        </div>
      )}

      {/* Flag for rebuild */}
      {!editing && !comment.resolved && (
        <button
          onClick={() => onFlag(!isFlagged)}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isFlagged
              ? 'bg-papaya/20 text-papaya border border-papaya/30'
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-white/10'
          }`}
        >
          <svg className="w-3 h-3 flex-shrink-0" fill={isFlagged ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V5a2 2 0 012-2h11l4 4v14" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h14" />
          </svg>
          {isFlagged ? 'Flagged for rebuild' : 'Flag for rebuild'}
        </button>
      )}

      {/* Actions */}
      {!editing && (
        <div className="flex gap-3 text-[10px]">
          {!comment.resolved && (
            <button onClick={() => onResolve(true)} className="text-cactus/60 hover:text-cactus transition-colors font-medium">Resolve</button>
          )}
          <button onClick={() => setReplyStep(replyIdentity ? 'form' : 'identity')} className="text-turquoise/60 hover:text-turquoise transition-colors font-medium">Reply</button>
          <button onClick={() => { setEditing(true); setEditText(comment.text) }} className="text-white/30 hover:text-white/60 transition-colors">Edit</button>
          <button onClick={onDelete} className="text-white/30 hover:text-red-400 transition-colors">Delete</button>
        </div>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="border-t border-white/10 pt-3 space-y-2.5">
          {comment.replies.map(r => (
            <ReplyBubble key={r.id} reply={r} onDelete={() => onDeleteReply(r.id)} />
          ))}
        </div>
      )}

      {/* Reply flow */}
      {replyStep === 'identity' && (
        <div className="border-t border-white/10 pt-3">
          <IdentityStep onSubmit={id => { setReplyIdentity(id); setReplyStep('form') }} />
        </div>
      )}
      {replyStep === 'form' && replyIdentity && (
        <div className="border-t border-white/10 pt-3">
          <p className="text-[10px] text-white/30 mb-1.5">Replying as <span className="text-white/60 font-medium">{replyIdentity.name}</span></p>
          <CommentForm
            placeholder="Write a reply..."
            onSubmit={text => { onReply(replyIdentity.name, text); setReplyStep('idle') }}
            onCancel={() => setReplyStep('idle')}
          />
        </div>
      )}
    </div>
  )
}

/* ── Comment Marker ── */
function CommentMarker({ comment, onClick, isActive }: { comment: Comment; onClick: () => void; isActive: boolean }) {
  const color = pickColor(comment.id)
  const isResolved = comment.resolved
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      className={`absolute z-[200] group/marker pointer-events-auto ${isResolved ? 'opacity-50' : ''}`}
      style={{ left: `${comment.x}%`, top: `${comment.y}%`, transform: 'translate(-50%, -50%)' }}
      type="button"
    >
      {!isActive && !isResolved && (
        <div className="absolute inset-[-6px] rounded-full opacity-60 animate-[comment-pulse_2s_ease-in-out_infinite] group-hover/marker:animate-none" style={{ backgroundColor: color.tint }} />
      )}
      <div
        className={`relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg transition-transform duration-200 group-hover/marker:scale-110 ${isResolved ? 'grayscale' : ''}`}
        style={{ backgroundColor: color.bg, outline: comment.flaggedForRebuild && !isResolved ? '2px solid #F26629' : 'none', outlineOffset: '2px' }}
      >
        {comment.name.charAt(0).toUpperCase()}
      </div>
      {comment.replies.length > 0 && !isResolved && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[9px] font-bold text-slate-900 flex items-center justify-center shadow">
          {comment.replies.length}
        </div>
      )}
      {isResolved && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cactus flex items-center justify-center shadow">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {comment.flaggedForRebuild && !isResolved && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-papaya flex items-center justify-center shadow">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21V5a2 2 0 012-2h11l4 4v14M3 9h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      )}
    </button>
  )
}

/* ── New Comment Placement Flow ── */
export function NewCommentFlow({ x, y, onSubmit, onCancel }: { x: number; y: number; onSubmit: (name: string, text: string, email?: string) => void; onCancel: () => void }) {
  const [step, setStep] = useState<'identity' | 'form'>('identity')
  const [identity, setIdentity] = useState<Identity | null>(null)
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = loadIdentity()
    if (stored) { setIdentity(stored); setStep('form') }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onCancel()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onCancel])

  return (
    <div
      ref={popRef}
      className="absolute z-[300] w-64 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-8px, 8px)' }}
      onClick={e => e.stopPropagation()}
    >
      {step === 'identity' ? (
        <IdentityStep onSubmit={id => { setIdentity(id); setStep('form') }} />
      ) : identity ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-white/30">Commenting as <span className="text-white/60 font-medium">{identity.name}</span></p>
            <button onClick={() => { setStep('identity') }} className="text-[10px] text-white/20 hover:text-white/50 transition-colors">Change</button>
          </div>
          <CommentForm
            placeholder="Leave a comment..."
            onSubmit={text => onSubmit(identity.name, text, identity.email)}
            onCancel={onCancel}
          />
        </>
      ) : null}
    </div>
  )
}

/* ── Slide Comment Layer ── */
export function SlideCommentLayer({
  slideIndex,
  commentMode,
  markersHidden,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onFlagComment,
  onResolveComment,
  onAddReply,
  onDeleteReply,
  onExitCommentMode,
}: {
  slideIndex: number
  markersHidden?: boolean
  commentMode: boolean
  comments: Comment[]
  onAddComment: (slideIndex: number, x: number, y: number, name: string, text: string, email?: string) => void
  onEditComment: (id: string, text: string) => void
  onDeleteComment: (id: string) => void
  onFlagComment: (id: string, flagged: boolean) => void
  onResolveComment: (id: string, resolved: boolean) => void
  onAddReply: (commentId: string, name: string, text: string) => void
  onDeleteReply: (commentId: string, replyId: string) => void
  onExitCommentMode?: () => void
}) {
  const slideComments = comments.filter(c => c.slideIndex === slideIndex && (commentMode || !c.resolved))
  const [activeComment, setActiveComment] = useState<string | null>(null)
  const [newComment, setNewComment] = useState<{ x: number; y: number } | null>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setActiveComment(null); setNewComment(null) }, [slideIndex])

  useEffect(() => {
    if (!commentMode) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      if (activeComment || newComment) { setActiveComment(null); setNewComment(null) }
      else { onExitCommentMode?.() }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [commentMode, activeComment, newComment, onExitCommentMode])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!commentMode) return
    if (!layerRef.current) return
    const rect = layerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setNewComment({ x, y })
    setActiveComment(null)
  }, [commentMode])

  return (
    <div ref={layerRef} className="absolute inset-0 z-[150] pointer-events-none">
      {/* Click-to-place overlay — only active in comment mode */}
      {commentMode && (
        <div className="absolute inset-0 cursor-crosshair pointer-events-auto" onClick={handleClick} />
      )}

      {/* Markers — always interactive unless hidden */}
      {!markersHidden && slideComments.map(c => (
        <CommentMarker
          key={c.id}
          comment={c}
          isActive={activeComment === c.id}
          onClick={() => { setActiveComment(activeComment === c.id ? null : c.id); setNewComment(null) }}
        />
      ))}

      {!markersHidden && activeComment && slideComments.find(c => c.id === activeComment) && (
        <CommentPopover
          comment={slideComments.find(c => c.id === activeComment)!}
          onClose={() => setActiveComment(null)}
          onEdit={text => onEditComment(activeComment, text)}
          onDelete={() => { onDeleteComment(activeComment); setActiveComment(null) }}
          onReply={(name, text) => onAddReply(activeComment, name, text)}
          onDeleteReply={replyId => onDeleteReply(activeComment, replyId)}
          onFlag={flagged => onFlagComment(activeComment, flagged)}
          onResolve={resolved => onResolveComment(activeComment, resolved)}
        />
      )}

      {newComment && (
        <NewCommentFlow
          x={newComment.x}
          y={newComment.y}
          onSubmit={(name, text, email) => {
            onAddComment(slideIndex, newComment.x, newComment.y, name, text, email)
            setNewComment(null)
          }}
          onCancel={() => setNewComment(null)}
        />
      )}
    </div>
  )
}
