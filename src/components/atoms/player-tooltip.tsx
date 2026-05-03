import type { TopPlayer } from "@/lib/api"

export function characterUrl(player: TopPlayer): string {
  const realm = player.realm.toLowerCase().replace(/\s+/g, "-")
  return `/character/${player.region.toLowerCase()}/${realm}/${player.name.toLowerCase()}`
}
