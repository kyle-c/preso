/* ── Slide data schema returned by Claude ── */

export type SlideType =
  | 'title'
  | 'section'
  | 'content'
  | 'bullets'
  | 'two-column'
  | 'cards'
  | 'quote'
  | 'image'
  | 'checklist'
  | 'closing'

export type SlideBg = 'dark' | 'light' | 'brand'

export interface BulletItem {
  text: string
  icon?: string // emoji or 'check' | 'x' | 'arrow'
}

export interface CardData {
  title: string
  titleColor: string
  body: string
}

export interface ColumnData {
  heading?: string
  body?: string
  bullets?: BulletItem[]
}

export interface MappedComment {
  author: string
  text: string
  replies: { author: string; text: string }[]
  x: number
  y: number
}

export interface SlideData {
  type: SlideType
  bg: SlideBg
  badge?: string
  title: string
  subtitle?: string
  body?: string
  bullets?: BulletItem[]
  cards?: CardData[]
  columns?: [ColumnData, ColumnData]
  imageUrl?: string
  quote?: { text: string; attribution?: string }
  comments?: MappedComment[]
}

/* ── Notion extraction types ── */

export interface NotionBlock {
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'bullet' | 'numbered'
       | 'callout' | 'quote' | 'code' | 'image' | 'table' | 'divider' | 'toggle'
       | 'todo'
  text: string
  children?: NotionBlock[]
  imageUrl?: string
  language?: string
  checked?: boolean
}

export interface NotionComment {
  blockText: string
  author: string
  text: string
  replies: { author: string; text: string }[]
}

export interface ExtractedPage {
  title: string
  icon?: string
  blocks: NotionBlock[]
  comments: NotionComment[]
}

/* ── Chrome message types ── */

export type MessageType =
  | { type: 'GENERATE_PRESO'; payload: ExtractedPage; forceRefresh?: boolean }
  | { type: 'PRE_PROCESS'; payload: ExtractedPage }
  | { type: 'PRE_PROCESS_DONE'; payload: { hash: string; hasOutline: boolean } }
  | { type: 'PRESO_RESULT'; payload: { slides: SlideData[] } }
  | { type: 'PRESO_ERROR'; payload: { error: string } }
  | { type: 'PRESO_PROGRESS'; payload: { status: string } }
  | { type: 'TRIGGER_EXTRACT'; forceRefresh?: boolean }

/* ── Port-based streaming messages ── */

export type StreamMessage =
  | { type: 'STREAM_START'; estimatedTotal: number }
  | { type: 'STREAM_SLIDE'; slide: SlideData; index: number }
  | { type: 'STREAM_DONE'; slides: SlideData[] }
  | { type: 'STREAM_ERROR'; error: string }

/* ── Session cache for background extraction ── */

export interface ExtractionCache {
  page: ExtractedPage
  hash: string
  timestamp: number
  hasToggles: boolean
  hasLazyImages: boolean
}
