import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('out')
const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
const failures = []
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const file = path.join(dir, item.name)
    return item.isDirectory() ? walk(file) : [file]
  })
}
const htmlFiles = walk(root).filter((file) => file.endsWith('.html'))
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  for (const match of html.matchAll(/(?:href|src|srcSet|srcset)="([^"]+)"/g)) {
    const urls = /src[Ss]et=/.test(match[0])
      ? match[1].split(',').map((item) => item.trim().split(' ')[0])
      : [match[1]]
    for (const url of urls) {
      if (!url.startsWith('/') || url.startsWith('//')) continue
      if (base && !url.startsWith(`${base}/`) && url !== base) {
        failures.push(`${path.relative(root, file)}: missing base path ${url}`)
        continue
      }
      const local = decodeURIComponent(url.slice(base.length).split(/[?#]/)[0])
      const target = path.join(root, local)
      if (!fs.existsSync(target))
        failures.push(`${path.relative(root, file)}: missing ${url}`)
    }
  }
}
for (const route of [
  '',
  'research',
  'hardware',
  'publications',
  'team',
  'photo',
  'faq',
  'contact',
]) {
  if (!fs.existsSync(path.join(root, route, 'index.html')))
    failures.push(`Missing route /${route}`)
}
for (const archive of [
  'BARS2016',
  'BARS2018',
  'SBRS2014',
  '_people',
  'wp-content',
]) {
  if (fs.existsSync(path.join(root, archive)))
    failures.push(`Upstream archive still published: ${archive}`)
}
const photos = JSON.parse(fs.readFileSync('src/data/photos.json', 'utf8'))
const gallery = fs.readFileSync(path.join(root, 'photo/index.html'), 'utf8')
const imageCount = [
  ...gallery.matchAll(/<img\b[^>]*\bsrc="[^"]*\/photos\/[^"]+"/g),
].length
if (imageCount !== photos.length)
  failures.push(`Photo count: expected ${photos.length}, got ${imageCount}`)
if (gallery.includes('<figcaption')) failures.push('Unexpected photo caption')
if (failures.length) {
  console.error([...new Set(failures)].join('\n'))
  process.exit(1)
}
console.log(
  `Checked ${htmlFiles.length} HTML pages, all local links/media, ${photos.length} gallery photos, and archive exclusions (basePath: ${base || '/'}).`,
)
