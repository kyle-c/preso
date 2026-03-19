import { NextRequest, NextResponse } from 'next/server'
import {
  getUserPresentations,
  getUserSharedPresentations,
  getPresentationsSharedWithEmail,
  createPresentation,
} from '@/lib/studio-db'
import { getServerSession } from '@/lib/studio-auth'
import { getCommentCounts } from '@/lib/redis-comments'
import { createPresentationSchema } from '@/lib/studio-schemas'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const tab = req.nextUrl.searchParams.get('tab') || 'mine'

    let presentations: any[]
    if (tab === 'shared-by-me') {
      presentations = await getUserSharedPresentations(session.userId)
    } else if (tab === 'shared-with-me') {
      presentations = await getPresentationsSharedWithEmail(session.user.email)
    } else if (tab === 'archived') {
      const all = await getUserPresentations(session.userId)
      presentations = all.filter((p: any) => p.archived)
    } else {
      const all = await getUserPresentations(session.userId)
      presentations = all.filter((p: any) => !p.archived)
    }

    // Enrich with comment counts
    const deckIds = presentations.map((p: any) => p.id)
    const commentCounts = await getCommentCounts(deckIds)
    const enriched = presentations.map((p: any) => ({
      ...p,
      commentCount: commentCounts[p.id] ?? 0,
    }))

    return NextResponse.json({ presentations: enriched })
  } catch (err) {
    console.error('[studio/presentations GET]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const raw = await req.json()
    const parsed = createPresentationSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { title, prompt, slides, document, provider: prov, model: mod } = parsed.data
    const presentation = await createPresentation(
      session.userId,
      title,
      prompt,
      slides,
      prov,
      mod,
      document ?? null,
    )

    return NextResponse.json({ presentation }, { status: 201 })
  } catch (err) {
    console.error('[studio/presentations POST]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
