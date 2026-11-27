import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

let lenis = null
let tickerFn = null

export function initSmoothScroll() {
  if (lenis) return lenis
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  lenis = new Lenis({
    lerp: reduce ? 1 : 0.085,
    smoothWheel: !reduce,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    syncTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)
  tickerFn = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function destroySmoothScroll() {
  if (tickerFn) gsap.ticker.remove(tickerFn)
  if (lenis) lenis.destroy()
  lenis = null
  tickerFn = null
}

export function getLenis() {
  return lenis
}

export function scrollToSection(target) {
  if (!target) return
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4 })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export function stopScroll() {
  lenis?.stop()
}

export function startScroll() {
  lenis?.start()
}

/** Split an element's text into word spans wrapped in overflow-hidden lines. */
export function splitWords(el) {
  if (!el || el.dataset.split === 'true') return []
  const text = el.textContent.trim()
  el.textContent = ''
  el.dataset.split = 'true'
  const words = text.split(/\s+/)
  const spans = []
  words.forEach((word, i) => {
    const outer = document.createElement('span')
    outer.className = 'word'
    const inner = document.createElement('span')
    inner.className = 'word-inner'
    inner.textContent = word
    outer.appendChild(inner)
    el.appendChild(outer)
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '))
    spans.push(inner)
  })
  return spans
}

/** Split text into individual characters, preserving spaces. */
export function splitChars(el) {
  if (!el || el.dataset.split === 'true') return []
  const text = el.textContent
  el.textContent = ''
  el.dataset.split = 'true'
  const spans = []
  for (const ch of text) {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '))
      continue
    }
    const outer = document.createElement('span')
    outer.className = 'char'
    const inner = document.createElement('span')
    inner.className = 'char-inner'
    inner.textContent = ch
    outer.appendChild(inner)
    el.appendChild(outer)
    spans.push(inner)
  }
  return spans
}
