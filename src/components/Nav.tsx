import { useEffect, useMemo, useState } from 'react'
import { nav } from '../site'
import { Link, navigate, usePath } from '../lib/router'
import { BUILDS } from '../builds'
import { Logo } from './Logo'
import { Converse } from './Parts'
import { Close, Menu, Search } from './icons'

// The dark bar fixed to the bottom of the screen, so the hero stays clean.
// On narrow screens the links fold into a full-screen menu.
export function Nav() {
  const path = usePath()
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    document.body.style.overflow = open || searching ? 'hidden' : ''
  }, [open, searching])

  const links = (onPick?: () => void) =>
    nav.map((n) => (
      <li key={n.href}>
        <Link href={n.href} onClick={onPick} aria-current={path.startsWith(n.href) ? 'page' : undefined}>
          {n.label}
        </Link>
      </li>
    ))

  return (
    <>
      <nav className="bar" aria-label="Main">
        <Logo small />
        <ul className="bar__links">{links()}</ul>
        <div className="bar__tools">
          <Converse />
          <button className="icon-btn" onClick={() => setSearching(true)} aria-label="Search">
            <Search size={20} />
          </button>
          <span className="lang" title="English">
            EN
          </span>
          <button className="icon-btn bar__menu" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu />
          </button>
        </div>
      </nav>

      {open && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="overlay__head">
            <Logo small />
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
              <Close size={26} />
            </button>
          </div>
          <ul className="overlay__links">
            <li>
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            {links(() => setOpen(false))}
          </ul>
          <div className="overlay__foot">
            <Converse className="pill pill--light" />
          </div>
        </div>
      )}

      {searching && <SearchPanel onClose={() => setSearching(false)} />}
    </>
  )
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const term = q.trim().toLowerCase()
  const hits = useMemo(
    () =>
      term.length < 2
        ? []
        : BUILDS.filter((b) => (b.name + ' ' + b.line + ' ' + b.status + ' ' + b.about.join(' ')).toLowerCase().includes(term)).slice(0, 12),
    [term],
  )

  return (
    <div className="overlay overlay--search" role="dialog" aria-modal="true" aria-label="Search">
      <div className="overlay__head">
        <input
          autoFocus
          className="search-input"
          placeholder="Search the work…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="icon-btn" onClick={onClose} aria-label="Close search">
          <Close size={26} />
        </button>
      </div>
      <div className="search-results">
        {term.length >= 2 && !hits.length && <p className="muted">Nothing found.</p>}
        {hits.map((b) => (
          <button
            key={b.slug}
            className="hit"
            onClick={() => {
              onClose()
              navigate(`/work/${b.slug}`)
            }}
          >
            <img className="hit__img" src={b.views[0] ?? b.hero} alt="" />
            <span>
              <strong>{b.name}</strong>
              <em>{b.line}</em>
            </span>
            <span className="hit__n caps">{b.status}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
