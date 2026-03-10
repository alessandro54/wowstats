import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
import Image from "next/image"
import { fetchCharacter } from "@/lib/api"
import type { CharacterPvpEntry } from "@/lib/api"
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

  const title = `${character.name} — ${formatRealm(character.realm)} (${character.region})`
  return {
    title,
    description: `PvP profile for ${character.name}-${formatRealm(character.realm)} on ${character.region}.`,
  }
}

function PvpEntryCard({ entry }: { entry: CharacterPvpEntry }) {
  return (
    <div className="rounded-lg border border-border bg-card/80 px-4 py-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {formatBracket(entry.bracket)}{" "}
        <span className="font-normal text-muted-foreground/60">· {entry.region}</span>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Rating</div>
          <div className="mt-0.5 text-lg font-bold tabular-nums text-foreground">
            {entry.rating}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70">W / L</div>
          <div className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
            {entry.wins}
            <span className="text-muted-foreground/60">/</span>
            {entry.losses}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Win%</div>
          <div className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
            {winRate(entry.wins, entry.losses)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Rank</div>
          <div className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
            {entry.rank ?? "—"}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function CharacterPage({ params }: PageProps) {
  const { region, realm, name } = await params
  const character = await fetchCharacter(region, realm, name)

  if (!character) notFound()

  const color = `var(--color-class-${character.class_slug})`
  const displayRealm = formatRealm(character.realm)

  return (
    <div className="animate-page-in space-y-6 px-6 pb-8 pt-2">
      {/* Header */}
      <div className="flex items-center gap-4">
        {character.avatar_url && (
          <Image
            src={character.avatar_url}
            alt=""
            width={72}
            height={72}
            className="rounded-lg border border-border"
          />
        )}
        <div>
          <h1
            className="text-2xl font-bold leading-none"
            style={{
              color,
            }}
          >
            {character.name}
          </h1>
          <div className="mt-1 text-sm text-muted-foreground">
            {displayRealm}
            {" · "}
            {character.region}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {character.race && `${character.race} `}
            {titleizeSlug(character.class_slug)}
          </div>
        </div>
      </div>

      {/* PvP Stats */}
      {character.pvp_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">PvP Performance</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {character.pvp_entries.map((entry) => (
              <PvpEntryCard key={`${entry.bracket}-${entry.region}`} entry={entry} />
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No PvP data available for the current season.
        </div>
      )}
    </div>
  )
}
