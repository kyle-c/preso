import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getShareRecord, getPresentation, resolvePermission, type SharePermission } from '@/lib/studio-db'
import { getServerSession } from '@/lib/studio-auth'
import { SharedPresentationViewer } from './viewer'
import { AccessDenied } from './access-denied'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const record = await getShareRecord(token)

  if (!record) {
    return { title: 'Not Found' }
  }

  const presentation = await getPresentation(record.presentationId)
  if (!presentation) {
    return { title: 'Not Found' }
  }

  const title = presentation.title || 'Presentation'
  const firstSlide = presentation.slides?.[0]
  const description =
    firstSlide?.subtitle ||
    firstSlide?.body?.replace(/\*\*/g, '').slice(0, 160) ||
    presentation.document?.summary ||
    `${presentation.slides?.length || 0} slide presentation created with Felix Studio`

  // Build OG image URL
  const headersList = await headers()
  const host = headersList.get('host') || 'felix-design.vercel.app'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const ogUrl = `${protocol}://${host}/api/og?token=${token}`

  return {
    title: `${title} — Felix Studio`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Felix Studio',
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
  }
}

export default async function SharedPresentationPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { token } = await params
  const sp = await searchParams
  const viewParam = typeof sp.view === 'string' ? sp.view : undefined
  const initialViewMode = viewParam === 'outline' ? 'outline' as const
    : viewParam === 'document' || viewParam === 'doc' ? 'document' as const
    : 'presentation' as const

  const record = await getShareRecord(token)

  if (!record) {
    notFound()
  }

  const presentation = await getPresentation(record.presentationId)
  if (!presentation) {
    notFound()
  }

  // Access control
  let userPermission: SharePermission = record.permission ?? 'viewer'
  let isOwner = false

  if (record.access === 'org' || record.access === 'specific') {
    const session = await getServerSession()

    if (!session) {
      return <AccessDenied reason="auth" />
    }

    isOwner = presentation.userId === session.userId

    if (record.access === 'specific') {
      const userEmail = session.user.email.toLowerCase()
      const isAllowed = record.allowedEmails.includes(userEmail)

      if (!isOwner && !isAllowed) {
        return <AccessDenied reason="not-invited" />
      }
      userPermission = resolvePermission(record, session.user.email)
    }
  } else {
    // Public access — check if logged-in user is owner
    const session = await getServerSession().catch(() => null)
    if (session) {
      isOwner = presentation.userId === session.userId
    }
  }

  // Owners always get full editor access
  if (isOwner) userPermission = 'editor'

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <SharedPresentationViewer
        slides={presentation.slides}
        title={presentation.title}
        deckId={presentation.id}
        document={presentation.document}
        outline={presentation.outline}
        initialViewMode={initialViewMode}
        shareToken={token}
        translations={(presentation as any).translations}
        permission={userPermission}
      />

      {/* Footer */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200]">
        <a
          href="/create"
          className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white/50 hover:text-white/80 hover:bg-white/15 transition-all"
        >
          Made with Felix Studio
        </a>
      </div>
    </div>
  )
}
