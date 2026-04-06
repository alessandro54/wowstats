export function MistAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 75% 50% at 50% 100%, rgba(0,80,60,0.25) 0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 30% 50%, rgba(0,100,70,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 55% 40% at 70% 50%, rgba(0,90,60,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(5,15,10,0.4) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[180px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(0,90,60,0.15) 0%, rgba(0,60,40,0.05) 45%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />
    </>
  )
}
