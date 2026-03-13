import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { fetchItems } from "@/lib/api"

export async function GET(req: NextRequest) {
  const specId = Number(req.nextUrl.searchParams.get("spec_id"))
  const bracket = req.nextUrl.searchParams.get("bracket") ?? "3v3"
  const locale = req.nextUrl.searchParams.get("locale") ?? undefined

  if (!specId)
    return new NextResponse(null, {
      status: 400,
    })

  await fetchItems(bracket, specId, locale).catch(() => {})

  return new NextResponse(null, {
    status: 204,
  })
}
