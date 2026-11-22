import { PageHead } from '../components/Parts'
import { Link } from '../lib/router'

export function NotFound() {
  return (
    <PageHead eyebrow="404" title="Nothing here.">
      <p>
        <Link href="/">Back to the start</Link> or <Link href="/work">the work</Link>.
      </p>
    </PageHead>
  )
}
