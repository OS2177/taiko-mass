import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { redirects } from '../site'
const BASE = ''

// A tiny history router: the site has a handful of pages and needs nothing more.

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function scrollToHash() {
  const id = location.hash.slice(1)
  if (!id) return window.scrollTo(0, 0)
  // the target page renders after the URL changes; wait a frame for it
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
}

// Routes are written without the /lisa prefix; it's added and removed here.
export function navigate(to: string, replace = false) {
  history[replace ? 'replaceState' : 'pushState'](null, '', BASE + to)
  emit()
  scrollToHash()
}

window.addEventListener('popstate', emit)

function current() {
  const path = location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : location.pathname
  return path.replace(/\/+$/, '') || '/'
}

export function usePath() {
  const path = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    current,
  )
  const target = redirects[path]
  useEffect(() => {
    if (target) navigate(target, true)
  }, [target])
  return target ? target.split('#')[0] : path
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function Link({ href, onClick, ...rest }: LinkProps) {
  const internal = href.startsWith('/')
  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (!internal || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(href)
  }
  return (
    <a
      href={internal ? BASE + href : href}
      onClick={handle}
      {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    />
  )
}
