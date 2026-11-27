import { nav, links, visit } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__top">
          <a className="footer__brand" href="#top">
            <img src="/images/THESEEDOFLIFE_logo-01.webp" alt="The Seeds of Life emblem" loading="lazy" />
            <span className="footer__brand-text">
              <strong>The Seeds of Life</strong>
              <span>Raw Food Cafe &amp; Tonic Bar</span>
            </span>
          </a>

          <nav className="footer__nav" aria-label="Footer">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>

          <div className="footer__contact">
            <a href={links.phone}>{visit.phone}</a>
            <span>Open daily {visit.hours}</span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} The Seeds of Life Cafe, Ubud</span>
          <a href="#newsletter">Join our newsletter</a>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
