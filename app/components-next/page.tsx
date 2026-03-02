'use client'

import * as React from 'react'
import { DesignSystemLayout } from '@/components/design-system/design-system-layout'
import { Section } from '@/components/design-system/section'
import {
  StatusBadge,
  FeatureCard,
  FormField,
  formatCardNumber,
  formatExpiry,
  formatCVV,
  formatZIP,
  Stepper,
  StepperProgress,
  StepperContent,
  StepperPrev,
  StepperNext,
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetHeader,
  ActionSheetItem,
  ActionSheetCancel,
} from '@/components-next'
import { Button } from '@/components/ui/button'
import {
  Check,
  X,
  Loader2,
  Send,
  Share2,
  Copy,
  Trash2,
  Flag,
} from 'lucide-react'

// ─── StatusBadge demos ────────────────────────────────

function StatusBadgeDemo() {
  return (
    <div className="space-y-6">
      {/* Variants */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">Variants</p>
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant="default">Turquoise</StatusBadge>
          <StatusBadge variant="success">Success</StatusBadge>
          <StatusBadge variant="warning">Warning</StatusBadge>
          <StatusBadge variant="error">Error</StatusBadge>
          <StatusBadge variant="info">Info</StatusBadge>
          <StatusBadge variant="pending">Pending</StatusBadge>
        </div>
      </div>

      {/* With icons */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">With icons (matches /components status badges)</p>
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant="success" icon={<Check />}>Completed</StatusBadge>
          <StatusBadge variant="warning" icon={<Loader2 className="animate-spin" />}>Pending</StatusBadge>
          <StatusBadge variant="error" icon={<X />}>Failed</StatusBadge>
        </div>
      </div>

      {/* With dots */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">With dot indicator</p>
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant="success" dot>Active</StatusBadge>
          <StatusBadge variant="warning" dot>Review</StatusBadge>
          <StatusBadge variant="error" dot>Offline</StatusBadge>
          <StatusBadge variant="pending" dot>Queued</StatusBadge>
        </div>
      </div>

      {/* Small size */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">Small size</p>
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant="success" size="sm" dot>Live</StatusBadge>
          <StatusBadge variant="error" size="sm" icon={<X />}>Failed</StatusBadge>
          <StatusBadge variant="info" size="sm">v2.1.0</StatusBadge>
        </div>
      </div>
    </div>
  )
}

// ─── FeatureCard demos ────────────────────────────────

function FeatureCardDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FeatureCard
        icon={<Send className="text-turquoise" />}
        title="Send Money"
        description="Transfer money to friends and family instantly with just a text message."
        accent="bg-sky"
      />
      <FeatureCard
        icon={<Check className="text-cactus" />}
        title="Build Credit"
        description="Improve your credit score with our innovative credit-building tools."
        accent="bg-cactus"
      />
    </div>
  )
}

// ─── FormField demos ──────────────────────────────────

function FormFieldDemo() {
  const [card, setCard] = React.useState('')
  const [expiry, setExpiry] = React.useState('')
  const [cvv, setCvv] = React.useState('')
  const [zip, setZip] = React.useState('')

  return (
    <div className="max-w-md space-y-4">
      <FormField
        label="Card number"
        value={card}
        onChange={setCard}
        format={formatCardNumber}
        validate={(v) =>
          v.replace(/\s/g, '').length < 16 ? 'Enter a 16-digit card number' : undefined
        }
        inputMode="numeric"
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="MM/YY"
          value={expiry}
          onChange={setExpiry}
          format={formatExpiry}
          validate={(v) =>
            v.replace(/\D/g, '').length < 4 ? 'MM/YY' : undefined
          }
          inputMode="numeric"
        />
        <FormField
          label="CVV"
          value={cvv}
          onChange={setCvv}
          format={formatCVV}
          validate={(v) =>
            v.length < 3 ? '3+ digits' : undefined
          }
          inputMode="numeric"
        />
      </div>
      <FormField
        label="ZIP code"
        value={zip}
        onChange={setZip}
        format={formatZIP}
        validate={(v) =>
          v.length < 5 ? '5 digits' : undefined
        }
        inputMode="numeric"
      />
      <p className="text-xs text-muted-foreground">
        Try typing and then blurring — errors only appear after first blur.
      </p>
    </div>
  )
}

// ─── Stepper demos ────────────────────────────────────

function StepperDemo() {
  return (
    <div className="max-w-lg">
      <Stepper>
        <StepperProgress className="mb-6" />

        <StepperContent step={0}>
          <h3 className="mb-2 font-display text-lg font-bold text-foreground">Step 1: Account</h3>
          <p className="text-sm text-muted-foreground">
            Enter your email and choose a password to create your account.
          </p>
        </StepperContent>

        <StepperContent step={1}>
          <h3 className="mb-2 font-display text-lg font-bold text-foreground">Step 2: Profile</h3>
          <p className="text-sm text-muted-foreground">
            Tell us your name and upload a profile photo.
          </p>
        </StepperContent>

        <StepperContent step={2}>
          <h3 className="mb-2 font-display text-lg font-bold text-foreground">Step 3: Confirm</h3>
          <p className="text-sm text-muted-foreground">
            Review your details and confirm to finish setup.
          </p>
        </StepperContent>

        <div className="mt-6 flex justify-between">
          <StepperPrev className="rounded-full border-2 border-slate bg-transparent px-6 py-2 text-sm font-semibold text-slate transition-colors hover:bg-slate hover:text-linen" />
          <StepperNext className="rounded-full bg-turquoise px-6 py-2 text-sm font-semibold text-slate transition-colors hover:bg-turquoise/80" />
        </div>
      </Stepper>
    </div>
  )
}

// ─── ActionSheet demos ────────────────────────────────

function ActionSheetDemo() {
  return (
    <ActionSheet>
      <ActionSheetTrigger>
        <Button variant="outline">Open Action Sheet</Button>
      </ActionSheetTrigger>
      <ActionSheetContent>
        <ActionSheetHeader>
          <h3 className="text-lg font-semibold text-foreground">Share Post</h3>
          <p className="text-sm text-muted-foreground">Choose an action below</p>
        </ActionSheetHeader>
        <ActionSheetItem onClick={() => {}}>
          <Share2 /> Share to Feed
        </ActionSheetItem>
        <ActionSheetItem onClick={() => {}}>
          <Copy /> Copy Link
        </ActionSheetItem>
        <ActionSheetItem onClick={() => {}}>
          <Flag /> Report
        </ActionSheetItem>
        <ActionSheetItem
          onClick={() => {}}
          className="text-papaya [&>svg]:text-papaya"
        >
          <Trash2 /> Delete
        </ActionSheetItem>
        <ActionSheetCancel />
      </ActionSheetContent>
    </ActionSheet>
  )
}

// ─── Page ─────────────────────────────────────────────

export default function ComponentsNextPage() {
  return (
    <DesignSystemLayout
      title="Components Next"
      description="New design system components staged in components-next/ for review before promotion."
    >
      <Section
        id="status-badge"
        title="StatusBadge"
        description="CVA pill badge with semantic color variants, optional dot indicator, and icon support. Replaces inline status badge patterns."
      >
        <StatusBadgeDemo />
      </Section>

      <Section
        id="feature-card"
        title="FeatureCard"
        description="Full-color background card with slate icon container, display title, and description. Replaces inline feature card patterns."
      >
        <FeatureCardDemo />
      </Section>

      <Section
        id="form-field"
        title="FormField"
        description="Wraps FloatingInput with touched-state validation and formatting. Includes formatCardNumber, formatExpiry, formatCVV, and formatZIP utilities."
      >
        <FormFieldDemo />
      </Section>

      <Section
        id="stepper"
        title="Stepper"
        description="Compound component with progress bar, content slots, and prev/next navigation. Controlled and uncontrolled modes."
      >
        <StepperDemo />
      </Section>

      <Section
        id="action-sheet"
        title="ActionSheet"
        description="Mobile-first bottom sheet with backdrop, drag handle, auto-closing items, and body scroll lock."
      >
        <ActionSheetDemo />
      </Section>
    </DesignSystemLayout>
  )
}
