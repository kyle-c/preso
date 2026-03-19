import { NextRequest, NextResponse } from 'next/server'
import { updateComment, deleteComment, addReply, deleteReply } from '@/lib/redis-comments'
import { commentLimiter, checkRateLimit } from '@/lib/studio-ratelimit'
import { updateCommentSchema } from '@/lib/studio-schemas'
import { getRequestIp } from '@/lib/studio-audit'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const ip = getRequestIp(req.headers)
    const rateLimited = await checkRateLimit(commentLimiter, ip)
    if (rateLimited) return rateLimited

    const raw = await req.json()
    const parsed = updateCommentSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const body = parsed.data

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
  try {
    const ip = getRequestIp(req.headers)
    const rateLimited = await checkRateLimit(commentLimiter, ip)
    if (rateLimited) return rateLimited

    const deckId = req.nextUrl.searchParams.get('deck')
    if (!deckId) return NextResponse.json({ error: 'Missing deck param' }, { status: 400 })

    await deleteComment(deckId, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[comments DELETE]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}
