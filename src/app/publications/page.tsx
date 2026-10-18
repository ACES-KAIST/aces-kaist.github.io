import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading } from '@/components/text'
import { HEYE_HUANG_SCHOLAR_URL } from '@/lib/google-scholar'
import { getPublicationSections } from '@/lib/publications'
import type { Metadata } from 'next'
import { PublicationsTabbedView } from './publications-tabbed-view'

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Research publications by Heye Huang and collaborators.',
}

export default function PublicationsPage() {
  const sections = getPublicationSections()

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Container className="mt-16 pb-16">
        <Heading as="h1">Publications</Heading>
        <p className="mt-6 text-base/7 text-gray-600">
          Publications by Heye Huang and collaborators. See also{' '}
          <a href={HEYE_HUANG_SCHOLAR_URL} target="_blank" rel="noreferrer" className="font-medium text-gray-900 underline underline-offset-4">Google Scholar</a>.
        </p>
        <p className="mt-2 mb-8 text-sm text-gray-500">* Corresponding author · # Equal contributions</p>
        <PublicationsTabbedView sections={sections} />
      </Container>
      <Footer />
    </main>
  )
}
