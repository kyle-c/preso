'use client'

import { SlideRenderer, type SlideData } from '@/components/studio/slide-renderer'
import type { PresentationDocument, PresentationOutline, SharePermission } from '@/lib/studio-db'
import type { ViewMode } from '@/components/studio/deck-views'

interface SharedPresentationViewerProps {
  slides: SlideData[]
  title: string
  deckId: string
  document?: PresentationDocument | null
  outline?: PresentationOutline | null
  initialViewMode?: ViewMode
  shareToken?: string
  translations?: Record<string, Record<string, string>> | null
  permission?: SharePermission
}

export function SharedPresentationViewer({
  slides,
  title,
  deckId,
  document: doc,
  outline,
  initialViewMode,
  shareToken,
  translations,
  permission = 'viewer',
}: SharedPresentationViewerProps) {
  return (
    <SlideRenderer
      slides={slides}
      title={title}
      deckId={deckId}
      isFullScreen
      document={doc}
      outline={outline}
      initialViewMode={initialViewMode}
      shareToken={shareToken}
      translations={translations}
      sharePermission={permission}
    />
  )
}
