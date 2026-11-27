import { useEffect, useRef, useState } from 'react'
import { gsap, scrollToSection, startScroll, stopScroll } from '../lib/motion'
import { menuLinks, links, visit } from '../data/content'

export default function MenuOverlay({ open, onClose }) {
  const rootRef = useRef(null)
  const linksRef = useRef([])
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    if (open) {
      document.body.classList.add('is-locked')
      stopScroll()
      gsap.killTweensOf(root)
      gsap.set(root, { visibility: 'visible', pointerEvents: 'auto' })
      gsap.to(root, { clipPath: 'inset(0 0 0% 0)', duration: 0.55, ease: 'power3.inOut' })
      gsap.fromTo(
        linksRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.035, delay: 0.16, ease: 'power3.out' },
      )
    } else {
      document.body.classList.remove('is-locked')
      startScroll()
      gsap.killTweensOf(root)
      gsap.to(root, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(root, { visibility: 'hidden', pointerEvents: 'none' }),
      })
      setHover(null)
    }
    return undefined
  }, [open])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const go = (href) => {
    onClose()
    window.setTimeout(() => scrollToSection(href), 280)
  }

  return (
    <div
      id="site-menu"
      className="menu-overlay"
      ref={rootRef}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="menu-overlay__glow" />
      <div className="menu-overlay__brand">
        <img src="/images/THESEEDOFLIFE_logo-01.webp" alt="" width="42" height="42" />
        <span>The Seeds of Life</span>
      </div>
      <button className="menu-overlay__close" type="button" onClick={onClose}>
        Close
      </button>

      <div className="menu-overlay__left">
        <div className="menu-overlay__group">
          {menuLinks.map((item, i) => (
            <button
              key={item.href}
              className="menu-overlay__link"
              type="button"
              ref={(el) => (linksRef.current[i] = el)}
              onClick={() => go(item.href)}
              onMouseEnter={() => setHover(item.label)}
              onMouseLeave={() => setHover(null)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="menu-overlay__right">
        <div className={`menu-overlay__preview ${hover ? 'is-visible' : 'is-idle'}`}>
          <img src="/images/sol-slider.webp" alt="The Seeds of Life cafe in Ubud" />
        </div>
        <div className="menu-overlay__meta">
          <span>{visit.address}</span>
          <a href={links.phone}>{visit.phone}</a>
          <a href={links.whatsapp} target="_blank" rel="noreferrer noopener">
            WhatsApp {visit.whatsapp}
          </a>
          <span>Open daily {visit.hours}</span>
        </div>
      </div>
    </div>
  )
}
