'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AccessDeniedProps {
  reason: 'auth' | 'not-invited'
}

export function AccessDenied({ reason }: AccessDeniedProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingMessage, setPendingMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setPendingMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/studio/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode === 'signin' ? 'login' : 'signup',
          email,
          password,
          ...(mode === 'signup' ? { name } : {}),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      if (data.pending) {
        setPendingMessage(data.message)
        return
      }

      // Logged in — reload to re-run server-side access check
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (reason === 'not-invited') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white mb-2">
              Access restricted
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              You don&apos;t have access to this presentation.
              Ask the owner to share it with your email address.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/10 text-white/60 font-medium rounded-xl hover:bg-white/15 hover:text-white/80 transition-colors text-sm"
          >
            Go to Felix Studio
          </Link>
        </div>
      </div>
    )
  }

  // Auth required — show inline login form
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-display font-bold text-white">
            Sign in to view
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            This presentation is shared with Félix Pago team members.
            Sign in with your @felixpago.com account to view it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-turquoise/50 focus:ring-1 focus:ring-turquoise/25 transition-colors"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-turquoise/50 focus:ring-1 focus:ring-turquoise/25 transition-colors"
              placeholder="you@felixpago.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-turquoise/50 focus:ring-1 focus:ring-turquoise/25 transition-colors"
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {pendingMessage && (
            <p className="text-sm text-turquoise bg-turquoise/10 border border-turquoise/20 rounded-lg px-3 py-2">
              {pendingMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-turquoise text-slate-950 font-semibold rounded-xl hover:bg-turquoise/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs text-white/30">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={() => { setMode('signup'); setError('') }} className="text-turquoise hover:text-turquoise/80 transition-colors">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('signin'); setError('') }} className="text-turquoise hover:text-turquoise/80 transition-colors">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
