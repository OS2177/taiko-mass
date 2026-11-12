import { PageHead, Converse } from '../components/Parts'

export function Approach() {
  return (
    <>
      <PageHead eyebrow="The approach" title={<>Bring something unfinished.</>} image="/img/builds/remix-desk2.webp">
        <p>An idea. A problem. A business. A piece of research. A search for work. Something you cannot quite see yet.</p>
      </PageHead>

      <section className="section">
        <ol className="archer">
          <li>
            <span className="archer__letter serif">1</span>
            <h3 className="serif">We listen first</h3>
            <p>What you do, who it is for, what gets in the way. A build starts with the person, not with the technology.</p>
          </li>
          <li>
            <span className="archer__letter serif">2</span>
            <h3 className="serif">We build it together</h3>
            <p>In the workshop, in the open, in your words. You see it grow and you steer. Most builds are live in days, not months.</p>
          </li>
          <li>
            <span className="archer__letter serif">3</span>
            <h3 className="serif">Then it is yours</h3>
            <p>When it is done we hand it over. Your space, your data, your tool. The studio keeps no way in.</p>
          </li>
        </ol>
      </section>

      <section className="band band--cta">
        <h2 className="serif">What would you like to work on?</h2>
        <Converse className="pill pill--light" />
      </section>
    </>
  )
}
