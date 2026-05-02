import { cn } from "@/lib/utils"

interface Props {
  /** Title text — rendered uppercase + tracked-out, matching the Equipment header. */
  children: React.ReactNode
  /** Width of the trailing gradient line (Tailwind class, e.g. "w-16"). */
  lineClassName?: string
  className?: string
}

/**
 * Section header used across every primary content block (Equipment, Class
 * Talents, Spec Talents, Hero Talents, PvP Talents). Tiny uppercase label
 * paired with a gradient hairline so adjacent sections feel structurally
 * tied together without competing for attention.
 */
export function SectionTitle({ children, lineClassName, className }: Props) {
  return (
    <div className={cn("mb-4 flex items-center gap-2", className)}>
      <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </h2>
      <div
        className={cn(
          "ml-2 h-px bg-gradient-to-r from-border to-transparent",
          lineClassName ?? "w-16",
        )}
      />
    </div>
  )
}
