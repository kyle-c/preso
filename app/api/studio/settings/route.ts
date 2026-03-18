import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionUserId } from '@/lib/studio-auth'
import { getUserSettings, setUserSettings, getUserById, type UserSettings } from '@/lib/studio-db'
import { settingsSchema } from '@/lib/studio-schemas'
import { auditLog } from '@/lib/studio-audit'

export const runtime = 'nodejs'

/** Return masked settings — integration keys are replaced with booleans */
function maskSettings(settings: UserSettings) {
  return {
    provider: settings.provider,
    anthropicKey: settings.anthropicKey,
    googleKey: settings.googleKey,
    openrouterKey: settings.openrouterKey,
    anthropicModel: settings.anthropicModel,
    googleModel: settings.googleModel,
    openrouterModel: settings.openrouterModel,
    hasNotionKey: !!settings.notionKey,
    hasAmplitudeKeys: !!(settings.amplitudeApiKey && settings.amplitudeSecretKey),
    hasGoogleWorkspaceKey: !!settings.googleWorkspaceKey,
    hasClickupKey: !!settings.clickupKey,
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = await getSessionUserId(cookieStore)
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const [settings, user] = await Promise.all([
      getUserSettings(userId),
      getUserById(userId),
    ])

    return NextResponse.json({
      settings: maskSettings(settings),
      email: user?.email ?? null,
    })
  } catch (err) {
    console.error('[studio/settings GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = await getSessionUserId(cookieStore)
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const raw = await req.json()
    const parsed = settingsSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    // Track which sensitive fields changed for audit
    const keyFields = ['anthropicKey', 'googleKey', 'openrouterKey', 'notionKey', 'amplitudeApiKey', 'amplitudeSecretKey', 'googleWorkspaceKey', 'clickupKey'] as const
    const changedKeys = keyFields.filter(k => parsed.data[k] !== undefined)

    const updated = await setUserSettings(userId, parsed.data)

    if (changedKeys.length > 0) {
      await auditLog('settings.keys_changed', { userId, metadata: { fields: changedKeys } })
    } else {
      await auditLog('settings.updated', { userId, metadata: { fields: Object.keys(parsed.data) } })
    }

    return NextResponse.json({
      settings: maskSettings(updated),
    })
  } catch (err) {
    console.error('[studio/settings PUT]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
