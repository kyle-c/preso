'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function PasswordForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === 'FelixDesign2024') {
      // Set authentication cookie
      document.cookie = 'felix-auth=authenticated; path=/; max-age=86400' // 24 hours
      router.push(redirect)
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
          autoFocus
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="w-full px-12 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-cyan-600 transition-colors cursor-pointer"
      >
        Enter
      </button>
    </form>
  )
}

export default function PasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="border-l-4 border-cyan-500 pl-8 mb-8">
          <h1 className="text-3xl text-gray-900 font-medium mb-2">
            Protected Content
          </h1>
          <p className="text-base text-gray-600">
            Please enter the password to continue
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-4">
            <div className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-gray-100 animate-pulse" />
            <div className="w-full px-12 py-4 bg-gray-200 rounded-sm animate-pulse" />
          </div>
        }>
          <PasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
