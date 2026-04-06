export function BloodAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 100%, rgba(120,0,20,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 20% 70%, rgba(80,0,15,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 70%, rgba(80,0,15,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(30,0,8,0.6) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[140px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(150,0,20,0.3) 0%, rgba(100,0,15,0.12) 45%, transparent 100%)",
        }}
      />
    </>
  )
}
