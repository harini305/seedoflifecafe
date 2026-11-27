import { useState } from 'react'
import { links } from '../data/content'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Newsletter() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (!name.trim()) next.name = 'Please tell us your name'
    if (!emailPattern.test(email.trim())) next.email = 'Please add a valid email address'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      const message = `Hello The Seeds of Life, please add ${name.trim()} (${email.trim()}) to the newsletter for new menus and events.`
      window.open(`${links.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section className="section newsletter" id="newsletter">
      <div className="newsletter__glow" aria-hidden="true" />
      <div className="wrap">
        <div className="newsletter__inner">
          <h2 className="newsletter__title" data-reveal>
            New menus and events, <em>straight from the cafe</em>
          </h2>
          <p className="newsletter__text" data-reveal>
            Send us your name and email through WhatsApp to join the #SOL news list.
          </p>
          <form className="newsletter__form" onSubmit={submit} noValidate data-reveal>
            <div className={`field ${errors.name ? 'has-error' : ''}`}>
              <label className="visually-hidden" htmlFor="nl-name">Your name</label>
              <input
                id="nl-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
              />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </div>
            <div className={`field ${errors.email ? 'has-error' : ''}`}>
              <label className="visually-hidden" htmlFor="nl-email">Your email</label>
              <input
                id="nl-email"
                name="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
              />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </div>
            <button className="btn btn--solid" type="submit">
              Request via WhatsApp
            </button>
          </form>
          <p className="newsletter__note">Nothing is submitted until you send the WhatsApp message.</p>
        </div>
      </div>
    </section>
  )
}
