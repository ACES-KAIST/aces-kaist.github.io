import { PageHeader } from '@/components/page-header'
import { getNews } from '@/lib/news'
import type { Metadata } from 'next'
import { NewsBoard } from './news-board'

export const metadata: Metadata = {
  title: 'News',
  description: 'Awards, papers, people, and events at ACES Lab, KAIST.',
}

export default function NewsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="News"
        title="News from the lab"
        lead="Awards, papers, people, and events at ACES Lab."
      />
      <NewsBoard items={getNews()} />
    </main>
  )
}
