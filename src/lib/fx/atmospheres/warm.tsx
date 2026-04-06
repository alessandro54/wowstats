export function WarmAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120,70,10,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(160,110,0,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 10% 100%, rgba(140,90,0,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 90% 100%, rgba(140,90,0,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(4,3,2,0.8) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[180px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(160,110,0,0.2) 0%, rgba(100,65,0,0.08) 45%, transparent 100%)",
        }}
      />
    </>
  )
}
