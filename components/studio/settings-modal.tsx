'use client'

import { useState, useCallback } from 'react'
import { X, Check, ExternalLink } from 'lucide-react'
import { ModelSelector, type ModelSelectorProps } from './model-selector'

interface SettingsModalProps extends ModelSelectorProps {
  onClose: () => void
  notionConnected?: boolean
  onNotionConnectedChange?: (connected: boolean) => void
  amplitudeConnected?: boolean
  onAmplitudeConnectedChange?: (connected: boolean) => void
  googleWorkspaceConnected?: boolean
  onGoogleWorkspaceConnectedChange?: (connected: boolean) => void
  clickupConnected?: boolean
  onClickupConnectedChange?: (connected: boolean) => void
}

export function SettingsModal({
  provider,
  apiKey,
  model,
  onProviderChange,
  onApiKeyChange,
  onModelChange,
  onClose,
  userEmail,
  notionConnected,
  onNotionConnectedChange,
  amplitudeConnected,
  onAmplitudeConnectedChange,
  googleWorkspaceConnected,
  onGoogleWorkspaceConnectedChange,
  clickupConnected,
  onClickupConnectedChange,
}: SettingsModalProps) {
  const [tab, setTab] = useState<'model' | 'integrations'>('model')
  const [localNotionKey, setLocalNotionKey] = useState('')
  const [notionSaved, setNotionSaved] = useState(false)
  const [localAmpApiKey, setLocalAmpApiKey] = useState('')
  const [localAmpSecretKey, setLocalAmpSecretKey] = useState('')
  const [ampSaved, setAmpSaved] = useState(false)
  const [localGoogleKey, setLocalGoogleKey] = useState('')
  const [googleSaved, setGoogleSaved] = useState(false)
  const [localClickupKey, setLocalClickupKey] = useState('')
  const [clickupSaved, setClickupSaved] = useState(false)

  const saveNotionKey = useCallback(async () => {
    try {
      await fetch('/api/studio/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notionKey: localNotionKey }),
      })
      onNotionConnectedChange?.(!!localNotionKey)
      setLocalNotionKey('')
      setNotionSaved(true)
      setTimeout(() => setNotionSaved(false), 2000)
    } catch { /* silent */ }
  }, [localNotionKey, onNotionConnectedChange])

  const saveAmplitudeKeys = useCallback(async () => {
    try {
      await fetch('/api/studio/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amplitudeApiKey: localAmpApiKey, amplitudeSecretKey: localAmpSecretKey }),
      })
      onAmplitudeConnectedChange?.(!!(localAmpApiKey && localAmpSecretKey))
      setLocalAmpApiKey('')
      setLocalAmpSecretKey('')
      setAmpSaved(true)
      setTimeout(() => setAmpSaved(false), 2000)
    } catch { /* silent */ }
  }, [localAmpApiKey, localAmpSecretKey, onAmplitudeConnectedChange])

  const saveGoogleKey = useCallback(async () => {
    try {
      await fetch('/api/studio/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleWorkspaceKey: localGoogleKey }),
      })
      onGoogleWorkspaceConnectedChange?.(!!localGoogleKey)
      setLocalGoogleKey('')
      setGoogleSaved(true)
      setTimeout(() => setGoogleSaved(false), 2000)
    } catch { /* silent */ }
  }, [localGoogleKey, onGoogleWorkspaceConnectedChange])

  const saveClickupKey = useCallback(async () => {
    try {
      await fetch('/api/studio/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clickupKey: localClickupKey }),
      })
      onClickupConnectedChange?.(!!localClickupKey)
      setLocalClickupKey('')
      setClickupSaved(true)
      setTimeout(() => setClickupSaved(false), 2000)
    } catch { /* silent */ }
  }, [localClickupKey, onClickupConnectedChange])

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
              Settings
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              type="button"
              onClick={() => setTab('model')}
              className={`flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === 'model'
                  ? 'text-white border-b-2 border-turquoise'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Model
            </button>
            <button
              type="button"
              onClick={() => setTab('integrations')}
              className={`flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === 'integrations'
                  ? 'text-white border-b-2 border-turquoise'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Integrations
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {tab === 'model' ? (
              <ModelSelector
                provider={provider}
                apiKey={apiKey}
                model={model}
                onProviderChange={onProviderChange}
                onApiKeyChange={onApiKeyChange}
                onModelChange={onModelChange}
                userEmail={userEmail}
              />
            ) : (
              <div className="space-y-6">
                {/* Notion */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.486 2.35c-.42-.326-.98-.7-2.055-.607L3.36 2.86c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.213.98l14.523-.84c.84-.046.934-.56.934-1.166V6.354c0-.606-.234-.933-.747-.886l-15.177.887c-.56.046-.746.327-.746.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.607.327-1.166.514-1.633.514-.747 0-.934-.234-1.494-.933l-4.577-7.186v6.952l1.447.327s0 .84-1.166.84l-3.22.187c-.093-.187 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.454-.233 4.764 7.279v-6.44l-1.213-.14c-.094-.514.28-.886.746-.933zM2.708 1.88C4.017.934 5.792.374 7.822.28l13.076-.793c2.008-.14 2.521.467 2.521 1.586v3.219c0 .56-.234 1.027-.934 1.12l-15.176.887c-.56.046-.793.327-.793.7v14.09c0 .56-.327.84-.747.84s-.934-.14-1.307-.373L1.167 19.67c-.747-.56-1.073-1.307-1.073-2.24V4.399c0-.933.42-2.007 2.614-2.519z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Notion</h3>
                      <p className="text-xs text-white/40">Import pages and databases</p>
                    </div>
                    {(notionConnected || localNotionKey) && (
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cactus/20 text-cactus text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-cactus" />
                        Connected
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-white/50">
                      Internal Integration Token
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={localNotionKey}
                        onChange={(e) => setLocalNotionKey(e.target.value)}
                        placeholder={notionConnected ? '••••••••••••' : 'ntn_...'}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button
                        type="button"
                        onClick={saveNotionKey}
                        disabled={!localNotionKey}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        {notionSaved ? <Check className="w-4 h-4 text-cactus" /> : 'Save'}
                      </button>
                    </div>
                    <a
                      href="https://www.notion.so/profile/integrations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-white/30 hover:text-white/50 transition-colors"
                    >
                      Create an integration at notion.so/profile/integrations
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Amplitude */}
                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-3 5h2v1.5H9.5V13h3v1.5H9.5V16h5v1.5H8V10h1zm7.5 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
                        <path d="M6.5 8.5l2.5 3.5M15 8.5l2.5 3.5M8 16l-2 2M16 16l2 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Amplitude</h3>
                      <p className="text-xs text-white/40">Pull charts, metrics & analytics</p>
                    </div>
                    {(amplitudeConnected || (localAmpApiKey && localAmpSecretKey)) && (
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cactus/20 text-cactus text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-cactus" />
                        Connected
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-white/50">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={localAmpApiKey}
                      onChange={(e) => setLocalAmpApiKey(e.target.value)}
                      placeholder={amplitudeConnected ? '••••••••••••' : 'Your Amplitude API key'}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-white/50">
                      Secret Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={localAmpSecretKey}
                        onChange={(e) => setLocalAmpSecretKey(e.target.value)}
                        placeholder={amplitudeConnected ? '••••••••••••' : 'Your Amplitude secret key'}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button
                        type="button"
                        onClick={saveAmplitudeKeys}
                        disabled={!localAmpApiKey || !localAmpSecretKey}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        {ampSaved ? <Check className="w-4 h-4 text-cactus" /> : 'Save'}
                      </button>
                    </div>
                    <a
                      href="https://app.amplitude.com/analytics/settings/projects"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-white/30 hover:text-white/50 transition-colors"
                    >
                      Find keys in Amplitude Settings &rarr; Projects &rarr; General
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Google Workspace */}
                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#fff"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Google Workspace</h3>
                      <p className="text-xs text-white/40">Import Sheets, Docs & Slides</p>
                    </div>
                    {(googleWorkspaceConnected || localGoogleKey) && (
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cactus/20 text-cactus text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-cactus" />
                        Connected
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-white/50">
                      Google Cloud API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={localGoogleKey}
                        onChange={(e) => setLocalGoogleKey(e.target.value)}
                        placeholder={googleWorkspaceConnected ? '••••••••••••' : 'AIza...'}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button
                        type="button"
                        onClick={saveGoogleKey}
                        disabled={!localGoogleKey}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        {googleSaved ? <Check className="w-4 h-4 text-cactus" /> : 'Save'}
                      </button>
                    </div>
                    <p className="text-[11px] text-white/30 leading-relaxed">
                      Enable Sheets, Docs & Slides APIs in your Google Cloud project. Documents must be shared as &ldquo;Anyone with the link.&rdquo;
                    </p>
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-white/30 hover:text-white/50 transition-colors"
                    >
                      Create an API key at console.cloud.google.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* ClickUp */}
                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.705 16.26l3.397-2.605c1.702 2.216 3.347 3.249 5.298 3.249 1.94 0 3.578-1.022 5.297-3.259l3.399 2.593c-2.468 3.222-5.2 4.966-8.696 4.966-3.485 0-6.227-1.755-8.695-4.944zM12.39 7.598l-4.906 4.357-3.302-3.725L12.4 1.204l8.198 7.026-3.302 3.725z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">ClickUp</h3>
                      <p className="text-xs text-white/40">Import tasks and lists</p>
                    </div>
                    {(clickupConnected || localClickupKey) && (
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cactus/20 text-cactus text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-cactus" />
                        Connected
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-white/50">
                      Personal API Token
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={localClickupKey}
                        onChange={(e) => setLocalClickupKey(e.target.value)}
                        placeholder={clickupConnected ? '••••••••••••' : 'pk_...'}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button
                        type="button"
                        onClick={saveClickupKey}
                        disabled={!localClickupKey}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        {clickupSaved ? <Check className="w-4 h-4 text-cactus" /> : 'Save'}
                      </button>
                    </div>
                    <a
                      href="https://app.clickup.com/settings/apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-white/30 hover:text-white/50 transition-colors"
                    >
                      Generate a token at app.clickup.com/settings/apps
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
