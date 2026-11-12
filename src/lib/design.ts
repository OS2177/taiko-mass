import { useEffect, useState } from 'react'

// Two directions, as on Lisa's site: cinematic (dark) is the standard,
// editorial switches the site to the light version. ?design=editorial opens it.
export type Design = 'cinematic' | 'editorial'

const KEY = 'iaos-design'

function initial(): Design {
  const fromUrl = new URLSearchParams(location.search).get('design')
  if (fromUrl === 'cinematic' || fromUrl === 'editorial') return fromUrl
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'cinematic' || saved === 'editorial') return saved
  } catch {}
  return 'cinematic'
}

export function useDesign() {
  const [design, setDesign] = useState<Design>(initial)
  useEffect(() => {
    document.documentElement.dataset.design = design
    try {
      localStorage.setItem(KEY, design)
    } catch {}
  }, [design])
  return [design, setDesign] as const
}
