import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'bg-turquoise text-slate',
        success:
          'bg-cactus/20 text-evergreen',
        warning:
          'bg-mango/20 text-slate',
        error:
          'bg-papaya/20 text-slate',
        info:
          'bg-blueberry/20 text-blueberry dark:text-blueberry',
        pending:
          'border border-mocha text-mocha',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function StatusBadge({
  className,
  variant,
  size,
  icon,
  dot = false,
  children,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof statusBadgeVariants> & {
    icon?: React.ReactNode
    dot?: boolean
  }) {
  return (
    <span
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          data-slot="status-badge-dot"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {icon && (
        <span data-slot="status-badge-icon" className="shrink-0">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}

export { StatusBadge, statusBadgeVariants }
