import { notFound } from "next/navigation"
import { SpecHeading } from "@/components/atoms/spec-heading"
import { BracketSelector } from "@/components/molecules/bracket-selector"
import { PageHeader } from "@/components/molecules/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

interface Props {
  children: React.ReactNode
  params: Promise<{ classSlug: string, specSlug: string }>
}

export default async function PvpLayout({ children, params }: Props) {
  const { classSlug, specSlug } = await params

  const cls = WOW_CLASSES.find(c => c.slug === classSlug)
  const spec = cls?.specs.find(s => s.name === specSlug)
  if (!cls || !spec)
    notFound()

  return (
    <>
      <PageHeader centerSlot={<BracketSelector classSlug={cls.slug} specSlug={specSlug} />}>
        <Breadcrumb className="min-w-0 flex-1">
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

      <div className="mx-auto flex max-w-5xl flex-col" style={{ height: "calc(100vh - 60px)" }}>
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
