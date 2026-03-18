/**
 * Capture all fintechtestflow screens as high-quality @3x PNGs for Figma import.
 * Clips to just the phone frame element for clean exports.
 *
 * Run: node scripts/capture-fintechtestflow.mjs
 */

import puppeteer from 'puppeteer'
import { setTimeout } from 'timers/promises'

const BASE = 'http://localhost:3000/fintechtestflow'
const OUT = 'exports/fintechtestflow'
const PASSWORD = 'felix2026andbeyond!'

// Use a wide viewport so the phone frame renders centered with room
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 2 }

async function capturePhone(page, name) {
  console.log(`  📸 ${name}`)
  // Find the phone frame element and clip to it
  const phoneEl = await page.$('[class*="rounded-[52px]"], [class*="rounded-\\[52px\\]"]')
  if (phoneEl) {
    await phoneEl.screenshot({ path: `${OUT}/${name}.png` })
  } else {
    // Fallback: try to find the main phone container
    const container = await page.$('[class*="phone"], [class*="iPhone"], [class*="device"]')
    if (container) {
      await container.screenshot({ path: `${OUT}/${name}.png` })
    } else {
      // Last resort: clip center of page
      const clip = { x: 50, y: 70, width: 390, height: 844 }
      await page.screenshot({ path: `${OUT}/${name}.png`, clip })
    }
  }
}

async function clickButton(page, ...texts) {
  const clicked = await page.evaluate((texts) => {
    const btns = Array.from(document.querySelectorAll('button'))
    for (const text of texts) {
      const btn = btns.find(b => b.textContent?.toLowerCase().includes(text.toLowerCase()))
      if (btn && !btn.disabled) { btn.click(); return true }
    }
    return false
  }, texts)
  await setTimeout(800)
  return clicked
}

async function fillInput(page, matcher, value) {
  await page.evaluate(({ matcher, value }) => {
    const inputs = document.querySelectorAll('input')
    for (const inp of inputs) {
      const id = (inp.id || '').toLowerCase()
      const name = (inp.name || '').toLowerCase()
      const placeholder = (inp.placeholder || '').toLowerCase()
      const all = id + ' ' + name + ' ' + placeholder
      if (all.includes(matcher)) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        if (setter) {
          setter.call(inp, value)
          inp.dispatchEvent(new Event('input', { bubbles: true }))
          inp.dispatchEvent(new Event('change', { bubbles: true }))
        }
        return
      }
    }
  }, { matcher, value })
}

async function enterPassword(page) {
  const input = await page.$('input[type="password"]')
  if (input) {
    await input.type(PASSWORD)
    await clickButton(page, 'Continue', 'Submit')
    await setTimeout(1500)
    console.log('  🔓 Password entered')
  }
}

async function selectPaymentOption(page, ...keywords) {
  await page.evaluate((keywords) => {
    // Click on the payment method card that contains the keyword
    const cards = document.querySelectorAll('div[class*="cursor"], label, [role="radio"]')
    for (const card of cards) {
      const text = card.textContent || ''
      for (const kw of keywords) {
        if (text.toLowerCase().includes(kw.toLowerCase())) {
          card.click()
          return
        }
      }
    }
    // Fallback: try all clickable elements
    const all = document.querySelectorAll('*')
    for (const el of all) {
      if (el.children.length > 0) continue // skip containers
      const text = el.textContent || ''
      for (const kw of keywords) {
        if (text.toLowerCase().includes(kw.toLowerCase())) {
          el.closest('[class*="cursor"], button, label, [role="radio"]')?.click()
          return
        }
      }
    }
  }, keywords)
  await setTimeout(500)
}

async function main() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport(VIEWPORT)

  // ─── CARD FLOW ──────────────────────────────────────────
  console.log('\n🃏 Card Payment Flow')
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 })
  await setTimeout(1000)
  await enterPassword(page)

  await capturePhone(page, '01-payment-method')

  // Select Card
  await selectPaymentOption(page, 'Debit', 'Credit', 'Card', 'Tarjeta')
  await capturePhone(page, '02-card-selected')

  // Continue → Address
  await clickButton(page, 'Continue', 'Continuar')
  await capturePhone(page, '03-address-empty')

  // Fill address
  await fillInput(page, 'address', '123 Main St')
  await fillInput(page, 'apt', 'Apt 4B')
  await fillInput(page, 'zip', '77001')
  await fillInput(page, 'city', 'Houston')
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select')
    for (const s of selects) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set
      if (setter) {
        setter.call(s, 'TX')
        s.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }
  })
  await setTimeout(300)
  await capturePhone(page, '04-address-filled')

  // Continue → Card Details
  await clickButton(page, 'Continue', 'Continuar')
  await capturePhone(page, '05-card-details-empty')

  // Fill card
  await fillInput(page, 'name', 'Carlos Hernandez')
  await fillInput(page, 'card', '4242424242424242')
  await fillInput(page, 'number', '4242424242424242')
  await fillInput(page, 'exp', '1228')
  await fillInput(page, 'cvv', '123')
  await fillInput(page, 'cvc', '123')
  await setTimeout(300)
  await capturePhone(page, '06-card-details-filled')

  // Continue → Review
  await clickButton(page, 'Continue', 'Continuar', 'Review')
  await capturePhone(page, '07-review')

  // Confirm → Success
  await clickButton(page, 'Confirm', 'Send', 'Pay', 'Enviar', 'Pagar', 'Confirmar')
  await setTimeout(1500)
  await capturePhone(page, '08-success')

  // ─── BANK FLOW ──────────────────────────────────────────
  console.log('\n🏦 Bank Payment Flow')
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 })
  await setTimeout(1000)
  await enterPassword(page)

  await selectPaymentOption(page, 'Bank', 'Banco', 'Account', 'bancaria')
  await capturePhone(page, '09-bank-selected')

  await clickButton(page, 'Continue', 'Continuar')
  await capturePhone(page, '10-bank-consent')

  await clickButton(page, 'Accept', 'Agree', 'Continue', 'Aceptar', 'Continuar')
  await capturePhone(page, '11-bank-connect')

  // ─── CASH / STORE FLOW ─────────────────────────────────
  console.log('\n🏪 Cash at Store Flow')
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 })
  await setTimeout(1000)
  await enterPassword(page)

  await selectPaymentOption(page, 'Cash', 'Store', 'Efectivo', 'Tienda')
  await capturePhone(page, '12-cash-selected')

  await clickButton(page, 'Continue', 'Continuar')
  await capturePhone(page, '13-cash-address-or-store')

  // Try to advance one more step for store selection
  await clickButton(page, 'Continue', 'Continuar')
  await capturePhone(page, '14-store-map')

  await browser.close()

  // List results
  const { readdirSync, statSync } = await import('fs')
  const files = readdirSync(OUT).filter(f => f.endsWith('.png')).sort()
  console.log(`\n✅ ${files.length} screenshots saved to ${OUT}/`)
  for (const f of files) {
    const size = statSync(`${OUT}/${f}`).size
    console.log(`  ${f} (${(size / 1024).toFixed(0)}KB)`)
  }
  console.log('\nDrag these @2x PNGs into your Figma file at:')
  console.log('https://www.figma.com/design/vcEscud8M7uH5C3pZbFxHc/Untitled?node-id=17-325')
}

main().catch(console.error)
