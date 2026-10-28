import { site } from './site'

export interface NavChild {
  label: string
  href: string
  description?: string
  external?: boolean
}

export interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

// Top-level menu and its sub-menus. Sub-menu links jump to sections that carry
// matching ids, so keep these hashes in sync with the page sections.
export const navigation: NavItem[] = [
  {
    label: 'Research',
    href: '/research',
    children: [
      {
        label: 'Overview',
        href: '/research',
        description: 'How our three directions connect',
      },
      {
        label: 'Safety-critical embodied autonomy',
        href: '/research#safety',
        description: 'Risk perception, prediction and runtime safety',
      },
      {
        label: 'World models for embodied agents',
        href: '/research#world-models',
        description: 'Generative prediction and long-tail scenarios',
      },
      {
        label: 'Embodied foundation models & robot agents',
        href: '/research#agents',
        description: 'Agents that perceive, reason and act',
      },
      {
        label: 'Platforms & hardware',
        href: '/hardware',
        description: 'Vehicle, simulator and robots',
      },
    ],
  },
  {
    label: 'Publications',
    href: '/publications',
    children: [
      { label: 'Peer-reviewed publications', href: '/publications#publications' },
      { label: 'Preprints', href: '/publications#preprints' },
      { label: 'Google Scholar', href: site.scholar, external: true },
    ],
  },
  {
    label: 'People',
    href: '/team',
    children: [
      { label: 'Director', href: '/team#director' },
      { label: 'Research team', href: '/team#research-team' },
      { label: 'Visiting students & interns', href: '/team#visiting' },
    ],
  },
  {
    label: 'News',
    href: '/news',
    children: [
      { label: 'All news', href: '/news' },
      { label: 'Awards', href: '/news#awards' },
      { label: 'Lab life', href: '/photo' },
    ],
  },
  {
    label: 'Join',
    href: '/faq',
    children: [
      { label: 'Open positions', href: '/faq#positions' },
      { label: 'How to apply', href: '/faq#apply' },
      { label: 'FAQ', href: '/faq#faq' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

/** Top-level section a path belongs to, for highlighting the menu. */
export function sectionFor(pathname: string): string | undefined {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/hardware') return '/research'
  if (path === '/photo') return '/news'
  if (path.startsWith('/people')) return '/team'
  return navigation.find(
    (item) => path === item.href || path.startsWith(`${item.href}/`),
  )?.href
}
