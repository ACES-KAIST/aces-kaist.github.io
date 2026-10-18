import { BentoCard } from '@/components/bento-card'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { ImageCarousel } from '@/components/image-carousel'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading } from '@/components/text'
import photos from '@/data/photos.json'
import { assetPath, site } from '@/lib/site'

const research = [
  {
    id: 'safety',
    title: 'Trustworthy safety-critical systems',
    summary: 'Risk perception and decision-making',
    description:
      'We study how autonomous systems assess risk, make decisions under uncertainty, and monitor safety during operation.',
    image: '/aces/publications/react.webp',
    alt: 'Research on collision avoidance for autonomous driving',
  },
  {
    id: 'world-models',
    title: 'Generative AI and world models',
    summary: 'Prediction and scenario generation',
    description:
      'We use language, diffusion, and multimodal models to predict behavior, reason about interactions, and generate rare driving scenarios.',
    image: '/aces/publications/risk-controllable-diffusion.webp',
    alt: 'Research on generating driving scenarios with diffusion models',
  },
  {
    id: 'agents',
    title: 'Foundation models and agents',
    summary: 'Memory and reasoning for embodied intelligence',
    description:
      'We study agents that use memory and models of their environment to support reasoning and decisions in driving and robotics.',
    image: '/aces/publications/safedrive.webp',
    alt: 'Research on language models for driving decisions',
  },
]

function Hero() {
  return (
    <div className="relative">
      <GradientBackground />
      <Container className="relative">
        <Navbar />
      </Container>
      <Container className="relative mt-16 pb-16">
        <div className="grid w-full grid-cols-1 items-center gap-12 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1.5fr)] xl:gap-8">
          <div className="relative z-10 min-w-0 text-center xl:text-left">
            <h1 className="font-display text-[clamp(2.25rem,5.8vw,5.5rem)] leading-[0.98] font-medium tracking-tight text-balance text-gray-950 xl:text-[clamp(3.25rem,4.4vw,4.25rem)]">
              {site.fullName}
            </h1>
            <p className="mx-auto mt-8 max-w-lg text-xl/7 font-medium text-gray-600 sm:text-2xl/8 xl:mx-0">
              Developing safe, adaptive autonomous systems for mobility and
              robotics.
            </p>
          </div>
          <div className="flex min-w-0 justify-center">
            <img
              src={assetPath('/aces/research-overview.png')}
              alt="ACES Lab research overview: theory and algorithms for autonomous vehicles, robots, and multi-agent systems"
              width={1408}
              height={580}
              className="block h-auto w-full max-w-none object-contain"
              fetchPriority="high"
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main className="py-16">
        <Container className="pb-24">
          <Heading as="h2" className="max-w-3xl">
            Research
          </Heading>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-3">
            {research.map((area) => (
              <Link key={area.id} href={`/research#${area.id}`}>
                <BentoCard
                  eyebrow={area.title}
                  title={area.summary}
                  description={area.description}
                  graphic={
                    <img
                      src={assetPath(area.image)}
                      alt={area.alt}
                      className="h-full w-full object-contain p-5"
                      loading="lazy"
                    />
                  }
                  className="h-full"
                />
              </Link>
            ))}
          </div>
        </Container>
        <Container className="pb-24">
          <Heading as="h2">News</Heading>
          <dl className="mt-10 divide-y divide-gray-200 text-base/7">
            <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr]">
              <dt className="text-gray-500">October 2026</dt>
              <dd>
                AnyHand-Agent from Benwang Chen received the first place in the
                poster presentation at the Nature Conference: Autonomous
                Robotics.
              </dd>
            </div>
            <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr]">
              <dt className="text-gray-500">August 2026</dt>
              <dd>
                CAPE-3D received the Best Presentation Award, and XMind received
                the Best Poster Award, at the IEEE CASE 2026 Workshop on
                Safety-Critical Robotics.
              </dd>
            </div>
            <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr]">
              <dt className="text-gray-500">June 2026</dt>
              <dd>
                Risk-Controllable Multi-View Diffusion for Driving Scenario
                Generation received the Best Paper Award at the CVPR 2026
                Workshop (VGBE).
              </dd>
            </div>
            <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr]">
              <dt className="text-gray-500">April 2026</dt>
              <dd>Heye Huang joined KAIST as an Assistant Professor.</dd>
            </div>
          </dl>
        </Container>
        <div className="overflow-hidden pb-16">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <Heading as="h2">Visual Memories</Heading>
              <Link
                href="/photo"
                className="shrink-0 text-sm font-medium underline underline-offset-4"
              >
                View photos &rarr;
              </Link>
            </div>
          </Container>
          <ImageCarousel images={photos.slice(0, 8)} className="mt-12 w-full" />
        </div>
      </main>
      <div className="bg-linear-to-b from-white from-50% to-gray-100">
        <Footer />
      </div>
    </div>
  )
}
