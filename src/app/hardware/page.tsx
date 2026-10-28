import { Container } from '@/components/container'
import { PageHeader } from '@/components/page-header'
import { Reveal } from '@/components/reveal'
import { Heading, Subheading } from '@/components/text'
import { platforms } from '@/data/platforms'
import { assetPath } from '@/lib/site'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Hardware',
  description:
    'Robotic platforms, an autonomous vehicle, and a driving simulator at ACES Lab.',
}

export default function Hardware() {
  return (
    <main>
      <PageHeader
        eyebrow="Research · Platforms"
        title="Where our methods meet the physical world"
        lead={
          <>
            Platforms for research on <strong>embodied robotics</strong>,{' '}
            <strong>autonomous driving</strong>, and human behavior.
          </>
        }
        tabs={platforms.map((p) => ({ label: p.short, href: `#${p.id}` }))}
      />
      <Container className="py-20 sm:py-28">
        <div className="space-y-24 sm:space-y-32">
          {platforms.map((platform, index) => (
            <section
              key={platform.id}
              id={platform.id}
              className="grid scroll-mt-36 grid-cols-1 items-center gap-12 lg:grid-cols-2"
            >
              <Reveal className={index % 2 === 0 ? 'lg:order-2' : ''}>
                <figure
                  className={`overflow-hidden rounded-2xl bg-gray-50 shadow-xl ring-1 shadow-navy-950/10 ring-black/10 ${'landscapeCrop' in platform ? 'aspect-[3/2]' : ''}`}
                >
                  <Image
                    src={assetPath(platform.image)}
                    alt={platform.alt}
                    width={platform.width}
                    height={platform.height}
                    className={
                      'landscapeCrop' in platform
                        ? 'h-full w-full object-cover object-[center_80%]'
                        : 'h-auto w-full'
                    }
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </figure>
              </Reveal>
              <div className={index % 2 === 0 ? 'lg:order-1' : ''}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Subheading as="div">{platform.category}</Subheading>
                </div>
                <Heading as="h2" className="mt-3 !text-3xl sm:!text-4xl">
                  {platform.title}
                </Heading>
                <div className="mt-6 max-w-xl space-y-4 text-base/7 text-gray-600 [&_strong]:font-semibold [&_strong]:text-gray-900">
                  {platform.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
