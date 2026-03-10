import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { fetchItems } from "@/lib/api"

export async function GET(req: NextRequest) {
  const specId = Number(req.nextUrl.searchParams.get("spec_id"))
  const bracket = req.nextUrl.searchParams.get("bracket") ?? "3v3"

  if (!specId)
    return new NextResponse(null, {
      status: 400,
    })

  await fetchItems(bracket, specId).catch(() => {})

  return new NextResponse(null, {
    status: 204,
  })
}
