import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import {
  getAlumni,
  getExternalAffiliates,
  getFaculty,
  getResearchTeam,
  getStaff,
  getVisiting,
  type Person,
} from '@/lib/people'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team',
  description:
    'Meet the researchers and staff of the Autonomous Systems Lab at Stanford University.',
}

function Director() {
  const faculty = getFaculty()

  return (
    <Container className="mt-16">
      <Heading as="h1" className="mt-2">
        Director
      </Heading>
      {faculty.map((person) => (
        <div key={person.slug} className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Link href={`/team/${person.slug}`} className="block aspect-square overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-black/10">
              <img
                alt={person.title}
                src={`/_people/people-imgs/${person.img}`}
                className="block size-full object-cover"
              />
            </Link>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-medium tracking-tight">
              <Link href={`/team/${person.slug}`} className="hover:text-gray-600">
                {person.title}
              </Link>
            </h3>
            <hr className="mt-4 border-t border-gray-200" />
            <div className="mt-6 text-base/6 text-gray-600 space-y-3">
              {person.content
                .split(/\n\n+/)
                .filter((line) => !/^(Email:|Phone:)/i.test(line.trim()))
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
            {/* Contact — icons + plain text (no mailto to avoid scrapers) */}
            <div className="mt-5 flex flex-col gap-2 text-sm text-gray-500">
              {(() => {
                const emailLine = person.content.split(/\n\n+/).find((l) => /^Email:/i.test(l.trim()))
                if (!emailLine) return null
                const addr = emailLine.replace(/^Email:\s*/i, '').trim()
                return (
                  <span className="inline-flex items-center gap-2">
                    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    {addr}
                  </span>
                )
              })()}
              {(() => {
                const phoneLine = person.content.split(/\n\n+/).find((l) => /^Phone:/i.test(l.trim()))
                if (!phoneLine) return null
                const num = phoneLine.replace(/^Phone:\s*/i, '').trim()
                return (
                  <span className="inline-flex items-center gap-2">
                    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {num}
                  </span>
                )
              })()}
            </div>
            {/* Homepage + Google Scholar — same icon set the students' cards show */}
            {(person.website || person.gscholar) && (
              <div className="mt-4 flex items-center gap-3">
                {person.website && (
                  <a href={person.website} title="Homepage" className="text-gray-400 hover:text-gray-600">
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </a>
                )}
                {person.gscholar && (
                  <a href={`https://scholar.google.com/citations?user=${person.gscholar}`} title="Google Scholar" className="text-gray-400 hover:text-gray-600">
                    <svg className="size-5" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M343.759 106.662V79.43l19.765-15.43H149.634L20.476 176.274h85.656c-.155 2.125-.219 4.046-.219 6.226 0 20.844 7.219 38.086 21.672 51.86 14.453 13.798 32.251 20.648 53.327 20.648 4.923 0 9.75-.368 14.438-1.024-2.907 6.5-4.375 12.523-4.375 18.142 0 9.875 4.5 20.43 13.467 31.642-39.233 2.67-68.061 9.733-86.437 21.163-10.531 6.5-19 14.704-25.39 24.531-6.391 9.9-9.578 20.515-9.578 31.962 0 9.648 2.062 18.336 6.219 26.062 4.157 7.726 9.578 14.07 16.312 18.984 6.718 4.968 14.469 9.1 23.219 12.469 8.734 3.344 17.406 5.718 26.061 7.062 8.627 1.343 17.205 1.999 25.706 1.999 13.469 0 26.953-1.734 40.547-5.187 13.562-3.485 26.28-8.642 38.171-15.493 11.86-6.805 21.516-16.086 28.922-27.718 7.39-11.68 11.095-24.805 11.095-39.336 0-11.016-2.25-21.039-6.75-30.141-4.469-9.072-9.938-16.541-16.453-22.344-6.501-5.813-13-11.155-19.515-15.968-6.501-4.845-12-9.75-16.469-14.813-4.485-5.047-6.734-10.054-6.734-14.984 0-4.921 1.734-9.672 5.216-14.265 3.454-4.61 7.674-9.048 12.61-13.306 4.937-4.25 9.875-8.968 14.796-14.133 4.922-5.147 9.141-11.827 12.61-20.008 3.485-8.18 5.203-17.445 5.203-27.757 0-13.453-2.547-24.46-7.547-33.313-.594-1.023-1.218-1.804-1.875-3.023l56.907-46.672v17.119c-7.393.93-6.624 5.346-6.624 10.635v128.667c0 5.958 4.875 10.834 10.834 10.834h3.989c5.958 0 10.834-4.876 10.834-10.834V117.293c0-5.277.777-9.688-6.562-10.63zM236.399 329.141c1.14.75 3.704 2.781 7.718 6.038 4.05 3.244 6.797 5.696 8.266 7.415 1.438 1.663 3.579 4.165 6.376 7.547 2.813 3.374 4.718 6.304 5.719 8.734 1 2.477 2.016 5.461 3.046 8.946.986 3.445 1.485 6.976 1.485 10.562 0 17.048-6.563 29.68-19.656 37.859-13.125 8.18-28.767 12.274-46.938 12.274-9.187 0-18.203-1.093-27.062-3.195-8.844-2.117-17.312-5.336-25.39-9.602-8.079-4.258-14.578-10.203-19.501-17.797-4.938-7.64-7.407-16.414-7.407-26.25 0-10.32 2.797-19.29 8.423-26.906 5.593-7.625 12.937-13.392 22.032-17.315 9.062-3.946 18.249-6.742 27.562-8.398 9.312-1.703 18.796-2.555 28.438-2.555 4.469 0 7.936.25 10.405.696.454.219 3.031 2.07 7.734 5.563 4.704 3.462 7.626 5.595 8.75 6.384zm-3.358-100.578c-7.406 8.86-17.735 13.288-30.954 13.288-11.859 0-22.297-4.765-31.265-14.312-9-9.523-15.423-20.328-19.344-32.43-3.938-12.11-5.906-23.985-5.906-35.649 0-13.694 3.595-25.352 10.781-34.976 7.187-9.65 17.499-14.485 30.938-14.485 11.875 0 22.374 5.038 31.437 15.157 9.094 10.085 15.61 21.413 19.517 33.968 3.922 12.539 5.873 24.53 5.873 35.984 0 13.447-3.703 24.61-11.077 33.455z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </Container>
  )
}

function PersonCard({ person }: { person: Person }) {
  return (
    <li className="overflow-hidden rounded-2xl bg-white/80 ring-1 ring-black/5">
            <Link href={`/team/${person.slug}`} className="block aspect-square w-full">
              <img
                alt={person.title}
                src={`/_people/people-imgs/${person.img}`}
                className="block size-full object-cover"
              />
            </Link>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    <Link href={`/team/${person.slug}`} className="hover:text-gray-600">
                      {person.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">
                    {person.position === 'phd'
                      ? 'PhD Student'
                      : 'Postdoctoral Scholar'}
                  </p>
                </div>
                {(person.website || person.gscholar) && (
                  <div className="flex shrink-0 items-center gap-2 pt-0.5">
                    {person.website && (
                      <a href={person.website} title="Homepage" className="text-gray-400 hover:text-gray-600">
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </a>
                    )}
                    {person.gscholar && (
                      <a href={`https://scholar.google.com/citations?user=${person.gscholar}`} title="Google Scholar" className="text-gray-400 hover:text-gray-600">
                        <svg className="size-4" viewBox="0 0 384 512" fill="currentColor">
                          <path d="M343.759 106.662V79.43l19.765-15.43H149.634L20.476 176.274h85.656c-.155 2.125-.219 4.046-.219 6.226 0 20.844 7.219 38.086 21.672 51.86 14.453 13.798 32.251 20.648 53.327 20.648 4.923 0 9.75-.368 14.438-1.024-2.907 6.5-4.375 12.523-4.375 18.142 0 9.875 4.5 20.43 13.467 31.642-39.233 2.67-68.061 9.733-86.437 21.163-10.531 6.5-19 14.704-25.39 24.531-6.391 9.9-9.578 20.515-9.578 31.962 0 9.648 2.062 18.336 6.219 26.062 4.157 7.726 9.578 14.07 16.312 18.984 6.718 4.968 14.469 9.1 23.219 12.469 8.734 3.344 17.406 5.718 26.061 7.062 8.627 1.343 17.205 1.999 25.706 1.999 13.469 0 26.953-1.734 40.547-5.187 13.562-3.485 26.28-8.642 38.171-15.493 11.86-6.805 21.516-16.086 28.922-27.718 7.39-11.68 11.095-24.805 11.095-39.336 0-11.016-2.25-21.039-6.75-30.141-4.469-9.072-9.938-16.541-16.453-22.344-6.501-5.813-13-11.155-19.515-15.968-6.501-4.845-12-9.75-16.469-14.813-4.485-5.047-6.734-10.054-6.734-14.984 0-4.921 1.734-9.672 5.216-14.265 3.454-4.61 7.674-9.048 12.61-13.306 4.937-4.25 9.875-8.968 14.796-14.133 4.922-5.147 9.141-11.827 12.61-20.008 3.485-8.18 5.203-17.445 5.203-27.757 0-13.453-2.547-24.46-7.547-33.313-.594-1.023-1.218-1.804-1.875-3.023l56.907-46.672v17.119c-7.393.93-6.624 5.346-6.624 10.635v128.667c0 5.958 4.875 10.834 10.834 10.834h3.989c5.958 0 10.834-4.876 10.834-10.834V117.293c0-5.277.777-9.688-6.562-10.63zM236.399 329.141c1.14.75 3.704 2.781 7.718 6.038 4.05 3.244 6.797 5.696 8.266 7.415 1.438 1.663 3.579 4.165 6.376 7.547 2.813 3.374 4.718 6.304 5.719 8.734 1 2.477 2.016 5.461 3.046 8.946.986 3.445 1.485 6.976 1.485 10.562 0 17.048-6.563 29.68-19.656 37.859-13.125 8.18-28.767 12.274-46.938 12.274-9.187 0-18.203-1.093-27.062-3.195-8.844-2.117-17.312-5.336-25.39-9.602-8.079-4.258-14.578-10.203-19.501-17.797-4.938-7.64-7.407-16.414-7.407-26.25 0-10.32 2.797-19.29 8.423-26.906 5.593-7.625 12.937-13.392 22.032-17.315 9.062-3.946 18.249-6.742 27.562-8.398 9.312-1.703 18.796-2.555 28.438-2.555 4.469 0 7.936.25 10.405.696.454.219 3.031 2.07 7.734 5.563 4.704 3.462 7.626 5.595 8.75 6.384zm-3.358-100.578c-7.406 8.86-17.735 13.288-30.954 13.288-11.859 0-22.297-4.765-31.265-14.312-9-9.523-15.423-20.328-19.344-32.43-3.938-12.11-5.906-23.985-5.906-35.649 0-13.694 3.595-25.352 10.781-34.976 7.187-9.65 17.499-14.485 30.938-14.485 11.875 0 22.374 5.038 31.437 15.157 9.094 10.085 15.61 21.413 19.517 33.968 3.922 12.539 5.873 24.53 5.873 35.984 0 13.447-3.703 24.61-11.077 33.455z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
              {person.excerpt && (
                <p className="mt-3 text-base/6 text-gray-500">{person.excerpt}</p>
              )}
            </div>
    </li>
  )
}

function ResearchTeam() {
  const team = getResearchTeam()
  const byLast = (a: Person, b: Person) => a.last.localeCompare(b.last)
  const postdocs = team.filter((p) => p.position === 'postdoc').sort(byLast)
  const phds = team.filter((p) => p.position === 'phd').sort(byLast)

  return (
    <Container className="mt-24">
      <Heading as="h3" className="mt-2">
        Research Team
      </Heading>

      {postdocs.length > 0 && (
        <>
          <div className="mt-12 mb-8 flex items-center gap-4">
            <Subheading>Postdoctoral Scholars</Subheading>
            <div className="h-px grow bg-gray-200" />
          </div>
          <ul role="list" className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {postdocs.map((person) => (
              <PersonCard key={person.slug} person={person} />
            ))}
          </ul>
        </>
      )}

      {phds.length > 0 && (
        <>
          <div className="mt-16 mb-8 flex items-center gap-4">
            <Subheading>PhD Students</Subheading>
            <div className="h-px grow bg-gray-200" />
          </div>
          <ul role="list" className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {phds.map((person) => (
              <PersonCard key={person.slug} person={person} />
            ))}
          </ul>
        </>
      )}
    </Container>
  )
}

function ExternalAffiliates() {
  const affiliates = getExternalAffiliates()

  return (
    <Container className="mt-24">
      <Heading as="h3" className="mt-2">
        External Research Affiliates
      </Heading>
      <ul
        role="list"
        className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4"
      >
        {affiliates.map((person) => (
          <li key={person.slug} className="overflow-hidden rounded-2xl bg-white/80 ring-1 ring-black/5">
            <Link href={`/team/${person.slug}`} className="block aspect-square w-full">
              <img
                alt={person.title}
                src={`/_people/people-imgs/${person.img}`}
                className="block size-full object-cover"
              />
            </Link>
            <div className="p-4">
              <h3 className="text-base font-semibold tracking-tight">
                <Link href={`/team/${person.slug}`} className="hover:text-gray-600">
                  {person.title}
                </Link>
              </h3>
              {person.current && (
                <p className="text-sm text-gray-600">{person.current}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}

function Staff() {
  const staff = getStaff()

  return (
    <Container className="mt-24">
      <Heading as="h3" className="mt-2">
        Staff
      </Heading>
      <ul
        role="list"
        className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4"
      >
        {staff.map((person) => (
          <li key={person.slug} className="overflow-hidden rounded-2xl bg-white/80 ring-1 ring-black/5">
            <Link href={`/team/${person.slug}`} className="block aspect-square w-full">
              <img
                alt={person.title}
                src={`/_people/people-imgs/${person.img}`}
                className="block size-full object-cover"
              />
            </Link>
            <div className="p-4">
              <h3 className="text-base font-semibold tracking-tight">
                <Link href={`/team/${person.slug}`} className="hover:text-gray-600">
                  {person.title}
                </Link>
              </h3>
              {person.role && (
                <p className="text-sm text-gray-600">{person.role}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}

function Alumni() {
  const alumni = getAlumni()

  return (
    <Container className="mt-24">
      <Heading as="h3" className="mt-2">
        Alumni
      </Heading>
      <ul
        role="list"
        className="mx-auto mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {alumni.map((person) => (
          <li key={person.slug} className="flex items-center gap-4">
            <Link href={`/team/${person.slug}`} className="shrink-0">
              <img
                alt={person.title}
                src={`/_people/people-imgs/${person.img}`}
                className="size-16 rounded-full object-cover"
              />
            </Link>
            <div className="text-sm/6">
              <h3 className="font-medium">
                <Link href={`/team/${person.slug}`} className="hover:text-gray-600">
                  {person.title}
                </Link>
              </h3>
              {person.current && <p className="font-medium text-[#8C1515]">{person.current}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}

type VisitingEntry = {
  name: string
  affiliation: string
}

function stripTags(text: string) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function decodeHtml(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function parseVisitingEntries(content: string): VisitingEntry[] {
  const entries: VisitingEntry[] = []
  const matches = content.matchAll(
    /<li>\s*<h6[^>]*>([\s\S]*?)<\/h6>\s*(?:<p[^>]*>([\s\S]*?)<\/p>\s*)?<\/li>/g,
  )

  for (const match of matches) {
    const name = decodeHtml(stripTags(match[1]))
      .replace(/\.\s*$/, '')
      .trim()
    const affiliation = decodeHtml(stripTags(match[2] ?? ''))
      .replace(/\.\s*$/, '')
      .trim()
    if (name) {
      entries.push({ name, affiliation })
    }
  }

  return entries
}

function VisitingStudents() {
  const visiting = getVisiting()
  const visitingPage = visiting.find((person) => person.slug === 'visiting') ?? visiting[0]
  const entries = visitingPage ? parseVisitingEntries(visitingPage.content) : []

  if (entries.length === 0) {
    return null
  }

  return (
    <Container className="mt-24">
      <Heading as="h3" className="mt-2">
        Visiting Scholars
      </Heading>
      <ul
        role="list"
        className="mt-8 grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2"
      >
        {entries.map((entry, index) => (
          <li
            key={`${entry.name}-${index}`}
            className="border-b border-gray-200/80 pb-1.5"
          >
            <h3 className="text-sm font-semibold tracking-tight text-gray-950">
              {entry.name}
            </h3>
            {entry.affiliation && (
              <p className="text-sm text-gray-600">{entry.affiliation}</p>
            )}
          </li>
        ))}
      </ul>
    </Container>
  )
}

function DiversityStatement() {
  return (
    <Container className="mt-24 mb-16">
      <Subheading>Our Values</Subheading>
      <Heading as="h3" className="mt-2">
        Statement of Diversity, Equity, and Inclusivity
      </Heading>
      <div className="mt-6 max-w-3xl">
        <p className="text-base/7 text-gray-600">
          As researchers and teachers, we in the Autonomous Systems Lab recognize the importance and value of having diversity in our research group and the value of having members from all walks of life. Both in our day-to-day activities and research itself, we seek to be inclusive and mindful of this diversity in the lab, the classroom, and in our interactions. Further, we acknowledge that educating ourselves on the matters of inclusivity and diversity is a life-long learning process that must be a part of our entire research and professional careers. To this end, the Autonomous Systems Lab is committed to fostering the following principles to maintain an inclusive and vibrant environment on a daily basis:
        </p>
        <ul className="mt-8 space-y-4 text-base/7 text-gray-600">
          <li className="flex gap-3">
            <span className="text-gray-400">•</span>
            <span>We affirm all people, regardless of their age, culture, race, ethnic origin, religion, sexual orientation, gender, gender identity, disabilities, marital status, nationality, and socioeconomic status.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-gray-400">•</span>
            <span>We strive to maintain an environment of mutual respect for every member of the lab and community and one that rejects discrimination, prejudice, and intolerance.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-gray-400">•</span>
            <span>We commit to continuously educating ourselves and seek to incorporate ideas of diversity and inclusivity to our daily conversations on the broader impacts of our research.</span>
          </li>
        </ul>
      </div>
    </Container>
  )
}

export default function Company() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Director />
      <ResearchTeam />
      <Staff />
      <ExternalAffiliates />
      <Alumni />
      <VisitingStudents />
      <DiversityStatement />
      <Footer />
    </main>
  )
}
