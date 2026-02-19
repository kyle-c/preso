'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string
}

function FloatingInput({
  className,
  label,
  id,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)
  const inputId = id || React.useId()

  const isFloating = isFocused || hasValue

  return (
    <div className="relative">
      <input
        id={inputId}
        data-slot="floating-input"
        className={cn(
          'peer h-14 w-full rounded-xl border border-border bg-transparent px-4 pt-4 pb-2 text-base text-foreground transition-colors outline-none',
          'focus:border-ring focus:ring-ring/50 focus:ring-[3px]',
          'placeholder:text-transparent',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        placeholder={label}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          setHasValue(e.target.value.length > 0)
          props.onBlur?.(e)
        }}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0)
          props.onChange?.(e)
        }}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          'pointer-events-none absolute left-4 bg-linen px-1 text-muted-foreground transition-all duration-200',
          isFloating
            ? 'top-0 -translate-y-1/2 text-xs font-medium text-foreground'
            : 'top-1/2 -translate-y-1/2 text-base',
          'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-foreground',
          'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-foreground',
          'peer-disabled:opacity-50',
        )}
      >
        {label}
      </label>
    </div>
  )
}

export { FloatingInput }
