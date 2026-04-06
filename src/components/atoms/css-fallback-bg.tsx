export function CssFallbackBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        zIndex: -1,
      }}
    >
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,12,0,0.7) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 20% 60%, rgba(80,20,0,0.15) 0%, transparent 60%),
            linear-gradient(180deg, #050403 0%, #0a0604 50%, #050403 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 block dark:hidden"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,140,60,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 20% 60%, rgba(180,100,30,0.03) 0%, transparent 60%),
            linear-gradient(180deg, #fafaf9 0%, #f7f6f4 50%, #fafaf9 100%)
          `,
        }}
      />
    </div>
  )
}
