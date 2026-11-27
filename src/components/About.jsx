export default function About() {
  return (
    <section className="section about theme-cream" id="about">
      <div className="wrap">
        <div className="about__head">
          <div className="about__copy">
            <h2 className="about__title" data-reveal>
              About The Seeds of Life
              <em>and what we do</em>
            </h2>
            <div className="about__body">
              <p data-reveal>
                The Seeds of Life is about reawakening our true selves through raw living foods,
                yoga and holographic kinetics, with fun, flavor, vibrancy and integrity at the heart
                of a healthy lifestyle.
              </p>
              <p data-reveal>
                With more than 40 years of combined experience in the healing arts and culinary
                world, we offer raw chef certification programs, workshops and retreat chefs for
                events.
              </p>
            </div>
          </div>
        </div>

        <div className="about__media">
          <figure className="about__figure about__figure--tall" data-img-reveal>
            <img
              src="/images/raw-food-bali.webp"
              alt="Raw vegan culinary art at The Seeds of Life in Ubud, Bali"
              loading="lazy"
            />
            <figcaption>Vibrant living foods</figcaption>
          </figure>

          <figure className="about__figure about__figure--wide" data-img-reveal>
            <img
              src="/images/sol-slider.webp"
              alt="The Seeds of Life raw food cafe and tonic bar storefront on Jalan Gautama, Ubud"
              loading="lazy"
            />
            <figcaption>Jalan Gautama, Ubud</figcaption>
          </figure>

          <div className="about__badge" aria-hidden="true">
            <span>100% raw &amp; vegan</span>
          </div>
        </div>
      </div>
    </section>
  )
}
