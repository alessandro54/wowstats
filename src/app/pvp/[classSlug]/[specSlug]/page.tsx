import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { BracketPanels } from "@/components/molecules/bracket-panels"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

interface PageProps {
  params: Promise<{
    classSlug: string
    specSlug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { classSlug, specSlug } = await params
  return {
    title: `${specSlug} ${classSlug} PvP | WoW Meta`,
  }
}

export default async function SpecIndexPage({ params }: PageProps) {
  const { classSlug, specSlug } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  return (
    <div className="animate-page-in mx-auto max-w-6xl space-y-10 p-8">
      {/* Spec hero */}
      <div className="flex items-center gap-4">
        <span className="icon-vignette rounded-xl">
          <Image
            src={spec.iconUrl}
            alt={specSlug}
            width={56}
            height={56}
            className="block rounded-xl"
          />
        </span>
        <div>
          <h1
            className="text-3xl font-bold capitalize"
            style={{
              color: `var(--color-class-${classSlug})`,
            }}
          >
            {specSlug} {cls.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">PvP Statistics — Select a bracket</p>
        </div>
      </div>

      {/* Bracket panels */}
      <BracketPanels
        classSlug={classSlug}
        specSlug={specSlug}
        classColor={`var(--color-class-${classSlug})`}
      />
    </div>
  )
}
