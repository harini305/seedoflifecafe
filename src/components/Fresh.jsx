import { links } from '../data/content'

export default function Fresh() {
  return (
    <section className="fresh" aria-label="Clean and fresh vibrant living foods">
      <div className="fresh__bg" data-parallax="0.1" aria-hidden="true" />
      <div className="fresh__content">
        <h2 className="fresh__title" data-reveal>
          <span>Vibrant</span>
          <span>Living Foods</span>
        </h2>
        <p className="fresh__text" data-reveal>
          Our ingredients are grown on the side of an active volcano in Ubud, Bali, then picked and
          delivered fresh to our cafe every morning.
        </p>
        <div className="fresh__cta" data-reveal>
          <a className="btn btn--solid" href={links.menu}>
            Explore vibrant living foods
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
