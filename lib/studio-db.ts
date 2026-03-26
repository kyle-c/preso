import { Redis } from '@upstash/redis'
import crypto from 'crypto'
import { encryptField, decryptField, SENSITIVE_FIELDS } from './studio-encrypt'
import type { SlideData } from './slide-types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string
  email: string
  name: string
  createdAt: number
}

export interface SectionAttachment {
  id: string
  name: string
  type: 'image' | 'data'
  data: string // base64 for images, CSV/text for data
  preview?: string
}

export interface DocumentSection {
  title: string
  content: string
  slideIndex?: number
  attachments?: SectionAttachment[]
}

export interface PresentationDocument {
  title: string
  type: string
  summary: string
  sections: DocumentSection[]
}

export interface OutlineSection {
  title: string
  summary: string
  slideIndices: number[]
  subsections?: { title: string; detail: string }[]
}

export interface PresentationOutline {
  title: string
  thesis: string
  sections: OutlineSection[]
}

export interface Presentation {
  id: string
  userId: string
  title: string
  prompt: string
  slides: SlideData[]
  document: PresentationDocument | null
  outline: PresentationOutline | null
  translations: Record<string, Record<string, string>> | null
  shareToken: string | null
  isPublic: boolean
  archived: boolean
  provider: string
  model: string
  createdAt: number
  updatedAt: number
}

// ---------------------------------------------------------------------------
// Redis client
// ---------------------------------------------------------------------------

export const redis = Redis.fromEnv()

// Key helpers
const userKey = (id: string) => `studio:user:${id}`
const emailKey = (email: string) => `studio:user:email:${email.toLowerCase()}`
export const presKey = (id: string) => `studio:pres:${id}`
export const userPresKey = (userId: string) => `studio:user:pres:${userId}`
export const shareKey = (token: string) => `studio:share:${token}`
const sharedWithKey = (email: string) => `studio:shared-with:${email.toLowerCase()}`
const sharedOrgKey = () => `studio:shared-org`

// ---------------------------------------------------------------------------
// Stored types (flat for Redis)
// ---------------------------------------------------------------------------

interface StoredUser {
  id: string
  email: string
  name: string
  passwordHash: string
  verified: boolean
  createdAt: number
}

// Magic link tokens
const magicLinkKey = (token: string) => `studio:magic:${token}`

interface StoredPresentation {
  id: string
  userId: string
  title: string
  prompt: string
  slides: string // JSON string
  document: string // JSON string
  outline: string // JSON string
  translations: string // JSON string
  shareToken: string
  isPublic: number
  archived: number
  provider: string
  model: string
  createdAt: number
  updatedAt: number
}

function toPresentation(stored: StoredPresentation): Presentation {
  let doc: PresentationDocument | null = null
  if (stored.document) {
    try {
      doc = typeof stored.document === 'string' ? JSON.parse(stored.document) : stored.document
    } catch { /* no doc */ }
  }

  let outline: PresentationOutline | null = null
  if (stored.outline) {
    try {
      outline = typeof stored.outline === 'string' ? JSON.parse(stored.outline) : stored.outline
    } catch { /* no outline */ }
  }

  let translations: Record<string, Record<string, string>> | null = null
  if (stored.translations) {
    try {
      translations = typeof stored.translations === 'string' ? JSON.parse(stored.translations) : stored.translations
    } catch { /* no translations */ }
  }

  return {
    id: stored.id,
    userId: stored.userId,
    title: stored.title,
    prompt: stored.prompt,
    slides: typeof stored.slides === 'string' ? JSON.parse(stored.slides) : stored.slides,
    document: doc,
    outline,
    translations,
    shareToken: stored.shareToken || null,
    isPublic: stored.isPublic === 1,
    archived: stored.archived === 1,
    provider: stored.provider,
    model: stored.model,
    createdAt: stored.createdAt,
    updatedAt: stored.updatedAt,
  }
}

// ---------------------------------------------------------------------------
// Schema initialisation (no-op for Redis)
// ---------------------------------------------------------------------------

export function initDb(): void {
  // No-op — Redis is schemaless
}

// ---------------------------------------------------------------------------
// User operations
// ---------------------------------------------------------------------------

export async function createUser(
  email: string,
  name: string,
  passwordHash: string,
  verified = false,
): Promise<User> {
  const id = crypto.randomUUID()
  const now = Math.floor(Date.now() / 1000)

  const stored: StoredUser = { id, email, name, passwordHash, verified, createdAt: now }

  await Promise.all([
    redis.set(userKey(id), JSON.stringify(stored)),
    redis.set(emailKey(email), id),
  ])

  return { id, email, name, createdAt: now }
}

export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string; verified: boolean }) | null> {
  const id = await redis.get<string>(emailKey(email))
  if (!id) return null

  const raw = await redis.get<string | StoredUser>(userKey(id))
  if (!raw) return null

  const stored: StoredUser = typeof raw === 'string' ? JSON.parse(raw) : raw
  return {
    id: stored.id,
    email: stored.email,
    name: stored.name,
    createdAt: stored.createdAt,
    passwordHash: stored.passwordHash,
    verified: stored.verified ?? true, // legacy users without field are verified
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const raw = await redis.get<string | StoredUser>(userKey(id))
  if (!raw) return null

  const stored: StoredUser = typeof raw === 'string' ? JSON.parse(raw) : raw
  return {
    id: stored.id,
    email: stored.email,
    name: stored.name,
    createdAt: stored.createdAt,
  }
}

// ---------------------------------------------------------------------------
// Magic link operations
// ---------------------------------------------------------------------------

export async function createMagicLinkToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  // Expires in 15 minutes
  await redis.set(magicLinkKey(token), userId, { ex: 900 })
  return token
}

export async function consumeMagicLinkToken(token: string): Promise<string | null> {
  // Atomic get-and-delete to prevent token reuse
  const key = magicLinkKey(token)
  const userId = await redis.get<string>(key)
  if (!userId) return null
  // Delete first, then return — if two requests race, only one gets the value
  const deleted = await redis.del(key)
  if (deleted === 0) return null // Another request already consumed it
  return userId
}

export async function verifyUser(userId: string): Promise<boolean> {
  const raw = await redis.get<string | StoredUser>(userKey(userId))
  if (!raw) return false

  const stored: StoredUser = typeof raw === 'string' ? JSON.parse(raw) : raw
  stored.verified = true
  await redis.set(userKey(userId), JSON.stringify(stored))
  return true
}

// ---------------------------------------------------------------------------
// Presentation operations
// ---------------------------------------------------------------------------

export async function createPresentation(
  userId: string,
  title: string,
  prompt: string,
  slides: SlideData[],
  provider: string,
  model: string,
  document?: PresentationDocument | null,
): Promise<Presentation> {
  const id = crypto.randomUUID()
  const now = Math.floor(Date.now() / 1000)

  const stored: StoredPresentation = {
    id,
    userId,
    title,
    prompt,
    slides: JSON.stringify(slides),
    document: document ? JSON.stringify(document) : '',
    outline: '',
    translations: '',
    shareToken: '',
    isPublic: 0,
    archived: 0,
    provider,
    model,
    createdAt: now,
    updatedAt: now,
  }

  await Promise.all([
    redis.set(presKey(id), JSON.stringify(stored)),
    redis.zadd(userPresKey(userId), { score: now, member: id }),
  ])

  return {
    id,
    userId,
    title,
    prompt,
    slides,
    document: document ?? null,
    translations: null,
    shareToken: null,
    isPublic: false,
    archived: false,
    provider,
    model,
    createdAt: now,
    updatedAt: now,
  }
}

export async function getPresentation(id: string): Promise<Presentation | null> {
  const raw = await redis.get<string | StoredPresentation>(presKey(id))
  if (!raw) return null

  const stored: StoredPresentation = typeof raw === 'string' ? JSON.parse(raw) : raw
  return toPresentation(stored)
}

export async function getPresentationByShareToken(token: string): Promise<Presentation | null> {
  const id = await redis.get<string>(shareKey(token))
  if (!id) return null
  return getPresentation(id)
}

export async function getUserPresentations(userId: string): Promise<Presentation[]> {
  // Get IDs sorted by createdAt descending
  const ids = await redis.zrange<string[]>(userPresKey(userId), 0, -1, { rev: true })
  if (!ids || ids.length === 0) return []

  const results = await Promise.all(ids.map((id) => getPresentation(id)))
  return results.filter((p): p is Presentation => p !== null)
}

export async function updatePresentation(
  id: string,
  data: Partial<Omit<Presentation, 'id' | 'userId' | 'createdAt'>>,
): Promise<Presentation | null> {
  const existing = await getPresentation(id)
  if (!existing) return null

  const now = Math.floor(Date.now() / 1000)

  const docToStore = data.document !== undefined
    ? (data.document ? JSON.stringify(data.document) : '')
    : (existing.document ? JSON.stringify(existing.document) : '')

  const outlineToStore = data.outline !== undefined
    ? (data.outline ? JSON.stringify(data.outline) : '')
    : (existing.outline ? JSON.stringify(existing.outline) : '')

  const translationsToStore = data.translations !== undefined
    ? (data.translations ? JSON.stringify(data.translations) : '')
    : (existing.translations ? JSON.stringify(existing.translations) : '')

  const updated: StoredPresentation = {
    id: existing.id,
    userId: existing.userId,
    title: data.title ?? existing.title,
    prompt: data.prompt ?? existing.prompt,
    slides: JSON.stringify(data.slides ?? existing.slides),
    document: docToStore,
    outline: outlineToStore,
    translations: translationsToStore,
    shareToken: data.shareToken !== undefined ? (data.shareToken ?? '') : (existing.shareToken ?? ''),
    isPublic: data.isPublic !== undefined ? (data.isPublic ? 1 : 0) : (existing.isPublic ? 1 : 0),
    archived: data.archived !== undefined ? (data.archived ? 1 : 0) : (existing.archived ? 1 : 0),
    provider: data.provider ?? existing.provider,
    model: data.model ?? existing.model,
    createdAt: existing.createdAt,
    updatedAt: now,
  }

  await redis.set(presKey(id), JSON.stringify(updated))

  // If share token changed, update the share index
  if (data.shareToken !== undefined) {
    if (existing.shareToken) {
      await redis.del(shareKey(existing.shareToken))
    }
    if (data.shareToken) {
      await redis.set(shareKey(data.shareToken), id)
    }
  }

  return toPresentation(updated)
}

export async function deletePresentation(id: string): Promise<void> {
  const existing = await getPresentation(id)
  if (!existing) return

  const ops: Promise<any>[] = [
    redis.del(presKey(id)),
    redis.zrem(userPresKey(existing.userId), id),
  ]

  if (existing.shareToken) {
    ops.push(redis.del(shareKey(existing.shareToken)))
  }

  await Promise.all(ops)
}

// ---------------------------------------------------------------------------
// User settings (API keys, model preferences — per-user)
// ---------------------------------------------------------------------------

export interface UserSettings {
  provider: 'anthropic' | 'google' | 'openrouter'
  anthropicKey: string
  googleKey: string
  openrouterKey: string
  anthropicModel: string
  googleModel: string
  openrouterModel: string
  /** Notion internal integration token for importing pages/databases */
  notionKey: string
  /** Amplitude API key for pulling analytics data */
  amplitudeApiKey: string
  /** Amplitude secret key for pulling analytics data */
  amplitudeSecretKey: string
  /** Google Cloud API key for importing Sheets, Docs, and Slides */
  googleWorkspaceKey: string
  /** ClickUp personal API token for importing tasks and lists */
  clickupKey: string
}

const settingsKey = (userId: string) => `studio:settings:${userId}`

const DEFAULT_SETTINGS: UserSettings = {
  provider: 'anthropic',
  anthropicKey: '',
  googleKey: '',
  openrouterKey: '',
  anthropicModel: 'claude-sonnet-4-20250514',
  googleModel: 'gemini-2.5-flash',
  openrouterModel: 'google/gemini-2.5-flash',
  notionKey: '',
  amplitudeApiKey: '',
  amplitudeSecretKey: '',
  googleWorkspaceKey: '',
  clickupKey: '',
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const raw = await redis.get<string | UserSettings>(settingsKey(userId))
  if (!raw) return { ...DEFAULT_SETTINGS }
  const stored: UserSettings = typeof raw === 'string' ? JSON.parse(raw) : raw
  // Decrypt sensitive fields (handles both encrypted and legacy plaintext)
  const decrypted = { ...DEFAULT_SETTINGS, ...stored }
  for (const field of SENSITIVE_FIELDS) {
    if (decrypted[field]) {
      decrypted[field] = decryptField(decrypted[field])
    }
  }
  return decrypted
}

export async function setUserSettings(
  userId: string,
  settings: Partial<UserSettings>,
): Promise<UserSettings> {
  const current = await getUserSettings(userId)
  const updated = { ...current, ...settings }
  // Encrypt sensitive fields before storing
  const toStore = { ...updated }
  for (const field of SENSITIVE_FIELDS) {
    if (toStore[field]) {
      toStore[field] = encryptField(toStore[field])
    }
  }
  await redis.set(settingsKey(userId), JSON.stringify(toStore))
  return updated // Return decrypted version
}

// ---------------------------------------------------------------------------
// Share tokens & access control
// ---------------------------------------------------------------------------

export type ShareAccess = 'public' | 'org' | 'specific'
export type SharePermission = 'viewer' | 'commenter' | 'editor'

export interface ShareRecord {
  presentationId: string
  ownerId: string
  access: ShareAccess
  allowedEmails: string[]
  /** Default permission level for public/org access */
  permission: SharePermission
  /** Per-email permission overrides (email → permission). Only used with 'specific' access. */
  emailPermissions?: Record<string, SharePermission>
  createdAt: number
}

export async function getShareRecord(token: string): Promise<ShareRecord | null> {
  const raw = await redis.get<string | ShareRecord>(shareKey(token))
  if (!raw) return null
  // Legacy: bare string = presentation ID, treat as public
  // Also handles double-encoded JSON (stored via JSON.stringify into Upstash which auto-serializes)
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && parsed.presentationId) {
        return parsed as ShareRecord
      }
    } catch {
      // Not JSON — bare presId string (legacy)
    }
    return { presentationId: raw, ownerId: '', access: 'public', allowedEmails: [], permission: 'viewer', createdAt: 0 }
  }
  // Ensure legacy records without permission field get a default
  if (!raw.permission) raw.permission = 'viewer'
  return raw
}

export async function getShareConfigForPresentation(presId: string): Promise<{ token: string; record: ShareRecord } | null> {
  const pres = await getPresentation(presId)
  if (!pres || !pres.shareToken) return null
  const record = await getShareRecord(pres.shareToken)
  if (!record) return null
  return { token: pres.shareToken, record }
}

export async function generateShareToken(
  id: string,
  ownerId: string,
  access: ShareAccess = 'public',
  allowedEmails: string[] = [],
  permission: SharePermission = 'viewer',
  emailPermissions?: Record<string, SharePermission>,
): Promise<string | null> {
  const existing = await getPresentation(id)
  if (!existing) return null

  // Reuse existing token if available
  let token = existing.shareToken
  if (token) {
    await redis.del(shareKey(token))
  } else {
    token = crypto.randomBytes(16).toString('hex')
  }

  const record: ShareRecord = {
    presentationId: id,
    ownerId,
    access,
    allowedEmails: allowedEmails.map((e) => e.toLowerCase()),
    permission,
    emailPermissions: emailPermissions ? Object.fromEntries(
      Object.entries(emailPermissions).map(([e, p]) => [e.toLowerCase(), p])
    ) : undefined,
    createdAt: Math.floor(Date.now() / 1000),
  }

  const ops: Promise<any>[] = [
    redis.set(shareKey(token), record),
    updatePresentation(id, { shareToken: token }),
  ]

  // Populate inverse share indexes
  if (access === 'org') {
    ops.push(redis.zadd(sharedOrgKey(), { score: record.createdAt, member: id }))
  }
  for (const email of record.allowedEmails) {
    ops.push(redis.zadd(sharedWithKey(email), { score: record.createdAt, member: id }))
  }

  await Promise.all(ops)

  return token
}

export async function updateShareAccess(
  token: string,
  access: ShareAccess,
  allowedEmails: string[],
  permission: SharePermission = 'viewer',
  emailPermissions?: Record<string, SharePermission>,
): Promise<ShareRecord | null> {
  const record = await getShareRecord(token)
  if (!record) return null

  // Remove old inverse index entries
  const removeOps: Promise<any>[] = []
  if (record.access === 'org') {
    removeOps.push(redis.zrem(sharedOrgKey(), record.presentationId))
  }
  for (const email of record.allowedEmails) {
    removeOps.push(redis.zrem(sharedWithKey(email), record.presentationId))
  }
  if (removeOps.length > 0) await Promise.all(removeOps)

  const updated: ShareRecord = {
    ...record,
    access,
    allowedEmails: allowedEmails.map((e) => e.toLowerCase()),
    permission,
    emailPermissions: emailPermissions ? Object.fromEntries(
      Object.entries(emailPermissions).map(([e, p]) => [e.toLowerCase(), p])
    ) : undefined,
  }

  // Add new inverse index entries
  const addOps: Promise<any>[] = [
    redis.set(shareKey(token), updated),
  ]
  if (access === 'org') {
    addOps.push(redis.zadd(sharedOrgKey(), { score: record.createdAt, member: record.presentationId }))
  }
  for (const email of updated.allowedEmails) {
    addOps.push(redis.zadd(sharedWithKey(email), { score: record.createdAt, member: record.presentationId }))
  }
  await Promise.all(addOps)

  return updated
}

export async function revokeShare(presId: string): Promise<void> {
  const pres = await getPresentation(presId)
  if (!pres || !pres.shareToken) return

  // Remove inverse index entries before deleting the share record
  const record = await getShareRecord(pres.shareToken)
  const ops: Promise<any>[] = [
    redis.del(shareKey(pres.shareToken)),
    updatePresentation(presId, { shareToken: null }),
  ]
  if (record) {
    if (record.access === 'org') {
      ops.push(redis.zrem(sharedOrgKey(), presId))
    }
    for (const email of record.allowedEmails) {
      ops.push(redis.zrem(sharedWithKey(email), presId))
    }
  }

  await Promise.all(ops)
}

/** Resolve the effective permission for a given email against a ShareRecord */
export function resolvePermission(record: ShareRecord, email?: string): SharePermission {
  if (!email) return record.permission
  const lower = email.toLowerCase()
  if (record.access === 'specific' && record.emailPermissions?.[lower]) {
    return record.emailPermissions[lower]
  }
  return record.permission
}

// ---------------------------------------------------------------------------
// Shared presentation queries
// ---------------------------------------------------------------------------

/** Get presentations shared with a specific email (via direct shares + org-level shares) */
export async function getPresentationsSharedWithEmail(email: string): Promise<(Presentation & { ownerName?: string; ownerEmail?: string })[]> {
  const lowerEmail = email.toLowerCase()
  const queries: Promise<string[]>[] = [
    redis.zrange<string[]>(sharedWithKey(lowerEmail), 0, -1, { rev: true }).then(r => r ?? []),
  ]
  // Include org-level shares for @felixpago.com users
  if (lowerEmail.endsWith('@felixpago.com')) {
    queries.push(redis.zrange<string[]>(sharedOrgKey(), 0, -1, { rev: true }).then(r => r ?? []))
  }

  const results = await Promise.all(queries)
  const allIds = [...new Set(results.flat())]
  if (allIds.length === 0) return []

  const presentations = await Promise.all(allIds.map(id => getPresentation(id)))
  const valid = presentations.filter((p): p is Presentation => p !== null && p.userId !== undefined)

  // Fetch owner info for each presentation
  const ownerIds = [...new Set(valid.map(p => p.userId))]
  const owners = await Promise.all(ownerIds.map(id => getUserById(id)))
  const ownerMap = new Map(owners.filter(Boolean).map(u => [u!.id, u!]))

  return valid.map(p => {
    const owner = ownerMap.get(p.userId)
    return { ...p, ownerName: owner?.name, ownerEmail: owner?.email }
  })
}

/** Get user's presentations that have been shared (have a non-null shareToken) */
export async function getUserSharedPresentations(userId: string): Promise<(Presentation & { shareAccess?: ShareAccess; shareEmailCount?: number })[]> {
  const all = await getUserPresentations(userId)
  const shared = all.filter(p => p.shareToken)

  // Enrich with share config details
  const enriched = await Promise.all(shared.map(async (p) => {
    const record = p.shareToken ? await getShareRecord(p.shareToken) : null
    return {
      ...p,
      shareAccess: record?.access,
      shareEmailCount: record?.allowedEmails?.length ?? 0,
    }
  }))

  return enriched
}

// ---------------------------------------------------------------------------
// Slide Ratings (training data for generation quality)
// ---------------------------------------------------------------------------

export interface SlideRating {
  id: string
  slideType: string
  bg: string
  rating: 1 | -1
  slideData: any // SlideData JSON
  note?: string
  source: string // e.g. 'jose', 'icp', or presentation ID
  sourceSlideIndex: number
  createdAt: number
}

const ratingKey = (id: string) => `studio:rating:${id}`
const ratingGoodIdx = 'studio:ratings:good'
const ratingBadIdx = 'studio:ratings:bad'
const ratingByTypeIdx = (type: string) => `studio:ratings:type:${type}`

/** Generate a deterministic ID for a slide rating based on source + index */
function slideRatingId(source: string, slideIndex: number): string {
  return `${source}:${slideIndex}`
}

export async function rateSlide(
  slideType: string,
  bg: string,
  rating: 1 | -1,
  slideData: any,
  source: string,
  sourceSlideIndex: number,
  note?: string,
): Promise<SlideRating> {
  const id = slideRatingId(source, sourceSlideIndex)
  const now = Math.floor(Date.now() / 1000)

  const entry: SlideRating = {
    id, slideType, bg, rating, slideData, note, source, sourceSlideIndex, createdAt: now,
  }

  // Remove from opposite index if re-rating
  await Promise.all([
    redis.del(ratingKey(id)),
    redis.zrem(ratingGoodIdx, id),
    redis.zrem(ratingBadIdx, id),
    redis.zrem(ratingByTypeIdx(slideType), id),
  ])

  // Store the rating
  const idx = rating === 1 ? ratingGoodIdx : ratingBadIdx
  await Promise.all([
    redis.set(ratingKey(id), JSON.stringify(entry)),
    redis.zadd(idx, { score: now, member: id }),
    redis.zadd(ratingByTypeIdx(slideType), { score: rating * now, member: id }),
  ])

  return entry
}

export async function removeRating(source: string, slideIndex: number): Promise<void> {
  const id = slideRatingId(source, slideIndex)
  const raw = await redis.get<string | SlideRating>(ratingKey(id))
  if (!raw) return
  const entry: SlideRating = typeof raw === 'string' ? JSON.parse(raw) : raw

  await Promise.all([
    redis.del(ratingKey(id)),
    redis.zrem(ratingGoodIdx, id),
    redis.zrem(ratingBadIdx, id),
    redis.zrem(ratingByTypeIdx(entry.slideType), id),
  ])
}

export async function getSlideRating(source: string, slideIndex: number): Promise<SlideRating | null> {
  const id = slideRatingId(source, slideIndex)
  const raw = await redis.get<string | SlideRating>(ratingKey(id))
  if (!raw) return null
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

export async function getRatingsForSource(source: string): Promise<Map<number, 1 | -1>> {
  // We can't efficiently query by source prefix in Redis sorted sets,
  // so we'll fetch from the good + bad indexes and filter
  const [goodIds, badIds] = await Promise.all([
    redis.zrange<string[]>(ratingGoodIdx, 0, -1),
    redis.zrange<string[]>(ratingBadIdx, 0, -1),
  ])

  const map = new Map<number, 1 | -1>()
  for (const id of (goodIds ?? [])) {
    if (id.startsWith(`${source}:`)) {
      const idx = parseInt(id.split(':').pop()!, 10)
      if (!isNaN(idx)) map.set(idx, 1)
    }
  }
  for (const id of (badIds ?? [])) {
    if (id.startsWith(`${source}:`)) {
      const idx = parseInt(id.split(':').pop()!, 10)
      if (!isNaN(idx)) map.set(idx, -1)
    }
  }
  return map
}

/** Get top-rated exemplar slides, optionally filtered by slide type */
export async function getExemplarSlides(slideType?: string, limit = 5): Promise<SlideRating[]> {
  let ids: string[]
  if (slideType) {
    // Get from type-specific index, highest scores first (good ratings with recent timestamps)
    ids = await redis.zrange<string[]>(ratingByTypeIdx(slideType), 0, limit - 1, { rev: true }) ?? []
    // Filter to only positive ratings
  } else {
    ids = await redis.zrange<string[]>(ratingGoodIdx, 0, limit - 1, { rev: true }) ?? []
  }

  if (!ids.length) return []

  const results = await Promise.all(
    ids.map(async (id) => {
      const raw = await redis.get<string | SlideRating>(ratingKey(id))
      if (!raw) return null
      const entry: SlideRating = typeof raw === 'string' ? JSON.parse(raw) : raw
      return entry.rating === 1 ? entry : null
    })
  )

  return results.filter((r): r is SlideRating => r !== null)
}

/** Get negatively-rated slides to avoid */
export async function getAntiExemplarSlides(limit = 3): Promise<SlideRating[]> {
  const ids = await redis.zrange<string[]>(ratingBadIdx, 0, limit - 1, { rev: true }) ?? []
  if (!ids.length) return []

  const results = await Promise.all(
    ids.map(async (id) => {
      const raw = await redis.get<string | SlideRating>(ratingKey(id))
      if (!raw) return null
      return typeof raw === 'string' ? JSON.parse(raw) as SlideRating : raw
    })
  )

  return results.filter((r): r is SlideRating => r !== null)
}

// ---------------------------------------------------------------------------
// Revision History
// ---------------------------------------------------------------------------

export interface Revision {
  id: string
  prompt: string
  scope: string
  slideIndex?: number
  timestamp: number
  /** Snapshot of slides BEFORE this edit was applied */
  slidesBefore: any[]
}

const revisionsKey = (presId: string) => `studio:revisions:${presId}`

export async function addRevision(presId: string, revision: Revision): Promise<void> {
  const key = revisionsKey(presId)
  await redis.rpush(key, JSON.stringify(revision))
  // Cap at 30 revisions per presentation
  await redis.ltrim(key, -30, -1)
}

export async function getRevisions(presId: string): Promise<Revision[]> {
  const raw = await redis.lrange<string>(revisionsKey(presId), 0, -1)
  return raw.map(r => typeof r === 'string' ? JSON.parse(r) : r)
}

export async function clearRevisions(presId: string, afterTimestamp: number): Promise<void> {
  // Remove revisions at or before the given timestamp (used when reverting)
  const all = await getRevisions(presId)
  const keep = all.filter(r => r.timestamp > afterTimestamp)
  const key = revisionsKey(presId)
  await redis.del(key)
  if (keep.length > 0) {
    const pipeline = redis.pipeline()
    for (const r of keep) pipeline.rpush(key, JSON.stringify(r))
    await pipeline.exec()
  }
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export interface TemplateSectionSkeleton {
  type: string
  title?: string
  tone?: string
}

export interface Template {
  id: string
  userId: string
  title: string
  description: string
  slideCount: number
  sections: TemplateSectionSkeleton[]
  sourcePresId: string
  createdAt: number
}

const templateKey = (id: string) => `studio:template:${id}`
const userTemplatesKey = (userId: string) => `studio:user:templates:${userId}`

export async function createTemplate(
  userId: string,
  title: string,
  description: string,
  sections: TemplateSectionSkeleton[],
  sourcePresId: string,
): Promise<Template> {
  const id = crypto.randomUUID()
  const now = Math.floor(Date.now() / 1000)

  const template: Template = {
    id,
    userId,
    title,
    description,
    slideCount: sections.length,
    sections,
    sourcePresId,
    createdAt: now,
  }

  await Promise.all([
    redis.set(templateKey(id), JSON.stringify(template)),
    redis.zadd(userTemplatesKey(userId), { score: now, member: id }),
  ])

  return template
}

export async function getUserTemplates(userId: string): Promise<Template[]> {
  const ids = await redis.zrange<string[]>(userTemplatesKey(userId), 0, -1, { rev: true })
  if (!ids || ids.length === 0) return []

  const results = await Promise.all(
    ids.map(async (id) => {
      const raw = await redis.get<string | Template>(templateKey(id))
      if (!raw) return null
      return typeof raw === 'string' ? JSON.parse(raw) as Template : raw
    })
  )
  return results.filter((t): t is Template => t !== null)
}

export async function deleteTemplate(id: string): Promise<void> {
  const raw = await redis.get<string | Template>(templateKey(id))
  if (!raw) return
  const template: Template = typeof raw === 'string' ? JSON.parse(raw) : raw
  await Promise.all([
    redis.del(templateKey(id)),
    redis.zrem(userTemplatesKey(template.userId), id),
  ])
}
