export function FelAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 100%, rgba(0,60,10,0.35) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 20% 70%, rgba(40,80,0,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 70%, rgba(40,80,0,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(10,20,0,0.55) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[160px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(40,120,0,0.2) 0%, rgba(20,80,0,0.08) 45%, transparent 100%)",
        }}
      />
    </>
  )
}
