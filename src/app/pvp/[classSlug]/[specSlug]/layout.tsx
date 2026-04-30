import { notFound } from "next/navigation"
import { PvpSpecTopNav } from "@/features/spec/components/pvp-spec-top-nav"
import { SpecHero } from "@/features/spec/components/spec-hero"
import { SpecParticleFx } from "@/components/molecules/spec-particle-fx"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

export function generateStaticParams() {
  if (process.env.NODE_ENV !== "production") return []
  const params: {
    classSlug: string
    specSlug: string
  }[] = []
  for (const cls of WOW_CLASSES) {
    for (const spec of cls.specs) {
      params.push({
        classSlug: cls.slug,
        specSlug: spec.name,
      })
    }
  }
  return params
}

interface Props {
  children: React.ReactNode
  params: Promise<{
    classSlug: string
    specSlug: string
  }>
}

export default async function PvpSpecLayout({ children, params }: Props) {
  const { classSlug, specSlug } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  const specColor = `var(--color-spec-${classSlug}-${specSlug})`

  return (
    <>
      <PvpSpecTopNav className={cls.name} classSlug={cls.slug} specSlug={specSlug} />
      <div className="relative">
        <SpecParticleFx effect={spec.effect} atmosphere={spec.atmosphere} />
        {!spec.effect && !spec.atmosphere && (
          <div
            className="pointer-events-none fixed aspect-square w-[50vw] rounded-full animate-blob-drift-2"
            style={{
              zIndex: -1,
              background: specColor,
              opacity: 0.05,
              filter: "blur(160px)",
              bottom: "-25%",
              left: "-15%",
            }}
          />
        )}
        <SpecHero
          specName={specSlug}
          className={cls.name}
          classSlug={classSlug}
          specIconUrl={spec.iconUrl}
          splashUrl={spec.splash?.url}
          splashPosition={spec.splash?.position}
          animationUrl={spec.animationUrl}
          iconRemasteredUrl={spec.iconRemasteredUrl}
        />
        {children}
      </div>
    </>
  )
}
