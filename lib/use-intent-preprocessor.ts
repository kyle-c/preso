'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { detectIntent, preprocessIntent, type PreprocessedIntent, type DocumentType } from './prompt-strengthener'
import type { UploadedFile } from '@/components/studio/file-uploader'

const INTENT_LABELS: Record<DocumentType, string> = {
  prd: 'Product Requirements',
  proposal: 'Business Proposal',
  launch: 'Product Launch',
  review: 'Business Review',
  research: 'Research & Insights',
  strategy: 'Strategy',
  onboarding: 'Onboarding',
  general: 'Presentation',
}

const INTENT_COLORS: Record<DocumentType, string> = {
  prd: 'bg-blueberry/15 text-blueberry border-blueberry/25',
  proposal: 'bg-mango/15 text-mocha border-mango/25',
  launch: 'bg-cactus/15 text-evergreen border-cactus/25',
  review: 'bg-papaya/15 text-papaya border-papaya/25',
  research: 'bg-sage/15 text-evergreen border-sage/25',
  strategy: 'bg-turquoise/15 text-evergreen border-turquoise/25',
  onboarding: 'bg-lime/15 text-mocha border-lime/25',
  general: '',
}

export interface IntentPreprocessorState {
  /** Detected intent type */
  intent: DocumentType
  /** Human-readable label */
  label: string
  /** Tailwind classes for the intent badge */
  badgeClass: string
  /** Full preprocessed result (includes enriched context) */
  preprocessed: PreprocessedIntent | null
  /** Whether preprocessing is currently running */
  processing: boolean
}

/**
 * Hook that watches prompt text and uploaded files, continuously detects
 * intent and pre-processes enriched context before generation.
 *
 * Intent detection is instant (regex-based).
 * Full preprocessing (topic extraction, file analysis) is debounced by 500ms.
 */
export function useIntentPreprocessor(
  prompt: string,
  files: UploadedFile[],
): IntentPreprocessorState {
  // Instant intent detection (no debounce — regex is fast)
  const intent = useMemo(() => {
    const trimmed = prompt.trim()
    return trimmed.length >= 3 ? detectIntent(trimmed) : 'general' as DocumentType
  }, [prompt])

  const label = INTENT_LABELS[intent]
  const badgeClass = INTENT_COLORS[intent]

  // Debounced full preprocessing
  const [preprocessed, setPreprocessed] = useState<PreprocessedIntent | null>(null)
  const [processing, setProcessing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const trimmed = prompt.trim()
    if (trimmed.length < 10) {
      setPreprocessed(null)
      return
    }

    setProcessing(true)

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const fileData = files
        .filter((f) => f.type === 'data')
        .map((f) => ({ name: f.name, type: f.type, data: f.data.slice(0, 2000) }))

      const result = preprocessIntent(trimmed, fileData)
      setPreprocessed(result)
      setProcessing(false)
    }, 500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [prompt, files])

  return { intent, label, badgeClass, preprocessed, processing }
}
