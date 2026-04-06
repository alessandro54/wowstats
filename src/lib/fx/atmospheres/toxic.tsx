export function ToxicAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,80,20,0.35) 0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 20% 60%, rgba(80,0,120,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 80% 55%, rgba(0,100,30,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(20,0,40,0.4) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[200px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(0,80,20,0.25) 0%, rgba(0,60,15,0.10) 50%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />
    </>
  )
}
