import { useEffect, useRef, useState, type FormEvent } from 'react'
import { card, greeter, site } from '../site'
import type { Build } from '../builds'
import { Card, Close, Form, Qr, Send, Tick } from './icons'

// The contact window: a glass chat panel over the astronaut, with Jack's agent in it.
// The agent welcomes and asks: a question, or leave your details? Questions go through
// REMIX's sealed studio route and come back into the stream, the ask box always at the
// bottom. When the visitor wants to leave their details, or the agent hands over (its answer
// ends with the reach mark), the agent wishes them a nice day and the form takes the window;
// "Send" mails Jack. Two more views sit behind the icons in the title bar: Jack's business
// card, and a QR that opens this window. (Jack, 2026-11-26: the form used to sit in the
// stream above the ask box, so a visitor's own words vanished under it.)

type Turn = { who: 'visitor' | 'runner'; text: string }
type View = 'chat' | 'form' | 'card' | 'qr'

const address = () => `${location.origin}/#contact`
/** The agent ends an answer with this when the visitor should be handed the form (runner/greeter.mjs in REMIX). */
const REACH = /<!--\s*reach\s*-->/i
const clean = (t: string) => t.replace(/<!--[\s\S]*?-->/g, '').trim()

export function Contact({ onClose, forBuild }: { onClose: () => void; forBuild?: Build }) {
  const [view, setView] = useState<View>('chat')
  const [turns, setTurns] = useState<Turn[]>(() => (forBuild ? greeter.access(forBuild.name) : greeter.hello).map((text) => ({ who: 'runner', text })))
  const [typing, setTyping] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const [ask, setAsk] = useState('')
  const stream = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const opening = (forBuild ? greeter.access(forBuild.name) : greeter.hello).length
  // Is the agent here? Asked once when the window opens (op 'status': the switch on and Jack's computer asking for
  // work lately). Away: one more line after the welcome, and the ask box points to the form instead of waiting 90 s.
  const [away, setAway] = useState(false)
  useEffect(() => {
    let live = true
    fetch(site.studioApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'status' }) })
      .then((r) => r.json()).then((j) => { if (live && j?.online === false) { setAway(true); setTurns((cur) => (cur.some((t) => t.text === greeter.away) ? cur : [...cur, { who: 'runner', text: greeter.away }])) } })
      .catch(() => {})
    return () => { live = false }
  }, [])
  const fresh = turns.length <= opening + (away ? 1 : 0) && !sent

  // The newest line stays in view
  useEffect(() => { stream.current?.scrollTo({ top: stream.current.scrollHeight, behavior: 'smooth' }) }, [turns, typing, view])

  const say = (t: string) => setTurns((cur) => [...cur, { who: 'runner', text: t }])
  /** The agent hands over: a last line, then the form. */
  const handOver = (line = greeter.bye) => { say(line); setTimeout(() => setView('form'), 900) }

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') ?? '').trim()
    const email = String(f.get('email') ?? '').trim()
    const work = String(f.get('work') ?? '').trim()
    const message = String(f.get('message') ?? '').trim()
    const access = String(f.get('access') ?? '').trim()
    const why = String(f.get('why') ?? '').trim()
    if (!name || !email) { setProblem('Your name and email are needed.'); return }
    if (forBuild && !why) { setProblem('Say what you would like to use it for.'); return }
    setSending(true); setProblem(null)
    try {
      const r = await fetch(site.studioApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'send', name, email, work, message, access, why }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j?.error || 'That did not go through.')
      setSent(name)
      const first = name.split(' ')[0] || name
      say(forBuild ? greeter.thanksAccess(first, access || forBuild.name) : greeter.thanks(first))
      setView('chat')
    } catch (err: any) {
      setProblem(err?.message || 'That did not go through. Try again in a moment.')
    } finally { setSending(false) }
  }

  async function question(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = ask.trim().slice(0, 600)
    if (!text || typing) return
    const next: Turn[] = [...turns, { who: 'visitor', text }]
    setTurns(next); setAsk('')
    if (away) { if (!sent) handOver(greeter.offline); else say(greeter.offline); return }
    setTyping(true)
    try {
      const r = await fetch(site.studioApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'ask', turns: next.slice(-12) }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error()
      let words: string | null = j?.text ? String(j.text) : null
      // The agent answers on Jack's own machine: ask for the words every two seconds, up to ninety.
      for (let i = 0; words === null && i < 45; i++) {
        await new Promise((ok) => setTimeout(ok, 2000))
        const a = await fetch(site.studioApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'answer', id: j.id }) })
        const w = await a.json().catch(() => ({}))
        if (!a.ok) throw new Error()
        if (w?.text) words = String(w.text)
      }
      if (words === null) { if (!sent) handOver(greeter.offline); else say(greeter.offline); return }
      // The agent's hand-over: its words, then the form
      if (REACH.test(words) && !sent) handOver(clean(words))
      else say(clean(words))
    } catch {
      if (!sent) handOver(greeter.offline); else say(greeter.offline)
    } finally { setTyping(false) }
  }

  const toggle = (v: Exclude<View, 'chat' | 'form'>) => setView((cur) => (cur === v ? 'chat' : v))

  return (
    <div className="pop" role="dialog" aria-modal="true" aria-label="Contact the studio" onClick={onClose}>
      <div className="cw" onClick={(e) => e.stopPropagation()}>
        <div className="pop__bar cw__bar">
          <span className="pop__dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="pop__address label">iaos21 · contact</span>
          <span className="cw__tools">
            <button className={`cw__tool${view === 'card' ? ' is-on' : ''}`} onClick={() => toggle('card')} aria-pressed={view === 'card'} title={view === 'card' ? 'Back to the chat' : 'Business card'}>
              {view === 'card' ? <Form /> : <Card />}
            </button>
            <button className={`cw__tool${view === 'qr' ? ' is-on' : ''}`} onClick={() => toggle('qr')} aria-pressed={view === 'qr'} title={view === 'qr' ? 'Close the code' : 'A code to scan: it opens this window'}>
              <Qr />
            </button>
            <button className="pop__close cw__tool" onClick={onClose} aria-label="Close"><Close size={18} /></button>
          </span>
        </div>

        <div className="cw__body">
          {view === 'card' && <BusinessCard />}
          {view === 'qr' && <ScanCode />}
          {view === 'form' && (
            <div className="cw__stream cw__formview">
              <form className="cw__form" onSubmit={send}>
                <p className="label muted">{forBuild ? `Access to ${forBuild.name}` : 'Your details, for Jack'}</p>
                <label><span className="label muted">Name</span><input name="name" autoComplete="name" required maxLength={80} autoFocus /></label>
                <label><span className="label muted">Email</span><input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
                <label><span className="label muted">Work</span><input name="work" autoComplete="organization" maxLength={160} placeholder="What you do, where" /></label>
                {forBuild ? (
                  <>
                    <label><span className="label muted">Access to</span><input name="access" defaultValue={forBuild.name} maxLength={120} /></label>
                    <label><span className="label muted">What would you like to use it for?</span><textarea name="why" rows={3} maxLength={1500} required /></label>
                  </>
                ) : (
                  <label><span className="label muted">Anything you want to say</span><textarea name="message" rows={3} maxLength={1500} /></label>
                )}
                {problem && <p className="cw__problem">{problem}</p>}
                <div className="cw__form-row">
                  <button className="button button--solid" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
                  <button className="cw__back" type="button" onClick={() => setView('chat')}>Back to the chat</button>
                </div>
              </form>
            </div>
          )}
          {view === 'chat' && (
            <>
              <div className="cw__stream" ref={stream}>
                {turns.map((t, i) => (
                  <div key={i} className={`cw__turn cw__turn--${t.who}`}>
                    {t.who === 'runner' && i === 0 && <span className="label muted cw__who">iaos21</span>}
                    <p>{t.text}</p>
                  </div>
                ))}
                {fresh && !typing && (
                  <div className="cw__chips">
                    <button type="button" className="cw__lit" onClick={() => handOver()}>{forBuild ? greeter.leaveFor(forBuild.name) : greeter.leave}</button>
                  </div>
                )}
                {sent && (
                  <div className="cw__done" role="status">
                    <span className="cw__tick"><Tick size={16} /></span>
                    <span>Sent. Jack will be in touch.</span>
                  </div>
                )}
                {typing && <div className="cw__turn cw__turn--runner"><Coming /></div>}
              </div>
              <form className="cw__ask" onSubmit={question}>
                <input ref={input} value={ask} onChange={(e) => setAsk(e.target.value)} placeholder={away ? greeter.awayAsk : 'Ask about the studio'} maxLength={600} aria-label="Ask a question" />
                <button type="submit" aria-label="Ask" disabled={typing || !ask.trim()}><Send /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Jack's card: his name and the ways to reach him, and a contact file for the phone.
function BusinessCard() {
  const vcf = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${card.name}`, `N:${card.name.split(' ').slice(1).join(' ')};${card.name.split(' ')[0]};;;`, `ORG:iaos21`, `TITLE:${card.role}`, `EMAIL;TYPE=INTERNET:${card.email}`, `URL:https://${card.web}`, `ADR;TYPE=WORK:;;;${card.where};;;`, 'END:VCARD'].join('\r\n')
  return (
    <div className="cw__card">
      <p className="label muted">{card.studio}</p>
      <h3 className="cw__name">{card.name}</h3>
      <p className="muted">{card.role}</p>
      <ul className="cw__lines">
        <li><a href={`mailto:${card.email}`}>{card.email}</a></li>
        <li><a href={`https://${card.web}`}>{card.web}</a></li>
        <li><a href={card.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li className="muted">{card.where}</li>
      </ul>
      <a className="button" href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcf)}`} download="jack-iaos21.vcf">Save contact</a>
    </div>
  )
}

// The code Jack shows from his phone: scanning it opens this window on the other phone.
function ScanCode() {
  const [src, setSrc] = useState('')
  useEffect(() => {
    let live = true
    import('qrcode').then(({ toDataURL }) => toDataURL(address(), { margin: 1, width: 640, color: { dark: '#0a0a0b', light: '#f3f3f1' } }))
      .then((url) => { if (live) setSrc(url) }).catch(() => {})
    return () => { live = false }
  }, [])
  return (
    <div className="cw__qr">
      {src ? <img src={src} alt={`A code that opens ${address()}`} /> : <div className="cw__qr-empty" />}
      <p className="label muted">Scan to leave your details</p>
      <p className="muted">{address().replace(/^https?:\/\//, '')}</p>
    </div>
  )
}

// The agent is coming (Jack, 2026-11-26): the answer is written on his own machine, which takes a
// while. A breathing orb, and a line that moves on as the seconds pass, so the wait feels alive.
const COMING: [number, string][] = [[0, 'Reaching Jack\'s agent'], [4, 'Reading your question'], [12, 'Writing an answer, on Jack\'s own machine'], [35, 'Nearly there']]
export function Coming() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const t0 = Date.now()
    const id = window.setInterval(() => setT((Date.now() - t0) / 1000), 1000)
    return () => window.clearInterval(id)
  }, [])
  const line = COMING.filter(([at]) => t >= at).at(-1)![1]
  return (
    <p className="cw__coming" role="status" aria-live="polite">
      <i className="cw__orb" aria-hidden="true" />
      <span key={line}>{line}…</span>
    </p>
  )
}
