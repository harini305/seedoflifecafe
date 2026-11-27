import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'
import { links } from '../data/content'

export default function Hero({ ready }) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (!ready) return undefined
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      gsap.set('[data-hw]', { yPercent: 118, y: 0 })
      tl.to('[data-hw]', { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.05)
        .fromTo(
          '[data-hero-fade]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          0.3,
        )
    }, rootRef)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero" id="top" ref={rootRef}>
      <figure className="hero__card" data-hero-fade>
        <div className="hero__card-inner">
          <img
            src="/images/sol-slider.webp"
            alt="The Seeds of Life raw food cafe and tonic bar on Jalan Gautama in Ubud, Bali"
            width="640"
            height="800"
          />
          <figcaption>The cafe in Ubud</figcaption>
        </div>
      </figure>

      <div className="hero__center">
        <h1 className="hero__title">
          <span className="line">
            <span className="word">
              <span className="word-inner" data-hw>
                The Seeds
              </span>
            </span>
          </span>
          <span className="line line--accent">
            <span className="word">
              <span className="word-inner" data-hw>
                of Life
              </span>
            </span>
          </span>
        </h1>
        <p className="hero__sub" data-hero-fade>
          The most exciting and creative Raw Food Cafe Bali has ever seen.
        </p>
        <div className="hero__actions" data-hero-fade>
          <a className="btn btn--solid" href="#about">
            Read about our cafe
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
          <a className="btn btn--ghost" href={links.menu}>
            Explore our food
          </a>
        </div>
      </div>
    </section>
  )
}
