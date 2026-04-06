export function ShadowAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 100%, rgba(40,0,60,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 20% 60%, rgba(60,0,90,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 80% 55%, rgba(40,0,70,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(10,0,20,0.6) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[160px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(50,0,80,0.2) 0%, rgba(30,0,50,0.08) 45%, transparent 100%)",
        }}
      />
    </>
  )
}
