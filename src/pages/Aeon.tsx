import { useEffect, useState } from 'react'
import { navigate } from '../lib/router'
import '../aeon-showroom.css'

// THE AEON SHOWROOM (Jack, 2026-11-26: "aeon you can show the best features"). AEON is a native app with
// nothing to open in a browser, so its showroom is its screens: the real ones from the first version, each
// filling the page, with the same onboarding tour as REMIX's and Mojima's gliding over them, card by card.
// After the tour the screens stay to browse from the strip at the foot. Opens at /try/aeon; the tour comes
// by itself the first time on a device and again from "Show me around".

const img = (f: string) => `/img/builds/${f}`

type Screen = { id: string; name: string; src: string }
const SCREENS: Screen[] = [
  { id: 'splash', name: 'AEON', src: img('aeon-splash.webp') },
  { id: 'soundlab', name: 'Sound Lab', src: img('aeon-soundlab.webp') },
  { id: 'bank', name: 'Drums · Sound Bank', src: img('aeon-bank.webp') },
  { id: 'fm', name: 'Keys · FM', src: img('aeon-fm.webp') },
  { id: 'perform', name: 'Perform', src: img('aeon-perform.webp') },
  { id: 'arrange', name: 'Arrange', src: img('aeon-arrange.webp') },
  { id: 'decks', name: 'Decks', src: img('aeon-decks.webp') },
  { id: 'decks4', name: 'Decks · 4 players', src: img('aeon-decks4.webp') },
  { id: 'overview', name: 'Every screen', src: img('aeon-overview.webp') },
]

type Stop = { glyph: string; screen: string; title: string; text: string[] }
const STOPS: Stop[] = [
  { glyph: '◆', screen: 'splash', title: 'Welcome to the AEON showroom',
    text: ['AEON is a native music workstation, built in C++ for the desktop: a sound lab, drums, keys, a performance surface, an arranger, four decks and a mixer.', 'It is not public yet, so this showroom walks through its screens, taken from the first version as it runs today.'] },
  { glyph: '◉', screen: 'soundlab', title: 'The Sound Lab',
    text: ['A sample on the table and twelve effects under it: drive, grains, shimmer, vowel, delay, chorus, phaser, clouds, plate, reverb, filter, EQ.', 'Each effect is a card with a texture you drag across. Every change is heard as you make it.'] },
  { glyph: '▦', screen: 'bank', title: 'Drums and the Sound Bank',
    text: ['Sixteen pads, a step sequencer and a sample editor on one page.', 'The Sound Bank holds kits and patterns in ten styles. A beat is recorded by playing the pads, and lands in your library.'] },
  { glyph: '♪', screen: 'fm', title: 'Keys, with an FM engine',
    text: ['The keys have a second engine: six-operator FM the way the classic FM synthesizers did it, with 32 algorithms and 128 factory voices.', 'A voice from a DX7 loads straight in over SysEx. An arpeggiator and a sequencer sit beside it.'] },
  { glyph: '▣', screen: 'perform', title: 'Perform',
    text: ['Pads, eight loops, clips launched in scenes, and gesture effects held for a moment: stutter, reverse, tape stop, a filter sweep.', 'Eight macros, and snapshots you morph between with one fader.'] },
  { glyph: '≡', screen: 'arrange', title: 'Arrange',
    text: ['A performance is captured as scenes in bars, laid out on the timeline with automation lanes under the tracks.', 'From here a song exports as a WAV, as stems, or runs to tape.'] },
  { glyph: '◎', screen: 'decks4', title: 'Decks',
    text: ['Four players modelled on the CDJ-2000NXS2 and a mixer modelled on the DJM-900NXS2: hot cues, loops, slip, colour effects and beat effects, needle search.', 'A built-in tutorial teaches the decks step by step. Two players or four, as you like.'] },
  { glyph: '✦', screen: 'overview', title: 'Every screen',
    text: ['Twenty-nine screens and counting: a mixer, routing, a modulation matrix, a piano roll, comping, a command palette.', 'A phone companion plays it from across the room, and screens pop out onto other displays.'] },
  { glyph: '◇', screen: 'splash', title: 'Where it stands',
    text: ['A first version runs on the desktop and is being tested by hand. Nothing is for sale yet.', 'Want to know when it is ready, or to try it on your own machine? Say so, and we come back to you.'] },
]

const TOURED = 'iaos21:aeon:toured'
const toured = () => { try { return !!localStorage.getItem(TOURED) } catch { return false } }
const markToured = () => { try { localStorage.setItem(TOURED, new Date().toISOString()) } catch { /* fine */ } }

export function AeonShowroom() {
  const [screen, setScreen] = useState('splash')
  const [on, setOn] = useState(() => !toured())
  const [n, setN] = useState(0)
  const [dir, setDir] = useState<'on' | 'back'>('on')
  const s = STOPS[n]!
  const last = n === STOPS.length - 1
  const shown = SCREENS.find((x) => x.id === screen) ?? SCREENS[0]!

  useEffect(() => { document.title = 'The AEON showroom · iAOS21' }, [])
  // Every screen is fetched once the page is up, so the tour never waits on a picture.
  useEffect(() => { SCREENS.forEach((x) => { const i = new Image(); i.src = x.src }) }, [])

  const go = (i: number) => {
    const to = Math.max(0, Math.min(STOPS.length - 1, i))
    setDir(to > n ? 'on' : 'back')
    setN(to)
    setScreen(STOPS[to]!.screen)
  }
  const close = () => { markToured(); setOn(false) }
  const open = () => { setDir('on'); setN(0); setScreen(STOPS[0]!.screen); setOn(true) }

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (on) {
        if (e.key === 'Escape') close()
        if (e.key === 'ArrowRight') go(n + 1)
        if (e.key === 'ArrowLeft') go(n - 1)
      } else {
        const at = SCREENS.findIndex((x) => x.id === screen)
        if (e.key === 'ArrowRight') setScreen(SCREENS[Math.min(SCREENS.length - 1, at + 1)]!.id)
        if (e.key === 'ArrowLeft') setScreen(SCREENS[Math.max(0, at - 1)]!.id)
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }) // every render: the handlers read the latest n and screen

  return (
    <div className="ae" data-screen={shown.id}>
      <div className="ae__stage" key={shown.id}>
        <img src={shown.src} alt={`AEON: ${shown.name}`} />
      </div>
      <header className="ae__top">
        <p><b>The AEON showroom</b><span> · screens from the first native version, November 2026</span></p>
        <div className="ae__ways">
          {!on && <button type="button" className="ae__link" onClick={open}>Show me around</button>}
          <a className="ae__link" href="/#aeon" onClick={(e) => { e.preventDefault(); navigate('/#aeon') }}>Back to iaos21.com</a>
        </div>
      </header>
      <nav className={'ae__strip' + (on ? ' is-quiet' : '')} aria-label="Screens">
        {SCREENS.map((x) => (
          <button key={x.id} type="button" className={x.id === shown.id ? 'is-on' : ''} onClick={() => { setScreen(x.id) }} aria-pressed={x.id === shown.id}>
            <img src={x.src} alt="" loading="lazy" decoding="async" /><span>{x.name}</span>
          </button>
        ))}
      </nav>
      {on && (
        <div className={'ae__tour' + (n === 0 || last ? ' is-centre' : '')} role="dialog" aria-label="A tour of the AEON showroom">
          <div className="ae__card" key={n} data-glide={dir}>
            <button type="button" className="ae__skip" onClick={close}>{last ? 'Close' : 'Skip'}</button>
            <span className="ae__glyph" aria-hidden="true">{s.glyph}</span>
            {n === 0 && <span className="ae__badge">Showroom</span>}
            <h2>{s.title}</h2>
            {s.text.map((line, i) => <p key={i}>{line}</p>)}
            <div className="ae__dots" aria-hidden="true">{STOPS.map((_, i) => <i key={i} className={i === n ? 'is-on' : ''} />)}</div>
            <div className="ae__actions">
              {n > 0 && <button type="button" className="button" onClick={() => go(n - 1)}>Back</button>}
              {!last && <button type="button" className="button button--solid" onClick={() => go(n + 1)}>Next</button>}
              {last && <a className="button button--solid" href="/#contact:aeon" onClick={(e) => { e.preventDefault(); markToured(); navigate('/#contact:aeon') }}>Ask about AEON</a>}
              {last && <button type="button" className="button" onClick={close}>Look at the screens</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
