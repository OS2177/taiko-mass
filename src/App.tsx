import { useEffect } from 'react'
import { usePath } from './lib/router'
import { site } from './site'
import { Nav } from './components/Nav'
import { Footer } from './components/Parts'
import { Home } from './pages/Home'
import { Work } from './pages/Work'
import { Project } from './pages/Project'
import { Studio } from './pages/Studio'
import { Remix } from './pages/Remix'
import { NotFound } from './pages/NotFound'
import { bySlug } from './builds'

export function App() {
  const path = usePath()

  let Page: () => React.JSX.Element = NotFound
  let title = 'Not found'
  if (path === '/') [Page, title] = [Home, site.title]
  else if (path === '/work') [Page, title] = [Work, 'Work']
  else if (path.startsWith('/work/')) {
    const b = bySlug(path.slice(6))
    if (b) [Page, title] = [Project, b.name]
  } else if (path === '/studio') [Page, title] = [Studio, 'Studio']
  else if (path === '/remix') [Page, title] = [Remix, 'REMIX']

  useEffect(() => {
    document.title = path === '/' ? site.title : `${title} · ${site.name}`
  }, [path, title])

  return (
    <>
      <Nav />
      <main>
        <Page key={path} />
      </main>
      <Footer />
    </>
  )
}
