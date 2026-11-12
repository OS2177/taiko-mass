import { useEffect } from 'react'
import { usePath } from './lib/router'
import { useDesign } from './lib/design'
import { site } from './site'
import { Nav } from './components/Nav'
import { DesignSwitch } from './components/Chrome'
import { Home } from './pages/Home'
import { Work } from './pages/Work'
import { Project } from './pages/Project'
import { Approach } from './pages/Approach'
import { Studio } from './pages/Studio'
import { Remix } from './pages/Remix'
import { NotFound } from './pages/NotFound'
import { bySlug } from './builds'

export function App() {
  const path = usePath()
  const [design, setDesign] = useDesign()

  let Page: () => React.JSX.Element = NotFound
  let title = 'Not found'
  if (path === '/') [Page, title] = [Home, site.title]
  else if (path === '/work') [Page, title] = [Work, 'The work']
  else if (path.startsWith('/work/')) {
    const b = bySlug(path.slice(6))
    if (b) [Page, title] = [Project, b.name]
  } else if (path === '/approach') [Page, title] = [Approach, 'The approach']
  else if (path === '/studio') [Page, title] = [Studio, 'The studio']
  else if (path === '/remix') [Page, title] = [Remix, 'REMIX']

  useEffect(() => {
    document.title = path === '/' ? site.title : `${title} · ${site.name}`
  }, [path, title])

  return (
    <>
      <Nav />
      <main className={path === '/' ? 'is-home' : undefined}>
        <Page key={path} />
      </main>
      <DesignSwitch design={design} onChange={setDesign} />
    </>
  )
}
