import React from "react"
interface SectionProps {
  id: string
  title: string
  description?: string
  accessibility?: {
    score: string
    wcag: "AAA" | "AA" | "Fail"
    notes?: string[]
  }
  children: React.ReactNode
}

export function Section({ id, title, description, accessibility, children }: SectionProps) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      {title && <div className="mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
          {accessibility && (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              accessibility.wcag === "AAA"
                ? "bg-cactus/20 text-evergreen"
                : accessibility.wcag === "AA"
                  ? "bg-mango/20 text-slate"
                  : "bg-destructive/10 text-destructive"
            }`}>
              {accessibility.score} - WCAG {accessibility.wcag}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
        {accessibility?.notes && accessibility.notes.length > 0 && (
          <ul className="mt-3 space-y-1">
            {accessibility.notes.map((note, i) => (
              <li key={i} className="text-xs text-mocha">
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>}
      {children}
    </section>
  )
}
