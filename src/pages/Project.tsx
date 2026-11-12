import { BUILDS, KINDS, bySlug } from '../builds'
import { usePath, Link } from '../lib/router'
import { PageHead, converse } from '../components/Parts'
import { ArrowLeft, ArrowRight } from '../components/icons'

// One build: its artwork, what it is, where it stands, and the real address
// when there is one. Nothing promised beyond the documented state.
export function Project() {
  const path = usePath()
  const b = bySlug(path.slice(6))!
  const i = BUILDS.indexOf(b)
  const prev = BUILDS[(i - 1 + BUILDS.length) % BUILDS.length]
  const next = BUILDS[(i + 1) % BUILDS.length]

  return (
    <div className="project">
      <PageHead eyebrow={`${KINDS[b.kind]} · ${b.status}`} title={b.name} image={b.hero}>
        <p className="lead">{b.line}</p>
      </PageHead>

      <section className="section split">
        <div className="prose">
          {b.about.map((p, n) => (
            <p key={n}>{p}</p>
          ))}
          <div className="project__links">
            {b.url ? (
              <a className="pill" href={b.url} target="_blank" rel="noopener noreferrer">
                Open {b.name} ↗
              </a>
            ) : (
              <span className="pill pill--outline" aria-disabled="true">
                Not public yet
              </span>
            )}
            <a className="textlink" href={converse(`About ${b.name}`)}>
              Ask about this build
            </a>
          </div>
        </div>
        <aside>
          {b.facts && (
            <dl className="facts facts--list">
              {b.facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="caps muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>
      </section>

      {b.views.length > 0 && (
        <section className="section">
          <p className="caps muted">More views</p>
          <div className="gallery gallery--wide">
            {b.views.map((v) => (
              <img key={v} src={v} alt="" loading="lazy" />
            ))}
          </div>
        </section>
      )}

      <nav className="section project__nav" aria-label="Other builds">
        <Link href={`/work/${prev.slug}`} className="more">
          <ArrowLeft size={26} />
          <span className="caps">{prev.name}</span>
        </Link>
        <Link href="/work" className="caps">
          All the work
        </Link>
        <Link href={`/work/${next.slug}`} className="more">
          <span className="caps">{next.name}</span>
          <ArrowRight size={26} />
        </Link>
      </nav>
    </div>
  )
}
