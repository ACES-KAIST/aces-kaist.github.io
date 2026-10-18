import { assetPath } from '@/lib/site'

interface ImageCarouselProps {
  images: { src: string; alt: string; width: number; height: number }[]
  className?: string
}

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  if (images.length === 0) return null
  return (
    <div className={className}>
      <div
        className="flex gap-4 overflow-x-auto px-6 pb-4 lg:px-8"
        tabIndex={0}
        role="region"
        aria-label="Lab photo highlights. Scroll horizontally for more photos."
      >
        {images.map((image) => (
          <img
            key={image.src}
            draggable={false}
            src={assetPath(image.src)}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-[260px] w-auto shrink-0 rounded-2xl object-cover sm:h-[340px]"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )
}
