import { notFound } from "next/navigation"
import { SpecHeading } from "@/components/atoms/spec-heading"
import { StatPriority } from "@/components/organisms/stat-priority"
import { apiBracket } from "@/config/app-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { fetchStatPriority } from "@/lib/api"

interface Props {
  children: React.ReactNode
  params: Promise<{
    classSlug: string
    specSlug: string
    bracket: string
  }>
}

export default async function PvpBracketLayout({ children, params }: Props) {
  const { classSlug, specSlug, bracket } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  const resolvedBracket = apiBracket(bracket, classSlug, specSlug)
  const statPriority = await fetchStatPriority(resolvedBracket, spec.id).catch(() => ({
    bracket: resolvedBracket,
    spec_id: spec.id,
    stats: [],
  }))

  return (
    <>
      <div
        className="mx-auto flex max-w-screen-ok2xl flex-col"
        style={{
          height: "calc(100vh - 60px)",
        }}
      >
        <div className="shrink-0 px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="icon-vignette icon-vignette-lg rounded-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  width={100}
                  height={100}
                  poster={spec.iconRemasteredUrl ?? spec.iconUrl}
                  className="block size-12 md:size-25 rounded-full"
                >
                  <source src={spec.animationUrl} type="video/mp4" />
                </video>
              </span>
              <SpecHeading className={cls.name} classSlug={cls.slug} specSlug={specSlug} />
            </div>
            <div className="hidden md:block">
              <StatPriority stats={statPriority.stats} compact />
            </div>
            <div className="md:hidden">
              <StatPriority stats={statPriority.stats} vertical />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto lg:px-5">{children}</div>
      </div>
    </>
  )
}
