export function StormAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20,40,80,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 55% 35% at 25% 40%, rgba(60,100,180,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 55% 35% at 75% 40%, rgba(60,100,180,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 70% 40% at 50% 100%, rgba(10,20,50,0.3) 0%, transparent 65%)
          `,
        }}
      />
    </>
  )
}
