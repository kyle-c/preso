import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM_ADDRESS = process.env.STUDIO_FROM_EMAIL ?? 'Felix Studio <studio@felixpago.com>'

export async function sendMagicLinkEmail(
  to: string,
  token: string,
  origin: string,
): Promise<void> {
  const verifyUrl = `${origin}/create/verify?token=${token}`

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: 'Verify your Felix Studio account',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="display: inline-block; padding: 6px 16px; border: 1px solid rgba(0, 206, 209, 0.3); border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #00CED1; font-family: monospace;">
            Felix Studio
          </span>
        </div>

        <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 16px;">
          Verify your email
        </h1>

        <p style="font-size: 15px; color: #64748b; text-align: center; line-height: 1.6; margin-bottom: 32px;">
          Click the button below to verify your email address and activate your Felix Studio account.
        </p>

        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background-color: #00CED1; color: #0f172a; font-weight: 600; font-size: 15px; text-decoration: none; border-radius: 12px;">
            Verify Email
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
          This link expires in 15 minutes. If you didn't create a Felix Studio account, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 16px;" />

        <p style="font-size: 11px; color: #cbd5e1; text-align: center;">
          Felix Studio &mdash; AI-powered presentations
        </p>
      </div>
    `,
  })
}
