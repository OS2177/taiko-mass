import { Link } from '../lib/router'

export function NotFound() {
  return (
    <section className="section notfound">
      <p className="caps muted">Not found</p>
      <h1 className="serif">There is nothing here.</h1>
      <Link href="/" className="textlink">
        Back to the start
      </Link>
    </section>
  )
}
