import sourcePublications from '@/data/publications.json'

export type PublicationSectionKey = 'preprints' | 'publications'

export interface Publication {
  key: string
  type: string
  title: string
  authors: string[]
  authorsDisplay: string
  year: number | null
  month: number
  keywords: string[]
  citation: string
  venue?: string
  abstract?: string
  bibtex?: string
  status?: string
  note?: string
  url?: string
  codeUrl?: string
  doi?: string
  source?: string
  media?: { type: string; src: string; alt: string; poster?: string }[]
}

export interface PublicationSection {
  key: PublicationSectionKey
  title: string
  items: Publication[]
}

// Publication metadata is a checked-in snapshot of Heye Huang's homepage.
// Keep the source order within each year; do not fetch Google Scholar at build time.
const publications: Publication[] = sourcePublications

export function getPublicationSections(): PublicationSection[] {
  return [
    { key: 'preprints', title: 'Preprints', items: publications.filter((item) => item.type === 'preprint') },
    { key: 'publications', title: 'Publications', items: publications.filter((item) => item.type !== 'preprint') },
  ]
}

export function getPublicationsForPerson(person: { slug: string }): Publication[] {
  // The source confirms this bibliography for the PI. Initials alone are not
  // enough evidence to assign a paper to another member with the same surname.
  return person.slug === 'heye-huang' ? publications : []
}
