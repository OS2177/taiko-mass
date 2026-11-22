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
