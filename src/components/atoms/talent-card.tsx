import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { cn } from "@/lib/utils"

interface Props {
  classSlug?: WowClassSlug
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function TalentCard({ classSlug, className, style, children }: Props) {
  const gradientColor = classSlug ? `var(--color-class-${classSlug})` : undefined

  return (
    <section
      className={cn(
        "border-border/40 relative rounded-xl border px-4 py-6.5 backdrop-blur-sm",
        className,
      )}
      style={{
        background: gradientColor
          ? `linear-gradient(-45deg, color-mix(in oklch, ${gradientColor} 8%, transparent), transparent 60%)`
          : "hsl(var(--card) / 0.3)",
        ...style,
      }}
    >
      {children}
    </section>
  )
}
