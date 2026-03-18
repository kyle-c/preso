import { NextRequest, NextResponse } from 'next/server'
import { getComments, addComment } from '@/lib/redis-comments'

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
    const body = await req.json() as {
      deckId: string
      slideIndex: number
      x: number
      y: number
      name: string
      email?: string
      text: string
    }
    if (!body.deckId || !body.name || !body.text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const comment = await addComment(body.deckId, {
      slideIndex: body.slideIndex,
      x: body.x,
      y: body.y,
      name: body.name,
      email: body.email,
      text: body.text,
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (e) {
    console.error('[comments POST]', e)
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 })
  }
}
