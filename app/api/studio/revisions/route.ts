import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { getPresentation, updatePresentation, addRevision, getRevisions, clearRevisions } from '@/lib/studio-db'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const presId = req.nextUrl.searchParams.get('presId')
    if (!presId) return NextResponse.json({ error: 'presId required' }, { status: 400 })

    const pres = await getPresentation(presId)
    if (!pres || pres.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const revisions = await getRevisions(presId)
    return NextResponse.json({ revisions })
  } catch (err) {
    console.error('[revisions GET]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { presId, action, revision, timestamp } = await req.json()
    if (!presId) return NextResponse.json({ error: 'presId required' }, { status: 400 })

    const pres = await getPresentation(presId)
    if (!pres || pres.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (action === 'add' && revision) {
      await addRevision(presId, revision)
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    if (action === 'revert' && revision) {
      // Restore slides to the state before this edit
      await updatePresentation(presId, { slides: revision.slidesBefore })
      // Remove this revision and everything after it
      await clearRevisions(presId, revision.timestamp)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('[revisions POST]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
