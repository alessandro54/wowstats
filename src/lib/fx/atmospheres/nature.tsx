export function NatureAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(20,80,10,0.28) 0%, transparent 65%),
            radial-gradient(ellipse 60% 40% at 25% 55%, rgba(60,100,0,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 75% 55%, rgba(40,90,10,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(10,25,5,0.4) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[180px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(30,90,10,0.15) 0%, rgba(20,60,5,0.06) 45%, transparent 100%)",
        }}
      />
    </>
  )
}
