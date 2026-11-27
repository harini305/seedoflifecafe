import { chromium } from 'playwright'
import fs from 'node:fs'

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-proxy-server', '--enable-webgl', '--use-gl=angle'] })
const ctx = await browser.newContext({ viewport: { width: 1600, height: 950 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()

const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('CONSOLE: ' + m.text())
})
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('requestfailed', (r) => {
  const url = r.url()
  if (!url.includes('favicon')) errors.push('REQFAIL: ' + url + ' ' + r.failure()?.errorText)
})

await page.goto('http://127.0.0.1:3000/', { waitUntil: 'load', timeout: 60000 })
await page.waitForTimeout(4200)
fs.mkdirSync('shots', { recursive: true })
await page.screenshot({ path: 'shots/01-hero.png' })

await page.mouse.move(1100, 400)
await page.waitForTimeout(900)
await page.screenshot({ path: 'shots/02-hero-moved.png' })

const scrollTo = async (sel, name) => {
  await page.evaluate((s) => {
    const el = document.querySelector(s)
    el?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, sel)
  await page.waitForTimeout(1400)
  await page.screenshot({ path: `shots/${name}.png` })
}

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.05))
await page.waitForTimeout(1300)
await page.screenshot({ path: 'shots/03-manifesto.png' })

await scrollTo('#about', '04-about')
await scrollTo('#experience', '05-pillars')
await page.evaluate(() => window.scrollBy(0, 700))
await page.waitForTimeout(1200)
await page.screenshot({ path: 'shots/06-pillars-2.png' })
await scrollTo('.fresh', '07-fresh')
await scrollTo('#loloh', '08-loloh')
await scrollTo('#yoga', '09-yoga')
await scrollTo('#training', '10-training')
await scrollTo('.quote', '11-quote')
await scrollTo('#gallery', '12-gallery')
await scrollTo('#newsletter', '13-newsletter')
await scrollTo('#visit', '14-visit')
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1200)
await page.screenshot({ path: 'shots/15-footer.png' })

// menu overlay
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)
await page.click('.menu-toggle')
await page.waitForTimeout(1400)
await page.screenshot({ path: 'shots/16-menu.png' })
await page.click('.menu-overlay__close')
await page.waitForTimeout(900)

// gallery drag
await page.evaluate(() => document.querySelector('#gallery').scrollIntoView({ block: 'center' }))
await page.waitForTimeout(1200)
const box = await page.locator('.gallery__stage').boundingBox()
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 260, box.y + box.height / 2, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'shots/17-gallery-dragged.png' })
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2 - 40)
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'shots/18-lightbox.png' })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
}

// newsletter form
await page.evaluate(() => document.querySelector('#newsletter').scrollIntoView({ block: 'center' }))
await page.waitForTimeout(800)
await page.fill('#nl-name', 'Test Guest')
await page.fill('#nl-email', 'guest@example.com')
await page.click('.newsletter__form button[type=submit]')
await page.waitForTimeout(900)
await page.screenshot({ path: 'shots/19-newsletter-success.png' })

const metrics = await page.evaluate(() => ({
  scrollHeight: document.body.scrollHeight,
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
  canvas: (() => {
    const c = document.querySelector('.hero-3d canvas')
    return c ? { w: c.width, h: c.height } : null
  })(),
  images: [...document.images].map((i) => ({
    src: i.currentSrc || i.src,
    ok: i.complete && i.naturalWidth > 0,
  })),
}))

console.log('ERRORS:', errors.length ? JSON.stringify(errors, null, 2) : 'none')
console.log('BROKEN IMAGES:', metrics.images.filter((i) => !i.ok).map((i) => i.src))
console.log('METRICS:', { scrollHeight: metrics.scrollHeight, canvas: metrics.canvas })

// mobile pass
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const mpage = await mctx.newPage()
const merrors = []
mpage.on('pageerror', (e) => merrors.push(e.message))
await mpage.goto('http://127.0.0.1:3000/', { waitUntil: 'load', timeout: 60000 })
await mpage.waitForTimeout(4200)
await mpage.screenshot({ path: 'shots/m1-hero.png' })
await mpage.evaluate(() => document.querySelector('#about').scrollIntoView({ block: 'start' }))
await mpage.waitForTimeout(1400)
await mpage.screenshot({ path: 'shots/m2-about.png' })
await mpage.evaluate(() => document.querySelector('#experience').scrollIntoView({ block: 'start' }))
await mpage.waitForTimeout(1400)
await mpage.screenshot({ path: 'shots/m3-pillars.png' })
await mpage.evaluate(() => document.querySelector('#gallery').scrollIntoView({ block: 'center' }))
await mpage.waitForTimeout(1400)
await mpage.screenshot({ path: 'shots/m4-gallery.png' })
await mpage.evaluate(() => document.querySelector('#visit').scrollIntoView({ block: 'start' }))
await mpage.waitForTimeout(1400)
await mpage.screenshot({ path: 'shots/m5-visit.png' })
await mpage.click('.menu-toggle')
await mpage.waitForTimeout(1300)
await mpage.screenshot({ path: 'shots/m6-menu.png' })

const overflow = await mpage.evaluate(() => ({
  docW: document.documentElement.scrollWidth,
  winW: window.innerWidth,
  wide: [...document.querySelectorAll('body *')]
    .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 2)
    .slice(0, 12)
    .map((el) => el.className || el.tagName),
}))

console.log('MOBILE ERRORS:', merrors.length ? merrors : 'none')
console.log('MOBILE OVERFLOW:', overflow)

await browser.close()
