import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf

    const move = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
    }

    const tick = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    const over = (e) => {
      const target = e.target.closest('a, button, [data-cursor]')
      if (!target) return
      ring.classList.add('is-hover')
      if (target.dataset.cursor === 'drag') ring.classList.add('is-drag')
      label.textContent = target.dataset.cursorLabel || ''
    }

    const out = (e) => {
      const target = e.target.closest('a, button, [data-cursor]')
      if (!target) return
      ring.classList.remove('is-hover', 'is-drag')
      label.textContent = ''
    }

    const leave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const enter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span ref={labelRef} />
      </div>
    </>
  )
}
