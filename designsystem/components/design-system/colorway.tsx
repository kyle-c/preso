import { cn } from "@/lib/utils"

interface ColorwayProps {
  bgColor: string
  textColor: string
  bgHex: string
  textHex: string
  label: string
}

export function Colorway({ bgColor, textColor, bgHex, textHex, label }: ColorwayProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div 
        className="flex h-40 items-center justify-center"
        style={{ backgroundColor: bgHex }}
      >
        <span 
          className="text-7xl font-bold"
          style={{ color: textHex }}
        >
          Aa
        </span>
      </div>
      <div 
        className="px-4 py-3"
        style={{ backgroundColor: bgHex }}
      >
        <p 
          className="text-sm font-medium"
          style={{ color: textHex }}
        >
          {label}
        </p>
      </div>
    </div>
  )
}
