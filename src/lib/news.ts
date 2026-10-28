import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { newsCategories, type NewsCategory, type NewsItem } from './news-categories'

export { newsCategories, type NewsCategory, type NewsItem }

// One Markdown file per news item in content/news. The file name (without
// .md) is the URL slug; `date` is 'YYYY-MM' or 'YYYY-MM-DD'.

const directory = path.join(process.cwd(), 'content/news')

function readItem(file: string): NewsItem {
  const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'))
  const date =
    data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date)
  const category = (data.category in newsCategories ? data.category : 'Event') as NewsCategory
  return {
    slug: file.replace(/\.md$/, ''),
    title: data.title,
    date,
    category,
    summary: data.summary || '',
    awards: data.awards ?? (category === 'Award' ? 1 : 0),
    cover: data.cover || undefined,
    coverAlt: data.coverAlt || '',
    coverFit: data.coverFit === 'contain' ? 'contain' : 'cover',
    coverPosition: data.coverPosition || undefined,
    links: data.links || [],
    content: content.trim(),
  }
}

export function getNews(): NewsItem[] {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md'))
    .map(readItem)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getNewsItem(slug: string): NewsItem | undefined {
  return getNews().find((item) => item.slug === slug)
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatNewsDate(date: string, short = false): string {
  const [year, month, day] = date.split('-').map(Number)
  const name = months[(month || 1) - 1]
  const label = short ? name.slice(0, 3) : name
  return day ? `${day} ${label} ${year}` : `${label} ${year}`
}
