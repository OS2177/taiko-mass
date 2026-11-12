// Line icons drawn to match the thin arrows in the designs.
type P = { size?: number }

const base = (size = 22) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const ArrowRight = ({ size = 30 }: P) => (
  <svg {...base(size)} viewBox="0 0 32 16">
    <path d="M1 8h29M23 1.5 30 8l-7 6.5" />
  </svg>
)

export const ArrowLeft = ({ size = 30 }: P) => (
  <svg {...base(size)} viewBox="0 0 32 16">
    <path d="M31 8H2M9 1.5 2 8l7 6.5" />
  </svg>
)

export const Play = ({ size }: P) => (
  <svg {...base(size)} stroke="none" fill="currentColor">
    <path d="M8 5.5v13l10.5-6.5z" />
  </svg>
)

export const Pause = ({ size }: P) => (
  <svg {...base(size)} stroke="none" fill="currentColor">
    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
  </svg>
)

export const Search = ({ size }: P) => (
  <svg {...base(size)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
)

export const Close = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
)

export const Menu = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M3 8h18M3 16h18" />
  </svg>
)

export const Instagram = ({ size }: P) => (
  <svg {...base(size)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
)

export const Spotify = ({ size }: P) => (
  <svg {...base(size)} stroke="none" fill="currentColor">
    <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm4.3 13.7a.6.6 0 0 1-.8.2c-2.3-1.4-5.1-1.7-8.5-.9a.6.6 0 1 1-.3-1.2c3.7-.8 6.8-.5 9.4 1.1.3.2.4.5.2.8Zm1.2-2.7a.7.7 0 0 1-1 .3c-2.6-1.6-6.6-2.1-9.7-1.1a.7.7 0 1 1-.4-1.4c3.5-1.1 7.9-.6 10.8 1.2.4.2.5.6.3 1Zm.1-2.8C14.5 8.9 9.4 8.7 6.5 9.6a.9.9 0 1 1-.5-1.7c3.4-1 9-.8 12.5 1.3a.9.9 0 0 1-.9 1.5Z" />
  </svg>
)

export const Youtube = ({ size }: P) => (
  <svg {...base(size)} stroke="none" fill="currentColor">
    <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
)

export const Apple = ({ size }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="10" r="2.6" />
    <path d="M10.6 14.5h2.8l-.6 6.5h-1.6zM7.2 15.6a6.8 6.8 0 1 1 9.6 0" />
  </svg>
)

export const Back15 = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
    <text x="12" y="15.2" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Montserrat, sans-serif">15</text>
  </svg>
)

export const Forward15 = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4h-4" />
    <text x="12" y="15.2" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Montserrat, sans-serif">15</text>
  </svg>
)

export const Share = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 13v6h14v-6" />
  </svg>
)

export const Download = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M5 19h14" />
  </svg>
)
