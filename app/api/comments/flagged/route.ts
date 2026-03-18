import { NextRequest, NextResponse } from 'next/server'
import { getFlaggedAsMarkdown, getComments, setComments } from '@/lib/redis-comments'

export const runtime = 'nodejs'

// GET /api/comments/flagged?deck=felix-investor
// Returns flagged comments as plain markdown — paste into Claude Code for deck rebuild
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
// Removes all flagged comments — call after a rebuild
export async function DELETE(req: NextRequest) {
  const deckId = req.nextUrl.searchParams.get('deck')
  if (!deckId) return NextResponse.json({ error: 'Missing deck param' }, { status: 400 })
  try {
    const comments = await getComments(deckId)
    await setComments(deckId, comments.filter(c => !c.flaggedForRebuild))
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[comments/flagged DELETE]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}
