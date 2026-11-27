import { links, visit } from '../data/content'

export default function Visit() {
  return (
    <section className="section visit theme-cream" id="visit">
      <div className="wrap">
        <div className="visit__grid">
          <div className="visit__content">
            <h2 className="visit__title" data-reveal>
              Find us in the heart <em>of Ubud</em>
            </h2>
            <p className="visit__address" data-reveal>{visit.address}</p>

            <dl className="visit__rows" data-reveal>
              <div className="visit__row">
                <dt>Phone</dt>
                <dd><a href={links.phone}>{visit.phone}</a></dd>
              </div>
              <div className="visit__row">
                <dt>WhatsApp</dt>
                <dd>
                  <a href={links.whatsapp} target="_blank" rel="noreferrer noopener">
                    {visit.whatsapp}
                  </a>
                </dd>
              </div>
              <div className="visit__row">
                <dt>Open daily</dt>
                <dd>{visit.hours}</dd>
              </div>
              <div className="visit__row">
                <dt>Last order</dt>
                <dd>{visit.lastOrder}</dd>
              </div>
            </dl>

            <div className="visit__actions" data-reveal>
              <a className="btn btn--solid" href={links.whatsapp} target="_blank" rel="noreferrer noopener">
                Message us on WhatsApp
              </a>
            </div>
          </div>

          <div className="visit__media" data-img-reveal>
            <div className="visit__media-frame">
              <img
                src="/images/sol-slider.webp"
                alt="The Seeds of Life cafe entrance with plants and chalkboard menus in Ubud"
                loading="lazy"
              />
            </div>
            <div className="visit__locations">
              {visit.locations.map((location) => (
                <div key={location.label}>
                  <small>{location.label}</small>
                  <span>{location.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
