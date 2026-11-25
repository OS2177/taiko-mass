import { nav, site } from '../site'
import { Link } from '../lib/router'
import { Logo } from './Logo'
import { converse } from './Parts'
import { ArrowUpRight } from './icons'

// The bar at the bottom of the screen. It never moves and stands in for header and footer both:
// the hero film above it stays clean. Links are places on the one page.
export function Bar() {
  return (
    <nav className="bar" aria-label="Main">
      <Logo />
      <ul className="bar__links">
        {nav.map((n) => (
          <li key={n.href}>
            <Link href={n.href}>{n.label}</Link>
          </li>
        ))}
        <li>
          <a href={converse()}>Contact</a>
        </li>
        <li className="bar__remix">
          <a href={site.remix} target="_blank" rel="noopener noreferrer">
            REMIX <ArrowUpRight size={12} />
          </a>
        </li>
      </ul>
      <p className="bar__copy label muted">© {new Date().getFullYear()}</p>
    </nav>
  )
}
