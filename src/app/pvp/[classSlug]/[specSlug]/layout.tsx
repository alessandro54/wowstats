import { notFound } from "next/navigation"
import { PvpSpecTopNav } from "@/components/molecules/pvp-spec-top-nav"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

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

  return (
    <>
      <PvpSpecTopNav className={cls.name} classSlug={cls.slug} specSlug={specSlug} />
      {children}
    </>
  )
}
