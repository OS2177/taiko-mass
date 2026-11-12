import { Link } from '../lib/router'
import { site } from '../site'

// The wordmark is type, not an image: iAOS21 in the serif, the 21 in lilac,
// the studio descriptor tracked out underneath.
export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className={small ? 'logo logo--small' : 'logo'} aria-label={`${site.name} — home`}>
      <span className="logo__mark serif">
        i<span>AOS</span>
        <em>21</em>
      </span>
      <span className="logo__sub caps">{site.descriptor}</span>
    </Link>
  )
}
