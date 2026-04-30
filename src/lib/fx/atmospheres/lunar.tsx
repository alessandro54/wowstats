export function LunarAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 80% 55% at 50% 0%, rgba(220,230,255,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 25% 40%, rgba(200,215,255,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 50% 35% at 75% 40%, rgba(200,215,255,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 70% 40% at 50% 100%, rgba(160,175,220,0.1) 0%, transparent 65%)
          `,
        }}
      />
    </>
  )
}
