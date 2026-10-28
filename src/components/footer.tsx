import { navigation } from '@/lib/navigation'
import { site } from '@/lib/site'
import { Container } from './container'
import { Link } from './link'
import { Logo } from './logo'

const elsewhere = [
  { label: 'KAIST', href: 'https://www.kaist.ac.kr/en/' },
  {
    label: 'Cho Chun Shik Graduate School of Mobility',
    href: 'https://mo.kaist.ac.kr/en/',
  },
  { label: 'Google Scholar', href: site.scholar },
  { label: `${site.director}’s homepage`, href: site.homepage },
]

function Column({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="font-mono text-[11px] tracking-[0.18em] text-white/45 uppercase">
        {title}
      </h2>
      <div className="mt-4 text-sm/6 text-white/70">{children}</div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(140,170,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(140,170,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <Container className="relative py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_1.1fr]">
          <div>
            <Logo className="h-16" />
            <p className="mt-6 max-w-xs text-sm/6 text-white/60">
              {site.department}, {site.institution}
            </p>
          </div>
          <Column title="Visit">
            <address className="not-italic">
              Room F335, Building F
              <br />
              KAIST Munji Campus
              <br />
              193 Munji-ro, Yuseong-gu
              <br />
              Daejeon 34051, South Korea
            </address>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-block text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              {site.email}
            </a>
          </Column>
          <Column title="Explore">
            <ul className="space-y-1.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>
          <Column title="Elsewhere">
            <ul className="space-y-1.5">
              {elsewhere.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Column>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 font-mono text-[11px] tracking-wide text-white/40 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}, {site.institution}
          </p>
          <p>Daejeon · 36.39° N, 127.40° E</p>
        </div>
      </Container>
    </footer>
  )
}
