import { useEffect } from 'react'
import { usePath } from './lib/router'
import { site } from './site'
import { Bar } from './components/Bar'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

// One page. Old addresses (/work/<slug>) land on the same page with that build's card open.
export function App() {
  const path = usePath()
  const home = path === '/' || path.startsWith('/work/')

  useEffect(() => {
    document.title = home ? site.title : `Not found · ${site.name}`
  }, [home])

  return (
    <>
      <main>{home ? <Home /> : <NotFound />}</main>
      <Bar />
    </>
  )
}
