import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading } from '@/components/text'
import { getPersonBySlug, getProfiledPeople, type Person } from '@/lib/people'
import { getPublicationsForPerson, type Publication } from '@/lib/publications'
import { assetPath } from '@/lib/site'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  return getProfiledPeople().map((person) => ({ slug: person.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const person = getPersonBySlug(slug)
  if (!person) return {}
  return {
    title: person.title,
    description:
      person.excerpt ||
      `${person.title} — ACES Lab, KAIST.`,
  }
}


function HomeIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function ScholarIcon() {
  return (
    <svg className="size-5" viewBox="0 0 384 512" fill="currentColor">
      <path d="M343.759 106.662V79.43l19.765-15.43H149.634L20.476 176.274h85.656c-.155 2.125-.219 4.046-.219 6.226 0 20.844 7.219 38.086 21.672 51.86 14.453 13.798 32.251 20.648 53.327 20.648 4.923 0 9.75-.368 14.438-1.024-2.907 6.5-4.375 12.523-4.375 18.142 0 9.875 4.5 20.43 13.467 31.642-39.233 2.67-68.061 9.733-86.437 21.163-10.531 6.5-19 14.704-25.39 24.531-6.391 9.9-9.578 20.515-9.578 31.962 0 9.648 2.062 18.336 6.219 26.062 4.157 7.726 9.578 14.07 16.312 18.984 6.718 4.968 14.469 9.1 23.219 12.469 8.734 3.344 17.406 5.718 26.061 7.062 8.627 1.343 17.205 1.999 25.706 1.999 13.469 0 26.953-1.734 40.547-5.187 13.562-3.485 26.28-8.642 38.171-15.493 11.86-6.805 21.516-16.086 28.922-27.718 7.39-11.68 11.095-24.805 11.095-39.336 0-11.016-2.25-21.039-6.75-30.141-4.469-9.072-9.938-16.541-16.453-22.344-6.501-5.813-13-11.155-19.515-15.968-6.501-4.845-12-9.75-16.469-14.813-4.485-5.047-6.734-10.054-6.734-14.984 0-4.921 1.734-9.672 5.216-14.265 3.454-4.61 7.674-9.048 12.61-13.306 4.937-4.25 9.875-8.968 14.796-14.133 4.922-5.147 9.141-11.827 12.61-20.008 3.485-8.18 5.203-17.445 5.203-27.757 0-13.453-2.547-24.46-7.547-33.313-.594-1.023-1.218-1.804-1.875-3.023l56.907-46.672v17.119c-7.393.93-6.624 5.346-6.624 10.635v128.667c0 5.958 4.875 10.834 10.834 10.834h3.989c5.958 0 10.834-4.876 10.834-10.834V117.293c0-5.277.777-9.688-6.562-10.63zM236.399 329.141c1.14.75 3.704 2.781 7.718 6.038 4.05 3.244 6.797 5.696 8.266 7.415 1.438 1.663 3.579 4.165 6.376 7.547 2.813 3.374 4.718 6.304 5.719 8.734 1 2.477 2.016 5.461 3.046 8.946.986 3.445 1.485 6.976 1.485 10.562 0 17.048-6.563 29.68-19.656 37.859-13.125 8.18-28.767 12.274-46.938 12.274-9.187 0-18.203-1.093-27.062-3.195-8.844-2.117-17.312-5.336-25.39-9.602-8.079-4.258-14.578-10.203-19.501-17.797-4.938-7.64-7.407-16.414-7.407-26.25 0-10.32 2.797-19.29 8.423-26.906 5.593-7.625 12.937-13.392 22.032-17.315 9.062-3.946 18.249-6.742 27.562-8.398 9.312-1.703 18.796-2.555 28.438-2.555 4.469 0 7.936.25 10.405.696.454.219 3.031 2.07 7.734 5.563 4.704 3.462 7.626 5.595 8.75 6.384zm-3.358-100.578c-7.406 8.86-17.735 13.288-30.954 13.288-11.859 0-22.297-4.765-31.265-14.312-9-9.523-15.423-20.328-19.344-32.43-3.938-12.11-5.906-23.985-5.906-35.649 0-13.694 3.595-25.352 10.781-34.976 7.187-9.65 17.499-14.485 30.938-14.485 11.875 0 22.374 5.038 31.437 15.157 9.094 10.085 15.61 21.413 19.517 33.968 3.922 12.539 5.873 24.53 5.873 35.984 0 13.447-3.703 24.61-11.077 33.455z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.523 2 12 2z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8h4.52v14H.24V8zm7.5 0h4.33v1.914h.062c.603-1.142 2.076-2.346 4.276-2.346 4.573 0 5.416 3.01 5.416 6.925V22h-4.52v-6.63c0-1.581-.028-3.615-2.203-3.615-2.204 0-2.541 1.723-2.541 3.503V22H7.74V8z" />
    </svg>
  )
}

function url(base: string, value: string): string {
  return value.startsWith('http') ? value : base + value
}

function ProfileLinks({ person }: { person: Person }) {
  const hasIcon =
    person.website || person.gscholar || person.github || person.linkedin
  if (!hasIcon && !person.email) return null
  return (
    <div className="mt-5">
      {hasIcon && (
        <div className="flex items-center gap-4 text-gray-400">
          {person.website && (
            <a href={url('https://', person.website)} target="_blank" rel="noreferrer" title="Homepage" className="hover:text-gray-700">
              <HomeIcon />
            </a>
          )}
          {person.gscholar && (
            <a href={`https://scholar.google.com/citations?user=${person.gscholar}`} target="_blank" rel="noreferrer" title="Google Scholar" className="hover:text-gray-700">
              <ScholarIcon />
            </a>
          )}
          {person.github && (
            <a href={url('https://github.com/', person.github)} target="_blank" rel="noreferrer" title="GitHub" className="hover:text-gray-700">
              <GithubIcon />
            </a>
          )}
          {person.linkedin && (
            <a href={url('https://www.linkedin.com/in/', person.linkedin)} target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-gray-700">
              <LinkedinIcon />
            </a>
          )}
        </div>
      )}
      {person.email && (
        <a href={`mailto:${person.email}`} className="mt-3 block break-all text-sm text-gray-500 hover:text-gray-800">{person.email}</a>
      )}
    </div>
  )
}

function PublicationsList({ publications }: { publications: Publication[] }) {
  if (publications.length === 0) return null

  // group by year, most recent first
  const byYear = new Map<number, Publication[]>()
  for (const pub of publications) {
    const year = pub.year ?? 0
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(pub)
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)

  return (
    <div className="mt-16">
      <Heading as="h2" className="!text-2xl sm:!text-3xl">
        Publications
      </Heading>
      <p className="mt-2 text-sm text-gray-500">
        {publications.length} publication{publications.length === 1 ? '' : 's'} ·{' '}
        <Link href="/publications/" className="underline underline-offset-2 hover:text-gray-800">
          all publications
        </Link>
      </p>
      <div className="mt-8 space-y-10">
        {years.map((year) => (
          <div key={year} className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[5rem_1fr]">
            <div className="text-sm font-semibold tracking-[0.16em] text-gray-400 uppercase sm:pt-0.5">
              {year || '—'}
            </div>
            <ol className="space-y-4">
              {byYear.get(year)!.map((pub) => (
                <li key={pub.key} className="text-base/7 text-gray-600">
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noreferrer"
                      className="decoration-gray-300 underline-offset-2 hover:text-gray-900 hover:underline"
                    >
                      {pub.citation}
                    </a>
                  ) : (
                    pub.citation
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const person = getPersonBySlug(slug)
  if (!person) notFound()

  const publications = getPublicationsForPerson(person)

  // Keep Email:/Phone: lines out of the rendered bio (shown as contacts instead).
  const bio = person.content
    .split(/\n\n+/)
    .filter((block) => !/^(Email|Phone):/i.test(block.trim()))
    .join('\n\n')
    .trim()

  const role = person.role

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>

      <Container className="mt-16">
        <Link href="/team" className="text-sm text-gray-500 hover:text-gray-800">
          ← Back to Team
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="aspect-square overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-black/10">
              <img
                alt={person.title}
                src={assetPath(person.img)}
                className="block size-full object-cover"
              />
            </div>
            <ProfileLinks person={person} />
          </div>

          <div className="lg:col-span-2">
            <Heading as="h1" className="!text-3xl sm:!text-4xl">
              {person.title}
            </Heading>
            {role && (
              <p className="mt-2 text-base text-gray-600">
                {role}

              </p>
            )}
            {person.joined && <p className="mt-1 text-sm text-gray-500">{person.joined}</p>}
            <hr className="mt-4 border-t border-gray-200" />
            {bio && (
              <div className="mt-6 text-base/7 text-gray-600 [&>*:first-child]:mt-0 [&_a]:font-medium [&_a]:text-gray-900 [&_a]:underline [&_a]:underline-offset-2 [&_h3]:mt-8 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:tracking-[0.16em] [&_h3]:text-gray-700 [&_h3]:uppercase [&_li]:mt-1 [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
                <Markdown remarkPlugins={[remarkGfm]}>{bio}</Markdown>
              </div>
            )}
          </div>
        </div>

        <PublicationsList publications={publications} />
      </Container>

      <Footer />
    </main>
  )
}
