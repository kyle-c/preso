import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import {
  rateSlide,
  removeRating,
  getRatingsForSource,
  getExemplarSlides,
  getAntiExemplarSlides,
} from '@/lib/studio-db'
import { ratingSchema, ratingQuerySchema } from '@/lib/studio-schemas'

export const runtime = 'nodejs'

/**
 * GET /api/studio/ratings?source=jose
 * Returns all ratings for a given source (deck ID or named deck)
 *
 * GET /api/studio/ratings?exemplars=true&type=cards&limit=5
 * Returns top-rated exemplar slides, optionally by type
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = req.nextUrl

    // Exemplar query mode
    if (searchParams.get('exemplars') === 'true') {
      const slideType = searchParams.get('type') || undefined
      const limit = parseInt(searchParams.get('limit') || '5', 10)
      const [good, bad] = await Promise.all([
        getExemplarSlides(slideType, limit),
        getAntiExemplarSlides(Math.ceil(limit / 2)),
      ])
      return NextResponse.json({ good, bad })
    }

    // Source query mode
    const sourceParam = searchParams.get('source')
    const sourceResult = ratingQuerySchema.safeParse({ source: sourceParam })
    if (!sourceResult.success) {
      return NextResponse.json({ error: 'Invalid source parameter' }, { status: 400 })
    }

    const ratings = await getRatingsForSource(sourceResult.data.source)
    // Convert Map to plain object
    const obj: Record<number, 1 | -1> = {}
    ratings.forEach((v, k) => { obj[k] = v })

    return NextResponse.json({ ratings: obj })
  } catch (err) {
    console.error('[studio/ratings GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/studio/ratings
 * Body: { source, slideIndex, slideType, bg, rating: 1|-1, slideData, note? }
 *
 * Or to remove: { source, slideIndex, remove: true }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const raw = await req.json()
    const parsed = ratingSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { source, slideIndex, remove, slideType, bg, rating, slideData, note } = parsed.data

    // Remove rating
    if (remove) {
      await removeRating(source, slideIndex)
      return NextResponse.json({ ok: true })
    }

    // Add/update rating
    if (!slideType || !bg || (rating !== 1 && rating !== -1)) {
      return NextResponse.json({ error: 'Invalid rating data' }, { status: 400 })
    }

    const result = await rateSlide(slideType, bg, rating, slideData ?? {}, source, slideIndex, note)
    return NextResponse.json({ rating: result })
  } catch (err) {
    console.error('[studio/ratings POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
