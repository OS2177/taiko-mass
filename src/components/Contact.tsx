import { useEffect, useRef, useState, type FormEvent } from 'react'
import { card, greeter, site } from '../site'
import { Card, Close, Form, Qr, Send, Tick } from './icons'

// The contact window: a glass chat panel over the astronaut, with the studio's greeter in it.
// The greeter welcomes, answers questions (through REMIX's sealed studio route) and invites the
// visitor to leave their details. The form sits in the stream; "Send" mails Jack. Two more views
// sit behind the icons in the title bar: Jack's business card, and a QR that opens this window.

type Turn = { who: 'visitor' | 'runner'; text: string }
type View = 'form' | 'card' | 'qr'

const address = () => `${location.origin}/#contact`

export function Contact({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<View>('form')
  const [turns, setTurns] = useState<Turn[]>(() => greeter.hello.map((text) => ({ who: 'runner', text })))
  const [typing, setTyping] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const [ask, setAsk] = useState('')
  const stream = useRef<HTMLDivElement>(null)

  // The newest line stays in view
  useEffect(() => { stream.current?.scrollTo({ top: stream.current.scrollHeight, behavior: 'smooth' }) }, [turns, typing, sent])

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') ?? '').trim()
    const email = String(f.get('email') ?? '').trim()
    const work = String(f.get('work') ?? '').trim()
    const message = String(f.get('message') ?? '').trim()
    if (!name || !email) { setProblem('Your name and email are needed.'); return }
    setSending(true); setProblem(null)
    try {
      const r = await fetch(site.studioApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'send', name, email, work, message }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j?.error || 'That did not go through.')
      setSent(name)
      setTurns((t) => [...t, { who: 'runner', text: greeter.thanks(name.split(' ')[0] || name) }])
    } catch (err: any) {
      setProblem(err?.message || 'That did not go through. Try again in a moment.')
    } finally { setSending(false) }
  }

  async function question(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = ask.trim().slice(0, 600)
    if (!text || typing) return
    const next: Turn[] = [...turns, { who: 'visitor', text }]
    setTurns(next); setAsk(''); setTyping(true)
    try {
      const r = await fetch(site.studioApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'ask', turns: next.slice(-12) }) })
      const j = await r.json().catch(() => ({}))
      setTurns((t) => [...t, { who: 'runner', text: (r.ok && j?.text) || greeter.offline }])
    } catch {
      setTurns((t) => [...t, { who: 'runner', text: greeter.offline }])
    } finally { setTyping(false) }
  }

  const toggle = (v: View) => setView((cur) => (cur === v ? 'form' : v))

  return (
    <div className="pop" role="dialog" aria-modal="true" aria-label="Contact the studio" onClick={onClose}>
      <div className="cw" onClick={(e) => e.stopPropagation()}>
        <div className="pop__bar cw__bar">
          <span className="pop__dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="pop__address label">iaos21 · contact</span>
          <span className="cw__tools">
            <button className={`cw__tool${view === 'card' ? ' is-on' : ''}`} onClick={() => toggle('card')} aria-pressed={view === 'card'} title={view === 'card' ? 'Back to the form' : 'Business card'}>
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
            <>
              <div className="cw__stream" ref={stream}>
                {turns.map((t, i) => (
                  <div key={i} className={`cw__turn cw__turn--${t.who}`}>
                    {t.who === 'runner' && i === 0 && <span className="label muted cw__who">iaos21</span>}
                    <p>{t.text}</p>
                  </div>
                ))}
                {sent ? (
                  <div className="cw__done" role="status">
                    <span className="cw__tick"><Tick size={16} /></span>
                    <span>Sent. Jack will be in touch.</span>
                  </div>
                ) : (
                  <form className="cw__form" onSubmit={send}>
                    <label><span className="label muted">Name</span><input name="name" autoComplete="name" required maxLength={80} /></label>
                    <label><span className="label muted">Email</span><input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
                    <label><span className="label muted">Work</span><input name="work" autoComplete="organization" maxLength={160} placeholder="What you do, where" /></label>
                    <label><span className="label muted">Anything you want to say</span><textarea name="message" rows={3} maxLength={1500} /></label>
                    {problem && <p className="cw__problem">{problem}</p>}
                    <button className="button button--solid" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
                  </form>
                )}
                {typing && <div className="cw__turn cw__turn--runner"><p className="muted">…</p></div>}
              </div>
              <form className="cw__ask" onSubmit={question}>
                <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Ask about the studio" maxLength={600} aria-label="Ask a question" />
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
