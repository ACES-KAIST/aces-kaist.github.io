'use client'

import { assetPath } from '@/lib/site'
import { useLayoutEffect, useRef, useState } from 'react'

type Photo = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  variants: { src: string; width: number; height: number }[]
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const galleryRef = useRef<HTMLUListElement>(null)
  const [layout, setLayout] = useState<{ width: number; gap: number } | null>(
    null,
  )

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return

    const measure = () => {
      const first = gallery.firstElementChild
      if (!first) return
      const width = first.getBoundingClientRect().width
      const gap = Number.parseFloat(getComputedStyle(gallery).columnGap)
      if (!width || !Number.isFinite(gap)) return
      setLayout((previous) =>
        previous?.width === width && previous.gap === gap
          ? previous
          : { width, gap },
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(gallery)
    return () => observer.disconnect()
  }, [])

  return (
    <ul
      ref={galleryRef}
      aria-label="Lab photo gallery, newest photos first"
      className="mt-12 grid grid-cols-2 items-start gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      style={layout ? { gridAutoRows: '1px', rowGap: 0 } : undefined}
    >
      {photos.map((photo) => (
        <li
          key={photo.id}
          style={
            layout
              ? {
                  gridRowEnd: `span ${Math.ceil((layout.width * photo.height) / photo.width + layout.gap)}`,
                }
              : undefined
          }
        >
          <div className="overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5">
            <img
              src={assetPath(photo.src)}
              srcSet={photo.variants
                .map((variant) => `${assetPath(variant.src)} ${variant.width}w`)
                .join(', ')}
              sizes="(min-width: 1344px) 302px, (min-width: 1280px) calc((100vw - 136px) / 4), (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 720px) 324px, (min-width: 640px) calc((100vw - 72px) / 2), calc((100vw - 64px) / 2)"
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
