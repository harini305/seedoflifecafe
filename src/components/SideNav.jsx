import { useEffect, useState } from 'react'
import { scrollToSection } from '../lib/motion'

const items = [
  { id: 'top', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'loloh', label: 'Loloh' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'training', label: 'Training' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'visit', label: 'Visit' },
]

export default function SideNav() {
  const [active, setActive] = useState('top')

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.15, 0.4, 0.7] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="side-nav" aria-label="Section navigation">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`side-nav__item ${active === item.id ? 'is-active' : ''}`}
          onClick={() => scrollToSection('#' + item.id)}
        >
          <span>{item.label}</span>
          <i />
        </button>
      ))}
    </nav>
  )
}
