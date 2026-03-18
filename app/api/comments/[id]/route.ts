import { NextRequest, NextResponse } from 'next/server'
import { updateComment, deleteComment, addReply, deleteReply } from '@/lib/redis-comments'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json() as {
      deckId: string
      text?: string
      flaggedForRebuild?: boolean
      resolved?: boolean
      resolvedBy?: string
      reply?: { name: string; text: string }
      deleteReplyId?: string
    }
    if (!body.deckId) return NextResponse.json({ error: 'Missing deckId' }, { status: 400 })

    if (body.reply) {
      await addReply(body.deckId, id, body.reply)
      return NextResponse.json({ ok: true })
    }

    if (body.deleteReplyId) {
      await deleteReply(body.deckId, id, body.deleteReplyId)
      return NextResponse.json({ ok: true })
    }

    const patch: Parameters<typeof updateComment>[2] = {}
    if (body.text !== undefined) patch.text = body.text
    if (body.flaggedForRebuild !== undefined) patch.flaggedForRebuild = body.flaggedForRebuild
    if (body.resolved !== undefined) {
      patch.resolved = body.resolved
      patch.resolvedAt = body.resolved ? Date.now() : undefined
      patch.resolvedBy = body.resolved ? (body.resolvedBy ?? undefined) : undefined
    }

    const updated = await updateComment(body.deckId, id, patch)
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    console.error('[comments PATCH]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deckId = req.nextUrl.searchParams.get('deck')
  if (!deckId) return NextResponse.json({ error: 'Missing deck param' }, { status: 400 })
  try {
    await deleteComment(deckId, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[comments DELETE]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}
