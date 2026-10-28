import { AnimatedNumber } from '@/components/animated-number'
import { Container } from '@/components/container'
import { Link } from '@/components/link'
import { CategoryChip, NewsCover, shortDate } from '@/components/news'
import { PhotoMarquee } from '@/components/photo-marquee'
import { ResearchCard } from '@/components/research-card'
import { Reveal } from '@/components/reveal'
import { FieldBackdrop } from '@/components/risk-field/backdrop'
import { RiskFieldHero } from '@/components/risk-field/hero'
import { SectionHeading, Subheading } from '@/components/text'
import { platforms } from '@/data/platforms'
import photos from '@/data/photos.json'
import publications from '@/data/publications.json'
import { researchAreas } from '@/data/research'
import { getNews } from '@/lib/news'
import { assetPath, site } from '@/lib/site'

function Hero() {
  return (
    <RiskFieldHero>
      <div className="flex flex-1 flex-col pt-32 pb-8 lg:justify-center lg:pt-24 lg:pb-28">
        <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.2em] text-signal uppercase">
            KAIST · {site.department}
          </p>
          <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] font-medium tracking-tight text-balance">
            {site.fullName}
          </h1>
          <p className="mt-6 max-w-xl text-lg/8 text-white/75 sm:text-xl/8">
            We build{' '}
            <strong className="font-semibold text-white">
              trustworthy embodied intelligence
            </strong>
            : autonomous vehicles and robots that perceive risk, anticipate how
            the world will change, and act safely among people.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-signal/10 transition hover:bg-signal"
            >
              Explore our research <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
            >
              Join ACES
            </Link>
          </div>
        </div>
        </Container>
      </div>
      <Container className="hidden pb-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
        <p className="font-mono text-[11px]/5 text-white/60">
          Move your pointer over the scene to join it.
        </p>
      </Container>
    </RiskFieldHero>
  )
}

function About() {
  const news = getNews()
  const awards2026 = news
    .filter((item) => item.date.startsWith('2026'))
    .reduce((total, item) => total + item.awards, 0)
  const stats = [
    { value: publications.length, label: 'Publications and preprints' },
    { value: researchAreas.length, label: 'Research directions' },
    { value: platforms.length, label: 'Research platforms' },
    { value: awards2026, label: 'Awards in 2026' },
  ]
  return (
    <section id="about" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <Subheading as="p">About ACES</Subheading>
            <p className="mt-6 text-2xl/10 font-medium tracking-tight text-balance text-gray-950 sm:text-[2rem]/[1.35]">
              Machines that act in the physical world have to understand{' '}
              <span className="text-brand-600">risk</span>,{' '}
              <span className="text-brand-600">the world around them</span>,
              and <span className="text-brand-600">the people they share it with</span>.
            </p>
            <p className="mt-8 max-w-2xl text-base/7 text-gray-600">
              ACES Lab is part of the {site.department} at {site.institution},
              led by{' '}
              <Link href="/team/heye-huang" className="font-medium text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950">
                {site.director}
              </Link>
              . We study how autonomous vehicles and robots can assess risk,
              model how their surroundings will change, and make decisions that
              stay safe and adaptive around people. Our work spans theory,
              learning methods, and experiments on vehicles, a driving
              simulator, and robots.
            </p>
          </Reveal>
          <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-2xl bg-gray-200 ring-1 ring-gray-200">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2 bg-white p-6 sm:p-8">
                <dt className="order-2 text-sm text-gray-600">{stat.label}</dt>
                <dd className="order-1 font-mono text-4xl font-medium tracking-tight text-gray-950 tabular-nums sm:text-5xl">
                  <AnimatedNumber start={0} end={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}

function Research() {
  return (
    <section id="research" className="scroll-mt-24 bg-gray-50 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Research"
          title="From perceiving risk to acting safely"
          lead={
            <>
              Our three directions form one loop of embodied intelligence:
              assess risk, predict how the world will change, and act in it. We
              study this loop on <strong>autonomous vehicles and robots</strong>.
            </>
          }
          action={
            <Link href="/research" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              All research →
            </Link>
          }
        />
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {researchAreas.map((area, index) => (
            <Reveal key={area.id} delay={index * 0.08}>
              <ResearchCard
                id={area.id}
                index={index + 1}
                title={area.title}
                summary={area.summary}
                keywords={area.keywords}
                image={area.image}
                video={'video' in area ? area.video : undefined}
                alt={area.alt}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Platforms() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
      <div className="absolute inset-0 -z-10 opacity-70">
        <FieldBackdrop className="size-full" />
      </div>
      <Container>
        <SectionHeading
          dark
          eyebrow="Embodied platforms"
          title="Where our methods meet the physical world"
          lead="We take ideas from simulation to an autonomous vehicle, a driving simulator, and humanoid and legged robots."
          action={
            <Link href="/hardware" className="text-sm font-medium text-signal hover:text-white">
              All platforms →
            </Link>
          }
        />
        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {platforms.map((platform, index) => (
            <li key={platform.id}>
              <Reveal delay={index * 0.06}>
                <Link
                  href={`/hardware#${platform.id}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-white/10"
                >
                  <img
                    src={assetPath(platform.image)}
                    alt={platform.alt}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                    style={'landscapeCrop' in platform ? { objectPosition: 'center 80%' } : undefined}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">
                      {platform.category}
                    </p>
                    <p className="mt-1.5 text-lg font-semibold tracking-tight">
                      {platform.title}
                    </p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function NewsAndPapers() {
  const news = getNews().slice(0, 3)
  const recent = publications
    .filter((item) => item.type === 'publication')
    .sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0))
    .slice(0, 5)
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="News"
              title="Latest from the lab"
              action={
                <Link href="/news" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  All news →
                </Link>
              }
            />
            <ul className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
              {news.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/news/${item.slug}`}
                    className="group grid grid-cols-[7rem_1fr] items-center gap-5 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6"
                  >
                    <NewsCover item={item} className="aspect-[16/10] rounded-lg ring-1 ring-black/5 [&_span]:hidden" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <time className="font-mono text-xs text-gray-500">{shortDate(item.date)}</time>
                        <CategoryChip category={item.category} />
                      </div>
                      <p className="mt-2 text-base/snug font-semibold tracking-tight text-gray-950 group-hover:text-brand-700">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Publications"
              title="Recent papers"
              action={
                <Link href="/publications" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  All publications →
                </Link>
              }
            />
            <ol className="mt-10 space-y-6">
              {recent.map((paper) => (
                <li key={paper.key} className="border-l-2 border-gray-200 pl-5 transition hover:border-brand-500">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[15px]/6 font-semibold tracking-tight text-gray-950 hover:text-brand-700"
                  >
                    {paper.title}
                  </a>
                  <p className="mt-1 text-sm/6 text-gray-500">
                    <span className="italic">{paper.venue}</span>, {paper.year}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}

function LabLife() {
  const strip = photos.filter((photo) => photo.width >= photo.height).slice(0, 14)
  return (
    <section className="overflow-hidden pb-24 sm:pb-32">
      <Container>
        <SectionHeading
          eyebrow="Lab life"
          title="Life at ACES"
          action={
            <Link href="/photo" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              All photos →
            </Link>
          }
        />
      </Container>
      <div className="mt-12">
        <PhotoMarquee photos={strip} />
      </div>
    </section>
  )
}

function Join() {
  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-navy-950 px-8 py-14 text-white sm:px-14 sm:py-16">
          <div className="absolute inset-0 -z-10">
            <FieldBackdrop className="size-full" />
          </div>
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Subheading as="p" dark>
                Join us
              </Subheading>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-balance sm:text-5xl">
                Build embodied intelligence with us
              </h2>
              <p className="mt-5 max-w-2xl text-lg/8 text-white/70">
                We welcome applications from PhD and master’s students for Fall
                2027, as well as research interns, research assistants, and
                visiting students.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                href="/faq#positions"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-signal"
              >
                Open positions <span aria-hidden="true">→</span>
              </Link>
              <p className="font-mono text-xs text-white/50">{site.email}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Research />
      <Platforms />
      <NewsAndPapers />
      <LabLife />
      <Join />
    </main>
  )
}
