export function IronAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(60,50,40,0.3) 0%, transparent 65%),
            radial-gradient(ellipse 55% 35% at 25% 65%, rgba(80,65,45,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 55% 35% at 75% 65%, rgba(80,65,45,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(15,12,10,0.5) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[140px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(80,65,45,0.18) 0%, rgba(50,40,30,0.06) 45%, transparent 100%)",
        }}
      />
    </>
  )
}
