import { NextRequest, NextResponse } from 'next/server'
import {
  getPresentation,
  updatePresentation,
  deletePresentation,
} from '@/lib/studio-db'
import { getServerSession } from '@/lib/studio-auth'
import { updatePresentationSchema } from '@/lib/studio-schemas'

export const runtime = 'nodejs'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await context.params
    const presentation = await getPresentation(id)

    if (!presentation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (presentation.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ presentation })
  } catch (err) {
    console.error('[studio/presentations/[id] GET]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await context.params
    const existing = await getPresentation(id)

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const raw = await req.json()
    const parsed = updatePresentationSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const updated = await updatePresentation(id, parsed.data)
    return NextResponse.json({ presentation: updated })
  } catch (err) {
    console.error('[studio/presentations/[id] PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await context.params
    const existing = await getPresentation(id)

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deletePresentation(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[studio/presentations/[id] DELETE]', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
