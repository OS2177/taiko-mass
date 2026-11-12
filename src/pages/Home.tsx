import { useState } from 'react'
import { featured } from '../builds'
import { Logo } from '../components/Logo'
import { Tile } from '../components/Parts'
import { Selected } from '../components/Selected'
import { Link } from '../lib/router'
import { ArrowLeft, ArrowRight } from '../components/icons'

const pad = (n: number) => String(n).padStart(2, '0')

// The hero opens on the first featured build; the arrows step through the
// others, each with its own artwork filling the right of the screen.
export function Home() {
  const [i, setI] = useState(0)
  const b = featured[i]
  const step = (d: number) => setI((i + d + featured.length) % featured.length)

  return (
    <>
      <section className="hero">
        <img key={b.hero} className="hero__portrait" src={b.hero} alt="" />
        <div className="hero__copy">
          <Logo />
          <h1 className="hero__title serif">
            A more
            <br />
            beautiful
            <br />
            <em>future.</em>
          </h1>
          <ul className="caps hero__list">
            <li>Made real</li>
            <li>Intelligent tools, environments</li>
            <li>and experiences, shaped around</li>
            <li>the people who will use them</li>
          </ul>
          <div className="hero__episode">
            <Link href={`/work/${b.slug}`} className="play" aria-label={`Open ${b.name}`}>
              <ArrowRight size={26} />
            </Link>
            <div aria-live="polite">
              <p className="caps hero__label">{i === 0 ? 'In the frame' : 'Featured build'}</p>
              <p className="serif hero__guest">{b.name}</p>
              <p className="serif hero__topic">{b.line}</p>
            </div>
          </div>
        </div>
        <div className="hero__count caps">
          {pad(i + 1)} / {pad(featured.length)}
          <span className="hero__rule" />
          selected work
        </div>
        <div className="hero__arrows">
          <button onClick={() => step(-1)} aria-label="Previous build">
            <ArrowLeft size={44} />
          </button>
          <button onClick={() => step(1)} aria-label="Next build">
            <ArrowRight size={44} />
          </button>
        </div>
      </section>

      <section className="tiles" aria-label="Explore">
        <Tile href="/work" image="/img/builds/mojima-v2.webp" eyebrow="Builds · applications · systems" title="The work" lines={['What we have made.']} />
        <Tile href="/remix" image="/img/builds/remix-dunes2.webp" eyebrow="Personal computing" title="REMIX" lines={['Your future needs space.']} />
        <Tile href="/studio" image="/img/builds/snoei-v1.webp" eyebrow="Independent building studio" title="The studio" lines={['Who we are and how we build.']} />
      </section>

      <Selected />
    </>
  )
}
