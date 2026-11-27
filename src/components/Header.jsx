import { useEffect, useRef } from 'react'
import { nav, links } from '../data/content'

export default function Header({ onOpenMenu, menuOpen }) {
  const headerRef = useRef(null)
  const lastY = useRef(0)

  useEffect(() => {
    const el = headerRef.current
    const onScroll = () => {
      const y = window.scrollY
      const footer = document.querySelector('.footer')
      const footerReached = footer && footer.getBoundingClientRect().top <= window.innerHeight - 8
      el.classList.toggle('is-scrolled', y > 60)
      if (footerReached) {
        el.classList.add('is-hidden')
      } else if (menuOpen) {
        el.classList.remove('is-hidden')
      } else if (y > 420 && y > lastY.current) {
        el.classList.add('is-hidden')
      } else {
        el.classList.remove('is-hidden')
      }
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  return (
    <header className="header" ref={headerRef}>
      <a className="brand" href="#top" aria-label="The Seeds of Life — back to top">
        <img
          className="brand__mark"
          src="/images/THESEEDOFLIFE_logo-01.webp"
          alt="The Seeds of Life tree emblem"
          width="46"
          height="46"
        />
        <span className="brand__text">
          <span className="brand__name">The Seeds of Life</span>
        </span>
      </a>

      <nav className="header__nav" aria-label="Primary">
        {nav.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header__right">
        <a className="btn btn--sm btn--ghost" href={links.menu}>
          Our Food
        </a>
        <button
          className="menu-toggle"
          type="button"
          onClick={onOpenMenu}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span className="menu-toggle__lines" aria-hidden="true">
            <i />
            <i />
          </span>
          Menu
        </button>
      </div>
    </header>
  )
}
