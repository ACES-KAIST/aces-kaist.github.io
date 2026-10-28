'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import {
  ArrowUpRightIcon,
  Bars2Icon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navigation, sectionFor, type NavChild } from '@/lib/navigation'
import { Container } from './container'
import { Link } from './link'
import { Logo } from './logo'

function ChildLink({
  item,
  onNavigate,
  className,
  children,
}: {
  item: NavChild
  onNavigate?: () => void
  className?: string
  children: React.ReactNode
}) {
  if (item.external)
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        onClick={onNavigate}
      >
        {children}
      </a>
    )
  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  )
}

function DesktopNav({ active }: { active?: string }) {
  return (
    <nav aria-label="Main" className="hidden items-stretch self-stretch lg:flex">
      {navigation.map((item) => (
        <div key={item.href} className="group relative flex">
          <Link
            href={item.href}
            aria-current={active === item.href ? 'page' : undefined}
            className="relative flex items-center gap-1 px-3 text-[15px] font-medium text-white/80 transition hover:text-white aria-[current=page]:text-white xl:px-4"
          >
            {item.label}
            {item.children && (
              <ChevronDownIcon className="size-4 text-white/40 transition group-hover:rotate-180 group-hover:text-white/70" />
            )}
            <span
              aria-hidden="true"
              className="absolute inset-x-3 bottom-3 h-0.5 scale-x-0 rounded-full bg-signal transition xl:inset-x-4 [[aria-current=page]>&]:scale-x-100"
            />
          </Link>
          {item.children && (
            <div className="invisible absolute top-full left-1/2 w-80 -translate-x-1/2 translate-y-1 pt-1 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="rounded-xl bg-white p-2 text-gray-950 shadow-xl ring-1 shadow-navy-950/20 ring-black/5">
                {item.children.map((child) => (
                  <ChildLink
                    key={child.href}
                    item={child}
                    className="flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 transition hover:bg-brand-50 focus-visible:bg-brand-50 focus-visible:outline-none"
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        {child.label}
                      </span>
                      {child.description && (
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {child.description}
                        </span>
                      )}
                    </span>
                    {child.external && (
                      <ArrowUpRightIcon className="mt-0.5 size-4 shrink-0 text-gray-400" />
                    )}
                  </ChildLink>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const active = sectionFor(pathname)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <Disclosure
      as="header"
      className={({ open }) =>
        clsx(
          'fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300',
          open
            ? 'border-b border-white/10 bg-navy-950'
            : scrolled
              ? 'border-b border-white/10 bg-navy-950/90 backdrop-blur-md'
              : 'border-b border-transparent bg-transparent',
        )
      }
    >
      {({ open, close }) => (
        <>
          <Container>
            <div className="flex h-18 items-center justify-between gap-6">
              <Link href="/" title="ACES Lab home" className="flex items-center">
                <Logo />
              </Link>
              <DesktopNav active={active} />
              <DisclosureButton
                className="-mr-2 flex size-11 items-center justify-center rounded-lg hover:bg-white/10 lg:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                {open ? (
                  <XMarkIcon className="size-6" />
                ) : (
                  <Bars2Icon className="size-6" />
                )}
              </DisclosureButton>
            </div>
          </Container>
          <DisclosurePanel className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-white/10 lg:hidden">
            <Container className="py-6">
              <ul className="space-y-6">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => close()}
                      className={clsx(
                        'text-lg font-medium',
                        active === item.href ? 'text-signal' : 'text-white',
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="mt-2 grid grid-cols-1 gap-x-6 border-l border-white/10 pl-4 sm:grid-cols-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <ChildLink
                              item={child}
                              onNavigate={() => close()}
                              className="block py-1.5 text-sm text-white/65 hover:text-white"
                            >
                              {child.label}
                            </ChildLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </Container>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
