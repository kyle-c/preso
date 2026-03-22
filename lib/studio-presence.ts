import { redis } from './studio-db'

/* ═══════════════════════════════════════════════════════════ */
/*                    PRESENCE + LOCKING                        */
/*                                                              */
/*  Redis-backed presence tracking and slide locking for       */
/*  real-time collaboration. Uses TTL keys — no persistent     */
/*  connections needed.                                         */
/*                                                              */
/*  Presence key:  studio:presence:{deckId}:{userId}           */
/*    TTL: 30s, heartbeat every 10s from client                */
/*                                                              */
/*  Lock key:      studio:lock:{deckId}:{slideIndex}           */
/*    TTL: 30s, renewed on each heartbeat while editing        */
/* ═══════════════════════════════════════════════════════════ */

const PRESENCE_TTL = 30 // seconds
const LOCK_TTL = 30 // seconds

// Assign consistent colors to users
const PRESENCE_COLORS = ['#2BF2F1', '#6060BF', '#60D06F', '#F19D38', '#F26629', '#7BA882', '#DCFF00', '#FFCD9C']

const presenceKey = (deckId: string, userId: string) => `studio:presence:${deckId}:${userId}`
const presenceSetKey = (deckId: string) => `studio:presence-set:${deckId}`
const lockKey = (deckId: string, slideIndex: number) => `studio:lock:${deckId}:${slideIndex}`

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PresenceUser {
  userId: string
  email: string
  name: string
  initials: string
  color: string
  currentSlide: number
  lastSeen: number
}

export interface SlideLock {
  userId: string
  email: string
  name: string
  lockedAt: number
}

// ---------------------------------------------------------------------------
// Presence
// ---------------------------------------------------------------------------

export async function updatePresence(
  deckId: string,
  userId: string,
  email: string,
  name: string,
  currentSlide: number,
): Promise<void> {
  const initials = email
    .split('@')[0]
    .split(/[._-]/)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase() ?? '')
    .join('')

  // Assign a stable color based on userId hash
  const colorIndex = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % PRESENCE_COLORS.length
  const color = PRESENCE_COLORS[colorIndex]

  const data: PresenceUser = {
    userId,
    email,
    name,
    initials,
    color,
    currentSlide,
    lastSeen: Date.now(),
  }

  await Promise.all([
    redis.set(presenceKey(deckId, userId), JSON.stringify(data), { ex: PRESENCE_TTL }),
    redis.sadd(presenceSetKey(deckId), userId),
  ])
}

export async function removePresence(deckId: string, userId: string): Promise<void> {
  await Promise.all([
    redis.del(presenceKey(deckId, userId)),
    redis.srem(presenceSetKey(deckId), userId),
  ])
}

export async function getPresenceUsers(deckId: string): Promise<PresenceUser[]> {
  const userIds = await redis.smembers<string[]>(presenceSetKey(deckId))
  if (!userIds || userIds.length === 0) return []

  const users: PresenceUser[] = []
  const staleIds: string[] = []

  for (const uid of userIds) {
    const raw = await redis.get<string | PresenceUser>(presenceKey(deckId, uid))
    if (!raw) {
      staleIds.push(uid) // Presence expired, clean up set
      continue
    }
    const user: PresenceUser = typeof raw === 'string' ? JSON.parse(raw) : raw
    users.push(user)
  }

  // Clean up stale user IDs from the set
  if (staleIds.length > 0) {
    await Promise.all(staleIds.map(uid => redis.srem(presenceSetKey(deckId), uid)))
  }

  return users
}

// ---------------------------------------------------------------------------
// Slide Locking
// ---------------------------------------------------------------------------

export async function acquireLock(
  deckId: string,
  slideIndex: number,
  userId: string,
  email: string,
  name: string,
): Promise<{ acquired: boolean; heldBy?: SlideLock }> {
  const key = lockKey(deckId, slideIndex)
  const existing = await redis.get<string | SlideLock>(key)

  if (existing) {
    const lock: SlideLock = typeof existing === 'string' ? JSON.parse(existing) : existing
    if (lock.userId === userId) {
      // Renew own lock
      await redis.set(key, JSON.stringify(lock), { ex: LOCK_TTL })
      return { acquired: true }
    }
    return { acquired: false, heldBy: lock }
  }

  const lock: SlideLock = { userId, email, name, lockedAt: Date.now() }
  // Use SET NX (set if not exists) for atomic lock acquisition
  const set = await redis.set(key, JSON.stringify(lock), { ex: LOCK_TTL, nx: true })
  if (!set) {
    // Race condition — someone else grabbed it
    const current = await redis.get<string | SlideLock>(key)
    if (current) {
      const held: SlideLock = typeof current === 'string' ? JSON.parse(current) : current
      return { acquired: false, heldBy: held }
    }
  }
  return { acquired: true }
}

export async function releaseLock(deckId: string, slideIndex: number, userId: string): Promise<void> {
  const key = lockKey(deckId, slideIndex)
  const existing = await redis.get<string | SlideLock>(key)
  if (!existing) return

  const lock: SlideLock = typeof existing === 'string' ? JSON.parse(existing) : existing
  if (lock.userId === userId) {
    await redis.del(key)
  }
}

export async function getLocksForDeck(deckId: string, slideCount: number): Promise<Record<number, SlideLock>> {
  const locks: Record<number, SlideLock> = {}

  // Batch check locks for all slides
  const pipeline = redis.pipeline()
  for (let i = 0; i < slideCount; i++) {
    pipeline.get(lockKey(deckId, i))
  }
  const results = await pipeline.exec<(string | SlideLock | null)[]>()

  for (let i = 0; i < results.length; i++) {
    const raw = results[i]
    if (raw) {
      locks[i] = typeof raw === 'string' ? JSON.parse(raw) : raw
    }
  }

  return locks
}
