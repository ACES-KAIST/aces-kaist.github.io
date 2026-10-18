import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import photos from '@/data/photos.json'
import { assetPath } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photo',
  description: 'Photos from conferences, lab gatherings, and travel.',
}

export default function Photo() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>

      <Container className="mt-16 pb-24 sm:pb-32">
        <Subheading>Lab life</Subheading>
        <Heading as="h1" className="mt-2">
          Photo
        </Heading>
        <p className="mt-6 max-w-2xl text-lg/8 text-gray-600">
          Photos from conferences, lab gatherings, and travel.
        </p>

        <ul
          aria-label="Lab photo gallery"
          className="mt-12 columns-2 gap-4 sm:gap-6 lg:columns-3 xl:columns-4"
        >
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5 sm:mb-6"
            >
              {/* Native responsive images use the prebuilt files on GitHub Pages. */}
              <img
                src={assetPath(photo.src)}
                srcSet={photo.variants
                  .map(
                    (variant) => `${assetPath(variant.src)} ${variant.width}w`,
                  )
                  .join(', ')}
                sizes="(min-width: 1344px) 302px, (min-width: 1280px) calc((100vw - 136px) / 4), (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 720px) 324px, (min-width: 640px) calc((100vw - 72px) / 2), calc((100vw - 64px) / 2)"
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </li>
          ))}
        </ul>
      </Container>

      <Footer />
    </main>
  )
}
