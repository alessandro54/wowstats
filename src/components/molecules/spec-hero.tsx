import Image from "next/image"
import { titleizeSlug } from "@/lib/utils"

interface Props {
  specName: string
  className: string
  classSlug: string
  specIconUrl: string
  splashUrl?: string
  splashPosition?: string
  animationUrl?: string
  iconRemasteredUrl?: string
  bracketLabel?: string
}

export function SpecHero({
  specName,
  className,
  classSlug,
  specIconUrl,
  splashUrl,
  splashPosition,
  animationUrl,
  iconRemasteredUrl,
  bracketLabel,
}: Props) {
  const classColor = `var(--color-class-${classSlug})`
  const isBracket = !!bracketLabel

  return (
    <div className="relative mb-8 flex min-h-[280px] flex-col justify-end overflow-hidden px-4 pb-10 pt-20 lg:min-h-[340px] lg:px-6">
      {/* Background splash */}
      {splashUrl && (
        <Image
          src={splashUrl}
          alt=""
          fill
          className="pointer-events-none object-cover opacity-25"
          style={{
            objectPosition: splashPosition ?? "center top",
          }}
          priority
        />
      )}

      {/* Gradient overlays */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(to top, var(--background) 0%, transparent 60%),
            linear-gradient(to right, var(--background) 0%, transparent 70%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-[2] mx-auto w-full max-w-5xl">
        <div className="flex items-center gap-4">
          {animationUrl ? (
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
            <span className="icon-vignette rounded-xl">
              <Image
                src={specIconUrl}
                alt={specName}
                width={56}
                height={56}
                className="block rounded-xl"
              />
            </span>
          )}

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {className} · {titleizeSlug(specName)}
            </p>
            <h1
              className="text-3xl font-bold lg:text-4xl"
              style={{
                color: classColor,
              }}
            >
              {titleizeSlug(specName)} {className}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isBracket ? `${bracketLabel} · PvP` : "PvP Performance Overview"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
