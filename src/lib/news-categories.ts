// Client-safe news types and categories; the file reader lives in news.ts.

export const newsCategories = {
  Award: { label: 'Awards', id: 'awards' },
  Paper: { label: 'Papers', id: 'papers' },
  People: { label: 'People', id: 'people' },
  Event: { label: 'Events', id: 'events' },
  Talk: { label: 'Talks', id: 'talks' },
} as const

export type NewsCategory = keyof typeof newsCategories

export interface NewsItem {
  slug: string
  title: string
  date: string
  category: NewsCategory
  summary: string
  awards: number
  cover?: string
  coverAlt?: string
  coverFit?: 'cover' | 'contain'
  coverPosition?: string
  links: { label: string; href: string }[]
  content: string
}
