'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════ */
/*                   PRESENCE AVATARS                          */
/*                                                              */
/*  Shows who's currently viewing/editing a presentation.      */
/*  Polls for presence updates every 3s. Sends heartbeat       */
/*  every 10s. Cleans up on unmount.                           */
/* ═══════════════════════════════════════════════════════════ */

interface PresenceUser {
  userId: string
  email: string
  name: string
  initials: string
  color: string
  currentSlide: number
  lastSeen: number
}

interface SlideLock {
  userId: string
  email: string
  name: string
  lockedAt: number
}

interface PresenceState {
  users: PresenceUser[]
  locks: Record<number, SlideLock>
}

const HEARTBEAT_INTERVAL = 10_000 // 10s
const POLL_INTERVAL = 3_000 // 3s

export function usePresence(deckId: string | undefined, currentSlide: number) {
  const [state, setState] = useState<PresenceState>({ users: [], locks: {} })
  const heartbeatRef = useRef<ReturnType<typeof setInterval>>()
  const pollRef = useRef<ReturnType<typeof setInterval>>()

  // Heartbeat — tell the server we're here
  const sendHeartbeat = useCallback(async () => {
    if (!deckId) return
    try {
      await fetch('/api/studio/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'heartbeat', deckId, currentSlide }),
      })
    } catch {}
  }, [deckId, currentSlide])

  // Poll for presence updates
  const pollPresence = useCallback(async () => {
    if (!deckId) return
    try {
      const res = await fetch(`/api/studio/presence?deckId=${deckId}`)
      if (res.ok) {
        const data = await res.json()
        setState({ users: data.users || [], locks: data.locks || {} })
      }
    } catch {}
  }, [deckId])

  // Start heartbeat + polling on mount
  useEffect(() => {
    if (!deckId) return

    // Initial heartbeat + poll
    sendHeartbeat()
    pollPresence()

    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL)
    pollRef.current = setInterval(pollPresence, POLL_INTERVAL)

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
      // Send leave on unmount
      navigator.sendBeacon?.(
        '/api/studio/presence',
        new Blob([JSON.stringify({ action: 'leave', deckId })], { type: 'application/json' }),
      )
    }
  }, [deckId, sendHeartbeat, pollPresence])

  // Update heartbeat when slide changes
  useEffect(() => {
    if (deckId) sendHeartbeat()
  }, [currentSlide, deckId, sendHeartbeat])

  return state
}

/* ── Presence Avatars Display ──────────────────────────────── */

interface PresenceAvatarsProps {
  users: PresenceUser[]
  currentUserId?: string
  className?: string
}

export function PresenceAvatars({ users, currentUserId, className }: PresenceAvatarsProps) {
  // Filter out current user and show others
  const others = users.filter(u => u.userId !== currentUserId)
  if (others.length === 0) return null

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex -space-x-2">
        {others.slice(0, 5).map(user => (
          <div
            key={user.userId}
            className="relative group"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-background transition-transform hover:scale-110 hover:z-10"
              style={{ backgroundColor: user.color, color: '#082422' }}
              title={`${user.name || user.email} — viewing slide ${user.currentSlide + 1}`}
            >
              {user.initials}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950 text-white text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {user.name || user.email}
              <span className="text-white/50 ml-1">· slide {user.currentSlide + 1}</span>
            </div>
          </div>
        ))}
      </div>
      {others.length > 5 && (
        <span className="ml-1 text-[10px] text-muted-foreground">+{others.length - 5}</span>
      )}
    </div>
  )
}

/* ── Slide Lock Indicator ──────────────────────────────────── */

interface SlideLockIndicatorProps {
  lock: SlideLock | undefined
  currentUserId?: string
}

export function SlideLockIndicator({ lock, currentUserId }: SlideLockIndicatorProps) {
  if (!lock || lock.userId === currentUserId) return null

  return (
    <div className="absolute top-2 right-2 z-[60] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-semibold animate-in fade-in duration-200">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      {lock.name || lock.email} is editing
    </div>
  )
}
