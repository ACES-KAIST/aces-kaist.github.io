'use client'

import { assetPath } from '@/lib/site'
import { useRef } from 'react'
import { Link } from './link'

// Research direction card; a direction with a video plays it while hovered.
export function ResearchCard({
  id,
  index,
  title,
  summary,
  keywords,
  image,
  video,
  alt,
}: {
  id: string
  index: number
  title: string
  summary: React.ReactNode
  keywords: readonly string[]
  image: string
  video?: string
  alt: string
}) {
  const player = useRef<HTMLVideoElement>(null)
  const play = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    player.current?.play().catch(() => {})
  }
  const pause = () => player.current?.pause()

  return (
    <Link
      href={`/research#${id}`}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy-950/10 hover:ring-brand-500/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-gray-100 bg-white">
        <img
          src={assetPath(image)}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 size-full object-contain p-5 transition duration-700 group-hover:scale-[1.04]"
        />
        {video && (
          <video
            ref={player}
            src={assetPath(video)}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover opacity-0 transition duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        )}
        <span className="absolute top-4 left-4 rounded-full bg-navy-950/85 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">
          {String(index).padStart(2, '0')}
        </span>
        {video && (
          <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] tracking-wider text-gray-600 uppercase ring-1 ring-black/5 transition group-hover:opacity-0">
            ▶ Hover to play
          </span>
        )}
      </div>
      <div className="flex grow flex-col p-7">
        <h3 className="text-xl/snug font-semibold tracking-tight text-gray-950 group-hover:text-brand-700">
          {title}
        </h3>
        <p className="mt-3 text-[15px]/7 text-gray-600 [&_strong]:font-semibold [&_strong]:text-gray-900">
          {summary}
        </p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {keywords.slice(0, 3).map((keyword) => (
            <li
              key={keyword}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
            >
              {keyword}
            </li>
          ))}
        </ul>
        <span className="mt-auto pt-6 text-sm font-medium text-brand-600">
          Explore this direction{' '}
          <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
