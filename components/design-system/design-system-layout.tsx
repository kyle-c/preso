"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { SidebarNav } from "./sidebar-nav"
import { useDSLang } from "./ds-lang-context"
import type { DSStrings } from "@/lib/ds-i18n"

interface DesignSystemLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  rightNav?: React.ReactNode
}

function getPageKey(pathname: string): keyof DSStrings['pages'] | null {
  if (pathname === '/') return 'overview'
  if (pathname.startsWith('/principles')) return 'principles'
  if (pathname.startsWith('/editorial-guidelines')) return 'editorial'
  if (pathname.startsWith('/colors')) return 'colors'
  if (pathname.startsWith('/typography')) return 'typography'
  if (pathname.startsWith('/components')) return 'components'
  if (pathname.startsWith('/tokens')) return 'tokens'
  if (pathname.startsWith('/illustrations')) return 'illustrations'
  return null
}

export function DesignSystemLayout({ children, title, description, rightNav }: DesignSystemLayoutProps) {
  const pathname = usePathname()
  const { t } = useDSLang()

  const pageKey = getPageKey(pathname)
  const displayTitle = pageKey ? (t.pages[pageKey].title || title) : title
  const displayDesc = pageKey ? (t.pages[pageKey].description || description) : description

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main className="ml-64">
        <div key={pathname} className="animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out">
          {displayTitle && (
            <div className="border-b border-border bg-linen px-8 py-12">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                {displayTitle}
              </h1>
              {displayDesc && (
                <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                  {displayDesc}
                </p>
              )}
            </div>
          )}
          <div className="flex gap-8 p-8">
            <div className="min-w-0 flex-1">
              {children}
            </div>
            {rightNav}
          </div>
        </div>
      </main>
    </div>
  )
}
