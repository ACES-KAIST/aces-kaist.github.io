'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { Bars2Icon, HomeIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Link } from './link'
import { Logo } from './logo'
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid'

const links = [
  { href: '/research', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/team', label: 'Team' },
  { href: '/photo', label: 'Photos' },
  { href: '/hardware', label: 'Hardware' },
  { href: '/faq', label: 'Join' },
  { href: '/contact', label: 'Contact Us' },
]

function DesktopNav({
  isLight = false,
  showHomeShortcut = false,
}: {
  isLight?: boolean
  showHomeShortcut?: boolean
}) {
  return (
    <nav className="relative hidden xl:flex">
      {showHomeShortcut && (
        <PlusGridItem className="relative flex">
          <Link
            href="/"
            title="Home"
            aria-label="Home"
            className={`flex items-center px-3 py-3 text-base font-medium bg-blend-multiply ${
              isLight ? 'text-white' : 'text-gray-950 data-hover:bg-black/2.5'
            }`}
          >
            <HomeIcon className="size-4" />
          </Link>
        </PlusGridItem>
      )}
      {links.map(({ href, label }) => (
        <PlusGridItem key={href} className="relative flex">
          <Link
            href={href}
            className={`flex items-center px-3 py-3 text-base font-medium bg-blend-multiply ${
              isLight ? 'text-white' : 'text-gray-950 data-hover:bg-black/2.5'
            }`}
          >
            {label}
          </Link>
        </PlusGridItem>
      ))}
    </nav>
  )
}

function MobileNavButton({ isLight = false }: { isLight?: boolean }) {
  return (
    <DisclosureButton
      className={`flex size-12 items-center justify-center self-center rounded-lg xl:hidden ${
        isLight ? '' : 'data-hover:bg-black/5'
      }`}
      aria-label="Open main menu"
    >
      <Bars2Icon
        className={`size-6 ${isLight ? 'text-white' : 'text-gray-950'}`}
      />
    </DisclosureButton>
  )
}

function MobileNav({
  isLight = false,
  showHomeShortcut = false,
}: {
  isLight?: boolean
  showHomeShortcut?: boolean
}) {
  const mobileLinks = showHomeShortcut
    ? [
        { href: '/', label: 'Home', iconOnly: true },
        ...links.map((item) => ({ ...item, iconOnly: false })),
      ]
    : links.map((item) => ({ ...item, iconOnly: false }))

  return (
    <DisclosurePanel className="xl:hidden">
      <div className="flex flex-col gap-6 py-4">
        {mobileLinks.map(({ href, label, iconOnly }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link
              href={href}
              aria-label={iconOnly ? 'Home' : undefined}
              className={`text-base font-medium ${isLight ? 'text-white' : 'text-gray-950'}`}
            >
              {iconOnly ? (
                <span className="inline-flex items-center">
                  <HomeIcon className="size-4" />
                </span>
              ) : (
                label
              )}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({
  banner,
  isLight = false,
}: {
  banner?: React.ReactNode
  isLight?: boolean
}) {
  const pathname = usePathname()
  const showHomeShortcut = pathname !== '/'

  return (
    <Disclosure as="header" className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex items-center justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="flex items-center py-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <Link href="/" title="Home" className="flex items-center">
                  <Logo isLight={isLight} />
                </Link>
                <span
                  aria-hidden="true"
                  className={`block h-5 w-px sm:h-8 ${isLight ? 'bg-white/30' : 'bg-gray-300'}`}
                />
                <a
                  href="https://www.kaist.ac.kr/en/"
                  target="_blank"
                  rel="noreferrer"
                  title="KAIST"
                  className="flex items-center"
                >
                  <span
                    className={`text-[15px] leading-none font-semibold tracking-wide sm:text-[17px] ${isLight ? 'text-white' : 'text-gray-950'}`}
                  >
                    KAIST
                  </span>
                </a>
              </div>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav isLight={isLight} showHomeShortcut={showHomeShortcut} />
          <MobileNavButton isLight={isLight} />
        </PlusGridRow>
      </PlusGrid>
      <MobileNav isLight={isLight} showHomeShortcut={showHomeShortcut} />
    </Disclosure>
  )
}
