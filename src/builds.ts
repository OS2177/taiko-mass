// THE BUILDS — edit this file to update the site. No component code here.
//
// slug      → /work/<slug>
// kind      → 'app' (Applications) | 'system' (Intelligent systems) | 'exploration' (Explorations)
// status    → short, honest: what the thing is today
// year      → when it was started
// hero      → the wide image used in the home hero and the project page (16:10 works best)
// views     → more images of the same build; all of them appear in the ALL view of the archive
// url       → the real address, or '' when there is nothing public to open yet
// featured  → appears in the home hero rotation (in this order)

export type Kind = 'app' | 'system' | 'exploration'

export type Build = {
  slug: string
  name: string
  line: string
  kind: Kind
  status: string
  year: number
  hero: string
  views: string[]
  url: string
  featured?: boolean
  about: string[]
  facts?: [string, string][]
}

export const KINDS: Record<Kind, string> = {
  app: 'Applications',
  system: 'Intelligent systems',
  exploration: 'Explorations',
}

const img = (f: string) => `/img/builds/${f}`

export const BUILDS: Build[] = [
  {
    slug: 'remix',
    name: 'REMIX',
    line: 'Your own intelligent environment',
    kind: 'system',
    status: 'Live · in daily use',
    year: 2026,
    hero: img('remix-dunes2.webp'),
    views: [img('remix-desk.webp'), img('remix-desk2.webp'), img('remix-phone.webp'), img('remix-dunes.webp')],
    url: 'https://remix.iaos21.com',
    featured: true,
    about: [
      'REMIX is a place for projects and tools that grow with the people using them. You bring something unfinished: an idea, a problem, a piece of research, a business. REMIX keeps it current with what technology can now do and turns it into something you actually build.',
      'Every person gets their own space. Work is built together in the workshop, then handed over: the space is theirs, in their words, and the studio has no way in.',
      'REMIX is where the other builds on this page started, and where the next ones will.',
    ],
    facts: [
      ['Kind', 'Personal intelligent environment'],
      ['Where', 'Web and desktop app'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'mojima',
    name: 'Mojima',
    line: 'A quieter place to write',
    kind: 'app',
    status: 'Live · by request',
    year: 2026,
    hero: img('mojima.webp'),
    views: [img('mojima-v1.webp'), img('mojima-v2.webp')],
    url: 'https://iaos21.com/mojima/',
    featured: true,
    about: [
      'Mojima is a writing space for deeper thinking, clearer expression and a more intentional you. A studio for the writing itself and a tour of what it can hold.',
      'It began as a build for one writer and keeps that scale: one person, their words, nothing in the way.',
    ],
    facts: [
      ['Kind', 'Writing environment'],
      ['Where', 'Web'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'kosmo',
    name: 'KOSMO',
    line: 'A kitchen that knows its menu',
    kind: 'app',
    status: 'Live · one restaurant',
    year: 2026,
    hero: img('kosmo-desk.webp'),
    views: [img('kosmo-desk2.webp'), img('kosmo-phone.webp')],
    url: 'https://iaos21.com/kosmo/',
    featured: true,
    about: [
      'KOSMO is the kitchen app of a restaurant in Belgium: its recipes, its seasons, its proteins and costings, and a chat that only knows the kitchen tables and nothing else.',
      'Built with the cook, at the pass, around the way the kitchen already works.',
    ],
    facts: [
      ['Kind', 'Restaurant operations'],
      ['Where', 'Web'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'kissa',
    name: 'KISSA',
    line: 'Zero-commission point of sale',
    kind: 'app',
    status: 'Live · 2026 pilot',
    year: 2026,
    hero: img('kissa-desk.webp'),
    views: [img('kissa-desk2.webp'), img('kissa-phone.webp')],
    url: 'https://kissa-site.vercel.app/',
    featured: true,
    about: [
      'KISSA is a browser-based, zero-commission point-of-sale system for independent shops. Nothing to install, nothing taken from each sale.',
      'Piloting with independent merchants in 2026, with Europe and Japan in view for 2026/27.',
    ],
    facts: [
      ['Kind', 'Point of sale'],
      ['Where', 'Browser'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'lisa',
    name: 'Make Life Less Difficult',
    line: 'A site for a podcast and its host',
    kind: 'app',
    status: 'Test build · with the client',
    year: 2026,
    hero: img('lisa-desk.webp'),
    views: [img('lisa-desk2.webp'), img('lisa-phone.webp')],
    url: 'https://iaos21.com/lisa/',
    featured: true,
    about: [
      'A new home for the Make Life Less Difficult podcast and the work around it: coaching, training, facilitation, story retreats. Nearly three hundred conversations, a portrait wall, a player that follows you through the site.',
      'The site you are reading now borrows its shape from this one.',
    ],
    facts: [
      ['Kind', 'Editorial site'],
      ['Where', 'Web'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'neko-no-michi',
    name: 'Neko no Michi',
    line: 'A shiatsu practice, by donation',
    kind: 'app',
    status: 'Live',
    year: 2026,
    hero: img('neko-desk.webp'),
    views: [img('neko-phone.webp'), img('neko-v1.webp'), img('neko-v2.webp')],
    url: 'https://nekonomichi.iaos21.com',
    about: [
      'A bilingual site and booking system for a shiatsu practice in Belgium, where sessions are given by donation.',
    ],
    facts: [
      ['Kind', 'Site and bookings'],
      ['Where', 'Web'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'deploy',
    name: 'DEPLOY',
    line: 'A cutting room for films made with models',
    kind: 'system',
    status: 'Online · in development',
    year: 2026,
    hero: img('deploy-desk.webp'),
    views: [img('deploy-desk2.webp'), img('deploy-v1.webp'), img('deploy-v2.webp'), img('deploy-phone.webp')],
    url: 'https://deploy.iaos21.com',
    featured: true,
    about: [
      'DEPLOY is where a film is written, shot with the best video models of the moment and cut: stills, takes, a sampler, an archive room for research.',
      'The first short film came out of it in November 2026. A feature-length documentary is in research.',
    ],
    facts: [
      ['Kind', 'Film tooling'],
      ['Where', 'Web'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'trendinq',
    name: 'TrendinQ × VIX',
    line: 'A front door for paper trading',
    kind: 'app',
    status: 'Live build · with the client',
    year: 2026,
    hero: img('vix-desk.webp'),
    views: [img('vix-desk2.webp'), img('vix-phone.webp')],
    url: 'https://vix-eight.vercel.app',
    about: [
      'A site, login and receivables view for a paper-trading coach and his supplies shop. Built live, with him watching.',
    ],
    facts: [
      ['Kind', 'Site and back office'],
      ['Where', 'Web'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'orbit',
    name: 'Orbit',
    line: 'Discovery platform for makers',
    kind: 'exploration',
    status: 'Live · prototype',
    year: 2026,
    hero: img('orbit-desk.webp'),
    views: [img('orbit-desk2.webp'), img('orbit-phone.webp')],
    url: 'https://orbit-nine-liard.vercel.app/',
    about: ['A gamified discovery platform where makers ship, remix and climb.'],
    facts: [
      ['Kind', 'Platform prototype'],
      ['Where', 'Web'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'aeon',
    name: 'AEON',
    line: 'A sampler and music workstation',
    kind: 'app',
    status: 'In build · native, first version',
    year: 2026,
    hero: img('aeon.webp'),
    views: [img('aeon-v1.webp'), img('aeon-v2.webp')],
    url: '',
    featured: true,
    about: [
      'AEON is a native music workstation: a sampler, an effects rack, a library, an export. Built in C++ with a phone companion for playing it from across the room.',
      'A first version exists and is being tested by hand. The pictures are design boards of what it is becoming.',
    ],
    facts: [
      ['Kind', 'Music software'],
      ['Where', 'Desktop, native'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'chip',
    name: 'CHIP',
    line: 'Agents with a world to work in',
    kind: 'system',
    status: 'Research · first experiments',
    year: 2026,
    hero: img('chip.webp'),
    views: [img('chip-v1.webp'), img('chip-v2.webp')],
    url: '',
    about: [
      'CHIP is our architecture for running agents: a map of who is working on what, a world state they share, and a security layer for the machine they run on.',
      'The first experiments ran in late 2026. The pictures are design boards; nothing here is production autonomy.',
    ],
    facts: [
      ['Kind', 'Agent architecture'],
      ['Where', 'Desktop'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'snoei',
    name: 'Snoei',
    line: 'Know the plant, prune it right',
    kind: 'app',
    status: 'In build · with a gardener',
    year: 2026,
    hero: img('snoei.webp'),
    views: [img('snoei-v1.webp'), img('snoei-v2.webp')],
    url: '',
    about: [
      'Point the phone at a plant, learn what it is, and get pruning advice you can trust, in Dutch. Built with a gardener who checks every word.',
    ],
    facts: [
      ['Kind', 'Phone app'],
      ['Where', 'Phone, web'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'pocket',
    name: 'REMIX Pocket',
    line: 'REMIX in your pocket',
    kind: 'system',
    status: 'Live · by invitation',
    year: 2026,
    hero: img('pocket.webp'),
    views: [img('pocket-v1.webp'), img('pocket-v2.webp')],
    url: '',
    about: [
      'The phone side of REMIX: your space, your day, the things only you can act on, and a talk that builds. By invitation while it grows.',
    ],
    facts: [
      ['Kind', 'Mobile companion'],
      ['Where', 'Phone'],
      ['Since', '2026'],
    ],
  },
  {
    slug: 'scout',
    name: 'REMIX Scout',
    line: 'What is now possible, every week',
    kind: 'system',
    status: 'Running inside REMIX',
    year: 2026,
    hero: img('scout.webp'),
    views: [img('scout-v1.webp'), img('scout-v2.webp')],
    url: '',
    about: [
      'Scout reads the frontier so you do not have to: new models, new tools, new reach, and what each of them means for the thing you are building.',
    ],
    facts: [
      ['Kind', 'Research subsystem'],
      ['Where', 'Inside REMIX'],
      ['Since', '2026'],
    ],
  },
]

export const bySlug = (slug: string) => BUILDS.find((b) => b.slug === slug)
export const featured = BUILDS.filter((b) => b.featured)
