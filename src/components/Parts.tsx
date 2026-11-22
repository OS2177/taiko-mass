import type { ReactNode } from 'react'
import { Link } from '../lib/router'
import { site } from '../site'
import type { Build } from '../builds'
import { KINDS } from '../builds'
import { ArrowUpRight } from './icons'

// "Start a conversation": a mail to the studio, with what you bring in the subject.
export const converse = (subject = 'Something unfinished') =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`

// The opening of every inner page: eyebrow, title, a short intro.
export function PageHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="pagehead">
      <p className="label">{eyebrow}</p>
      <h1 className="display">{title}</h1>
      {children && <div className="pagehead__intro">{children}</div>}
    </header>
  )
}

// A screenshot in a thin frame, the way the work is shown everywhere on the site.
// whole = the picture at its own height (build pages); otherwise a wide crop (frames).
export function Screen({ src, alt = '', eager = false, whole = false }: { src: string; alt?: string; eager?: boolean; whole?: boolean }) {
  return (
    <span className={whole ? 'screen screen--whole' : 'screen'}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </span>
  )
}

// A build in the showreel and in the work grid: its screen, then its name and line.
export function Frame({ b, eager = false }: { b: Build; eager?: boolean }) {
  return (
    <Link href={`/work/${b.slug}`} className="frame">
      <Screen src={b.hero} eager={eager} />
      <span className="frame__text">
        <span className="frame__name">{b.name}</span>
        <span className="frame__line">{b.line}</span>
        <span className="frame__meta label">
          {KINDS[b.kind]} · {b.status}
        </span>
      </span>
    </Link>
  )
}

export function OpenLink({ href, children = 'Open it' }: { href: string; children?: ReactNode }) {
  return (
    <a className="button" href={href} target="_blank" rel="noopener noreferrer">
      {children} <ArrowUpRight />
    </a>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <p className="footer__mark">iAOS21</p>
          <p className="muted">{site.descriptor}</p>
        </div>
        <ul className="footer__links">
          <li>
            <a href={converse()}>{site.email}</a>
          </li>
          <li>
            <a href={site.remix} target="_blank" rel="noopener noreferrer">
              REMIX
            </a>
          </li>
          <li>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.taikoMass}>Taiko Mass, the original site</a>
          </li>
        </ul>
        <p className="muted footer__copy">© {new Date().getFullYear()} iAOS21</p>
      </div>
    </footer>
  )
}
