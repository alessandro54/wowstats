import { WOW_CLASSES } from "@/config/wow/classes"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { BracketSelector } from "@/components/molecules/bracket-selector"
import { PageHeader } from "@/components/molecules/page-header"
import { SpecHeading } from "@/components/atoms/spec-heading"
import { notFound } from "next/navigation"

type Props = {
  children: React.ReactNode
  params: Promise<{ classSlug: string; specSlug: string }>
}

export default async function PvpLayout({ children, params }: Props) {
  const { classSlug, specSlug } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  return (
    <>
      <PageHeader centerSlot={<BracketSelector classSlug={cls.slug} specSlug={specSlug} />}>
        <Breadcrumb className="flex-1 min-w-0">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`/${classSlug}`}>{cls.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{specSlug}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>PvP</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PageHeader>

      <div className="mx-auto max-w-5xl flex flex-col" style={{ height: "calc(100vh - 60px)" }}>
        <div className="flex items-center gap-3 shrink-0 px-6 py-3">
          <span className="icon-vignette icon-vignette-lg rounded-full">
            <video autoPlay loop muted playsInline width={100} height={100} poster={spec.iconRemasteredUrl ?? spec.iconUrl} className="rounded-full block">
              <source src={spec.animationUrl} type="video/mp4" />
            </video>
          </span>
          <SpecHeading className={cls.name} classSlug={cls.slug} specSlug={specSlug} />
        </div>
        <div className="overflow-auto flex-1">
          {children}
        </div>
      </div>
    </>
  )
}
