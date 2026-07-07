'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowUp, Paperclip, X, Settings, FileText, FileSpreadsheet, ChevronDown, Search, Layers, Sparkles, Loader2, ListOrdered, Palette, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { loadModelDefaults, useServerSettings } from '@/components/studio/model-selector'
import { type UploadedFile, processFileToUpload, ACCEPT } from '@/components/studio/file-uploader'
import { SettingsModal } from '@/components/studio/settings-modal'
import type { SlideData } from '@/components/studio/slide-renderer'
import { PresentationCard } from '@/components/studio/presentation-card'
import { TemplatePicker } from '@/components/studio/template-picker'
import { BrandKitEditor } from '@/components/studio/brand-kit-editor'
import type { TemplateSectionSkeleton } from '@/lib/studio-db'
import { GenerationCanvas } from '@/components/studio/generation-canvas'
import { OutlineGenerationView, DocumentGenerationView } from '@/components/studio/generation-mode-views'
import { CreateStarterActions } from '@/components/studio/create-starter-actions'
import { SaveStatusPill } from '@/components/studio/save-status-pill'
import { consumeGenerationStream } from '@/lib/studio-generation-stream'
import { useIntentPreprocessor } from '@/lib/use-intent-preprocessor'
import { analyzeSlides, coachSummary, type CoachSuggestion } from '@/lib/slide-coach'
import type { PresentationDocument } from '@/lib/studio-db'
import {
  buildCreateGenerationPayload,
  buildMergeGenerationPayload,
  createDeckTitle,
  filterPresentationLibrary,
  getErrorMessage,
  getSelectedDecksForMerge,
  predictCreateSlideCount,
  predictMergeSlideCount,
  presentationFetchFailure,
  readResponseError,
  type GenerateMode,
  type MergeSourceDeck,
  type PresentationSortKey,
  type PresentationListStatus,
  type SaveStatus,
  type TabKey,
} from '@/lib/studio-create-controller'

/* ─────────────────────── Component ─────────────────────── */

export default function CreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Form state
  const [prompt, setPrompt] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showBrandKit, setShowBrandKit] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; title: string; description: string; slideCount: number; sections: TemplateSectionSkeleton[]; createdAt: number } | null>(null)

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
  const [coachResults, setCoachResults] = useState<{ suggestions: CoachSuggestion[]; score: number } | null>(null)
  const [showQualityWarning, setShowQualityWarning] = useState(false)
  const pendingSaveRef = useRef<(() => void) | null>(null)
  const [showCanvas, setShowCanvas] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [saveError, setSaveError] = useState('')
  const [saveRetryAvailable, setSaveRetryAvailable] = useState(false)
  const saveRetryRef = useRef<(() => Promise<void>) | null>(null)
  const [predictedCount, setPredictedCount] = useState(12)
  const abortRef = useRef<AbortController | null>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const composerRef = useRef<HTMLDivElement>(null)
  const modeDropdownRef = useRef<HTMLDivElement>(null)
  const [starterMorphing, setStarterMorphing] = useState(false)
  const [starterComposerArriving, setStarterComposerArriving] = useState(false)
  const [starterPromptLabel, setStarterPromptLabel] = useState<string | null>(null)
  const [starterPromptRevealing, setStarterPromptRevealing] = useState(false)
  const [starterPromptResetting, setStarterPromptResetting] = useState(false)
  const starterComposerArriveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const starterPromptFxEndRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const starterResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (starterComposerArriveRef.current) clearTimeout(starterComposerArriveRef.current)
      if (starterPromptFxEndRef.current) clearTimeout(starterPromptFxEndRef.current)
      if (starterResetRef.current) clearTimeout(starterResetRef.current)
    }
  }, [])

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

  useEffect(() => {
    if (!prompt.trim() && starterPromptLabel) {
      setStarterPromptLabel(null)
    }
  }, [prompt, starterPromptLabel])

  const clearSaveRetry = useCallback(() => {
    saveRetryRef.current = null
    setSaveRetryAvailable(false)
  }, [])

  const resetSaveState = useCallback(() => {
    setSaveStatus('idle')
    setSaveError('')
    clearSaveRetry()
  }, [clearSaveRetry])

  const getStarterMorphTargetRect = useCallback(() => (
    composerRef.current?.getBoundingClientRect() ?? null
  ), [])

  const handleStarterActionStart = useCallback(() => {
    if (starterComposerArriveRef.current) clearTimeout(starterComposerArriveRef.current)
    setStarterComposerArriving(false)
    setStarterPromptResetting(false)
    setStarterMorphing(true)
  }, [])

  const handleStarterActionEnd = useCallback(() => {
    setStarterMorphing(false)
    setStarterComposerArriving(true)
    starterComposerArriveRef.current = setTimeout(() => {
      setStarterComposerArriving(false)
    }, 520)
  }, [])

  const selectStarterPrompt = useCallback((nextPrompt: string, label: string) => {
    if (starterPromptFxEndRef.current) clearTimeout(starterPromptFxEndRef.current)
    if (starterResetRef.current) clearTimeout(starterResetRef.current)
    setStarterMorphing(false)
    setStarterPromptLabel(label)
    setStarterPromptResetting(false)
    setStarterPromptRevealing(true)
    setPrompt(nextPrompt)
    starterPromptFxEndRef.current = setTimeout(() => setStarterPromptRevealing(false), 820)
    requestAnimationFrame(() => promptRef.current?.focus())
  }, [])

  const resetStarterPrompt = useCallback(() => {
    if (starterPromptFxEndRef.current) clearTimeout(starterPromptFxEndRef.current)
    if (starterResetRef.current) clearTimeout(starterResetRef.current)
    setError('')
    setHint(null)
    setStarterMorphing(false)
    setStarterComposerArriving(false)
    setStarterPromptRevealing(false)
    setStarterPromptResetting(true)
    starterResetRef.current = setTimeout(() => {
      setPrompt('')
      setStarterPromptLabel(null)
      setStarterPromptResetting(false)
      requestAnimationFrame(() => promptRef.current?.focus())
    }, 240)
  }, [])

  const recordSaveFailure = useCallback((message: string, retry?: () => Promise<void>) => {
    setSaveStatus('error')
    setSaveError(message)
    saveRetryRef.current = retry ?? null
    setSaveRetryAvailable(Boolean(retry))
  }, [])

  const savePresentationToLibrary = useCallback(async ({
    title,
    promptText,
    slides: slidesToSave,
    document = null,
  }: {
    title: string
    promptText: string
    slides: SlideData[]
    document?: unknown | null
  }) => {
    const runSave = async () => {
      setSaveStatus('saving')
      setSaveError('')
      const saveRes = await fetch('/api/studio/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          prompt: promptText,
          slides: slidesToSave,
          document,
          provider,
          model,
        }),
      })

      if (!saveRes.ok) {
        throw new Error(await readResponseError(saveRes, 'Save failed'))
      }

      const saveData = await saveRes.json().catch(() => null)
      const presentationId = saveData?.presentation?.id
      if (!presentationId) {
        throw new Error('Save response did not include a presentation id.')
      }

      setSavedId(presentationId)
      setSaveStatus('saved')
      setSaveError('')
      clearSaveRetry()
      return presentationId as string
    }

    try {
      return await runSave()
    } catch (err) {
      recordSaveFailure(getErrorMessage(err, 'Save failed. Please try again.'))
      return null
    }
  }, [clearSaveRetry, model, provider, recordSaveFailure])

  const patchSavedPresentation = useCallback(async (
    presentationId: string,
    payload: Record<string, unknown>,
    label: string,
  ) => {
    const runPatch = async () => {
      setSaveStatus('syncing')
      setSaveError('')
      const patchRes = await fetch(`/api/studio/presentations/${presentationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!patchRes.ok) {
        throw new Error(await readResponseError(patchRes, `${label} sync failed`))
      }

      setSaveStatus('saved')
      setSaveError('')
      clearSaveRetry()
    }

    try {
      await runPatch()
      return true
    } catch (err) {
      recordSaveFailure(
        `Saved, but ${label} did not sync. ${getErrorMessage(err, 'Please retry the sync.')}`,
        runPatch,
      )
      return false
    }
  }, [clearSaveRetry, recordSaveFailure])

  const runPostSaveJobs = useCallback((presentationId: string, includeQualityRating = false) => {
    fetch(`/api/studio/presentations/${presentationId}/post-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        translations: true,
        qualityRating: includeQualityRating,
      }),
    }).then((res) => {
      if (!res.ok) throw new Error(`Post-save jobs failed (${res.status})`)
    }).catch((err) => {
      console.warn('[Studio] Post-save jobs failed', err)
    })
  }, [])

  const retrySave = useCallback(async () => {
    const retry = saveRetryRef.current
    if (!retry) return
    try {
      await retry()
    } catch (err) {
      recordSaveFailure(getErrorMessage(err, 'Retry failed. Please try again.'), retry)
    }
  }, [recordSaveFailure])

  // Lazy-load document generation in background after slides are saved
  const generateDocumentInBackground = useCallback(async (presId: string, slides: SlideData[]) => {
    try {
      setSaveStatus('syncing')
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate document from slides', provider, apiKey, model,
          reverseEngineer: true, slides,
        }),
      })
      if (!res.ok) {
        throw new Error(await readResponseError(res, 'Document generation failed'))
      }
      const reader = res.body?.getReader()
      if (!reader) {
        throw new Error('Document generation did not return a stream.')
      }
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
              await patchSavedPresentation(presId, { document: event.document }, 'document')
            }
          } catch { /* ignore */ }
        }
      }
      setSaveStatus('saved')
    } catch (err) {
      recordSaveFailure(
        getErrorMessage(err, 'Saved, but Studio could not generate the document view.'),
        async () => {
          await generateDocumentInBackground(presId, slides)
        },
      )
    }
  }, [apiKey, model, patchSavedPresentation, provider, recordSaveFailure])

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
    resetSaveState()

    // Speculative layout — predict slide count from intent
    const predicted = predictCreateSlideCount(prompt.trim())
    setPredictedCount(predicted)

    const controller = new AbortController()
    abortRef.current = controller

    // Client-side timeout: 5 minutes max to match server maxDuration
    const clientTimeout = setTimeout(() => controller.abort(), 300000)

    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildCreateGenerationPayload({
          prompt,
          enrichedContext: preprocessed?.enrichedContext,
          files,
          settings: { provider, apiKey, model },
          selectedTemplate,
        })),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Generation failed' }))
        setError(data.error || `Generation failed (${res.status})`)
        setGenerating(false)
        setShowCanvas(false)
        return
      }

      let localSavedId: string | null = null
      let savePromise: Promise<void> | null = null
      let pendingDocument: any = null
      let pendingOutline: any = null

      const persistSlides = async (slidesToSave: SlideData[], doc: any = null) => {
        const documentFromStream = pendingDocument
        const outlineFromStream = pendingOutline
        const title = createDeckTitle(slidesToSave, prompt, 'Untitled')

        const presentationId = await savePresentationToLibrary({
          title,
          promptText: prompt.trim(),
          slides: slidesToSave,
          document: doc,
        })

        if (!presentationId) {
          saveRetryRef.current = async () => { await persistSlides(slidesToSave, doc) }
          setSaveRetryAvailable(true)
          return
        }

        localSavedId = presentationId
        if (documentFromStream && !doc) {
          await patchSavedPresentation(presentationId, { document: documentFromStream }, 'document')
        }
        pendingDocument = null

        if (outlineFromStream) {
          await patchSavedPresentation(presentationId, { outline: outlineFromStream }, 'outline')
        }
        pendingOutline = null

        if (!doc && !documentFromStream) {
          generateDocumentInBackground(presentationId, slidesToSave)
        }
        runPostSaveJobs(presentationId, true)
      }

      const patchDocument = async (doc: any) => {
        setGeneratedDocument(doc)
        if (savePromise) await savePromise
        if (localSavedId) {
          await patchSavedPresentation(localSavedId, { document: doc }, 'document')
        } else {
          pendingDocument = doc
        }
      }

      const patchOutline = async (outline: any) => {
        setGeneratedOutline(outline)
        if (savePromise) await savePromise
        if (localSavedId) {
          await patchSavedPresentation(localSavedId, { outline }, 'outline')
        } else {
          pendingOutline = outline
        }
      }

      const finishSlides = (currentSlides: SlideData[], document?: any) => {
        setSlides(currentSlides)
        if (document) setGeneratedDocument(document)
        setGenerating(false)
        setDone(true)

        const suggestions = analyzeSlides(currentSlides)
        const summary = coachSummary(suggestions)
        setCoachResults({ suggestions, score: summary.score })
        if (summary.errors > 0) console.warn(`[Slide Coach] ${summary.errors} errors, ${summary.warnings} warnings — score: ${summary.score}/100`)

        const doSave = (slidesToSave: SlideData[]) => {
          savePromise = persistSlides(slidesToSave, document ?? null)
        }

        if (summary.errors > 0) {
          setSaveStatus('pending-quality')
          pendingSaveRef.current = () => doSave(currentSlides)
          setShowQualityWarning(true)
        } else {
          doSave(currentSlides)
        }
      }

      const result = await consumeGenerationStream(res, {
        onHint: setHint,
        onDeckQuality: (quality: any) => {
          if (typeof quality?.score !== 'number') return
          const deckType = quality.deckType ? ` ${quality.deckType}` : ' deck'
          if (quality.repaired) {
            setHint(`Deck intelligence polished this${deckType} to ${quality.score}/100.`)
          } else if (!quality.passed) {
            setHint(`Deck intelligence is checking this${deckType}: ${quality.score}/100.`)
          }
        },
        onSlides: (nextSlides) => setSlides(nextSlides as SlideData[]),
        onOutline: patchOutline,
        onDocument: patchDocument,
        onReady: ({ slides: readySlides, document }) => finishSlides(readySlides as SlideData[], document),
        onError: (message) => {
          setError(message)
          setGenerating(false)
          setShowCanvas(false)
        },
        onEmpty: (message) => {
          setError(message)
          setGenerating(false)
          setShowCanvas(false)
        },
      })

      if (!result.ok) {
        return
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
  }, [prompt, files, provider, apiKey, model, preprocessed?.enrichedContext, selectedTemplate, generateDocumentInBackground, patchSavedPresentation, resetSaveState, runPostSaveJobs, savePresentationToLibrary])

  // Auto-trigger generation from audience adaptation
  const adaptTriggered = useRef(false)
  const handleGenerateRef = useRef(handleGenerate)
  handleGenerateRef.current = handleGenerate
  useEffect(() => {
    if (adaptTriggered.current) return
    if (searchParams.get('adapt') !== '1') return
    if (!apiKey) return // Wait for settings to load
    try {
      const raw = sessionStorage.getItem('felix-adapt')
      if (!raw) return
      adaptTriggered.current = true
      sessionStorage.removeItem('felix-adapt')
      const data = JSON.parse(raw)
      if (data.prompt) {
        setPrompt(data.prompt)
        // Delay to let React re-render with new prompt, then auto-generate
        setTimeout(() => handleGenerateRef.current(), 600)
      }
    } catch {}
  }, [searchParams, apiKey])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [showPresentations, setShowPresentations] = useState(false)
  const [presentations, setPresentations] = useState<any[]>([])
  const [presentationsLoading, setPresentationsLoading] = useState(false)
  const [presentationsStatus, setPresentationsStatus] = useState<PresentationListStatus>('idle')
  const [presentationsError, setPresentationsError] = useState('')
  const presentationsFetched = useRef(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [sortBy, setSortBy] = useState<PresentationSortKey>('created')
  const [sortOpen, setSortOpen] = useState(false)

  // Tab state
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
      setPresentationsStatus('ready')
      setPresentationsError('')
      return
    }
    // For initial mine tab, use the old flag to prevent double fetch
    if (tab === 'mine' && presentationsFetched.current && !force) return
    if (tab === 'mine') presentationsFetched.current = true

    setPresentationsLoading(true)
    setPresentationsStatus('loading')
    setPresentationsError('')
    try {
      const res = await fetch(`/api/studio/presentations?tab=${tab}`)
      if (res.status === 401) {
        const failure = presentationFetchFailure(res.status)
        setPresentations([])
        setPresentationsStatus(failure.status)
        setPresentationsError(failure.message)
        tabCache.current[tab] = null
        return
      }
      if (!res.ok) {
        const message = await readResponseError(res, 'Could not load presentations')
        const failure = presentationFetchFailure(res.status, message)
        throw new Error(failure.message)
      }

      const data = await res.json()
      const items = data.presentations ?? []
      tabCache.current[tab] = items
      setPresentations(items)
      setPresentationsStatus('ready')
    } catch (err) {
      setPresentations([])
      setPresentationsStatus('error')
      setPresentationsError(getErrorMessage(err, 'Could not load presentations. Please try again.'))
    } finally {
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
    const allDecks: MergeSourceDeck[] = [
      ...(tabCache.current.mine ?? []),
      ...(tabCache.current['shared-by-me'] ?? []),
      ...(tabCache.current['shared-with-me'] ?? []),
    ]
    const selectedDecks = getSelectedDecksForMerge(selectedIds, allDecks)

    if (selectedDecks.length < 2) return

    const predictedMergeCount = predictMergeSlideCount(selectedDecks, mergeMode)

    // Close modal, show canvas
    setShowPresentations(false)
    setMultiSelect(false)
    setSelectedIds(new Set())
    setError('')
    setHint(null)
    setGenerating(true)
    setSlides([])
    setGeneratedDocument(null)
    setGeneratedOutline(null)
    setDone(false)
    setShowCanvas(true)
    setSavedId(null)
    resetSaveState()
    setPredictedCount(predictedMergeCount)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildMergeGenerationPayload({
          selectedIds,
          selectedDecks,
          mergePrompt,
          mergeMode,
          settings: { provider, apiKey, model },
        })),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Merge failed' }))
        setError(data.error || `Merge failed (${res.status})`)
        setGenerating(false)
        setShowCanvas(false)
        return
      }

      let localSavedId: string | null = null
      let savePromise: Promise<void> | null = null
      let pendingDocument: any = null
      let pendingOutline: any = null

      const persistMergedSlides = async (slidesToSave: SlideData[], doc: any = null) => {
        const documentFromStream = pendingDocument
        const outlineFromStream = pendingOutline
        const title = createDeckTitle(slidesToSave, mergePrompt, 'Merged Presentation')

        const presentationId = await savePresentationToLibrary({
          title,
          promptText: mergePrompt.trim(),
          slides: slidesToSave,
          document: doc,
        })

        if (!presentationId) {
          saveRetryRef.current = async () => { await persistMergedSlides(slidesToSave, doc) }
          setSaveRetryAvailable(true)
          return
        }

        localSavedId = presentationId
        if (documentFromStream && !doc) {
          await patchSavedPresentation(presentationId, { document: documentFromStream }, 'document')
        }
        pendingDocument = null

        if (outlineFromStream) {
          await patchSavedPresentation(presentationId, { outline: outlineFromStream }, 'outline')
        }
        pendingOutline = null

        if (!doc && !documentFromStream) {
          generateDocumentInBackground(presentationId, slidesToSave)
        }
        runPostSaveJobs(presentationId, true)
      }

      const patchDocument = async (doc: any) => {
        setGeneratedDocument(doc)
        if (savePromise) await savePromise
        if (localSavedId) {
          await patchSavedPresentation(localSavedId, { document: doc }, 'document')
        } else {
          pendingDocument = doc
        }
      }

      const patchOutline = async (outline: any) => {
        setGeneratedOutline(outline)
        if (savePromise) await savePromise
        if (localSavedId) {
          await patchSavedPresentation(localSavedId, { outline }, 'outline')
        } else {
          pendingOutline = outline
        }
      }

      const result = await consumeGenerationStream(res, {
        onHint: setHint,
        onDeckQuality: (quality: any) => {
          if (typeof quality?.score !== 'number') return
          if (!quality.passed) setHint(`Deck intelligence is checking this deck: ${quality.score}/100.`)
        },
        onSlides: (nextSlides) => setSlides(nextSlides as SlideData[]),
        onDocument: patchDocument,
        onOutline: patchOutline,
        onReady: ({ slides: readySlides, document }) => {
          setSlides(readySlides as SlideData[])
          setGenerating(false)
          setDone(true)
          savePromise = persistMergedSlides(readySlides as SlideData[], document ?? null)
        },
        onError: (message) => {
          setError(message)
          setGenerating(false)
          setShowCanvas(false)
        },
        onEmpty: () => {
          setError('Merge did not produce slides. Please try again.')
          setGenerating(false)
          setShowCanvas(false)
        },
      })

      if (!result.ok) return
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setError(err?.message ?? 'Merge failed')
      }
      setGenerating(false)
      setShowCanvas(false)
    }
  }, [selectedIds, mergeMode, mergePrompt, provider, apiKey, model, generateDocumentInBackground, patchSavedPresentation, resetSaveState, runPostSaveJobs, savePresentationToLibrary])

  // Filtered results
  const { filteredDecks, matchingSlides } = useMemo(
    () => filterPresentationLibrary(presentations, searchQuery, sortBy),
    [presentations, searchQuery, sortBy],
  )

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
      // Auto-populate prompt for Slides redesign
      if (data.type === 'slides' && !prompt.trim()) {
        setPrompt(`Redesign "${data.title}" using Félix best practices. Preserve the original content and flow but apply the Félix design system — branded colors, typography, illustrations, and slide layouts. Improve the visual hierarchy and make it presentation-ready.`)
      }
    } catch (err: any) {
      setGoogleError(err?.message || 'Failed to import')
    } finally {
      setGoogleLoading(false)
    }
  }, [googleUrl, googleWorkspaceConnected, prompt])

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
    resetSaveState()
  }, [resetSaveState])

  const presentationsReady = presentationsStatus === 'ready'
  const presentationsUnavailable = presentationsStatus === 'error' || presentationsStatus === 'unauthorized'
  const saveStatusPill = (
    <SaveStatusPill
      done={done}
      status={saveStatus}
      error={saveError}
      retryAvailable={saveRetryAvailable}
      onRetry={retrySave}
    />
  )

  if (showCanvas) {
    if (generateMode === 'outline') {
      return (
        <>
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
          {saveStatusPill}
        </>
      )
    }

    if (generateMode === 'document') {
      // When document is done and saved, navigate straight to the standard view with document tab selected
      if (done && generatedDocument && savedId) {
        router.push(`/create/${savedId}?view=document`)
        return null
      }
      return (
        <>
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
          {saveStatusPill}
        </>
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
        {saveStatusPill}
        {/* Coach score badge — shown after generation completes */}
        {done && coachResults && (
          <div className="fixed top-20 right-6 z-[200] animate-in fade-in slide-in-from-right-4 duration-500 max-w-sm">
            <div className={cn(
              'px-4 py-2.5 rounded-xl backdrop-blur-md border shadow-lg',
              coachResults.score >= 80 ? 'bg-green-950/80 border-green-500/20 text-green-400' :
              coachResults.score >= 50 ? 'bg-amber-950/80 border-amber-500/20 text-amber-400' :
              'bg-red-950/80 border-red-500/20 text-red-400',
            )}>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-lg font-black tabular-nums">{coachResults.score}</p>
                  <p className="text-[8px] uppercase tracking-widest opacity-60">Score</p>
                </div>
                <div className="text-[11px] opacity-80">
                  {coachResults.suggestions.filter(s => s.severity === 'error').length > 0 && (
                    <p className="font-semibold">{coachResults.suggestions.filter(s => s.severity === 'error').length} slides need more content</p>
                  )}
                  {coachResults.suggestions.filter(s => s.severity === 'warning').length > 0 && (
                    <p>{coachResults.suggestions.filter(s => s.severity === 'warning').length} warnings</p>
                  )}
                  {coachResults.score >= 80 && <p>Looking good!</p>}
                </div>
              </div>
              {coachResults.suggestions.filter(s => s.severity === 'error' && s.rule === 'thin-content').length > 0 && (
                <ul className="mt-2 pt-2 border-t border-white/10 text-[10px] opacity-70 space-y-0.5">
                  {coachResults.suggestions
                    .filter(s => s.severity === 'error' && s.rule === 'thin-content')
                    .slice(0, 5)
                    .map((s, idx) => (
                      <li key={idx}>Slide {s.slideIndex + 1}: {s.message}</li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {/* Quality warning dialog — gates save when coach finds errors */}
        {showQualityWarning && coachResults && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-white mb-2">Quality Issues Detected</h3>
              <p className="text-sm text-white/60 mb-4">
                {coachResults.suggestions.filter(s => s.severity === 'error').length} quality {coachResults.suggestions.filter(s => s.severity === 'error').length === 1 ? 'issue' : 'issues'} found.
                Some slides may not have enough content for an effective presentation.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowQualityWarning(false)
                    pendingSaveRef.current = null
                  }}
                  className="px-4 py-2 text-sm rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors"
                >
                  Go back
                </button>
                <button
                  onClick={() => {
                    setShowQualityWarning(false)
                    pendingSaveRef.current?.()
                    pendingSaveRef.current = null
                  }}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
                >
                  Save anyway
                </button>
              </div>
            </div>
          </div>
        )}
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
      {/* Settings icons — fixed top-right, next to avatar */}
      <div className="fixed top-3.5 right-16 z-20 flex items-center gap-1">
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowSettings(true); dismissSettingsTip() }}
            className="p-2 rounded-lg hover:bg-stone/60 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Model settings"
            title="Model settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          {showSettingsTip && (
            <div className="absolute top-full mt-2 right-0 w-64 bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-3.5 animate-in fade-in slide-in-from-top-2 duration-300 z-30">
              <div className="absolute -top-1.5 right-4 w-3 h-3 bg-slate-950 border-l border-t border-white/10 rotate-45" />
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
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowBrandKit(true)}
          className="p-2 rounded-lg hover:bg-stone/60 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Brand Kit"
          title="Brand Kit"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

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
                {presentationsReady && presentations.length > 0 && (
                  <p className="text-sm text-white/40 mt-1">{presentations.length} presentation{presentations.length !== 1 ? 's' : ''}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Search bar */}
                {presentationsReady && presentations.length > 0 && (
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
                {presentationsReady && presentations.length > 1 && (
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
                          ] as [PresentationSortKey, string][]).map(([key, label]) => (
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
                  disabled={!presentationsReady || presentations.length === 0}
                  className={cn(
                    'p-2.5 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40',
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
            {presentationsUnavailable && (
              <div className="mx-auto max-w-md py-20 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {presentationsStatus === 'unauthorized' ? 'Sign in again' : 'Could not load presentations'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">
                  {presentationsError}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (presentationsStatus === 'unauthorized') router.refresh()
                    else fetchPresentations(activeTab, true)
                  }}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {presentationsStatus === 'unauthorized' ? 'Refresh session' : 'Retry'}
                </button>
              </div>
            )}

            {presentationsReady && presentations.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-white/40">
                  {activeTab === 'mine' && 'No presentations yet. Create your first one!'}
                  {activeTab === 'shared-by-me' && 'Share a presentation to see it here.'}
                  {activeTab === 'shared-with-me' && 'No one has shared a presentation with you yet.'}
                </p>
              </div>
            )}

            {/* No search results */}
            {presentationsReady && presentations.length > 0 && searchQuery && filteredDecks.length === 0 && matchingSlides.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-white/40">
                  No results for &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}

            {/* Deck grid */}
            {presentationsReady && filteredDecks.length > 0 && (
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
            {presentationsReady && searchQuery && matchingSlides.length > 0 && (
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
            {presentationsReady && multiSelect && selectedIds.size >= 2 && <div className="h-24" />}
          </div>

          {/* Merge action bar — sticky to bottom of scrollable modal */}
          {presentationsReady && multiSelect && selectedIds.size >= 2 && (
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

      <div className="w-full max-w-5xl space-y-5">
        {/* Greeting */}
        <div className="text-center space-y-2 mb-4">
          <h1 className="font-display font-black text-3xl text-foreground">
            What would you like to present?
          </h1>
        </div>

        {/* Unified input box */}
        <div className="relative">
          {starterPromptLabel && (
            <div
              className={cn(
                'absolute left-0 top-0 z-20 transition-opacity duration-200 ease-out',
                starterPromptResetting ? 'pointer-events-none opacity-0' : 'opacity-100',
              )}
              style={{ transform: 'translate3d(0, calc(-100% - 10px), 0)' }}
            >
              <button
                type="button"
                onClick={resetStarterPrompt}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-white/90 px-3 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur transition-[border-color,background-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-evergreen/30 hover:bg-white hover:text-foreground hover:shadow-md focus-visible:ring-2 focus-visible:ring-evergreen/25"
                aria-label={`Return to the default input and clear ${starterPromptLabel} starter prompt`}
                title="Back"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            </div>
          )}
          <div
            ref={composerRef}
            className={cn(
              'relative bg-white rounded-2xl border shadow-sm transition-[border-color,box-shadow,opacity,transform] duration-300 ease-out',
              dragOver
                ? 'border-concrete ring-2 ring-concrete/30'
                : 'border-border focus-within:border-concrete',
              starterMorphing && 'starter-composer-fade-out',
              starterComposerArriving && !starterMorphing && 'starter-composer-arrive',
            )}
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
            className={cn(
              'w-full min-h-[116px] md:min-h-[132px] px-5 pt-4 pb-2 bg-transparent text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none text-base leading-relaxed',
              starterPromptRevealing && 'starter-prompt-reveal',
              starterPromptResetting && 'starter-prompt-clear',
            )}
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
          <div className="flex items-center justify-between px-3 pb-3 pt-1 relative">
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

              {/* Template picker */}
              <TemplatePicker selected={selectedTemplate} onSelect={setSelectedTemplate} />

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
        </div>

        {!prompt.trim() && files.length === 0 && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <CreateStarterActions
              onPromptSelect={selectStarterPrompt}
              onImport={() => fileInputRef.current?.click()}
              onMerge={openPresentations}
              onActionStart={handleStarterActionStart}
              onActionEnd={handleStarterActionEnd}
              getMorphTargetRect={getStarterMorphTargetRect}
            />
          </div>
        )}

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

      {showBrandKit && (
        <BrandKitEditor onClose={() => setShowBrandKit(false)} />
      )}
    </div>
  )
}
