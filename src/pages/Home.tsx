import { useEffect, useRef, useState } from 'react'
import { BUILDS, CAROUSEL, KINDS, bySlug, type Build } from '../builds'
import { Film, OpenLink, converse } from '../components/Parts'
import { about, closing, hero, site } from '../site'
import { ArrowRight, Close } from '../components/icons'

const pad = (n: number) => String(n).padStart(2, '0')

// Which build the address points at: /#mojima, or the old /work/mojima.
function slugFromAddress(): string | null {
  const h = location.hash.slice(1)
  if (h && bySlug(h)) return h
  const m = location.pathname.match(/^\/work\/([^/]+)/)
  return m && bySlug(m[1]) ? m[1] : null
}

// The one page: the hero film, the builds as a carousel (click one and its run-through opens
// in place), the closing film, a few words about Jack. The bar lives in App.
export function Home() {
  const [open, setOpen] = useState<string | null>(slugFromAddress)
  const scroller = useRef<HTMLDivElement>(null)

  // Back/forward and typed addresses open or close the card
  useEffect(() => {
    const read = () => setOpen(slugFromAddress())
    window.addEventListener('popstate', read)
    window.addEventListener('hashchange', read)
    return () => {
      window.removeEventListener('popstate', read)
      window.removeEventListener('hashchange', read)
    }
  }, [])

  // The opened card gets its own address; the page behind the window holds still; Esc closes it
  useEffect(() => {
    if (!open) return
    if (location.hash.slice(1) !== open) history.replaceState(null, '', `/#${open}`)
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', key)
    }
  }, [open])

  function close() {
    setOpen(null)
    history.replaceState(null, '', '/#builds')
  }

  function slide(dir: 1 | -1) {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.card')
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 600) + 24), behavior: 'smooth' })
  }

  const current = open ? bySlug(open) : undefined

  return (
    <>
      <section className="hero" id="top">
        <Film video={hero.video} poster={hero.poster} className="hero__film">
          <div className="hero__words">
            <p className="label">{site.name} · {site.descriptor.toLowerCase()}</p>
            <h1 className="display display--xl">{hero.line}</h1>
          </div>
          <a href="/#builds" className="hero__cue label" aria-label="Scroll to the builds">
            The builds <ArrowRight size={14} />
          </a>
        </Film>
      </section>

      <section className="builds" id="builds" aria-label="The builds">
        <div className="section__head">
          <h2 className="display">Made at iAOS21</h2>
          <div className="builds__tools">
            <p className="label muted">{pad(BUILDS.length)} builds</p>
            <button className="builds__arrow" onClick={() => slide(-1)} aria-label="Previous">
              <ArrowRight size={18} />
            </button>
            <button className="builds__arrow" onClick={() => slide(1)} aria-label="Next">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="cards" ref={scroller}>
          {CAROUSEL.map((b, i) => (
            <Card key={b.slug} b={b} eager={i < 2} open={open === b.slug} onOpen={() => setOpen(b.slug)} />
          ))}
        </div>

      </section>

      {current && <Journey key={current.slug} b={current} onClose={close} />}

      <section className="closing" aria-label="Closing film">
        <Film video={closing.video} poster={closing.poster} className="closing__film" />
        {closing.caption && <p className="label muted closing__caption">{closing.caption}</p>}
      </section>

      <section className="about" id="about">
        <div className="about__grid">
          <div>
            <p className="label">{about.eyebrow}</p>
            <h2 className="display">{about.title}</h2>
          </div>
          <div className="about__text">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <ul className="topics">
              {about.writing.map(([t, line, href]) => (
                <li key={href}>
                  <a href={href}>{t}</a>
                  <span className="muted"> — {line}</span>
                </li>
              ))}
              <li>
                <a href={site.taikoMass}>Taiko Mass, the original site</a>
              </li>
            </ul>
            <div className="about__actions">
              <a href={converse()} className="button button--solid">
                Start a conversation
              </a>
              <a href={site.remix} target="_blank" rel="noopener noreferrer" className="button" id="remix">
                REMIX
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// One card in the carousel: the build's front door in a dark frame, its kind in the corner,
// name and one line under it.
function Card({ b, eager, open, onOpen }: { b: Build; eager: boolean; open: boolean; onOpen: () => void }) {
  return (
    <a
      href={`/#${b.slug}`}
      className="card"
      aria-current={open ? 'true' : undefined}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onOpen()
      }}
    >
      <span className="card__frame">
        <img src={b.hero} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
        <span className="card__kind label">{KINDS[b.kind]}</span>
      </span>
      <span className="card__name">{b.name}</span>
      <span className="card__line muted">{b.line}</span>
    </a>
  )
}

// The opened card: a window over the page, the way the build looks when it is open on your screen.
// The walk-through starts by itself and keeps going, no controls; until it is recorded, the stills take turns.
function Journey({ b, onClose }: { b: Build; onClose: () => void }) {
  const stills = [b.hero, ...b.views]
  const [i, setI] = useState(0)
  useEffect(() => {
    if (b.film || stills.length < 2) return
    const t = window.setInterval(() => setI((n) => (n + 1) % stills.length), 2800)
    return () => window.clearInterval(t)
  }, [b.film, stills.length])
  const address = b.url ? b.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${b.name.toLowerCase()} · not public yet`
  return (
    <div className="pop" role="dialog" aria-modal="true" aria-label={`${b.name}, the walk-through`} onClick={onClose}>
      <div className="pop__window" onClick={(e) => e.stopPropagation()}>
        <div className="pop__bar">
          <span className="pop__dots" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span className="pop__address label">{address}</span>
          <button className="pop__close" onClick={onClose} aria-label="Close">
            <Close size={18} />
          </button>
        </div>
        <div className="pop__screen">
          {b.film ? (
            <video src={b.film} poster={b.hero} muted autoPlay loop playsInline preload="auto" disablePictureInPicture />
          ) : (
            <img key={stills[i]} src={stills[i]} alt="" />
          )}
        </div>
        <div className="pop__foot">
          <div className="pop__words">
            <p className="label muted">
              {KINDS[b.kind]} · {b.status}
            </p>
            <h3 className="pop__name">{b.name}</h3>
            <p className="muted">{b.about[0]}</p>
          </div>
          <div className="pop__actions">
            {b.url && <OpenLink href={b.url}>Open {b.name}</OpenLink>}
            {b.access && (
              <a className="button" href={converse(`${b.name}: ${b.access.toLowerCase()}`)}>
                {b.access}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
