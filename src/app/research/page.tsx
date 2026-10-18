import { Container } from '@/components/container'
import { EmbodiedAgentLoop } from '@/components/embodied-agent-loop'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { HashScroll } from '@/components/hash-scroll'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import publications from '@/data/publications.json'
import { researchAreas } from '@/data/research'
import { assetPath } from '@/lib/site'
import type { Metadata } from 'next'
import Link from 'next/link'

type ResearchArea = (typeof researchAreas)[number]

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Research at ACES Lab: trustworthy safety-critical systems, generative AI and world models, and foundation models and agents.',
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
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
      {area.id === 'safety' ? (
        <video
          src={`${assetPath('/aces/research/lead.mp4')}#t=8`}
          poster={assetPath('/aces/publications/lead.webp')}
          aria-label="LEAD: adaptive decision-making for autonomous driving in dynamic environments."
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
          alt="Risk-controllable multi-view diffusion for driving scenario generation."
          width={1200}
          height={425}
          className="h-auto w-full"
          loading="lazy"
        />
      )}
    </div>
  )
}

function ResearchSection({
  area,
  index,
}: {
  area: ResearchArea
  index: number
}) {
  const reverse = index % 2 === 0
  const papers = area.paperKeys.map((key) => {
    const paper = publications.find((entry) => entry.key === key)
    if (!paper) throw new Error(`Missing selected publication: ${key}`)
    return paper
  })

  return (
    <section id={area.id} className="scroll-mt-8 bg-white">
      <Container className="py-20 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <figure className={reverse ? 'lg:order-2' : ''}>
            <ResearchGraphic area={area} />
          </figure>
          <div className={reverse ? 'lg:order-1' : ''}>
            <Subheading as="div">Research 0{index}</Subheading>
            <h2 className="mt-3 text-3xl/tight font-semibold tracking-tight text-gray-950 sm:text-5xl/tight">
              {area.title}
            </h2>
            <div className="mt-6 space-y-5 text-base/7 text-gray-600 [&_strong]:font-semibold [&_strong]:text-gray-900">
              {area.description}
            </div>
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-gray-700 uppercase">
                Selected publications
              </p>
              <ul className="mt-3 space-y-3">
                {papers.map((paper) => (
                  <li key={paper.key} className="flex gap-2 text-sm/5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-gray-400"
                    >
                      •
                    </span>
                    <span>
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 transition hover:decoration-gray-900"
                      >
                        {paper.title}
                      </a>
                      <span className="text-gray-600">
                        {' '}
                        · {paper.venue}, {paper.year}
                      </span>
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
    <main className="overflow-hidden">
      <HashScroll />
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Container className="mt-16">
        <div
          className="relative overflow-hidden rounded-4xl bg-cover"
          style={{
            backgroundImage: `url('${assetPath('/visual-highlights/2.jpg')}')`,
            backgroundPosition: 'center 40%',
          }}
        >
          <div className="absolute inset-0 bg-gray-950/60" />
          <div className="relative px-8 py-24 sm:px-16">
            <Heading as="h1" dark>
              Research
            </Heading>
            <p className="mt-6 max-w-3xl text-xl/8 text-gray-200 sm:text-2xl/9">
              We develop{' '}
              <strong className="font-semibold text-white">
                safe, adaptive, and trustworthy autonomous systems
              </strong>{' '}
              for mobility and robotics. Our research connects safety,
              prediction, and decision-making to help these systems reason under
              uncertainty and operate in real-world environments.
            </p>
          </div>
        </div>
        <nav
          aria-label="Research directions"
          className="mt-8 grid gap-4 lg:grid-cols-3"
        >
          {researchAreas.map((area, index) => (
            <Link
              key={area.id}
              href={`#${area.id}`}
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400"
            >
              <span className="pt-0.5 font-mono text-sm text-gray-500">
                0{index + 1}
              </span>
              <span className="text-lg/6 font-semibold text-gray-950">
                {area.title}
              </span>
            </Link>
          ))}
        </nav>
      </Container>
      <div className="mt-8 divide-y divide-gray-200">
        {researchAreas.map((area, index) => (
          <ResearchSection key={area.id} area={area} index={index + 1} />
        ))}
      </div>
      <Footer />
    </main>
  )
}
