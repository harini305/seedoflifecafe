import { useEffect, useRef, useState } from 'react'
import { lolohOfferings } from '../data/content'

export default function Loloh() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let visible = false
    let interval
    const update = () => {
      window.clearInterval(interval)
      if (visible && !paused) {
        interval = window.setInterval(() => {
          setActive((current) => (current + 1) % lolohOfferings.length)
        }, 6500)
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    }, { threshold: 0.25 })
    observer.observe(section)
    return () => {
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [paused])

  return (
    <section
      className="section loloh"
      id="loloh"
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="wrap">
        <div className="loloh__grid">
          <div className="loloh__visual">
            {lolohOfferings.map((item, i) => (
              <div className={`loloh__img ${active === i ? 'is-active' : ''}`} key={item.title}>
                <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
              </div>
            ))}
            <span className="loloh__visual-cap">{lolohOfferings[active].title}</span>
          </div>

          <div className="loloh__content">
            <h2 className="loloh__title" data-reveal>
              Loloh Tonic Bar
              <em>For superior health &amp; longevity</em>
            </h2>
            <p className="loloh__intro" data-reveal>
              Ancient Taoist herbal wisdom meets Chinese, Ayurvedic and Indonesian Jamu traditions.
              For over 5000 years, master herbalists have studied nature to support health and
              longevity in harmony with the yin and yang principles.
            </p>

            <div className="loloh__list" data-reveal>
              {lolohOfferings.map((item, i) => (
                <button
                  type="button"
                  key={item.title}
                  className={`loloh__item ${active === i ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                  aria-expanded={active === i}
                >
                  <span className="loloh__item-head">
                    <span className="loloh__item-title">{item.title}</span>
                    <span className="loloh__item-plus" aria-hidden="true" />
                  </span>
                  <span className="loloh__item-body">
                    <div>
                      <p>{item.body}</p>
                    </div>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
