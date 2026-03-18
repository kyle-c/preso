'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
/* eslint-disable @next/next/no-img-element */

const FLOATING_ILLUSTRATIONS = [
  { src: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg', className: 'top-[5%] left-[3%] w-36 rotate-[-15deg]' },
  { src: '/illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg', className: 'top-[8%] right-[5%] w-44 rotate-[10deg]' },
  { src: '/illustrations/Cloud%20Coin%20-%20Turquoise.svg', className: 'bottom-[15%] left-[8%] w-32 rotate-[5deg]' },
  { src: '/illustrations/Hand%20-%20Stars.svg', className: 'bottom-[10%] right-[3%] w-36 rotate-[-8deg]' },
  { src: '/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg', className: 'top-[40%] left-[2%] w-28 rotate-[20deg]' },
  { src: '/illustrations/Fast.svg', className: 'top-[35%] right-[2%] w-24 rotate-[-12deg]' },
  { src: '/illustrations/Party%20Popper.svg', className: 'bottom-[35%] left-[15%] w-20 rotate-[15deg]' },
  { src: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg', className: 'bottom-[40%] right-[10%] w-28 rotate-[-5deg]' },
]

export function AuthForm() {
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

      // Magic link verification pending
      if (data.pending) {
        setPendingMessage(data.message)
        return
      }

      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 lg:px-16 overflow-hidden relative">
      {/* Floating background illustrations */}
      {FLOATING_ILLUSTRATIONS.map((illo, i) => (
        <img
          key={i}
          src={illo.src}
          alt=""
          className={`absolute opacity-[0.07] pointer-events-none select-none ${illo.className}`}
        />
      ))}

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-turquoise/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Shared container */}
      <div className="w-full max-w-5xl relative z-10 border border-white/10 rounded-3xl overflow-hidden grid lg:grid-cols-2">
        {/* Left half — darker tint with text */}
        <div className="bg-white/[0.03] p-10 lg:p-14 flex flex-col justify-center">
          <div className="inline-block px-4 py-1.5 border border-turquoise/30 rounded-full mb-6 self-start">
            <span className="text-xs uppercase tracking-widest text-turquoise font-mono font-medium">
              Felix Studio
            </span>
          </div>

          <h1 className="font-display font-black text-white text-4xl sm:text-5xl xl:text-6xl leading-[0.95] tracking-tight mb-6">
            Your next<br />
            big idea,<br />
            presented.
          </h1>

          <p className="text-lg xl:text-xl font-display font-bold text-white/70 leading-snug">
            AI-powered presentations<br />
            <span className="text-turquoise">built in seconds.</span>
          </p>
        </div>

        {/* Right half — form */}
        <div className="p-8 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {pendingMessage ? (
              /* ── Check your email state ── */
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-turquoise/10 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h2 className="font-display font-black text-xl text-white mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-1">
                  {pendingMessage}
                </p>
                <p className="text-xs text-white/30 mb-6">
                  Sent to <span className="text-white/50">{email}</span>
                </p>
                <button
                  type="button"
                  onClick={() => { setPendingMessage(''); setError('') }}
                  className="text-xs text-white/30 hover:text-white/50 transition-colors underline underline-offset-2"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              /* ── Normal form ── */
              <>
                {/* Mode toggle */}
                <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                      mode === 'signin'
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                      mode === 'signup'
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise/40 transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@felixpago.com"
                      required
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise/40 transition-colors"
                    />
                    {mode === 'signup' && (
                      <p className="text-xs text-white/30 mt-1.5">
                        Use your @felixpago.com email or an invited email to sign up
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise/40 transition-colors"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-papaya">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-turquoise text-slate-950 font-semibold rounded-xl hover:bg-turquoise/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? 'Loading...'
                      : mode === 'signin'
                        ? 'Sign In'
                        : 'Create Account'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
