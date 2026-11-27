import { useEffect, useRef, useState } from 'react'

export default function Hero3D() {
  const canvasRef = useRef(null)
  const progressRef = useRef(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let dispose
    let cancelled = false

    const updateProgress = () => {
      const zone = document.getElementById('hero-zone')
      const span = zone ? Math.max(zone.offsetHeight - window.innerHeight, 1) : window.innerHeight
      progressRef.current = Math.min(1, Math.max(0, window.scrollY / span))
    }
    const onContextLost = (event) => {
      event.preventDefault()
      setFailed(true)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    canvasRef.current?.addEventListener('webglcontextlost', onContextLost)

    import('../hero/scene.js')
      .then(({ createHeroScene }) => {
        if (cancelled) return
        try {
          dispose = createHeroScene(canvasRef.current, {
            progressRef,
            onReady: () => {
              if (!cancelled) setReady(true)
            },
          })
          if (!dispose) setFailed(true)
        } catch (err) {
          console.error('Hero scene failed to initialise', err)
          setFailed(true)
        }
      })
      .catch((err) => {
        console.error('Hero scene failed to load', err)
        setFailed(true)
      })

    return () => {
      cancelled = true
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      canvasRef.current?.removeEventListener('webglcontextlost', onContextLost)
      dispose?.()
    }
  }, [])

  return (
    <div className={`hero-3d${ready ? ' is-ready' : ''}`} aria-hidden="true">
      <div className="hero-3d__fallback" />
      {!failed && <canvas ref={canvasRef} />}
      <div className="hero-3d__glow" />
    </div>
  )
}
