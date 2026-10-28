'use client'

import { useEffect, useRef } from 'react'
import { buildLut, RiskField, type Kernel } from './field'

// A quieter relative of the homepage scene for page headers: a few unseen
// agents drift on slow paths and leave only their iso-risk contours.

const LEVELS = [0.14, 0.3, 0.46, 0.62, 0.78]
const COLORS = [
  'rgba(96,150,255,0.22)',
  'rgba(90,209,255,0.30)',
  'rgba(150,232,255,0.36)',
  'rgba(185,164,255,0.42)',
  'rgba(245,184,74,0.5)',
]
const HEAT = buildLut([
  [0, [30, 70, 200, 0]],
  [0.3, [44, 120, 255, 0.08]],
  [0.6, [80, 200, 255, 0.14]],
  [1, [185, 164, 255, 0.2]],
])

interface Drifter {
  x: number
  y: number
  ax: number
  ay: number
  fx: number
  fy: number
  p: number
  a: number
}

export function FieldBackdrop({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current
    const host = element?.parentElement
    if (!element || !host) return
    const ctx = element.getContext('2d')!
    const field = new RiskField(9)
    const scale = 10
    let width = 0
    let height = 0
    let dpr = 1
    let drifters: Drifter[] = []
    let frame = 0
    let visible = true
    let t = Math.random() * 100
    let last = performance.now()
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const fit = () => {
      const box = host.getBoundingClientRect()
      width = box.width
      height = box.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      element.width = Math.round(width * dpr)
      element.height = Math.round(height * dpr)
      field.resize(width, height)
      const count = Math.max(4, Math.round(width / 200))
      drifters = Array.from({ length: count }, (_, i) => ({
        x: ((i + 0.5) / count) * (width / scale) * 1.05,
        y: (0.3 + Math.random() * 0.5) * (height / scale),
        ax: 4 + Math.random() * 8,
        ay: 3 + Math.random() * 6,
        fx: 0.05 + Math.random() * 0.06,
        fy: 0.04 + Math.random() * 0.05,
        p: Math.random() * Math.PI * 2,
        a: 0.6 + Math.random() * 0.5,
      }))
      draw()
    }

    const draw = () => {
      const kernels: Kernel[] = drifters.map((d) => {
        const x = d.x + d.ax * Math.sin(t * d.fx * 2 * Math.PI + d.p)
        const y = d.y + d.ay * Math.sin(t * d.fy * 2 * Math.PI + d.p * 1.7)
        const vx = d.ax * d.fx * 2 * Math.PI * Math.cos(t * d.fx * 2 * Math.PI + d.p)
        const vy = d.ay * d.fy * 2 * Math.PI * Math.cos(t * d.fy * 2 * Math.PI + d.p * 1.7)
        const v = Math.hypot(vx, vy)
        return { x, y, h: Math.atan2(vy, vx), a: d.a, sf: 3 + v * 1.4, sb: 2.4, sw: 2.2 }
      })
      field.compute(kernels, { cx: 0, cy: 0, scale })
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      field.drawHeat(ctx, HEAT)
      field.drawContours(ctx, LEVELS, COLORS, 1)
    }

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      t += dt
      draw()
      frame = requestAnimationFrame(loop)
    }
    const run = () => {
      cancelAnimationFrame(frame)
      if (still || !visible || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }

    fit()
    const resize = new ResizeObserver(fit)
    resize.observe(host)
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      run()
    })
    seen.observe(host)
    document.addEventListener('visibilitychange', run)
    run()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      seen.disconnect()
      document.removeEventListener('visibilitychange', run)
    }
  }, [])

  return <canvas ref={canvas} aria-hidden="true" className={className} />
}
