import { NextResponse } from 'next/server'
import { referenceMarkdown } from '@/lib/reference-markdown'

export const dynamic = 'force-dynamic'

export function GET() {
  return new NextResponse(referenceMarkdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
