import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { assetPath } from '@/lib/site'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Hardware',
  description: 'Unitree G1 Humanoid — ACES Lab.',
}

export default function Hardware() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Container className="mt-16">
        <div
          className="relative overflow-hidden rounded-4xl bg-gray-950 px-8 py-24 sm:px-16"
          style={{ backgroundImage: `url('${assetPath('/dot-texture.svg')}')` }}
        >
          <Subheading as="div" dark>
            Robotic platforms
          </Subheading>
          <Heading as="h1" className="mt-3" dark>
            Hardware
          </Heading>
          <p className="mt-6 max-w-3xl text-2xl font-medium text-gray-300">
            Robotic platforms for research on safe, adaptive autonomous systems.
          </p>
        </div>
      </Container>
      <Container className="py-24 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <figure className="lg:order-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10">
              {/* Replace public/hardware/humanoid.png with the lab's photograph. */}
              <Image
                src={assetPath('/hardware/humanoid.png')}
                alt="Unitree G1 humanoid robot; temporary reference photograph from Stanford ASL."
                fill
                className="object-cover transition duration-500 hover:scale-[1.03]"
                style={{ objectPosition: '60% center' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <figcaption className="mt-3 text-xs/5 text-gray-500">
              Temporary reference photo from{' '}
              <a
                href="https://stanfordasl.github.io/hardware/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                Stanford ASL
              </a>
              . An ACES Lab photo will replace this image.
            </figcaption>
          </figure>
          <div className="lg:order-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-gray-300">
                01
              </span>
              <Subheading as="div">Humanoid robotics</Subheading>
            </div>
            <Heading as="h2" className="mt-3 !text-3xl sm:!text-4xl">
              Unitree G1 Humanoid
            </Heading>
            <div className="mt-6 max-w-xl text-base/7 text-gray-600">
              <p>
                The Unitree G1 is a humanoid robot. It provides a platform for
                studying robot motion, whole-body control, and interaction with
                the physical environment.
              </p>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  )
}
