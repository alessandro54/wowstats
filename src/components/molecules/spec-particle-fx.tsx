"use client"

import { useEffect, useRef, useCallback } from "react"
import type { SpecParticleEffect, SpecAtmosphere } from "@/config/wow/classes/classes-config"

/* ── Atmosphere registry ───────────────────────────────────────────────── */

import { FrostAtmosphere } from "@/lib/fx/atmospheres/frost"
import { ToxicAtmosphere } from "@/lib/fx/atmospheres/toxic"
import { BloodAtmosphere } from "@/lib/fx/atmospheres/blood"
import { FireAtmosphere } from "@/lib/fx/atmospheres/fire"
import { WarmAtmosphere } from "@/lib/fx/atmospheres/warm"
import { HolyAtmosphere } from "@/lib/fx/atmospheres/holy"
import { ShadowAtmosphere } from "@/lib/fx/atmospheres/shadow"
import { FelAtmosphere } from "@/lib/fx/atmospheres/fel"
import { NatureAtmosphere } from "@/lib/fx/atmospheres/nature"
import { StormAtmosphere } from "@/lib/fx/atmospheres/storm"
import { ArcaneAtmosphere } from "@/lib/fx/atmospheres/arcane"
import { IronAtmosphere } from "@/lib/fx/atmospheres/iron"
import { MistAtmosphere } from "@/lib/fx/atmospheres/mist"

const ATMOSPHERES: Record<SpecAtmosphere, React.FC> = {
  frost: FrostAtmosphere,
  toxic: ToxicAtmosphere,
  blood: BloodAtmosphere,
  fire: FireAtmosphere,
  warm: WarmAtmosphere,
  holy: HolyAtmosphere,
  shadow: ShadowAtmosphere,
  fel: FelAtmosphere,
  nature: NatureAtmosphere,
  storm: StormAtmosphere,
  arcane: ArcaneAtmosphere,
  iron: IronAtmosphere,
  mist: MistAtmosphere,
}

/* ── Particle runner registry ──────────────────────────────────────────── */

import { runSnow } from "@/lib/fx/particles/snow"
import { runPlague } from "@/lib/fx/particles/plague"
import { runBlood } from "@/lib/fx/particles/blood"
import { runRainOfFire } from "@/lib/fx/particles/rainoffire"
import { runCoinRain } from "@/lib/fx/particles/coinrain"

const RUNNERS: Record<
  SpecParticleEffect,
  (ctx: CanvasRenderingContext2D, W: number, H: number) => () => void
> = {
  snow: runSnow,
  plague: runPlague,
  blood: runBlood,
  rainoffire: runRainOfFire,
  coinrain: runCoinRain,
}

/* ── Public component ──────────────────────────────────────────────────── */

interface Props {
  effect?: SpecParticleEffect
  atmosphere?: SpecAtmosphere
}

/**
 * Canvas particle overlay + CSS atmosphere layers.
 * Both props are optional — renders nothing if neither is set.
 */
export function SpecParticleFx({ effect, atmosphere }: Props) {
  if (!effect && !atmosphere) return null

  const Atmosphere = atmosphere ? ATMOSPHERES[atmosphere] : null

  return (
    <>
      {Atmosphere && <Atmosphere />}
      {effect && <SpecParticleCanvas effect={effect} />}
    </>
  )
}

/* ── Canvas particle renderer ──────────────────────────────────────────── */

function SpecParticleCanvas({ effect }: { effect: SpecParticleEffect }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const initAndRun = useCallback(
    (canvas: HTMLCanvasElement) => {
      const runner = RUNNERS[effect]
      if (!runner) return () => {}

      const ctx = canvas.getContext("2d")
      if (!ctx) return () => {}

      let cleanup: () => void

      function start() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        cleanup = runner(ctx!, window.innerWidth, window.innerHeight)
      }

      start()

      const onResize = () => {
        cleanup()
        start()
      }
      window.addEventListener("resize", onResize)

      return () => {
        window.removeEventListener("resize", onResize)
        cleanup()
      }
    },
    [
      effect,
    ],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return initAndRun(canvas)
  }, [
    initAndRun,
  ])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 h-full w-full" />
}
