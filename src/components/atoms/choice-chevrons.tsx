export function ChoiceChevrons({ activeColor }: { activeColor: string }) {
  return (
    <>
      <svg
        className="pointer-events-none absolute"
        style={{
          left: -8,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        width="6"
        height="10"
        viewBox="0 0 6 10"
      >
        <path
          d="M5 1 L1 5 L5 9"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <svg
        className="pointer-events-none absolute"
        style={{
          right: -8,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        width="6"
        height="10"
        viewBox="0 0 6 10"
      >
        <path
          d="M1 1 L5 5 L1 9"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </>
  )
}
