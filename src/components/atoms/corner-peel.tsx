interface Props {
  activeColor: string
  onClick: () => void
  label: string
}

export function CornerPeel({ activeColor, onClick, label }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group absolute bottom-0 right-0 z-10 cursor-pointer"
    >
      <div
        className="absolute bottom-0 right-0 size-12 transition-all duration-300 group-hover:size-16"
        style={{
          background: `linear-gradient(315deg, ${activeColor} 50%, transparent 50%)`,
          borderRadius: "0 0 0.75rem 0",
          filter: "drop-shadow(-1px -1px 2px rgba(0,0,0,0.3))",
        }}
      />
      <div
        className="absolute bottom-0 right-0 size-12 transition-all duration-300 group-hover:size-16"
        style={{
          background: "linear-gradient(315deg, transparent 50%, rgba(0,0,0,0.15) 50%, transparent 60%)",
        }}
      />
      <span className="absolute bottom-1 right-1 text-right font-mono text-[9px] font-bold text-white transition-all duration-300 group-hover:bottom-2 group-hover:right-2 group-hover:text-[11px]">
        {label}
      </span>
    </button>
  )
}
