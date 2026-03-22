import { getServerSession } from '@/lib/studio-auth'
import { AuthForm } from '@/components/studio/auth-form'
import { FelixLogo } from '@/components/design-system/felix-logo'
import { AvatarDropdown } from '@/components/studio/avatar-dropdown'
import { BrandProvider } from '@/lib/brand-context'

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar — transparent, no border */}
      <header className="h-14 flex items-center justify-between px-6">
        <a href="/create" className="flex items-center gap-2.5">
          <FelixLogo className="h-5 w-auto text-foreground" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono leading-none mt-px">
            Studio
          </span>
        </a>

        <AvatarDropdown email={session.user.email} />
      </header>

      {/* Main content */}
      <BrandProvider>
        <main>{children}</main>
      </BrandProvider>
    </div>
  )
}
