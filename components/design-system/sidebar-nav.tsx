"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Palette,
  Type,
  Component,
  Home,
  Blend,
  BookOpen,
  PenLine,
  Images,
  Globe,
  FileCode2,
  Plug,
  Coins,
} from "lucide-react"
import { FelixLogo } from "./felix-logo"
import { useDSLang } from "./ds-lang-context"
import type { DSLang } from "@/lib/ds-i18n"

export function SidebarNav() {
  const pathname = usePathname()
  const { t, lang, setLang } = useDSLang()
  const n = t.nav

  const navItems: ({ title: string; href: string; icon: typeof Home; badge?: string; disabled?: boolean; children?: { title: string; href: string }[]; dividerBefore?: boolean })[] = [
    {
      title: n.overview,
      href: "/",
      icon: Home,
    },
    {
      title: n.designPrinciples,
      href: "/principles",
      icon: BookOpen,
      children: [
        { title: n.thePrinciples, href: "/principles#principles" },
        { title: n.resources, href: "/principles#resources" },
        { title: n.whenPrinciplesOverlap, href: "/principles#conflicts" },
      ],
    },
    {
      title: n.colors,
      href: "/colors",
      icon: Palette,
      children: [
        { title: n.primaryPalette, href: "/colors#primary" },
        { title: n.secondaryPalette, href: "/colors#secondary" },
        { title: n.colorways, href: "/colors#colorways" },
      ],
    },
    {
      title: n.typography,
      href: "/typography",
      icon: Type,
      children: [
        { title: n.fontFamilies, href: "/typography#fonts" },
        { title: n.weights, href: "/typography#weights" },
        { title: n.typeScale, href: "/typography#scale" },
      ],
    },
    {
      title: n.illustrations,
      href: "/illustrations",
      icon: Images,
      children: [
        { title: n.brandCharacters, href: "/illustrations#brand" },
        { title: n.flags3D, href: "/illustrations#flags-3d" },
        { title: n.flagsOriginal, href: "/illustrations#flags-og" },
        { title: n.hands, href: "/illustrations#hands" },
        { title: n.moneyPayments, href: "/illustrations#money" },
        { title: n.communication, href: "/illustrations#communication" },
        { title: n.statusAlerts, href: "/illustrations#status" },
        { title: n.navigationMaps, href: "/illustrations#navigation" },
        { title: n.other, href: "/illustrations#other" },
      ],
    },
    {
      title: n.components,
      href: "/components",
      icon: Component,
      children: [
        { title: n.buttons, href: "/components#buttons" },
        { title: n.cards, href: "/components#cards" },
        { title: n.inputs, href: "/components#inputs" },
        { title: n.badges, href: "/components#badges" },
      ],
    },
    {
      title: n.tokens,
      href: "/tokens",
      icon: Blend,
      children: [
        { title: n.semanticTokens, href: "/tokens#semantic" },
        { title: n.brandTokens, href: "/tokens#brand" },
        { title: n.chartTokens, href: "/tokens#chart" },
        { title: n.spacing, href: "/tokens#spacing" },
        { title: n.borderRadius, href: "/tokens#border-radius" },
        { title: n.shadows, href: "/tokens#shadows" },
        { title: n.typographyTokens, href: "/tokens#typography" },
        { title: n.sidebarTokens, href: "/tokens#sidebar" },
      ],
    },
    {
      title: n.editorialGuidelines,
      href: "/editorial-guidelines",
      icon: PenLine,
      dividerBefore: true,
      children: [
        { title: n.voiceTone, href: "/editorial-guidelines#voice" },
        { title: n.writingPatterns, href: "/editorial-guidelines#patterns" },
        { title: n.multilingual, href: "/editorial-guidelines#multilingual" },
        { title: n.contentTokens, href: "/editorial-guidelines#tokens" },
        { title: n.commonPitfalls, href: "/editorial-guidelines#pitfalls" },
        { title: n.quickReference, href: "/editorial-guidelines#reference" },
      ],
    },
    {
      title: n.fintechTokens,
      href: "/fintech/tokens",
      icon: Coins,
      badge: n.soon,
      disabled: true,
    },
    {
      title: n.referenceMd,
      href: "/md",
      icon: FileCode2,
      badge: n.experimental,
      dividerBefore: true,
    },
    {
      title: n.mcp,
      href: "/mcp",
      icon: Plug,
      badge: n.soon,
      disabled: true,
    },
  ]

  const langOptions: { code: DSLang; label: string }[] = [
    { code: 'en',    label: 'EN' },
    { code: 'es-mx', label: 'ES' },
    { code: 'pt-br', label: 'PT' },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center">
            <FelixLogo className="h-6 w-auto text-turquoise" />
          </Link>
          <span className="text-xs font-medium uppercase tracking-[0.01em] leading-[1.4] text-turquoise-600">
            {n.designSystem}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <div key={item.href}>
                {item.dividerBefore && (
                  <div className="my-2 mx-3 h-px bg-sidebar-border" />
                )}
                {item.disabled ? (
                  <span
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium leading-[1.5] text-sidebar-foreground/40 cursor-default"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto flex-shrink-0 rounded-full bg-sidebar-foreground/8 px-1.5 py-0.5 text-[9px] font-semibold text-sidebar-foreground/40 whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium leading-[1.5] transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-turquoise/15 px-2 py-0.5 text-[10px] font-semibold text-turquoise">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
                {item.children && (
                  <div
                    className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                    style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-7 mt-1 mb-1 space-y-1 border-l border-sidebar-border pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-1.5 text-sm leading-[1.5] text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-3">
          {/* Language picker */}
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-sidebar-foreground/40 flex-shrink-0" />
            <div className="flex gap-1">
              {langOptions.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-semibold transition-colors",
                    lang === code
                      ? "bg-turquoise/20 text-turquoise"
                      : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs leading-[1.4] tracking-[0.01em] text-sidebar-foreground/60">
            {n.version}
          </p>
        </div>
      </div>
    </aside>
  )
}
