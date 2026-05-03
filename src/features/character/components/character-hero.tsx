import Image from "next/image"
import { CopyLinkButton } from "@/features/character/components/copy-link-button"
import { titleizeSlug } from "@/lib/utils"

interface Props {
  name: string
  realm: string
  region: string
  race?: string | null
  classSlug: string
  className: string
  specName?: string
  specIconUrl?: string
  animationUrl?: string
  iconRemasteredUrl?: string
  avatarUrl?: string | null
  armoryUrl: string
}

export function CharacterHero({
  name,
  realm,
  region,
  race,
  classSlug,
  className,
  specName,
  specIconUrl,
  animationUrl,
  iconRemasteredUrl,
  avatarUrl,
  armoryUrl,
}: Props) {
  const classColor = `var(--color-class-${classSlug})`

  // Determine portrait: prefer avatar, fallback to spec icon
  const portraitUrl = avatarUrl ?? specIconUrl

  return (
    <div className="relative mb-8 flex min-h-[220px] flex-col justify-end overflow-hidden px-4 pb-10 pt-20 lg:min-h-[260px] lg:px-6">
      {/* Content */}
      <div className="relative z-[2] mx-auto w-full max-w-5xl">
        <div className="flex items-end gap-5">
          {/* Portrait icon */}
          {portraitUrl && (
            <div className="shrink-0">
              {animationUrl && !avatarUrl ? (
                <span className="icon-vignette icon-vignette-lg rounded-full">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    width={100}
                    height={100}
                    poster={iconRemasteredUrl ?? specIconUrl}
                    className="block size-16 rounded-full md:size-20"
                  >
                    <source src={animationUrl} type="video/mp4" />
                  </video>
                </span>
              ) : (
                <div
                  className="rounded-full border-2 p-0.5"
                  style={{
                    borderColor: classColor,
                    background: `color-mix(in oklch, ${classColor} 12%, transparent)`,
                  }}
                >
                  <Image
                    src={portraitUrl}
                    alt={name}
                    width={72}
                    height={72}
                    className="block size-16 rounded-full object-cover md:size-20"
                  />
                </div>
              )}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {specName ? `${className} · ${titleizeSlug(specName)}` : className}
            </p>
            <h1
              className="truncate text-3xl font-bold lg:text-4xl"
              style={{
                color: classColor,
              }}
            >
              {name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
              {race && <span>{race}</span>}
              <span className="text-muted-foreground/40">·</span>
              <span>{realm}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="uppercase">{region}</span>
              <span className="text-muted-foreground/40">·</span>
              <a
                href={armoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Armory ↗
              </a>
              <span className="text-muted-foreground/40">·</span>
              <CopyLinkButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
