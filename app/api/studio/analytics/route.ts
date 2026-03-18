import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { Redis } from '@upstash/redis'
import {
  recordEditEvent,
  recordEditEvents,
  recordBeacon,
  recordSessionEnd,
  recordGenerationOutcome,
  type EditEvent,
  type ViewerBeacon,
  type ViewerSession,
} from '@/lib/studio-analytics'

const redis = Redis.fromEnv()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    switch (body.type) {
      case 'edit': {
        // Requires auth
        const session = await getServerSession()
        if (!session) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const event = body.event as EditEvent
        event.userId = session.user.id // enforce server-side
        await recordEditEvent(event)
        return NextResponse.json({ ok: true })
      }

      case 'edits': {
        // Batch edit events - requires auth
        const session = await getServerSession()
        if (!session) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const events = (body.events as EditEvent[]).map(e => ({
          ...e,
          userId: session.user.id,
        }))
        await recordEditEvents(events)
        return NextResponse.json({ ok: true })
      }

      case 'beacon': {
        // No auth required — validate shareToken exists
        const beacon = body.beacon as ViewerBeacon
        if (!beacon.shareToken) {
          return NextResponse.json({ error: 'Missing shareToken' }, { status: 400 })
        }
        const exists = await redis.exists(`studio:share:${beacon.shareToken}`)
        if (!exists) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
        }
        await recordBeacon(beacon)
        // Return 202 for fire-and-forget semantics
        return new NextResponse(JSON.stringify({ ok: true }), { status: 202 })
      }

      case 'session_end': {
        // No auth required — validate shareToken exists
        const session = body.session as ViewerSession
        if (!session.shareToken) {
          return NextResponse.json({ error: 'Missing shareToken' }, { status: 400 })
        }
        const exists = await redis.exists(`studio:share:${session.shareToken}`)
        if (!exists) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
        }
        await recordSessionEnd(session)
        return new NextResponse(JSON.stringify({ ok: true }), { status: 202 })
      }

      case 'generation_outcome': {
        const session = await getServerSession()
        if (!session) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        await recordGenerationOutcome(body.presId, session.user.id, body.action)
        return NextResponse.json({ ok: true })
      }

      default:
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 })
    }
  } catch (err) {
    console.error('[studio/analytics]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
