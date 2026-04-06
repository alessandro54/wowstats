"use client"

import type { FC } from "react"
import { useCallback, useEffect, useRef } from "react"
import type { SpecAtmosphere, SpecParticleEffect } from "@/config/wow/classes/classes-config"

/* ── Atmosphere registry ───────────────────────────────────────────────── */

import { ArcaneAtmosphere } from "@/lib/fx/atmospheres/arcane"
import { BloodAtmosphere } from "@/lib/fx/atmospheres/blood"
import { FelAtmosphere } from "@/lib/fx/atmospheres/fel"
import { FireAtmosphere } from "@/lib/fx/atmospheres/fire"
import { FrostAtmosphere } from "@/lib/fx/atmospheres/frost"
import { HolyAtmosphere } from "@/lib/fx/atmospheres/holy"
import { IronAtmosphere } from "@/lib/fx/atmospheres/iron"
import { MistAtmosphere } from "@/lib/fx/atmospheres/mist"
import { NatureAtmosphere } from "@/lib/fx/atmospheres/nature"
import { ShadowAtmosphere } from "@/lib/fx/atmospheres/shadow"
import { StormAtmosphere } from "@/lib/fx/atmospheres/storm"
import { ToxicAtmosphere } from "@/lib/fx/atmospheres/toxic"
import { WarmAtmosphere } from "@/lib/fx/atmospheres/warm"

const ATMOSPHERES: Record<SpecAtmosphere, FC> = {
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

import { runBlood } from "@/lib/fx/particles/blood"
import { runCoinRain } from "@/lib/fx/particles/coinrain"
import { runPlague } from "@/lib/fx/particles/plague"
import { runRainOfFire } from "@/lib/fx/particles/rainoffire"
import { runShadowSmoke } from "@/lib/fx/particles/shadowsmoke"
import { runSnow } from "@/lib/fx/particles/snow"
import { runVenomDrip } from "@/lib/fx/particles/venomdrip"

const RUNNERS: Record<
  SpecParticleEffect,
  (ctx: CanvasRenderingContext2D, W: number, H: number) => () => void
> = {
  snow: runSnow,
  plague: runPlague,
  blood: runBlood,
  rainoffire: runRainOfFire,
  coinrain: runCoinRain,
  shadowsmoke: runShadowSmoke,
  venomdrip: runVenomDrip,
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

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
  )
}
