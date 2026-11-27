import { useEffect, useState } from 'react'
import {
  gsap,
  ScrollTrigger,
  destroySmoothScroll,
  initSmoothScroll,
  scrollToSection,
} from './lib/motion'

import Hero3D from './components/Hero3D'
import Header from './components/Header'
import MenuOverlay from './components/MenuOverlay'
import SideNav from './components/SideNav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import About from './components/About'
import Pillars from './components/Pillars'
import Fresh from './components/Fresh'
import Loloh from './components/Loloh'
import Yoga from './components/Yoga'
import Training from './components/Training'
import Gallery from './components/Gallery'
import Newsletter from './components/Newsletter'
import Visit from './components/Visit'
import Footer from './components/Footer'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    initSmoothScroll()
    return () => destroySmoothScroll()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cleanups = []
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) return
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1
        gsap.fromTo(
          el,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
      })

      gsap.utils.toArray('[data-img-reveal]').forEach((el) => {
        gsap.set(el, { clipPath: 'inset(0 0 100% 0)' })
        gsap.to(el, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      const onAnchorClick = (event) => {
        const anchor = event.target.closest('a[href^="#"]')
        if (!anchor) return
        const href = anchor.getAttribute('href')
        if (!href || href === '#' || !document.querySelector(href)) return
        event.preventDefault()
        scrollToSection(href)
      }
      document.addEventListener('click', onAnchorClick)
      cleanups.push(() => document.removeEventListener('click', onAnchorClick))
      return () => cleanups.forEach((fn) => fn())
    })

    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 240)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('resize', refresh)
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', refresh)
      ctx.revert()
    }
  }, [])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Hero3D />
      <Header onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <SideNav />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="site">
        <div id="hero-zone">
          <Hero ready />
          <Manifesto />
        </div>
        <About />
        <Pillars />
        <Fresh />
        <Loloh />
        <Yoga />
        <Training />
        <Gallery />
        <Newsletter />
        <Visit />
        <Footer />
      </main>
    </>
  )
}
