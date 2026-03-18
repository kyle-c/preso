'use client'

import { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react'
import type { SlideData, ChartSpec } from './slide-renderer'
import { SlideChartViz } from './slide-chart'
import type { PresentationDocument, PresentationOutline } from '@/lib/studio-db'
import type { Comment } from '@/components/slide-comments'
import { useSlideTranslation, type Locale } from '@/components/slide-translation'
import { AgentCursors, type CursorMode } from './agent-cursor'
import { parseInlineContent, isStandaloneLink, extractYouTubeId, extractLoomId, serviceLabel, type LinkService, type ParsedLink } from '@/lib/link-utils'
import { processFileToUpload, type UploadedFile } from './file-uploader'
import { SelectionTooltip } from './selection-tooltip'
import { ACCEPT } from './file-uploader'

/* ═══════════════════════════════════════════════════════════ */
/*                   SECTION FILE ATTACHMENTS                   */
/* ═══════════════════════════════════════════════════════════ */

export type SectionFilesMap = Record<number, UploadedFile[]>

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function SectionDropZone({ sectionIndex, files, onFilesChange }: {
  sectionIndex: number
  files: UploadedFile[]
  onFilesChange: (sectionIndex: number, files: UploadedFile[]) => void
}) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const toProcess = Array.from(fileList).slice(0, 10 - files.length)
    const results = await Promise.all(toProcess.map(processFileToUpload))
    const valid = results.filter(Boolean) as UploadedFile[]
    if (valid.length > 0) onFilesChange(sectionIndex, [...files, ...valid])
  }, [files, sectionIndex, onFilesChange])

  const removeFile = useCallback((id: string) => {
    onFilesChange(sectionIndex, files.filter(f => f.id !== id))
  }, [files, sectionIndex, onFilesChange])

  return (
    <div
      className="mt-4"
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }}
      onDrop={(e) => {
        e.preventDefault(); e.stopPropagation(); setDragOver(false)
        if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
      }}
    >
      {/* Attached files */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="group/file relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/[0.03] ring-1 ring-slate-950/[0.06] text-xs"
            >
              {file.type === 'image' && file.preview ? (
                <div className="w-6 h-6 rounded overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <svg className={`w-4 h-4 shrink-0 ${file.type === 'data' ? 'text-cactus/60' : 'text-slate-950/30'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              )}
              <span className="text-slate-950/50 truncate max-w-[120px]">{file.name}</span>
              <span className="text-slate-950/25">{formatFileSize(file.size)}</span>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="ml-0.5 text-slate-950/20 hover:text-red-500 transition-colors opacity-0 group-hover/file:opacity-100"
                aria-label={`Remove ${file.name}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop target — subtle dashed border, more visible on drag */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed transition-all duration-200 text-xs ${
          dragOver
            ? 'border-evergreen/40 bg-evergreen/[0.04] text-evergreen/60'
            : files.length > 0
              ? 'border-transparent text-transparent hover:border-slate-950/[0.08] hover:text-slate-950/25'
              : 'border-slate-950/[0.06] text-slate-950/20 hover:border-slate-950/[0.12] hover:text-slate-950/30'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
        </svg>
        {dragOver ? 'Drop files here' : files.length > 0 ? 'Add more files' : 'Drop reference files here'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files)
          e.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     COMMENT THREAD                          */
/* ═══════════════════════════════════════════════════════════ */

const COMMENT_COLORS = [
  { bg: '#6060BF', name: 'blueberry' },
  { bg: '#60D06F', name: 'cactus' },
  { bg: '#F19D38', name: 'mango' },
  { bg: '#F26629', name: 'papaya' },
  { bg: '#2BF2F1', name: 'turquoise' },
]

function pickColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  return COMMENT_COLORS[Math.abs(hash) % COMMENT_COLORS.length]
}

export interface CommentActions {
  comments: Comment[]
  addComment: (slideIndex: number, x: number, y: number, name: string, text: string, email?: string) => Promise<Comment>
  deleteComment: (id: string) => Promise<void>
  editComment: (id: string, text: string) => Promise<void>
  addReply: (commentId: string, name: string, text: string) => Promise<void>
  deleteReply: (commentId: string, replyId: string) => Promise<void>
  flagComment: (id: string, flagged: boolean) => Promise<void>
  resolveComment?: (id: string, resolved: boolean) => Promise<void>
}

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

function formatTime(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Notion-style margin comment thread for outline/document views */
function CommentThread({ slideIndex, commentActions }: { slideIndex: number; commentActions: CommentActions }) {
  const slideComments = commentActions.comments.filter(c => c.slideIndex === slideIndex)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newText, setNewText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const replyRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { if (showAdd) inputRef.current?.focus() }, [showAdd])
  useEffect(() => { if (replyingTo) replyRef.current?.focus() }, [replyingTo])

  const identity = typeof window !== 'undefined' ? loadIdentity() : null

  const handleAdd = async () => {
    if (!newText.trim()) return
    const id = identity || { name: 'Anonymous' }
    if (!identity) saveIdentity(id)
    // Place comments along the right margin so they're visible as markers in present mode
    const existing = commentActions.comments.filter(c => c.slideIndex === slideIndex && !c.resolved)
    const yOffset = 15 + (existing.length % 6) * 12
    const c = await commentActions.addComment(slideIndex, 88, yOffset, id.name, newText.trim(), id.email)
    setNewText('')
    setShowAdd(false)
    setExpanded(c.id)
  }

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return
    const id = identity || { name: 'Anonymous' }
    await commentActions.addReply(commentId, id.name, replyText.trim())
    setReplyText('')
    setReplyingTo(null)
  }

  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return
    await commentActions.editComment(commentId, editText.trim())
    setEditingId(null)
    setEditText('')
  }

  if (slideComments.length === 0 && !showAdd) {
    return (
      <button
        type="button"
        onClick={() => setShowAdd(true)}
        className="group/add flex items-center gap-1 text-sm text-transparent hover:text-concrete transition-colors py-1"
      >
        <svg className="w-4 h-4 text-concrete/0 group-hover/add:text-concrete transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Comment
      </button>
    )
  }

  return (
    <div className="space-y-2">
      {slideComments.map(c => {
        const color = pickColor(c.id)
        const isExpanded = expanded === c.id

        return (
          <div key={c.id}>
            {/* Collapsed: avatar row */}
            <button
              type="button"
              onClick={() => setExpanded(isExpanded ? null : c.id)}
              className={`w-full text-left flex items-start gap-2 py-1.5 px-2 -mx-2 rounded-lg transition-colors ${isExpanded ? 'bg-slate-950/[0.03]' : 'hover:bg-slate-950/[0.03]'}`}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                style={{ backgroundColor: color.bg }}
              >
                {c.name.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-950/70">{c.name}</span>
                  <span className="text-xs text-concrete">{formatTime(c.timestamp)}</span>
                  {c.flaggedForRebuild && <span className="text-[10px] font-bold text-orange-500">⚑</span>}
                  {c.replies.length > 0 && <span className="text-xs text-concrete">{c.replies.length} {c.replies.length === 1 ? 'reply' : 'replies'}</span>}
                </div>
                <p className={`text-sm text-slate-950/60 leading-snug ${isExpanded ? '' : 'line-clamp-2'}`}>{c.text}</p>
              </div>
            </button>

            {/* Expanded: full thread */}
            {isExpanded && (
              <div className="ml-7 mt-1 space-y-2 pb-2">
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setReplyingTo(c.id)} className="text-xs text-concrete hover:text-evergreen font-medium transition-colors">Reply</button>
                  <button type="button" onClick={() => { setEditingId(c.id); setEditText(c.text) }} className="text-xs text-concrete hover:text-slate-950/60 transition-colors">Edit</button>
                  <button type="button" onClick={() => commentActions.flagComment(c.id, !c.flaggedForRebuild)} className={`text-xs transition-colors ${c.flaggedForRebuild ? 'text-orange-500' : 'text-concrete hover:text-orange-500'}`}>{c.flaggedForRebuild ? 'Unflag' : 'Flag'}</button>
                  {commentActions.resolveComment && (
                    <button type="button" onClick={() => { commentActions.resolveComment!(c.id, !c.resolved); setExpanded(null) }} className={`text-xs transition-colors ${c.resolved ? 'text-cactus' : 'text-concrete hover:text-cactus'}`}>{c.resolved ? 'Unresolve' : 'Resolve'}</button>
                  )}
                  <button type="button" onClick={() => { commentActions.deleteComment(c.id); setExpanded(null) }} className="text-xs text-concrete hover:text-red-500 transition-colors">Delete</button>
                </div>

                {/* Edit form */}
                {editingId === c.id && (
                  <div className="space-y-1.5">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="w-full text-sm bg-white border border-slate-950/10 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-evergreen/30"
                      rows={2}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleEdit(c.id) }}
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(c.id)} className="text-xs text-evergreen font-semibold">Save</button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-xs text-concrete">Cancel</button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {c.replies.map(r => (
                  <div key={r.id} className="flex items-start gap-1.5">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-slate-950/60">{r.name}</span>{' '}
                      <span className="text-xs text-concrete">{formatTime(r.timestamp)}</span>
                      <p className="text-sm text-slate-950/50 leading-snug">{r.text}</p>
                    </div>
                    <button type="button" onClick={() => commentActions.deleteReply(c.id, r.id)} className="text-xs text-concrete hover:text-red-500 shrink-0 mt-0.5">×</button>
                  </div>
                ))}

                {/* Reply input */}
                {replyingTo === c.id && (
                  <div className="space-y-1.5">
                    <textarea
                      ref={replyRef}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Reply..."
                      className="w-full text-sm bg-white border border-slate-950/10 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-evergreen/30"
                      rows={1}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleReply(c.id)
                        if (e.key === 'Escape') { setReplyingTo(null); setReplyText('') }
                      }}
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleReply(c.id)} className="text-xs text-evergreen font-semibold">Reply</button>
                      <button type="button" onClick={() => { setReplyingTo(null); setReplyText('') }} className="text-xs text-concrete">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Add new comment */}
      {showAdd ? (
        <div className="space-y-1.5 px-2 -mx-2">
          <textarea
            ref={inputRef}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full text-sm bg-white border border-slate-950/10 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-evergreen/30"
            rows={2}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd()
              if (e.key === 'Escape') { setShowAdd(false); setNewText('') }
            }}
          />
          <div className="flex gap-2">
            <button type="button" onClick={handleAdd} className="text-xs text-evergreen font-semibold">Post</button>
            <button type="button" onClick={() => { setShowAdd(false); setNewText('') }} className="text-xs text-concrete">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 text-sm text-concrete hover:text-evergreen transition-colors py-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     OUTLINE VIEW                            */
/* ═══════════════════════════════════════════════════════════ */

const SLIDE_TYPE_LABELS: Record<string, string> = {
  title: 'Title',
  section: 'Section',
  content: 'Content',
  bullets: 'Bullets',
  'two-column': 'Two Column',
  cards: 'Cards',
  quote: 'Quote',
  image: 'Image',
  checklist: 'Checklist',
  closing: 'Closing',
  chart: 'Chart',
}

function parseBoldToJSX(text: string): React.ReactNode {
  // If the entire text is wrapped in bold, strip it (AI often bolds full paragraphs)
  const stripped = text.trim()
  if (stripped.startsWith('**') && stripped.endsWith('**') && stripped.slice(2, -2).indexOf('**') === -1) {
    return stripped.slice(2, -2)
  }
  const segments = parseInlineContent(text)
  if (segments.length === 1 && segments[0].type === 'text') return text
  return segments.map((seg, i) => {
    if (seg.type === 'bold') return <strong key={i} className="font-semibold">{seg.content}</strong>
    if (seg.type === 'link') return <a key={i} href={seg.url} target="_blank" rel="noopener noreferrer" className="text-evergreen hover:text-evergreen/80 underline decoration-evergreen/30 underline-offset-2 hover:decoration-evergreen/60 transition-colors">{seg.content}</a>
    return <span key={i}>{seg.content}</span>
  })
}

/* ── Add Comment Button — floating icon that opens inline add flow ── */
function AddCommentInline({ slideIndex, commentActions }: { slideIndex: number; commentActions: CommentActions }) {
  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState<'identity' | 'form'>('identity')
  const [identity, setIdentity] = useState<{ name: string; email?: string } | null>(null)
  const [newText, setNewText] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showForm) {
      const stored = loadIdentity()
      if (stored) {
        setIdentity(stored)
        setStep('form')
        setTimeout(() => inputRef.current?.focus(), 50)
      } else {
        setStep('identity')
        setTimeout(() => nameRef.current?.focus(), 50)
      }
    }
  }, [showForm])

  useEffect(() => {
    if (!showForm) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowForm(false)
        setNewText('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showForm])

  const handleIdentity = (name: string, email?: string) => {
    const id = { name, email }
    saveIdentity(id)
    setIdentity(id)
    setStep('form')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleAdd = async () => {
    if (!newText.trim() || !identity) return
    // Place comments along the right margin so they don't stack on top of each other in present mode
    const existing = commentActions.comments.filter(c => c.slideIndex === slideIndex && !c.resolved)
    const yOffset = 15 + (existing.length % 6) * 12 // 15%, 27%, 39%, 51%, 63%, 75%
    await commentActions.addComment(slideIndex, 88, yOffset, identity.name, newText.trim(), identity.email)
    setNewText('')
    setShowForm(false)
  }

  if (showForm) {
    return (
      <div ref={containerRef} className="relative">
        <div className="absolute right-0 top-0 z-30 w-64 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
          {step === 'identity' ? (
            <IdentityForm
              nameRef={nameRef}
              onSubmit={handleIdentity}
              onCancel={() => { setShowForm(false); setNewText('') }}
            />
          ) : identity ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-white/30">Commenting as <span className="text-white/60 font-medium">{identity.name}</span></p>
                <button onClick={() => setStep('identity')} className="text-[10px] text-white/20 hover:text-white/50 transition-colors">Change</button>
              </div>
              <textarea
                ref={inputRef}
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Leave a comment..."
                className="w-full text-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2 resize-none text-white placeholder:text-white/30 outline-none focus:border-white/40"
                rows={2}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd()
                  if (e.key === 'Escape') { setShowForm(false); setNewText('') }
                }}
              />
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={() => { setShowForm(false); setNewText('') }} className="text-xs text-white/40 hover:text-white/60 px-2 py-1 transition-colors">Cancel</button>
                <button type="button" onClick={handleAdd} disabled={!newText.trim()} className="text-xs text-turquoise font-medium px-2 py-1 disabled:opacity-30 hover:text-turquoise/80 transition-colors">Post</button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setShowForm(true)}
      className="w-7 h-7 rounded-full flex items-center justify-center text-concrete/60 hover:text-evergreen hover:bg-evergreen/10 transition-all"
      aria-label="Add comment"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
      </svg>
    </button>
  )
}

/** Shared identity form for comment flows — matches presentation mode styling */
function IdentityForm({ nameRef, onSubmit, onCancel }: { nameRef?: React.RefObject<HTMLInputElement | null>; onSubmit: (name: string, email?: string) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!name.trim()) return
        onSubmit(name.trim(), email.trim() || undefined)
      }}
      className="space-y-2"
    >
      <p className="text-xs text-white/40 mb-2">Who are you?</p>
      <input
        ref={nameRef}
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
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 px-3 py-1.5 rounded-lg bg-turquoise/20 text-turquoise text-sm font-medium disabled:opacity-30 hover:bg-turquoise/30 transition-colors"
        >
          Continue
        </button>
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/60 transition-colors">Cancel</button>
      </div>
    </form>
  )
}

/* ── Outline Comment Bubbles — stacked markers per section ── */

function OutlineCommentBubbles({ slideIndex, commentActions }: { slideIndex: number; commentActions: CommentActions }) {
  const slideComments = commentActions.comments.filter(c => c.slideIndex === slideIndex && !c.resolved)
  const [fanned, setFanned] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const identity = typeof window !== 'undefined' ? loadIdentity() : null

  useEffect(() => {
    if (!activeId && !fanned) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveId(null)
        setFanned(false)
        setEditingId(null)
        setReplyingTo(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [activeId, fanned])

  if (slideComments.length === 0) return null

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return
    const id = identity || { name: 'Anonymous' }
    await commentActions.addReply(commentId, id.name, replyText.trim())
    setReplyText('')
    setReplyingTo(null)
  }

  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return
    await commentActions.editComment(commentId, editText.trim())
    setEditingId(null)
    setEditText('')
  }

  const activeComment = activeId ? slideComments.find(c => c.id === activeId) : null

  return (
    <div ref={containerRef} className="relative flex items-center">
      <div className="relative flex items-center" style={{ height: 32 }}>
        {slideComments.length === 1 ? (
          (() => {
            const c = slideComments[0]
            const color = pickColor(c.id)
            return (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveId(activeId === c.id ? null : c.id) }}
                className="relative group/marker"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md transition-transform duration-200 group-hover/marker:scale-110"
                  style={{ backgroundColor: color.bg, outline: c.flaggedForRebuild ? '2px solid #F26629' : 'none', outlineOffset: '2px' }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                {c.replies.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[9px] font-bold text-slate-900 flex items-center justify-center shadow">
                    {c.replies.length}
                  </div>
                )}
              </button>
            )
          })()
        ) : !fanned ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFanned(true) }}
            className="relative group/stack"
            style={{ width: 32, height: 32 + (slideComments.length - 1) * 10 }}
          >
            {slideComments.map((c, i) => {
              const color = pickColor(c.id)
              return (
                <div
                  key={c.id}
                  className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md transition-all duration-200 group-hover/stack:translate-y-0.5"
                  style={{
                    backgroundColor: color.bg,
                    top: i * 10,
                    zIndex: slideComments.length - i,
                    outline: c.flaggedForRebuild ? '2px solid #F26629' : 'none',
                    outlineOffset: '2px',
                  }}
                >
                  {i === 0 && c.name.charAt(0).toUpperCase()}
                </div>
              )
            })}
            <div
              className="absolute -right-1 w-5 h-5 rounded-full bg-slate-900 text-[10px] font-bold text-white flex items-center justify-center shadow-md"
              style={{ top: -4, zIndex: slideComments.length + 1 }}
            >
              {slideComments.length}
            </div>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-1.5" style={{ animation: 'comment-fan-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
            {slideComments.map((c, i) => {
              const color = pickColor(c.id)
              const isActive = activeId === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : c.id); setEditingId(null); setReplyingTo(null) }}
                  className="relative group/marker"
                  style={{ animation: `comment-bounce-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 50}ms both` }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md transition-all duration-200 group-hover/marker:scale-110 ${isActive ? 'ring-2 ring-offset-2 ring-offset-white scale-110' : ''}`}
                    style={{
                      backgroundColor: color.bg,
                      outline: c.flaggedForRebuild && !isActive ? '2px solid #F26629' : 'none',
                      outlineOffset: '2px',
                    }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  {c.replies.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[9px] font-bold text-slate-900 flex items-center justify-center shadow">
                      {c.replies.length}
                    </div>
                  )}
                </button>
              )
            })}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFanned(false); setActiveId(null) }}
              className="w-6 h-6 rounded-full bg-slate-950/5 hover:bg-slate-950/10 flex items-center justify-center transition-colors"
              style={{ animation: 'comment-bounce-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms both' }}
            >
              <svg className="w-3 h-3 text-slate-950/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Popover for active comment */}
      {activeComment && (
        <div
          className="absolute top-full right-0 mt-2 z-[300] w-72 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pt-3 pb-2 flex items-start gap-2.5">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: pickColor(activeComment.id).bg }}
            >
              {activeComment.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white/90">{activeComment.name}</span>
                <span className="text-xs text-white/30">{formatTime(activeComment.timestamp)}</span>
              </div>
              {editingId === activeComment.id ? (
                <div className="mt-1.5">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full text-sm bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white/90 resize-none focus:outline-none focus:ring-1 focus:ring-turquoise/30"
                    rows={2}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleEdit(activeComment.id) }}
                  />
                  <div className="flex gap-2 mt-1.5">
                    <button type="button" onClick={() => handleEdit(activeComment.id)} className="text-xs text-turquoise font-semibold">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-xs text-white/30">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/70 leading-snug mt-0.5">{activeComment.text}</p>
              )}
            </div>
            <button type="button" onClick={() => { setActiveId(null); setEditingId(null); setReplyingTo(null) }} className="text-white/30 hover:text-white/60 transition-colors shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 pb-2">
            <button
              type="button"
              onClick={() => commentActions.flagComment(activeComment.id, !activeComment.flaggedForRebuild)}
              className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors ${
                activeComment.flaggedForRebuild
                  ? 'bg-papaya/20 text-papaya font-semibold'
                  : 'bg-white/5 text-white/30 hover:bg-white/10'
              }`}
            >
              {activeComment.flaggedForRebuild ? 'Flagged for rebuild' : 'Flag for rebuild'}
            </button>
          </div>

          <div className="px-4 pb-2 flex items-center gap-3">
            <button type="button" onClick={() => { setReplyingTo(activeComment.id); setEditingId(null) }} className="text-xs text-turquoise hover:text-turquoise/80 font-medium transition-colors">Reply</button>
            {editingId !== activeComment.id && (
              <button type="button" onClick={() => { setEditingId(activeComment.id); setEditText(activeComment.text); setReplyingTo(null) }} className="text-xs text-white/30 hover:text-white/60 transition-colors">Edit</button>
            )}
            {commentActions.resolveComment && (
              <button type="button" onClick={() => { commentActions.resolveComment!(activeComment.id, true); setActiveId(null) }} className="text-xs text-white/30 hover:text-cactus transition-colors">Resolve</button>
            )}
            <button type="button" onClick={() => { commentActions.deleteComment(activeComment.id); setActiveId(null) }} className="text-xs text-white/30 hover:text-red-400 transition-colors">Delete</button>
          </div>

          {activeComment.replies.length > 0 && (
            <div className="border-t border-white/10 px-4 py-2 space-y-2">
              {activeComment.replies.map(r => (
                <div key={r.id} className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-white/60">{r.name}</span>{' '}
                    <span className="text-[10px] text-white/25">{formatTime(r.timestamp)}</span>
                    <p className="text-xs text-white/50 leading-snug">{r.text}</p>
                  </div>
                  <button type="button" onClick={() => commentActions.deleteReply(activeComment.id, r.id)} className="text-[10px] text-white/20 hover:text-red-400 shrink-0">×</button>
                </div>
              ))}
            </div>
          )}

          {replyingTo === activeComment.id && (
            <div className="border-t border-white/10 px-4 py-2.5">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Reply..."
                className="w-full text-sm bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white/90 resize-none focus:outline-none focus:ring-1 focus:ring-turquoise/30 placeholder:text-white/20"
                rows={1}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleReply(activeComment.id)
                  if (e.key === 'Escape') { setReplyingTo(null); setReplyText('') }
                }}
              />
              <div className="flex gap-2 mt-1.5">
                <button type="button" onClick={() => handleReply(activeComment.id)} className="text-xs text-turquoise font-semibold">Reply</button>
                <button type="button" onClick={() => { setReplyingTo(null); setReplyText('') }} className="text-xs text-white/30">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export interface OutlineEditPanelProps {
  editPrompt: string
  onPromptChange: (p: string) => void
  editScope: 'slide' | 'comments' | 'deck'
  onScopeChange: (s: 'slide' | 'comments' | 'deck') => void
  onGenerate: (visibleSectionIndex: number) => void
  generating: boolean
  comments: { id: string; slideIndex: number; x: number; y: number; name: string; email?: string; text: string; timestamp: number; replies: { id: string; name: string; text: string; timestamp: number }[]; flaggedForRebuild?: boolean; resolved?: boolean }[]
  commentsLoading: boolean
  flaggedIds: Set<string>
  onToggleFlag: (id: string) => void
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

interface OutlineViewProps {
  slides: SlideData[]
  currentSlide: number
  onGoToSlide: (index: number) => void
  onSlidesChange?: (slides: SlideData[]) => void
  onRebuild?: () => void
  onExit?: () => void
  commentActions?: CommentActions
  commentMode?: boolean
  locale?: Locale
  /** LLM-generated structured outline — when present, replaces slide-based outline */
  outline?: PresentationOutline | null
  /** Called when outline is edited inline */
  onOutlineChange?: (outline: PresentationOutline) => void
  /** AI edit via text selection */
  onAIEdit?: (prompt: string, selectionContext: { sectionIndex: number; selectedText: string }) => void
  /** Edit panel props for the right-column AI edit panel */
  editPanel?: OutlineEditPanelProps
  /** Per-section file attachments (for rebuild context) */
  sectionFiles?: SectionFilesMap
  onSectionFilesChange?: (sectionIndex: number, files: UploadedFile[]) => void
}

/** Convert **bold** and [text](url) markdown to HTML, stripping bold when entire text is wrapped */
function boldToHtml(text: string): string {
  if (!text) return ''
  const stripped = text.trim()
  if (stripped.startsWith('**') && stripped.endsWith('**') && stripped.slice(2, -2).indexOf('**') === -1) {
    return stripped.slice(2, -2)
  }
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-evergreen underline">$1</a>')
}

/** Convert HTML <strong> and <a> back to markdown */
function htmlToBold(html: string): string {
  if (!html) return ''
  return html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

/** Editable focus styling */
const editFocusCls = 'outline-none focus:ring-1 focus:ring-evergreen/30 focus:bg-evergreen/[0.03] rounded-lg -mx-2 px-2 -my-0.5 py-0.5 transition-colors cursor-text'

/** Shared editable props for contentEditable elements */
function useEditableHandlers(onChange: (text: string) => void) {
  return {
    contentEditable: true as const,
    suppressContentEditableWarning: true as const,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const newText = htmlToBold(e.currentTarget.innerHTML)
      onChange(newText)
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        ;(e.target as HTMLElement).blur()
      }
    },
  }
}

/** Convert structured slide data into a markdown string for display */
function slideToMarkdown(slide: SlideData): string {
  const parts: string[] = []

  if (slide.subtitle) parts.push(slide.subtitle)
  if (slide.body) parts.push(slide.body)

  if (slide.bullets && slide.bullets.length > 0) {
    parts.push(slide.bullets.map(b => `- ${b.text}`).join('\n'))
  }

  if (slide.columns && slide.columns.length > 0) {
    slide.columns.forEach(col => {
      if (col.heading) parts.push(`### ${col.heading}`)
      if (col.body) parts.push(col.body)
      if (col.bullets && col.bullets.length > 0) {
        parts.push(col.bullets.map(b => `- ${b.text}`).join('\n'))
      }
    })
  }

  if (slide.cards && slide.cards.length > 0) {
    slide.cards.forEach(card => {
      parts.push(`### ${card.title}`)
      if (card.body) parts.push(card.body)
    })
  }

  if (slide.quote) {
    parts.push(`> ${slide.quote.text}`)
    if (slide.quote.attribution) parts.push(`— ${slide.quote.attribution}`)
  }

  return parts.join('\n\n')
}

export function OutlineView({ slides, currentSlide, onGoToSlide, onSlidesChange, onRebuild, onExit, commentActions, commentMode, locale, outline, onOutlineChange, onAIEdit, editPanel, sectionFiles, onSectionFilesChange }: OutlineViewProps) {
  const activeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(containerRef, locale ?? 'en-US', slides.length)
  const [dirty, setDirty] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [visibleSection, setVisibleSection] = useState(0)
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentSlide])

  // Track which section is most visible via IntersectionObserver
  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return
    const entries = new Map<number, number>()
    const observer = new IntersectionObserver(
      (ioEntries) => {
        for (const entry of ioEntries) {
          const idx = Number((entry.target as HTMLElement).dataset.sectionIndex)
          if (!isNaN(idx)) entries.set(idx, entry.intersectionRatio)
        }
        let best = 0, bestRatio = 0
        entries.forEach((ratio, idx) => {
          if (ratio > bestRatio) { best = idx; bestRatio = ratio }
        })
        setVisibleSection(best)
      },
      { root: scrollEl, threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [outline?.sections.length, slides.length])


  const editable = !!onSlidesChange
  const outlineEditable = !!onOutlineChange && !!outline

  const updateSlide = useCallback((index: number, patch: Partial<SlideData>) => {
    if (!onSlidesChange) return
    const updated = slides.map((s, i) => i === index ? { ...s, ...patch } : s)
    onSlidesChange(updated)
    setDirty(true)
  }, [slides, onSlidesChange])

  const updateOutlineSection = useCallback((sectionIndex: number, patch: Partial<PresentationOutline['sections'][0]>) => {
    if (!onOutlineChange || !outline) return
    const newSections = outline.sections.map((s, i) => i === sectionIndex ? { ...s, ...patch } : s)
    onOutlineChange({ ...outline, sections: newSections })
    setDirty(true)
  }, [outline, onOutlineChange])

  const updateOutlineSubsection = useCallback((sectionIndex: number, subIndex: number, patch: Partial<{ title: string; detail: string }>) => {
    if (!onOutlineChange || !outline) return
    const section = outline.sections[sectionIndex]
    if (!section.subsections) return
    const newSubs = section.subsections.map((sub, i) => i === subIndex ? { ...sub, ...patch } : sub)
    const newSections = outline.sections.map((s, i) => i === sectionIndex ? { ...s, subsections: newSubs } : s)
    onOutlineChange({ ...outline, sections: newSections })
    setDirty(true)
  }, [outline, onOutlineChange])

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    const fromIndex = dragIndex
    if (fromIndex === null || fromIndex === toIndex || !onSlidesChange) return

    const reordered = [...slides]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    onSlidesChange(reordered)
    setDirty(true)
    setDragIndex(null)
    setDragOverIndex(null)
  }, [dragIndex, slides, onSlidesChange])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[180] bg-linen overflow-y-auto" data-view="outline">
      <div className="flex h-full">
        {/* Main content */}
        <div ref={scrollRef} className={`flex-1 min-w-0 overflow-y-auto transition-all duration-300 ease-out relative`}>
          <div className="max-w-5xl mx-auto px-6 sm:px-12 py-20 sm:py-24">
            {/* Selection tooltip for AI edit + comment */}
            {(onAIEdit || commentActions) && (
              <SelectionTooltip
                containerRef={scrollRef}
                onAIEdit={onAIEdit}
                onAddComment={commentActions ? (sectionIndex, name, text, email) => {
                  const slideIndex = outline?.sections[sectionIndex]?.slideIndices?.[0] ?? sectionIndex
                  commentActions.addComment(slideIndex, 50, 50, name, text, email)
                } : undefined}
                generating={editPanel?.generating}
              />
            )}
            {/* Header */}
            <div className="mb-10">
              {outline ? (
                <h1
                  className={`font-display font-black text-4xl sm:text-5xl text-slate-950 leading-tight ${outlineEditable ? editFocusCls : ''}`}
                  {...(outlineEditable ? useEditableHandlers((v) => onOutlineChange!({ ...outline, title: v })) : {})}
                  dangerouslySetInnerHTML={{ __html: boldToHtml(outline.title) }}
                />
              ) : (
                <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-950 leading-tight">
                  Presentation Outline
                </h1>
              )}
              {outline?.thesis ? (
                <p
                  className={`text-base text-mocha mt-3 max-w-3xl leading-relaxed ${outlineEditable ? editFocusCls : ''}`}
                  {...(outlineEditable ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onBlur: (e: React.FocusEvent<HTMLElement>) => {
                      onOutlineChange!({ ...outline!, thesis: e.currentTarget.innerText })
                    },
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        ;(e.target as HTMLElement).blur()
                      }
                    },
                  } : {})}
                >
                  {outline.thesis}
                </p>
              ) : (
                <p className="text-base text-mocha mt-3">{slides.length} slides</p>
              )}
            </div>

            {/* Structured outline (LLM-generated) */}
            {outline ? (
              <div className="space-y-6">
                {outline.sections.map((section, si) => (
                  <div
                    key={si}
                    ref={(el) => { if (el) sectionRefs.current.set(si, el); else sectionRefs.current.delete(si) }}
                    data-section-index={si}
                    className={`relative bg-white rounded-2xl shadow-sm transition-all hover:shadow-md ${
                      editPanel?.editScope === 'slide' && visibleSection === si
                        ? 'ring-2 ring-evergreen/40 shadow-evergreen/5'
                        : 'ring-1 ring-slate-950/[0.06]'
                    }`}
                  >
                    <div className="px-7 py-7 sm:px-9">
                      <div className="flex items-start gap-5">
                        <span className="font-display font-black text-lg text-concrete shrink-0 pt-0.5">
                          {String(si + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h2
                            className={`font-display font-bold text-xl sm:text-2xl leading-snug text-slate-950 ${outlineEditable ? editFocusCls : ''}`}
                            {...(outlineEditable ? useEditableHandlers((v) => updateOutlineSection(si, { title: v })) : {})}
                            dangerouslySetInnerHTML={{ __html: boldToHtml(section.title) }}
                          />
                          <p
                            className={`mt-2 text-[15px] text-slate-950/60 leading-relaxed ${outlineEditable ? editFocusCls : ''}`}
                            {...(outlineEditable ? {
                              contentEditable: true,
                              suppressContentEditableWarning: true,
                              onBlur: (e: React.FocusEvent<HTMLElement>) => {
                                updateOutlineSection(si, { summary: e.currentTarget.innerText })
                              },
                              onKeyDown: (e: React.KeyboardEvent) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault()
                                  ;(e.target as HTMLElement).blur()
                                }
                              },
                            } : {})}
                          >
                            {section.summary}
                          </p>

                          {section.subsections && section.subsections.length > 0 && (
                            <div className="mt-4 space-y-2.5">
                              {section.subsections.map((sub, ssi) => (
                                <div key={ssi} className="flex gap-3 items-start">
                                  <span className="w-1.5 h-1.5 rounded-full bg-evergreen/40 mt-2 shrink-0" />
                                  <div className={`min-w-0 ${outlineEditable ? editFocusCls : ''}`}
                                    {...(outlineEditable ? {
                                      contentEditable: true,
                                      suppressContentEditableWarning: true,
                                      onBlur: (e: React.FocusEvent<HTMLElement>) => {
                                        const raw = e.currentTarget.innerText
                                        const dashIdx = raw.indexOf('—')
                                        if (dashIdx > 0) {
                                          updateOutlineSubsection(si, ssi, { title: raw.slice(0, dashIdx).trim(), detail: raw.slice(dashIdx + 1).trim() })
                                        } else {
                                          updateOutlineSubsection(si, ssi, { title: raw.trim(), detail: '' })
                                        }
                                      },
                                      onKeyDown: (e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault()
                                          ;(e.target as HTMLElement).blur()
                                        }
                                      },
                                    } : {})}
                                  >
                                    <span className="font-semibold text-sm text-slate-950/80">{sub.title}</span>
                                    {sub.detail && (
                                      <span className="text-sm text-slate-950/50 ml-1.5">— {sub.detail}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Chart thumbnails for slides in this section */}
                          {section.slideIndices && (() => {
                            const chartsInSection = section.slideIndices
                              .filter(idx => slides[idx]?.chart)
                              .map(idx => ({ idx, chart: slides[idx].chart! }))
                            if (chartsInSection.length === 0) return null
                            return (
                              <div className="mt-4 space-y-3">
                                {chartsInSection.map(({ idx, chart }) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => onGoToSlide(idx)}
                                    className="w-full rounded-xl bg-slate-950/[0.03] ring-1 ring-slate-950/[0.06] p-3 overflow-hidden hover:ring-evergreen/30 transition-all text-left"
                                  >
                                    <div className="h-32">
                                      <SlideChartViz chart={chart} dark={false} />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )
                          })()}

                          {/* Slide references */}
                          {section.slideIndices && section.slideIndices.length > 0 && (
                            <div className="mt-4 flex items-center gap-1.5">
                              <span className="text-[11px] text-concrete uppercase tracking-wider">Slides:</span>
                              {section.slideIndices.map(idx => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => onGoToSlide(idx)}
                                  className="text-[11px] font-semibold text-evergreen bg-evergreen/10 px-2 py-0.5 rounded-full hover:bg-evergreen/20 transition-colors"
                                >
                                  {idx + 1}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Section file attachments */}
                          {onSectionFilesChange && (
                            <SectionDropZone
                              sectionIndex={si}
                              files={sectionFiles?.[si] ?? []}
                              onFilesChange={onSectionFilesChange}
                            />
                          )}
                        </div>

                        {/* Add comment button (visible on focused section) */}
                        {commentActions && section.slideIndices && section.slideIndices.length > 0 && (
                          <div className={`absolute right-3 top-3 transition-opacity duration-200 ${visibleSection === si ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <AddCommentInline slideIndex={section.slideIndices[0]} commentActions={commentActions} />
                          </div>
                        )}

                        {/* Existing comment bubbles (always visible) */}
                        {commentActions && section.slideIndices && section.slideIndices.length > 0 && (() => {
                          const representativeSlide = section.slideIndices[0]
                          const sectionComments = commentActions.comments.filter(c => section.slideIndices.includes(c.slideIndex) && !c.resolved)
                          if (sectionComments.length === 0) return null
                          return (
                            <div className="absolute -right-3 top-7 translate-x-full z-[200]">
                              <OutlineCommentBubbles slideIndex={representativeSlide} commentActions={{
                                ...commentActions,
                                comments: sectionComments.map(c => ({ ...c, slideIndex: representativeSlide })),
                              }} />
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Slide-based outline (fallback) */
              <div className="space-y-5">
                {slides.map((slide, i) => {
                  const isActive = i === currentSlide
                  const isDragOver = dragOverIndex === i && dragIndex !== i
                  const markdown = slideToMarkdown(slide)

                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        if (isActive && el) (activeRef as React.MutableRefObject<HTMLDivElement | null>).current = el
                        if (el) sectionRefs.current.set(i, el); else sectionRefs.current.delete(i)
                      }}
                      data-section-index={i}
                      draggable={editable}
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDrop={(e) => handleDrop(e, i)}
                      className={`group relative bg-white rounded-2xl shadow-sm transition-all hover:shadow-md ${
                        isDragOver
                          ? 'ring-2 ring-evergreen/50 shadow-evergreen/10 scale-[1.01]'
                          : editPanel?.editScope === 'slide' && visibleSection === i
                            ? 'ring-2 ring-evergreen/40 shadow-evergreen/5'
                            : isActive
                              ? 'ring-2 ring-evergreen/30 shadow-evergreen/5'
                              : 'ring-1 ring-slate-950/[0.06] hover:ring-slate-950/[0.1]'
                      }`}
                    >
                      <div className="flex gap-6 px-7 py-7 sm:px-9">
                        {/* Drag handle + Slide number */}
                        <div
                          className={`flex flex-col items-center gap-1.5 pt-1 shrink-0 ${editable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                          onClick={() => onGoToSlide(i)}
                        >
                          {editable && (
                            <svg className="w-4 h-4 text-slate-950/30 group-hover:text-slate-950/50 transition-colors" viewBox="0 0 16 16" fill="currentColor">
                              <circle cx="5.5" cy="3.5" r="1.5" />
                              <circle cx="10.5" cy="3.5" r="1.5" />
                              <circle cx="5.5" cy="8" r="1.5" />
                              <circle cx="10.5" cy="8" r="1.5" />
                              <circle cx="5.5" cy="12.5" r="1.5" />
                              <circle cx="10.5" cy="12.5" r="1.5" />
                            </svg>
                          )}
                          <span className={`font-display font-black text-lg ${isActive ? 'text-evergreen' : 'text-slate-950/40'}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] text-slate-950/40 uppercase tracking-wider">
                            {SLIDE_TYPE_LABELS[slide.type] || slide.type}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {slide.badge && (
                            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-evergreen bg-evergreen/10 px-2.5 py-0.5 rounded-full mb-2.5">
                              {slide.badge}
                            </span>
                          )}

                          <h2
                            className={`font-display font-bold text-xl sm:text-2xl leading-snug ${isActive ? 'text-slate-950' : 'text-slate-950/85'} ${editable ? editFocusCls : ''}`}
                            {...(editable ? useEditableHandlers((v) => updateSlide(i, { title: v })) : {})}
                            dangerouslySetInnerHTML={{ __html: boldToHtml(slide.title) }}
                          />

                          {markdown && (
                            <div className={`mt-3 prose-felix text-slate-950/70 text-[15px] leading-relaxed ${editable ? editFocusCls + ' whitespace-pre-wrap' : 'space-y-3'}`}
                              {...(editable ? {
                                contentEditable: true,
                                suppressContentEditableWarning: true,
                                onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
                                  const text = e.currentTarget.innerText ?? ''
                                  updateSlide(i, { body: text })
                                },
                              } : {})}
                            >
                              {renderSectionContent(markdown)}
                            </div>
                          )}

                          {slide.chart && (
                            <div className="mt-4 rounded-xl bg-slate-950/[0.03] ring-1 ring-slate-950/[0.06] p-3 overflow-hidden">
                              <div className="h-36">
                                <SlideChartViz chart={slide.chart} dark={false} />
                              </div>
                            </div>
                          )}

                          {/* Section file attachments */}
                          {onSectionFilesChange && (
                            <SectionDropZone
                              sectionIndex={i}
                              files={sectionFiles?.[i] ?? []}
                              onFilesChange={onSectionFilesChange}
                            />
                          )}
                        </div>

                        {/* Add comment button (visible on focused section) */}
                        {commentActions && (
                          <div className={`absolute right-3 top-3 transition-opacity duration-200 ${visibleSection === i ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <AddCommentInline slideIndex={i} commentActions={commentActions} />
                          </div>
                        )}

                        {/* Existing comment bubbles (always visible) */}
                        {commentActions && commentActions.comments.filter(c => c.slideIndex === i && !c.resolved).length > 0 && (
                          <div className="absolute -right-3 top-7 translate-x-full z-[200]">
                            <OutlineCommentBubbles slideIndex={i} commentActions={commentActions} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        {/* Comment bubbles are now inline on each section card */}
      </div>

      {/* Fixed right-column edit panel */}
      {editPanel && (
        <div className="hidden lg:block fixed top-0 right-0 bottom-0 w-[340px] bg-linen border-l border-slate-950/[0.06] overflow-y-auto z-[190]">
          <div className="px-5 pt-20 pb-8">
            <OutlineEditPanelInline {...editPanel} visibleSection={visibleSection} outline={outline} slides={slides} />
          </div>
        </div>
      )}

      {/* Fixed exit pill — top-left, matching present mode */}
      {onExit && (
        <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[200] animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="inline-flex items-center py-1 px-1.5 backdrop-blur-sm rounded-full border border-slate-950/10 bg-white/80 gap-[3px] shadow-sm">
            <button
              type="button"
              onClick={onExit}
              className="h-7 px-2 rounded-full inline-flex items-center gap-1.5 transition-colors text-slate-950/60 hover:bg-slate-950/5"
              aria-label="Exit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="text-xs font-medium">Exit</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating rebuild button */}
      {dirty && onRebuild && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            type="button"
            onClick={() => { onRebuild(); setDirty(false) }}
            className="px-6 py-3 bg-evergreen text-white font-display font-bold text-sm rounded-full shadow-lg shadow-evergreen/25 hover:bg-evergreen/90 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rebuild Presentation
          </button>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     DOCUMENT VIEW                           */
/* ═══════════════════════════════════════════════════════════ */

/** Render markdown-like section content into structured JSX */
/** Service icon SVGs for link cards */
function ServiceIcon({ service, className = 'w-4 h-4' }: { service: LinkService | null; className?: string }) {
  switch (service) {
    case 'notion':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.486 2.35c-.42-.326-.98-.7-2.055-.607L3.36 2.86c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.213.98l14.523-.84c.84-.046.934-.56.934-1.166V6.354c0-.606-.234-.933-.747-.886l-15.177.887c-.56.046-.746.327-.746.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.607.327-1.166.514-1.633.514-.747 0-.934-.234-1.494-.933l-4.577-7.186v6.952l1.447.327s0 .84-1.166.84l-3.22.187c-.093-.187 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.454-.233 4.764 7.279v-6.44l-1.213-.14c-.094-.514.28-.886.746-.933zM2.708 1.88C4.017.934 5.792.374 7.822.28l13.076-.793c2.008-.14 2.521.467 2.521 1.586v3.219c0 .56-.234 1.027-.934 1.12l-15.176.887c-.56.046-.793.327-.793.7v14.09c0 .56-.327.84-.747.84s-.934-.14-1.307-.373L1.167 19.67c-.747-.56-1.073-1.307-1.073-2.24V4.399c0-.933.42-2.007 2.614-2.519z"/></svg>
    case 'clickup':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3.705 16.26l3.397-2.605c1.702 2.216 3.347 3.249 5.298 3.249 1.94 0 3.578-1.022 5.297-3.259l3.399 2.593c-2.468 3.222-5.2 4.966-8.696 4.966-3.485 0-6.227-1.755-8.695-4.944zM12.39 7.598l-4.906 4.357-3.302-3.725L12.4 1.204l8.198 7.026-3.302 3.725z"/></svg>
    case 'google-docs':
    case 'google-sheets':
    case 'google-slides':
    case 'google-forms':
    case 'google-drive':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm-.5 3.5h5.09L20 7.5v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-12c0-1.1.9-2 2-2h5.5zm0 1H6c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V8h-3.5c-.83 0-1.5-.67-1.5-1.5V4.5zm1 0V6.5c0 .28.22.5.5.5H15.09L12.5 4.5z"/></svg>
    case 'youtube':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    case 'figma':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zM8.148 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.588 4.539zm-.001-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019c1.665 0 3.019-1.355 3.019-3.019v-3.019H8.147zM8.148 8.981c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981H8.148zm0-7.51c-1.665 0-3.019 1.355-3.019 3.019S6.483 7.51 8.148 7.51h3.117V1.471H8.148zM8.148 16.51c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98H8.148zm0-7.509c-1.665 0-3.019 1.354-3.019 3.019 0 1.665 1.355 3.019 3.019 3.019h3.117V9.001H8.148z"/></svg>
    case 'linear':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M2.305 12.838l8.857 8.857a9.933 9.933 0 0 1-2.854-1.189L2.305 14.5c-.472-.472-.472-1.19-.001-1.662zM1.08 10.47L13.53 22.92a10.036 10.036 0 0 1-2.17-.661L1.741 12.64a1.178 1.178 0 0 1-.001-1.665l.001-.001c.012-.012.014-.014.026-.026A10.178 10.178 0 0 1 1.08 10.47zM22.92 13.53L10.47 1.08a10.036 10.036 0 0 1 2.17.661l9.619 9.619c.46.46.46 1.205.001 1.665l-.001.001-.026.026c-.148.148-.315.297-.494.478zM21.695 11.162l-8.857-8.857a9.933 9.933 0 0 1 2.854 1.189l6.003 6.003c.472.472.472 1.19.001 1.662zM12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z"/></svg>
    case 'jira':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23 .262h-11.56a5.215 5.215 0 0 0 5.215 5.214h2.129v2.057A5.215 5.215 0 0 0 24 12.748V1.262A1.001 1.001 0 0 0 23 .262z"/></svg>
    case 'confluence':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M.87 18.257c-.248.382-.53.875-.763 1.245a.764.764 0 0 0 .255 1.04l4.965 3.054a.764.764 0 0 0 1.058-.26c.199-.332.453-.76.728-1.202 1.238-1.985 2.466-1.782 4.647-.698l4.98 2.467a.764.764 0 0 0 1.028-.382l2.342-5.263a.764.764 0 0 0-.36-1.003l-4.894-2.432c-4.92-2.467-9.142-2.088-13.986 3.434zM23.131 5.743c.249-.405.531-.875.764-1.25a.764.764 0 0 0-.256-1.034L18.674.405a.764.764 0 0 0-1.058.26c-.2.331-.454.759-.728 1.202-1.238 1.985-2.466 1.781-4.647.698L7.262.098a.764.764 0 0 0-1.028.382L3.892 5.743a.764.764 0 0 0 .36 1.003l4.895 2.432c4.92 2.467 9.14 2.088 13.984-3.435z"/></svg>
    case 'github':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
    case 'loom':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 16.5v-9l7.5 4.5-7.5 4.5z"/></svg>
    case 'miro':
      return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.392 0H13.9L17 4.654 10.932 0H7.44l3.1 6.176L4.473 0H.981L4.74 8.352.027 24h3.492l3.1-8.352L10.262 24h3.492L10.262 9.698 16.632 24h3.49L13.152 6.176z"/></svg>
    default:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
  }
}

/** Render a standalone link as a rich card with service icon */
function LinkCard({ link, keyProp }: { link: ParsedLink; keyProp: number }) {
  // YouTube: render as embedded player
  const ytId = link.service === 'youtube' ? extractYouTubeId(link.url) : null
  if (ytId) {
    return (
      <div key={keyProp} className="my-3 rounded-xl overflow-hidden border border-slate-950/[0.06] bg-slate-950">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${ytId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  // Loom: render as embedded player
  const loomId = link.service === 'loom' ? extractLoomId(link.url) : null
  if (loomId) {
    return (
      <div key={keyProp} className="my-3 rounded-xl overflow-hidden border border-slate-950/[0.06] bg-slate-950">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.loom.com/embed/${loomId}`}
            title="Loom video"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  // All other services: render as a link card
  const label = link.service ? serviceLabel(link.service) : 'Link'
  return (
    <a
      key={keyProp}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link my-2 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-950/[0.06] bg-white hover:border-evergreen/30 hover:bg-evergreen/[0.02] transition-all duration-150"
    >
      <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 group-hover/link:bg-evergreen/10 flex items-center justify-center text-slate-500 group-hover/link:text-evergreen transition-colors">
        <ServiceIcon service={link.service} className="w-4.5 h-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 truncate">{link.text}</p>
        <p className="text-xs text-slate-400 truncate">{label}</p>
      </div>
      <svg className="shrink-0 w-4 h-4 text-slate-300 group-hover/link:text-evergreen/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  )
}

function renderSectionContent(content: string) {
  // Split on double newlines but also detect single-newline boundaries between block types
  const blocks: string[] = []
  const lines = content.split('\n')
  let current: string[] = []

  const flushCurrent = () => {
    if (current.length > 0) {
      blocks.push(current.join('\n'))
      current = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimLine = line.trim()

    // Empty line = block break
    if (!trimLine) {
      flushCurrent()
      continue
    }

    // Standalone link (full line is a URL or markdown link) — treat as its own block
    if (isStandaloneLink(trimLine)) {
      flushCurrent()
      blocks.push(trimLine)
      continue
    }

    // Headings always start a new block
    if (trimLine.startsWith('#')) {
      flushCurrent()
      blocks.push(trimLine)
      continue
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimLine)) {
      flushCurrent()
      blocks.push('---')
      continue
    }

    // Blockquote
    if (trimLine.startsWith('> ')) {
      // If current block isn't a blockquote, start new block
      if (current.length > 0 && !current[0].trim().startsWith('> ')) {
        flushCurrent()
      }
      current.push(line)
      continue
    }

    // Bullet list item
    if (trimLine.startsWith('- ') || trimLine.startsWith('* ')) {
      if (current.length > 0 && !current[0].trim().startsWith('- ') && !current[0].trim().startsWith('* ')) {
        flushCurrent()
      }
      current.push(line)
      continue
    }

    // Numbered list item
    if (/^\d+\.\s/.test(trimLine)) {
      if (current.length > 0 && !/^\d+\.\s/.test(current[0].trim())) {
        flushCurrent()
      }
      current.push(line)
      continue
    }

    // Table row
    if (trimLine.includes('|')) {
      if (current.length > 0 && !current[0].trim().includes('|')) {
        flushCurrent()
      }
      current.push(line)
      continue
    }

    // Regular text — continue current paragraph
    current.push(line)
  }
  flushCurrent()

  return blocks.map((block, j) => {
    const trimmed = block.trim()
    if (!trimmed) return null

    // Standalone link → render as rich card or embed
    const standaloneLink = isStandaloneLink(trimmed)
    if (standaloneLink) {
      return <LinkCard key={j} link={standaloneLink} keyProp={j} />
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      return <hr key={j} className="my-6 border-slate-950/8" />
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const quoteLines = trimmed.split('\n').map(l => l.replace(/^>\s*/, ''))
      return (
        <blockquote key={j} className="pl-4 border-l-2 border-evergreen/25 my-2">
          {quoteLines.map((line, k) => (
            <p key={k} className="text-slate-950/60 italic leading-relaxed">{parseBoldToJSX(line)}</p>
          ))}
        </blockquote>
      )
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '))
      return (
        <ul key={j} className="space-y-2 pl-0">
          {items.map((item, k) => (
            <li key={k} className="flex items-start gap-2.5">
              <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-evergreen/40" />
              <span className="leading-relaxed">{parseBoldToJSX(item.replace(/^[-*]\s*/, ''))}</span>
            </li>
          ))}
        </ul>
      )
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter(l => /^\d+\.\s/.test(l.trim()))
      return (
        <ol key={j} className="space-y-2 pl-0 list-none">
          {items.map((item, k) => (
            <li key={k} className="flex items-start gap-2.5">
              <span className="shrink-0 font-mono text-sm text-concrete mt-0.5">{k + 1}.</span>
              <span className="leading-relaxed">{parseBoldToJSX(item.replace(/^\d+\.\s*/, ''))}</span>
            </li>
          ))}
        </ol>
      )
    }

    // Sub-heading (### or ##)
    if (trimmed.startsWith('### ')) {
      return <h4 key={j} className="font-display font-semibold text-[17px] text-slate-950/80 mt-6">{parseBoldToJSX(trimmed.replace(/^###\s*/, ''))}</h4>
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={j} className="font-display font-bold text-xl text-slate-950 mt-8">{parseBoldToJSX(trimmed.replace(/^##\s*/, ''))}</h3>
    }

    // Table (markdown pipes)
    if (trimmed.includes('|') && trimmed.split('\n').length >= 2) {
      const rows = trimmed.split('\n').filter(l => l.includes('|') && !/^[\s|:-]+$/.test(l))
      if (rows.length >= 2) {
        const headers = rows[0].split('|').map(c => c.trim()).filter(Boolean)
        const dataRows = rows.slice(1).map(r => r.split('|').map(c => c.trim()).filter(Boolean))
        return (
          <div key={j} className="overflow-x-auto rounded-lg border border-slate-950/[0.06] mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-linen/50">
                  {headers.map((h, k) => (
                    <th key={k} className="text-left px-4 py-2.5 font-semibold text-slate-950/70 text-xs uppercase tracking-wider border-b border-slate-950/[0.06]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, k) => (
                  <tr key={k} className="border-b border-slate-950/[0.04] last:border-0">
                    {row.map((cell, l) => (
                      <td key={l} className="px-4 py-2.5 text-slate-950/60">{parseBoldToJSX(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    }

    // Regular paragraph — split sentences that start with bold as key-value pairs
    // Pattern: "**Key:** Value" or "**Key** — Value" renders as a definition-style item
    const kvMatch = trimmed.match(/^\*\*(.+?)\*\*[:\s—–-]+\s*(.+)$/)
    if (kvMatch) {
      return (
        <p key={j} className="leading-relaxed">
          <strong className="font-semibold text-slate-950/85">{kvMatch[1]}</strong>
          <span className="text-slate-950/40 mx-1.5">—</span>
          <span>{parseBoldToJSX(kvMatch[2])}</span>
        </p>
      )
    }

    return <p key={j} className="leading-relaxed">{parseBoldToJSX(trimmed)}</p>
  })
}

/** Skeleton placeholder shown while document is being generated — uses AgentCursors (same as slide edit overlay) */
export function DocumentSkeleton({ onExit }: { onExit: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardBounds, setCardBounds] = useState<DOMRect | null>(null)
  const [rowRects, setRowRects] = useState<DOMRect[]>([])

  useEffect(() => {
    const measure = () => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      setCardBounds(rect)

      // Create 8 virtual "row" rects spread vertically inside the card
      // Each row is a thin horizontal band the cursor will drift within
      const rowCount = 8
      const padX = rect.width * 0.06
      const padTop = rect.height * 0.06
      const usableH = rect.height * 0.88
      const rowH = usableH / rowCount
      const rects: DOMRect[] = []
      // Sporadic vertical spacing — vary each row's Y offset
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
    <div className="fixed inset-0 z-[180] bg-linen overflow-hidden" data-view="document">
      {/* Status pill */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[260]">
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
          <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse" />
          <span className="text-xs text-white/70 font-medium">Generating document...</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-20 sm:py-24">
          <div ref={cardRef} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-950/[0.06] px-10 sm:px-16 py-14 sm:py-20 relative overflow-hidden">
            {/* Title skeleton */}
            <div className="mb-12 animate-pulse">
              <div className="h-3 w-20 bg-slate-950/[0.06] rounded-full mb-5" />
              <div className="h-10 w-3/4 bg-slate-950/[0.06] rounded-lg mb-4" />
              <div className="h-5 w-full bg-slate-950/[0.04] rounded-lg mb-2" />
              <div className="h-5 w-2/3 bg-slate-950/[0.04] rounded-lg" />
              <div className="mt-8 h-px bg-slate-950/8" />
            </div>

            {/* Section skeletons */}
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="mb-10 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                {i > 0 && <hr className="mb-10 border-slate-950/6" />}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-6 bg-slate-950/[0.04] rounded" />
                  <div className="h-6 bg-slate-950/[0.06] rounded-lg" style={{ width: `${35 + (i * 13) % 30}%` }} />
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 w-full bg-slate-950/[0.04] rounded" />
                  <div className="h-4 w-full bg-slate-950/[0.04] rounded" />
                  <div className="h-4 w-5/6 bg-slate-950/[0.04] rounded" />
                  <div className="h-4 w-full bg-slate-950/[0.04] rounded" />
                  <div className="h-4 w-3/4 bg-slate-950/[0.04] rounded" />
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

      {/* Agent cursors — bounded to the white card, each assigned to a row */}
      <AgentCursors
        count={8}
        canvasBounds={cardBounds}
        cardRects={rowRects}
        mode="working"
      />
    </div>
  )
}

interface DocumentEditPanelProps {
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
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

/** Inline edit panel for document view — styled like /create homepage input */
function DocumentEditPanelInline({
  editPrompt,
  onPromptChange,
  editScope,
  onScopeChange,
  onGenerate,
  generating,
  comments,
  commentsLoading,
  flaggedIds,
  onToggleFlag,
  files,
  onFilesChange,
}: DocumentEditPanelProps) {
  const flaggedCount = flaggedIds.size
  const canGenerate = editScope === 'comments'
    ? flaggedCount > 0 && !generating
    : editPrompt.trim().length > 0 && !generating

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [editPrompt])

  const addFiles = useCallback(async (fileList: FileList) => {
    const results = await Promise.all(Array.from(fileList).map(f => processFileToUpload(f)))
    const valid = results.filter(Boolean) as UploadedFile[]
    if (valid.length > 0) onFilesChange([...files, ...valid].slice(0, 5))
  }, [files, onFilesChange])

  const removeFile = useCallback((id: string) => {
    onFilesChange(files.filter(f => f.id !== id))
  }, [files, onFilesChange])

  // Group comments by slide
  const bySlide = new Map<number, typeof comments>()
  for (const c of comments) {
    const arr = bySlide.get(c.slideIndex) ?? []
    arr.push(c)
    bySlide.set(c.slideIndex, arr)
  }
  const sortedSlides = [...bySlide.keys()].sort((a, b) => a - b)

  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-sm text-slate-950/70">Edit Presentation</h3>

      {/* Scope selector */}
      <div className="flex gap-1 p-1 bg-slate-950/[0.04] rounded-xl">
        {([
          { key: 'deck' as const, label: 'Presentation' },
          { key: 'comments' as const, label: 'Comments' },
        ]).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onScopeChange(key)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              editScope === key
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-950/40 hover:text-slate-950/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input card — /create style */}
      <div
        className={`bg-white rounded-2xl border shadow-sm transition-all ${
          dragOver
            ? 'border-concrete ring-2 ring-concrete/30'
            : 'border-slate-950/[0.08] focus-within:border-slate-950/[0.15]'
        }`}
        onDragOver={(e) => { e.preventDefault(); if (editScope === 'deck') setDragOver(true) }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false)
          if (editScope === 'deck' && e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
        }}
      >
        {editScope === 'comments' ? (
          <div className="px-4 pt-4 pb-2">
            {commentsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-4 h-4 border-2 border-evergreen/30 border-t-evergreen rounded-full animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6">
                <svg className="w-6 h-6 text-slate-950/10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <p className="text-xs text-slate-950/30">No comments yet</p>
                <p className="text-[10px] text-slate-950/20 mt-1">Press C while presenting to add</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto">
                <p className="text-[10px] text-slate-950/30 uppercase tracking-wider font-medium">
                  Select comments to include
                </p>
                {sortedSlides.map((slideIdx) => (
                  <div key={slideIdx}>
                    <p className="text-[10px] text-slate-950/40 uppercase tracking-wider font-semibold mb-1.5">
                      Slide {slideIdx + 1}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {bySlide.get(slideIdx)!.map((comment) => {
                        const flagged = flaggedIds.has(comment.id)
                        return (
                          <button
                            key={comment.id}
                            type="button"
                            onClick={() => onToggleFlag(comment.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                              flagged
                                ? 'bg-evergreen/5 border-evergreen/20'
                                : 'bg-slate-950/[0.02] border-slate-950/[0.06] hover:border-slate-950/[0.1]'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                                flagged
                                  ? 'bg-evergreen border-evergreen'
                                  : 'border-slate-950/20'
                              }`}>
                                {flagged && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-slate-950/70 leading-relaxed">{comment.text}</p>
                                <p className="text-[10px] text-slate-950/25 mt-1">
                                  {comment.name}
                                  {comment.replies.length > 0 && (
                                    <span> · {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {flaggedCount > 0 && (
              <textarea
                ref={textareaRef}
                value={editPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onGenerate() }
                }}
                placeholder="Additional instructions (optional)..."
                className="w-full min-h-[48px] mt-3 px-0 py-2 bg-transparent text-sm text-slate-950 placeholder:text-slate-950/25 resize-none focus:outline-none border-t border-slate-950/[0.06] leading-relaxed"
              />
            )}
          </div>
        ) : (
          <>
            <textarea
              ref={textareaRef}
              value={editPrompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onGenerate() }
              }}
              placeholder="Describe changes to the presentation..."
              className="w-full min-h-[100px] px-5 pt-4 pb-2 bg-transparent text-sm text-slate-950 placeholder:text-slate-950/25 resize-none focus:outline-none leading-relaxed"
            />

            {/* File chips */}
            {files.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 bg-stone/60 rounded-lg text-[11px] text-slate-950/60 group"
                  >
                    {file.type === 'image' && file.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file.preview} alt="" className="w-3.5 h-3.5 rounded object-cover" />
                    ) : (
                      <svg className="w-3 h-3 text-slate-950/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    )}
                    <span className="max-w-[80px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-0.5 rounded hover:bg-slate-950/10 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center">
            {editScope === 'deck' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg hover:bg-stone/60 transition-colors text-slate-950/30 hover:text-slate-950/50"
                  aria-label="Attach files"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.csv,.tsv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = '' }}
                />
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold hover:bg-slate-950/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Regenerating…
              </>
            ) : editScope === 'comments' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
                Apply {flaggedCount} Comment{flaggedCount !== 1 ? 's' : ''}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                Apply Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function OutlineEditPanelInline({
  editPrompt,
  onPromptChange,
  editScope,
  onScopeChange,
  onGenerate,
  generating,
  comments,
  commentsLoading,
  flaggedIds,
  onToggleFlag,
  files,
  onFilesChange,
  visibleSection,
  outline,
  slides,
}: OutlineEditPanelProps & { visibleSection: number; outline?: PresentationOutline | null; slides: SlideData[] }) {
  const flaggedCount = flaggedIds.size
  const canGenerate = editScope === 'comments'
    ? flaggedCount > 0 && !generating
    : editPrompt.trim().length > 0 && !generating

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [editPrompt])

  const addFiles = useCallback(async (fileList: FileList) => {
    const results = await Promise.all(Array.from(fileList).map(f => processFileToUpload(f)))
    const valid = results.filter(Boolean) as UploadedFile[]
    if (valid.length > 0) onFilesChange([...files, ...valid].slice(0, 5))
  }, [files, onFilesChange])

  const removeFile = useCallback((id: string) => {
    onFilesChange(files.filter(f => f.id !== id))
  }, [files, onFilesChange])

  // Compute the display number for "Current Slide"
  const sectionLabel = outline
    ? String(visibleSection + 1).padStart(2, '0')
    : String(visibleSection + 1).padStart(2, '0')

  // Group comments by slide
  const bySlide = new Map<number, typeof comments>()
  for (const c of comments) {
    const arr = bySlide.get(c.slideIndex) ?? []
    arr.push(c)
    bySlide.set(c.slideIndex, arr)
  }
  const sortedSlides = [...bySlide.keys()].sort((a, b) => a - b)

  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-sm text-slate-950/70">Edit Outline</h3>

      {/* Scope selector */}
      <div className="flex gap-1 p-1 bg-slate-950/[0.04] rounded-xl">
        {([
          { key: 'slide' as const, label: `Section ${sectionLabel}` },
          { key: 'deck' as const, label: 'Presentation' },
          { key: 'comments' as const, label: 'Comments' },
        ]).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onScopeChange(key)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              editScope === key
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-950/40 hover:text-slate-950/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input card */}
      <div
        className={`bg-white rounded-2xl border shadow-sm transition-all ${
          dragOver
            ? 'border-concrete ring-2 ring-concrete/30'
            : 'border-slate-950/[0.08] focus-within:border-slate-950/[0.15]'
        }`}
        onDragOver={(e) => { e.preventDefault(); if (editScope !== 'comments') setDragOver(true) }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false)
          if (editScope !== 'comments' && e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
        }}
      >
        {editScope === 'comments' ? (
          <div className="px-4 pt-4 pb-2">
            {commentsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-4 h-4 border-2 border-evergreen/30 border-t-evergreen rounded-full animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6">
                <svg className="w-6 h-6 text-slate-950/10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <p className="text-xs text-slate-950/30">No comments yet</p>
                <p className="text-[10px] text-slate-950/20 mt-1">Press C while presenting to add</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto">
                <p className="text-[10px] text-slate-950/30 uppercase tracking-wider font-medium">
                  Select comments to include
                </p>
                {sortedSlides.map((slideIdx) => (
                  <div key={slideIdx}>
                    <p className="text-[10px] text-slate-950/40 uppercase tracking-wider font-semibold mb-1.5">
                      Slide {slideIdx + 1}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {bySlide.get(slideIdx)!.map((comment) => {
                        const flagged = flaggedIds.has(comment.id)
                        return (
                          <button
                            key={comment.id}
                            type="button"
                            onClick={() => onToggleFlag(comment.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                              flagged
                                ? 'bg-evergreen/5 border-evergreen/20'
                                : 'bg-slate-950/[0.02] border-slate-950/[0.06] hover:border-slate-950/[0.1]'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                                flagged
                                  ? 'bg-evergreen border-evergreen'
                                  : 'border-slate-950/20'
                              }`}>
                                {flagged && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-slate-950/70 leading-relaxed">{comment.text}</p>
                                <p className="text-[10px] text-slate-950/25 mt-1">
                                  {comment.name}
                                  {comment.replies.length > 0 && (
                                    <span> · {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {flaggedCount > 0 && (
              <textarea
                ref={textareaRef}
                value={editPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onGenerate(visibleSection) }
                }}
                placeholder="Additional instructions (optional)..."
                className="w-full min-h-[48px] mt-3 px-0 py-2 bg-transparent text-sm text-slate-950 placeholder:text-slate-950/25 resize-none focus:outline-none border-t border-slate-950/[0.06] leading-relaxed"
              />
            )}
          </div>
        ) : (
          <>
            <textarea
              ref={textareaRef}
              value={editPrompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onGenerate(visibleSection) }
              }}
              placeholder={editScope === 'slide'
                ? `Describe changes to section ${sectionLabel}…`
                : 'Describe changes to the presentation…'
              }
              className="w-full min-h-[100px] px-5 pt-4 pb-2 bg-transparent text-sm text-slate-950 placeholder:text-slate-950/25 resize-none focus:outline-none leading-relaxed"
            />

            {/* File chips */}
            {files.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 bg-stone/60 rounded-lg text-[11px] text-slate-950/60 group"
                  >
                    {file.type === 'image' && file.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file.preview} alt="" className="w-3.5 h-3.5 rounded object-cover" />
                    ) : (
                      <svg className="w-3 h-3 text-slate-950/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    )}
                    <span className="max-w-[80px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-0.5 rounded hover:bg-slate-950/10 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center">
            {editScope !== 'comments' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg hover:bg-stone/60 transition-colors text-slate-950/30 hover:text-slate-950/50"
                  aria-label="Attach files"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.csv,.tsv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = '' }}
                />
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => onGenerate(visibleSection)}
            disabled={!canGenerate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold hover:bg-slate-950/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Regenerating…
              </>
            ) : editScope === 'comments' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
                Apply {flaggedCount} Comment{flaggedCount !== 1 ? 's' : ''}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                Apply Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

interface DocumentViewProps {
  document: PresentationDocument
  slides: SlideData[]
  onGoToSlide: (index: number) => void
  onDocumentChange?: (doc: PresentationDocument) => void
  onRebuild?: () => void
  onExit?: () => void
  commentActions?: CommentActions
  commentMode?: boolean
  locale?: Locale
  /** When true, content is progressively revealed with cursor animations */
  isGenerating?: boolean
  /** AI edit via text selection */
  onAIEdit?: (prompt: string, selectionContext: { sectionIndex: number; selectedText: string }) => void
  /** Edit panel props for the right-column AI edit panel */
  editPanel?: DocumentEditPanelProps
  /** Per-section file attachments (for rebuild context) */
  sectionFiles?: SectionFilesMap
  onSectionFilesChange?: (sectionIndex: number, files: UploadedFile[]) => void
}

export function DocumentView({ document: doc, slides, onGoToSlide, onDocumentChange, onRebuild, onExit, commentActions, commentMode, locale, isGenerating, onAIEdit, editPanel, sectionFiles, onSectionFilesChange }: DocumentViewProps) {
  const [dirty, setDirty] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(containerRef, locale ?? 'en-US', doc.sections.length)
  const editable = !!onDocumentChange

  // Progressive reveal state for generating animation
  const [revealProgress, setRevealProgress] = useState(isGenerating ? 0 : 1)
  const prevGenerating = useRef(isGenerating)

  useEffect(() => {
    // When generation completes (isGenerating goes false), snap to fully revealed
    if (prevGenerating.current && !isGenerating) {
      setRevealProgress(1)
    }
    // When generation starts, reset
    if (!prevGenerating.current && isGenerating) {
      setRevealProgress(0)
    }
    prevGenerating.current = isGenerating
  }, [isGenerating])

  // Animate reveal progress during generation
  useEffect(() => {
    if (!isGenerating) return
    // Progressively reveal content over time as sections arrive
    const totalElements = 2 + doc.sections.length * 2 // title + summary + (heading + content) per section
    const perElement = 1 / Math.max(totalElements, 1)
    let current = 0
    const interval = setInterval(() => {
      current += perElement * 0.15 // reveal ~15% of one element per tick
      if (current >= 1) current = 1
      setRevealProgress(current)
      if (current >= 1) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [isGenerating, doc.sections.length])

  const updateSection = useCallback((index: number, patch: Partial<PresentationDocument['sections'][0]>) => {
    if (!onDocumentChange) return
    const newSections = doc.sections.map((s, i) => i === index ? { ...s, ...patch } : s)
    onDocumentChange({ ...doc, sections: newSections })
    setDirty(true)
  }, [doc, onDocumentChange])

  // Bounds for AgentCursors during generation — measure the white card, not the full screen
  const docCardRef = useRef<HTMLDivElement>(null)
  const [docCardBounds, setDocCardBounds] = useState<DOMRect | null>(null)
  const [docRowRects, setDocRowRects] = useState<DOMRect[]>([])
  useEffect(() => {
    if (!isGenerating) return
    const measure = () => {
      if (!docCardRef.current) return
      const rect = docCardRef.current.getBoundingClientRect()
      setDocCardBounds(rect)
      const rowCount = 8
      const padX = rect.width * 0.06
      const padTop = rect.height * 0.06
      const usableH = rect.height * 0.88
      const offsets = [0, 0.8, 1.9, 2.5, 3.6, 4.5, 5.6, 6.7]
      const rowH = usableH / rowCount
      const rects: DOMRect[] = []
      for (let i = 0; i < rowCount; i++) {
        const y = rect.top + padTop + offsets[i] * (usableH / 7)
        rects.push(new DOMRect(rect.left + padX, y, rect.width - padX * 2, rowH * 0.6))
      }
      setDocRowRects(rects)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isGenerating])

  // Calculate which elements are visible based on reveal progress
  const totalElements = 2 + doc.sections.length * 2
  const getElementOpacity = (elementIndex: number) => {
    if (!isGenerating && revealProgress >= 1) return 1
    const elementStart = elementIndex / totalElements
    const elementEnd = (elementIndex + 1) / totalElements
    if (revealProgress >= elementEnd) return 1
    if (revealProgress <= elementStart) return 0
    return (revealProgress - elementStart) / (elementEnd - elementStart)
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-[180] bg-linen overflow-hidden" data-view="document">
      {/* Agent cursors during generation — bounded to white card */}
      {isGenerating && revealProgress < 1 && (
        <AgentCursors count={8} canvasBounds={docCardBounds} cardRects={docRowRects} mode="working" />
      )}

      <div className="flex h-full">
        {/* Main content — shifts left when comments open */}
        <div className="flex-1 min-w-0 overflow-y-auto transition-all duration-300 ease-out">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-20 sm:py-24">
        {/* White sheet */}
        <div ref={docCardRef} className="relative bg-white rounded-2xl shadow-sm ring-1 ring-slate-950/[0.06] px-10 sm:px-16 py-14 sm:py-20">
          {/* Selection tooltip for AI edit + comment */}
          {(onAIEdit || commentActions) && (
            <SelectionTooltip
              containerRef={docCardRef}
              onAIEdit={onAIEdit}
              onAddComment={commentActions ? (sectionIndex, name, text, email) => {
                const slideIndex = doc.sections[sectionIndex]?.slideIndex ?? sectionIndex
                commentActions.addComment(slideIndex, 50, 50, name, text, email)
              } : undefined}
              generating={editPanel?.generating}
            />
          )}
          {/* Document header */}
          <div className="mb-12" style={{ opacity: getElementOpacity(0), transition: 'opacity 400ms ease-out' }}>
            {doc.type && doc.type !== 'general' && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-evergreen bg-evergreen/10 px-3 py-1 rounded-full mb-4">
                {doc.type.toUpperCase()}
              </span>
            )}
            <h1
              className={`font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-950 leading-[1.05] tracking-tight ${editable ? editFocusCls : ''}`}
              {...(editable ? useEditableHandlers((v) => { onDocumentChange!({ ...doc, title: v }); setDirty(true) }) : {})}
              dangerouslySetInnerHTML={{ __html: boldToHtml(doc.title) }}
            />
            {doc.summary && (
              <p
                className={`text-xl text-slate-950/65 mt-5 leading-relaxed ${editable ? editFocusCls : ''}`}
                style={{ opacity: getElementOpacity(1), transition: 'opacity 400ms ease-out' }}
                {...(editable ? useEditableHandlers((v) => { onDocumentChange!({ ...doc, summary: v }); setDirty(true) }) : {})}
                dangerouslySetInnerHTML={{ __html: boldToHtml(doc.summary) }}
              />
            )}
            <div className="mt-8 h-px bg-slate-950/8" />
          </div>

          {/* Table of contents — only show when fully revealed */}
          {doc.sections.length > 3 && revealProgress >= 1 && (
            <nav className="mb-12 p-6 rounded-xl bg-linen/60 border border-slate-950/[0.05] animate-in fade-in duration-500">
              <h2 className="text-xs font-bold uppercase tracking-widest text-concrete mb-3">Contents</h2>
              <ol className="space-y-2">
                {doc.sections.map((section, i) => (
                  <li key={i}>
                    <a
                      href={`#doc-section-${i}`}
                      className="text-sm text-slate-950/60 hover:text-evergreen transition-colors flex items-center gap-2.5"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(`doc-section-${i}`)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      <span className="text-slate-950/40 font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Sections */}
          <div>
            {doc.sections.map((section, i) => {
              const headingOpacity = getElementOpacity(2 + i * 2)
              const contentOpacity = getElementOpacity(2 + i * 2 + 1)
              if (headingOpacity === 0) return null // Don't render unrevealed sections

              return (
              <section key={i} id={`doc-section-${i}`} className="scroll-mt-24">
                {i > 0 && <hr className="my-10 border-slate-950/6" />}
                <div className="relative mb-1" style={{ opacity: headingOpacity, transition: 'opacity 400ms ease-out' }}>
                  <span className="absolute -left-10 top-2 font-mono text-xs text-slate-950/30 hidden sm:block">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex items-start justify-between gap-4">
                    <h2
                      className={`font-display font-bold text-xl sm:text-2xl text-slate-950 leading-snug flex-1 min-w-0 ${editable ? editFocusCls : ''}`}
                      {...(editable ? useEditableHandlers((v) => updateSection(i, { title: v })) : {})}
                      dangerouslySetInnerHTML={{ __html: boldToHtml(section.title) }}
                    />
                    <div className="flex items-center gap-2 shrink-0 mt-2">
                      {commentActions && section.slideIndex !== undefined && (() => {
                        const sectionComments = commentActions.comments.filter(c => c.slideIndex === section.slideIndex && !c.resolved)
                        if (sectionComments.length === 0) return null
                        return (
                          <OutlineCommentBubbles slideIndex={section.slideIndex} commentActions={commentActions} />
                        )
                      })()}
                      {commentActions && section.slideIndex !== undefined && (
                        <AddCommentInline slideIndex={section.slideIndex} commentActions={commentActions} />
                      )}
                      {section.slideIndex !== undefined && section.slideIndex < slides.length && (
                        <button
                          type="button"
                          onClick={() => onGoToSlide(section.slideIndex!)}
                          className="text-[10px] font-semibold text-evergreen hover:text-evergreen/70 transition-colors uppercase tracking-wider"
                        >
                          Slide {section.slideIndex + 1} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rendered structured content */}
                <div
                  className={`prose-felix text-slate-950/70 text-[17px] leading-relaxed mt-4 ${editable ? editFocusCls + ' whitespace-pre-wrap' : 'space-y-4'}`}
                  style={{ opacity: contentOpacity, transition: 'opacity 600ms ease-out' }}
                  {...(editable ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
                      const text = e.currentTarget.innerText ?? ''
                      updateSection(i, { content: text })
                    },
                  } : {})}
                >
                  {renderSectionContent(section.content)}
                </div>

                {/* Chart thumbnail if this section's slide has a chart */}
                {section.slideIndex !== undefined && slides[section.slideIndex]?.chart && (
                  <button
                    type="button"
                    onClick={() => onGoToSlide(section.slideIndex!)}
                    className="w-full mt-5 rounded-xl bg-slate-950/[0.03] ring-1 ring-slate-950/[0.06] p-4 overflow-hidden hover:ring-evergreen/30 transition-all text-left"
                    style={{ opacity: contentOpacity, transition: 'opacity 600ms ease-out' }}
                  >
                    <div className="h-44">
                      <SlideChartViz chart={slides[section.slideIndex].chart!} dark={false} />
                    </div>
                  </button>
                )}

                {/* Section file attachments */}
                {onSectionFilesChange && (
                  <div className="mt-4" style={{ opacity: contentOpacity, transition: 'opacity 600ms ease-out' }}>
                    <SectionDropZone
                      sectionIndex={i}
                      files={sectionFiles?.[i] ?? []}
                      onFilesChange={onSectionFilesChange}
                    />
                  </div>
                )}

                {/* Comments for this section, aligned with content */}
                {commentActions && section.slideIndex !== undefined && (() => {
                  const sectionComments = commentActions.comments.filter(c => c.slideIndex === section.slideIndex && !c.resolved)
                  if (sectionComments.length === 0) return null
                  return (
                    <div className="mt-4" style={{ opacity: contentOpacity, transition: 'opacity 600ms ease-out' }}>
                      <CommentThread slideIndex={section.slideIndex} commentActions={commentActions} />
                    </div>
                  )
                })()}
              </section>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-950/8" style={{ opacity: revealProgress >= 1 ? 1 : 0, transition: 'opacity 500ms ease-out' }}>
            <p className="text-xs text-concrete">
              Generated with Felix Studio · {slides.length} slides
            </p>
          </div>

        </div>

        </div>{/* close max-w-5xl */}
        </div>{/* close main content scroll */}
      </div>{/* close flex */}

      {/* Fixed right-column edit panel */}
      {editPanel && (
        <div className="hidden lg:block fixed top-0 right-0 bottom-0 w-[340px] bg-linen border-l border-slate-950/[0.06] overflow-y-auto z-[190]">
          <div className="px-5 pt-20 pb-8">
            <DocumentEditPanelInline {...editPanel} />
          </div>
        </div>
      )}

      {/* Fixed exit pill — top-left, matching present mode */}
      {onExit && (
        <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[200] animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="inline-flex items-center py-1 px-1.5 backdrop-blur-sm rounded-full border border-slate-950/10 bg-white/80 gap-[3px] shadow-sm">
            <button
              type="button"
              onClick={onExit}
              className="h-7 px-2 rounded-full inline-flex items-center gap-1.5 transition-colors text-slate-950/60 hover:bg-slate-950/5"
              aria-label="Exit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="text-xs font-medium">Exit</span>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                   VIEW MODE TOGGLE                          */
/* ═══════════════════════════════════════════════════════════ */

export type ViewMode = 'presentation' | 'outline' | 'document'

interface ViewModeToggleProps {
  mode: ViewMode
  onModeChange: (mode: ViewMode) => void
  hasDocument: boolean
  /** Whether the toggle should always be visible or follow hover rules */
  alwaysVisible?: boolean
  /** Called when user clicks "Generate" on a missing document */
  onGenerateDocument?: () => void
  /** Whether document is currently being generated */
  isGeneratingDocument?: boolean
}

export function ViewModeToggle({ mode, onModeChange, hasDocument, onGenerateDocument, isGeneratingDocument }: ViewModeToggleProps) {
  const [docHovered, setDocHovered] = useState(false)

  const modes: { key: ViewMode; label: string; hoverLabel?: string; icon: React.ReactNode; disabled?: boolean }[] = [
    {
      key: 'presentation',
      label: 'Present',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 2.5a.5.5 0 01.772-.416l9 5.5a.5.5 0 010 .832l-9 5.5A.5.5 0 014 13.5V2.5z" />
        </svg>
      ),
    },
    {
      key: 'outline',
      label: 'Outline',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
    },
    {
      key: 'document',
      label: isGeneratingDocument ? 'Generating...' : 'Document',
      hoverLabel: (!hasDocument && !isGeneratingDocument && onGenerateDocument) ? 'Generate' : undefined,
      disabled: !hasDocument && !onGenerateDocument,
      icon: isGeneratingDocument ? (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
  ]

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const updateIndicator = useCallback(() => {
    const activeIndex = modes.findIndex(m => m.key === mode)
    const btn = buttonRefs.current[activeIndex]
    const container = containerRef.current
    if (btn && container) {
      const containerRect = container.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      setIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      })
    }
  }, [mode])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  // Re-measure on resize (e.g. responsive label show/hide)
  useEffect(() => {
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  return (
    <div ref={containerRef} className="relative inline-flex bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 p-[3px] shadow-lg">
      {/* Sliding indicator */}
      <div
        className="absolute top-[3px] bottom-[3px] rounded-full bg-turquoise pointer-events-none"
        style={{
          left: indicator.left,
          width: indicator.width,
          transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1), width 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />

      {modes.map(({ key, label, hoverLabel, icon, disabled }, i) => (
        <button
          key={key}
          ref={(el) => { buttonRefs.current[i] = el }}
          type="button"
          onClick={() => {
            if (key === 'document' && !hasDocument && onGenerateDocument && !isGeneratingDocument) {
              onGenerateDocument()
              return
            }
            if (!disabled) onModeChange(key)
          }}
          disabled={disabled}
          onMouseEnter={() => key === 'document' && setDocHovered(true)}
          onMouseLeave={() => key === 'document' && setDocHovered(false)}
          className={`relative z-10 flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 ${
            mode === key
              ? 'text-slate-950'
              : disabled
                ? 'text-white/20 cursor-not-allowed'
                : key === 'document' && !hasDocument && onGenerateDocument && !isGeneratingDocument
                  ? 'text-white/40 hover:text-turquoise cursor-pointer'
                  : 'text-white/50 hover:text-white/80'
          }`}
          aria-label={hoverLabel && docHovered ? hoverLabel : label}
        >
          {icon}
          <span className="hidden sm:inline">{hoverLabel && docHovered ? hoverLabel : label}</span>
        </button>
      ))}
    </div>
  )
}
