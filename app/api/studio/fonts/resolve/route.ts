import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { resolveFonts } from '@/lib/font-resolver'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { fonts } = await req.json()
    if (!fonts || !Array.isArray(fonts)) {
      return NextResponse.json({ error: 'fonts array required' }, { status: 400 })
    }

    const results = await resolveFonts(fonts)
    return NextResponse.json({ results })
  } catch (err) {
    console.error('[studio/fonts/resolve]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
