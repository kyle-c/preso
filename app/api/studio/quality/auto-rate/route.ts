import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { getPresentation } from '@/lib/studio-db'
import { autoRatePresentation } from '@/lib/slide-quality-loop'

export const runtime = 'nodejs'

/**
 * POST /api/studio/quality/auto-rate
 * Runs the Slide Coach on a presentation and auto-rates slides
 * as exemplars (clean) or anti-exemplars (errors).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { presId } = await req.json()
    if (!presId) return NextResponse.json({ error: 'presId required' }, { status: 400 })

    const pres = await getPresentation(presId)
    if (!pres || pres.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const result = await autoRatePresentation(presId, pres.slides)
    console.log(`[quality/auto-rate] ${presId}: score=${result.score}, promoted=${result.promoted}, demoted=${result.demoted}`)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[quality/auto-rate]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
