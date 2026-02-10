"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"

interface ColorSwatchProps {
  name: string
  hex: string
  rgb?: string
  pms?: string
  tailwindClass?: string
  className?: string
  textColor?: "light" | "dark"
  size?: "small" | "large"
}

export function ColorSwatch({ 
  name, 
  hex, 
  rgb, 
  pms, 
  tailwindClass,
  className,
  textColor = "dark",
  size = "large"
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const textColorClass = textColor === "light" ? "text-linen" : "text-slate"

  if (size === "small") {
    return (
      <div className="group relative">
        <button
          onClick={copyToClipboard}
          className={cn(
            "relative h-32 w-full rounded-lg border border-border transition-transform hover:scale-[1.02]",
            className
          )}
          style={{ backgroundColor: hex }}
        >
          <div className={cn(
            "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100",
            textColorClass
          )}>
            {copied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </div>
        </button>
        <div className="mt-3">
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{hex}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border">
      <button
        onClick={copyToClipboard}
        className={cn(
          "relative h-64 w-full transition-transform",
          className
        )}
        style={{ backgroundColor: hex }}
      >
        <div className={cn(
          "absolute right-4 top-4 flex h-10 w-24 items-center justify-center rounded-full bg-slate/80 text-sm font-medium text-linen opacity-0 transition-opacity group-hover:opacity-100"
        )}>
          {copied ? "Copied!" : "Copy HEX"}
        </div>
      </button>
      <div className={cn("p-4", className)} style={{ backgroundColor: hex }}>
        <p className={cn("text-sm font-medium", textColorClass)}>
          Name: <span className="font-normal">{name}</span>
        </p>
        {rgb && (
          <p className={cn("text-sm", textColorClass)}>
            RGB: <span className="font-normal">{rgb}</span>
          </p>
        )}
        <p className={cn("text-sm", textColorClass)}>
          HEX: <span className="font-normal">{hex}</span>
        </p>
        {pms && (
          <p className={cn("text-sm", textColorClass)}>
            PMS: <span className="font-normal">{pms}</span>
          </p>
        )}
        {tailwindClass && (
          <p className={cn("text-sm", textColorClass)}>
            Tailwind: <code className="font-mono text-xs font-normal">{tailwindClass}</code>
          </p>
        )}
      </div>
    </div>
  )
}
