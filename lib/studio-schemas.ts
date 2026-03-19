import { z } from 'zod'

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const settingsSchema = z.object({
  provider: z.enum(['anthropic', 'google', 'openrouter']).optional(),
  anthropicKey: z.string().max(500).optional(),
  googleKey: z.string().max(500).optional(),
  openrouterKey: z.string().max(500).optional(),
  anthropicModel: z.string().max(100).optional(),
  googleModel: z.string().max(100).optional(),
  openrouterModel: z.string().max(100).optional(),
  notionKey: z.string().max(500).optional(),
  amplitudeApiKey: z.string().max(500).optional(),
  amplitudeSecretKey: z.string().max(500).optional(),
  googleWorkspaceKey: z.string().max(500).optional(),
  clickupKey: z.string().max(500).optional(),
}).strict()

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const authSchema = z.object({
  action: z.enum(['login', 'signup']),
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
  name: z.string().max(200).optional(),
})

export const verifySchema = z.object({
  token: z.string().min(1).max(200),
})

// ---------------------------------------------------------------------------
// Presentations
// ---------------------------------------------------------------------------

export const createPresentationSchema = z.object({
  title: z.string().min(1).max(500),
  prompt: z.string().max(50_000),
  slides: z.array(z.any()).max(500),
  document: z.any().nullable().optional(),
  provider: z.string().max(100),
  model: z.string().max(100),
})

export const updatePresentationSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  slides: z.array(z.any()).max(500).optional(),
  document: z.any().nullable().optional(),
  outline: z.any().nullable().optional(),
  isPublic: z.boolean().optional(),
  archived: z.boolean().optional(),
})

// ---------------------------------------------------------------------------
// Share
// ---------------------------------------------------------------------------

export const shareSchema = z.object({
  access: z.enum(['public', 'org', 'specific']).optional(),
  allowedEmails: z.array(z.string().email().max(254)).max(100).optional(),
  permission: z.enum(['viewer', 'commenter', 'editor']).optional(),
  emailPermissions: z.record(
    z.string().email().max(254),
    z.enum(['viewer', 'commenter', 'editor']),
  ).optional(),
})

// ---------------------------------------------------------------------------
// Ratings
// ---------------------------------------------------------------------------

export const ratingSchema = z.object({
  source: z.string().regex(/^[a-zA-Z0-9_:/-]+$/).max(200),
  slideIndex: z.number().int().min(0).max(10_000),
  remove: z.boolean().optional(),
  slideType: z.string().max(100).optional(),
  bg: z.string().max(50).optional(),
  rating: z.union([z.literal(1), z.literal(-1)]).optional(),
  slideData: z.record(z.unknown()).optional(),
  note: z.string().max(2000).optional(),
})

export const ratingQuerySchema = z.object({
  source: z.string().regex(/^[a-zA-Z0-9_:/-]+$/).max(200),
})

// ---------------------------------------------------------------------------
// Integration routes
// ---------------------------------------------------------------------------

export const notionImportSchema = z.object({
  url: z.string().min(1).max(2000),
})

export const amplitudeImportSchema = z.object({
  type: z.enum(['chart', 'users', 'events', 'event-list', 'revenue']),
  url: z.string().max(2000).optional(),
  eventName: z.string().max(500).optional(),
  metric: z.string().max(200).optional(),
  start: z.string().regex(/^\d{8}$/).optional(),
  end: z.string().regex(/^\d{8}$/).optional(),
})

export const googleWorkspaceImportSchema = z.object({
  url: z.string().min(1).max(2000),
  type: z.enum(['sheets', 'docs', 'slides']).optional(),
})

export const clickupImportSchema = z.object({
  url: z.string().min(1).max(2000),
  type: z.enum(['task', 'list']).optional(),
})

// ---------------------------------------------------------------------------
// Translate
// ---------------------------------------------------------------------------

export const translateSchema = z.object({
  presentationId: z.string().min(1).max(200),
})

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export const createCommentSchema = z.object({
  deckId: z.string().min(1).max(200),
  slideIndex: z.number().int().min(0).max(500),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  name: z.string().min(1).max(100),
  email: z.string().email().max(254).optional(),
  text: z.string().min(1).max(5000),
})

export const updateCommentSchema = z.object({
  deckId: z.string().min(1).max(200),
  text: z.string().min(1).max(5000).optional(),
  flaggedForRebuild: z.boolean().optional(),
  resolved: z.boolean().optional(),
  resolvedBy: z.string().max(100).optional(),
  reply: z.object({
    name: z.string().min(1).max(100),
    text: z.string().min(1).max(5000),
  }).optional(),
  deleteReplyId: z.string().max(200).optional(),
})

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export const analyticsSchema = z.object({
  type: z.enum(['edit', 'edits', 'beacon', 'session_end', 'generation_outcome']),
  event: z.record(z.unknown()).optional(),
  events: z.array(z.record(z.unknown())).max(1000).optional(),
  beacon: z.record(z.unknown()).optional(),
  session: z.record(z.unknown()).optional(),
  presId: z.string().max(200).optional(),
  action: z.string().max(200).optional(),
  shareToken: z.string().max(200).optional(),
})
