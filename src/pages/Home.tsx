import { BUILDS, KINDS, featured } from '../builds'
import { Frame, converse } from '../components/Parts'
import { Link } from '../lib/router'
import { ArrowRight } from '../components/icons'

const pad = (n: number) => String(n).padStart(2, '0')

export function Home() {
  // The showreel: 'full' builds take a row, 'half' builds pair up.
  const rows: (typeof featured)[] = []
  for (const b of featured) {
    const last = rows[rows.length - 1]
    if (b.featured === 'half' && last && last.length === 1 && last[0].featured === 'half') last.push(b)
    else rows.push([b])
  }

  return (
    <>
      <section className="hero">
        <p className="label">iAOS21 · an independent building studio</p>
        <h1 className="display display--xl">
          A more beautiful future.
          <br />
          <span>Made real.</span>
        </h1>
        <div className="hero__foot">
          <p className="hero__lede">
            We build intelligent tools, environments and experiences, shaped around the people who will use them. Small,
            independent, and close to the work.
          </p>
          <div className="hero__actions">
            <Link href="/work" className="button button--solid">
              See the work <ArrowRight />
            </Link>
            <a href={converse()} className="button">
              Start a conversation
            </a>
          </div>
        </div>
      </section>

      <section className="reel" aria-label="Selected work">
        <div className="section__head">
          <h2 className="label">Selected work</h2>
          <p className="label muted">
            {pad(featured.length)} of {pad(BUILDS.length)} builds
          </p>
        </div>
        {rows.map((row, i) => (
          <div key={i} className={row.length === 2 ? 'reel__row reel__row--2' : 'reel__row'}>
            {row.map((b) => (
              <Frame key={b.slug} b={b} eager={i === 0} />
            ))}
          </div>
        ))}
      </section>

      <section className="index" aria-label="All builds">
        <div className="section__head">
          <h2 className="label">All builds</h2>
          <Link href="/work" className="label link">
            The work <ArrowRight size={14} />
          </Link>
        </div>
        <ol className="index__list">
          {BUILDS.map((b, i) => (
            <li key={b.slug}>
              <Link href={`/work/${b.slug}`} className="index__row">
                <span className="label muted">{pad(i + 1)}</span>
                <span className="index__name">{b.name}</span>
                <span className="index__line muted">{b.line}</span>
                <span className="label muted index__kind">{KINDS[b.kind]}</span>
                <span className="label index__status">{b.status}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="studio-band">
        <div className="studio-band__grid">
          <div>
            <p className="label">The studio</p>
            <h2 className="display">Every build starts with one person and one unfinished thing.</h2>
          </div>
          <div className="studio-band__cols">
            <div>
              <h3>Shaped around people</h3>
              <p className="muted">
                Built with the cook at the pass, the writer at the desk, the shop at the counter. The tool fits the way the work
                already happens.
              </p>
            </div>
            <div>
              <h3>Made with the best models of the moment</h3>
              <p className="muted">
                Every build uses what technology can now do, and keeps up as that changes. Nothing is locked to last year.
              </p>
            </div>
            <div>
              <h3>Handed over whole</h3>
              <p className="muted">
                What we make is yours: your space, your words, your data. The studio keeps no way in once it is handed over.
              </p>
            </div>
          </div>
          <div className="studio-band__links">
            <Link href="/studio" className="button">
              About the studio <ArrowRight />
            </Link>
            <a href={converse()} className="button button--solid">
              Start a conversation
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
