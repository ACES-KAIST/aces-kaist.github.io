import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { site } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join',
  description:
    'Graduate study, research internships, visiting opportunities, and collaboration at ACES Lab, KAIST.',
}

const positions = [
  [
    'PhD and master’s students',
    'Applications for Fall 2027 admission are welcome. CSC-supported PhD applicants are especially welcome.',
  ],
  [
    'Research interns and research assistants',
    'Remote and on-site opportunities are available. Include your proposed dates and availability in your inquiry.',
  ],
  [
    'Visiting students and collaborators',
    'Describe the research problem you would like to work on and how it relates to the lab’s research.',
  ],
]
const questions = [
  [
    'What background is relevant?',
    'Relevant areas include machine learning, robotics, control, optimization, simulation, and data systems. Explain how your experience connects to a research question at ACES Lab.',
  ],
  [
    'Does an email replace the admissions application?',
    'No. PhD and master’s applicants must also follow the official KAIST admissions requirements and deadlines.',
  ],
  [
    'Does an inquiry guarantee a position?',
    'No. Opportunities depend on research fit, timing, and the type of position. Degree admission follows the official KAIST process.',
  ],
  [
    'What should I include in an inquiry?',
    'Send your CV, a short description of your research interests, and your intended start date or availability. Links to representative work are helpful.',
  ],
]

export default function Join() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Container className="pt-16 pb-24">
        <Heading as="h1" className="text-center">
          Join ACES Lab
        </Heading>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xl/8 text-gray-600">
          Work with us on safe autonomous systems, world models, and embodied
          intelligence.
        </p>
        <section className="mx-auto mt-16 max-w-3xl">
          <Subheading>Open positions</Subheading>
          <dl className="mt-8 space-y-8">
            {positions.map(([title, body]) => (
              <div key={title}>
                <dt className="text-lg font-semibold">{title}</dt>
                <dd className="mt-3 text-base/7 text-gray-600">{body}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="mx-auto mt-16 max-w-3xl border-t border-gray-200 pt-12">
          <Subheading>How to apply</Subheading>
          <p className="mt-4 text-base/7 text-gray-600">
            Email{' '}
            <a
              href={`mailto:${site.email}`}
              className="text-gray-950 underline underline-offset-4"
            >
              {site.email}
            </a>{' '}
            with your CV, research interests, and intended start date or
            availability.
          </p>
          <p className="mt-6 text-sm font-semibold">
            For Fall 2027 PhD and master’s applications
          </p>
          <p className="mt-2 text-base/7 break-words text-gray-600">
            [PhD / Master Fall 2027] Name — Current Institution
          </p>
          <p className="mt-6 text-sm font-semibold">
            For internships, research assistant roles, visits, and
            collaborations
          </p>
          <p className="mt-2 text-base/7 break-words text-gray-600">
            [Research Inquiry] Name — Position — Institution
          </p>
          <p className="mt-6 text-base/7 text-gray-600">
            See{' '}
            <a
              href="https://admission.kaist.ac.kr/"
              className="underline underline-offset-4"
            >
              KAIST Admissions
            </a>{' '}
            for degree application requirements and deadlines.
          </p>
        </section>
        <section className="mx-auto mt-20 max-w-3xl">
          <Heading as="h2">Frequently asked questions</Heading>
          <dl className="mt-10 space-y-10">
            {questions.map(([title, body]) => (
              <div key={title}>
                <dt className="text-base font-semibold">{title}</dt>
                <dd className="mt-4 text-base/7 text-gray-600">{body}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
      <Footer />
    </main>
  )
}
