'use client'

import { useEffect, useRef } from 'react'
import { TrafficScene } from './traffic'

export function RiskFieldHero({ children }: { children: React.ReactNode }) {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = section.current
    const element = canvas.current
    if (!host || !element) return
    const scene = new TrafficScene(element)
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let last = performance.now()
    let visible = true

    const fit = () => {
      const { width, height } = host.getBoundingClientRect()
      scene.resize(width, height)
      scene.draw(0)
    }
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      scene.step(dt)
      scene.draw(dt)
      frame = requestAnimationFrame(loop)
    }
    const run = () => {
      cancelAnimationFrame(frame)
      if (still || !visible || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }

    fit()
    const resize = new ResizeObserver(() => fit())
    resize.observe(host)
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      run()
    })
    seen.observe(host)
    document.addEventListener('visibilitychange', run)

    const move = (event: PointerEvent) => {
      if (still) return
      const box = host.getBoundingClientRect()
      scene.setPointer(event.clientX - box.left, event.clientY - box.top)
    }
    const leave = () => scene.clearPointer()
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerdown', move)
    host.addEventListener('pointerleave', leave)
    host.addEventListener('pointercancel', leave)
    run()

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      seen.disconnect()
      document.removeEventListener('visibilitychange', run)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerdown', move)
      host.removeEventListener('pointerleave', leave)
      host.removeEventListener('pointercancel', leave)
    }
  }, [])

  return (
    <section
      ref={section}
      className="relative isolate flex min-h-[880px] flex-col overflow-hidden bg-navy-950 text-white lg:h-[min(92svh,900px)] lg:min-h-[640px]"
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full font-mono"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-navy-950 via-navy-950/85 via-55% to-transparent to-80% lg:bg-linear-to-r lg:from-navy-950 lg:via-navy-950/75 lg:via-35% lg:to-transparent lg:to-60%"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-navy-950/80 to-transparent"
      />
      {children}
    </section>
  )
}
