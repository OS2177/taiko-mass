// Everything about the site that isn't a build: names, links, the two films, the words about Jack.

export const site = {
  name: 'iAOS21',
  descriptor: 'an independent build studio',
  title: 'iaos21 — an independent build studio',
  description:
    'iAOS21 is an independent building studio. Intelligent tools, environments and experiences, shaped around the people who will use them.',
  // "Start a conversation" goes here. Change in one place.
  email: 'jack@iaos21.com',
  remix: 'https://remix.iaos21.com',
  taikoMass: '/taiko-mass/',
  linkedin: 'https://www.linkedin.com/in/iaos21/',
  // The contact window talks to this one route in REMIX (api/studio.ts there): the greeter and the form.
  studioApi: 'https://remix.iaos21.com/api/studio',
}

// Jack's business card, shown in the contact window and behind the QR he scans from his phone.
export const card = {
  name: 'Jack Vintage',
  role: 'AI technologist',
  studio: 'iaos21 · an independent build studio',
  where: 'West Flanders, Belgium',
  email: 'jack@iaos21.com',
  web: 'iaos21.com',
  linkedin: 'https://www.linkedin.com/in/iaos21/',
}

// Jack's agent's scripted lines: the welcome and the thank-you cost nothing; only questions go to the runner.
export const greeter = {
  hello: [
    'Hi, welcome to iaos21.',
    'I am Jack\'s agent. I can answer questions about what we build, and I pass your details on to Jack. Leave your name and email below and he will be in touch himself.',
  ],
  access: (build: string) => [
    `Hi, welcome to iaos21. You are asking for access to ${build}.`,
    'I am Jack\'s agent. Leave your name and email below, and tell us what you would like to use it for; Jack opens the door himself and will be in touch.',
  ],
  thanks: (name: string) => `Thank you, ${name}. Your details are with Jack now. He will be in touch.`,
  thanksAccess: (name: string, build: string) => `Thank you, ${name}. Your request for ${build} is with Jack now. He will be in touch.`,
  offline: 'I cannot answer that right now. Leave your details in the form and Jack will reply himself.',
}

// The opening film, made in DEPLOY. Live in the cockpit publishes it to iaos21.com and the page reads it
// from `heroFrom` at load; until then (or if DEPLOY can't be reached) it plays the file named here,
// or the poster, or a dark surface when both are empty.
export const heroFrom = 'https://deploy.iaos21.com/api/hero?site=iaos21'
export const hero = {
  // JAKKU, published from DEPLOY on 2026-11-25; the same files, kept here as the fallback
  video: '/film/hero.mp4',
  poster: '/film/hero-poster.jpg',
  line: 'A beautiful future imagined.',
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
  title: 'Every build is an opportunity to imagine of a more beautiful human experience.',
  paragraphs: [
    'Hi, welcome to iaos21.',
    'A small, independent build studio based in West Flanders, working with AI and guided by a simple intention: to create digital spaces, tools and experiences built around the people who will use them.',
    'The studio is imagined by me, Jack, an AI technologist exploring and enjoying the creative possibilities that emerge when human imagination meets the capabilities of artificial intelligence.',
  ],
  writingLabel: 'short essays',
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
