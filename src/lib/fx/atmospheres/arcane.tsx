export function ArcaneAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 75% 50% at 50% 0%, rgba(60,30,120,0.3) 0%, transparent 65%),
            radial-gradient(ellipse 55% 35% at 20% 50%, rgba(100,50,180,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 55% 35% at 80% 50%, rgba(80,40,160,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 70% 40% at 50% 100%, rgba(40,15,80,0.2) 0%, transparent 65%)
          `,
        }}
      />
    </>
  )
}
