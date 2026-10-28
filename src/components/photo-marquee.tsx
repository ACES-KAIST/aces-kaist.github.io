import { assetPath } from '@/lib/site'

interface Photo {
  src: string
  alt: string
  width: number
  height: number
}

// Slowly drifting strip of photographs; pauses on hover, stops for reduced motion.
export function PhotoMarquee({ photos }: { photos: Photo[] }) {
  const strip = (copy: number) => (
    <ul aria-hidden={copy === 1 || undefined} className="flex shrink-0 gap-4">
      {photos.map((photo) => (
        <li key={`${copy}-${photo.src}`} className="shrink-0">
          <img
            src={assetPath(photo.src)}
            alt={copy === 0 ? photo.alt : ''}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            className="h-56 w-auto rounded-xl object-cover sm:h-72"
          />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className="animate-marquee flex w-max gap-4"
        style={{ '--marquee-duration': `${photos.length * 7}s` } as React.CSSProperties}
      >
        {strip(0)}
        {strip(1)}
      </div>
    </div>
  )
}
