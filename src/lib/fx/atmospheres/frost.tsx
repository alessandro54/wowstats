export function FrostAtmosphere() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: -1,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,55,90,0.45) 0%, transparent 65%),
          radial-gradient(ellipse 60% 40% at 15% 60%, rgba(196,30,58,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 85% 60%, rgba(74,140,210,0.06) 0%, transparent 60%)
        `,
      }}
    />
  )
}
