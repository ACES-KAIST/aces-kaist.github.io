import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { site } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact ACES Lab at KAIST for research inquiries, applications, and visits.',
}

export default function Contact() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Container className="mt-16 pb-24">
        <Heading as="h1">Contact Us</Heading>
        <p className="mt-6 max-w-3xl text-2xl font-medium text-gray-500">
          For research inquiries, applications, and visits, contact Heye Huang.
        </p>
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-10">
            <div>
              <Subheading>ACES Lab</Subheading>
              <p className="mt-3 text-base/7 text-gray-600">
                {site.fullName}
                <br />
                {site.department}
                <br />
                KAIST, South Korea
              </p>
            </div>
            <div>
              <Subheading>Email</Subheading>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 inline-block text-base/7 underline underline-offset-4"
              >
                {site.email}
              </a>
            </div>
            <div>
              <Subheading>Visiting the lab</Subheading>
              <p className="mt-3 text-base/7 text-gray-600">
                Please email Heye Huang to arrange a visit and confirm the
                meeting location.
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-gray-50 p-8 ring-1 ring-black/5 sm:p-10">
            <Subheading>Join ACES Lab</Subheading>
            <p className="mt-4 text-base/7 text-gray-600">
              We welcome inquiries from prospective graduate students, research
              interns, research assistants, visiting students, and
              collaborators.
            </p>
            <p className="mt-4 text-base/7 text-gray-600">
              Include your CV, research interests, and intended start date or
              availability.
            </p>
            <Link
              href="/faq"
              className="mt-6 inline-block font-medium underline underline-offset-4"
            >
              View open positions &rarr;
            </Link>
            <div className="mt-10 border-t border-gray-200 pt-6">
              <a
                href="https://mo.kaist.ac.kr/en/"
                className="text-sm underline underline-offset-4"
              >
                Cho Chun Shik Graduate School of Mobility
              </a>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  )
}
