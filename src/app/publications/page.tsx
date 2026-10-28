import { Container } from '@/components/container'
import { PageHeader } from '@/components/page-header'
import publications from '@/data/publications.json'
import { site } from '@/lib/site'
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
    <main>
      <PageHeader
        eyebrow="Publications"
        title="Publications"
        lead={
          <>
            {publications.length} papers and preprints on risk-aware autonomy,
            world models, and embodied agents. Updated weekly from{' '}
            <a
              href={site.scholar}
              target="_blank"
              rel="noreferrer"
              className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              Google Scholar
            </a>
            .
          </>
        }
      />
      <Container className="pt-12 pb-24">
        <p className="mb-8 text-sm text-gray-500">
          * Corresponding author · # Equal contributions
        </p>
        <PublicationsTabbedView sections={sections} />
      </Container>
    </main>
  )
}
