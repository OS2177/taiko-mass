import { useMemo, useState } from 'react'
import { BUILDS, KINDS, type Build, type Kind } from '../builds'
import { Link } from '../lib/router'
import { MoreLink } from './Parts'
import { ArrowRight } from './icons'

// Home, below the tiles: a grid of builds (left) and the chosen build (right).
// The same place Lisa's conversations sit; a build instead of an episode.

type Mode = 'all' | Kind
const STEP = 8

export function Selected() {
  const [mode, setMode] = useState<Mode>('all')
  const [shown, setShown] = useState(STEP)
  const [picked, setPicked] = useState<Build>(BUILDS[0])

  const list = useMemo(() => (mode === 'all' ? BUILDS : BUILDS.filter((b) => b.kind === mode)), [mode])

  const pick = (m: Mode) => {
    setMode(m)
    setShown(STEP)
  }

  return (
    <section className="convo" aria-label="Selected work">
      <div className="convo__grid">
        <header className="convo__head">
          <h2 className="serif">{BUILDS.length} builds</h2>
          <div className="chips" role="group" aria-label="Browse">
            <button aria-pressed={mode === 'all'} onClick={() => pick('all')}>
              All {BUILDS.length}
            </button>
            {(Object.keys(KINDS) as Kind[]).map((k) => (
              <button key={k} aria-pressed={mode === k} onClick={() => pick(k)}>
                {KINDS[k]}
              </button>
            ))}
          </div>
        </header>
        <ol className="cards4">
          {list.slice(0, shown).map((b) => (
            <li key={b.slug}>
              <button
                className={b.slug === picked.slug ? 'card is-picked' : 'card'}
                onClick={() => setPicked(b)}
                aria-label={`${b.name}: show this build`}
              >
                <img src={b.views[0] ?? b.hero} alt="" loading="lazy" />
                <span className="card__text">
                  <span className="serif card__name">{b.name}</span>
                  <span className="serif card__topic">{b.line}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="convo__more">
          {list.length > shown && (
            <button className="pill pill--outline" onClick={() => setShown(shown + STEP)}>
              Show more
            </button>
          )}
          <MoreLink href="/work">All the work</MoreLink>
        </div>
      </div>
      <BuildPanel b={picked} />
    </section>
  )
}

function BuildPanel({ b }: { b: Build }) {
  return (
    <article className="panel" aria-live="polite" key={b.slug}>
      <img className="panel__img" src={b.hero} alt="" />
      <div className="panel__title">
        <p className="caps muted">{KINDS[b.kind]}</p>
        <h3 className="serif panel__guest">{b.name}</h3>
        <p className="serif panel__topic">{b.line}</p>
        <p className="caps muted panel__meta">{b.status}</p>
      </div>
      <div className="panel__notes">
        <p>{b.about[0]}</p>
      </div>
      <div className="panel__links">
        <Link href={`/work/${b.slug}`} className="more">
          <span className="caps">The build</span>
          <ArrowRight size={26} />
        </Link>
        {b.url && (
          <a className="textlink" href={b.url} target="_blank" rel="noopener noreferrer">
            Open it ↗
          </a>
        )}
      </div>
    </article>
  )
}
