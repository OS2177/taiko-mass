import { useEffect } from 'react'
import { usePath } from './lib/router'
import { site } from './site'
import { Bar } from './components/Bar'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { AeonShowroom } from './pages/Aeon'

// One page. Old addresses (/work/<slug>) land on the same page with that build's card open.
export function App() {
  const path = usePath()
  const home = path === '/' || path.startsWith('/work/')
  // The AEON showroom (2026-11-26): a native app's screens, walked through; its own full page, no bar.
  const aeon = path === '/try/aeon'

  useEffect(() => {
    if (!aeon) document.title = home ? site.title : `Not found · ${site.name}`
  }, [home, aeon])

  if (aeon) return <AeonShowroom />
  return (
    <>
      <main>{home ? <Home /> : <NotFound />}</main>
      <Bar />
    </>
  )
}
