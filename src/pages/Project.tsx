import { BUILDS, KINDS, bySlug } from '../builds'
import { OpenLink, Screen } from '../components/Parts'
import { Link, usePath } from '../lib/router'
import { ArrowRight } from '../components/icons'

export function Project() {
  const path = usePath()
  const b = bySlug(path.slice(6))!
  const i = BUILDS.indexOf(b)
  const next = BUILDS[(i + 1) % BUILDS.length]

  return (
    <article className="project">
      <header className="pagehead">
        <p className="label">
          {KINDS[b.kind]} · {b.status}
        </p>
        <h1 className="display">{b.name}</h1>
        <p className="pagehead__intro">{b.line}</p>
      </header>

      <Screen whole src={b.hero} alt={`${b.name}: main screen`} eager />

      <div className="project__body">
        <div className="project__text">
          {b.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {b.url && <OpenLink href={b.url}>Open {b.name}</OpenLink>}
        </div>
        {b.facts && (
          <dl className="facts">
            {b.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="label muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {b.views.length > 0 && (
        <section className="views" aria-label="More screens">
          {b.views.map((v) => (
            <Screen whole key={v} src={v} alt={`${b.name}: another screen`} />
          ))}
        </section>
      )}

      <nav className="project__next" aria-label="Next build">
        <Link href={`/work/${next.slug}`} className="index__row">
          <span className="label muted">Next</span>
          <span className="index__name">{next.name}</span>
          <span className="index__line muted">{next.line}</span>
          <span className="index__kind" />
          <span className="index__status">
            <ArrowRight />
          </span>
        </Link>
      </nav>
    </article>
  )
}
