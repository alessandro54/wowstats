export function HolyAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(220,180,40,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 30% 30%, rgba(255,220,80,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 70% 30%, rgba(255,220,80,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 70% 35% at 50% 100%, rgba(180,140,20,0.12) 0%, transparent 60%)
          `,
        }}
      />
    </>
  )
}
