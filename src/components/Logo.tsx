import { Link } from '../lib/router'
import { site } from '../site'

// The wordmark is type, not an image.
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${site.name} — home`}>
      i<span>AOS</span>21
    </Link>
  )
}
