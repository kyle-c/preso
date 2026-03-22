'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════ */
/*                   AUDIENCE ADAPTATION                       */
/*                                                              */
/*  Takes an existing presentation and navigates to /create    */
/*  with an adapt prompt, triggering the full generation       */
/*  canvas experience (tile view + animated cursors).          */
/* ═══════════════════════════════════════════════════════════ */

const AUDIENCES = [
  {
    id: 'board',
    label: 'Board / Executives',
    slides: '5-8',
    tone: 'High-level strategic. Lead with outcomes and metrics. No implementation details.',
    icon: '🏛',
  },
  {
    id: 'investors',
    label: 'Investors',
    slides: '10-14',
    tone: 'Growth narrative. Market size, traction, unit economics, the ask. Compelling and data-driven.',
    icon: '📈',
  },
  {
    id: 'eng',
    label: 'Engineering Team',
    slides: '12-18',
    tone: 'Technical depth. Architecture, data flows, trade-offs, timeline. Show the how, not just the what.',
    icon: '⚙',
  },
  {
    id: 'all-hands',
    label: 'All-Hands / Company',
    slides: '8-12',
    tone: 'Inspiring and inclusive. Celebrate wins, acknowledge challenges, rally around the mission. Accessible to all roles.',
    icon: '🎤',
  },
  {
    id: 'customers',
    label: 'Customers / Partners',
    slides: '6-10',
    tone: 'Value-focused. Benefits, use cases, success stories. No internal jargon.',
    icon: '🤝',
  },
]

interface AdaptAudienceProps {
  presentationId: string
  slides: any[]
  title: string
  provider: string
  apiKey: string
  model: string
  className?: string
  onOpenChange?: (open: boolean) => void
}

export function AdaptAudienceButton({ presentationId, slides, title, provider, apiKey, model, className, onOpenChange }: AdaptAudienceProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
        onOpenChange?.(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onOpenChange])

  const toggleMenu = useCallback(() => {
    if (open) {
      setOpen(false)
      onOpenChange?.(false)
      return
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 8, left: Math.max(8, rect.left - 200) })
    }
    setOpen(true)
    onOpenChange?.(true)
  }, [open, onOpenChange])

  const handleAdapt = useCallback((audience: typeof AUDIENCES[0]) => {
    // Build condensed source context
    const sourceContext = slides.map((s, i) =>
      `Slide ${i + 1} (${s.type}, ${s.bg}): ${s.title}${s.subtitle ? ' — ' + s.subtitle : ''}${s.body ? '\n' + s.body.substring(0, 200) : ''}${s.bullets ? '\n• ' + s.bullets.map((b: any) => b.text).join('\n• ') : ''}`
    ).join('\n\n')

    const adaptPrompt = `Adapt this presentation for a ${audience.label} audience.

SOURCE PRESENTATION: "${title}"
${sourceContext}

TARGET AUDIENCE: ${audience.label}
TARGET SLIDE COUNT: ${audience.slides} slides
TONE: ${audience.tone}

Create a NEW presentation adapted for this audience. Preserve the core message and data from the source, but restructure the narrative, adjust the detail level, and rewrite the copy for this specific audience. This is NOT a summary — it's a targeted re-presentation of the same material.`

    // Store adapt data in sessionStorage for the create page to pick up
    try {
      sessionStorage.setItem('felix-adapt', JSON.stringify({
        prompt: adaptPrompt,
        audience: audience.label,
        sourceTitle: title,
      }))
    } catch {}

    setOpen(false)
    onOpenChange?.(false)

    // Navigate to create page — it will detect the adapt data and auto-generate
    router.push('/create?adapt=1')
  }, [slides, title, router, onOpenChange])

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={toggleMenu}
        className={cn('inline-flex items-center gap-1.5 transition-colors', className)}
        title="Adapt this deck for a different audience"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        <span className="text-xs font-medium hidden sm:inline">Adapt</span>
      </button>

      {open && menuPos && (
        <div
          ref={menuRef}
          className="fixed w-72 bg-slate-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
        >
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Adapt for audience</p>
          </div>
          {AUDIENCES.map((audience) => (
            <button
              key={audience.id}
              type="button"
              onClick={() => handleAdapt(audience)}
              className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors flex items-start gap-2.5"
            >
              <span className="text-sm mt-0.5">{audience.icon}</span>
              <div>
                <p className="text-xs font-medium text-white">{audience.label}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{audience.slides} slides · {audience.tone.split('.')[0]}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
