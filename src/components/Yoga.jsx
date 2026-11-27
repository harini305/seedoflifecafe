export default function Yoga() {
  return (
    <section className="section yoga theme-cream" id="yoga">
      <div className="wrap">
        <div className="yoga__grid">
          <div className="yoga__media" data-img-reveal>
            <div className="yoga__media-frame">
              <img
                src="/images/instructor-new.webp"
                alt="Iain Grysak of Spacious Yoga Bali, teaching Ashtanga at The Seeds of Life"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <h2 className="yoga__title" data-reveal>
              Daily Mysore
              <em>Practice with Iain Grysak</em>
            </h2>
            <p className="yoga__lead" data-reveal>
              Join a daily Mysore-style Ashtanga practice led by Iain Grysak of Spacious Yoga Bali.
              Upstairs at the cafe, we offer the traditional Mysore program with workshops and
              retreats throughout the year.
            </p>
            <blockquote className="yoga__quote" data-reveal>
              “Long term Mysore style practice is the only way to truly experience the unfolding of
              this method in the body, mind and nervous system in a sustainable and fully integrated
              way.”
              <small>Iain Grysak, Spacious Yoga Bali</small>
            </blockquote>
            <div className="yoga__facts" data-reveal>
              <span className="chip">Daily Mysore</span>
              <span className="chip">15+ years teaching</span>
              <span className="chip">Upstairs at the cafe</span>
              <span className="chip">Workshops &amp; retreats</span>
            </div>
            <div className="yoga__actions" data-reveal>
              <a className="btn btn--solid" href="#visit">
                Ask about daily classes
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
