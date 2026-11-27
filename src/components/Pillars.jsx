import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'
import { pillars } from '../data/content'

export default function Pillars() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const section = sectionRef.current
      const track = trackRef.current
      const amount = () => Math.max(track.scrollWidth - window.innerWidth, 0)
      const tween = gsap.to(track, {
        x: () => -amount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + (amount() + window.innerHeight * 0.45),
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="pillars" id="experience" ref={sectionRef}>
      <div className="pillars__pin">
        <div className="pillars__head">
          <h2 className="section-title" data-reveal>
            We&apos;ve got a bit going on here.
            <em>Allow us to give you a tour</em>
          </h2>
        </div>

        <div className="pillars__track" ref={trackRef}>
          {pillars.map((pillar, i) => (
            <article className="pillar" key={pillar.n}>
              <div className="pillar__media">
                <img
                  src={pillar.image}
                  alt={pillar.alt}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  draggable="false"
                />
              </div>
              <div className="pillar__body">
                <h3 className="pillar__title">{pillar.title}</h3>
                <p className="pillar__text">{pillar.body}</p>
                <a className="link-underline pillar__link" href={pillar.href}>
                  {pillar.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
