'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SlideData } from './slide-renderer'

interface SlideRatingProps {
  slide: SlideData
  slideIndex: number
  source: string // deck ID or named deck like 'jose'
  dark?: boolean
}

export function SlideRating({ slide, slideIndex, source, dark }: SlideRatingProps) {
  const [rating, setRating] = useState<1 | -1 | null>(null)
  const [saving, setSaving] = useState(false)

  // Load existing rating
  useEffect(() => {
    fetch(`/api/studio/ratings?source=${encodeURIComponent(source)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.ratings?.[slideIndex] !== undefined) {
          setRating(data.ratings[slideIndex])
        }
      })
      .catch(() => {})
  }, [source, slideIndex])

  const handleRate = useCallback(async (newRating: 1 | -1) => {
    setSaving(true)
    try {
      if (rating === newRating) {
        // Toggle off
        await fetch('/api/studio/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, slideIndex, remove: true }),
        })
        setRating(null)
      } else {
        await fetch('/api/studio/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source,
            slideIndex,
            slideType: slide.type,
            bg: slide.bg,
            rating: newRating,
            slideData: slide,
          }),
        })
        setRating(newRating)
      }
    } catch {
      // Silently fail
    } finally {
      setSaving(false)
    }
  }, [rating, source, slideIndex, slide])

  const base = dark
    ? 'bg-white/10 border-white/10 text-white/50 hover:text-white hover:bg-white/20'
    : 'bg-slate-950/5 border-slate-950/5 text-slate-950/40 hover:text-slate-950 hover:bg-slate-950/10'

  const activeUp = dark
    ? 'bg-cactus/20 border-cactus/30 text-cactus'
    : 'bg-cactus/15 border-cactus/25 text-cactus'

  const activeDown = dark
    ? 'bg-papaya/20 border-papaya/30 text-papaya'
    : 'bg-papaya/15 border-papaya/25 text-papaya'

  return (
    <div
      className="flex items-center gap-1.5 transition-opacity duration-200"
      style={{ opacity: saving ? 0.5 : 1 }}
    >
      <button
        type="button"
        onClick={() => handleRate(1)}
        disabled={saving}
        className={`p-1.5 rounded-full border backdrop-blur-sm transition-all duration-150 ${
          rating === 1 ? activeUp : base
        }`}
        aria-label="Good slide"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => handleRate(-1)}
        disabled={saving}
        className={`p-1.5 rounded-full border backdrop-blur-sm transition-all duration-150 ${
          rating === -1 ? activeDown : base
        }`}
        aria-label="Bad slide"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-1.302 4.665c-.245.404.028.96.5.96h1.053c.832 0 1.612-.453 1.918-1.227.306-.774.587-1.588.831-2.398a11.95 11.95 0 002.649-7.521c0-.435-.023-.863-.068-1.285C20.072 2.694 19.153 2 18.128 2h-3.126c-.618 0-.991.724-.725 1.282A7.471 7.471 0 0015 6.75a4.5 4.5 0 01-.322 1.672c-.303.759-.93 1.331-1.653 1.715a9.04 9.04 0 00-2.861 2.4c-.498.634-1.225 1.08-2.031 1.08H5.904m8.346-8.867L13.48 5.25c-.483 0-.964.078-1.423.23l-3.114 1.04a4.501 4.501 0 01-1.423.23H5.904M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
        </svg>
      </button>
      {rating !== null && (
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
          rating === 1
            ? (dark ? 'text-cactus' : 'text-cactus')
            : (dark ? 'text-papaya' : 'text-papaya')
        }`}>
          {rating === 1 ? 'Exemplar' : 'Avoid'}
        </span>
      )}
    </div>
  )
}

/** Hook to load all ratings for a source in one call */
export function useSlideRatings(source: string) {
  const [ratings, setRatings] = useState<Map<number, 1 | -1>>(new Map())

  useEffect(() => {
    fetch(`/api/studio/ratings?source=${encodeURIComponent(source)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.ratings) {
          const map = new Map<number, 1 | -1>()
          for (const [k, v] of Object.entries(data.ratings)) {
            map.set(parseInt(k, 10), v as 1 | -1)
          }
          setRatings(map)
        }
      })
      .catch(() => {})
  }, [source])

  return ratings
}
