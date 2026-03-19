import { NextRequest, NextResponse } from 'next/server'
import { getFlaggedAsMarkdown, getComments, setComments } from '@/lib/redis-comments'
import { commentLimiter, checkRateLimit } from '@/lib/studio-ratelimit'
import { getRequestIp } from '@/lib/studio-audit'

export const runtime = 'nodejs'

// GET /api/comments/flagged?deck=felix-investor
export async function GET(req: NextRequest) {
  const deckId = req.nextUrl.searchParams.get('deck')
  if (!deckId) return NextResponse.json({ error: 'Missing deck param' }, { status: 400 })
  try {
    const markdown = await getFlaggedAsMarkdown(deckId)
    return new NextResponse(markdown, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  } catch (e) {
    console.error('[comments/flagged GET]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}

// DELETE /api/comments/flagged?deck=felix-investor
export async function DELETE(req: NextRequest) {
  try {
    const ip = getRequestIp(req.headers)
    const rateLimited = await checkRateLimit(commentLimiter, ip)
    if (rateLimited) return rateLimited

    const deckId = req.nextUrl.searchParams.get('deck')
    if (!deckId) return NextResponse.json({ error: 'Missing deck param' }, { status: 400 })

    const comments = await getComments(deckId)
    await setComments(deckId, comments.filter(c => !c.flaggedForRebuild))
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[comments/flagged DELETE]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}
