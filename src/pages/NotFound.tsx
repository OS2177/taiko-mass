import { Link } from '../lib/router'

export function NotFound() {
  return (
    <section className="notfound">
      <p className="label">404</p>
      <h1 className="display">Nothing here.</h1>
      <p className="muted">
        <Link href="/">Back to the start</Link>.
      </p>
    </section>
  )
}
