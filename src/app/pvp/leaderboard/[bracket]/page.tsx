import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LeaderboardView } from "@/features/spec/components/leaderboard-view"
import { BRACKETS } from "@/config/wow/brackets-config"
import { fetchLeaderboard } from "@/lib/api"

export const dynamic = "force-dynamic"

const PREFETCH_PER_PAGE = 500

interface PageProps {
  params: Promise<{
    bracket: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bracket } = await params
  return {
    title: `${bracket} Leaderboard`,
    description: `Full ${bracket} leaderboard.`,
  }
}

export default async function LeaderboardPage({ params, searchParams }: PageProps) {
  const { bracket } = await params
  const search = await searchParams

  if (!BRACKETS.some((b) => b.slug === bracket)) notFound()

  const region = typeof search.region === "string" ? search.region : undefined

  const data = await fetchLeaderboard({
    bracket,
    region,
    page: 1,
    perPage: PREFETCH_PER_PAGE,
  })

  return <LeaderboardView bracket={bracket} data={data} />
}
