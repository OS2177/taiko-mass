# Images for iaos21.com

Every image slot on the site, with the size to supply. All sizes are width × height in pixels.
Supply JPG or PNG; the build converts to webp. File names go in `src/builds.ts`.

## Formats (three only)

| Format | Size | Ratio | Used for |
|---|---|---|---|
| **Wide** | 2400 × 1500 | 16:10 | Hero on the home page (fills the right 60% of the screen, full height), the head of each build page, the "more views" gallery, the archive wall. Keep the subject in the middle: the wall crops it square, the hero crops the sides on tall screens. |
| **Card** | 800 × 1000 | 4:5 | The small cards in the "14 builds" grid on the home page. Portrait crop. |
| **Tile** | 1600 × 860 | 506:272 | The three tiles under the hero (The work, REMIX, The studio). Quiet images: the words sit under them now. |

## Per build (14 builds)

For each build: **1 wide** (the main picture, `hero`), **1 card**, and **2 to 4 more wide** (`views`).
The ALL view of the archive shows the hero and every view, so 3 to 5 pictures per build in total.

| Build | hero (wide) | card | views (wide) | Note |
|---|---|---|---|---|
| REMIX | ✓ | ✓ | 3–4 | Featured in the hero rotation |
| Mojima | ✓ | ✓ | 2–3 | Featured. Live landing is a blank "coming soon": needs real studio/tour shots |
| KOSMO | ✓ | ✓ | 2–3 | Featured |
| KISSA | ✓ | ✓ | 2–3 | Featured |
| Make Life Less Difficult (Lisa) | ✓ | ✓ | 2–3 | Featured. Avoid the placeholder portraits |
| DEPLOY | ✓ | ✓ | 2–4 | Featured |
| AEON | ✓ | ✓ | 2–3 | Featured. Real screens if possible; boards are what we have |
| Neko no Michi | ✓ | ✓ | 2 | Live site is a dark gate screen; a shot past the gate would help |
| TrendinQ × VIX | ✓ | ✓ | 2–3 | |
| Orbit | ✓ | ✓ | 2 | |
| CHIP | ✓ | ✓ | 2–3 | Boards for now |
| Snoei | ✓ | ✓ | 2–3 | Phone shots exist in PROJECTS/snoei/.shots |
| REMIX Pocket | ✓ | ✓ | 2–3 | Phone shots |
| REMIX Scout | ✓ | ✓ | 2 | |

## Pages

| Slot | Format | Note |
|---|---|---|
| Tile: The work | Tile 1600 × 860 | |
| Tile: REMIX | Tile 1600 × 860 | |
| Tile: The studio | Tile 1600 × 860 | |
| The approach page head | Wide 2400 × 1500 | |
| The studio page head | Wide 2400 × 1500 | |
| REMIX page head | Wide 2400 × 1500 | |
| Share image (og:image) | 1200 × 630 | What shows when the link is shared |

## Future builds

The same set per build: 1 wide, 1 card, 2–4 views. Add an entry in `src/builds.ts`.
