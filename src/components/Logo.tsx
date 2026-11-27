import { site } from '../site'

// The wordmark is type, not an image. It is also the quiet door to SCOUT, Jack's private workspace at
// /scout (served by its own deployment through vercel.json): a plain link, so the page really leaves.
export function Logo() {
  return (
    <a href="/scout" className="logo" aria-label={`${site.name} — SCOUT`}>
      iaos21
    </a>
  )
}
