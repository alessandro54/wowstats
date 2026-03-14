import Link from "next/link"
import { BarChart2 } from "lucide-react"
import { ClassHoneycomb } from "@/components/molecules/class-honeycomb"
import { ClassPanels } from "@/components/molecules/class-panels"
import { TIERLIST_LINKS } from "@/config/app-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

export default function Home() {
  return (
    <div className="animate-page-in flex h-full flex-col">
      {/* ── Mobile layout ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col lg:hidden">
        {/* Compact mobile header */}
        <div className="px-4 pt-5 pb-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            PvP Meta
          </p>
          <h1 className="text-base font-bold tracking-tight">Select a class</h1>
        </div>

        {/* Tierlist buttons */}
        <div className="flex gap-2 px-4 pb-3">
          {TIERLIST_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 py-2.5 text-center text-[11px] font-bold text-orange-400 transition-colors active:bg-orange-500/20"
            >
              <BarChart2 className="size-3 shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        {/* Class list */}
        <div className="flex-1 overflow-y-auto">
          <ClassHoneycomb classes={WOW_CLASSES} />
        </div>
      </div>

      {/* ── Desktop layout ─────────────────────────────────── */}
      <div className="hidden flex-1 flex-col gap-4 px-6 py-8 lg:flex">
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
        <div className="flex items-center gap-3">
          {TIERLIST_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 transition-colors hover:bg-orange-500/20"
            >
              <BarChart2 className="size-3.5 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
        <div className="min-h-0 flex-1">
          <ClassPanels classes={WOW_CLASSES} />
        </div>
      </div>
    </div>
  )
}
