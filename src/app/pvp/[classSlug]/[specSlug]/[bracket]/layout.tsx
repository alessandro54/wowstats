import { notFound } from "next/navigation"
import { SpecHeading } from "@/components/atoms/spec-heading"
import { BracketSelector } from "@/components/molecules/bracket-selector"
import { PvpSpecTopNav } from "@/components/molecules/pvp-spec-top-nav"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

interface Props {
  children: React.ReactNode
  params: Promise<{ classSlug: string, specSlug: string }>
}

export default async function PvpBracketLayout({ children, params }: Props) {
  const { classSlug, specSlug } = await params

  const cls = WOW_CLASSES.find(c => c.slug === classSlug)
  const spec = cls?.specs.find(s => s.name === specSlug)
  if (!cls || !spec)
    notFound()

  return (
    <>
      <div className="mx-auto flex max-w-screen-ok2xl flex-col" style={{ height: "calc(100vh - 60px)" }}>
        <div className="flex shrink-0 items-center gap-3 px-6 py-3">
          <span className="icon-vignette icon-vignette-lg rounded-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              width={100}
              height={100}
              poster={spec.iconRemasteredUrl ?? spec.iconUrl}
              className="block rounded-full"
            >
              <source src={spec.animationUrl} type="video/mp4" />
            </video>
          </span>
          <SpecHeading className={cls.name} classSlug={cls.slug} specSlug={specSlug} />
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </>
  )
}
