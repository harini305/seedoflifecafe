import { links } from '../data/content'

const shots = [
  { src: '/images/raw-food-bali.webp', alt: 'Raw vegan table spread at The Seeds of Life', label: 'Vibrant living foods' },
  { src: '/images/tea2.webp', alt: 'Wild ancient artisan tea from the Loloh tonic bar', label: 'Wild ancient teas' },
  { src: '/images/raw-cheesecake2.webp', alt: 'Raw vegan cheesecake dessert', label: 'Guilt-free desserts' },
]

export default function Manifesto() {
  return (
    <section className="manifesto" aria-label="Our philosophy">
      <div className="manifesto__inner">
        <blockquote className="manifesto__quote">
          Respect your body with <em>vibrant living foods</em> to extract the most nectar out of
          your life.
        </blockquote>
        <p className="manifesto__label" data-hero-fade>
          <a className="link-underline" href={links.about}>
            Read about the cafe
          </a>
        </p>
        <div className="manifesto__strip">
          {shots.map((shot, i) => (
            <div className="manifesto__card-wrap" key={shot.src} data-parallax={0.06 + i * 0.04}>
              <figure className="manifesto__card">
                <img src={shot.src} alt={shot.alt} loading="lazy" />
                <span>{shot.label}</span>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
