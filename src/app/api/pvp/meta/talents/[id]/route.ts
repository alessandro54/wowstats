import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_URL ?? "http://localhost:3000"

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  },
) {
  const { id } = await params
  const locale = req.nextUrl.searchParams.get("locale") ?? "en_US"
  try {
    const res = await fetch(`${API_URL}/api/v1/pvp/meta/talents/${id}?locale=${locale}`, {
      next: {
        revalidate: 86400,
      },
    })
    if (!res.ok)
      return NextResponse.json({
        id: Number(id),
        description: null,
      })
    const data = await res.json()
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=172800",
      },
    })
  } catch {
    return NextResponse.json({
      id: Number(id),
      description: null,
    })
  }
}
