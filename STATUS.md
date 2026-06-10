# Taiko Mass — Build Status

_Last updated: 10 June 2026_

## Live
- **URL:** https://taiko-mass.vercel.app
- **Repo:** https://github.com/OS2177/taiko-mass
- **Deploy:** Vercel, auto-deploys on push to `main`
- **Current commit:** `21fb73c` — "Remove canvas blur filters + warm overlay; label both fields Taiko Mass"
- **Local path:** `/home/wzrdkng369/Taiko_Mass/`

## Stack
Standalone Vite + React app. No backend, no env vars, no secrets — pure static frontend. Source lives in `src/` (`main.jsx`, `index.css`, `TaikoMassSite.jsx`). `.gitignore` covers `node_modules`, `dist`, `.vercel`, `.env`, `.env.local`.

## Current design state

### Layout
- **Hero (top):** single square field, dawn palette. Centered, `max-width: 880px`, `aspect-ratio: 1/1` — edges align with the content column below.
- **Content:** Builds list (Navigator, SOMA, …) then Writing list, same 880px column.
- **Footer (bottom):** the same field component, `sun` palette, vertically flipped (`scaleY(-1)`) as a mirror.

### FieldSquare component
- One component, parameterized by a `palette` prop (`"dawn"` | `"sun"`), with both palettes defined in the `SQUARE_PALETTES` constant. Colors are defined ONLY there.
- A morphing form (square → circle → triangle) driven by pointer speed; rests on the nearest shape when still.
- **Crisp strata look — no canvas blur.** All `ctx.filter` blurs were removed so the banded background renders identically on desktop and mobile (mobile Safari ignores `ctx.filter`). Bands draw at the original `-40,-40,W+80,H+80` geometry so positions are unchanged from the original blurred version.
- Reflection below the seam uses `globalAlpha 0.18` (no blur).
- A `haze` prop exists in some local copies but is NOT used in the live build — the decision was to keep both fields crisp.

### Labels
- Both the hero and the footer mirror show a **"Taiko Mass"** wordmark, top-left, in ember, placed outside the flip wrapper so it renders upright.
- Footer text block ("Taiko Mass / West Flanders · year") was removed.
- No "Energy" / "Mass" / "Matter" sub-labels in the live build.

### Warm tint
- A fixed full-page overlay bakes in a golden-hour warmth so it's standard for all viewers (independent of any device Night Shift setting).
- Current setting: `background:#ff8a3d`, `mixBlendMode:overlay`, `opacity:0.22`.
- To tune: raise/lower `opacity` (0.08 subtle → 0.30+ strong); blend can be `soft-light` (gentle) / `overlay` (current) / `multiply` (deeper).

## Known notes
- Morph only animates on pointer movement; a phone with no touch-drag shows a resting shape, not motion.
- The `haze`/`ctx.filter` blur approach does not render on mobile Safari — this is why the final design went fully crisp rather than relying on blur.
- `m.d` (disturbance accumulator) is still computed but unused after blur removal — harmless dead state.

## Source of truth
The **GitHub repo (`main`, commit `21fb73c`)** is authoritative. Reference `.jsx` files generated in chat may include experiments (e.g. the footer `haze` toggle) that are NOT in the live build — do not deploy those over the repo without diffing first.

## Possible next steps (none committed)
- Desktop wordmark sizing (it reads small/cornered on wide screens vs. mobile) — explored, then reverted; revisit if desired.
- Optional autonomous drift so the morph animates on mobile without a touch.
- Custom domain (currently on the free `*.vercel.app`).
