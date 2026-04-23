"use client"

import type { FC } from "react"
import { useEffect, useRef } from "react"
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

/* ── Particle runner registry (lazy-loaded per effect) ─────────────────── */

type RunnerFn = (ctx: CanvasRenderingContext2D, W: number, H: number) => () => void

const RUNNERS: Record<SpecParticleEffect, () => Promise<RunnerFn>> = {
  snow: () => import("@/lib/fx/particles/snow").then((m) => m.runSnow),
  plague: () => import("@/lib/fx/particles/plague").then((m) => m.runPlague),
  blood: () => import("@/lib/fx/particles/blood").then((m) => m.runBlood),
  rainoffire: () => import("@/lib/fx/particles/rainoffire").then((m) => m.runRainOfFire),
  coinrain: () => import("@/lib/fx/particles/coinrain").then((m) => m.runCoinRain),
  shadowsmoke: () => import("@/lib/fx/particles/shadowsmoke").then((m) => m.runShadowSmoke),
  venomdrip: () => import("@/lib/fx/particles/venomdrip").then((m) => m.runVenomDrip),
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const loader = RUNNERS[effect]
    if (!loader) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    async function start(runnerFn: RunnerFn) {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      cleanup?.()
      cleanup = runnerFn(ctx!, window.innerWidth, window.innerHeight)
    }

    let runnerFn: RunnerFn | null = null

    loader().then((fn) => {
      if (cancelled) return
      runnerFn = fn
      start(fn)
    })

    const onResize = () => {
      if (runnerFn) start(runnerFn)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelled = true
      window.removeEventListener("resize", onResize)
      cleanup?.()
    }
  }, [
    effect,
  ])

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
  )
}
