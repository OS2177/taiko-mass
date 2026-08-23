# Taiko Mass — Build Status

_Last updated: 23 August 2026_

## Live
- **URL:** https://taiko-mass.vercel.app
- **Repo:** https://github.com/OS2177/taiko-mass
- **Deploy:** Vercel, auto-deploys on push to `main`
- **Local path:** `/home/wzrdkng369/iAOS21/PROJECTS/Taiko_Mass/`

## Stack
Standalone Vite + React app. No backend, no env vars, no secrets — pure static frontend.

- `src/main.jsx`, `src/index.css`, `src/TaikoMassSite.jsx` — the React app (one route, `/`).
- `src/content.js` — **all site content** (BUILDS, ESSAYS, FOOTER_LINKS, sort logic).
- `public/` — static assets *and* the standalone essay pages (plain HTML, outside React).
- `.gitignore` covers `node_modules`, `dist`, `.vercel`, `.env`, `.env.local`.

Two rendering worlds live side by side: the **React app** (hero fields, Builds/Writing
lists) and the **plain-HTML essay pages** in `public/`, which Vite copies verbatim to the
build. They share look and behaviour by convention, not by code — see "Essay pages" below.

## Design state

### Theme — dark ↔ light (added Aug 2026)
- `THEMES = { dark, light }` at the top of `TaikoMassSite.jsx` is the single palette source.
  Dark is the original. Light is a warm near-white ground with near-black ink and hairline
  greys. Every component takes a `T` prop; nothing should read `C` (the dark default) except
  legacy call sites.
- **Persistence + default:** the choice is stored in `localStorage["tm-theme"]`. A stored
  choice always wins. With nothing stored, the site defaults to **dark at night (local
  20:00–06:59), light otherwise**.
- **Toggle:** fixed bottom-right `.theme-toggle` button ("☀ Light" / "☾ Dark").
- The essay pages implement the same rule independently (inline `<script>` in each page's
  `<head>`, running before paint so there is no flash) and write the same `tm-theme` key,
  so the choice carries back and forth between the site and the essays.
- **Light-mode differences:** the hero canvases render at `fieldOpacity 0.82` with `line`
  on; the warm tint is **not** drawn (on white it would muddy the page).

### Hero / footer fields (settled)
- One `FieldSquare` component, `palette` prop (`"dawn"` | `"sun"`), colours only in
  `SQUARE_PALETTES`.
- Hero (top) = dawn; footer (bottom) = sun, vertically flipped (`scaleY(-1)`) as a mirror.
- Both fields carry a glitching **"Taiko Mass"** wordmark top-left (ember, upright) and a
  static `iAOS21` top-right.
- **Crisp strata** — no `ctx.filter` blur anywhere (renders identically on desktop +
  mobile). Bands draw at `-40,-40,W+80,H+80`. Reflection at `globalAlpha 0.18`.
- Morph (square -> circle -> triangle) driven by pointer speed; rests when still.
- `FieldSquare` is the **only** field component; it is mounted twice (hero + footer).
  Earlier unmounted stages of the "energy → matter" hero descent (`FieldFade`, `FieldMass`,
  `StillFade`, `StillSquare`, `StillMass`) were deleted on 3 Aug 2026 — they had never been
  rendered. Recover from git history if that descent is ever rebuilt.

### Warm tint
- Fixed full-page overlay: `background:#ff8a3d`, `mixBlendMode:overlay`, `opacity:0.22`.
  Bakes golden-hour warmth in independently of any device Night Shift.
- **Dark mode only** — it is not rendered in light mode.

### Glitch wordmark
- `GlitchWordmark` scrambles between **"Taiko Mass"** (A) and **"Jack Vintage"** (B) through
  a fixed glyph set. Hover flips A→B; leaving flips B→A at `RETURN_SCALE = 8/3` (the return
  scramble runs 2.67× slower than the flip out).
- **Auto-blip:** with no pointer on it, it flashes to "Jack Vintage" for 800ms, settles
  back, then waits 10s. Skipped while hovered so the pointer stays in control.
- Rendered 3× — hero, mirrored footer field, and the footer nav.
- `GlitchText` is the same character effect applied to build/essay row titles on hover, but
  it resettles to the *same* text rather than flipping to another word.
- **`public/essay.js` contains a vanilla-JS port of `GlitchWordmark`** so the essay pages'
  nav wordmark behaves identically. Same glyphs, same frame maths, same 10s cadence.
  **If you change one, change the other** — they have no shared code.

### Builds & Writing lists
- **Status vocabulary:** only **Live** and **Building** (builds only; essays carry no
  status). Live shows in mint; Building in muted ash.
- **Ordering:** Live group first, then Building; newest-to-oldest by `date` within each
  group. Essays sort purely newest-to-oldest. Driven by `STATUS_RANK` + the `date` field in
  `content.js`; the lists re-sort themselves.
- **Date convention:** `date` ("YYYY-MM") = the date the item was **made live / published**.
  It is a MANUAL field — set it when you flip something to Live. The site is static, so
  there is no auto-stamping; the convention *is* the mechanism.
- **Interaction:** click-to-expand accordion. Click a row -> its preview expands (one open
  at a time per list). Moving the mouse off the OPEN row closes it after ~220ms; on mobile,
  tap toggles. Open is a gentle 0.8s glide; close is a quicker fast-start/soft-settle 0.55s
  curve. The row's arrow rotates 90° when open.
- **Preview card:** thumbnail + one-line `blurb` + one action. The thumbnail is suppressed
  entirely for items that have a `page` (essays), so essay previews are text-only.
  When shown, a text placeholder sits behind the image and is revealed on load error — no
  broken-image icon.
- **Action precedence in `WorkRow` (first match wins):**
  1. `page` set -> **"Read ↗"**, a normal same-tab link to the standalone HTML page.
  2. real `url` (not `"#"`) -> **"Visit ↗"**, new tab (`target=_blank rel=noopener`).
  3. otherwise -> **"Coming soon"** (dimmed, not a link).
- Components: `WorkList({items,size,T})` owns the open-row state; `WorkRow` is controlled by
  it. No `isTouch` state, no hover-to-expand.
- **Long-form lives in `public/` only.** An in-site `ReadingRoom` overlay (plus a small
  markdown renderer and a `body` content field) used to render essays inside the app; it
  was deleted on 3 Aug 2026, having gone unreachable once every essay moved to its own
  page. There is now exactly one way to publish an essay — see below.

### Essay pages (standalone HTML, `public/`)
Each essay is a self-contained page, not React. The scaffold, in order:

1. `<head>`: title, Space Mono webfont, the inline pre-paint theme script, `/essay.css`.
2. `<div class="tint">` — the warm overlay, CSS-driven.
3. `<nav class="site-nav">` — glitch wordmark linking to `/`, plus `iAOS21`.
4. `<div class="sheet">` — the article body.
5. `<a class="home-link" href="/">← Home</a>`, the `.theme-toggle` button, `/essay.js`.

- Shared styling lives in `public/essay.css`; shared behaviour in `public/essay.js`.
  Both are served from the site root, so pages reference them as `/essay.css`, `/essay.js`.
- Page filenames match each essay's `slug` in `content.js`, and `page` is the absolute path
  (`/the-open-loop.html`).

### Mobile
- `html,body{overflow-x:hidden;max-width:100%}` — nothing may push the page sideways; on a
  phone that reads as the whole page sliding under the thumb.
- Under **600px**, list rows wrap: title, status and arrow hold the first line and the
  description drops underneath the title (it used to be squeezed between them and overflow).
- Under **680px**, preview cards stack vertically and the thumbnail goes full-width.

### Current site data (`src/content.js`)
- **Builds:** Neko No Michi (Live, 2026-08, `nekonomichi.iaos21.com`, thumb) · KISSA
  (Live, 2026-07, `kissa-site.vercel.app`, thumb) · Orbit (Live, 2026-06,
  thumb) · Navigator (Building, 2026-05) · SOMA (Building, 2026-04) · Wordmark (Building,
  2026-03, thumb). The three Building items have placeholder `#` URLs.
- **Writing:** Humanetics (2026-07) · The Ecology of Awareness (2026-02) · On the Edge
  (2025-12) · The Open Loop (2025-10). All four are complete essays with standalone pages;
  all carry `url:"#"` because the page *is* the destination.
- **Footer:** `FOOTER_LINKS` — currently LinkedIn only. Add entries there.
- Dates on the Building items are plausible placeholders that sort correctly but may not
  match the true timeline — update each to its real make-live date over time.

### Assets
`public/orbit-thumb.png`, `public/kissa-thumb.png`, `public/wordmark-thumb.png`,
`public/neko-thumb.png`. Full-page
screenshots are wide; the thumb box renders `object-fit:contain` (whole image, letterboxed).
Add `public/<name>-thumb.png` per build and set its `thumb` path to enable a thumbnail.

## Maintenance routine

### Adding a build
1. Add an item to `BUILDS` in **`src/content.js`** (never in the component).
2. Set `status` (`"Live"` | `"Building"`) and `date` = the make-live date.
3. Set `url` (real link -> "Visit ↗"; `"#"` -> "Coming soon") and a one-line `blurb`.
4. Optional: drop `public/<name>-thumb.png` and set `thumb`.
5. `npm run build`, then commit and push — Vercel redeploys automatically.

### Adding an essay
1. Copy an existing page in `public/` as the scaffold — keep the head script, `.site-nav`,
   `.sheet`, home link, `.theme-toggle` and the `/essay.js` tag intact. Replace the prose.
2. Name it `<slug>.html`.
3. Add an item to `ESSAYS` in `src/content.js` with `title`, `slug`, `note`, `date`,
   `blurb`, `url:"#"` and `page:"/<slug>.html"`.
4. `npm run build`, then commit and push.

## Known notes
- Morph only animates on pointer movement; a phone at rest shows a static shape.
- Static site = no persistence/auto-timestamps; the `date` convention is manual by design.
- The React app and the essay pages duplicate the theme rule and the glitch wordmark. There
  is no shared module — changing one requires changing the other by hand.
- Essay page sizes vary a lot (8–63 KB) purely from prose length and inline markup; a small
  file is not a stub.

## Source of truth
The **GitHub repo (`main`)** is authoritative. Reference `.jsx` files generated in chat may
include experiments not in the live build — diff before deploying any of them over the repo.

## Working setup — two representations of the same site (READ THIS)

This project's source exists in TWO forms that must stay in sync:

1. **Repo (source of truth):** `src/TaikoMassSite.jsx` + `src/content.js`.
   This is the real, deployed app — a proper two-file split where content
   (BUILDS, ESSAYS, sort logic) lives in content.js and the component
   imports it. ALL committed/deployed changes happen here.

2. **Preview file (chat-only, NOT in the repo):** a single self-contained
   `TaikoMassSite_preview.jsx` used only to preview changes in the Claude
   chat interface before they're applied to the repo. It inlines the
   content back into one file because the chat preview can't resolve the
   `./content` import. It is a disposable mirror, never deployed.

**The workflow:** changes are previewed in the single-file version first,
then translated into instructions applied to the repo's split files.

**Divergence flag — IMPORTANT:** because the same code lives in two places,
they can drift. Before acting on any change request:
- Treat the REPO (TaikoMassSite.jsx + content.js) as authoritative. If a
  preview file and the repo disagree, the repo wins.
- If you are given a preview/single-file version to apply, do NOT paste it
  in wholesale — port only the intended change into the split files, and
  flag to me explicitly that the change came from the preview so I can
  confirm nothing else diverged.
- If you notice the repo's component logic no longer matches what a
  preview or instruction assumes (e.g. different component structure,
  missing props, renamed pieces), STOP and flag the divergence with a
  short diff summary rather than guessing — ask me which version is
  correct before changing anything.
- content.js is the only place site content (builds/essays/dates/links/
  thumbs) should be edited. If content appears hardcoded in the component
  again, flag it — it belongs in content.js.
