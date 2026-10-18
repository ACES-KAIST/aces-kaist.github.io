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
  description:
    'Robotic platforms, an autonomous vehicle, and a driving simulator at ACES Lab.',
}

const platforms = [
  {
    title: 'Unitree G1 Humanoid',
    category: 'Humanoid robotics',
    image: '/hardware/humanoid.png',
    alt: 'Unitree G1 humanoid robot photographed outdoors.',
    width: 1206,
    height: 807,
    paragraphs: [
      <>
        The Unitree G1 is a humanoid robot designed for coordinated movement of
        its arms, legs, and torso. Its range of joint motion supports research
        on <strong>balance, locomotion, and whole-body control</strong>. A depth
        camera and 3D LiDAR provide information about the surrounding
        environment.
      </>,
      <>
        The platform supports the study of{' '}
        <strong>imitation learning and reinforcement learning</strong> for robot
        motion. It also provides a setting for testing how learned policies
        respond to <strong>physical constraints</strong>, such as joint limits,
        balance, and contact with objects. These questions connect robot
        learning with safe operation in the physical world.
      </>,
    ],
  },
  {
    title: 'Unitree Go2 Quadruped',
    category: 'Legged robotics',
    image: '/hardware/unitree-go2.webp',
    alt: 'Unitree Go2 quadruped robot standing on a paved outdoor surface.',
    width: 1200,
    height: 1600,
    landscapeCrop: true,
    paragraphs: [
      <>
        The Unitree Go2 is a quadruped robot for studying{' '}
        <strong>legged locomotion and navigation</strong>. Its articulated legs
        allow it to move over uneven surfaces, while a wide-angle camera and
        LiDAR provide information about nearby obstacles.
      </>,
      <>
        Quadruped robots provide a platform for evaluating{' '}
        <strong>learned control policies</strong> beyond simulation. Research
        questions include maintaining balance, planning paths around obstacles,
        and monitoring safety as terrain and sensor observations change. These
        tasks connect <strong>perception, planning, and control</strong> in a
        physical system.
      </>,
    ],
  },
  {
    title: 'Autonomous Vehicle',
    category: 'Autonomous driving',
    image: '/hardware/autonomous-vehicle.webp',
    alt: 'White autonomous vehicle with roof-mounted sensors, photographed indoors.',
    width: 1410,
    height: 918,
    paragraphs: [
      <>
        An autonomous vehicle brings{' '}
        <strong>sensing, prediction, planning, and control</strong> together on
        a physical platform. Sensors observe the surroundings, while the driving
        system uses these observations to plan and control vehicle motion.
      </>,
      <>
        Vehicle research examines how these components work together under{' '}
        <strong>uncertainty</strong>. Key questions include responding to other
        road users, adapting to changing conditions, and{' '}
        <strong>maintaining safety</strong> when observations or predictions are
        incomplete.
      </>,
    ],
  },
  {
    title: 'Driving Simulator',
    category: 'Driving simulation',
    image: '/hardware/driving-simulator.webp',
    alt: 'Driving simulator with a cockpit, steering wheel, pedals, and a wide display showing a road scene.',
    width: 1440,
    height: 988,
    paragraphs: [
      <>
        The driving simulator combines a cockpit with steering controls, pedals,
        and a wide visual display. It provides a controlled setting for
        examining <strong>driving behavior</strong> and{' '}
        <strong>interaction between people and automated systems</strong>.
      </>,
      <>
        Simulation makes it possible to study road situations without exposing
        participants to traffic. It supports research on how drivers{' '}
        <strong>perceive risk</strong>, <strong>make decisions</strong>, and
        respond to the behavior of surrounding vehicles.
      </>,
    ],
  },
]

export default function Hardware() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Container className="mt-16">
        <div className="relative overflow-hidden rounded-4xl bg-gray-50 px-8 py-24 ring-1 ring-black/5 sm:px-16">
          <Subheading as="div">Research platforms</Subheading>
          <Heading as="h1" className="mt-3">
            Hardware
          </Heading>
          <p className="mt-6 max-w-3xl text-2xl font-medium text-gray-500">
            Platforms for research on robotics, autonomous driving, and human
            behavior.
          </p>
        </div>
      </Container>
      <Container className="py-24 sm:py-28">
        <div className="space-y-24 sm:space-y-28">
          {platforms.map((platform, index) => (
            <section
              key={platform.title}
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
            >
              <figure className={index % 2 === 0 ? 'lg:order-2' : ''}>
                <div
                  className={`overflow-hidden rounded-2xl bg-gray-50 shadow-lg ring-1 ring-black/10 ${platform.landscapeCrop ? 'aspect-[3/2]' : ''}`}
                >
                  <Image
                    src={assetPath(platform.image)}
                    alt={platform.alt}
                    width={platform.width}
                    height={platform.height}
                    className={
                      platform.landscapeCrop
                        ? 'h-full w-full object-cover object-[center_80%]'
                        : 'h-auto w-full'
                    }
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </figure>
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
                <div className="mt-6 max-w-xl space-y-4 text-base/7 text-gray-600">
                  {platform.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </Container>
      <Footer />
    </main>
  )
}
