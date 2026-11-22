import { OpenLink, PageHead, Screen } from '../components/Parts'
import { Link } from '../lib/router'
import { site } from '../site'

export function Remix() {
  return (
    <>
      <PageHead eyebrow="REMIX" title="Your own intelligent environment.">
        <p>
          REMIX is where the builds on this site are made, and where you can make your own. Bring something unfinished and it
          grows a space around it: tools, projects, and a studio that builds with you.
        </p>
        <OpenLink href={site.remix}>Go to REMIX</OpenLink>
      </PageHead>

      <Screen whole src="/img/builds/remix-home.webp" alt="REMIX: the front page" eager />

      <section className="prose-grid">
        <div className="prose">
          <h2>A space of your own</h2>
          <p>
            Every person gets their own space, in their words, with their builds inside. Work is shaped together in the workshop
            and then handed over: the space is yours and the studio has no way in.
          </p>
        </div>
        <div className="prose">
          <h2>A collection that grows</h2>
          <p>
            Every build the studio makes becomes something others can plug into their own tools and agents. The collection under{' '}
            <Link href="/work">Work</Link> is the beginning of it.
          </p>
        </div>
        <div className="prose">
          <h2>On your desk and in your pocket</h2>
          <p>
            REMIX runs on the web, as a desktop app, and on the phone as <Link href="/work/pocket">REMIX Pocket</Link>. Scout
            reads the frontier every week so you know what has become possible.
          </p>
        </div>
      </section>

      <section className="views" aria-label="More screens">
        <Screen whole src="/img/builds/remix-desk.webp" alt="REMIX: a space" />
        <Screen whole src="/img/builds/remix-desk2.webp" alt="REMIX: the workshop" />
      </section>
    </>
  )
}
