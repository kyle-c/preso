import crypto from 'crypto'

// ---------------------------------------------------------------------------
// AES-256-GCM field-level encryption for sensitive settings values.
// Uses STUDIO_JWT_SECRET as the root key material, derived via HKDF.
// ---------------------------------------------------------------------------

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16
const ENCRYPTED_PREFIX = 'enc:' // Marker to distinguish encrypted from legacy plaintext

function getDerivedKey(): Buffer {
  const secret = process.env.STUDIO_JWT_SECRET
  if (!secret) {
    throw new Error('STUDIO_JWT_SECRET is required for encryption')
  }
  // HKDF-like derivation: SHA-256 of secret + static salt
  return crypto.createHash('sha256').update(`studio-enc:${secret}`).digest()
}

/**
 * Encrypt a plaintext string. Returns a prefixed base64 string.
 * Empty strings are returned as-is (nothing to protect).
 */
export function encryptField(plaintext: string): string {
  if (!plaintext) return ''
  const key = getDerivedKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  // Format: enc:<iv>:<authTag>:<ciphertext> (all base64)
  return `${ENCRYPTED_PREFIX}${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`
}

/**
 * Decrypt a field value. Handles both encrypted (prefixed) and legacy plaintext values.
 */
export function decryptField(value: string): string {
  if (!value) return ''
  // Legacy plaintext — not encrypted
  if (!value.startsWith(ENCRYPTED_PREFIX)) return value
  try {
    const parts = value.slice(ENCRYPTED_PREFIX.length).split(':')
    if (parts.length !== 3) return '' // Corrupted
    const [ivB64, tagB64, dataB64] = parts
    const key = getDerivedKey()
    const iv = Buffer.from(ivB64, 'base64')
    const authTag = Buffer.from(tagB64, 'base64')
    const encrypted = Buffer.from(dataB64, 'base64')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
    decipher.setAuthTag(authTag)
    return decipher.update(encrypted) + decipher.final('utf8')
  } catch {
    // Decryption failed — key rotated or data corrupted
    return ''
  }
}

/** Fields in UserSettings that contain sensitive API keys */
export const SENSITIVE_FIELDS = [
  'anthropicKey',
  'googleKey',
  'openrouterKey',
  'notionKey',
  'amplitudeApiKey',
  'amplitudeSecretKey',
  'googleWorkspaceKey',
  'clickupKey',
] as const
