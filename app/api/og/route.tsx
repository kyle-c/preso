import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { getShareRecord, getPresentation } from '@/lib/studio-db'

export const runtime = 'nodejs'

const BG_COLORS: Record<string, string> = {
  dark: '#082422',
  light: '#EFEBE7',
  brand: '#2BF2F1',
}

const TEXT_COLORS: Record<string, { primary: string; muted: string; badge: string; badgeBg: string }> = {
  dark: { primary: '#FFFFFFEE', muted: '#FFFFFF88', badge: '#2BF2F1', badgeBg: '#2BF2F133' },
  light: { primary: '#082422DD', muted: '#08242288', badge: '#082422', badgeBg: '#08242215' },
  brand: { primary: '#082422EE', muted: '#08242288', badge: '#082422', badgeBg: '#08242220' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token')
  const slideParam = searchParams.get('slide')

  if (!token) {
    return new Response('Missing token', { status: 400 })
  }

  const record = await getShareRecord(token)
  if (!record) {
    return new Response('Not found', { status: 404 })
  }

  const presentation = await getPresentation(record.presentationId)
  if (!presentation || !presentation.slides?.length) {
    return new Response('Not found', { status: 404 })
  }

  const slideIndex = slideParam ? Math.min(parseInt(slideParam, 10) || 0, presentation.slides.length - 1) : 0
  const slide = presentation.slides[slideIndex]
  const bg = slide.bg || 'dark'
  const colors = TEXT_COLORS[bg] || TEXT_COLORS.dark
  const bgColor = BG_COLORS[bg] || BG_COLORS.dark

  // Extract content for the OG card
  const badge = slide.badge || ''
  const title = slide.title || presentation.title || 'Untitled'
  const subtitle = slide.subtitle || slide.body || ''
  const slideCount = presentation.slides.length
  const bulletCount = Math.min((slide.bullets?.length || 0), 4)
  const bullets = slide.bullets?.slice(0, bulletCount) || []
  const hasCards = slide.cards && slide.cards.length > 0

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bgColor,
          padding: '60px 70px',
          position: 'relative',
        }}
      >
        {/* Top bar: badge + slide count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          {badge ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: colors.badgeBg,
                color: colors.badge,
                fontSize: 18,
                fontWeight: 700,
                padding: '6px 16px',
                borderRadius: 999,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </div>
          ) : (
            <div />
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: colors.muted,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            <span>{slideCount} slides</span>
            {slideIndex > 0 && <span style={{ opacity: 0.6 }}>· Slide {slideIndex + 1}</span>}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {/* Title */}
          <div
            style={{
              fontSize: title.length > 50 ? 48 : title.length > 30 ? 56 : 68,
              fontWeight: 900,
              color: colors.primary,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: subtitle || bullets.length || hasCards ? '24px' : '0',
              maxWidth: '900px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </div>

          {/* Subtitle / body */}
          {subtitle && !bullets.length && !hasCards && (
            <div
              style={{
                fontSize: 24,
                color: colors.muted,
                lineHeight: 1.5,
                maxWidth: '750px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {subtitle.replace(/\*\*/g, '')}
            </div>
          )}

          {/* Bullets */}
          {bullets.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {bullets.map((b: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.badge,
                      opacity: 0.6,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 20, color: colors.muted, lineHeight: 1.4 }}>
                    {(b.text || '').replace(/\*\*/g, '').slice(0, 80)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Cards preview */}
          {hasCards && (
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {slide.cards.slice(0, 3).map((card: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    backgroundColor: bg === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    borderRadius: 16,
                    padding: '20px',
                    border: `1px solid ${bg === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: card.titleColor || colors.primary, marginBottom: '6px' }}>
                    {card.title}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: colors.muted,
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {(card.body || '').replace(/\*\*/g, '').slice(0, 100)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar: branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                backgroundColor: '#2BF2F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
                color: '#082422',
              }}
            >
              F
            </div>
            <span style={{ fontSize: 15, color: colors.muted, fontWeight: 500 }}>Felix Studio</span>
          </div>
          {presentation.title && slideIndex === 0 && (
            <span style={{ fontSize: 14, color: colors.muted, opacity: 0.6 }}>
              {presentation.title.slice(0, 60)}
            </span>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
