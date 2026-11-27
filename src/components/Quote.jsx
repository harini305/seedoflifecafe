export default function Quote() {
  return (
    <section className="quote" aria-label="The Seeds of Life philosophy">
      <div className="quote__geo" aria-hidden="true" />
      <div className="quote__inner">
        <span className="quote__mark" aria-hidden="true">
          “
        </span>
        <blockquote className="quote__text" data-reveal>
          Celebrate your noble body with <em>vibrant living foods</em> to extract the most nectar
          out of your life!
        </blockquote>
        <p className="quote__author" data-reveal>
          The Seeds of Life · Ubud, Bali
        </p>
      </div>
    </section>
  )
}
