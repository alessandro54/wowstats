import { type NextRequest, NextResponse } from "next/server"
import { fetchCharacter } from "@/lib/api"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const region = searchParams.get("region")
  const realm = searchParams.get("realm")
  const name = searchParams.get("name")

  if (!region || !realm || !name) {
    return NextResponse.json(
      {
        error: "missing params",
      },
      {
        status: 400,
      },
    )
  }

  const data = await fetchCharacter(region, realm, name)
  if (!data)
    return NextResponse.json(
      {
        error: "not found",
      },
      {
        status: 404,
      },
    )
  return NextResponse.json(data)
}
