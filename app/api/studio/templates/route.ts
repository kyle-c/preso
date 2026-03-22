import { NextRequest, NextResponse } from 'next/server'
import { getUserTemplates, createTemplate, deleteTemplate } from '@/lib/studio-db'
import { getServerSession } from '@/lib/studio-auth'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const templates = await getUserTemplates(session.userId)
    return NextResponse.json({ templates })
  } catch (err) {
    console.error('[studio/templates GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, sections, sourcePresId } = body

    if (!title || !sections || !Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json({ error: 'Title and at least one section are required' }, { status: 400 })
    }

    const template = await createTemplate(
      session.userId,
      title,
      description || '',
      sections,
      sourcePresId || '',
    )

    return NextResponse.json({ template }, { status: 201 })
  } catch (err) {
    console.error('[studio/templates POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 })
    }

    await deleteTemplate(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[studio/templates DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
