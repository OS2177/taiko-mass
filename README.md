# iaos21.com — the studio site

iAOS21, an independent building studio. The shape is Lisa's site
(`../lisa-tilstra-hope/web`): fixed bottom bar, featured-build hero, three
tiles, selected work with a reader, and the archive with the 3 / 5 / 8 / ALL
wall. Builds take the place of portraits and episodes.

- `src/builds.ts` — **all the builds**: names, lines, status, images, links. Edit this to update the site.
- `src/site.ts` — name, contact address, navigation.
- `public/img/builds/` — build imagery (real screenshots where the build is online; design boards for the rest).
- `taiko/` — the original Taiko Mass site, kept whole, served at `/taiko-mass/`. The essays stay at their old root addresses (`/humanetics.html` …) and link back to it.
- `vercel.json` — the `/lisa`, `/kosmo`, `/mojima`, `/kosmopoliet` rewrites, then the SPA fallback.

## Run
    npm install
    npm run dev        # http://localhost:5190
    npm run build      # both sites into dist/ (dist/taiko-mass for the old one)

## Deploy
Vercel project `taiko-mass`, hooked to GitHub: a push to `main` goes live at iaos21.com; any other branch gets a preview URL.
Gate every push on `npm run build`. Check with `npx vercel ls taiko-mass 2>&1 | head`.
