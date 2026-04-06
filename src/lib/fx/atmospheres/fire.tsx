export function FireAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 100%, rgba(75,18,0,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 18% 100%, rgba(190,55,0,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 55% 100%, rgba(130,25,0,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 85% 100%, rgba(190,55,0,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(10,4,6,0.6) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[200px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(190,55,0,0.25) 0%, rgba(130,25,0,0.10) 45%, transparent 100%)",
        }}
      />
    </>
  )
}
