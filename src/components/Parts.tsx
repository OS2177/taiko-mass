import type { ReactNode } from 'react'
import { Link } from '../lib/router'
import { ArrowRight } from './icons'
import { site } from '../site'

// The dark opening band every inner page starts with.
export function PageHead({
  eyebrow,
  title,
  children,
  image,
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  image?: string
}) {
  return (
    <header className={image ? 'pagehead pagehead--image' : 'pagehead'}>
      {image && <img className="pagehead__img" src={image} alt="" />}
      <div className="pagehead__copy">
        <p className="caps">{eyebrow}</p>
        <h1 className="serif">{title}</h1>
        {children && <div className="pagehead__intro">{children}</div>}
      </div>
    </header>
  )
}

export function Tile({ href, image, title, lines }: { href: string; image: string; title: string; lines: string[] }) {
  return (
    <Link href={href} className="tile">
      <img src={image} alt="" loading="lazy" />
      <span className="tile__copy">
        <span className="tile__title serif">{title}</span>
        <span className="caps tile__lines">
          {lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </span>
        <ArrowRight />
      </span>
    </Link>
  )
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="more">
      <span className="caps">{children}</span>
      <ArrowRight size={26} />
    </Link>
  )
}

// "Start a conversation": a mail to the studio, with what you bring in the subject.
export const converse = (subject = 'Something unfinished') =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`

export function Converse({ className = 'pill', children = 'Start a conversation' }: { className?: string; children?: ReactNode }) {
  return (
    <a className={className} href={converse()}>
      {children}
    </a>
  )
}
