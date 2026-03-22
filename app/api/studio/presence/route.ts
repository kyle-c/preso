import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { getPresentation } from '@/lib/studio-db'
import {
  updatePresence,
  removePresence,
  getPresenceUsers,
  acquireLock,
  releaseLock,
  getLocksForDeck,
} from '@/lib/studio-presence'

export const runtime = 'nodejs'

/* ── GET: Fetch current presence + locks for a deck ─────── */

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const deckId = req.nextUrl.searchParams.get('deckId')
    if (!deckId) return NextResponse.json({ error: 'deckId required' }, { status: 400 })

    const pres = await getPresentation(deckId)
    if (!pres) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const [users, locks] = await Promise.all([
      getPresenceUsers(deckId),
      getLocksForDeck(deckId, pres.slides.length),
    ])

    return NextResponse.json({ users, locks })
  } catch (err) {
    console.error('[presence GET]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

/* ── POST: Heartbeat (update presence) or lock/unlock ───── */

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const { action, deckId, currentSlide, slideIndex } = body

    if (!deckId) return NextResponse.json({ error: 'deckId required' }, { status: 400 })

    switch (action) {
      case 'heartbeat': {
        await updatePresence(
          deckId,
          session.userId,
          session.user.email,
          session.user.name,
          currentSlide ?? 0,
        )
        return NextResponse.json({ ok: true }, { status: 202 })
      }

      case 'lock': {
        if (slideIndex === undefined) return NextResponse.json({ error: 'slideIndex required' }, { status: 400 })
        const result = await acquireLock(deckId, slideIndex, session.userId, session.user.email, session.user.name)
        return NextResponse.json(result)
      }

      case 'unlock': {
        if (slideIndex === undefined) return NextResponse.json({ error: 'slideIndex required' }, { status: 400 })
        await releaseLock(deckId, slideIndex, session.userId)
        return NextResponse.json({ ok: true })
      }

      case 'leave': {
        await removePresence(deckId, session.userId)
        return NextResponse.json({ ok: true })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err) {
    console.error('[presence POST]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
