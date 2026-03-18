'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SlideData } from './slide-renderer'

/* ─────────────────────── Types ─────────────────────── */

export interface PresentationCardProps {
  id: string
  title: string
  slideCount: number
  model: string
  createdAt: number
  firstSlide?: SlideData | null
  onDelete?: (id: string) => void
  selectable?: boolean
  selected?: boolean
  onSelect?: (id: string) => void
  ownerName?: string
  commentCount?: number
}

/* ─────────────────────── Helpers ─────────────────────── */

function formatModel(model: string): string {
  const name = model.includes('/') ? model.split('/').pop()! : model
  return name
    .replace('claude-', 'Claude ')
    .replace('gemini-', 'Gemini ')
    .replace('gpt-', 'GPT-')
    .replace('deepseek-', 'DeepSeek ')
}

/** Background + text colors matching the slide renderer */
function slideColors(bg?: 'dark' | 'light' | 'brand') {
  switch (bg) {
    case 'brand':
      return { container: 'bg-turquoise', text: 'text-slate-950', muted: 'text-slate-950/50', accent: '#082422', badgeBg: 'rgba(8,36,34,0.15)', badgeText: '#082422', overlayBg: 'bg-slate-950/20', overlayText: 'text-slate-950/70', deleteBg: 'bg-slate-950/20 hover:bg-red-500/80', deleteText: 'text-slate-950/60 hover:text-white' }
    case 'light':
      return { container: 'bg-stone', text: 'text-foreground', muted: 'text-muted-foreground', accent: '#2BF2F1', badgeBg: 'rgba(43,242,241,1)', badgeText: '#082422', overlayBg: 'bg-slate-950/10', overlayText: 'text-slate-950/60', deleteBg: 'bg-slate-950/10 hover:bg-red-500/80', deleteText: 'text-slate-950/50 hover:text-white' }
    case 'dark':
    default:
      return { container: 'bg-slate-950', text: 'text-white', muted: 'text-white/50', accent: '#2BF2F1', badgeBg: 'rgba(43,242,241,0.2)', badgeText: '#2BF2F1', overlayBg: 'bg-white/10', overlayText: 'text-white/60', deleteBg: 'bg-white/10 hover:bg-red-500/80', deleteText: 'text-white/60 hover:text-white' }
  }
}

/* ─────────────────────── Component ─────────────────────── */

export function PresentationCard({
  id,
  title,
  slideCount,
  model,
  createdAt,
  firstSlide,
  onDelete,
  selectable,
  selected,
  onSelect,
  ownerName,
  commentCount,
}: PresentationCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.(id)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (selectable && onSelect) {
      e.preventDefault()
      onSelect(id)
    }
  }

  // createdAt is Unix seconds — convert to milliseconds for Date
  const timestamp = createdAt > 1e12 ? createdAt : createdAt * 1000
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

  const slide = firstSlide ?? null
  const colors = slideColors(slide?.bg)

  const Wrapper = selectable ? 'div' : Link
  const wrapperProps = selectable
    ? { onClick: handleClick, className: 'block group cursor-pointer' }
    : { href: `/create/${id}`, className: 'block group' }

  return (
    <Wrapper
      {...(wrapperProps as any)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'bg-white border rounded-2xl overflow-hidden transition-all duration-200',
          selected ? 'border-turquoise ring-2 ring-turquoise/40 shadow-md' : 'border-border',
          isHovered ? 'shadow-md' : 'shadow-sm',
        )}
      >
        {/* Slide preview thumbnail (16:9) */}
        <div className={cn('relative aspect-video overflow-hidden', colors.container)}>
          {/* Selection checkbox */}
          {selectable && (
            <div className="absolute top-2 left-2 z-20">
              <div className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                selected
                  ? 'bg-turquoise border-turquoise'
                  : 'border-white/40 bg-white/10 backdrop-blur-sm',
              )}>
                {selected && (
                  <svg className="w-3 h-3 text-slate-950" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6L5 8.5L9.5 3.5" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Badge */}
          {slide?.badge && (
            <div className="absolute top-[8%] left-[6%] z-10">
              <span
                className="px-2 py-0.5 rounded-full text-[7px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: colors.badgeBg, color: colors.badgeText }}
              >
                {slide.badge}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <h3 className={cn(
              'font-display font-bold text-center text-sm sm:text-base lg:text-lg leading-tight line-clamp-3',
              colors.text,
            )}>
              {slide?.title ?? title}
            </h3>
          </div>

          {/* Subtitle */}
          {slide?.subtitle && (
            <div className="absolute bottom-[18%] inset-x-[8%]">
              <p className={cn('text-[10px] text-center leading-tight line-clamp-2', colors.muted)}>
                {slide.subtitle}
              </p>
            </div>
          )}

          {/* Decorative corner accent */}
          <div className="absolute top-3 left-3">
            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent, opacity: 0.4 }} />
          </div>

          {/* Bullet indicators (for bullet/content slides) */}
          {slide?.bullets && slide.bullets.length > 0 && (
            <div className="absolute bottom-[10%] left-[8%] flex gap-1">
              {slide.bullets.slice(0, 5).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.accent, opacity: 0.4 }} />
              ))}
            </div>
          )}

          {/* Card indicators (for cards slides) */}
          {slide?.cards && slide.cards.length > 0 && (
            <div className="absolute bottom-[10%] inset-x-[8%] flex gap-1">
              {slide.cards.slice(0, 4).map((card, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-sm" style={{ backgroundColor: card.titleColor, opacity: 0.3 }} />
              ))}
            </div>
          )}

          {/* Delete button */}
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className={cn(
                'absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm',
                colors.deleteBg,
                colors.deleteText,
                isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0',
                'max-sm:opacity-100', // Always visible on touch devices
              )}
              aria-label={`Delete ${title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Slide count badge */}
          <div className="absolute bottom-2 right-2">
            <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium backdrop-blur-sm', colors.overlayBg, colors.overlayText)}>
              {slideCount} slides
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-display font-bold text-foreground text-sm truncate">
              {title}
            </h4>
            {!!commentCount && commentCount > 0 && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                {commentCount}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {slideCount} slides &middot; {formatModel(model)} &middot; {timeAgo}
            {ownerName && <> &middot; by {ownerName}</>}
          </p>
        </div>
      </div>
    </Wrapper>
  )
}
