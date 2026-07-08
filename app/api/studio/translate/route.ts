import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { getPresentation } from '@/lib/studio-db'
import { runPresentationTranslationJob } from '@/lib/studio-post-save-jobs'

export const maxDuration = 120

// ---------------------------------------------------------------------------
// POST: Trigger translation for a presentation
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { presentationId } = await req.json()
    if (!presentationId) {
      return NextResponse.json({ error: 'Missing presentationId' }, { status: 400 })
    }

    const pres = await getPresentation(presentationId)
    if (!pres || pres.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(await runPresentationTranslationJob(pres))
  } catch (err) {
    console.error('[studio/translate]', err)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
