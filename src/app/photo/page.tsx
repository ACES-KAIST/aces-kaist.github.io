import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading } from '@/components/text'
import photos from '@/data/photos.json'
import type { Metadata } from 'next'
import { PhotoGallery } from './photo-gallery'

export const metadata: Metadata = {
  title: 'Photos',
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
        <Heading as="h1" className="mt-2">
          Visual Memories
        </Heading>
        <PhotoGallery photos={photos} />
      </Container>

      <Footer />
    </main>
  )
}
