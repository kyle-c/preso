import { NextRequest, NextResponse } from 'next/server'
import { getComments, addComment } from '@/lib/redis-comments'
import { commentLimiter, checkRateLimit } from '@/lib/studio-ratelimit'
import { createCommentSchema } from '@/lib/studio-schemas'
import { getRequestIp } from '@/lib/studio-audit'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const deckId = req.nextUrl.searchParams.get('deck')
  if (!deckId) return NextResponse.json({ error: 'Missing deck param' }, { status: 400 })
  try {
    const comments = await getComments(deckId)
    return NextResponse.json(comments)
  } catch (e) {
    console.error('[comments GET]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getRequestIp(req.headers)
    const rateLimited = await checkRateLimit(commentLimiter, ip)
    if (rateLimited) return rateLimited

    const raw = await req.json()
    const parsed = createCommentSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { deckId, slideIndex, x, y, name, email, text } = parsed.data
    const comment = await addComment(deckId, { slideIndex, x, y, name, email, text })
    return NextResponse.json(comment, { status: 201 })
  } catch (e) {
    console.error('[comments POST]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}
