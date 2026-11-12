import { PageHead, Converse } from '../components/Parts'
import { site } from '../site'

const essays = [
  ['Humanetics', 'Designing intelligent systems to expand human potential', '/humanetics.html'],
  ['The Ecology of Awareness', 'Consciousness in information fields', '/the-ecology-of-awareness.html'],
  ['On the Edge', 'Marginality as a driver of change', '/on-the-edge.html'],
  ['The Open Loop', 'The body as process', '/the-open-loop.html'],
]

export function Studio() {
  return (
    <>
      <PageHead eyebrow="The studio" title={<>An independent studio for what comes next.</>} image="/img/builds/deploy-v2.webp">
        <p>
          iAOS21 builds intelligent tools, environments and experiences, shaped around the people who will use them. Small,
          independent, and close to the work.
        </p>
      </PageHead>

      <section className="section prose-grid">
        <div className="prose">
          <h2 className="serif">What we build</h2>
          <p>
            Applications people use every day: a kitchen, a shop counter, a writing room, a place to book a session. Intelligent
            systems that keep a person current with what technology can now do. And explorations: the builds that are ahead of
            their use.
          </p>
          <p>
            Every build on this site started with one person and one unfinished thing. They are made with the best models of the
            moment and handed over whole.
          </p>
        </div>
        <div className="prose">
          <h2 className="serif">Where it comes from</h2>
          <p>
            Before the studio there was a philosophy: that intelligent systems should expand what people can do, not replace it.
            The writing that shaped it lives on, together with the site it was first published on.
          </p>
          <ul className="topics">
            {essays.map(([t, line, href]) => (
              <li key={href}>
                <a href={href}>{t}</a>
                <span className="muted"> — {line}</span>
              </li>
            ))}
          </ul>
          <p>
            <a className="textlink" href={site.taikoMass}>
              Taiko Mass, the original site
            </a>
          </p>
        </div>
      </section>

      <section className="band band--cta">
        <h2 className="serif">Start a conversation.</h2>
        <p className="muted">
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <Converse className="pill pill--light" />
      </section>
    </>
  )
}
