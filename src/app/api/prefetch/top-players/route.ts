import { type NextRequest, NextResponse } from "next/server"
import { fetchTopPlayers } from "@/lib/api"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const bracket = searchParams.get("bracket")
  const specId = searchParams.get("spec_id")
  const region = searchParams.get("region")

  if (!bracket || !specId) {
    return NextResponse.json(
      {
        players: [],
      },
      {
        status: 400,
      },
    )
  }

  try {
    const data = await fetchTopPlayers(bracket, Number(specId), region ?? undefined)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({
      players: [],
    })
  }
}
