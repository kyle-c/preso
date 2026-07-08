import type { FileAttachment } from '../provider-adapter'

export interface GenerateBody {
  prompt: string
  files?: FileAttachment[]
  provider: 'anthropic' | 'google' | 'openrouter'
  apiKey: string
  model: string
  parallel?: boolean
  /** When true, skip prompt strengthening — used for slide/deck edits */
  edit?: boolean
  /** Injected server-side from session — used for style profile + exemplars */
  userId?: string
  /** Enriched system prompt with user profile + exemplars (built in POST handler) */
  enrichedSystemPrompt?: string
  /** When true, skip slide generation and only produce a document object */
  documentOnly?: boolean
  /** When true, reverse-engineer slides into a rich document then distill an outline */
  reverseEngineer?: boolean
  /** Existing slides to use for document-only or reverse-engineer generation */
  slides?: any[]
  /** Merge mode: combine multiple presentations into one */
  merge?: {
    mode: 'narrative' | 'deduplicate'
    sourceIds: string[]
    sourceMaterial: string
  }
  /** AI edit target: edit document or outline in-place */
  editTarget?: 'document' | 'outline'
  /** Current document JSON for document edits */
  document?: any
  /** Current outline JSON for outline edits */
  outline?: any
  /** Selection context for targeted document edits */
  selectionContext?: { sectionIndex: number; selectedText: string }
  /** Template structure to guide slide generation */
  templateStructure?: {
    title: string
    slideCount: number
    sections: { type: string; title?: string; tone?: string }[]
  }
}
