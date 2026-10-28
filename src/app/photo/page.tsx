import { Container } from '@/components/container'
import { PageHeader } from '@/components/page-header'
import photos from '@/data/photos.json'
import type { Metadata } from 'next'
import { PhotoGallery } from './photo-gallery'

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Photos from conferences, lab gatherings, and travel.',
}

export default function Photo() {
  return (
    <main>
      <PageHeader
        eyebrow="News · Lab life"
        title="Life at ACES"
        lead="Conferences, celebrations, and everyday moments from the lab."
      />
      <Container className="pt-4 pb-24 sm:pb-32">
        <PhotoGallery photos={photos} />
      </Container>
    </main>
  )
}
