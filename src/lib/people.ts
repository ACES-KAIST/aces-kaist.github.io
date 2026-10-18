import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export interface Person {
  title: string
  last: string
  position: string
  role: string
  img: string
  website?: string
  gscholar?: string
  github?: string
  linkedin?: string
  email?: string
  excerpt?: string
  joined?: string
  content: string
  slug: string
}

export interface VisitingEntry {
  name: string
  affiliation: string
  period: string
}

const peopleDirectory = path.join(process.cwd(), 'content/people')

function personFiles(): string[] {
  return fs.readdirSync(peopleDirectory).filter((file) => file.endsWith('.markdown'))
}

function readPerson(fileName: string): Person {
  const fileContents = fs.readFileSync(path.join(peopleDirectory, fileName), 'utf8')
  const { data, content } = matter(fileContents)

  return {
    title: data.title || '',
    last: data.last || '',
    position: data.position || '',
    role: data.role || '',
    img: data.img || '',
    website: data.website || undefined,
    gscholar: data.gscholar || undefined,
    github: data.github || undefined,
    linkedin: data.linkedin || undefined,
    email: data.email || undefined,
    excerpt: data.excerpt || undefined,
    joined: data.joined || undefined,
    content: content.trim(),
    slug: fileName.replace(/\.markdown$/, ''),
  }
}

export function getPeopleByPosition(position: string): Person[] {
  return personFiles()
    .map(readPerson)
    .filter((person) => person.position === position)
    .sort((a, b) => a.last.localeCompare(b.last))
}

export function getFaculty(): Person[] {
  return getPeopleByPosition('faculty')
}

export function getResearchTeam(): Person[] {
  return getPeopleByPosition('phd')
}

export function getVisitingEntries(): VisitingEntry[] {
  return JSON.parse(fs.readFileSync(path.join(peopleDirectory, 'visiting.json'), 'utf8'))
}

export function getProfiledPeople(): Person[] {
  return personFiles().map(readPerson)
}

export function getPersonBySlug(slug: string): Person | null {
  // Only known source records become profile routes.
  const fileName = personFiles().find((name) => name === `${slug}.markdown`)
  return fileName ? readPerson(fileName) : null
}
