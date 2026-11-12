// Everything about the site that isn't a build: names, links, navigation.

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

export const nav = [
  { href: '/work', label: 'The work' },
  { href: '/approach', label: 'The approach' },
  { href: '/studio', label: 'The studio' },
  { href: '/remix', label: 'REMIX' },
]

// Old Taiko Mass paths that moved
export const redirects: Record<string, string> = {}
