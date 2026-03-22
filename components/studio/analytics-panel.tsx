'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Eye, Clock, Users, CheckCircle2, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════ */
/*                   ANALYTICS PANEL                           */
/*                                                              */
/*  Docsend-style view tracking dashboard for shared decks.    */
/*  Shows: total views, unique viewers, avg time, completion   */
/*  rate, and per-slide dwell time heatmap.                    */
/* ═══════════════════════════════════════════════════════════ */

interface SlideStats {
  totalDwell: number
  viewCount: number
}

interface SessionData {
  sessionId: string
  startedAt: number
  endedAt: number
  slidesViewed: number
  totalSlides: number
  totalDwellMs: number
  completed: boolean
}

interface AnalyticsData {
  stats: Record<number, SlideStats>
  sessions: SessionData[]
  totalViews: number
  uniqueSessions: number
  avgDwellMs: number
  completionRate: number
}

function formatDuration(ms: number): string {
  if (ms < 1000) return '<1s'
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function MetricCard({ icon: Icon, label, value, subtext }: {
  icon: typeof Eye
  label: string
  value: string | number
  subtext?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-display font-black text-foreground">{value}</p>
      {subtext && <p className="text-[11px] text-muted-foreground mt-0.5">{subtext}</p>}
    </div>
  )
}

interface AnalyticsPanelProps {
  presId: string
  slideCount: number
  onClose: () => void
}

export function AnalyticsPanel({ presId, slideCount, onClose }: AnalyticsPanelProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/studio/analytics/views?presId=${presId}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [presId])

  if (loading) {
    return (
      <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-background rounded-2xl border shadow-2xl p-8 text-center">
          <BarChart3 className="w-6 h-6 text-muted-foreground animate-pulse mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const stats = data?.stats ?? {}
  const sessions = data?.sessions ?? []
  const maxDwell = Math.max(...Object.values(stats).map(s => s.totalDwell), 1)

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[85vh] bg-background rounded-2xl border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-turquoise" />
              Presentation Analytics
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">View tracking for shared links</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-4 gap-3">
            <MetricCard icon={Eye} label="Total Views" value={data?.totalViews ?? 0} />
            <MetricCard icon={Users} label="Unique Viewers" value={data?.uniqueSessions ?? 0} />
            <MetricCard
              icon={Clock}
              label="Avg. Time"
              value={formatDuration(data?.avgDwellMs ?? 0)}
            />
            <MetricCard
              icon={CheckCircle2}
              label="Completion"
              value={`${data?.completionRate ?? 0}%`}
              subtext="viewed 80%+ slides"
            />
          </div>

          {/* Per-slide heatmap */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Time per Slide
            </h3>
            {Object.keys(stats).length === 0 ? (
              <div className="text-center py-8">
                <Eye className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No views yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Share your presentation to start tracking views.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {Array.from({ length: slideCount }, (_, i) => {
                  const s = stats[i]
                  const dwell = s?.totalDwell ?? 0
                  const views = s?.viewCount ?? 0
                  const pct = maxDwell > 0 ? (dwell / maxDwell) * 100 : 0
                  const avgPerView = views > 0 ? Math.round(dwell / views) : 0

                  return (
                    <div key={i} className="flex items-center gap-3 group">
                      <span className="text-[11px] text-muted-foreground w-6 text-right tabular-nums shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 h-6 bg-muted/50 rounded overflow-hidden relative">
                        <div
                          className="h-full rounded transition-all duration-500"
                          style={{
                            width: `${Math.max(pct, 1)}%`,
                            backgroundColor: pct > 70 ? '#2BF2F1' : pct > 30 ? '#60D06F' : '#CFCABF',
                          }}
                        />
                        {views > 0 && (
                          <span className="absolute inset-y-0 left-2 flex items-center text-[10px] font-medium text-foreground/70">
                            {formatDuration(avgPerView)} avg
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground w-12 text-right tabular-nums shrink-0">
                        {views} {views === 1 ? 'view' : 'views'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent sessions */}
          {sessions.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Recent Viewers
              </h3>
              <div className="space-y-2">
                {sessions.slice(-10).reverse().map((s) => (
                  <div
                    key={s.sessionId}
                    className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <Users className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="font-medium">Anonymous viewer</span>
                        <span className="text-muted-foreground ml-2">{formatTimeAgo(s.startedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>{s.slidesViewed}/{s.totalSlides} slides</span>
                      <span>{formatDuration(s.totalDwellMs)}</span>
                      {s.completed && (
                        <span className="text-turquoise flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Complete
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
