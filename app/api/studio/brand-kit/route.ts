import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { getBrandKit, saveBrandKit, deleteBrandKit, parseBrandFile } from '@/lib/brand-kit'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const kit = await getBrandKit(session.userId)
    return NextResponse.json({ brandKit: kit })
  } catch (err) {
    console.error('[studio/brand-kit GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()

    // Fetch brand file from URL
    if (body.fileUrl) {
      try {
        const res = await fetch(body.fileUrl)
        if (!res.ok) return NextResponse.json({ error: `Failed to fetch URL (${res.status})` }, { status: 400 })
        const content = await res.text()
        const contentType = res.headers.get('content-type') || ''
        const urlPath = body.fileUrl.split('?')[0]

        // Check if the response is an HTML page with no extractable design data
        // (e.g., a client-rendered SPA like a Next.js page)
        const isHtml = contentType.includes('text/html') || content.trimStart().startsWith('<!DOCTYPE') || content.trimStart().startsWith('<html')
        if (isHtml) {
          // Check if the HTML has any hex colors at all — if not, it's a client-rendered page
          const hexCount = (content.match(/#[0-9a-fA-F]{6}/g) || []).length
          if (hexCount < 3) {
            return NextResponse.json({
              error: 'This URL returns an HTML page with no extractable design data. It may be a client-rendered app. Try linking to the raw .json or .md file instead (e.g., use /md instead of /json).'
            }, { status: 400 })
          }
        }

        // Determine file type from URL extension, then content-type, then content sniffing
        let fileName: string
        if (urlPath.endsWith('.json')) {
          fileName = 'brand.json'
        } else if (urlPath.endsWith('.md') || urlPath.endsWith('.markdown')) {
          fileName = 'brand.md'
        } else if (contentType.includes('application/json')) {
          fileName = 'brand.json'
        } else if (content.trimStart().startsWith('{') || content.trimStart().startsWith('[')) {
          fileName = 'brand.json'
        } else {
          // Treat as markdown (including HTML pages with embedded text content)
          fileName = 'brand.md'
        }

        const parsed = parseBrandFile(content, fileName)
        if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 })
        const kit = await saveBrandKit(session.userId, parsed)
        return NextResponse.json({ brandKit: kit }, { status: 201 })
      } catch {
        return NextResponse.json({ error: 'Could not fetch the URL. Check that it\'s accessible.' }, { status: 400 })
      }
    }

    // If uploading a brand file (JSON/MD), parse it first
    if (body.fileContent && body.fileName) {
      const parsed = parseBrandFile(body.fileContent, body.fileName)
      if ('error' in parsed) {
        return NextResponse.json({ error: parsed.error }, { status: 400 })
      }
      const kit = await saveBrandKit(session.userId, parsed)
      return NextResponse.json({ brandKit: kit }, { status: 201 })
    }

    // Direct brand kit object
    if (!body.name) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 })
    }

    const kit = await saveBrandKit(session.userId, body)
    return NextResponse.json({ brandKit: kit }, { status: 201 })
  } catch (err) {
    console.error('[studio/brand-kit POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await deleteBrandKit(session.userId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[studio/brand-kit DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
