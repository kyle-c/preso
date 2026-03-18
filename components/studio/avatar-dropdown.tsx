'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export function AvatarDropdown({ email }: { email: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const initials = email
    .split('@')[0]
    .split(/[._-]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('')

  async function handleSignOut() {
    setLoading(true)
    try {
      await fetch('/api/studio/auth/me', { method: 'DELETE' })
      router.refresh()
    } catch {
      router.refresh()
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-evergreen text-white text-xs font-semibold flex items-center justify-center hover:bg-evergreen/80 transition-colors"
        aria-label="Account menu"
      >
        {initials || <User className="w-4 h-4" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loading}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-stone/50 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {loading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  )
}
