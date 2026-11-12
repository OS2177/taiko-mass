import type { Design } from '../lib/design'

// Flips the whole site between the two directions, as on Lisa's site.
export function DesignSwitch({ design, onChange }: { design: Design; onChange: (d: Design) => void }) {
  const other = design === 'cinematic' ? 'editorial' : 'cinematic'
  return (
    <>
      <div className="switch" role="group" aria-label="Design direction">
        {(['cinematic', 'editorial'] as const).map((d) => (
          <button key={d} aria-pressed={design === d} onClick={() => onChange(d)}>
            {d}
          </button>
        ))}
      </div>
      <button className="switch-mini" onClick={() => onChange(other)} aria-label={`Switch to ${other} design`}>
        {design}
      </button>
    </>
  )
}
