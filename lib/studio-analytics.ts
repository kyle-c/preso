import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FieldDiff {
  field: string       // e.g. 'title', 'body', 'bg', 'type', 'bullets'
  before: string      // JSON.stringify of old value
  after: string       // JSON.stringify of new value
}

export interface EditEvent {
  presId: string
  userId: string
  slideIndex: number
  timestamp: number                   // epoch seconds
  action: 'field_edit' | 'slide_delete' | 'slide_reorder' | 'slide_add' | 'full_rebuild' | 'slide_rebuild'
  fields?: FieldDiff[]
}

export interface ViewerBeacon {
  shareToken: string
  slideIndex: number
  dwellMs: number
  action: 'view' | 'skip_forward' | 'skip_backward' | 'exit'
  sessionId: string
  timestamp: number
}

export interface ViewerSession {
  sessionId: string
  shareToken: string
  startedAt: number
  endedAt: number
  slidesViewed: number
  totalSlides: number
  totalDwellMs: number
  completed: boolean                  // viewed >= 80% of slides
}

// ---------------------------------------------------------------------------
// Redis key helpers
// ---------------------------------------------------------------------------

const editsKey = (presId: string) => `studio:edits:${presId}`
const viewsKey = (shareToken: string) => `studio:views:${shareToken}`
const sessionsKey = (shareToken: string) => `studio:sessions:${shareToken}`
const qualityKey = (presId: string) => `studio:quality:${presId}`
const trainingKey = (userId: string) => `studio:training:${userId}`
const profileKey = (userId: string) => `studio:profile:${userId}`
const slideScoresKey = (presId: string) => `studio:slide:scores:${presId}`
const patternsKey = (type: string, bg: string) => `studio:patterns:${type}:${bg}`
const exemplarsKey = (intentType: string) => `studio:exemplars:${intentType}`

// Export key helpers for use in other modules
export { qualityKey, trainingKey, profileKey, slideScoresKey, patternsKey, exemplarsKey, editsKey, viewsKey, sessionsKey }

// ---------------------------------------------------------------------------
// Edit Events
// ---------------------------------------------------------------------------

export async function recordEditEvent(event: EditEvent): Promise<void> {
  const key = editsKey(event.presId)
  await redis.rpush(key, JSON.stringify(event))
  // Cap at 500 events per presentation
  await redis.ltrim(key, -500, -1)
}

export async function recordEditEvents(events: EditEvent[]): Promise<void> {
  if (events.length === 0) return
  const key = editsKey(events[0].presId)
  const pipeline = redis.pipeline()
  for (const event of events) {
    pipeline.rpush(key, JSON.stringify(event))
  }
  pipeline.ltrim(key, -500, -1)
  await pipeline.exec()
}

export async function getEditEvents(presId: string): Promise<EditEvent[]> {
  const raw = await redis.lrange<string>(editsKey(presId), 0, -1)
  return raw.map(r => typeof r === 'string' ? JSON.parse(r) : r)
}

// ---------------------------------------------------------------------------
// Viewer Beacons
// ---------------------------------------------------------------------------

export async function recordBeacon(beacon: ViewerBeacon): Promise<void> {
  const key = viewsKey(beacon.shareToken)
  const pipeline = redis.pipeline()
  // Increment dwell time for this slide
  pipeline.hincrby(key, `${beacon.slideIndex}:dwell`, beacon.dwellMs)
  // Increment view count for this slide
  pipeline.hincrby(key, `${beacon.slideIndex}:views`, 1)
  await pipeline.exec()
}

export async function recordSessionEnd(session: ViewerSession): Promise<void> {
  const key = sessionsKey(session.shareToken)
  await redis.rpush(key, JSON.stringify(session))
  // Cap at 200 sessions
  await redis.ltrim(key, -200, -1)
}

export async function getViewerStats(shareToken: string): Promise<Record<number, { totalDwell: number; viewCount: number }>> {
  const raw = await redis.hgetall<Record<string, number>>(viewsKey(shareToken))
  if (!raw) return {}

  const stats: Record<number, { totalDwell: number; viewCount: number }> = {}
  for (const [field, value] of Object.entries(raw)) {
    const [indexStr, metric] = field.split(':')
    const index = parseInt(indexStr, 10)
    if (isNaN(index)) continue
    if (!stats[index]) stats[index] = { totalDwell: 0, viewCount: 0 }
    if (metric === 'dwell') stats[index].totalDwell = value
    else if (metric === 'views') stats[index].viewCount = value
  }
  return stats
}

export async function getViewerSessions(shareToken: string): Promise<ViewerSession[]> {
  const raw = await redis.lrange<string>(sessionsKey(shareToken), 0, -1)
  return raw.map(r => typeof r === 'string' ? JSON.parse(r) : r)
}

// ---------------------------------------------------------------------------
// Generation Outcomes
// ---------------------------------------------------------------------------

export async function recordGenerationOutcome(
  presId: string,
  userId: string,
  action: 'shared' | 'abandoned' | 'edited',
): Promise<void> {
  const key = qualityKey(presId)
  await redis.hset(key, { [action]: 1, userId })
}

// ---------------------------------------------------------------------------
// Slide diff computation
// ---------------------------------------------------------------------------

export function computeSlideEdits(
  before: any[],
  after: any[],
  presId: string,
  userId: string,
): EditEvent[] {
  const now = Math.floor(Date.now() / 1000)
  const events: EditEvent[] = []

  // Compare field-level diffs for overlapping slides
  const minLen = Math.min(before.length, after.length)
  for (let i = 0; i < minLen; i++) {
    const fields: FieldDiff[] = []
    const allKeys = new Set([...Object.keys(before[i] || {}), ...Object.keys(after[i] || {})])
    for (const key of allKeys) {
      const bVal = JSON.stringify(before[i]?.[key] ?? null)
      const aVal = JSON.stringify(after[i]?.[key] ?? null)
      if (bVal !== aVal) {
        fields.push({ field: key, before: bVal, after: aVal })
      }
    }
    if (fields.length > 0) {
      events.push({ presId, userId, slideIndex: i, timestamp: now, action: 'field_edit', fields })
    }
  }

  // Deleted slides
  for (let i = minLen; i < before.length; i++) {
    events.push({ presId, userId, slideIndex: i, timestamp: now, action: 'slide_delete' })
  }

  // Added slides
  for (let i = minLen; i < after.length; i++) {
    events.push({ presId, userId, slideIndex: i, timestamp: now, action: 'slide_add' })
  }

  return events
}
