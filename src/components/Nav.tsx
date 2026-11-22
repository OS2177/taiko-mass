import { useEffect, useState } from 'react'
import { nav } from '../site'
import { Link, usePath } from '../lib/router'
import { Logo } from './Logo'
import { converse } from './Parts'
import { Close, Menu } from './icons'

// A thin bar at the top. On narrow screens the links fold into a full-screen menu.
export function Nav() {
  const path = usePath()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const links = nav.map((n) => (
    <li key={n.href}>
      <Link href={n.href} aria-current={path.startsWith(n.href) ? 'page' : undefined}>
        {n.label}
      </Link>
    </li>
  ))

  return (
    <>
      <nav className="bar" aria-label="Main">
        <Logo />
        <ul className="bar__links">
          {links}
          <li>
            <a href={converse()}>Contact</a>
          </li>
        </ul>
        <button className="bar__menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Menu'}>
          {open ? <Close /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Menu">
          <ul className="overlay__links">
            <li>
              <Link href="/">Home</Link>
            </li>
            {links}
            <li>
              <a href={converse()}>Contact</a>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
