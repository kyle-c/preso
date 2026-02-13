"use client"

import React from "react"

import { SidebarNav } from "./sidebar-nav"

interface DesignSystemLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  rightNav?: React.ReactNode
}

export function DesignSystemLayout({ children, title, description, rightNav }: DesignSystemLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main className="ml-64">
        <div className="border-b border-border bg-linen px-8 py-12">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-8 p-8">
          <div className="min-w-0 flex-1">
            {children}
          </div>
          {rightNav}
        </div>
      </main>
    </div>
  )
}
