import { useState } from 'react'
import { BUILDS, KINDS, type Kind } from '../builds'
import { Frame, PageHead } from '../components/Parts'

type Mode = 'all' | Kind

export function Work() {
  const [mode, setMode] = useState<Mode>('all')
  const list = mode === 'all' ? BUILDS : BUILDS.filter((b) => b.kind === mode)

  return (
    <>
      <PageHead eyebrow="Work" title="What we have made.">
        <p>
          {BUILDS.length} builds: applications people use every day, intelligent systems that keep them current, and
          explorations ahead of their use. The status under each one is honest.
        </p>
      </PageHead>

      <div className="chips" role="group" aria-label="Browse">
        <button aria-pressed={mode === 'all'} onClick={() => setMode('all')}>
          All
        </button>
        {(Object.keys(KINDS) as Kind[]).map((k) => (
          <button key={k} aria-pressed={mode === k} onClick={() => setMode(k)}>
            {KINDS[k]}s
          </button>
        ))}
      </div>

      <section className="grid2" aria-label="Builds">
        {list.map((b) => (
          <Frame key={b.slug} b={b} />
        ))}
      </section>
    </>
  )
}
