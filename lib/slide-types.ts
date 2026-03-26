/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE DATA TYPES                       */
/*                                                              */
/*  Shared type definitions for slide data used across the     */
/*  generation pipeline, renderer, coach, and layout engine.   */
/* ═══════════════════════════════════════════════════════════ */

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
  | 'chart'

export type SlideBg = 'dark' | 'light' | 'brand'

export interface SlideCard {
  title: string
  titleColor?: string
  body?: string
  icon?: string
}

export interface SlideBullet {
  text: string
  icon?: string
}

export interface SlideColumn {
  heading?: string
  title?: string
  body?: string
  bullets?: SlideBullet[]
}

export interface SlideQuoteData {
  text: string
  author?: string
  role?: string
}

export interface SlideChartData {
  type: string
  data: Record<string, unknown>[]
  xKey?: string
  yKey?: string
  keys?: string[]
  colors?: string[]
  [key: string]: unknown
}

export interface SlideStyle {
  titleSize?: string
  bodySize?: string
  cardSize?: string
  columnRatio?: string
}

export interface SlideData {
  type: SlideType | string // allow string for forward-compat with new types
  bg: SlideBg | string
  title: string
  subtitle?: string
  body?: string
  badge?: string
  bullets?: SlideBullet[]
  cards?: SlideCard[]
  columns?: SlideColumn[]
  quote?: SlideQuoteData
  imageUrl?: string
  chart?: SlideChartData
  notes?: string
  style?: SlideStyle
  [key: string]: unknown // allow additional LLM-generated fields
}
