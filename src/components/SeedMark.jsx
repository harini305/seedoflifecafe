/**
 * The Seed of Life — 19 interlocking circles, drawn from the same geometry
 * that drives the WebGL hero.
 */
export default function SeedMark({ className = '', strokeWidth = 0.014 }) {
  const centers = [[0, 0]]
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    centers.push([Math.cos(a), Math.sin(a)])
  }
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3
    centers.push([Math.cos(a) * Math.sqrt(3), Math.sin(a) * Math.sqrt(3)])
  }
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    centers.push([Math.cos(a) * 2, Math.sin(a) * 2])
  }

  return (
    <svg
      className={className}
      viewBox="-3.1 -3.1 6.2 6.2"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="0" r="3" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.45" />
      {centers.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="1"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={i === 0 ? 0.9 : 0.55}
        />
      ))}
    </svg>
  )
}
