'use client'

import { useState, useEffect, useCallback } from 'react'
import { Layers, X, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TemplateSectionSkeleton } from '@/lib/studio-db'

/* ═══════════════════════════════════════════════════════════ */
/*                     TEMPLATE PICKER                         */
/*                                                              */
/*  Shown on the create page — lets users pick a template      */
/*  before generating a new presentation.                      */
/* ═══════════════════════════════════════════════════════════ */

interface TemplateItem {
  id: string
  title: string
  description: string
  slideCount: number
  sections: TemplateSectionSkeleton[]
  createdAt: number
}

interface TemplatePickerProps {
  selected: TemplateItem | null
  onSelect: (template: TemplateItem | null) => void
}

const SLIDE_TYPE_LABELS: Record<string, string> = {
  title: 'Title',
  section: 'Section',
  content: 'Content',
  bullets: 'Bullets',
  'two-column': '2-Column',
  cards: 'Cards',
  quote: 'Quote',
  image: 'Image',
  checklist: 'Checklist',
  closing: 'Closing',
  chart: 'Chart',
}

export function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<TemplateItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const loadTemplates = useCallback(async () => {
    if (loaded) return
    setLoading(true)
    try {
      const res = await fetch('/api/studio/templates')
      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
      }
    } catch {}
    setLoading(false)
    setLoaded(true)
  }, [loaded])

  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch('/api/studio/templates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setTemplates(prev => prev.filter(t => t.id !== id))
      if (selected?.id === id) onSelect(null)
    } catch {}
  }, [selected, onSelect])

  // If selected, show compact pill
  if (selected && !open) {
    return (
      <button
        type="button"
        onClick={() => { setOpen(true); loadTemplates() }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-turquoise/10 text-turquoise text-xs font-medium hover:bg-turquoise/20 transition-colors"
      >
        <Layers className="w-3 h-3" />
        {selected.title}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSelect(null) }}
          className="ml-1 hover:text-white transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(!open); if (!open) loadTemplates() }}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
          open ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        )}
      >
        <Layers className="w-3.5 h-3.5" />
        Templates
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50">
          <div className="mx-auto max-w-xl bg-background border rounded-xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold">Choose a template</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading templates...</div>
              ) : templates.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">No templates yet.</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Save a presentation as a template from the viewer.</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { onSelect(t); setOpen(false) }}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group flex items-start gap-3',
                        selected?.id === t.id && 'bg-turquoise/10',
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{t.title}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">{t.slideCount} slides</span>
                          {selected?.id === t.id && <Check className="w-3.5 h-3.5 text-turquoise shrink-0" />}
                        </div>
                        {t.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {t.sections.slice(0, 8).map((s, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {SLIDE_TYPE_LABELS[s.type] || s.type}
                            </span>
                          ))}
                          {t.sections.length > 8 && (
                            <span className="text-[9px] px-1.5 py-0.5 text-muted-foreground">+{t.sections.length - 8}</span>
                          )}
                        </div>
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleDelete(t.id, e)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleDelete(t.id, e as any) }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <div className="px-4 py-2 border-t bg-muted/50">
                <button
                  type="button"
                  onClick={() => { onSelect(null); setOpen(false) }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                  SAVE AS TEMPLATE BUTTON                    */
/* ═══════════════════════════════════════════════════════════ */

interface SaveAsTemplateProps {
  slides: { type: string; title?: string; bg?: string }[]
  presId: string
  presTitle: string
  className?: string
}

export function SaveAsTemplateButton({ slides, presId, presTitle, className }: SaveAsTemplateProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = useCallback(async () => {
    if (saving || saved) return
    setSaving(true)
    try {
      const sections = slides.map(s => ({
        type: s.type,
        title: s.title,
      }))

      await fetch('/api/studio/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: presTitle,
          description: `${slides.length}-slide template`,
          sections,
          sourcePresId: presId,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    setSaving(false)
  }, [slides, presId, presTitle, saving, saved])

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className={cn(
        'inline-flex items-center gap-1.5 transition-colors',
        saved ? 'text-turquoise' : '',
        className,
      )}
    >
      {saved ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Saved!</span>
        </>
      ) : (
        <>
          <Layers className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{saving ? 'Saving...' : 'Save as Template'}</span>
        </>
      )}
    </button>
  )
}
