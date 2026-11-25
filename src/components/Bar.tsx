import { useEffect, useState } from 'react'
import { nav, site } from '../site'
import { Link } from '../lib/router'
import { Logo } from './Logo'
import { ArrowUpRight } from './icons'

// The bar at the bottom of the screen. It stands in for header and footer both, and stays out of
// sight until the visitor starts to scroll, so the hero film opens clean. Links are places on the one page.
export function Bar() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav className={shown ? 'bar' : 'bar bar--hidden'} aria-label="Main">
      <Logo />
      <ul className="bar__links">
        {nav.map((n) => (
          <li key={n.href}>
            <Link href={n.href}>{n.label}</Link>
          </li>
        ))}
        <li>
          <a href="/#contact">Contact</a>
        </li>
        <li className="bar__remix">
          <a href={site.remix} target="_blank" rel="noopener noreferrer">
            REMIX <ArrowUpRight size={12} />
          </a>
        </li>
      </ul>
      <p className="bar__copy label">© {new Date().getFullYear()}</p>
    </nav>
  )
}
