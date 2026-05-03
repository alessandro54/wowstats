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
  specId?: number
  hideStats?: boolean
}

const HERO_ICON_PX = 96

export function HeroSection({ heroEntries, activeColor, classSlug, specId, hideStats }: Props) {
  // Each spec has 2 of its class's 3 hero trees (DH has 2 total). Filter
  // out cross-spec leakage when specId is known.
  const allowedSlugs = specId ? getSpecById(specId)?.spec.heroTreeSlugs : undefined

  const allTrees = splitHeroTrees(heroEntries)
  const trees = allowedSlugs
    ? allTrees.filter((tree) => {
        const meta = identifyHeroTree(tree, classSlug)
        return meta ? allowedSlugs.includes(meta.slug) : false
      })
    : allTrees

  const [index, setIndex] = useState(0)
  // Keyed by slug so a transient 404 doesn't permanently hide a fixed icon.
  const [iconFailed, setIconFailed] = useState<Record<string, boolean>>({})

  // Preload sibling-tree icons so the keyed <Image> remount on switch has
  // bytes ready in cache — otherwise the new node paints empty for a frame.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    classSlug,
  ])

  if (trees.length === 0) return null

  const current = trees[index] ?? trees[0]
  const currentMeta = identifyHeroTree(current, classSlug)
  const currentPctNum = Math.max(...current.map((t) => t.usage_pct))
  const currentPct = currentPctNum.toFixed(0)
  // <1% = dead tree. Fade so it reads as "nobody runs this".
  const isUnused = currentPctNum < 1

  // Pin the wrapper to the widest tree's svgW so cycling doesn't reflow.
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
        <div className="mx-auto flex w-fit flex-col items-center gap-5">
          <div
            className={`grid items-center gap-5 transition-opacity duration-300 lg:grid-cols-[auto_auto] lg:gap-8 ${
              isUnused ? "opacity-40" : "opacity-100"
            }`}
          >
            <div className="flex w-[140px] flex-col items-center gap-2 text-center">
              {currentMeta && !iconFailed[currentMeta?.slug ?? ""] && (
                // Preloaded by the useEffect above — remount paints from
                // cache, so the keyed fade-in reads as a clean transition.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={currentMeta.slug}
                  src={heroTreeIconUrl(classSlug, currentMeta.slug)}
                  alt={currentMeta.name}
                  width={HERO_ICON_PX}
                  height={HERO_ICON_PX}
                  className="rounded-full ring-2 ring-[var(--color-quality-legendary)]/70 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500"
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
                  className="text-base font-bold tracking-wide text-[var(--color-quality-legendary)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
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

            <div
              className="flex justify-center"
              style={{
                minWidth: treeMinWidth,
              }}
            >
              <HeroTree talents={current} activeColor={activeColor} hideStats={hideStats} />
            </div>
          </div>

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
