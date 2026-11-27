import { trainingGallery } from '../data/content'

export default function Training() {
  return (
    <section className="section training" id="training">
      <div className="wrap">
        <div className="training__grid">
          <div>
            <h2 className="training__title" data-reveal>
              Raw Food Chef Certification <em>in Ubud, Bali</em>
            </h2>
            <p className="training__text" data-reveal>
              Learn the art of living healthfully with <strong>Ben Richards</strong>, founder of The
              Seeds of Life Cafe. Our intimate trainings combine living food, science-based
              nutritional learning, daily classes and self-discovery, with eight years of chef
              trainings held in Bali.
            </p>
          </div>

          <div className="training__card" data-reveal>
            <div className="training__year">Ubud</div>
            <div className="training__dates">Contact for current training dates</div>
            <div className="training__card-foot">
              <a className="btn btn--solid" href="#visit">
                Ask about training
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>
            </div>
            <p className="training__card-note">
              Send us a message for the full schedule, details and registration.
            </p>
          </div>
        </div>
      </div>

      <div className="training__gallery">
        {trainingGallery.slice(0, 4).map((image) => (
          <figure key={image.src}>
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
    </section>
  )
}
