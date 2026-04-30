import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

import { CharacterEquipment } from "@/components/organisms/character-equipment"
import { Talents } from "@/components/organisms/talents"
import { CharacterHero } from "@/components/molecules/character-hero"
import { SpecParticleFx } from "@/components/molecules/spec-particle-fx"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import type { CharacterPvpEntry } from "@/lib/api"
import { fetchCharacter } from "@/lib/api"
import { bracketColor } from "@/config/wow/brackets-config"
import { formatBracket, formatRealm, titleizeSlug, winRate } from "@/lib/utils"

interface PageProps {
  params: Promise<{
    region: string
    realm: string
    name: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, realm, name } = await params
  const character = await fetchCharacter(region, realm, name)
  if (!character) return {}

  const displayRealm = formatRealm(character.realm)
  const title = `${character.name} — ${displayRealm} (${character.region.toUpperCase()})`
  const specSlug = character.class_slug?.replace(/_/g, "-")
  const classConfig = WOW_CLASSES.find((c) => c.slug === specSlug)
  const specIcon = classConfig?.specs.find((s) => s.id === character.primary_spec_id)?.iconUrl
  const topRating = character.pvp_entries.reduce((max, e) => Math.max(max, e.rating), 0)
  const description =
    topRating > 0
      ? `${character.name}-${displayRealm} · ${topRating} rating · WoW PvP profile with gear, talents, and stats.`
      : `WoW character profile for ${character.name}-${displayRealm}. Gear, talents, and PvP stats.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(specIcon
        ? {
            images: [
              {
                url: specIcon,
                width: 64,
                height: 64,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
      ...(specIcon
        ? {
            images: [
              specIcon,
            ],
          }
        : {}),
    },
    alternates: {
      canonical: `/character/${region}/${realm}/${name}`,
    },
  }
}

interface SpecInfo {
  name: string
  iconUrl?: string
}

function PvpBracketCard({
  bracket,
  region,
  entries,
  specById,
}: {
  bracket: string
  region: string
  entries: CharacterPvpEntry[]
  specById: Map<number, SpecInfo>
}) {
  const color = bracketColor(bracket)
  const multi = entries.length > 1

  return (
    <div
      className="rounded-lg border bg-card/80 px-4 py-3"
      style={{
        borderColor: `color-mix(in oklch, ${color} 30%, var(--color-border))`,
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="text-xs font-bold uppercase tracking-wide"
          style={{
            color,
          }}
        >
          {formatBracket(bracket)}
        </span>
        <span className="text-xs font-normal text-muted-foreground/60">· {region}</span>
      </div>

      {/* Column headers */}
      <div
        className={`grid gap-3 text-center text-[10px] uppercase tracking-wide text-muted-foreground/70 ${multi ? "grid-cols-[1fr_repeat(4,minmax(0,1fr))]" : "grid-cols-4"}`}
      >
        {multi && <div />}
        <div>Rating</div>
        <div>W / L</div>
        <div>Win%</div>
        <div>Rank</div>
      </div>

      <div className="mt-1.5 space-y-2">
        {entries.map((entry, i) => {
          const specInfo = entry.spec_id ? specById.get(entry.spec_id) : undefined
          return (
            <div
              key={i}
              className={`grid gap-3 text-center ${multi ? "grid-cols-[1fr_repeat(4,minmax(0,1fr))] items-center" : "grid-cols-4"} ${multi && i > 0 ? "border-t border-border/30 pt-2" : ""}`}
            >
              {multi && (
                <div className="flex items-center gap-1.5">
                  {specInfo?.iconUrl && (
                    <Image
                      src={specInfo.iconUrl}
                      alt={specInfo.name}
                      width={18}
                      height={18}
                      className="shrink-0 rounded-sm"
                    />
                  )}
                  {specInfo?.name && (
                    <span className="truncate text-[10px] font-semibold capitalize text-foreground/80">
                      {specInfo.name}
                    </span>
                  )}
                </div>
              )}
              <div
                className="text-lg font-bold tabular-nums"
                style={{
                  color,
                }}
              >
                {entry.rating}
              </div>
              <div className="text-sm font-medium tabular-nums text-foreground">
                {entry.wins}
                <span className="text-muted-foreground/60">/</span>
                {entry.losses}
              </div>
              <div className="text-sm font-medium tabular-nums text-foreground">
                {winRate(entry.wins, entry.losses)}
              </div>
              <div className="text-sm font-medium tabular-nums text-foreground">
                {entry.rank ?? "—"}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default async function CharacterPage({ params }: PageProps) {
  const { region, realm, name } = await params
  const character = await fetchCharacter(region, realm, name)

  if (!character) notFound()

  const normalizedSlug = character.class_slug?.replace(/_/g, "-")
  const displayRealm = formatRealm(character.realm)

  const classConfig = WOW_CLASSES.find((c) => c.slug === normalizedSlug)
  const classSlug = (classConfig?.slug ?? normalizedSlug) as WowClassSlug

  const spec = classConfig?.specs.find((s) => s.id === character.primary_spec_id)
  const armoryUrl = `https://worldofwarcraft.blizzard.com/en-${region === "us" ? "us" : "gb"}/character/${region}/${character.realm}/${character.name}`

  // Build spec lookup for PvP entry spec labels
  const specById = new Map<number, SpecInfo>()
  for (const cls of WOW_CLASSES) {
    for (const s of cls.specs) {
      if (s.id != null)
        specById.set(s.id, {
          name: s.name,
          iconUrl: s.iconUrl,
        })
    }
  }

  // Normalize bracket to base type (shuffle-warrior-arms → shuffle)
  const baseBracketKey = (b: string) => {
    if (b.startsWith("shuffle")) return "shuffle"
    if (b.startsWith("blitz")) return "blitz"
    return b
  }

  // Group PvP entries by base bracket + region
  const bracketGroups = new Map<string, CharacterPvpEntry[]>()
  for (const entry of character.pvp_entries) {
    const key = `${baseBracketKey(entry.bracket)}|${entry.region}`
    const arr = bracketGroups.get(key) ?? []
    arr.push(entry)
    bracketGroups.set(key, arr)
  }

  return (
    <div className="relative">
      <SpecParticleFx effect={spec?.effect} atmosphere={spec?.atmosphere} />

      <CharacterHero
        name={character.name}
        realm={displayRealm}
        region={character.region.toUpperCase()}
        race={character.race}
        classSlug={classSlug}
        className={classConfig?.name ?? titleizeSlug(character.class_slug)}
        specName={spec?.name}
        specIconUrl={spec?.iconUrl}
        animationUrl={spec?.animationUrl}
        iconRemasteredUrl={spec?.iconRemasteredUrl}
        avatarUrl={character.avatar_url}
        armoryUrl={armoryUrl}
      />

      <div className="mx-auto max-w-5xl space-y-8 px-4 pb-12 lg:px-6">
        {/* PvP Performance */}
        {bracketGroups.size > 0 ? (
          <section className="space-y-3">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              PvP Performance
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:items-start">
              {Array.from(bracketGroups.entries())
                .sort(([a], [b]) => {
                  const aShuf = a.startsWith("shuffle") ? 1 : 0
                  const bShuf = b.startsWith("shuffle") ? 1 : 0
                  return aShuf - bShuf
                })
                .map(([key, entries]) => {
                  const [bracket, region] = key.split("|")
                  return (
                    <PvpBracketCard
                      key={key}
                      bracket={bracket}
                      region={region}
                      entries={entries}
                      specById={specById}
                    />
                  )
                })}
            </div>
          </section>
        ) : (
          <div className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No PvP data available for the current season.
          </div>
        )}

        {/* Talent Tree */}
        {character.talents.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Talents
            </h2>
            <Talents classSlug={classSlug} talents={character.talents} hideStats />
          </section>
        )}

        {/* Equipment */}
        <CharacterEquipment
          items={character.equipment}
          classSlug={classSlug}
          characterName={character.name}
          className={classConfig?.name ?? titleizeSlug(character.class_slug)}
          specName={spec?.name}
          avatarUrl={character.avatar_url}
          specIconUrl={spec?.iconUrl}
          statPcts={character.stat_pcts}
        />
      </div>
    </div>
  )
}
