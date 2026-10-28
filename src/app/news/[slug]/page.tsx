import { Container } from '@/components/container'
import { Link } from '@/components/link'
import { Prose } from '@/components/markdown'
import { CategoryChip, NewsCover } from '@/components/news'
import { PageHeader } from '@/components/page-header'
import { formatNewsDate, getNews, getNewsItem } from '@/lib/news'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getNews().map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const item = getNewsItem((await params).slug)
  return item ? { title: item.title, description: item.summary } : {}
}

export default async function NewsArticle({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getNewsItem(slug)
  if (!item) notFound()
  const all = getNews()
  const index = all.findIndex((entry) => entry.slug === slug)
  const newer = all[index - 1]
  const older = all[index + 1]

  return (
    <main>
      <PageHeader
        eyebrow={`News · ${formatNewsDate(item.date)}`}
        title={item.title}
      />
      <Container className="py-16 sm:py-20">
        <article className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <CategoryChip category={item.category} />
            <time className="font-mono text-xs text-gray-500">
              {formatNewsDate(item.date)}
            </time>
          </div>
          <NewsCover
            item={item}
            className="mt-8 aspect-[16/9] rounded-2xl ring-1 ring-black/5"
          />
          <div className="mt-10">
            <Prose>{item.content}</Prose>
          </div>
          {item.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {item.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('/') ? (
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full px-4 py-2 text-sm font-medium ring-1 ring-gray-300 hover:bg-gray-50"
                    >
                      {link.label} →
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full px-4 py-2 text-sm font-medium ring-1 ring-gray-300 hover:bg-gray-50"
                    >
                      {link.label} ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
          <nav
            aria-label="More news"
            className="mt-16 grid grid-cols-1 gap-4 border-t border-gray-200 pt-8 sm:grid-cols-2"
          >
            {newer ? (
              <Link href={`/news/${newer.slug}`} className="group">
                <span className="font-mono text-xs text-gray-500">← Newer</span>
                <span className="mt-1 block text-sm font-medium text-gray-950 group-hover:text-brand-700">
                  {newer.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {older && (
              <Link href={`/news/${older.slug}`} className="group sm:text-right">
                <span className="font-mono text-xs text-gray-500">Older →</span>
                <span className="mt-1 block text-sm font-medium text-gray-950 group-hover:text-brand-700">
                  {older.title}
                </span>
              </Link>
            )}
          </nav>
          <Link
            href="/news"
            className="mt-10 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            ← All news
          </Link>
        </article>
      </Container>
    </main>
  )
}
