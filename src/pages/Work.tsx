import { useMemo, useState } from 'react'
import { BUILDS, KINDS, type Build, type Kind } from '../builds'
import { Link } from '../lib/router'
import { Logo } from '../components/Logo'
import { ArrowRight } from '../components/icons'

// The archive: Lisa's portrait wall with builds in it. 3 / 5 / 8 show one
// tile per build; ALL shows every view of every build, as a dense mosaic.
const DENSITIES = [3, 5, 8, 0] as const
type Mode = 'all' | Kind

type View = { b: Build; img: string; i: number }

export function Work() {
  const [q, setQ] = useState('')
  const [cols, setCols] = useState<(typeof DENSITIES)[number]>(3)
  const [mode, setMode] = useState<Mode>('all')

  const term = q.trim().toLowerCase()
  const builds = useMemo(() => {
    const byKind = mode === 'all' ? BUILDS : BUILDS.filter((b) => b.kind === mode)
    return term
      ? byKind.filter((b) => (b.name + ' ' + b.line + ' ' + b.status + ' ' + b.about.join(' ')).toLowerCase().includes(term))
      : byKind
  }, [mode, term])

  const views: View[] = useMemo(
    () =>
      cols === 0
        ? builds.flatMap((b) => [b.hero, ...b.views].map((img, i) => ({ b, img, i })))
        : builds.map((b) => ({ b, img: b.hero, i: 0 })),
    [builds, cols],
  )
  const total = BUILDS.reduce((n, b) => n + 1 + b.views.length, 0)

  return (
    <div className="podcast">
      <header className="podcast__head">
        <div className="podcast__brand">
          <h1 className="visually-hidden">The work of iAOS21</h1>
          <Logo />
          <p className="caps podcast__sub">Builds · applications · intelligent systems</p>
        </div>
        <div className="podcast__tools">
          <p className="caps">
            {BUILDS.length} builds · {total} views
          </p>
          <div className="density" role="group" aria-label="Tiles per row">
            {DENSITIES.map((d) => (
              <button key={d} aria-pressed={cols === d} onClick={() => setCols(d)}>
                {d || 'All'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="podcast__bar">
        <input className="field" type="search" placeholder="Search the work" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tabs tabs--kinds" role="tablist" aria-label="Kind of work">
          <button role="tab" aria-selected={mode === 'all'} onClick={() => setMode('all')}>
            All work
          </button>
          {(Object.keys(KINDS) as Kind[]).map((k) => (
            <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)}>
              {KINDS[k]}
            </button>
          ))}
        </div>
      </div>

      {term && <p className="podcast__found muted">{builds.length} found</p>}
      <ol className={`wall wall--${cols || 'all'}`}>
        {views.map((v, n) => (
          <Portrait key={v.b.slug + v.i} v={v} index={n} compact={cols === 8 || cols === 0} />
        ))}
      </ol>
    </div>
  )
}

function Portrait({ v, index, compact }: { v: View; index: number; compact: boolean }) {
  const { b, img } = v
  return (
    <li className="portrait">
      <Link href={`/work/${b.slug}`} className="portrait__link" aria-label={`${b.name}: ${b.line}`}>
        <img className="portrait__img" src={img} alt="" loading={index < 6 ? 'eager' : 'lazy'} />
        {!compact && (
          <span className="portrait__caption">
            <span className="caps">{KINDS[b.kind]}</span>
            <span className="serif">{b.name}</span>
          </span>
        )}
        <span className="portrait__reveal">
          <span className="caps muted">{b.status}</span>
          <span className="serif portrait__name">{b.name}</span>
          <span className="serif portrait__topic">{b.line}</span>
          {!compact && <span className="portrait__summary">{b.about[0]}</span>}
          <span className="caps portrait__listen">
            The build <ArrowRight size={18} />
          </span>
        </span>
      </Link>
    </li>
  )
}
