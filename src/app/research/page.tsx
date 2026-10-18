import { Container } from '@/components/container'
import { EmbodiedAgentLoop } from '@/components/embodied-agent-loop'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { HashScroll } from '@/components/hash-scroll'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { assetPath } from '@/lib/site'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Research at ACES Lab: trustworthy safety-critical systems, foundation models and agents, and generative AI and world models.',
}

type Paper = { title: string; venue: string; year: string }

function ResearchSection({
  id,
  index,
  title,
  description,
  papers,
  graphic,
  dark = false,
  reverse = false,
}: {
  id: string
  index: number
  title: string
  description: ReactNode
  papers: Paper[]
  graphic: ReactNode
  dark?: boolean
  reverse?: boolean
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <Container className="py-24 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <figure className={reverse ? 'lg:order-2' : ''}>{graphic}</figure>
          <div className={reverse ? 'lg:order-1' : ''}>
            <Subheading as="div" dark={dark}>
              Research {index}
            </Subheading>
            <Heading
              as="h2"
              className="mt-2 !text-3xl sm:!text-5xl"
              dark={dark}
            >
              {title}
            </Heading>
            <div
              className={`mt-6 max-w-xl text-base/7 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {description}
            </div>
            <div className="mt-8 max-w-xl">
              <p
                className={`text-xs font-semibold tracking-[0.16em] uppercase ${dark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Selected publications
              </p>
              <ul className="mt-3 space-y-3">
                {papers.map((paper) => (
                  <li key={paper.title} className="flex gap-2 text-sm/5">
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      •
                    </span>
                    <span>
                      <Link
                        href="/publications"
                        className={`font-medium underline underline-offset-2 transition ${dark ? 'text-white decoration-gray-600 hover:decoration-white' : 'text-gray-900 decoration-gray-300 hover:decoration-gray-900'}`}
                      >
                        {paper.title}
                      </Link>
                      <span
                        className={dark ? 'text-gray-400' : 'text-gray-600'}
                      >
                        {' · '}
                        {paper.venue}, {paper.year}
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
            <p className="mt-6 max-w-3xl text-2xl font-medium text-gray-200">
              We study safe and adaptive autonomous systems for driving and
              robotics. Our work connects risk perception, generative models,
              and agents that reason and act under uncertainty.
            </p>
          </div>
        </div>
      </Container>

      <ResearchSection
        id="safety"
        index={1}
        title="Trustworthy safety-critical systems"
        description={
          <p>
            We study risk perception, decision-making, and runtime safety for
            autonomous systems. The goal is to identify dangerous situations and
            make safer decisions under uncertainty.
          </p>
        }
        papers={[
          {
            title:
              'REACT: Runtime-Enabled Active Collision-Avoidance Technique for Autonomous Driving',
            venue: 'Advanced Engineering Informatics',
            year: '2026',
          },
          {
            title:
              'RiskNet: Interaction-Aware Risk Forecasting for Autonomous Driving in Long-Tail Scenarios',
            venue:
              'Transportation Research Part E: Logistics and Transportation Review',
            year: '2026',
          },
        ]}
        graphic={
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
            {/* Source: https://huangheye.github.io/assets/publications/thumbs/lead.mp4 */}
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
          </div>
        }
      />

      <div
        className="bg-gray-900 py-8"
        style={{ backgroundImage: `url('${assetPath('/dot-texture.svg')}')` }}
      >
        <ResearchSection
          id="agents"
          index={2}
          title="Foundation models and agents"
          description={
            <p>
              We study how foundation models support perception, reasoning, and
              decision-making in driving and robotics. Our research includes
              agents that use memory and models of their environment to plan
              actions and adapt over time.
            </p>
          }
          papers={[
            {
              title:
                'SafeDrive: Knowledge-and Data-Driven Risk-Sensitive Decision-Making for Autonomous Vehicles with Large Language Models',
              venue: 'Accident Analysis & Prevention',
              year: '2025',
            },
            {
              title:
                'RESPOND: Risk-Enhanced Structured Pattern for LLM-driven Online Node-level Decision-making in Autonomous Driving',
              venue: 'Communications in Transportation Research',
              year: '2026',
            },
          ]}
          dark
          reverse
          graphic={
            <div className="aspect-[760/800]">
              <EmbodiedAgentLoop />
            </div>
          }
        />
      </div>

      <ResearchSection
        id="world-models"
        index={3}
        title="Generative AI and world models"
        description={
          <p>
            We use large language models, diffusion models, and multimodal
            models for prediction and scenario generation. We study how world
            models can produce realistic, controllable scenarios for
            simulation, evaluation, and training.
          </p>
        }
        papers={[
          {
            title:
              'Risk-Controllable Multi-View Diffusion for Driving Scenario Generation',
            venue: 'CVPR 2026 Workshop (VGBE)',
            year: '2026',
          },
          {
            title:
              'Learning from Risk: LLM-Guided Generation of Safety-Critical Scenarios with Prior Knowledge',
            venue:
              'Transportation Research Part E: Logistics and Transportation Review',
            year: '2026',
          },
        ]}
        graphic={
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
            <img
              src={assetPath(
                '/aces/publications/risk-controllable-diffusion.webp',
              )}
              alt="Risk-controllable multi-view diffusion for driving scenario generation."
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
        }
      />
      <Footer />
    </main>
  )
}
