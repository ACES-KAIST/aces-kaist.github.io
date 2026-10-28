import type { NewsItem } from '@/lib/news-categories'
import { assetPath } from '@/lib/site'
import { clsx } from 'clsx'
import { Link } from './link'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function shortDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return `${day ? `${day} ` : ''}${MONTHS[(month || 1) - 1]} ${year}`
}

const CATEGORY_TONE: Record<string, string> = {
  Award: 'bg-amber/15 text-[#8a5a00] ring-amber/30',
  Paper: 'bg-brand-50 text-brand-700 ring-brand-100',
  People: 'bg-violet/15 text-[#4b3aa8] ring-violet/30',
  Event: 'bg-signal/15 text-[#0b5f7a] ring-signal/30',
  Talk: 'bg-signal/15 text-[#0b5f7a] ring-signal/30',
}

export function CategoryChip({ category }: { category: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.12em] uppercase ring-1 ring-inset',
        CATEGORY_TONE[category] ?? CATEGORY_TONE.Event,
      )}
    >
      {category}
    </span>
  )
}

/** Cover photograph, or a contour-map card when the item has none. */
export function NewsCover({
  item,
  className,
}: {
  item: NewsItem
  className?: string
}) {
  if (item.cover)
    return (
      <div className={clsx('overflow-hidden bg-gray-100', className)}>
        <img
          src={assetPath(item.cover)}
          alt={item.coverAlt}
          loading="lazy"
          className={clsx(
            'size-full transition duration-700 group-hover:scale-[1.04]',
            item.coverFit === 'contain' ? 'bg-white object-contain p-4' : 'object-cover',
          )}
          style={item.coverPosition ? { objectPosition: item.coverPosition } : undefined}
        />
      </div>
    )
  return (
    <div
      className={clsx(
        'relative flex items-end overflow-hidden bg-navy-900 p-5 text-white',
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full transition duration-700 group-hover:scale-[1.04]"
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse
            key={i}
            cx={290}
            cy={110}
            rx={30 + i * 26}
            ry={16 + i * 15}
            transform="rotate(-18 290 110)"
            fill="none"
            stroke={i < 2 ? '#f5b84a' : i < 4 ? '#5ad1ff' : '#3b6cf6'}
            strokeOpacity={0.55 - i * 0.06}
          />
        ))}
      </svg>
      <span className="relative font-mono text-[11px] tracking-[0.16em] text-white/70 uppercase">
        {item.title.split(' ').slice(0, 4).join(' ')}
      </span>
    </div>
  )
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy-950/10 hover:ring-gray-300"
    >
      <NewsCover item={item} className="aspect-[16/10]" />
      <div className="flex grow flex-col p-6">
        <div className="flex items-center gap-3">
          <time className="font-mono text-xs text-gray-500">{shortDate(item.date)}</time>
          <CategoryChip category={item.category} />
        </div>
        <h3 className="mt-3 text-lg/snug font-semibold tracking-tight text-gray-950 group-hover:text-brand-700">
          {item.title}
        </h3>
        <p className="mt-2 text-sm/6 text-gray-600">{item.summary}</p>
        <span className="mt-auto pt-5 text-sm font-medium text-brand-600">
          Read more <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}
