"use client"

import { useEffect, useState } from "react"
import { TalentCard } from "@/components/atoms/talent-card"
import { HeroTree } from "@/components/molecules/hero-tree"
import { iconUrl as buildIconUrl } from "@/config/cdn-config"
import type { MetaTalent } from "@/lib/api"
import { computeTreeLayout } from "@/lib/utils/talent-tree-layout"
import { buildNodeMap, splitHeroTrees } from "@/lib/utils/talent-tree"
import { getSpecById, heroTreeIconUrl, identifyHeroTree, type WowClassSlug } from "@/lib/wow"

interface Props {
  heroEntries: MetaTalent[]
  activeColor: string
  classSlug: WowClassSlug
  /** When provided, restricts the cycle to the spec's two allowed hero trees. */
  specId?: number
  hideStats?: boolean
}

const HERO_ICON_PX = 96

export function HeroSection({ heroEntries, activeColor, classSlug, specId, hideStats }: Props) {
  // Limit the cycle to the spec's two allowed hero trees. Without this,
  // stale or cross-spec data could surface a third tree for the wrong spec
  // (each spec has 2 hero trees out of the class's 3 — DH is the exception
  // with 2 total). When specId is missing or the lookup fails, fall back
  // to all detected trees so the component still renders something.
  const allowedSlugs = specId ? getSpecById(specId)?.spec.heroTreeSlugs : undefined

  const allTrees = splitHeroTrees(heroEntries)
  const trees = allowedSlugs
    ? allTrees.filter((tree) => {
        const meta = identifyHeroTree(tree, classSlug)
        return meta ? allowedSlugs.includes(meta.slug) : false
      })
    : allTrees

  const [index, setIndex] = useState(0)
  // Keyed by slug so a wrong/temporary 404 doesn't permanently hide the
  // icon at a given index after a config fix or refetch.
  const [iconFailed, setIconFailed] = useState<Record<string, boolean>>({})

  // Preload icons from every tree as soon as the component mounts. The
  // talent <Image> remounts on src change to drive the per-icon fade-in,
  // and a remount with an uncached src paints empty for one frame — the
  // visible "blink". Pre-warming the cache means subsequent swaps decode
  // the new bytes synchronously and the only visible change is the fade.
  useEffect(() => {
    if (typeof window === "undefined") return
    for (const tree of trees) {
      for (const t of tree) {
        const url = t.talent.icon_url
        if (!url) continue
        const img = new window.Image()
        img.src = buildIconUrl(url, 56) ?? url
      }
    }
    // Hero tree icons are stable per class; preloading once is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    classSlug,
  ])

  if (trees.length === 0) return null

  const current = trees[index] ?? trees[0]
  const currentMeta = identifyHeroTree(current, classSlug)
  const currentPctNum = Math.max(...current.map((t) => t.usage_pct))
  const currentPct = currentPctNum.toFixed(0)
  // Sub-1% means literally nobody runs this tree. Fade the icon + tree to
  // make that obvious; the switch button stays full opacity so the user
  // can still flip back to the meta pick.
  const isUnused = currentPctNum < 1

  // Compute the widest actual layout across all hero trees in scope by
  // running the same layout helper TalentTree uses internally. Pin the
  // wrapper to that exact width so the card doesn't reflow on every cycle.
  const treeMinWidth = Math.max(
    ...trees.map((tree) => {
      const nodes = Array.from(buildNodeMap(tree).values())
      return computeTreeLayout(nodes, {
        apexExtra: false,
        apexCircle: false,
      }).svgW
    }),
    0,
  )

  const next = trees.length > 1 ? trees[(index + 1) % trees.length] : null
  const nextMeta = next ? identifyHeroTree(next, classSlug) : null

  const cycle = () => setIndex((i) => (i + 1) % trees.length)

  return (
    <section className="w-fit max-w-full">
      <TalentCard classSlug={classSlug} className="w-fit p-6">
        {/* w-fit so the column hugs the icon|tree row and the switch button
            stays centered. The card itself sizes to this column instead of
            being stretched by the parent flex/grid.                         */}
        <div className="mx-auto flex w-fit flex-col items-center gap-5">
          {/* lg+: explicit grid — icon column auto-sized, tree column takes
              its own width. Stacks vertically below lg because the icon +
              tree + sibling PvP card together overflow narrower viewports.  */}
          <div
            className={`grid items-center gap-5 transition-opacity duration-300 lg:grid-cols-[auto_auto] lg:gap-8 ${
              isUnused ? "opacity-40" : "opacity-100"
            }`}
          >
            {/* Fixed-width icon column so a long tree name like
                "Rider of the Apocalypse" can't widen the column when active
                while a short one like "Deathbringer" leaves it narrower.
                Names wrap inside this footprint instead.                    */}
            <div className="flex w-[140px] flex-col items-center gap-2 text-center">
              {currentMeta && !iconFailed[currentMeta?.slug ?? ""] && (
                // No `key` here on purpose: keying by slug forced React to
                // unmount/remount the <img>, which made the browser repaint
                // empty before the cached src loaded — a visible flicker.
                // Letting React reuse the same <img> element and only swap
                // the `src` attribute keeps the previous frame painted until
                // the new bytes are ready.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroTreeIconUrl(classSlug, currentMeta.slug)}
                  alt={currentMeta.name}
                  width={HERO_ICON_PX}
                  height={HERO_ICON_PX}
                  className="rounded-full ring-2 ring-[var(--color-quality-legendary)]/70 transition-opacity duration-500"
                  style={{
                    boxShadow: `0 0 28px -6px ${activeColor}55`,
                  }}
                  loading="eager"
                  onError={() =>
                    setIconFailed((m) => ({
                      ...m,
                      [currentMeta.slug]: true,
                    }))
                  }
                />
              )}
              {currentMeta && (
                <h3
                  key={`name-${currentMeta.slug}`}
                  className="text-base font-bold tracking-wide text-[var(--color-quality-legendary)] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
                >
                  {currentMeta.name}
                </h3>
              )}
              {!hideStats && (
                <p
                  key={`pct-${index}`}
                  className="text-muted-foreground -mt-1 font-mono text-xs motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
                >
                  {currentPct}% usage
                </p>
              )}
            </div>

            {/* Tree topology is identical across this class's hero trees.
                Position-based keying inside TalentTree (nodeKeyMode="position")
                means each node DOM element is reused across swaps — only the
                <Image> inside each node remounts (keyed by icon_url) and fades
                in. Borders/edges stay rock-steady; only the icons morph.   */}
            <div
              className="flex justify-center"
              style={{
                minWidth: treeMinWidth,
              }}
            >
              <HeroTree talents={current} activeColor={activeColor} hideStats={hideStats} />
            </div>
          </div>

          {/* Switch button always sits below, on every breakpoint. */}
          {next && nextMeta && (
            <button
              type="button"
              onClick={cycle}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-quality-epic)]/50 bg-[var(--color-quality-epic)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-quality-epic)] shadow-sm transition-colors hover:bg-[var(--color-quality-epic)]/20"
              aria-label={`Switch to ${nextMeta.name}`}
            >
              <span>Switch to</span>
              <span className="font-bold">{nextMeta.name}</span>
              <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </TalentCard>
    </section>
  )
}
