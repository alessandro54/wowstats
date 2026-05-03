import { cn } from "@/lib/utils"

interface Props {
  children: React.ReactNode
  lineClassName?: string
  className?: string
}

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
