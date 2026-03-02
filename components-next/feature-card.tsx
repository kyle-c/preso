import * as React from 'react'

import { cn } from '@/lib/utils'

function FeatureCard({
  className,
  icon,
  title,
  description,
  accent = 'bg-sky',
  children,
  ...props
}: React.ComponentProps<'div'> & {
  icon: React.ReactNode
  title: string
  description: string
  accent?: string
}) {
  return (
    <div
      data-slot="feature-card"
      className={cn('rounded-xl p-6', accent, className)}
      {...props}
    >
      <div
        data-slot="feature-card-icon"
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate [&>svg]:h-6 [&>svg]:w-6"
      >
        {icon}
      </div>
      <h3
        data-slot="feature-card-title"
        className="mb-2 font-display text-xl font-bold text-slate"
      >
        {title}
      </h3>
      <p
        data-slot="feature-card-description"
        className="text-sm text-slate"
      >
        {description}
      </p>
      {children}
    </div>
  )
}

export { FeatureCard }
