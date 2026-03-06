import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { cn } from "@/lib/utils"

interface Props {
  classSlug?: WowClassSlug
  className?: string
  children: React.ReactNode
}

export function TalentCard({ classSlug, className, children }: Props) {
  const gradientColor = classSlug
    ? `var(--color-class-${classSlug})`
    : undefined

  return (
    <section
      className={cn(
        "border-border/40 relative rounded-xl border p-4 backdrop-blur-sm",
        className,
      )}
      style={{
        background: gradientColor
          ? `linear-gradient(135deg, color-mix(in oklch, ${gradientColor} 8%, transparent), transparent 60%)`
          : "hsl(var(--card) / 0.3)",
      }}
    >
      {children}
    </section>
  )
}
