'use client'

import { ArrowRightIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Container } from './container'
import { Link } from './link'

export interface SubTab {
  label: string
  /** `#id` for a section on this page, or a path to another page. */
  href: string
  /** Optional step number shown before the label, such as "01". */
  index?: string
}

// In-page tabs that stay under the navbar and follow the reader's position.
// Links to other pages sit apart, on the right.
export function SubTabs({ items }: { items: SubTab[] }) {
  const [active, setActive] = useState('')
  const list = useRef<HTMLUListElement>(null)
  const still = useReducedMotion()
  const local = items.filter((item) => item.href.startsWith('#'))
  const away = items.filter((item) => !item.href.startsWith('#'))

  useEffect(() => {
    const ids = items.filter((i) => i.href.startsWith('#')).map((i) => i.href.slice(1))
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        let current = ''
        for (const id of ids) {
          const element = document.getElementById(id)
          if (element && element.getBoundingClientRect().top <= 160) current = id
        }
        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        if (atBottom && ids.length) current = ids[ids.length - 1]
        setActive(current)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [items])

  useEffect(() => {
    const element = list.current?.querySelector<HTMLElement>('[data-active]')
    element?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active])

  return (
    <div className="sticky top-18 z-40 border-t border-white/10 bg-navy-950/95 text-white backdrop-blur-md">
      <Container>
        <div className="flex h-14 items-center gap-3">
          <ul
            ref={list}
            className="-mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,black_80%,transparent)] [&::-webkit-scrollbar]:hidden"
          >
            {local.map((item) => {
              const isActive = item.href === `#${active}`
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    data-active={isActive || undefined}
                    aria-current={isActive ? 'location' : undefined}
                    className={clsx(
                      'relative isolate flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors',
                      isActive ? 'text-white' : 'text-white/60 hover:text-white',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sub-tab-pill"
                        transition={
                          still ? { duration: 0 } : { type: 'spring', bounce: 0.15, duration: 0.45 }
                        }
                        className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-white/15 ring-inset"
                      />
                    )}
                    {item.index && (
                      <span
                        className={clsx(
                          'font-mono text-[11px] transition-colors',
                          isActive ? 'text-signal' : 'text-white/35',
                        )}
                      >
                        {item.index}
                      </span>
                    )}
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          {away.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/75 ring-1 ring-white/20 transition hover:bg-white hover:text-navy-950 sm:inline-flex"
            >
              {item.label}
              <ArrowRightIcon className="size-3.5" />
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}
