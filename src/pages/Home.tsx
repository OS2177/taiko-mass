import { useEffect, useRef, useState } from 'react'
import { CAROUSEL, KINDS, bySlug, type Build } from '../builds'
import { Film, OpenLink } from '../components/Parts'
import { about, closing, hero, heroFrom, site } from '../site'
import { Contact } from '../components/Contact'
import { ArrowRight } from '../components/icons'

const pad = (n: number) => String(n).padStart(2, '0')

// Which build the address points at: /#mojima, or the old /work/mojima.
function slugFromAddress(): string | null {
  const h = location.hash.slice(1)
  if (h && bySlug(h)) return h
  const m = location.pathname.match(/^\/work\/([^/]+)/)
  return m && bySlug(m[1]) ? m[1] : null
}

// The contact window: /#contact, or /#contact:<build> when a visitor asks for access to one.
function contactFromAddress(): string | false {
  const h = location.hash.slice(1)
  if (h === 'contact') return ''
  if (h.startsWith('contact:')) return h.slice(8)
  return false
}

// The one page: the hero film, the builds as a carousel (click one and its run-through opens
// in place), the closing film, a few words about Jack. The bar lives in App.
export function Home() {
  const [contact, setContact] = useState<string | false>(contactFromAddress)
  const scroller = useRef<HTMLDivElement>(null)

  // The page opens at the top, on the hero. A phone otherwise restores the last position, and a
  // leftover /#builds would jump straight to the second section.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    const h = location.hash.slice(1)
    if (h === 'builds' || h === 'top') history.replaceState(null, '', '/')
    if (!slugFromAddress() && contactFromAddress() === false) window.scrollTo(0, 0)
  }, [])

  // Back/forward and typed addresses open or close the contact window, or bring a build's card into view
  useEffect(() => {
    const read = () => { setContact(contactFromAddress()); showCard(slugFromAddress()) }
    read()
    window.addEventListener('popstate', read)
    window.addEventListener('hashchange', read)
    return () => {
      window.removeEventListener('popstate', read)
      window.removeEventListener('hashchange', read)
    }
  }, [])

  // The card with that address slides into view (the window it used to open is gone, 2026-11-26: the
  // words and the buttons sit under the picture now).
  function showCard(slug: string | null) {
    if (!slug) return
    const el = scroller.current?.querySelector<HTMLElement>(`[data-slug="${slug}"]`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' })
  }

  function slide(dir: 1 | -1) {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.card')
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 600) + 24), behavior: 'smooth' })
  }

  // The film published from DEPLOY's Live (site 'iaos21'); the one in site.ts until it answers.
  const [film, setFilm] = useState({ video: hero.video, poster: hero.poster })
  useEffect(() => {
    void fetch(heroFrom).then((r) => (r.ok ? r.json() : null)).then((j) => {
      const h = j?.hero
      if (!h?.video) return
      const upright = matchMedia('(orientation: portrait) and (max-width: 820px)').matches
      const pick = upright && h.phone?.video ? h.phone : h
      setFilm({ video: pick.video, poster: pick.poster ?? '' })
    }).catch(() => {})
  }, [])

  // As the page scrolls, the hero's words lift and fade while the builds come in over the film
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    const tick = () => {
      raf = 0
      root.style.setProperty('--hero-scroll', String(Math.max(0, window.scrollY)))
      root.style.setProperty('--hero-fade', String(Math.max(320, window.innerHeight * 0.6)))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <section className="hero" id="top">
        <Film video={film.video} poster={film.poster} className="hero__film">
          <div className="hero__words">
            <p className="label">{site.name.toLowerCase()} · {site.descriptor}</p>
            <h1 className="display display--xl">{hero.line}</h1>
          </div>
          <a href="/#builds" className="hero__cue label" aria-label="Scroll to the builds">
            The builds <ArrowRight size={14} />
          </a>
        </Film>
      </section>

      <section className="builds" id="builds" aria-label="The builds">
        <div className="section__head">
          <h2 className="display display--sm">made in iaos21</h2>
          <div className="builds__tools">
            <p className="label muted">{pad(CAROUSEL.length)} builds</p>
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
            <Card key={b.slug} b={b} eager={i < 2} />
          ))}
        </div>

      </section>

      {contact !== false && <Contact key={contact} forBuild={contact ? bySlug(contact) : undefined} onClose={() => { setContact(false); history.replaceState(null, '', '/') }} />}

      {(closing.video || closing.poster) && (
        <section className="closing" aria-label="Closing film">
          <Film video={closing.video} poster={closing.poster} className="closing__film" />
          {closing.caption && <p className="label muted closing__caption">{closing.caption}</p>}
        </section>
      )}

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
            <p className="label muted topics__label">{about.writingLabel}</p>
            <ul className="topics">
              {about.writing.map(([t, line, href]) => (
                <li key={href}>
                  <a href={href}>{t}</a>
                  <span className="muted"> — {line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

// One card in the carousel: the build's front door in a dark frame, and under it what it is, what it is
// today, and the ways in (Jack, 2026-11-26: the words from the old pop-up window live here now; there is no
// window any more). The frame shows the splash picture; while the cursor rests on it the walk-through film
// plays over it, and when the cursor leaves the splash gently returns (Jack, 2026-11-26). Seeing the inside
// of a build otherwise means pressing Try.
function Card({ b, eager }: { b: Build; eager: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  const [hover, setHover] = useState(false)
  useEffect(() => {
    const v = video.current
    if (!v) return
    if (hover) { v.currentTime = 0; v.play().catch(() => {}) }
    else { const t = window.setTimeout(() => { v.pause(); v.currentTime = 0 }, 600); return () => window.clearTimeout(t) }
  }, [hover])
  return (
    <article className="card" data-slug={b.slug} id={b.slug}>
      <div className={`card__frame${hover && b.film ? ' is-playing' : ''}`} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(true) }} onPointerLeave={() => setHover(false)}>
        <img src={b.hero} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
        {b.film && <video ref={video} className="card__film" src={b.film} muted loop playsInline preload="none" disablePictureInPicture aria-hidden="true" />}
        <span className="card__kind label">{KINDS[b.kind]}</span>
      </div>
      <div className="card__body">
        <p className="label muted card__status">{KINDS[b.kind]} · {b.status}</p>
        <h3 className="card__name">{b.name}</h3>
        <p className="card__about muted">{b.about[0]}</p>
        <div className="card__actions">
          {/* The showroom: walk through the real thing, read-only, no sign-in (2026-11-26). */}
          {b.try && <OpenLink href={b.try}>Try {b.name}</OpenLink>}
          {b.url && <OpenLink href={b.url}>Open {b.name}</OpenLink>}
          {b.access && (
            <a className="button" href={`/#contact:${b.slug}`}>
              {b.access}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
