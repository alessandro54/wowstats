"use client"

import { useEffect, useRef, useCallback } from "react"
import type { SpecEffect } from "@/config/wow/classes/classes-config"
import { runSnow } from "@/lib/fx/snow"
import { runPlague } from "@/lib/fx/plague"
import { runBlood } from "@/lib/fx/blood"
import { runRainOfFire } from "@/lib/fx/rainoffire"

interface Props {
  effect?: SpecEffect
}

/**
 * Canvas particle overlay + CSS atmosphere layers.
 * Pass the spec's `effect` field from the class config.
 * Returns null if no effect is set — fail-safe.
 */
export function SpecParticleFx({ effect }: Props) {
  if (!effect) return null

  const Atmosphere = ATMOSPHERES[effect]

  return (
    <>
      {Atmosphere && <Atmosphere />}
      <SpecParticleCanvas effect={effect} />
    </>
  )
}

const ATMOSPHERES: Partial<Record<SpecEffect, React.FC>> = {
  snow: SnowAtmosphere,
  plague: PlagueAtmosphere,
  blood: BloodAtmosphere,
  rainoffire: RainOfFireAtmosphere,
}

/* ── CSS atmosphere layers ──────────────────────────────────────────────── */

function SnowAtmosphere() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: -1,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,55,90,0.45) 0%, transparent 65%),
          radial-gradient(ellipse 60% 40% at 15% 60%, rgba(196,30,58,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 85% 60%, rgba(74,140,210,0.06) 0%, transparent 60%)
        `,
      }}
    />
  )
}

function PlagueAtmosphere() {
  return (
    <>
      {/* Background gradients */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,80,20,0.35) 0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 20% 60%, rgba(80,0,120,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 80% 55%, rgba(0,100,30,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(20,0,40,0.4) 0%, transparent 70%)
          `,
        }}
      />
      {/* Ground mist */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[200px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(0,80,20,0.25) 0%, rgba(0,60,15,0.10) 50%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />
    </>
  )
}

function BloodAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 100%, rgba(120,0,20,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 20% 70%, rgba(80,0,15,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 70%, rgba(80,0,15,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(30,0,8,0.6) 0%, transparent 70%)
          `,
        }}
      />
      {/* Pooling glow */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[140px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(150,0,20,0.3) 0%, rgba(100,0,15,0.12) 45%, transparent 100%)",
        }}
      />
    </>
  )
}

function RainOfFireAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 100%, rgba(75,18,0,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 18% 100%, rgba(190,55,0,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 55% 100%, rgba(130,25,0,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 85% 100%, rgba(190,55,0,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(25,110,0,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(10,4,6,0.6) 0%, transparent 70%)
          `,
        }}
      />
      {/* Ground fire glow */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[200px]"
        style={{
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(190,55,0,0.25) 0%, rgba(130,25,0,0.10) 45%, transparent 100%)",
        }}
      />
    </>
  )
}

/* ── Canvas particle renderer ───────────────────────────────────────────── */

const RUNNERS: Record<
  SpecEffect,
  (ctx: CanvasRenderingContext2D, W: number, H: number) => () => void
> = {
  snow: runSnow,
  plague: runPlague,
  blood: runBlood,
  rainoffire: runRainOfFire,
}

function SpecParticleCanvas({ effect }: { effect: SpecEffect }) {
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
