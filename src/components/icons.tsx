type P = { size?: number }
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const ArrowRight = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M4 12h16M13 5l7 7-7 7" />
  </svg>
)
export const ArrowUpRight = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)
export const Menu = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M3 7h18M3 17h18" />
  </svg>
)
export const Close = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
)
export const Play = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M7 5v14l11-7z" />
  </svg>
)
export const Pause = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M8 5v14M16 5v14" />
  </svg>
)
export const SkipBack = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M18 5 8 12l10 7zM6 5v14" />
  </svg>
)
export const SkipForward = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M6 5l10 7-10 7zM18 5v14" />
  </svg>
)
export const Expand = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
)
export const Shrink = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>
)
