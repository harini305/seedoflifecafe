import { useCallback, useEffect, useRef, useState } from 'react'
import { gallery } from '../data/content'

function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.add('is-locked')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [onClose])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption} onClick={onClose}>
      <button className="lightbox__close" type="button" onClick={onClose} aria-label="Close image">
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        <figcaption className="lightbox__cap">{item.caption}</figcaption>
      </figure>
    </div>
  )
}

export default function Gallery() {
  const ringRef = useRef(null)
  const stageRef = useRef(null)
  const rot = useRef(0)
  const target = useRef(0)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startTarget = useRef(0)
  const moved = useRef(0)
  const [radius, setRadius] = useState(380)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      if (width <= 700) {
        setRadius(Math.max(104 * 1.65, width * 0.44))
        return
      }
      const cardWidth = Math.min(210, Math.max(120, width * 0.15))
      setRadius(Math.max(cardWidth * 1.7, Math.min(width * 0.36, 430)))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    let raf
    let visible = true
    const tick = () => {
      if (visible && Math.abs(target.current - rot.current) > 0.001) {
        rot.current += (target.current - rot.current) * 0.12
        if (ringRef.current) ringRef.current.style.transform = `rotateY(${rot.current}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    if (stageRef.current) observer.observe(stageRef.current)
    raf = requestAnimationFrame(tick)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  const onPointerDown = useCallback((event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragging.current = true
    startX.current = event.clientX
    startTarget.current = target.current
    moved.current = 0
    const move = (moveEvent) => {
      if (!dragging.current) return
      const delta = moveEvent.clientX - startX.current
      moved.current = Math.max(moved.current, Math.abs(delta))
      target.current = startTarget.current + delta * 0.42
    }
    const up = () => {
      dragging.current = false
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }, [])

  const step = 360 / gallery.length

  return (
    <section className="section gallery theme-cream" id="gallery">
      <div className="wrap">
        <div className="gallery__head">
          <h2 className="section-title" data-reveal>Life at <em>the cafe</em></h2>
          <span className="gallery__hint" data-reveal>Drag to rotate</span>
        </div>
      </div>

      <div className="gallery__stage" ref={stageRef} onPointerDown={onPointerDown}>
        <div className="gallery__ring" ref={ringRef}>
          {gallery.map((item, i) => (
            <button
              className="gallery__card"
              type="button"
              key={item.src}
              style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              onClick={() => {
                if (moved.current < 8) setSelected(i)
              }}
              aria-label={`Open ${item.caption}`}
            >
              <span className="gallery__card-inner">
                <img src={item.src} alt={item.alt} loading={i < 6 ? 'eager' : 'lazy'} draggable="false" />
                <span className="gallery__caption">{item.caption}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="gallery__floor" aria-hidden="true" />
      </div>

      {selected !== null && <Lightbox item={gallery[selected]} onClose={() => setSelected(null)} />}
    </section>
  )
}
