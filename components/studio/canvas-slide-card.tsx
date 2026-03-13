'use client'

import React, { memo } from 'react'
import type { SlideData } from './slide-renderer'

/* ─── Phase type (shared with generation-canvas) ─── */
export type Phase = 'placeholders' | 'colors' | 'headlines' | 'details' | 'complete'

/* ─── Background color map ─── */
const BG_COLORS: Record<SlideData['bg'], string> = {
  dark: '#020617',    // slate-950
  light: '#EFEBE7',   // stone
  brand: '#2BF2F1',   // turquoise
}

const TEXT_COLORS: Record<SlideData['bg'], { primary: string; muted: string }> = {
  dark: { primary: 'rgba(255,255,255,0.9)', muted: 'rgba(255,255,255,0.4)' },
  light: { primary: 'rgba(0,0,0,0.85)', muted: 'rgba(0,0,0,0.4)' },
  brand: { primary: 'rgba(8,36,34,0.9)', muted: 'rgba(8,36,34,0.5)' },
}

/* ─── Component ─── */

interface CanvasSlideCardProps {
  index: number
  slide: SlideData | null
  phase: Phase
  entranceDelay: number
  onClick?: () => void
}

export const CanvasSlideCard = memo(function CanvasSlideCard({
  index,
  slide,
  phase,
  entranceDelay,
  onClick,
}: CanvasSlideCardProps) {
  const phaseNum = ['placeholders', 'colors', 'headlines', 'details', 'complete'].indexOf(phase)
  const bg = slide?.bg ?? 'dark'
  const colors = TEXT_COLORS[bg]

  const showColor = phaseNum >= 1 && slide
  const showHeadline = phaseNum >= 2 && slide
  const showDetails = phaseNum >= 3 && slide
  const isComplete = phaseNum >= 4

  return (
    <div
      className="w-full aspect-video rounded-2xl overflow-hidden relative"
      style={{
        animation: `canvas-card-enter 500ms ease-out ${entranceDelay}ms both`,
        backgroundColor: showColor ? BG_COLORS[bg] : '#0a0a0a',
        transition: 'background-color 600ms ease-out, box-shadow 600ms ease-out',
        transitionDelay: `${index * 80}ms`,
        willChange: 'opacity, background-color, transform',
        cursor: isComplete ? 'pointer' : 'default',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: showColor
          ? `0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`,
      }}
      onClick={isComplete ? onClick : undefined}
    >
      {/* Placeholder shimmer when no data yet */}
      {!slide && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
              animation: 'canvas-shimmer 2s ease-in-out infinite',
              animationDelay: `${index * 200}ms`,
            }}
          />
        </div>
      )}

      {/* Badge */}
      {showHeadline && slide.badge && (
        <div
          className="absolute top-3 left-4"
          style={{
            animation: `canvas-content-fade 400ms ease-out ${index * 60}ms both`,
          }}
        >
          <span
            className="px-2 py-0.5 rounded-full text-[7px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: bg === 'dark' ? 'rgba(43,242,241,0.2)' : bg === 'brand' ? 'rgba(8,36,34,0.15)' : 'rgba(43,242,241,1)',
              color: bg === 'dark' ? '#2BF2F1' : bg === 'brand' ? '#082422' : '#082422',
            }}
          >
            {slide.badge}
          </span>
        </div>
      )}

      {/* Title */}
      {showHeadline && (
        <div
          className="absolute inset-x-4 top-[28%]"
          style={{
            animation: `canvas-content-fade 400ms ease-out ${index * 60}ms both`,
          }}
        >
          <h3
            className="font-display font-black text-[11px] leading-tight"
            style={{
              color: colors.primary,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {slide.title}
          </h3>
        </div>
      )}

      {/* Details: subtitle, body preview, bullet indicators, image */}
      {showDetails && (
        <div
          className="absolute inset-x-4 bottom-6"
          style={{
            animation: `canvas-content-fade 400ms ease-out ${index * 40}ms both`,
          }}
        >
          {slide.subtitle && (
            <p
              className="text-[7px] leading-tight mb-1"
              style={{
                color: colors.muted,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {slide.subtitle}
            </p>
          )}
          {slide.body && (
            <p
              className="text-[6px] leading-tight mb-1"
              style={{
                color: colors.muted,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {slide.body}
            </p>
          )}
          {slide.bullets && (
            <div className="flex gap-[3px] mt-1">
              {slide.bullets.slice(0, 6).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: bg === 'dark' ? '#2BF2F1' : bg === 'brand' ? '#082422' : '#2BF2F1', opacity: 0.5 }}
                />
              ))}
            </div>
          )}
          {slide.cards && (
            <div className="flex gap-1 mt-1">
              {slide.cards.slice(0, 4).map((card, i) => (
                <div
                  key={i}
                  className="h-2 flex-1 rounded-sm"
                  style={{ backgroundColor: card.titleColor, opacity: 0.3 }}
                />
              ))}
            </div>
          )}
          {slide.imageUrl && (
            <div className="absolute bottom-0 right-0 w-8 h-8 opacity-30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.imageUrl} alt="" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      )}

      {/* Slide number */}
      <div
        className="absolute bottom-2 right-3 text-[8px] font-mono"
        style={{ color: showColor ? colors.muted : 'rgba(255,255,255,0.15)' }}
      >
        {index + 1}
      </div>

      {/* Hover overlay for complete phase */}
      {isComplete && (
        <div className="absolute inset-0 bg-white/0 hover:bg-white/[0.06] transition-colors duration-200 rounded-2xl" />
      )}
    </div>
  )
}, (prev, next) =>
  prev.slide === next.slide &&
  prev.phase === next.phase &&
  prev.onClick === next.onClick &&
  prev.index === next.index
)
