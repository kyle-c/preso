'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { dsStrings, DSLang, DSStrings } from '@/lib/ds-i18n'

const STORAGE_KEY = 'felix-ds-lang'

interface DSLangContext {
  lang: DSLang
  setLang: (lang: DSLang) => void
  t: DSStrings
}

const Context = createContext<DSLangContext>({
  lang: 'en',
  setLang: () => {},
  t: dsStrings.en,
})

export function DSLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<DSLang>('en')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as DSLang | null
    if (stored && stored in dsStrings) setLangState(stored)
  }, [])

  function setLang(l: DSLang) {
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  return (
    <Context.Provider value={{ lang, setLang, t: dsStrings[lang] }}>
      {children}
    </Context.Provider>
  )
}

export function useDSLang() {
  return useContext(Context)
}

/** Render a string with **bold** markers as React nodes. */
export function renderBold(text: string): React.ReactNode[] {
  return text.split('**').map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-foreground">{part}</strong>
      : <span key={i}>{part}</span>
  )
}
