import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion'
import SeedMark from './SeedMark'

export default function Preloader({ onReveal }) {
  const rootRef = useRef(null)
  const innerRef = useRef(null)
  const barRef = useRef(null)
  const countRef = useRef(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const counter = { v: 0 }
    const tl = gsap.timeline({
      onComplete: () => setHidden(true),
    })

    tl.to(barRef.current, { scaleX: 1, duration: 1.35, ease: 'power2.inOut' }, 0)
    tl.to(
      counter,
      {
        v: 100,
        duration: 1.35,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = String(Math.round(counter.v)).padStart(2, '0')
          }
        },
      },
      0,
    )
    tl.to({}, { duration: 0.18 })
    tl.add(() => onReveal?.())
    tl.to(innerRef.current, { opacity: 0, y: -22, duration: 0.45, ease: 'power2.in' })
    tl.to(rootRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.9,
      ease: 'power4.inOut',
    }, '-=0.15')

    return () => tl.kill()
  }, [onReveal])

  if (hidden) return null

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <div className="preloader__inner" ref={innerRef}>
        <div className="preloader__mark">
          <SeedMark />
        </div>
        <div className="preloader__word">The Seeds of Life</div>
        <div className="preloader__bar">
          <span ref={barRef} />
        </div>
        <div className="preloader__count" ref={countRef}>
          00
        </div>
      </div>
    </div>
  )
}
