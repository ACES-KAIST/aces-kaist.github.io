import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { site } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Visit ACES Lab at KAIST Munji Campus in Daejeon, South Korea.',
}

// Faculty office: https://mo.kaist.ac.kr/en/professor/heye-huang/
// Campus address: https://mo.kaist.ac.kr/en/graduate-school-introduction/map/
// Map location published by KAIST: https://kaist.ac.kr/en/html/kaist/01200202.html
const mapQuery = '36.391745125607855,127.39663440980239'
const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`

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
          Find us at KAIST Munji Campus in Daejeon, South Korea.
        </p>
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-10">
            <div>
              <Subheading>Address</Subheading>
              <p className="mt-3 text-base/7 text-gray-600">
                {site.fullName}
                <br />
                {site.department}
                <br />
                Building F, KAIST Munji Campus
                <br />
                193 Munji-ro, Yuseong-gu
                <br />
                Daejeon 34051, South Korea
              </p>
            </div>
            <div>
              <Subheading>Finding us</Subheading>
              <p className="mt-3 text-base/7 text-gray-600">
                Heye Huang&apos;s office is F337, on the third floor of Building
                F. Please email before your visit to confirm the meeting
                location.
              </p>
            </div>
            <div>
              <Subheading>Directions</Subheading>
              <p className="mt-3 text-base/7 text-gray-600">
                Use{' '}
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900"
                >
                  Google Maps
                </a>{' '}
                for directions to Munji Campus, or see the{' '}
                <a
                  href="https://mo.kaist.ac.kr/en/graduate-school-introduction/map/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900"
                >
                  school&apos;s campus map
                </a>
                .
              </p>
            </div>
            <div>
              <Subheading>Email</Subheading>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 inline-block text-base/7 text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900"
              >
                {site.email}
              </a>
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5">
              <div className="rounded-4xl p-2 shadow-md shadow-black/5">
                <div className="overflow-hidden rounded-3xl shadow-2xl outline outline-1 -outline-offset-1 outline-black/10">
                  <iframe
                    title="Map to KAIST Munji Campus in Daejeon"
                    width="100%"
                    height="480"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`${mapUrl}&z=16&output=embed`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  )
}
