import Link from "next/link"
import { ClassAccordion } from "@/components/molecules/class-accordion"
import { ClassPanels } from "@/components/molecules/class-panels"
import { TIERLIST_LINKS } from "@/config/app-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

export default function Home() {
  return (
    <div className="animate-page-in flex h-full flex-col gap-4 px-6 py-8">
      {/* Header row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
            PvP Meta
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Select a guide</h1>
        </div>
        <p className="text-muted-foreground text-xs max-w-xs self-end text-right leading-relaxed">
          Gear, stats and rankings built from real ladder data — updated every season across 2v2,
          3v3 and Solo Shuffle.
        </p>
      </div>
      {/* Tierlist section */}
      <div className="flex items-center gap-4">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest shrink-0">
          Tierlist
        </p>
        <div className="flex gap-2">
          {TIERLIST_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-black/15 dark:border-white/15 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      {/* Desktop: expanding horizontal panels */}
      <div className="hidden min-h-0 flex-1 lg:flex lg:flex-col">
        <ClassPanels classes={WOW_CLASSES} />
      </div>

      {/* Mobile: vertical accordion */}
      <div className="lg:hidden -mx-6 overflow-y-auto rounded-xl border border-black/15 dark:border-white/15">
        <ClassAccordion classes={WOW_CLASSES} />
      </div>
    </div>
  )
}
