'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Pencil, X, Sparkles, ArrowLeft, Check, Settings, MessageSquare, Flag } from 'lucide-react'
import { SlideRenderer, type SlideData, type ChromeColors } from '@/components/studio/slide-renderer'
import { loadModelDefaults, useServerSettings } from '@/components/studio/model-selector'
import { SettingsModal } from '@/components/studio/settings-modal'
import { ShareModal } from '@/components/studio/share-modal'
import { DocumentPanel } from '@/components/studio/document-panel'
import { GenerationCanvas } from '@/components/studio/generation-canvas'
import { SlideEditOverlay } from '@/components/studio/slide-edit-overlay'
import { FileUploader, type UploadedFile } from '@/components/studio/file-uploader'
import type { PresentationDocument, PresentationOutline } from '@/lib/studio-db'

import { parseIncrementalSlides, parseFinalResult } from '@/lib/incremental-parser'
import { computeSlideEdits } from '@/lib/studio-analytics'

/* ─────────────────────── Helpers ─────────────────────── */

/** Compare two slides and return the field names that differ */
function detectChangedFields(oldSlide: SlideData | undefined, newSlide: SlideData): string[] {
  if (!oldSlide) return []
  const fields: string[] = []
  if (oldSlide.title !== newSlide.title) fields.push('title')
  if (oldSlide.subtitle !== newSlide.subtitle) fields.push('subtitle')
  if (oldSlide.body !== newSlide.body) fields.push('body')
  if (oldSlide.badge !== newSlide.badge) fields.push('badge')
  if (JSON.stringify(oldSlide.bullets) !== JSON.stringify(newSlide.bullets)) fields.push('bullets')
  if (JSON.stringify(oldSlide.cards) !== JSON.stringify(newSlide.cards)) fields.push('cards')
  if (JSON.stringify(oldSlide.columns) !== JSON.stringify(newSlide.columns)) fields.push('columns')
  if (JSON.stringify(oldSlide.quote) !== JSON.stringify(newSlide.quote)) fields.push('quote')
  if (JSON.stringify(oldSlide.chart) !== JSON.stringify(newSlide.chart)) fields.push('chart')
  return fields
}

/** Detect whether a comment applies to the whole deck rather than a single slide */
function isDeckWideComment(text: string): boolean {
  const lower = text.toLowerCase()
  const deckPatterns = [
    /\b(all slides|every slide|whole deck|entire deck|entire presentation|whole presentation)\b/,
    /\b(throughout|across all|globally|overall flow|narrative arc|story arc)\b/,
    /\b(deck[\s-]?wide|presentation[\s-]?wide)\b/,
    /\b(reorder|rearrange|restructure|reorganize)\s.*(slides|deck|presentation)/,
    /\b(add|insert|remove|delete)\s+(a\s+)?slide/,
    /\b(tone|voice|style|branding)\s.*(consistent|everywhere|throughout)/,
  ]
  return deckPatterns.some(p => p.test(lower))
}

/* ─────────────────────── Types ─────────────────────── */

interface Presentation {
  id: string
  title: string
  prompt: string
  slides: SlideData[]
  document: PresentationDocument | null
  outline: PresentationOutline | null
  translations: Record<string, Record<string, string>> | null
  shareToken: string | null
  model: string
  createdAt: number
}

type EditScope = 'deck' | 'slide' | 'comments'

interface CommentData {
  id: string
  deckId: string
  slideIndex: number
  x: number
  y: number
  name: string
  email?: string
  text: string
  timestamp: number
  replies: { id: string; name: string; text: string; timestamp: number }[]
  flaggedForRebuild?: boolean
  resolved?: boolean
}

/* ─────────────────────── Comments List ─────────────────────── */

function CommentsList({
  comments,
  flaggedIds,
  onToggleFlag,
  loading,
}: {
  comments: CommentData[]
  flaggedIds: Set<string>
  onToggleFlag: (id: string) => void
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-4 h-4 border-2 border-turquoise/30 border-t-turquoise rounded-full animate-spin" />
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
        <p className="text-xs text-white/30">No comments yet</p>
        <p className="text-xs text-white/20 mt-1">Press C while presenting to add comments</p>
      </div>
    )
  }

  // Group by slide
  const bySlide = new Map<number, CommentData[]>()
  for (const c of comments) {
    const arr = bySlide.get(c.slideIndex) ?? []
    arr.push(c)
    bySlide.set(c.slideIndex, arr)
  }
  const sortedSlides = [...bySlide.keys()].sort((a, b) => a - b)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
        Select comments to include
      </p>
      {sortedSlides.map((slideIdx) => (
        <div key={slideIdx}>
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-1.5">
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
                      ? 'bg-turquoise/10 border-turquoise/30'
                      : 'bg-white/[0.03] border-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                      flagged
                        ? 'bg-turquoise border-turquoise'
                        : 'border-white/20'
                    }`}>
                      {flagged && <Check className="w-2.5 h-2.5 text-slate-950" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white/80 leading-relaxed">{comment.text}</p>
                      <p className="text-[10px] text-white/25 mt-1">
                        {comment.name}
                        {comment.replies.length > 0 && (
                          <span> · {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                        )}
                      </p>
                      {flagged && comment.replies.length > 0 && (
                        <div className="mt-1.5 pl-2 border-l border-white/10 flex flex-col gap-1">
                          {comment.replies.map((r) => (
                            <p key={r.id} className="text-[10px] text-white/40">
                              <span className="font-medium text-white/50">{r.name}:</span> {r.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────── Edit Panel ─────────────────────── */

function EditPanel({
  scope,
  onScopeChange,
  editPrompt,
  onPromptChange,
  files,
  onFilesChange,
  onGenerate,
  onClose,
  generating,
  currentSlide,
  onOpenSettings,
  deckId,
  comments,
  commentsLoading,
  flaggedIds,
  onToggleFlag,
}: {
  scope: EditScope
  onScopeChange: (s: EditScope) => void
  editPrompt: string
  onPromptChange: (p: string) => void
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  onGenerate: () => void
  onClose: () => void
  generating: boolean
  currentSlide: number
  onOpenSettings: () => void
  deckId: string
  comments: CommentData[]
  commentsLoading: boolean
  flaggedIds: Set<string>
  onToggleFlag: (id: string) => void
}) {
  const flaggedCount = flaggedIds.size
  const canGenerate = scope === 'comments'
    ? flaggedCount > 0 && !generating
    : editPrompt.trim().length > 0 && !generating

  const promptTextareaRef = useRef<HTMLTextAreaElement>(null)
  const commentsTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow textareas when content changes
  useEffect(() => {
    const el = scope === 'comments' ? commentsTextareaRef.current : promptTextareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [editPrompt, scope])

  return (
    <div className="fixed top-0 right-0 bottom-0 w-96 bg-slate-950 border-l border-white/10 z-[300] flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-white font-display font-bold text-sm">Edit Presentation</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
            aria-label="Model settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scope selector */}
      <div className="flex gap-1 mx-4 mt-4 p-1 bg-white/5 rounded-lg">
        {([
          { key: 'slide' as const, label: 'Current Slide' },
          { key: 'comments' as const, label: 'Comments Only' },
          { key: 'deck' as const, label: 'Presentation' },
        ]).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onScopeChange(key)}
            className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-colors ${
              scope === key
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {scope === 'comments' ? (
          <>
            <CommentsList
              comments={comments}
              flaggedIds={flaggedIds}
              onToggleFlag={onToggleFlag}
              loading={commentsLoading}
            />
            {flaggedCount > 0 && (
              <textarea
                ref={commentsTextareaRef}
                value={editPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onGenerate()
                  }
                }}
                placeholder="Additional instructions (optional)..."
                className="min-h-[60px] px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise/40 transition-colors"
              />
            )}
          </>
        ) : (
          <>
            <textarea
              ref={promptTextareaRef}
              value={editPrompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onGenerate()
                }
              }}
              placeholder={
                scope === 'deck'
                  ? 'Describe changes to the entire presentation...'
                  : `Describe changes to slide ${currentSlide + 1}...`
              }
              className="min-h-[120px] px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise/40 transition-colors"
              autoFocus
            />

            {/* File uploader */}
            <FileUploader files={files} onFilesChange={onFilesChange} maxFiles={5} />
          </>
        )}

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className="w-full py-2.5 bg-turquoise text-slate-950 font-semibold rounded-xl hover:bg-turquoise/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 flex-shrink-0"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              Regenerating...
            </>
          ) : scope === 'comments' ? (
            <>
              <Flag className="w-4 h-4" />
              Apply {flaggedCount} Comment{flaggedCount !== 1 ? 's' : ''}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Apply Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────── Main Page ─────────────────────── */

export default function PresentationViewerPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params.id as string

  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hint, setHint] = useState<string | null>(null)

  // Edit mode
  const [showEdit, setShowEdit] = useState(false)
  const [editScope, setEditScope] = useState<EditScope>('slide')
  const [editPrompt, setEditPrompt] = useState('')
  const [editFiles, setEditFiles] = useState<UploadedFile[]>([])
  const [editGenerating, setEditGenerating] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Comments for edit panel (fetched when scope=comments)
  const [editComments, setEditComments] = useState<CommentData[]>([])
  const [editCommentsLoading, setEditCommentsLoading] = useState(false)
  const [editFlaggedIds, setEditFlaggedIds] = useState<Set<string>>(new Set())

  // Fetch comments when switching to comments scope
  useEffect(() => {
    if (editScope !== 'comments' || !presentation) return
    setEditCommentsLoading(true)
    fetch(`/api/comments?deck=${presentation.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data: CommentData[]) => {
        const unresolvedData = data.filter(c => !c.resolved)
        setEditComments(unresolvedData)
        const preSelected = new Set<string>()
        for (const c of unresolvedData) {
          if (c.flaggedForRebuild) preSelected.add(c.id)
        }
        setEditFlaggedIds(preSelected)
      })
      .catch(() => setEditComments([]))
      .finally(() => setEditCommentsLoading(false))
  }, [editScope, presentation])

  const toggleEditFlag = useCallback((id: string) => {
    setEditFlaggedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Settings (loaded from server per-user settings)
  const [showSettings, setShowSettings] = useState(false)
  const defaults = loadModelDefaults()
  const [provider, setProvider] = useState(defaults.provider)
  const [apiKey, setApiKey] = useState(defaults.apiKey)
  const [model, setModel] = useState(defaults.model)
  const [userEmail, setUserEmail] = useState<string | undefined>()
  const [notionConnected, setNotionConnected] = useState(false)
  const [amplitudeConnected, setAmplitudeConnected] = useState(false)
  const [googleWorkspaceConnected, setGoogleWorkspaceConnected] = useState(false)
  const [clickupConnected, setClickupConnected] = useState(false)
  useServerSettings(setProvider, setApiKey, setModel, setUserEmail, setNotionConnected, setAmplitudeConnected, setGoogleWorkspaceConnected, setClickupConnected)

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false)

  // Document panel — initialize from URL param
  const [showDocument, setShowDocument] = useState(searchParams.get('view') === 'doc')

  // View mode from URL (present/outline/document)
  const viewParam = searchParams.get('view')
  const initialViewMode = viewParam === 'outline' ? 'outline' as const
    : viewParam === 'document' || viewParam === 'doc' ? 'document' as const
    : 'presentation' as const

  // Track current view mode for share
  const [currentViewMode, setCurrentViewMode] = useState<'presentation' | 'outline' | 'document'>(initialViewMode)

  // Sync view mode to URL
  const handleViewModeChanged = useCallback((mode: 'presentation' | 'outline' | 'document') => {
    setCurrentViewMode(mode)
    const url = new URL(window.location.href)
    if (mode === 'presentation') {
      url.searchParams.delete('view')
    } else {
      url.searchParams.set('view', mode)
    }
    window.history.replaceState(null, '', url.toString())
  }, [])

  // Sync document view with URL
  const openDocument = useCallback(() => {
    setShowDocument(true)
    const url = new URL(window.location.href)
    url.searchParams.set('view', 'doc')
    window.history.replaceState(null, '', url.toString())
  }, [])

  const closeDocument = useCallback(() => {
    setShowDocument(false)
    const url = new URL(window.location.href)
    url.searchParams.delete('view')
    window.history.replaceState(null, '', url.toString())
  }, [])

  // Generate document for presentations missing one
  const [generatingDoc, setGeneratingDoc] = useState(false)
  const [docGenFailed, setDocGenFailed] = useState(false)
  const generateDocument = useCallback((): boolean => {
    if (!presentation || generatingDoc) return false
    if (!apiKey.trim()) {
      setShowSettings(true)
      return false
    }
    setGeneratingDoc(true)
    setDocGenFailed(false)
    // Run generation in background (not awaited so caller gets synchronous result)
    ;(async () => {
    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: presentation.prompt || presentation.title || 'Generate a document from this presentation',
          provider,
          apiKey,
          model,
          reverseEngineer: true,
          slides: presentation.slides,
        }),
      })
      if (!res.ok) {
        console.error('Document generation HTTP error:', res.status)
        setDocGenFailed(true)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) {
        setDocGenFailed(true)
        return
      }
      const decoder = new TextDecoder()
      let gotDocument = false
      let lastError = ''
      // Client-side timeout: 4 minutes max for reverse-engineering
      const CLIENT_TIMEOUT = 240_000
      let lastActivity = Date.now()
      while (true) {
        const readPromise = reader.read()
        const timeoutPromise = new Promise<{ done: true; value: undefined }>((resolve) => {
          const remaining = CLIENT_TIMEOUT - (Date.now() - lastActivity)
          setTimeout(() => resolve({ done: true, value: undefined }), Math.max(remaining, 1000))
        })
        const { done, value } = await Promise.race([readPromise, timeoutPromise])
        if (done) {
          if (Date.now() - lastActivity > CLIENT_TIMEOUT - 1000 && !gotDocument) {
            console.error('Document generation timed out on client side')
            lastError = 'Request timed out'
          }
          break
        }
        lastActivity = Date.now()
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const event = JSON.parse(payload)
            if (event.hint) { setHint(event.hint); continue }
            if (event.keepalive) continue
            if (event.error) {
              console.error('Document generation error:', event.error)
              lastError = event.error
            }
            if (event.document) {
              gotDocument = true
              setPresentation(prev => prev ? { ...prev, document: event.document } : prev)
              // Save to DB (fire-and-forget)
              fetch(`/api/studio/presentations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document: event.document }),
              }).catch(() => {})
            }
            if (event.outline) {
              setPresentation(prev => prev ? { ...prev, outline: event.outline } : prev)
              // Save to DB (fire-and-forget)
              fetch(`/api/studio/presentations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ outline: event.outline }),
              }).catch(() => {})
            }
          } catch { /* ignore unparseable lines */ }
        }
      }
      if (!gotDocument) {
        console.error('Document generation completed without producing a document', lastError)
        setDocGenFailed(true)
      }
    } catch (err) {
      console.error('Document generation failed:', err)
      setDocGenFailed(true)
    } finally {
      setGeneratingDoc(false)
    }
    })()
    return true
  }, [presentation, apiKey, provider, model, id, generatingDoc])

  // Streaming state for edits
  const [forceSlide, setForceSlide] = useState<number | undefined>(undefined)

  // Edit animation states
  const [editOverlay, setEditOverlay] = useState<{
    mode: 'slide' | 'comments'
    generating: boolean
    done: boolean
    affectedSlides: number[]
    changedFields?: string[]
  } | null>(null)
  const [showEditCanvas, setShowEditCanvas] = useState(false)
  const [editCanvasSlides, setEditCanvasSlides] = useState<SlideData[]>([])
  const [editCanvasDone, setEditCanvasDone] = useState(false)
  const editAbortRef = useRef<AbortController | null>(null)
  const slidesBeforeEditRef = useRef<SlideData[] | null>(null)

  // Document edit panel state (right column in document view)
  const [docEditScope, setDocEditScope] = useState<'comments' | 'deck'>('deck')
  const [docEditPrompt, setDocEditPrompt] = useState('')
  const [docEditFiles, setDocEditFiles] = useState<UploadedFile[]>([])
  const [docEditComments, setDocEditComments] = useState<CommentData[]>([])
  const [docEditCommentsLoading, setDocEditCommentsLoading] = useState(false)
  const [docEditFlaggedIds, setDocEditFlaggedIds] = useState<Set<string>>(new Set())

  // Fetch comments when doc edit panel switches to comments scope
  useEffect(() => {
    if (docEditScope !== 'comments' || !presentation) return
    setDocEditCommentsLoading(true)
    fetch(`/api/comments?deck=${presentation.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data: CommentData[]) => {
        const unresolvedData = data.filter(c => !c.resolved)
        setDocEditComments(unresolvedData)
        const preSelected = new Set<string>()
        for (const c of unresolvedData) {
          if (c.flaggedForRebuild) preSelected.add(c.id)
        }
        setDocEditFlaggedIds(preSelected)
      })
      .catch(() => setDocEditComments([]))
      .finally(() => setDocEditCommentsLoading(false))
  }, [docEditScope, presentation?.id])

  const toggleDocEditFlag = useCallback((id: string) => {
    setDocEditFlaggedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Outline edit panel state (right column in outline view)
  const [outlineEditScope, setOutlineEditScope] = useState<'slide' | 'comments' | 'deck'>('deck')
  const [outlineEditPrompt, setOutlineEditPrompt] = useState('')
  const [outlineEditFiles, setOutlineEditFiles] = useState<UploadedFile[]>([])
  const [outlineEditComments, setOutlineEditComments] = useState<CommentData[]>([])
  const [outlineEditCommentsLoading, setOutlineEditCommentsLoading] = useState(false)
  const [outlineEditFlaggedIds, setOutlineEditFlaggedIds] = useState<Set<string>>(new Set())

  // Per-section file attachments (outline & document views)
  const [sectionFiles, setSectionFiles] = useState<Record<number, UploadedFile[]>>({})
  const handleSectionFilesChange = useCallback((sectionIndex: number, files: UploadedFile[]) => {
    setSectionFiles(prev => {
      if (files.length === 0) {
        const next = { ...prev }
        delete next[sectionIndex]
        return next
      }
      return { ...prev, [sectionIndex]: files }
    })
  }, [])

  // Fetch comments when outline edit panel switches to comments scope
  useEffect(() => {
    if (outlineEditScope !== 'comments' || !presentation) return
    setOutlineEditCommentsLoading(true)
    fetch(`/api/comments?deck=${presentation.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data: CommentData[]) => {
        const unresolvedData = data.filter(c => !c.resolved)
        setOutlineEditComments(unresolvedData)
        const preSelected = new Set<string>()
        for (const c of unresolvedData) {
          if (c.flaggedForRebuild) preSelected.add(c.id)
        }
        setOutlineEditFlaggedIds(preSelected)
      })
      .catch(() => setOutlineEditComments([]))
      .finally(() => setOutlineEditCommentsLoading(false))
  }, [outlineEditScope, presentation?.id])

  const toggleOutlineEditFlag = useCallback((id: string) => {
    setOutlineEditFlaggedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const fetchPresentation = useCallback(async () => {
    try {
      const res = await fetch(`/api/studio/presentations/${id}`)
      if (!res.ok) {
        setError(res.status === 404 ? 'Presentation not found' : 'Failed to load')
        return
      }
      const data = await res.json()
      setPresentation(data.presentation)
    } catch {
      setError('Failed to load presentation')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchPresentation() }, [fetchPresentation])

  // Track current slide from hash changes
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash
      if (hash) {
        const n = parseInt(hash.replace('#slide-', ''), 10)
        if (!isNaN(n)) setCurrentSlide(n)
      }
    }
    window.addEventListener('hashchange', handler)
    handler()
    return () => window.removeEventListener('hashchange', handler)
  }, [])



  const handleEditGenerate = useCallback(async (overrides?: { scope?: string; prompt?: string; slideIndex?: number }) => {
    if (!presentation || !apiKey.trim()) return

    // Snapshot slides before edit for analytics diff
    slidesBeforeEditRef.current = [...presentation.slides]

    const activeScope = (overrides?.scope ?? editScope) as typeof editScope
    const activePrompt = overrides?.prompt ?? editPrompt
    const activeSlideIndex = overrides?.slideIndex ?? currentSlide

    // Build prompt based on scope
    let fullPrompt: string
    let affectedSlideIndices: number[] = []
    let selectiveCommentMode = false

    // Concise schema reference so the LLM knows every lever it can pull
    const EDIT_SCHEMA = `SLIDE SCHEMA — you may change ANY of these fields freely:
- type: "title" | "section" | "content" | "bullets" | "two-column" | "cards" | "quote" | "image" | "checklist" | "chart" | "closing"
- bg: "dark" (#082422 Slate) | "light" (#EFEBE7 Stone) | "brand" (#2BF2F1 Turquoise)
- badge: optional uppercase category pill (e.g. "Overview", "Strategy")
- title: main heading (Plain font, large)
- subtitle: secondary line below title (smaller, muted color)
- body: markdown body text (Saans font). Supports **bold**, bullet lists, subheadings
- bullets: [{ text, icon? }] — icon is an emoji/unicode character
- cards: [{ title, titleColor, body }] — titleColor is a hex color. Safe on light bg: #082422, #35605F, #6060BF, #877867, #F26629. Safe on dark bg: #2BF2F1, #EFEBE7, #60D06F, #DCFF00, #FFCD9C
- columns: [{ heading?, body?, bullets? }] — for two-column layouts (exactly 2 columns)
- quote: { text, attribution? }
- imageUrl: illustration path. Available: /illustrations/Dollar%20bills%20%2B%20Coins%20A.svg, /illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg, /illustrations/Cloud%20Coin%20-%20Turquoise.svg, /illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg, /illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg, /illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg, /illustrations/ray.svg, /illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg, /illustrations/Hand%20-%20Stars.svg, /illustrations/Hand%20-%20Cell%20Phone%20OK.svg, /illustrations/Speech%20Bubbles%20%2B%20Hearts.svg, /illustrations/Speech%20Bubble.svg, /illustrations/Party%20Popper.svg, /illustrations/Heart%20-F%C3%A9lix.svg, /illustrations/Fast.svg, /illustrations/Magnifying%20Glass.svg, /illustrations/Lock.svg, /illustrations/Survey.svg, /illustrations/F%C3%A9lix%20Illo%201.svg, /illustrations/F%C3%A9lix%20Illo%202.svg
- imageCaption: optional caption under image
- chart: { chartType: "bar"|"horizontal-bar"|"stacked-bar"|"line"|"multi-line"|"area"|"donut"|"scatter"|"radar", data: [{...}], xKey, yKeys, colors?, xLabel?, yLabel? }
- videoUrl: Google Drive video embed URL. Use the /preview format: "https://drive.google.com/file/d/{FILE_ID}/preview". Works on content, bullets, and two-column slide types. The video renders as a 16:9 embedded player beside the text content. When the user provides a Google Drive share link (e.g. /view?usp=sharing), convert it to /preview format.

You have FULL creative freedom. You may:
- Change the slide type entirely (e.g. bullets → cards, content → two-column)
- Rewrite, expand, or reduce content
- Switch the background mode
- Add/remove/swap illustrations
- Add/remove badges
- Add charts with data
- Embed Google Drive videos using videoUrl
- Restructure the layout
Follow Félix design system color accessibility rules. Never leave widows or orphans.`

    if (activeScope === 'comments') {
      const flaggedComments = editComments.filter(c => editFlaggedIds.has(c.id))
      if (flaggedComments.length === 0) return

      affectedSlideIndices = [...new Set(flaggedComments.map(c => c.slideIndex))].sort((a, b) => a - b)

      // Check if any comments or additional instructions are deck-wide
      const hasDeckWideComment = flaggedComments.some(c =>
        isDeckWideComment(c.text) || c.replies.some(r => isDeckWideComment(r.text))
      )
      const hasDeckWideInstruction = activePrompt.trim() ? isDeckWideComment(activePrompt) : false
      selectiveCommentMode = !hasDeckWideComment && !hasDeckWideInstruction

      const commentLines: string[] = []
      for (const c of flaggedComments) {
        commentLines.push(`- Slide ${c.slideIndex + 1}: "${c.text}" (by ${c.name})`)
        for (const r of c.replies) {
          commentLines.push(`  - Reply from ${r.name}: "${r.text}"`)
        }
      }

      if (selectiveCommentMode) {
        // Selective mode: only send the affected slides to minimize LLM work
        const affectedSlidesData = affectedSlideIndices.map(idx => ({
          originalIndex: idx + 1,
          slide: presentation.slides[idx],
        }))
        fullPrompt = `${EDIT_SCHEMA}\n\nBelow are ONLY the slides that need changes (${affectedSlideIndices.length} of ${presentation.slides.length} total). Each includes its original slide number for context.\n\n${JSON.stringify(affectedSlidesData, null, 2)}\n\nPlease incorporate the following feedback comments:\n${commentLines.join('\n')}${activePrompt.trim() ? `\n\nAdditional instructions: ${activePrompt.trim()}` : ''}\n\nReturn ONLY a JSON array of the updated slide objects in the same order they were provided (${affectedSlideIndices.length} slides). Do NOT return the full deck. Do NOT wrap in {"slides": ...}. Do NOT include a document object.`
      } else {
        // Deck-wide mode: send full deck
        fullPrompt = `${EDIT_SCHEMA}\n\nHere is the current presentation:\n${JSON.stringify(presentation.slides, null, 2)}\n\nPlease incorporate the following feedback comments into the presentation:\n${commentLines.join('\n')}${activePrompt.trim() ? `\n\nAdditional instructions: ${activePrompt.trim()}` : ''}\n\nReturn the updated full deck as a JSON array of slide objects. Do NOT wrap in {"slides": ...}. Do NOT include a document object.`
      }

      for (const c of flaggedComments) {
        fetch(`/api/comments/${c.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId: id, flaggedForRebuild: true }),
        }).catch(() => {})
      }
    } else if (activeScope === 'slide') {
      if (!activePrompt.trim()) return
      fullPrompt = `${EDIT_SCHEMA}\n\nHere is the current slide (slide ${activeSlideIndex + 1} of ${presentation.slides.length}):\n${JSON.stringify(presentation.slides[activeSlideIndex], null, 2)}\n\nApply this change: ${activePrompt.trim()}\n\nReturn ONLY a JSON array containing exactly ONE updated slide object. Example: [{"type": "...", "bg": "...", "title": "...", ...}]\nDo NOT wrap in {"slides": ...}. Do NOT return the full deck. Do NOT include a document object.`
    } else {
      if (!activePrompt.trim()) return
      fullPrompt = `${EDIT_SCHEMA}\n\nHere is the current presentation:\n${JSON.stringify(presentation.slides, null, 2)}\n\n${activePrompt.trim()}\n\nReturn the updated full deck as a JSON array of slide objects. Do NOT wrap in {"slides": ...}. Do NOT include a document object.`
    }

    // Close the edit panel and set up the visual mode
    setShowEdit(false)
    setEditGenerating(true)
    setHint(null)

    if (activeScope === 'slide') {
      setEditOverlay({ mode: 'slide', generating: true, done: false, affectedSlides: [activeSlideIndex] })
    } else if (activeScope === 'comments') {
      setEditOverlay({ mode: 'comments', generating: true, done: false, affectedSlides: affectedSlideIndices })
    } else {
      // Deck mode: show GenerationCanvas in edit mode
      setEditCanvasSlides([...presentation.slides])
      setEditCanvasDone(false)
      setShowEditCanvas(true)
    }

    // Wire up AbortController so Cancel buttons work
    const controller = new AbortController()
    editAbortRef.current = controller

    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          files: editFiles.map((f) => ({ name: f.name, type: f.type, data: f.data })),
          provider,
          apiKey,
          model,
          edit: true,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Generation failed' }))
        console.error('[edit] API error:', data.error)
        alert(data.error || `Generation failed (${res.status})`)
        setEditGenerating(false)
        setEditOverlay(null)
        setShowEditCanvas(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setEditGenerating(false)
        setEditOverlay(null)
        setShowEditCanvas(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const event = JSON.parse(payload)
            if (event.hint) setHint(event.hint)
            else if (event.text) accumulated += event.text
          } catch {
            accumulated += payload
          }
        }

        const parsed = parseIncrementalSlides(accumulated)
        if (parsed.length > 0) {
          if (activeScope === 'slide') {
            // Detect which fields changed for targeted cursor placement
            const updatedSlide = parsed[0]
            const originalSlide = slidesBeforeEditRef.current?.[activeSlideIndex]
            const changed = detectChangedFields(originalSlide, updatedSlide)
            if (changed.length > 0) {
              setEditOverlay(prev => prev ? { ...prev, changedFields: changed } : prev)
            }
            // Single-slide mode: splice only the edited slide into the existing deck
            setPresentation((prev) => {
              if (!prev) return prev
              const newSlides = [...prev.slides]
              newSlides[activeSlideIndex] = updatedSlide
              return { ...prev, slides: newSlides }
            })
          } else if (activeScope === 'comments' && selectiveCommentMode) {
            // Selective comments mode: splice returned slides back at their original positions
            if (slidesBeforeEditRef.current) {
              const allChanged = new Set<string>()
              parsed.forEach((updatedSlide, i) => {
                const originalIdx = affectedSlideIndices[i]
                if (originalIdx !== undefined && slidesBeforeEditRef.current![originalIdx]) {
                  detectChangedFields(slidesBeforeEditRef.current![originalIdx], updatedSlide).forEach(f => allChanged.add(f))
                }
              })
              if (allChanged.size > 0) {
                setEditOverlay(prev => prev ? { ...prev, changedFields: [...allChanged] } : prev)
              }
            }
            setPresentation((prev) => {
              if (!prev) return prev
              const newSlides = [...prev.slides]
              parsed.forEach((updatedSlide, i) => {
                const originalIdx = affectedSlideIndices[i]
                if (originalIdx !== undefined) newSlides[originalIdx] = updatedSlide
              })
              return { ...prev, slides: newSlides }
            })
          } else {
            // Full deck mode (deck scope or deck-wide comments)
            if (activeScope === 'comments' && slidesBeforeEditRef.current) {
              const allChanged = new Set<string>()
              for (const idx of affectedSlideIndices) {
                if (parsed[idx]) {
                  detectChangedFields(slidesBeforeEditRef.current[idx], parsed[idx]).forEach(f => allChanged.add(f))
                }
              }
              if (allChanged.size > 0) {
                setEditOverlay(prev => prev ? { ...prev, changedFields: [...allChanged] } : prev)
              }
            }
            setPresentation((prev) => prev ? { ...prev, slides: parsed } : prev)
            if (activeScope === 'deck') {
              setEditCanvasSlides(parsed)
            }
          }
        }
      }

      // Final update
      const finalParsed = parseIncrementalSlides(accumulated)
      if (finalParsed.length > 0) {
        let finalSlides: typeof finalParsed

        if (activeScope === 'slide') {
          // Splice the single regenerated slide into the original deck
          finalSlides = [...presentation.slides]
          finalSlides[activeSlideIndex] = finalParsed[0]
        } else if (activeScope === 'comments' && selectiveCommentMode) {
          // Splice selective comment results back at their original positions
          finalSlides = [...presentation.slides]
          finalParsed.forEach((updatedSlide, i) => {
            const originalIdx = affectedSlideIndices[i]
            if (originalIdx !== undefined) finalSlides[originalIdx] = updatedSlide
          })
        } else {
          finalSlides = finalParsed
        }

        setPresentation((prev) => prev ? { ...prev, slides: finalSlides } : prev)
        if (activeScope === 'deck') {
          setEditCanvasSlides(finalSlides)
        }

        // Save to API
        await fetch(`/api/studio/presentations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slides: finalSlides }),
        })

        // Auto-resolve flagged comments after successful comments-scope edit
        if (activeScope === 'comments') {
          for (const c of editComments.filter(c => editFlaggedIds.has(c.id))) {
            fetch(`/api/comments/${c.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deckId: id, resolved: true, resolvedBy: 'AI rebuild' }),
            }).catch(() => {})
          }
        }

        // Re-translate after edit (fire-and-forget)
        fetch('/api/studio/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ presentationId: id }),
        }).catch(() => {})

        // Track edit analytics (fire-and-forget)
        if (slidesBeforeEditRef.current) {
          const editAction = activeScope === 'deck' ? 'full_rebuild' : activeScope === 'slide' ? 'slide_rebuild' : 'field_edit'
          const diffs = computeSlideEdits(slidesBeforeEditRef.current, finalSlides, id as string, '')
          // Tag rebuilds with the correct action type
          const events = editAction === 'full_rebuild' || editAction === 'slide_rebuild'
            ? [{ presId: id as string, userId: '', slideIndex: activeScope === 'slide' ? currentSlide : -1, timestamp: Math.floor(Date.now() / 1000), action: editAction as any }, ...diffs]
            : diffs
          if (events.length > 0) {
            fetch('/api/studio/analytics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'edits', events }),
            }).catch(() => {})
          }
          slidesBeforeEditRef.current = null
        }
      }

      // Mark done for the visual animations
      if (activeScope === 'slide' || activeScope === 'comments') {
        setEditOverlay(prev => prev ? { ...prev, generating: false, done: true } : null)
      } else {
        setEditCanvasDone(true)
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Edit generate error:', err)
        alert(err?.message ?? 'Edit generation failed')
      }
      setEditOverlay(null)
      setShowEditCanvas(false)
    } finally {
      setEditGenerating(false)
      setEditPrompt('')
      setEditFiles([])
      setEditFlaggedIds(new Set())
    }
  }, [presentation, editPrompt, editFiles, editScope, editComments, editFlaggedIds, currentSlide, provider, apiKey, model, id])

  // Document edit panel generate — delegates to handleEditGenerate with doc panel state
  const handleDocEditGenerate = useCallback(() => {
    // Sync doc panel state to the main edit state
    if (docEditScope === 'comments') {
      setEditFlaggedIds(docEditFlaggedIds)
      setEditComments(docEditComments)
    }
    setEditFiles(docEditFiles)
    handleEditGenerate({ scope: docEditScope, prompt: docEditPrompt })
    setDocEditPrompt('')
    setDocEditFiles([])
  }, [docEditScope, docEditPrompt, docEditFiles, docEditFlaggedIds, docEditComments, handleEditGenerate])

  // Outline edit panel generate — delegates to handleEditGenerate with outline panel state
  const handleOutlineEditGenerate = useCallback((visibleSectionIndex: number) => {
    if (outlineEditScope === 'comments') {
      setEditFlaggedIds(outlineEditFlaggedIds)
      setEditComments(outlineEditComments)
    }
    setEditFiles(outlineEditFiles)

    if (outlineEditScope === 'slide') {
      // Map visible section to slide index
      const outline = presentation?.outline
      let slideIndex = visibleSectionIndex // fallback: section index = slide index
      if (outline?.sections[visibleSectionIndex]?.slideIndices?.length) {
        slideIndex = outline.sections[visibleSectionIndex].slideIndices[0]
      }
      handleEditGenerate({ scope: 'slide', prompt: outlineEditPrompt, slideIndex })
    } else {
      handleEditGenerate({ scope: outlineEditScope, prompt: outlineEditPrompt })
    }
    setOutlineEditPrompt('')
    setOutlineEditFiles([])
  }, [outlineEditScope, outlineEditPrompt, outlineEditFiles, outlineEditFlaggedIds, outlineEditComments, handleEditGenerate, presentation?.outline])

  // Rebuild slides from document — with GenerationCanvas
  const [docRebuilding, setDocRebuilding] = useState(false)
  const [showRebuildCanvas, setShowRebuildCanvas] = useState(false)
  const [rebuildSlides, setRebuildSlides] = useState<SlideData[]>([])
  const [rebuildDone, setRebuildDone] = useState(false)
  const rebuildAbortRef = useRef<AbortController | null>(null)

  const handleDocRebuild = useCallback(async (doc: PresentationDocument) => {
    if (!presentation || !apiKey.trim()) return

    // Build a prompt from the document content, noting which sections have attachments
    const sectionText = doc.sections
      .map((s) => {
        let text = `## ${s.title}\n${s.content}`
        if (s.attachments?.length) {
          const attDescriptions = s.attachments.map((a) =>
            a.type === 'data'
              ? `[Data file: ${a.name}]\n${a.data}`
              : `[Image attached: ${a.name} — analyze this chart/graph and rebuild as a ChartSpec visualization]`
          )
          text += '\n\n' + attDescriptions.join('\n\n')
        }
        return text
      })
      .join('\n\n')

    const fullPrompt = `Rebuild the presentation slides based on this updated document. Generate 12-16 slides with substantive content on each slide.\n\nDocument Title: ${doc.title}\nDocument Type: ${doc.type}\n\nExecutive Summary:\n${doc.summary}\n\n${sectionText}\n\nGenerate a complete set of presentation slides that accurately reflect this document. Each slide should correspond to the relevant document section. When sections have data attachments, create "chart" type slides with appropriate ChartSpec objects. When sections have image attachments of charts/graphs, analyze them and recreate as interactive chart slides. Return the slides as a JSON array.`

    // Collect image attachments to send via vision
    const files: { name: string; type: 'image' | 'data'; data: string }[] = []
    for (const section of doc.sections) {
      for (const att of section.attachments ?? []) {
        if (att.type === 'image') {
          files.push({ name: att.name, type: 'image', data: att.data })
        }
      }
    }

    // Close doc view, clear URL param, show canvas
    setShowDocument(false)
    const url = new URL(window.location.href)
    url.searchParams.delete('view')
    window.history.replaceState(null, '', url.toString())
    setDocRebuilding(true)
    setRebuildSlides([])
    setRebuildDone(false)
    setShowRebuildCanvas(true)

    const controller = new AbortController()
    rebuildAbortRef.current = controller

    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          files,
          provider,
          apiKey,
          model,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Generation failed' }))
        console.error('[rebuild] API error:', data.error)
        alert(data.error || `Rebuild failed (${res.status})`)
        setDocRebuilding(false)
        setShowRebuildCanvas(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setDocRebuilding(false)
        setShowRebuildCanvas(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const event = JSON.parse(payload)
            if (event.hint) setHint(event.hint)
            else if (event.text) accumulated += event.text
            else if (event.content) accumulated += event.content
          } catch {
            accumulated += payload
          }
        }

        const parsed = parseIncrementalSlides(accumulated)
        if (parsed.length > 0) {
          setRebuildSlides(parsed)
        }
      }

      const finalSlides = parseIncrementalSlides(accumulated)
      if (finalSlides.length > 0) {
        setRebuildSlides(finalSlides)
        setDocRebuilding(false)
        setRebuildDone(true)

        // Update presentation and save
        setPresentation((prev) => prev ? { ...prev, slides: finalSlides } : prev)
        await fetch(`/api/studio/presentations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slides: finalSlides }),
        })
      } else {
        setDocRebuilding(false)
        setShowRebuildCanvas(false)
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Document rebuild error:', err)
      }
      setDocRebuilding(false)
      setShowRebuildCanvas(false)
    }
  }, [presentation, provider, apiKey, model, id])

  if (loading) {
    return (
      <div className="fixed inset-0 z-40 bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-turquoise border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Show rebuild canvas with cursor swarm
  if (showRebuildCanvas) {
    return (
      <GenerationCanvas
        slides={rebuildSlides}
        generating={docRebuilding}
        done={rebuildDone}
        expectedCount={12}
        onSlideClick={(index) => {
          setShowRebuildCanvas(false)
          setRebuildDone(false)
          setRebuildSlides([])
          // Navigate to the clicked slide
          window.location.hash = `#slide-${index}`
        }}
        onCancel={() => {
          rebuildAbortRef.current?.abort()
          setShowRebuildCanvas(false)
          setDocRebuilding(false)
          setRebuildSlides([])
          setRebuildDone(false)
        }}
      />
    )
  }

  // Show edit canvas with cursor swarm (deck edit mode)
  if (showEditCanvas) {
    return (
      <GenerationCanvas
        slides={editCanvasSlides}
        generating={editGenerating}
        done={editCanvasDone}
        expectedCount={editCanvasSlides.length || 12}
        onSlideClick={(index) => {
          setShowEditCanvas(false)
          setEditCanvasDone(false)
          setEditCanvasSlides([])
          window.location.hash = `#slide-${index}`
        }}
        onCancel={() => {
          editAbortRef.current?.abort()
          setShowEditCanvas(false)
          setEditGenerating(false)
          setEditCanvasSlides([])
          setEditCanvasDone(false)
        }}
      />
    )
  }

  if (error || !presentation) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-lg text-muted-foreground mb-6">{error || 'Presentation not found'}</p>
        <button
          type="button"
          onClick={() => router.push('/create')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-turquoise text-slate-950 font-semibold rounded-xl hover:bg-turquoise/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Presentations
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 z-40 transition-colors duration-500 ${showEdit ? 'bg-[#0a0a0a]' : 'bg-transparent'}`}>
      {/* Animated gradient background — visible behind the skewed slide in edit mode */}
      {showEdit && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute -inset-[50%] opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, rgba(43,242,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(96,96,191,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(96,208,111,0.08) 0%, transparent 60%)',
              animation: 'edit-glow 12s ease-in-out infinite alternate',
            }}
          />
          <div
            className="absolute -inset-[50%] opacity-20"
            style={{
              background: 'radial-gradient(ellipse at 70% 30%, rgba(242,102,41,0.10) 0%, transparent 45%), radial-gradient(ellipse at 20% 70%, rgba(43,242,241,0.12) 0%, transparent 50%)',
              animation: 'edit-glow-reverse 15s ease-in-out infinite alternate',
            }}
          />
        </div>
      )}
      {/* Full-screen presentation — 3D perspective shift when edit panel is open */}
      <div
        className="w-full h-full transition-all duration-500 ease-out origin-left"
        style={showEdit ? {
          perspective: '1200px',
          perspectiveOrigin: '0% 50%',
        } : undefined}
      >
      <div
        className="w-full h-full transition-all duration-500 ease-out"
        style={showEdit ? {
          transform: 'rotateY(-6deg) scale(0.88) translateX(-2%)',
          transformOrigin: 'left center',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '20px 0 60px rgba(0,0,0,0.4)',
        } : undefined}
      >
      <SlideRenderer
        slides={presentation.slides}
        title={presentation.title}
        deckId={presentation.id}
        translations={presentation.translations}
        isFullScreen
        forceSlide={forceSlide}
        onClose={() => router.push('/create')}
        hideCloseButton
        document={presentation.document}
        outline={presentation.outline}
        ratingSource={presentation.id}
        topLeftExtra={(chrome: ChromeColors) => (
          <div
            className="transition-opacity duration-300"
            style={{ opacity: chrome.hoverTop || showEdit ? 1 : 0, pointerEvents: chrome.hoverTop || showEdit ? 'auto' : 'none' }}
          >
            <div className={`inline-flex items-center py-1 px-1.5 backdrop-blur-sm rounded-full border gap-[3px] transition-all duration-500 ${chrome.btnCls}`}>
              {/* Exit */}
              <button
                type="button"
                onClick={() => router.push('/create')}
                className={`h-7 px-2 rounded-full inline-flex items-center gap-1.5 transition-colors duration-500 ${chrome.btnIcon} hover:bg-white/10`}
                aria-label="All presentations"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Exit</span>
              </button>
              {currentSlide >= 2 && (
                <>
                  <div className="w-px h-4 flex-shrink-0 bg-current opacity-15" />
                  <button
                    type="button"
                    onClick={() => { window.location.hash = '#slide-0' }}
                    className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-500 animate-in fade-in duration-300 ${chrome.btnIcon} hover:bg-white/10`}
                    aria-label="Restart presentation"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        onShare={() => {
          setShowShareModal(true)
          // Track share intent as a positive signal
          fetch('/api/studio/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'generation_outcome', presId: id, action: 'shared' }),
          }).catch(() => {})
        }}
        onEdit={() => setShowEdit(!showEdit)}
        editActive={showEdit}
        initialViewMode={initialViewMode}
        onViewModeChanged={handleViewModeChanged}
        onSlidesChange={(newSlides) => {
          // Track inline edit diffs
          if (presentation) {
            const diffs = computeSlideEdits(presentation.slides, newSlides, id as string, '')
            if (diffs.length > 0) {
              fetch('/api/studio/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'edits', events: diffs }),
              }).catch(() => {})
            }
          }
          setPresentation(prev => prev ? { ...prev, slides: newSlides } : prev)
        }}
        onGenerateDocument={generateDocument}
        isGeneratingDocument={generatingDoc}
        documentGenFailed={docGenFailed}
        onDocumentChange={(newDoc) => {
          setPresentation(prev => prev ? { ...prev, document: newDoc } : prev)
        }}
        onOutlineChange={(newOutline) => {
          setPresentation(prev => prev ? { ...prev, outline: newOutline } : prev)
        }}
        onRebuild={async () => {
          if (!presentation) return
          // Save current state then trigger regeneration from outline/document edits
          await fetch(`/api/studio/presentations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slides: presentation.slides, document: presentation.document }),
          })
          // Use the edit system with a rebuild prompt — pass overrides
          // so handleEditGenerate uses the right scope/prompt immediately
          const rebuildPrompt = 'Rebuild the presentation slides to match the updated outline/document content. Keep the same structure and slide types, but update the content to reflect the edits.'
          setEditScope('deck')
          setEditPrompt(rebuildPrompt)
          setShowEdit(true)
          handleEditGenerate({ scope: 'deck', prompt: rebuildPrompt })
        }}
        documentEditPanel={{
          editPrompt: docEditPrompt,
          onPromptChange: setDocEditPrompt,
          editScope: docEditScope,
          onScopeChange: setDocEditScope,
          onGenerate: handleDocEditGenerate,
          generating: editGenerating,
          comments: docEditComments,
          commentsLoading: docEditCommentsLoading,
          flaggedIds: docEditFlaggedIds,
          onToggleFlag: toggleDocEditFlag,
          files: docEditFiles,
          onFilesChange: setDocEditFiles,
        }}
        outlineEditPanel={{
          editPrompt: outlineEditPrompt,
          onPromptChange: setOutlineEditPrompt,
          editScope: outlineEditScope,
          onScopeChange: setOutlineEditScope,
          onGenerate: handleOutlineEditGenerate,
          generating: editGenerating,
          comments: outlineEditComments,
          commentsLoading: outlineEditCommentsLoading,
          flaggedIds: outlineEditFlaggedIds,
          onToggleFlag: toggleOutlineEditFlag,
          files: outlineEditFiles,
          onFilesChange: setOutlineEditFiles,
        }}
        sectionFiles={sectionFiles}
        onSectionFilesChange={handleSectionFilesChange}
      />
      </div>
      </div>

      {/* Edit panel */}
      {showEdit && (
        <EditPanel
          scope={editScope}
          onScopeChange={setEditScope}
          editPrompt={editPrompt}
          onPromptChange={setEditPrompt}
          files={editFiles}
          onFilesChange={setEditFiles}
          onGenerate={handleEditGenerate}
          onClose={() => setShowEdit(false)}
          generating={editGenerating}
          currentSlide={currentSlide}
          onOpenSettings={() => setShowSettings(true)}
          deckId={presentation.id}
          comments={editComments}
          commentsLoading={editCommentsLoading}
          flaggedIds={editFlaggedIds}
          onToggleFlag={toggleEditFlag}
        />
      )}

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          provider={provider}
          apiKey={apiKey}
          model={model}
          onProviderChange={setProvider}
          onApiKeyChange={setApiKey}
          onModelChange={setModel}
          onClose={() => setShowSettings(false)}
          userEmail={userEmail}
          notionConnected={notionConnected}
          onNotionConnectedChange={setNotionConnected}
          amplitudeConnected={amplitudeConnected}
          onAmplitudeConnectedChange={setAmplitudeConnected}
          googleWorkspaceConnected={googleWorkspaceConnected}
          onGoogleWorkspaceConnectedChange={setGoogleWorkspaceConnected}
          clickupConnected={clickupConnected}
          onClickupConnectedChange={setClickupConnected}
        />
      )}

      {/* Share modal */}
      {showShareModal && (
        <ShareModal
          presentationId={id}
          onClose={() => setShowShareModal(false)}
          viewMode={currentViewMode}
        />
      )}

      {/* Document panel */}
      {presentation.document && (
        <DocumentPanel
          document={presentation.document}
          currentSlide={currentSlide}
          visible={showDocument}
          onClose={closeDocument}
          onSave={async (doc) => {
            setPresentation((prev) => prev ? { ...prev, document: doc } : prev)
            await fetch(`/api/studio/presentations/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ document: doc }),
            })
          }}
          onRebuild={handleDocRebuild}
          rebuilding={docRebuilding}
          onGoToSlide={(index) => {
            window.location.hash = `#slide-${index}`
          }}
        />
      )}

      {/* Edit overlay — cursor swarm on current slide (slide/comments modes) */}
      {editOverlay && (
        <SlideEditOverlay
          mode={editOverlay.mode}
          generating={editOverlay.generating}
          done={editOverlay.done}
          affectedSlides={editOverlay.affectedSlides}
          changedFields={editOverlay.changedFields}
          onNavigate={(slideIndex) => {
            setForceSlide(slideIndex)
            window.location.hash = `#slide-${slideIndex}`
          }}
          onComplete={() => setEditOverlay(null)}
          onCancel={() => {
            editAbortRef.current?.abort()
            setEditOverlay(null)
            setEditGenerating(false)
          }}
        />
      )}

      {/* Vision model hint toast */}
      {hint && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3 px-5 py-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
            <svg className="w-5 h-5 text-papaya flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-white/70 leading-relaxed">{hint}</p>
            <button
              type="button"
              onClick={() => setHint(null)}
              className="flex-shrink-0 text-white/30 hover:text-white/60 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
