'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUp, Paperclip, X, Settings, FileText, FileSpreadsheet, ChevronDown, Search, Layers, Sparkles, Loader2, ListOrdered } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { loadModelDefaults, useServerSettings } from '@/components/studio/model-selector'
import { type UploadedFile, processFileToUpload, ACCEPT } from '@/components/studio/file-uploader'
import { SettingsModal } from '@/components/studio/settings-modal'
import type { SlideData } from '@/components/studio/slide-renderer'
import { PresentationCard } from '@/components/studio/presentation-card'
import { GenerationCanvas } from '@/components/studio/generation-canvas'
import { OutlineGenerationView, DocumentGenerationView } from '@/components/studio/generation-mode-views'
import { parseIncrementalSlides, parseFinalResult } from '@/lib/incremental-parser'
import { detectIntent } from '@/lib/prompt-strengthener'
import { useIntentPreprocessor } from '@/lib/use-intent-preprocessor'
import type { PresentationDocument } from '@/lib/studio-db'

// #5: Predicted slide counts by intent for speculative layout
const INTENT_SLIDE_COUNTS: Record<string, number> = {
  onboarding: 10, prd: 14, launch: 12, review: 14,
  research: 14, proposal: 12, strategy: 12, general: 12,
}

/* ─────────────────────── Component ─────────────────────── */

export default function CreatePage() {
  const router = useRouter()

  // Form state
  const [prompt, setPrompt] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [showSettings, setShowSettings] = useState(false)

  // Intent preprocessing (runs as user types / uploads files)
  const { intent, label: intentLabel, badgeClass, preprocessed } = useIntentPreprocessor(prompt, files)

  // Model state (loaded from server per-user settings)
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

  // FTUX help tips (dismissible, persisted in localStorage)
  const [showPresTip, setShowPresTip] = useState(false)
  const [showSettingsTip, setShowSettingsTip] = useState(false)
  useEffect(() => {
    try {
      if (!localStorage.getItem('ftux:pres-tip-dismissed')) setShowPresTip(true)
      if (!localStorage.getItem('ftux:settings-tip-dismissed')) setShowSettingsTip(true)
    } catch {}
  }, [])
  const dismissPresTip = useCallback(() => {
    setShowPresTip(false)
    try { localStorage.setItem('ftux:pres-tip-dismissed', '1') } catch {}
  }, [])
  const dismissSettingsTip = useCallback(() => {
    setShowSettingsTip(false)
    try { localStorage.setItem('ftux:settings-tip-dismissed', '1') } catch {}
  }, [])

  // Notion import
  const [showNotionImport, setShowNotionImport] = useState(false)
  const [notionUrl, setNotionUrl] = useState('')
  const [notionLoading, setNotionLoading] = useState(false)
  const [notionError, setNotionError] = useState('')
  const notionInputRef = useRef<HTMLInputElement>(null)

  // Amplitude import
  const [showAmplitudeImport, setShowAmplitudeImport] = useState(false)
  const [ampChartUrl, setAmpChartUrl] = useState('')
  const [ampLoading, setAmpLoading] = useState(false)
  const [ampError, setAmpError] = useState('')
  const ampInputRef = useRef<HTMLInputElement>(null)

  // Google Workspace import
  const [showGoogleImport, setShowGoogleImport] = useState(false)
  const [googleUrl, setGoogleUrl] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState('')
  const googleInputRef = useRef<HTMLInputElement>(null)

  // ClickUp import
  const [showClickupImport, setShowClickupImport] = useState(false)
  const [clickupUrl, setClickupUrl] = useState('')
  const [clickupLoading, setClickupLoading] = useState(false)
  const [clickupError, setClickupError] = useState('')
  const clickupInputRef = useRef<HTMLInputElement>(null)

  // Generation mode: what output format to generate
  type GenerateMode = 'presentation' | 'outline' | 'document'
  const [generateMode, setGenerateMode] = useState<GenerateMode>('presentation')
  const [showModeDropdown, setShowModeDropdown] = useState(false)

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [slides, setSlides] = useState<SlideData[]>([])
  const [generatedDocument, setGeneratedDocument] = useState<PresentationDocument | null>(null)
  const [generatedOutline, setGeneratedOutline] = useState<any>(null)
  const [error, setError] = useState('')
  const [hint, setHint] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [predictedCount, setPredictedCount] = useState(12)
  const abortRef = useRef<AbortController | null>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const modeDropdownRef = useRef<HTMLDivElement>(null)

  // Close mode dropdown on outside click
  useEffect(() => {
    if (!showModeDropdown) return
    const handler = (e: MouseEvent) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) {
        setShowModeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showModeDropdown])

  // Auto-grow prompt textarea when content changes
  useEffect(() => {
    const el = promptRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [prompt])

  // Lazy-load document generation in background after slides are saved
  const generateDocumentInBackground = useCallback(async (presId: string, slides: SlideData[]) => {
    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate document from slides', provider, apiKey, model,
          reverseEngineer: true, slides,
        }),
      })
      if (!res.ok) return
      const reader = res.body?.getReader()
      if (!reader) return
      const decoder = new TextDecoder()
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
            if (event.document) {
              setGeneratedDocument(event.document)
              fetch(`/api/studio/presentations/${presId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document: event.document }),
              }).catch(() => {})
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* background doc gen is non-critical */ }
  }, [provider, apiKey, model])

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return
    if (!apiKey.trim()) {
      setError('Please configure your API key in settings.')
      setShowSettings(true)
      return
    }

    setError('')
    setHint(null)
    setGenerating(true)
    setSlides([])
    setGeneratedDocument(null)
    setGeneratedOutline(null)
    setDone(false)
    setShowCanvas(true)
    setSavedId(null)

    // #5: Speculative layout — predict slide count from intent
    const predicted = INTENT_SLIDE_COUNTS[detectIntent(prompt.trim())] ?? 12
    setPredictedCount(predicted)

    const controller = new AbortController()
    abortRef.current = controller

    // Client-side timeout: 5 minutes max to match server maxDuration
    const clientTimeout = setTimeout(() => controller.abort(), 300000)

    try {
      const useParallel = true // Enable parallel generation for speed
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: preprocessed?.enrichedContext
            ? preprocessed.enrichedContext + prompt.trim()
            : prompt.trim(),
          files: files.map((f) => ({ name: f.name, type: f.type, data: f.data })),
          provider,
          apiKey,
          model,
          parallel: useParallel,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Generation failed' }))
        setError(data.error || `Generation failed (${res.status})`)
        setGenerating(false)
        setShowCanvas(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setError('No response stream')
        setGenerating(false)
        setShowCanvas(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''
      let isParallelMode = false
      let parallelSlides: SlideData[] = []
      let localSavedId: string | null = null
      let slidesFinalized = false
      let savePromise: Promise<void> | null = null
      let pendingDocument: any = null

      // Helper: save presentation (non-blocking)
      const savePresentation = async (slides: SlideData[], doc: any = null) => {
        const title = slides[0]?.title || prompt.trim().slice(0, 60) || 'Untitled'
        try {
          const saveRes = await fetch('/api/studio/presentations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title, prompt: prompt.trim(),
              slides, document: doc, provider, model,
            }),
          })
          if (saveRes.ok) {
            const saveData = await saveRes.json()
            localSavedId = saveData.presentation.id
            setSavedId(localSavedId)
            // If a document arrived while we were saving, patch it now
            if (pendingDocument) {
              fetch(`/api/studio/presentations/${localSavedId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document: pendingDocument }),
              }).catch(() => {})
              pendingDocument = null
            }
            // Trigger async translation (fire-and-forget)
            fetch('/api/studio/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ presentationId: localSavedId }),
            }).catch(() => {})
          }
        } catch { /* save failure is non-critical */ }
      }

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

            if (event.hint) { setHint(event.hint); continue }

            // Parallel mode events
            if (event.outline && Array.isArray(event.outline)) {
              // Parallel skeleton: array of slide placeholders
              isParallelMode = true
              parallelSlides = event.outline as SlideData[]
              setSlides([...parallelSlides])
            } else if (event.outline && !Array.isArray(event.outline)) {
              // Structured outline object (post-generation)
              setGeneratedOutline(event.outline)
              const patchOutline = async () => {
                if (savePromise) await savePromise
                if (localSavedId) {
                  fetch(`/api/studio/presentations/${localSavedId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ outline: event.outline }),
                  }).catch(() => {})
                }
              }
              patchOutline()
            } else if (event.batch && typeof event.startIndex === 'number') {
              isParallelMode = true
              const batch = event.batch as SlideData[]
              for (let i = 0; i < batch.length; i++) {
                parallelSlides[event.startIndex + i] = batch[i]
              }
              setSlides([...parallelSlides])
            } else if (event.slidesReady && isParallelMode && !slidesFinalized) {
              slidesFinalized = true
              const currentSlides = parallelSlides.filter((s) => s && s.type && s.title)
              setSlides(currentSlides)
              setGenerating(false)
              setDone(true)
              // Save presentation — keep the promise so document handler can await it
              savePromise = savePresentation(currentSlides)
              // Lazy-load document in background
              savePromise.then(() => {
                if (localSavedId) generateDocumentInBackground(localSavedId, currentSlides)
              })
            } else if (event.document) {
              // Capture document for document generation view
              setGeneratedDocument(event.document)
              // Document arrived async — wait for save to finish, then patch
              const patchDocument = async () => {
                if (savePromise) await savePromise
                if (localSavedId) {
                  fetch(`/api/studio/presentations/${localSavedId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ document: event.document }),
                  }).catch(() => {})
                } else {
                  // Save hasn't started yet — store for when it completes
                  pendingDocument = event.document
                }
              }
              patchDocument()
            } else if (event.error) {
              // Error — close the canvas and show the error
              setError(event.error)
              setGenerating(false)
              setShowCanvas(false)
              return
            } else if (event.text) {
              accumulated += event.text
            } else if (event.content) {
              accumulated += event.content
            }
          } catch {
            accumulated += payload
          }
        }

        // Sequential mode: parse incrementally
        if (!isParallelMode && accumulated) {
          const parsed = parseIncrementalSlides(accumulated)
          if (parsed.length > 0) setSlides(parsed)
        }
      }

      // Finalization — handle cases where stream ended
      if (isParallelMode && !slidesFinalized) {
        // slidesReady never arrived — finalize from whatever we have
        const currentSlides = parallelSlides.filter((s) => s && s.type && s.title)
        if (currentSlides.length > 0) {
          setSlides(currentSlides)
          setGenerating(false)
          setDone(true)
          savePresentation(currentSlides)
        } else {
          setError('Generation did not produce slides. Please try again.')
          setGenerating(false)
          setShowCanvas(false)
        }
      } else if (!isParallelMode) {
        // Sequential mode finalization
        const result = parseFinalResult(accumulated)
        if (result.slides.length > 0) {
          setSlides(result.slides)
          setGenerating(false)
          setDone(true)
          // Save slides first (no document yet)
          await savePresentation(result.slides, result.document)
          // Lazy-load: generate document + outline in background after slides are saved
          if (!result.document && localSavedId) {
            generateDocumentInBackground(localSavedId, result.slides)
          }
        } else {
          setError('Could not parse slides from the response. Please try again.')
          setGenerating(false)
          setShowCanvas(false)
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // Only show timeout message if not a user-initiated cancel
        if (!abortRef.current?.signal.reason) {
          setError('Generation timed out. Try a shorter prompt or faster model.')
        }
      } else {
        setError(err?.message ?? 'Generation failed')
      }
      setGenerating(false)
      setShowCanvas(false)
    } finally {
      clearTimeout(clientTimeout)
    }
  }, [prompt, files, provider, apiKey, model])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [showPresentations, setShowPresentations] = useState(false)
  const [presentations, setPresentations] = useState<any[]>([])
  const [presentationsLoading, setPresentationsLoading] = useState(false)
  const presentationsFetched = useRef(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  type SortKey = 'created' | 'edited' | 'comments'
  const [sortBy, setSortBy] = useState<SortKey>('created')
  const [sortOpen, setSortOpen] = useState(false)

  // Tab state
  type TabKey = 'mine' | 'shared-by-me' | 'shared-with-me' | 'archived'
  const [activeTab, setActiveTab] = useState<TabKey>('mine')
  const tabCache = useRef<Record<TabKey, any[] | null>>({ mine: null, 'shared-by-me': null, 'shared-with-me': null, archived: null })

  // Multi-select state
  const [multiSelect, setMultiSelect] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [mergeMode, setMergeMode] = useState<'narrative' | 'deduplicate'>('narrative')
  const [mergePrompt, setMergePrompt] = useState('')

  // Close modal on Escape (or exit multi-select first)
  useEffect(() => {
    if (!showPresentations) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (multiSelect) {
          setMultiSelect(false)
          setSelectedIds(new Set())
        } else {
          setShowPresentations(false)
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [showPresentations, multiSelect])

  const fetchPresentations = useCallback(async (tab: TabKey = 'mine', force = false) => {
    // Use cached data if available
    if (!force && tabCache.current[tab]) {
      setPresentations(tabCache.current[tab]!)
      return
    }
    // For initial mine tab, use the old flag to prevent double fetch
    if (tab === 'mine' && presentationsFetched.current && !force) return
    if (tab === 'mine') presentationsFetched.current = true

    setPresentationsLoading(true)
    try {
      const res = await fetch(`/api/studio/presentations?tab=${tab}`)
      if (res.ok) {
        const data = await res.json()
        const items = data.presentations ?? []
        tabCache.current[tab] = items
        setPresentations(items)
      }
    } catch { /* silent */ } finally {
      setPresentationsLoading(false)
    }
  }, [])

  const handleArchivePresentation = async (id: string) => {
    const isArchived = activeTab === 'archived'
    try {
      const res = await fetch(`/api/studio/presentations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !isArchived }),
      })
      if (res.ok) {
        setPresentations((prev) => prev.filter((p) => p.id !== id))
        // Invalidate both tabs so they refresh
        tabCache.current['mine'] = null
        tabCache.current['archived'] = null
      }
    } catch { /* silent */ }
  }

  const openPresentations = () => {
    setShowPresentations(true)
    setSearchQuery('')
    fetchPresentations(activeTab)
    // Focus search after modal animates in
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab)
    setSearchQuery('')
    fetchPresentations(tab)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleMerge = useCallback(async () => {
    if (selectedIds.size < 2) return
    if (!apiKey.trim()) {
      setError('Please configure your API key in settings.')
      setShowSettings(true)
      return
    }

    // Collect slide data from all tabs' caches + current presentations
    const allDecks = [
      ...(tabCache.current.mine ?? []),
      ...(tabCache.current['shared-by-me'] ?? []),
      ...(tabCache.current['shared-with-me'] ?? []),
    ]
    // Deduplicate by id
    const deckMap = new Map(allDecks.map(d => [d.id, d]))
    const selectedDecks = [...selectedIds].map(id => deckMap.get(id)).filter(Boolean)

    if (selectedDecks.length < 2) return

    // Build source material
    const sourceMaterial = selectedDecks.map((deck: any) =>
      `=== Deck: "${deck.title}" (${deck.slides?.length ?? 0} slides) ===\n${JSON.stringify(deck.slides ?? [], null, 1)}`
    ).join('\n\n')

    // Predicted count
    const slideSizes = selectedDecks.map((d: any) => d.slides?.length ?? 0)
    const predictedMergeCount = mergeMode === 'narrative'
      ? Math.min(Math.max(...slideSizes) + 4, 30)
      : Math.min(slideSizes.reduce((a: number, b: number) => a + b, 0), 40)

    // Close modal, show canvas
    setShowPresentations(false)
    setMultiSelect(false)
    setSelectedIds(new Set())
    setError('')
    setHint(null)
    setGenerating(true)
    setSlides([])
    setDone(false)
    setShowCanvas(true)
    setSavedId(null)
    setPredictedCount(predictedMergeCount)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: mergePrompt.trim() || `Merge these ${selectedDecks.length} presentations`,
          provider,
          apiKey,
          model,
          parallel: true,
          merge: {
            mode: mergeMode,
            sourceIds: [...selectedIds],
            sourceMaterial,
          },
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Merge failed' }))
        setError(data.error || `Merge failed (${res.status})`)
        setGenerating(false)
        setShowCanvas(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setError('No response stream')
        setGenerating(false)
        setShowCanvas(false)
        return
      }

      const decoder = new TextDecoder()
      let isParallelMode = false
      let parallelSlides: SlideData[] = []
      let localSavedId: string | null = null
      let slidesFinalized = false
      let savePromise: Promise<void> | null = null
      let pendingDocument: any = null

      const savePresentation = async (slides: SlideData[], doc: any = null) => {
        const title = slides[0]?.title || mergePrompt.trim().slice(0, 60) || 'Merged Presentation'
        try {
          const saveRes = await fetch('/api/studio/presentations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, prompt: mergePrompt.trim(), slides, document: doc, provider, model }),
          })
          if (saveRes.ok) {
            const saveData = await saveRes.json()
            localSavedId = saveData.presentation.id
            setSavedId(localSavedId)
            if (pendingDocument) {
              fetch(`/api/studio/presentations/${localSavedId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document: pendingDocument }),
              }).catch(() => {})
              pendingDocument = null
            }
            fetch('/api/studio/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ presentationId: localSavedId }),
            }).catch(() => {})
          }
        } catch { /* non-critical */ }
      }

      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const event = JSON.parse(payload)
            if (event.hint) { setHint(event.hint); continue }
            if (event.outline) {
              isParallelMode = true
              parallelSlides = event.outline as SlideData[]
              setSlides([...parallelSlides])
            } else if (event.batch && typeof event.startIndex === 'number') {
              isParallelMode = true
              const batch = event.batch as SlideData[]
              for (let i = 0; i < batch.length; i++) {
                parallelSlides[event.startIndex + i] = batch[i]
              }
              setSlides([...parallelSlides])
            } else if (event.slidesReady && isParallelMode && !slidesFinalized) {
              slidesFinalized = true
              const currentSlides = parallelSlides.filter((s) => s && s.type && s.title)
              setSlides(currentSlides)
              setGenerating(false)
              setDone(true)
              savePromise = savePresentation(currentSlides)
            } else if (event.document) {
              const patchDoc = async () => {
                if (savePromise) await savePromise
                if (localSavedId) {
                  fetch(`/api/studio/presentations/${localSavedId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ document: event.document }),
                  }).catch(() => {})
                } else {
                  pendingDocument = event.document
                }
              }
              patchDoc()
            } else if (event.outline) {
              const patchOutline = async () => {
                if (savePromise) await savePromise
                if (localSavedId) {
                  fetch(`/api/studio/presentations/${localSavedId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ outline: event.outline }),
                  }).catch(() => {})
                }
              }
              patchOutline()
            } else if (event.error) {
              setError(event.error)
              setGenerating(false)
              setShowCanvas(false)
              return
            }
          } catch { /* ignore */ }
        }
      }

      // Finalization
      if (isParallelMode && !slidesFinalized) {
        const currentSlides = parallelSlides.filter((s) => s && s.type && s.title)
        if (currentSlides.length > 0) {
          setSlides(currentSlides)
          setGenerating(false)
          setDone(true)
          savePresentation(currentSlides)
        } else {
          setError('Merge did not produce slides. Please try again.')
          setGenerating(false)
          setShowCanvas(false)
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setError(err?.message ?? 'Merge failed')
      }
      setGenerating(false)
      setShowCanvas(false)
    }
  }, [selectedIds, mergeMode, mergePrompt, provider, apiKey, model])

  // Search: extract all text from a slide for matching
  const slideText = useCallback((slide: SlideData): string => {
    const parts = [slide.title, slide.subtitle, slide.body, slide.badge]
    if (slide.bullets) parts.push(...slide.bullets.map(b => b.text))
    if (slide.cards) parts.push(...slide.cards.flatMap(c => [c.title, c.body]))
    if (slide.columns) parts.push(...slide.columns.flatMap(c => [c.heading, c.body, ...(c.bullets?.map(b => b.text) ?? [])]))
    if (slide.quote) parts.push(slide.quote.text, slide.quote.attribution)
    return parts.filter(Boolean).join(' ').toLowerCase()
  }, [])

  // Sort helper
  const sortDecks = useCallback((decks: any[]) => {
    return [...decks].sort((a, b) => {
      if (sortBy === 'comments') return (b.commentCount ?? 0) - (a.commentCount ?? 0)
      if (sortBy === 'edited') return (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0)
      return (b.createdAt ?? 0) - (a.createdAt ?? 0) // 'created' — newest first
    })
  }, [sortBy])

  // Filtered results
  const { filteredDecks, matchingSlides } = (() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return { filteredDecks: sortDecks(presentations), matchingSlides: [] as { deckId: string; deckTitle: string; slideIndex: number; slide: SlideData }[] }

    const decks = presentations.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.slides?.some((s: SlideData) => slideText(s).includes(q))
    )

    const slides: { deckId: string; deckTitle: string; slideIndex: number; slide: SlideData }[] = []
    for (const p of presentations) {
      if (!p.slides) continue
      for (let i = 0; i < p.slides.length; i++) {
        if (slideText(p.slides[i]).includes(q)) {
          slides.push({ deckId: p.id, deckTitle: p.title, slideIndex: i, slide: p.slides[i] })
        }
      }
    }

    return { filteredDecks: sortDecks(decks), matchingSlides: slides }
  })()

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const remaining = 10 - files.length
    if (remaining <= 0) return
    const toProcess = Array.from(fileList).slice(0, remaining)
    const results = await Promise.all(toProcess.map(processFileToUpload))
    const valid = results.filter(Boolean) as UploadedFile[]
    if (valid.length > 0) setFiles((prev) => [...prev, ...valid])
  }, [files.length])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const importNotion = useCallback(async () => {
    if (!notionUrl.trim()) return
    if (!notionConnected) {
      setNotionError('Connect Notion in Settings → Integrations first.')
      return
    }
    setNotionLoading(true)
    setNotionError('')
    try {
      const res = await fetch('/api/studio/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: notionUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setNotionError(data.error || 'Failed to fetch Notion page')
        return
      }
      // Add as a data file attachment
      const notionFile: UploadedFile = {
        id: `notion-${Date.now()}`,
        name: `${data.title || 'Notion'}.md`,
        type: 'data',
        data: data.markdown,
        size: new Blob([data.markdown]).size,
      }
      setFiles((prev) => [...prev, notionFile])
      setShowNotionImport(false)
      setNotionUrl('')
    } catch (err: any) {
      setNotionError(err?.message || 'Failed to import')
    } finally {
      setNotionLoading(false)
    }
  }, [notionUrl, notionConnected])

  const importAmplitude = useCallback(async (type: string, url?: string) => {
    if (!amplitudeConnected) {
      setAmpError('Connect Amplitude in Settings \u2192 Integrations first.')
      return
    }
    setAmpLoading(true)
    setAmpError('')
    try {
      const body: any = { type }
      if (url) body.url = url
      const res = await fetch('/api/studio/amplitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setAmpError(data.error || 'Failed to fetch Amplitude data')
        return
      }
      const ampFile: UploadedFile = {
        id: `amplitude-${Date.now()}`,
        name: `${data.title || 'Amplitude'}.md`,
        type: 'data',
        data: data.markdown,
        size: new Blob([data.markdown]).size,
      }
      setFiles((prev) => [...prev, ampFile])
      setShowAmplitudeImport(false)
      setAmpChartUrl('')
    } catch (err: any) {
      setAmpError(err?.message || 'Failed to import')
    } finally {
      setAmpLoading(false)
    }
  }, [amplitudeConnected])

  const importGoogle = useCallback(async () => {
    if (!googleUrl.trim()) return
    if (!googleWorkspaceConnected) {
      setGoogleError('Connect Google Workspace in Settings \u2192 Integrations first.')
      return
    }
    setGoogleLoading(true)
    setGoogleError('')
    try {
      const res = await fetch('/api/studio/google-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: googleUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGoogleError(data.error || 'Failed to fetch Google document')
        return
      }
      const googleFile: UploadedFile = {
        id: `google-${data.type}-${Date.now()}`,
        name: `${data.title || 'Google'}.md`,
        type: 'data',
        data: data.markdown,
        size: new Blob([data.markdown]).size,
      }
      setFiles((prev) => [...prev, googleFile])
      setShowGoogleImport(false)
      setGoogleUrl('')
    } catch (err: any) {
      setGoogleError(err?.message || 'Failed to import')
    } finally {
      setGoogleLoading(false)
    }
  }, [googleUrl, googleWorkspaceConnected])

  const importClickup = useCallback(async () => {
    if (!clickupUrl.trim()) return
    if (!clickupConnected) {
      setClickupError('Connect ClickUp in Settings → Integrations first.')
      return
    }
    setClickupLoading(true)
    setClickupError('')
    try {
      const res = await fetch('/api/studio/clickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: clickupUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setClickupError(data.error || 'Failed to fetch ClickUp content')
        return
      }
      const clickupFile: UploadedFile = {
        id: `clickup-${data.type}-${Date.now()}`,
        name: `${data.title || 'ClickUp'}.md`,
        type: 'data',
        data: data.markdown,
        size: new Blob([data.markdown]).size,
      }
      setFiles((prev) => [...prev, clickupFile])
      setShowClickupImport(false)
      setClickupUrl('')
    } catch (err: any) {
      setClickupError(err?.message || 'Failed to import')
    } finally {
      setClickupLoading(false)
    }
  }, [clickupUrl, clickupConnected])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  /* ─── Canvas generation view ─── */
  const cancelGeneration = useCallback(() => {
    abortRef.current?.abort()
    setShowCanvas(false)
    setGenerating(false)
    setSlides([])
    setGeneratedDocument(null)
    setGeneratedOutline(null)
    setDone(false)
  }, [])

  if (showCanvas) {
    if (generateMode === 'outline') {
      return (
        <OutlineGenerationView
          slides={slides}
          outline={generatedOutline}
          generating={generating}
          done={done}
          savedId={savedId}
          hint={hint}
          onCancel={cancelGeneration}
          onRestart={() => { cancelGeneration(); setTimeout(() => handleGenerate(), 100) }}
        />
      )
    }

    if (generateMode === 'document') {
      return (
        <DocumentGenerationView
          slides={slides}
          document={generatedDocument}
          generating={generating}
          generatingDoc={done && !generatedDocument}
          done={done && !!generatedDocument}
          savedId={savedId}
          hint={hint}
          onCancel={cancelGeneration}
          onRestart={() => { cancelGeneration(); setTimeout(() => handleGenerate(), 100) }}
        />
      )
    }

    return (
      <>
        <GenerationCanvas
          slides={slides}
          generating={generating}
          done={done}
          expectedCount={predictedCount}
          onSlideClick={(index) => {
            if (savedId) {
              router.push(`/create/${savedId}#slide-${index}`)
            }
          }}
          onCancel={cancelGeneration}
          onRestart={() => {
            cancelGeneration()
            setTimeout(() => handleGenerate(), 100)
          }}
        />
        {hint && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-3 px-5 py-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <svg className="w-5 h-5 text-papaya flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-white/70 leading-relaxed">{hint}</p>
              <button type="button" onClick={() => setHint(null)} className="flex-shrink-0 text-white/30 hover:text-white/60 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  /* ─── Prompt form ─── */
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 relative">
      {/* Presentations pill — fixed top center, aligned with header */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <button
          type="button"
          onClick={openPresentations}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border bg-white hover:bg-stone/50 transition-colors text-sm text-muted-foreground hover:text-foreground shadow-sm"
        >
          Your presentations
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {showPresTip && (
          <div className="mt-2 w-72 bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-3.5 animate-in fade-in slide-in-from-top-2 duration-300 relative">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-l border-t border-white/10 rotate-45" />
            <p className="text-xs text-white/70 leading-relaxed">
              Access all presentations you&apos;ve created, decks you&apos;ve shared with others, and presentations shared with you — all in one place.
            </p>
            <button
              type="button"
              onClick={dismissPresTip}
              className="mt-2 text-[10px] font-semibold text-turquoise hover:text-turquoise/80 transition-colors"
            >
              Got it
            </button>
          </div>
        )}
      </div>

      {/* Full-screen presentations modal — slate dark theme */}
      {showPresentations && (
        <div className="fixed inset-0 z-[400] bg-slate-950 animate-in slide-in-from-top duration-300 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-black text-2xl text-white">
                  Presentations
                </h2>
                {!presentationsLoading && presentations.length > 0 && (
                  <p className="text-sm text-white/40 mt-1">{presentations.length} presentation{presentations.length !== 1 ? 's' : ''}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Search bar */}
                {!presentationsLoading && presentations.length > 0 && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-40 focus:w-96 pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-white/30 hover:text-white/60 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
                {/* Sort dropdown */}
                {!presentationsLoading && presentations.length > 1 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSortOpen(prev => !prev)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 hover:text-white/70 hover:border-white/20 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                      </svg>
                      {{ created: 'Newest', edited: 'Last edited', comments: 'Most comments' }[sortBy]}
                      <ChevronDown className={cn('w-3 h-3 transition-transform', sortOpen && 'rotate-180')} />
                    </button>
                    {sortOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                        <div className="absolute right-0 top-full mt-1 z-50 w-44 py-1 rounded-xl bg-slate-900 border border-white/10 shadow-xl">
                          {([
                            ['created', 'Newest first'],
                            ['edited', 'Last edited'],
                            ['comments', 'Most comments'],
                          ] as [SortKey, string][]).map(([key, label]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => { setSortBy(key); setSortOpen(false) }}
                              className={cn(
                                'w-full text-left px-4 py-2 text-xs transition-colors',
                                sortBy === key
                                  ? 'text-turquoise bg-turquoise/10'
                                  : 'text-white/60 hover:text-white hover:bg-white/5',
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {/* Multi-select toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setMultiSelect(prev => !prev)
                    if (multiSelect) setSelectedIds(new Set())
                  }}
                  className={cn(
                    'p-2.5 rounded-full transition-colors',
                    multiSelect
                      ? 'bg-turquoise/20 text-turquoise'
                      : 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white',
                  )}
                  aria-label="Multi-select"
                  title="Select multiple decks to merge"
                >
                  <Layers className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPresentations(false)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab pills */}
            <div className="flex items-center gap-1 mb-6">
              {([
                { key: 'mine' as TabKey, label: 'My Decks' },
                { key: 'shared-by-me' as TabKey, label: 'Shared by Me' },
                { key: 'shared-with-me' as TabKey, label: 'Shared with Me' },
                { key: 'archived' as TabKey, label: 'Archived' },
              ]).map(tab => {
                // Count selections from this tab (if cached)
                const tabItems = tabCache.current[tab.key]
                const tabSelectedCount = multiSelect && tabItems
                  ? tabItems.filter((p: any) => selectedIds.has(p.id)).length
                  : 0
                return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => switchTab(tab.key)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5',
                    activeTab === tab.key
                      ? 'bg-white/15 text-white'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5',
                  )}
                >
                  {tab.label}
                  {tabSelectedCount > 0 && activeTab !== tab.key && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-turquoise/20 text-turquoise text-[9px] font-bold">
                      {tabSelectedCount}
                    </span>
                  )}
                </button>
                )
              })}
            </div>

            {/* Loading */}
            {presentationsLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-turquoise border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!presentationsLoading && presentations.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-white/40">
                  {activeTab === 'mine' && 'No presentations yet. Create your first one!'}
                  {activeTab === 'shared-by-me' && 'Share a presentation to see it here.'}
                  {activeTab === 'shared-with-me' && 'No one has shared a presentation with you yet.'}
                </p>
              </div>
            )}

            {/* No search results */}
            {!presentationsLoading && presentations.length > 0 && searchQuery && filteredDecks.length === 0 && matchingSlides.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-white/40">
                  No results for &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}

            {/* Deck grid */}
            {!presentationsLoading && filteredDecks.length > 0 && (
              <div>
                {searchQuery && <h3 className="text-xs uppercase tracking-widest text-white/30 font-mono mb-4">Presentations</h3>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDecks.map((p) => (
                    <PresentationCard
                      key={p.id}
                      id={p.id}
                      title={p.title}
                      slideCount={p.slides?.length ?? 0}
                      model={p.model}
                      createdAt={p.createdAt}
                      firstSlide={p.slides?.[0] ?? null}
                      commentCount={p.commentCount}
                      onArchive={(activeTab === 'mine' || activeTab === 'archived') ? handleArchivePresentation : undefined}
                      archiveLabel={activeTab === 'archived' ? 'Unarchive' : 'Archive'}
                      selectable={multiSelect}
                      selected={selectedIds.has(p.id)}
                      onSelect={toggleSelect}
                      ownerName={p.ownerName}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Matching individual slides */}
            {!presentationsLoading && searchQuery && matchingSlides.length > 0 && (
              <div className={filteredDecks.length > 0 ? 'mt-10' : ''}>
                <h3 className="text-xs uppercase tracking-widest text-white/30 font-mono mb-4">Matching Slides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {matchingSlides.slice(0, 20).map((match, idx) => {
                    const colors = (() => {
                      switch (match.slide.bg) {
                        case 'brand': return { bg: 'bg-turquoise', text: 'text-slate-950', muted: 'text-slate-950/50' }
                        case 'light': return { bg: 'bg-stone', text: 'text-foreground', muted: 'text-muted-foreground' }
                        default: return { bg: 'bg-slate-900', text: 'text-white', muted: 'text-white/50' }
                      }
                    })()
                    return (
                      <Link
                        key={`${match.deckId}-${match.slideIndex}-${idx}`}
                        href={`/create/${match.deckId}#slide-${match.slideIndex}`}
                        onClick={() => setShowPresentations(false)}
                        className="group block"
                      >
                        <div className={cn('aspect-video rounded-xl overflow-hidden flex items-center justify-center px-6 relative', colors.bg)}>
                          <p className={cn('font-display font-bold text-xs text-center leading-tight line-clamp-3', colors.text)}>
                            {match.slide.title || 'Untitled slide'}
                          </p>
                          <span className="absolute bottom-2 right-2 text-[9px] font-mono text-white/30">
                            Slide {match.slideIndex + 1}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/40 mt-2 truncate group-hover:text-white/60 transition-colors">
                          {match.deckTitle}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Bottom spacer when merge bar visible */}
            {multiSelect && selectedIds.size >= 2 && <div className="h-24" />}
          </div>

          {/* Merge action bar — sticky to bottom of scrollable modal */}
          {multiSelect && selectedIds.size >= 2 && (
            <div className="sticky bottom-0 left-0 right-0 z-[410] bg-slate-900/95 backdrop-blur-md border-t border-white/10">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                {/* Selected count with cross-tab context */}
                <div className="flex flex-col shrink-0">
                  <span className="text-sm font-medium text-white/70 whitespace-nowrap">
                    {selectedIds.size} selected
                  </span>
                  {/* Show how many are from other tabs */}
                  {(() => {
                    const currentTabIds = new Set((presentations ?? []).map((p: any) => p.id))
                    const otherTabCount = [...selectedIds].filter(id => !currentTabIds.has(id)).length
                    if (otherTabCount > 0) {
                      return (
                        <span className="text-[10px] text-white/40 whitespace-nowrap">
                          {otherTabCount} from other tab{otherTabCount !== 1 ? 's' : ''}
                        </span>
                      )
                    }
                    return null
                  })()}
                </div>

                {/* Merge prompt input */}
                <input
                  type="text"
                  value={mergePrompt}
                  onChange={(e) => setMergePrompt(e.target.value)}
                  placeholder="Merge instructions (optional)..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleMerge()
                    }
                  }}
                />

                {/* Mode toggle */}
                <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setMergeMode('narrative')}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                      mergeMode === 'narrative'
                        ? 'bg-turquoise/20 text-turquoise'
                        : 'text-white/40 hover:text-white/60',
                    )}
                  >
                    Unified Narrative
                  </button>
                  <button
                    type="button"
                    onClick={() => setMergeMode('deduplicate')}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                      mergeMode === 'deduplicate'
                        ? 'bg-turquoise/20 text-turquoise'
                        : 'text-white/40 hover:text-white/60',
                    )}
                  >
                    Merge & Deduplicate
                  </button>
                </div>

                {/* Generate button */}
                <button
                  type="button"
                  onClick={handleMerge}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-turquoise text-slate-950 font-semibold text-sm rounded-lg hover:bg-turquoise/90 transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  Merge Decks
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-2xl space-y-6">
        {/* Greeting */}
        <div className="text-center space-y-2 mb-4">
          <h1 className="font-display font-black text-3xl text-foreground">
            What would you like to present?
          </h1>
        </div>

        {/* Unified input box */}
        <div
          className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
            dragOver
              ? 'border-concrete ring-2 ring-concrete/30'
              : 'border-border focus-within:border-concrete'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false)
            if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
          }}
        >
          {/* Textarea */}
          <textarea
            ref={promptRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your presentation..."
            className="w-full min-h-[80px] px-5 pt-4 pb-2 bg-transparent text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none text-base leading-relaxed"
            autoFocus
          />

          {/* File chips */}
          {files.length > 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 bg-stone/60 rounded-lg text-xs text-foreground/70 group"
                >
                  {file.type === 'image' && file.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.preview} alt="" className="w-4 h-4 rounded object-cover" />
                  ) : file.id.startsWith('notion-') ? (
                    <svg className="w-3.5 h-3.5 text-foreground/50" viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.486 2.35c-.42-.326-.98-.7-2.055-.607L3.36 2.86c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.213.98l14.523-.84c.84-.046.934-.56.934-1.166V6.354c0-.606-.234-.933-.747-.886l-15.177.887c-.56.046-.746.327-.746.933z"/></svg>
                  ) : file.id.startsWith('amplitude-') ? (
                    <svg className="w-3.5 h-3.5 text-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 5 4-9" /></svg>
                  ) : file.type === 'data' ? (
                    <FileSpreadsheet className="w-3.5 h-3.5 text-cactus/70" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-0.5 rounded hover:bg-foreground/10 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <div className="flex items-center gap-1">
              {/* Attach button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-stone/60 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Attach files"
              >
                <Paperclip className="w-4.5 h-4.5" />
              </button>

              {/* Notion import button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotionImport(!showNotionImport)
                    setNotionError('')
                    setTimeout(() => notionInputRef.current?.focus(), 100)
                  }}
                  className={`p-2 rounded-lg hover:bg-stone/60 transition-colors ${showNotionImport ? 'text-foreground bg-stone/60' : 'text-muted-foreground hover:text-foreground'}`}
                  aria-label="Import from Notion"
                  title="Import from Notion"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.486 2.35c-.42-.326-.98-.7-2.055-.607L3.36 2.86c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.213.98l14.523-.84c.84-.046.934-.56.934-1.166V6.354c0-.606-.234-.933-.747-.886l-15.177.887c-.56.046-.746.327-.746.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.607.327-1.166.514-1.633.514-.747 0-.934-.234-1.494-.933l-4.577-7.186v6.952l1.447.327s0 .84-1.166.84l-3.22.187c-.093-.187 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.454-.233 4.764 7.279v-6.44l-1.213-.14c-.094-.514.28-.886.746-.933zM2.708 1.88C4.017.934 5.792.374 7.822.28l13.076-.793c2.008-.14 2.521.467 2.521 1.586v3.219c0 .56-.234 1.027-.934 1.12l-15.176.887c-.56.046-.793.327-.793.7v14.09c0 .56-.327.84-.747.84s-.934-.14-1.307-.373L1.167 19.67c-.747-.56-1.073-1.307-1.073-2.24V4.399c0-.933.42-2.007 2.614-2.519z"/>
                  </svg>
                </button>

                {/* Notion import popover */}
                {showNotionImport && (
                  <div className="absolute bottom-full left-0 mb-2 w-80 bg-slate-950 rounded-xl border border-white/10 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Import from Notion</h4>
                      <button type="button" onClick={() => setShowNotionImport(false)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        ref={notionInputRef}
                        type="text"
                        value={notionUrl}
                        onChange={(e) => setNotionUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); importNotion() } }}
                        placeholder="Paste Notion page URL..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button
                        type="button"
                        onClick={importNotion}
                        disabled={!notionUrl.trim() || notionLoading}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {notionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import'}
                      </button>
                    </div>
                    {notionError && <p className="text-xs text-red-400">{notionError}</p>}
                    {!notionConnected && (
                      <button
                        type="button"
                        onClick={() => { setShowNotionImport(false); setShowSettings(true) }}
                        className="text-xs text-turquoise hover:text-turquoise/80 transition-colors"
                      >
                        Set up Notion integration in Settings
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Amplitude import button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowAmplitudeImport(!showAmplitudeImport)
                    setAmpError('')
                    setTimeout(() => ampInputRef.current?.focus(), 100)
                  }}
                  className={`p-2 rounded-lg hover:bg-stone/60 transition-colors ${showAmplitudeImport ? 'text-foreground bg-stone/60' : 'text-muted-foreground hover:text-foreground'}`}
                  aria-label="Import from Amplitude"
                  title="Import from Amplitude"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-8 4 5 4-9" />
                  </svg>
                </button>

                {/* Amplitude import popover */}
                {showAmplitudeImport && (
                  <div className="absolute bottom-full left-0 mb-2 w-80 bg-slate-950 rounded-xl border border-white/10 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Import from Amplitude</h4>
                      <button type="button" onClick={() => setShowAmplitudeImport(false)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Chart URL input */}
                    <div className="flex gap-2">
                      <input
                        ref={ampInputRef}
                        type="text"
                        value={ampChartUrl}
                        onChange={(e) => setAmpChartUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); importAmplitude('chart', ampChartUrl) } }}
                        placeholder="Paste Amplitude chart URL..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button
                        type="button"
                        onClick={() => importAmplitude('chart', ampChartUrl)}
                        disabled={!ampChartUrl.trim() || ampLoading}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {ampLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import'}
                      </button>
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => importAmplitude('users')}
                        disabled={ampLoading}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 disabled:opacity-30 transition-colors"
                      >
                        Active Users
                      </button>
                      <button
                        type="button"
                        onClick={() => importAmplitude('event-list')}
                        disabled={ampLoading}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 disabled:opacity-30 transition-colors"
                      >
                        Top Events
                      </button>
                      <button
                        type="button"
                        onClick={() => importAmplitude('revenue')}
                        disabled={ampLoading}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 disabled:opacity-30 transition-colors"
                      >
                        Revenue
                      </button>
                    </div>

                    {ampError && <p className="text-xs text-red-400">{ampError}</p>}
                    {!amplitudeConnected && (
                      <button
                        type="button"
                        onClick={() => { setShowAmplitudeImport(false); setShowSettings(true) }}
                        className="text-xs text-turquoise hover:text-turquoise/80 transition-colors"
                      >
                        Set up Amplitude in Settings
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Google Workspace import button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoogleImport(!showGoogleImport)
                    setGoogleError('')
                    setTimeout(() => googleInputRef.current?.focus(), 100)
                  }}
                  className={`p-2 rounded-lg hover:bg-stone/60 transition-colors ${showGoogleImport ? 'text-foreground bg-stone/60' : 'text-muted-foreground hover:text-foreground'}`}
                  aria-label="Import from Google"
                  title="Import from Google Sheets, Docs, or Slides"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                </button>

                {/* Google import popover */}
                {showGoogleImport && (
                  <div className="absolute bottom-full left-0 mb-2 w-80 bg-slate-950 rounded-xl border border-white/10 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Import from Google</h4>
                      <button type="button" onClick={() => setShowGoogleImport(false)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        ref={googleInputRef}
                        type="text"
                        value={googleUrl}
                        onChange={(e) => setGoogleUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); importGoogle() } }}
                        placeholder="Paste Sheets, Docs, or Slides URL..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button
                        type="button"
                        onClick={importGoogle}
                        disabled={!googleUrl.trim() || googleLoading}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import'}
                      </button>
                    </div>
                    <p className="text-[11px] text-white/30">Supports Google Sheets, Docs, and Slides. Documents must be link-shared.</p>
                    {googleError && <p className="text-xs text-red-400">{googleError}</p>}
                    {!googleWorkspaceConnected && (
                      <button
                        type="button"
                        onClick={() => { setShowGoogleImport(false); setShowSettings(true) }}
                        className="text-xs text-turquoise hover:text-turquoise/80 transition-colors"
                      >
                        Set up Google Workspace in Settings
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ClickUp import button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowClickupImport(!showClickupImport)
                    setClickupError('')
                    setTimeout(() => clickupInputRef.current?.focus(), 100)
                  }}
                  className={`p-2 rounded-lg hover:bg-stone/60 transition-colors ${showClickupImport ? 'text-foreground bg-stone/60' : 'text-muted-foreground hover:text-foreground'}`}
                  aria-label="Import from ClickUp"
                  title="Import from ClickUp"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.705 16.26l3.397-2.605c1.702 2.216 3.347 3.249 5.298 3.249 1.94 0 3.578-1.022 5.297-3.259l3.399 2.593c-2.468 3.222-5.2 4.966-8.696 4.966-3.485 0-6.227-1.755-8.695-4.944zM12.39 7.598l-4.906 4.357-3.302-3.725L12.4 1.204l8.198 7.026-3.302 3.725z"/>
                  </svg>
                </button>

                {/* ClickUp import popover */}
                {showClickupImport && (
                  <div className="absolute bottom-full left-0 mb-2 w-80 bg-slate-950 rounded-xl border border-white/10 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Import from ClickUp</h4>
                      <button type="button" onClick={() => setShowClickupImport(false)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        ref={clickupInputRef}
                        type="text"
                        value={clickupUrl}
                        onChange={(e) => setClickupUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); importClickup() } }}
                        placeholder="Paste task or list URL..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button
                        type="button"
                        onClick={importClickup}
                        disabled={!clickupUrl.trim() || clickupLoading}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {clickupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import'}
                      </button>
                    </div>
                    <p className="text-[11px] text-white/30">Import a task with subtasks or an entire list.</p>
                    {clickupError && <p className="text-xs text-red-400">{clickupError}</p>}
                    {!clickupConnected && (
                      <button
                        type="button"
                        onClick={() => { setShowClickupImport(false); setShowSettings(true) }}
                        className="text-xs text-turquoise hover:text-turquoise/80 transition-colors"
                      >
                        Set up ClickUp in Settings
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Settings button + FTUX tip */}
              <div className="relative">
                {showSettingsTip && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300 z-30">
                    <p className="text-xs text-white/70 leading-relaxed">
                      Choose a model provider and add your API key before creating your first presentation.
                    </p>
                    <button
                      type="button"
                      onClick={dismissSettingsTip}
                      className="mt-2 text-[10px] font-semibold text-turquoise hover:text-turquoise/80 transition-colors"
                    >
                      Got it
                    </button>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-white/10 rotate-45" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { setShowSettings(true); dismissSettingsTip() }}
                  className="p-2 rounded-lg hover:bg-stone/60 transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Model settings"
                >
                  <Settings className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Intent badge */}
              {intent !== 'general' && prompt.trim().length >= 3 && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ml-1 animate-in fade-in duration-200 ${badgeClass}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {intentLabel}
                </span>
              )}
            </div>

            {/* Combo generate button */}
            <div ref={modeDropdownRef} className="relative flex items-stretch">
              {/* Main action button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-2 rounded-l-lg bg-foreground text-white disabled:cursor-default hover:enabled:bg-foreground/80 transition-colors text-xs font-semibold"
                aria-label={`Generate ${generateMode}`}
              >
                {generateMode === 'presentation' && <Layers className="w-3.5 h-3.5" />}
                {generateMode === 'outline' && <ListOrdered className="w-3.5 h-3.5" />}
                {generateMode === 'document' && <FileText className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {generateMode === 'presentation' ? 'Present' : generateMode === 'outline' ? 'Outline' : 'Document'}
                </span>
                <ArrowUp className="w-3.5 h-3.5 sm:hidden" strokeWidth={2.5} />
              </button>

              {/* Dropdown toggle */}
              <button
                type="button"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="inline-flex items-center px-2 rounded-r-lg bg-foreground text-white hover:bg-foreground/80 transition-colors border-l border-white/20"
                aria-label="Change generation mode"
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${showModeDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {showModeDropdown && (
                <div className="absolute bottom-full right-0 mb-2 w-52 bg-white rounded-xl border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
                  {([
                    { mode: 'presentation' as const, icon: Layers, label: 'Presentation', desc: 'Full slide deck' },
                    { mode: 'outline' as const, icon: ListOrdered, label: 'Outline', desc: 'Structured overview' },
                    { mode: 'document' as const, icon: FileText, label: 'Rich Document', desc: 'Narrative document' },
                  ]).map(({ mode, icon: Icon, label, desc }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setGenerateMode(mode)
                        setShowModeDropdown(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        generateMode === mode
                          ? 'bg-evergreen/5'
                          : 'hover:bg-stone/40'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${generateMode === mode ? 'text-evergreen' : 'text-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${generateMode === mode ? 'text-evergreen' : 'text-foreground'}`}>{label}</p>
                        <p className="text-[11px] text-muted-foreground">{desc}</p>
                      </div>
                      {generateMode === mode && (
                        <svg className="w-4 h-4 text-evergreen shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          multiple
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
            e.target.value = ''
          }}
          className="hidden"
        />

        {error && (
          <div className="p-3 bg-papaya/10 border border-papaya/20 rounded-xl text-center">
            <p className="text-sm text-papaya">{error}</p>
          </div>
        )}
      </div>

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
    </div>
  )
}
