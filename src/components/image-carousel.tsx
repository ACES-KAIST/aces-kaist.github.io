'use client'

import { assetPath } from '@/lib/site'
import { useEffect, useRef, useState } from 'react'

interface ImageCarouselProps {
  images: { src: string; alt: string; width: number; height: number }[]
  className?: string
}

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  const viewport = useRef<HTMLDivElement>(null)
  const firstGroup = useRef<HTMLDivElement>(null)
  const cycleWidth = useRef(0)
  const [copies, setCopies] = useState(3)
  const drag = useRef<{ pointerId: number; x: number } | null>(null)

  useEffect(() => {
    const element = viewport.current
    const group = firstGroup.current
    if (!element || !group) return
    const measure = () => {
      const width = group.getBoundingClientRect().width + 16
      if (width <= 16) return
      setCopies(Math.max(3, Math.ceil(element.clientWidth / width) + 2))
      if (Math.abs(width - cycleWidth.current) > 1) {
        const phase = cycleWidth.current
          ? (element.scrollLeft % cycleWidth.current) / cycleWidth.current
          : 0
        cycleWidth.current = width
        element.scrollLeft = width * (1 + phase)
      } else if (element.scrollLeft < width / 2) {
        element.scrollLeft += width
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(group)
    observer.observe(element)
    return () => observer.disconnect()
  }, [images, copies])

  function wrap() {
    const element = viewport.current
    const width = cycleWidth.current
    if (!element || !width) return
    // Matching copies keep the visible image sequence unchanged at each wrap.
    if (element.scrollLeft < width / 2) element.scrollLeft += width
    else if (element.scrollLeft >= width * 1.5) element.scrollLeft -= width
  }

  if (images.length === 0) return null

  return (
    <div className={className}>
      <div
        ref={viewport}
        className="flex cursor-grab gap-4 overflow-x-auto overscroll-x-contain select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Visual Memories. Swipe, drag, or use the left and right arrow keys to browse photos."
        onScroll={wrap}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          const element = viewport.current
          if (element)
            element.scrollLeft +=
              (event.key === 'ArrowRight' ? 1 : -1) * element.clientWidth * 0.6
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse' || event.button !== 0) return
          event.preventDefault()
          event.currentTarget.focus({ preventScroll: true })
          event.currentTarget.setPointerCapture(event.pointerId)
          drag.current = { pointerId: event.pointerId, x: event.clientX }
        }}
        onPointerMove={(event) => {
          if (drag.current?.pointerId !== event.pointerId) return
          event.currentTarget.scrollLeft += drag.current.x - event.clientX
          drag.current.x = event.clientX
          wrap()
        }}
        onPointerUp={(event) => {
          if (drag.current?.pointerId !== event.pointerId) return
          drag.current = null
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onLostPointerCapture={() => {
          drag.current = null
        }}
      >
        {Array.from({ length: copies }, (_, copy) => copy).map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? firstGroup : undefined}
            aria-hidden={copy !== 1 || undefined}
            className="flex shrink-0 gap-4"
          >
            {images.map((image) => (
              <img
                key={`${copy}-${image.src}`}
                draggable={false}
                src={assetPath(image.src)}
                alt={copy === 1 ? image.alt : ''}
                width={image.width}
                height={image.height}
                className="h-[260px] w-auto shrink-0 rounded-2xl object-cover sm:h-[340px]"
                loading="lazy"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
