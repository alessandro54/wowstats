import type { Metadata } from "next"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/molecules/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BRACKETS } from "@/config/wow/brackets-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

interface PageProps {
  params: Promise<{ classSlug: string, specSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { classSlug, specSlug } = await params
  return { title: `${specSlug} ${classSlug} PvP | WoW Meta` }
}

export default async function SpecIndexPage({ params }: PageProps) {
  const { classSlug, specSlug } = await params

  const cls = WOW_CLASSES.find(c => c.slug === classSlug)
  const spec = cls?.specs.find(s => s.name === specSlug)
  if (!cls || !spec)
    notFound()

  return (
    <>
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">{cls.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{specSlug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PageHeader>

      <div className="animate-page-in mx-auto max-w-2xl space-y-10 p-8">
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
            <h1 className="text-3xl font-bold capitalize" style={{ color: cls.color }}>
              {specSlug}
              {" "}
              {cls.name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">PvP Statistics — Select a bracket</p>
          </div>
        </div>

        {/* Bracket cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BRACKETS.map(bracket => (
            <Link
              key={bracket.slug}
              href={`/${classSlug}/${specSlug}/pvp/${bracket.slug}`}
              className="group bg-card hover:border-primary/50 hover:bg-card/80 flex items-center justify-between rounded-xl border p-5 transition-colors"
            >
              <div className="space-y-1">
                <p className="font-semibold" style={{ color: cls.color }}>
                  {bracket.label}
                </p>
                <p className="text-muted-foreground text-sm">{bracket.description}</p>
              </div>
              <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
