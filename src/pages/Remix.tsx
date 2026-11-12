import { PageHead } from '../components/Parts'
import { Link } from '../lib/router'
import { site } from '../site'

export function Remix() {
  return (
    <>
      <PageHead eyebrow="REMIX" title={<>Your own intelligent environment.</>} image="/img/builds/remix-dunes.webp">
        <p>
          REMIX is where the builds on this site are made, and where you can make your own. Bring something unfinished and it
          grows a space around it: tools, projects, and a studio that builds with you.
        </p>
        <a className="pill pill--light" href={site.remix} target="_blank" rel="noopener noreferrer">
          Go to REMIX ↗
        </a>
      </PageHead>

      <section className="section prose-grid">
        <div className="prose">
          <h2 className="serif">A space of your own</h2>
          <p>
            Every person gets their own space, in their words, with their builds inside. Work is shaped together in the workshop
            and then handed over: the space is yours and the studio has no way in.
          </p>
        </div>
        <div className="prose">
          <h2 className="serif">A collection that grows</h2>
          <p>
            Every build the studio makes becomes something others can plug into their own tools and agents. The collection you see
            under <Link href="/work">The work</Link> is the beginning of it.
          </p>
        </div>
      </section>
    </>
  )
}
