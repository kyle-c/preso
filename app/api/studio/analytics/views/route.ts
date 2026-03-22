import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { getPresentation, getShareConfigForPresentation } from '@/lib/studio-db'
import { getViewerStats, getViewerSessions } from '@/lib/studio-analytics'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const presId = req.nextUrl.searchParams.get('presId')
    if (!presId) {
      return NextResponse.json({ error: 'presId is required' }, { status: 400 })
    }

    // Verify ownership
    const pres = await getPresentation(presId)
    if (!pres || pres.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Get share config to find the share token
    const shareConfig = await getShareConfigForPresentation(presId)
    if (!shareConfig) {
      return NextResponse.json({
        stats: {},
        sessions: [],
        totalViews: 0,
        uniqueSessions: 0,
        avgDwellMs: 0,
        completionRate: 0,
      })
    }

    const [stats, sessions] = await Promise.all([
      getViewerStats(shareConfig.token),
      getViewerSessions(shareConfig.token),
    ])

    // Compute summary metrics
    const totalViews = Object.values(stats).reduce((sum, s) => sum + s.viewCount, 0)
    const totalDwell = Object.values(stats).reduce((sum, s) => sum + s.totalDwell, 0)
    const uniqueSessions = sessions.length
    const completedSessions = sessions.filter(s => s.completed).length
    const completionRate = uniqueSessions > 0 ? Math.round((completedSessions / uniqueSessions) * 100) : 0
    const avgDwellMs = uniqueSessions > 0 ? Math.round(totalDwell / uniqueSessions) : 0

    return NextResponse.json({
      stats,
      sessions: sessions.map(s => ({
        sessionId: s.sessionId,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        slidesViewed: s.slidesViewed,
        totalSlides: s.totalSlides,
        totalDwellMs: s.totalDwellMs,
        completed: s.completed,
      })),
      totalViews,
      uniqueSessions,
      avgDwellMs,
      completionRate,
    })
  } catch (err) {
    console.error('[studio/analytics/views GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
