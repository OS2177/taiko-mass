# Taiko Mass — Build Status

_Last updated: 10 June 2026 (eve)_

## Live
- **URL:** https://taiko-mass.vercel.app
- **Repo:** https://github.com/OS2177/taiko-mass
- **Deploy:** Vercel, auto-deploys on push to `main`
- **Local path:** `/home/wzrdkng369/Taiko_Mass/`

## Stack
Standalone Vite + React app. No backend, no env vars, no secrets — pure static frontend. Source in `src/` (`main.jsx`, `index.css`, `TaikoMassSite.jsx`). Static assets (e.g. thumbnails) live in `public/`. `.gitignore` covers `node_modules`, `dist`, `.vercel`, `.env`, `.env.local`.

## Design state

### Hero / footer fields (settled — unchanged today)
- One `FieldSquare` component, `palette` prop (`"dawn"` | `"sun"`), colors only in `SQUARE_PALETTES`.
- Hero (top) = dawn; footer (bottom) = sun, vertically flipped (`scaleY(-1)`) as a mirror.
- Both fields show a **"Taiko Mass"** wordmark, top-left, ember, upright.
- **Crisp strata** — no `ctx.filter` blur anywhere (renders identically on desktop + mobile). Bands draw at `-40,-40,W+80,H+80`. Reflection at `globalAlpha 0.18`.
- Morph (square -> circle -> triangle) driven by pointer speed; rests when still.

### Warm tint (settled — unchanged today)
- Fixed full-page overlay: `background:#ff8a3d`, `mixBlendMode:overlay`, `opacity:0.22`. Bakes golden-hour warmth in for all viewers, independent of any device Night Shift.

### Builds & Writing lists (NEW — today's work)
- **Status vocabulary:** only **Live** and **Building**. Live shows in mint (`#00e5a0`); Building in muted ash. (Earlier prototype/refinement/development labels retired.)
- **Ordering:** Live group first, then Building; newest-to-oldest by `date` within each group. Essays sort purely newest-to-oldest. Driven by `STATUS_RANK` + a `date` field; the list re-sorts itself.
- **Date convention:** `date` ("YYYY-MM") = the date the item was **made live / published**. It is a MANUAL field — set it when you flip something to Live. (The site is static, so there's no auto-stamping; the convention is the mechanism.) Because Orbit is Live with the newest date, it naturally sits at the top.
- **Interaction:** click-to-expand accordion. Click a row -> its preview expands (one open at a time per list). Moving the mouse off the OPEN row closes it after ~220ms; on mobile, tap toggles. Open is a gentle 0.8s glide; close is a quicker fast-start/soft-settle 0.55s curve. The row's arrow rotates 90 degrees when open.
- **Preview card:** thumbnail (image if `thumb` set, else a text placeholder shown behind the image and revealed on load error — no broken-image icon) + a one-line blurb + a borderless **"Visit"** link opening the real app in a new tab (`target=_blank rel=noopener`). Items with no real URL show "Coming soon".
- Components: `WorkList({items,size})` owns the open-row state; `WorkRow` is controlled by it. No `isTouch` state, no hover-to-expand.

### Current build data
- **Builds:** Orbit (Live, `https://orbit-nine-liard.vercel.app/`, thumb `/orbit-thumb.png`), Navigator, SOMA, Wordmark (all Building, placeholder `#` URLs for now).
- **Writing:** What Is Eating You, The Ecology of Awareness, On the Edge, The Open Loop (placeholder `#` URLs).
- Dates on non-Orbit items are plausible placeholders that sort correctly but may not match the true timeline — update each to its real make-live/publish date over time. Blurbs are currently one-liners derived from each `note`; can be expanded to say something the note doesn't.

### Assets
- `public/orbit-thumb.png` — Orbit screenshot, used as Orbit's preview thumbnail. Full-page screenshots are wide; thumb box renders with `object-fit:contain` (whole image, letterboxed). Add `public/<name>-thumb.png` per build and set its `thumb` path to enable a thumbnail.

## Maintenance routine (adding a build / essay)
1. Add an item to `BUILDS` or `ESSAYS` in `TaikoMassSite.jsx`.
2. Set `status` (`"Live"` or `"Building"`) and `date` = the make-live/publish date.
3. Set `url` (real link -> shows "Visit"; `"#"` -> shows "Coming soon").
4. Optional: drop `public/<name>-thumb.png` and set `thumb`.
5. `npm run build` to confirm, then `git add . && git commit && git push` — Vercel redeploys automatically.

## Known notes
- Morph only animates on pointer movement; a phone at rest shows a static shape.
- Static site = no persistence/auto-timestamps; the `date` convention is manual by design.

## Source of truth
The **GitHub repo (`main`)** is authoritative. Reference `.jsx` files generated in chat may include experiments not in the live build — diff before deploying any of them over the repo.

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
