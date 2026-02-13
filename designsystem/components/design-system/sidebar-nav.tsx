"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Palette, 
  Type, 
  Component, 
  Home,
  Blend
} from "lucide-react"
import { FelixLogo } from "./felix-logo"

const navItems = [
  {
    title: "Overview",
    href: "/",
    icon: Home,
  },
  {
    title: "Colors",
    href: "/colors",
    icon: Palette,
    children: [
      { title: "Primary Palette", href: "/colors#primary" },
      { title: "Secondary Palette", href: "/colors#secondary" },
      { title: "Colorways", href: "/colors#colorways" },
    ],
  },
  {
    title: "Typography",
    href: "/typography",
    icon: Type,
    children: [
      { title: "Font Families", href: "/typography#fonts" },
      { title: "Weights", href: "/typography#weights" },
      { title: "Type Scale", href: "/typography#scale" },
    ],
  },
  {
    title: "Components",
    href: "/components",
    icon: Component,
    children: [
      { title: "Buttons", href: "/components#buttons" },
      { title: "Cards", href: "/components#cards" },
      { title: "Inputs", href: "/components#inputs" },
      { title: "Badges", href: "/components#badges" },
    ],
  },
  {
    title: "Tokens",
    href: "/tokens",
    icon: Blend,
    children: [
      { title: "Semantic Tokens", href: "/tokens#semantic" },
      { title: "Brand Tokens", href: "/tokens#brand" },
      { title: "Chart Tokens", href: "/tokens#chart" },
      { title: "Spacing", href: "/tokens#spacing" },
      { title: "Typography", href: "/tokens#typography" },
      { title: "Sidebar Tokens", href: "/tokens#sidebar" },
    ],
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center">
            <FelixLogo className="h-6 w-auto text-turquoise" />
          </Link>
          <span className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Design System
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
                {item.children && isActive && (
                  <div className="ml-7 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-1.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/60">
            Version 1.0.0
          </p>
        </div>
      </div>
    </aside>
  )
}
