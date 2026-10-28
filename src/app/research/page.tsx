import { Container } from '@/components/container'
import { EmbodiedAgentLoop } from '@/components/embodied-agent-loop'
import { HashScroll } from '@/components/hash-scroll'
import { Link } from '@/components/link'
import { PageHeader } from '@/components/page-header'
import { ResearchLoop } from '@/components/research-loop'
import { Reveal } from '@/components/reveal'
import { Subheading } from '@/components/text'
import publications from '@/data/publications.json'
import {
  researchAreas,
  researchIntro,
  researchLoop,
  type ResearchArea,
} from '@/data/research'
import { assetPath } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Research at ACES Lab: safety-critical embodied autonomy, world models for embodied agents, and embodied foundation models and robot agents.',
}

function ResearchGraphic({ area }: { area: ResearchArea }) {
  if (area.id === 'agents') {
    return (
      <div className="aspect-[760/800]">
        <EmbodiedAgentLoop />
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 shadow-navy-950/10 ring-black/10">
      {'video' in area ? (
        <video
          src={`${assetPath(area.video)}#t=8`}
          poster={assetPath(area.image)}
          aria-label={area.alt}
          width={620}
          height={368}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-auto w-full"
        />
      ) : (
        <img
          src={assetPath(area.image)}
          alt={area.alt}
          width={1200}
          height={425}
          className="h-auto w-full"
          loading="lazy"
        />
      )}
    </div>
  )
}

function ResearchSection({ area, index }: { area: ResearchArea; index: number }) {
  const reverse = index % 2 === 0
  const papers = area.paperKeys.map((key) => {
    const paper = publications.find((entry) => entry.key === key)
    if (!paper) throw new Error(`Missing selected publication: ${key}`)
    return paper
  })

  return (
    <section id={area.id} className="scroll-mt-32 even:bg-gray-50">
      <Container className="py-20 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className={reverse ? 'lg:order-2' : ''}>
            <figure>
              <ResearchGraphic area={area} />
            </figure>
          </Reveal>
          <div className={reverse ? 'lg:order-1' : ''}>
            <Subheading as="div">Research 0{index}</Subheading>
            <h2 className="mt-3 text-3xl/tight font-medium tracking-tight text-balance text-gray-950 sm:text-5xl/[1.1]">
              {area.title}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {area.keywords.map((keyword) => (
                <li
                  key={keyword}
                  className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100 ring-inset"
                >
                  {keyword}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-5 text-base/7 text-gray-600 [&_strong]:font-semibold [&_strong]:text-gray-900">
              {area.description}
            </div>
            <div className="mt-8 rounded-xl bg-white p-5 ring-1 ring-gray-200">
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-gray-500 uppercase">
                Selected publications
              </p>
              <ul className="mt-3 space-y-3">
                {papers.map((paper) => (
                  <li key={paper.key} className="text-sm/5">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 transition hover:decoration-gray-900"
                    >
                      {paper.title}
                    </a>
                    <span className="text-gray-500">
                      {' '}
                      · {paper.venue}, {paper.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function Research() {
  return (
    <main>
      <HashScroll />
      <PageHeader
        eyebrow="Research"
        title={researchIntro.title}
        lead={researchIntro.lead}
        image="/visual-highlights/2.jpg"
        imagePosition="center 40%"
        tabs={[
          ...researchAreas.map((area, index) => ({
            index: `0${index + 1}`,
            label: area.short,
            href: `#${area.id}`,
          })),
          { label: 'Platforms', href: '/hardware' },
        ]}
      />
      <section className="border-b border-gray-200 py-20 sm:py-28">
        <Container>
          <ResearchLoop
            steps={researchLoop.map((step, index) => ({
              ...step,
              title: researchAreas[index].title,
            }))}
          />
        </Container>
      </section>
      {researchAreas.map((area, index) => (
        <ResearchSection key={area.id} area={area} index={index + 1} />
      ))}
      <section className="bg-navy-950 py-16 text-white">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xl/8 text-white/80">
            See the vehicles, simulator, and robots we work with, or browse the
            full publication list.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hardware"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-950 hover:bg-signal"
            >
              Platforms →
            </Link>
            <Link
              href="/publications"
              className="rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/10"
            >
              Publications
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
