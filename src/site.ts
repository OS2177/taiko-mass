// Everything about the site that isn't a build: names, links, the two films, the words about Jack.

export const site = {
  name: 'iAOS21',
  descriptor: 'Independent building studio',
  title: 'iAOS21 — an independent building studio',
  description:
    'iAOS21 is an independent building studio. Intelligent tools, environments and experiences, shaped around the people who will use them.',
  // "Start a conversation" goes here. Change in one place.
  email: 'jack@iaos21.com',
  remix: 'https://remix.iaos21.com',
  taikoMass: '/taiko-mass/',
  linkedin: 'https://www.linkedin.com/in/iaos21/',
}

// The opening film, made in DEPLOY. Live in the cockpit publishes it to iaos21.com and the page reads it
// from `heroFrom` at load; until then (or if DEPLOY can't be reached) it plays the file named here,
// or the poster, or a dark surface when both are empty.
export const heroFrom = 'https://deploy.iaos21.com/api/hero?site=iaos21'
export const hero = {
  video: '',
  poster: '',
  line: 'A more beautiful future. Made real.',
}

// The closing film, under the builds.
export const closing = {
  video: '',
  poster: '',
  caption: '',
}

// About Jack, in his words. Change the lines here; nothing else writes about him.
export const about = {
  eyebrow: 'About',
  title: 'Every build here started with one person and one unfinished thing.',
  paragraphs: [
    'I am Jack. iAOS21 is my studio: a small, independent place where intelligent tools, environments and experiences are built around the people who will use them.',
    'Before the studio I cooked, and ran a coffee bar. That is where the way of working comes from: build with the cook at the pass, the writer at the desk, the shop at the counter, and hand it over whole.',
    'Everything on this page was made from REMIX, the environment I built for it, and most of it is open by request.',
  ],
  writing: [
    ['Humanetics', 'Designing intelligent systems to expand human potential', '/humanetics.html'],
    ['The Ecology of Awareness', 'Consciousness in information fields', '/the-ecology-of-awareness.html'],
    ['On the Edge', 'Marginality as a driver of change', '/on-the-edge.html'],
    ['The Open Loop', 'The body as process', '/the-open-loop.html'],
  ] as [string, string, string][],
}

// The bar at the bottom of the screen: these are places on the one page.
export const nav = [
  { href: '/#builds', label: 'Builds' },
  { href: '/#about', label: 'About' },
]

// Paths that moved (the old site had pages; this one has one page with places on it)
export const redirects: Record<string, string> = {
  '/approach': '/#about',
  '/studio': '/#about',
  '/work': '/#builds',
  '/remix': '/#remix',
}
