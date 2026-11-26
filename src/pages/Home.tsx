import { useEffect, useRef, useState } from 'react'
import { CAROUSEL, KINDS, bySlug, type Build } from '../builds'
import { Film, OpenLink } from '../components/Parts'
import { about, closing, hero, heroFrom, site } from '../site'
import { Contact } from '../components/Contact'
import { ArrowRight, Close, Expand, Pause, Play, Shrink, SkipBack, SkipForward } from '../components/icons'

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
  const [open, setOpen] = useState<string | null>(slugFromAddress)
  const [contact, setContact] = useState<string | false>(contactFromAddress)
  const scroller = useRef<HTMLDivElement>(null)

  // The page opens at the top, on the hero. A phone otherwise restores the last position, and a
  // leftover /#builds (left by closing a window) would jump straight to the second section.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    const h = location.hash.slice(1)
    if (h === 'builds' || h === 'top') history.replaceState(null, '', '/')
    if (!slugFromAddress() && contactFromAddress() === false) window.scrollTo(0, 0)
  }, [])

  // Back/forward and typed addresses open or close the card
  useEffect(() => {
    const read = () => { setOpen(slugFromAddress()); setContact(contactFromAddress()) }
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
    history.replaceState(null, '', '/')
  }

  function slide(dir: 1 | -1) {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.card')
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 600) + 24), behavior: 'smooth' })
  }

  const current = open ? bySlug(open) : undefined

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
            <Card key={b.slug} b={b} eager={i < 2} open={open === b.slug} onOpen={() => setOpen(b.slug)} />
          ))}
        </div>

      </section>

      {current && <Journey key={current.slug} b={current} onClose={close} />}
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
// The walk-through starts by itself and keeps going; until it is recorded, the stills take turns.
// Quiet controls over the screen: back, pause, forward, slower, full screen (also Space, arrows, F).
function Journey({ b, onClose }: { b: Build; onClose: () => void }) {
  const stills = [b.hero, ...b.views]
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [slow, setSlow] = useState(false)
  const [full, setFull] = useState(false)
  const screen = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  // Stills take turns on their own, unless paused
  useEffect(() => {
    if (b.film || stills.length < 2 || paused) return
    const t = window.setInterval(() => setI((n) => (n + 1) % stills.length), slow ? 5600 : 2800)
    return () => window.clearInterval(t)
  }, [b.film, stills.length, paused, slow])
  useEffect(() => {
    const v = video.current
    if (!v) return
    v.playbackRate = slow ? 0.6 : 1
    if (paused) v.pause()
    else v.play().catch(() => {})
  }, [paused, slow])
  useEffect(() => {
    const on = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])

  const back = () => {
    if (video.current) video.current.currentTime = Math.max(0, video.current.currentTime - 5)
    else setI((n) => (n - 1 + stills.length) % stills.length)
  }
  const forward = () => {
    if (video.current) video.current.currentTime = Math.min(video.current.duration || 0, video.current.currentTime + 5)
    else setI((n) => (n + 1) % stills.length)
  }
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else screen.current?.requestFullscreen().catch(() => {})
  }
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); setPaused((p) => !p) }
      else if (e.key === 'ArrowLeft') back()
      else if (e.key === 'ArrowRight') forward()
      else if (e.key === 'f') toggleFull()
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })

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
        <div className={`pop__screen${paused ? ' is-paused' : ''}`} ref={screen} onClick={() => setPaused((p) => !p)}>
          {b.film ? (
            <video ref={video} src={b.film} poster={b.hero} muted autoPlay loop playsInline preload="auto" disablePictureInPicture />
          ) : (
            <img key={stills[i]} src={stills[i]} alt="" />
          )}
          <div className="pop__ctl" onClick={(e) => e.stopPropagation()}>
            <button onClick={back} aria-label={b.film ? 'Back five seconds' : 'Previous screen'} title={b.film ? 'Back 5 s (←)' : 'Previous (←)'}>
              <SkipBack />
            </button>
            <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'} title={paused ? 'Play (space)' : 'Pause (space)'}>
              {paused ? <Play /> : <Pause />}
            </button>
            <button onClick={forward} aria-label={b.film ? 'Forward five seconds' : 'Next screen'} title={b.film ? 'Forward 5 s (→)' : 'Next (→)'}>
              <SkipForward />
            </button>
            <button className={`pop__speed${slow ? ' is-on' : ''}`} onClick={() => setSlow((s) => !s)} aria-pressed={slow} title={slow ? 'Back to normal speed' : 'Slower'}>
              {slow ? 'slow' : '1×'}
            </button>
            <button onClick={toggleFull} aria-label={full ? 'Leave full screen' : 'Full screen'} title={full ? 'Leave full screen (F)' : 'Full screen (F)'}>
              {full ? <Shrink /> : <Expand />}
            </button>
          </div>
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
      </div>
    </div>
  )
}
