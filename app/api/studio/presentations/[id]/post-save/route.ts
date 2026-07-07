import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import {
  getPresentationForPostSaveJob,
  normalizePostSaveJobRequest,
  runPresentationPostSaveJobs,
} from '@/lib/studio-post-save-jobs'

export const runtime = 'nodejs'
export const maxDuration = 120

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await context.params
    const presentation = await getPresentationForPostSaveJob(id, session.userId)
    if (!presentation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await req.json().catch(() => ({}))
    const jobs = normalizePostSaveJobRequest(body)
    const result = await runPresentationPostSaveJobs(presentation, jobs)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[studio/presentations/[id]/post-save POST]', err)
    return NextResponse.json(
      { error: 'Post-save jobs failed' },
      { status: 500 },
    )
  }
}
