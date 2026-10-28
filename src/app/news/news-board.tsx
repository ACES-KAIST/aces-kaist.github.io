'use client'

import { Container } from '@/components/container'
import { NewsCard } from '@/components/news'
import { newsCategories, type NewsItem } from '@/lib/news-categories'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

// Category filter that also answers to /news#awards and similar links.
export function NewsBoard({ items }: { items: NewsItem[] }) {
  const present = Object.entries(newsCategories).filter(([key]) =>
    items.some((item) => item.category === key),
  )
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1)
      setFilter(present.some(([, c]) => c.id === hash) ? hash : 'all')
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const choose = (id: string) => {
    setFilter(id)
    history.replaceState(null, '', id === 'all' ? window.location.pathname : `#${id}`)
  }
  const visible =
    filter === 'all'
      ? items
      : items.filter((item) => newsCategories[item.category].id === filter)
  const tabs = [
    { id: 'all', label: 'All news', count: items.length },
    ...present.map(([key, c]) => ({
      id: c.id,
      label: c.label,
      count: items.filter((item) => item.category === key).length,
    })),
  ]

  return (
    <>
      <div className="sticky top-18 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <Container>
          <div
            role="tablist"
            aria-label="Filter news"
            className="-mx-3 flex gap-1 overflow-x-auto [scrollbar-width:none]"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={filter === tab.id}
                onClick={() => choose(tab.id)}
                className={clsx(
                  'relative flex h-12 shrink-0 cursor-pointer items-center gap-2 px-3 text-sm font-medium whitespace-nowrap transition',
                  filter === tab.id ? 'text-gray-950' : 'text-gray-500 hover:text-gray-950',
                )}
              >
                {tab.label}
                <span className="font-mono text-[11px] text-gray-400">{tab.count}</span>
                <span
                  aria-hidden="true"
                  className={clsx(
                    'absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600 transition',
                    filter === tab.id ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </button>
            ))}
          </div>
        </Container>
      </div>
      <Container className="py-16 sm:py-20">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.slug}>
              <NewsCard item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
