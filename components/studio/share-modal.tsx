'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Copy, Check, Plus, Globe, Building2, Users, Trash2, Link, Eye, MessageSquare, Pencil, ChevronDown } from 'lucide-react'

type ShareAccess = 'public' | 'org' | 'specific'
type SharePermission = 'viewer' | 'commenter' | 'editor'

const PERMISSION_OPTIONS: { key: SharePermission; icon: typeof Eye; label: string }[] = [
  { key: 'viewer', icon: Eye, label: 'Can view' },
  { key: 'commenter', icon: MessageSquare, label: 'Can comment' },
  { key: 'editor', icon: Pencil, label: 'Can edit' },
]

interface ShareModalProps {
  presentationId: string
  onClose: () => void
  /** Current view mode — appended to the share URL so recipients see the same view */
  viewMode?: 'presentation' | 'outline' | 'document'
}

const ACCESS_OPTIONS: { key: ShareAccess; icon: typeof Globe; label: string; description: string }[] = [
  { key: 'public', icon: Globe, label: 'Anyone with the link', description: 'No sign-in required' },
  { key: 'org', icon: Building2, label: 'Anyone at Félix Pago', description: 'Must sign in with @felixpago.com' },
  { key: 'specific', icon: Users, label: 'Specific people', description: 'Only people you invite' },
]

function PermissionDropdown({ value, onChange, compact }: { value: SharePermission; onChange: (p: SharePermission) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const current = PERMISSION_OPTIONS.find((o) => o.key === value) ?? PERMISSION_OPTIONS[0]
  const Icon = current.icon

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white/70 hover:bg-white/10 transition-colors"
      >
        <Icon className="w-3 h-3" />
        {!compact && <span>{current.label}</span>}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-slate-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {PERMISSION_OPTIONS.map(({ key, icon: OptIcon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => { onChange(key); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left ${
                  key === value ? 'bg-turquoise/10 text-turquoise' : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <OptIcon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ShareModal({ presentationId, onClose, viewMode }: ShareModalProps) {
  const viewSuffix = viewMode && viewMode !== 'presentation' ? `?view=${viewMode}` : ''
  const [access, setAccess] = useState<ShareAccess>('org')
  const [permission, setPermission] = useState<SharePermission>('viewer')
  const [allowedEmails, setAllowedEmails] = useState<string[]>([])
  const [emailPermissions, setEmailPermissions] = useState<Record<string, SharePermission>>({})
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasExistingShare, setHasExistingShare] = useState(false)
  const [revoking, setRevoking] = useState(false)

  // Load existing share config
  useEffect(() => {
    fetch(`/api/studio/presentations/${presentationId}/share`)
      .then((res) => res.json())
      .then((data) => {
        if (data.shared) {
          setAccess(data.access)
          setAllowedEmails(data.allowedEmails ?? [])
          setPermission(data.permission ?? 'viewer')
          setEmailPermissions(data.emailPermissions ?? {})
          setShareUrl(`${window.location.origin}${data.url}${viewSuffix}`)
          setHasExistingShare(true)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [presentationId])

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const addEmails = useCallback((raw: string) => {
    setEmailError('')
    // Split on commas, spaces, semicolons, or tabs — Gmail-style multi-entry
    const candidates = raw.split(/[,;\s\t]+/).map((s) => s.trim().toLowerCase()).filter(Boolean)
    const invalid: string[] = []
    const added: string[] = []

    for (const email of candidates) {
      if (!EMAIL_RE.test(email)) {
        invalid.push(email)
        continue
      }
      if (!allowedEmails.includes(email) && !added.includes(email)) {
        added.push(email)
      }
    }

    if (added.length > 0) {
      setAllowedEmails((prev) => [...prev, ...added])
    }
    if (invalid.length > 0) {
      setEmailError(`Invalid: ${invalid.join(', ')}`)
    }
    setEmailInput('')
  }, [allowedEmails])

  const addEmail = useCallback(() => {
    if (emailInput.trim()) addEmails(emailInput)
  }, [emailInput, addEmails])

  const removeEmail = useCallback((email: string) => {
    setAllowedEmails((prev) => prev.filter((e) => e !== email))
    setEmailPermissions((prev) => {
      const next = { ...prev }
      delete next[email]
      return next
    })
  }, [])

  const handleShare = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/studio/presentations/${presentationId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access, allowedEmails, permission, emailPermissions: access === 'specific' ? emailPermissions : undefined }),
      })
      if (res.ok) {
        const data = await res.json()
        const url = `${window.location.origin}${data.url}${viewSuffix}`
        setShareUrl(url)
        setHasExistingShare(true)
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Silently fail
    } finally {
      setSaving(false)
    }
  }, [presentationId, access, allowedEmails, permission, emailPermissions])

  const handleRevoke = useCallback(async () => {
    setRevoking(true)
    try {
      const res = await fetch(`/api/studio/presentations/${presentationId}/share`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setShareUrl(null)
        setHasExistingShare(false)
        onClose()
      }
    } catch {
      // Silently fail
    } finally {
      setRevoking(false)
    }
  }, [presentationId, onClose])

  const copyLink = useCallback(async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [shareUrl])

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-950 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-white font-display font-bold text-lg">
              Share Presentation
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-turquoise/30 border-t-turquoise rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Access level selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Who can access
                  </label>
                  <div className="space-y-1.5">
                    {ACCESS_OPTIONS.map(({ key, icon: Icon, label, description }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAccess(key)}
                        className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                          access === key
                            ? 'bg-turquoise/10 border-turquoise/30'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                        }`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-lg ${
                          access === key ? 'bg-turquoise/20 text-turquoise' : 'bg-white/5 text-white/30'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${access === key ? 'text-white' : 'text-white/70'}`}>
                            {label}
                          </p>
                          <p className="text-xs text-white/30 mt-0.5">{description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default permission for public/org */}
                {access !== 'specific' && (
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Permission
                    </label>
                    <PermissionDropdown value={permission} onChange={setPermission} />
                  </div>
                )}

                {/* Email list for specific access */}
                {access === 'specific' && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Invite people
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => {
                          const v = e.target.value
                          setEmailError('')
                          // Auto-add on comma, semicolon, or tab typed at end
                          if (v.endsWith(',') || v.endsWith(';') || v.endsWith('\t')) {
                            addEmails(v)
                          } else {
                            setEmailInput(v)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); addEmail() }
                          // Backspace on empty input removes last chip
                          if (e.key === 'Backspace' && !emailInput && allowedEmails.length > 0) {
                            setAllowedEmails((prev) => prev.slice(0, -1))
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault()
                          const pasted = e.clipboardData.getData('text')
                          addEmails(pasted)
                        }}
                        onBlur={() => { if (emailInput.trim()) addEmail() }}
                        placeholder="Add people by email"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise/40 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={addEmail}
                        disabled={!emailInput.trim()}
                        className="px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {emailError && (
                      <p className="text-xs text-red-400">{emailError}</p>
                    )}
                    {allowedEmails.length > 0 && (
                      <div className="space-y-1.5">
                        {allowedEmails.map((email) => {
                          const initials = email.split('@')[0].split(/[._-]/).slice(0, 2).map(s => s[0]?.toUpperCase() || '').join('')
                          const isFelix = email.endsWith('@felixpago.com')
                          return (
                            <div
                              key={email}
                              className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg group"
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                isFelix ? 'bg-turquoise/20 text-turquoise' : 'bg-violet-500/20 text-violet-400'
                              }`}>
                                {initials || '?'}
                              </div>
                              <span className="text-sm text-white/70 flex-1 truncate">{email}</span>
                              <PermissionDropdown
                                value={emailPermissions[email] ?? permission}
                                onChange={(p) => setEmailPermissions((prev) => ({ ...prev, [email]: p }))}
                                compact
                              />
                              <button
                                type="button"
                                onClick={() => removeEmail(email)}
                                className="p-1 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Existing share URL */}
                {shareUrl && hasExistingShare && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                    <Link className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                    <span className="text-xs text-white/40 truncate flex-1 font-mono">{shareUrl}</span>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="p-1 text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-cactus" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleShare}
                    disabled={saving || (access === 'specific' && allowedEmails.length === 0)}
                    className="w-full py-2.5 bg-turquoise text-slate-950 font-semibold rounded-xl hover:bg-turquoise/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Link Copied!
                      </>
                    ) : hasExistingShare ? (
                      <>
                        <Copy className="w-4 h-4" />
                        Update & Copy Link
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Share & Copy Link
                      </>
                    )}
                  </button>

                  {hasExistingShare && (
                    <button
                      type="button"
                      onClick={handleRevoke}
                      disabled={revoking}
                      className="text-xs text-white/25 hover:text-red-400 transition-colors inline-flex items-center justify-center gap-1.5 py-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      {revoking ? 'Revoking...' : 'Stop sharing'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
