# iaos21.com, third build (Jack's plan, 25 Nov 2026)

One long page. No header: the bar sits at the bottom of the screen and never moves,
the way Lisa's site does it (her `.bar`, fixed to the bottom, dark, links + logo).

## The page, top to bottom

1. **Hero movie.** Full screen, muted, loops. Jack is making it in DEPLOY.
   Until it exists: a dark still, same size, so the page can be built around it.
2. **The builds.** A horizontal carousel, left to right, one card per build,
   in the look of the Wordmark "Made with" gallery (attached picture):
   big dark frame with the build's front door in it, a small label at the
   bottom-left of the frame ("LANDING PAGE" → for us: the kind of build),
   name under the frame, one grey line under the name.
   Order: MOJIMA first, then as Jack sets it.
   Click a card → it opens in place and plays that build's run-through
   (splash → enter → three or four features, 12–20 s, recorded from the real
   build with our keys, captions under each step). Under the film: one link
   to the real landing page, and the request-access note where it applies.
3. **Second movie.** Full width. The closing film.
4. **About Jack.** Short text, his words. Never invented facts.
5. **The bar.** Fixed to the bottom from the first scroll: name, the
   sections, contact. Replaces header and footer both.

## Builds in the carousel (16)

MOJIMA · REMIX (with CHIP) · DEPLOY · AEON · KISSA (incl. POS + KDS screens) ·
KOSMO (front page, then the kitchen) · Lisa Tilstra · Neko no Michi ·
TrendinQ × VIX (shop, then back office) · Lingua · Wordmark (incl. the full
editor) · Orbit · and the rest of today's list (Snoei, Pocket, Scout) if kept.

Lingua and Wordmark are not in `src/builds.ts` yet.

## Run-throughs

- One film per build, recorded by a browser script we re-run when the build
  changes. AEON is a screen recording of the native app.
- The carousel shows a still; the film loads only when a card is opened.
- Missing inside views today: MOJIMA landing ("coming soon"), Neko no Michi
  past the gate, KISSA POS/KDS, AEON real screens.

## Not yet decided

- Hero movie length and whether it has sound (default: none).
- Carousel order after MOJIMA.
- Whether the old build pages (/work/<slug>) stay or the carousel is all.
