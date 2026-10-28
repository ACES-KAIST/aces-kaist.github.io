'use client'

import type { Publication, PublicationSection } from '@/lib/publications'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

function groupByYear(items: Publication[]) {
  const groups = new Map<string, Publication[]>()
  for (const item of items) {
    const yearKey = item.year ? String(item.year) : 'Unknown'
    const current = groups.get(yearKey) ?? []
    current.push(item)
    groups.set(yearKey, current)
  }
  return [...groups.entries()]
}

function toYearAnchorId(sectionKey: string, yearLabel: string) {
  const slug = yearLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${sectionKey}-year-${slug || 'unknown'}`
}

function CitationIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
}

function AbstractIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h8M8 17h8M8 9h2" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" />
    </svg>
  )
}

function PublicationActions({ item }: { item: Publication }) {
  const [open, setOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const panelId = useId()
  const iconClass =
    'inline-flex size-8 items-center justify-center rounded text-gray-400 transition hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500'
  const abstractUrl = item.abstractUrl || item.url
  const abstractLabel = item.abstractAvailable
    ? 'Read abstract'
    : 'Publication details'

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus(`${label} copied.`)
    } catch {
      setCopyStatus('Copy is unavailable. Select and copy the text below.')
    }
  }

  return (
    <div className="mt-1">
      <div className="-ml-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={`Citation for ${item.title}`}
          aria-expanded={open}
          aria-controls={panelId}
          title="Citation"
          className={`${iconClass} cursor-pointer`}
        >
          <CitationIcon />
        </button>
        {abstractUrl && (
          <a
            href={abstractUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${abstractLabel} for ${item.title} (opens in a new tab)`}
            title={abstractLabel}
            className={iconClass}
          >
            <AbstractIcon />
          </a>
        )}
        {item.codeUrl && (
          <a
            href={item.codeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Code for ${item.title} (opens in a new tab)`}
            title="Code"
            className={iconClass}
          >
            <CodeIcon />
          </a>
        )}
      </div>
      <div
        id={panelId}
        hidden={!open}
        className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-semibold text-gray-700">Citation</h4>
          <button
            type="button"
            onClick={() => copy(item.citation, 'Citation')}
            className="cursor-pointer text-xs text-gray-600 underline underline-offset-2 hover:text-gray-950"
          >
            Copy citation
          </button>
        </div>
        <p className="mt-2 text-sm/6 text-gray-700 select-text">
          {item.citation}
        </p>
        {item.bibtex && (
          <>
            <div className="mt-4 flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold text-gray-700">BibTeX</h4>
              <button
                type="button"
                onClick={() => copy(item.bibtex!, 'BibTeX')}
                className="cursor-pointer text-xs text-gray-600 underline underline-offset-2 hover:text-gray-950"
              >
                Copy BibTeX
              </button>
            </div>
            <pre className="mt-2 max-h-64 overflow-auto text-[11px]/5 break-words whitespace-pre-wrap text-gray-700">
              {item.bibtex}
            </pre>
          </>
        )}
        <p role="status" className="mt-2 min-h-4 text-xs text-gray-500">
          {copyStatus}
        </p>
      </div>
    </div>
  )
}

/* ─── Publication list with sticky year headers ─── */

function SectionContent({ section }: { section: PublicationSection }) {
  const groups = groupByYear(section.items)

  const renderStatus = (item: Publication) => {
    if (!item.status) return null
    return (
      <span className="ml-2 text-base font-normal text-gray-600 italic">
        ({item.status})
      </span>
    )
  }

  const renderTitle = (item: Publication) => {
    if (item.url) {
      return (
        <>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold tracking-tight text-gray-950 transition hover:text-gray-700"
          >
            {item.title}
          </a>
          {renderStatus(item)}
        </>
      )
    }
    return (
      <span className="font-semibold tracking-tight text-gray-950">
        {item.title}
        {renderStatus(item)}
      </span>
    )
  }

  return (
    <div>
      {groups.length === 0 ? (
        <p className="p-6 text-sm text-gray-500 sm:p-8">No entries found.</p>
      ) : (
        groups.map(([year, group]) => (
          <div key={year}>
            {/* Sticky year divider — frosted, edge-to-edge */}
            <div
              id={toYearAnchorId(section.key, year)}
              className="sticky top-[9rem] z-10 scroll-mt-[9rem] bg-white"
            >
              <div className="flex items-center gap-4 px-6 py-3.5 sm:px-8">
                <h3 className="shrink-0 text-[13px] font-bold tracking-wide text-gray-950 tabular-nums">
                  {year}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
            </div>

            {/* Publications for this year */}
            <ul className="space-y-6 px-6 pb-2 sm:px-8">
              {group.map((item) => (
                <li key={`${item.key}-${section.title}`}>
                  <div className="text-lg/7">{renderTitle(item)}</div>
                  <p className="mt-0.5 text-sm/6 text-gray-600">
                    {item.authorsDisplay}
                    {item.venue ? ` · ${item.venue}` : ''}
                  </p>
                  {item.note && (
                    <p className="mt-1 text-sm/6 font-medium text-gray-700">
                      {item.note}
                    </p>
                  )}
                  <PublicationActions item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}

/* ─── Segmented tab control ─── */

function TabBar({
  sections,
  activeKey,
  onTabClick,
}: {
  sections: PublicationSection[]
  activeKey: string
  onTabClick: (key: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })

  const updatePill = useCallback(() => {
    const el = tabRefs.current[activeKey]
    if (!el) return
    setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true })
  }, [activeKey])

  useEffect(() => {
    updatePill()
    window.addEventListener('resize', updatePill)
    return () => window.removeEventListener('resize', updatePill)
  }, [updatePill])

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center rounded-full bg-gray-950/[0.04] p-1"
      role="tablist"
    >
      {/* Sliding pill indicator */}
      <div
        aria-hidden
        className={`absolute top-1 bottom-1 rounded-full bg-white shadow-sm ring-1 ring-black/[0.06] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          pill.ready ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ left: `${pill.left}px`, width: `${pill.width}px` }}
      />

      {sections.map((section) => {
        const isActive = section.key === activeKey
        return (
          <button
            key={section.key}
            ref={(el) => {
              tabRefs.current[section.key] = el
            }}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabClick(section.key)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive ? 'text-gray-950' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {section.title}
            <span
              className={`text-[11px] tabular-nums transition-colors duration-200 ${
                isActive ? 'text-gray-400' : 'text-gray-400/50'
              }`}
            >
              {section.items.length}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ─── Main tabbed view ─── */

export function PublicationsTabbedView({
  sections,
}: {
  sections: PublicationSection[]
}) {
  const [activeKey, setActiveKey] = useState('publications')

  // Sync with the URL hash on mount and when a menu link changes it.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && sections.some((s) => s.key === hash)) {
        setActiveKey(hash as typeof activeKey)
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [sections])

  const activeSection = sections.find((s) => s.key === activeKey) ?? sections[0]

  const handleTabClick = (key: string) => {
    setActiveKey(key as typeof activeKey)
    window.history.replaceState(null, '', `#${key}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Sticky tab bar */}
      <div className="sticky top-18 z-20 -mx-6 border-b border-gray-100 bg-white px-6 lg:-mx-8 lg:px-8">
        <div className="flex justify-center py-4">
          <TabBar
            sections={sections}
            activeKey={activeKey}
            onTabClick={handleTabClick}
          />
        </div>
      </div>

      {/* Content — full width, no sidebar */}
      <div className="mt-8">
        <SectionContent key={activeKey} section={activeSection} />
      </div>
    </>
  )
}
