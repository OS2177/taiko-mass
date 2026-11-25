import type { ReactNode } from 'react'
import { site } from '../site'
import { ArrowUpRight } from './icons'

// "Start a conversation": a mail to the studio, with what you bring in the subject.
export const converse = (subject = 'Something unfinished') =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`

// A film that plays by itself, muted, looping; shows the poster until there is a file.
export function Film({ video, poster, className = '', children }: { video: string; poster: string; className?: string; children?: ReactNode }) {
  return (
    <div className={`film ${className}`.trim()}>
      {video ? (
        <video src={video} poster={poster || undefined} muted autoPlay loop playsInline preload="metadata" />
      ) : poster ? (
        <img src={poster} alt="" />
      ) : (
        <div className="film__empty" aria-hidden="true" />
      )}
      {children}
    </div>
  )
}

export function OpenLink({ href, children = 'Open it' }: { href: string; children?: ReactNode }) {
  return (
    <a className="button" href={href} target="_blank" rel="noopener noreferrer">
      {children} <ArrowUpRight />
    </a>
  )
}
