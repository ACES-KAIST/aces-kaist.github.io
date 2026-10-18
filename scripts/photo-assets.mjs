import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { newestPhotoFirst, photoDate } from './photo-dates.mjs'

// Run `npm run photos:build`, or pass a source folder as the first argument.
// Original photos are read only. Sharp applies EXIF orientation and removes
// embedded metadata from the web copies.
const root = fileURLToPath(new URL('../', import.meta.url))
const input = path.resolve(root, process.argv[2] || '../Photo')
const output = path.join(root, 'public/photos')
const manifest = path.join(root, 'src/data/photos.json')
const descriptions = JSON.parse(
  await readFile(new URL('./photo-descriptions.json', import.meta.url), 'utf8'),
)
// This reviewed list controls inclusion. Similar photos were
// compared visually; different file hashes alone do not make a photo distinct.
const selection = JSON.parse(
  await readFile(new URL('./photo-selection.json', import.meta.url), 'utf8'),
)
const selected = new Set(selection)
if (!selection.length || selected.size !== selection.length) {
  throw new Error(
    'Photo selection must be nonempty and contain no duplicate IDs.',
  )
}
const supported = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.tif',
  '.tiff',
])
const widths = [480, 960]

async function findPhotos(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((a, b) =>
    a.name.localeCompare(b.name, 'en'),
  )) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await findPhotos(filename)))
    else if (
      entry.isFile() &&
      supported.has(path.extname(entry.name).toLowerCase())
    ) {
      files.push(filename)
    }
  }
  return files
}

const sources = await findPhotos(input)
if (!sources.length) throw new Error(`No supported photos found in ${input}`)
await mkdir(output, { recursive: true })
await mkdir(path.dirname(manifest), { recursive: true })

const photos = []
const generated = new Set()
const seen = new Set()
let sourceBytes = 0
let outputBytes = 0

for (const source of sources) {
  const bytes = await readFile(source)
  sourceBytes += bytes.byteLength
  const id = createHash('sha256').update(bytes).digest('hex').slice(0, 16)
  // Identical source files need only one gallery card and one set of web copies.
  if (seen.has(id)) continue
  seen.add(id)
  if (!selected.has(id)) {
    if (!descriptions[id])
      console.log(`Not selected: ${id} (${path.relative(input, source)})`)
    continue
  }
  const capture = photoDate(await sharp(bytes).metadata(), source)
  const variants = []
  for (const width of widths) {
    const filename = `${id}-${width}.webp`
    const result = await sharp(bytes)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(output, filename))
    generated.add(filename)
    outputBytes += result.size
    if (!variants.some((variant) => variant.width === result.width)) {
      variants.push({
        src: `/photos/${filename}`,
        width: result.width,
        height: result.height,
      })
    }
  }
  const largest = variants[variants.length - 1]
  const description = descriptions[id]
  if (!description) {
    console.warn(
      `Add an alt description in scripts/photo-descriptions.json for ${id}`,
    )
  }
  photos.push({
    id,
    src: largest.src,
    width: largest.width,
    height: largest.height,
    alt: description?.alt || 'Photo from the lab gallery.',
    ...capture,
    variants,
  })
}

const missing = selection.filter((id) => !seen.has(id))
if (missing.length)
  throw new Error(`Selected source photos are missing: ${missing.join(', ')}`)
photos.sort(newestPhotoFirst)
// Remove only assets created by this script that are no longer in the manifest.
for (const filename of await readdir(output)) {
  if (
    /^[a-f0-9]{16}-(480|960)\.webp$/.test(filename) &&
    !generated.has(filename)
  ) {
    await rm(path.join(output, filename))
  }
}
await writeFile(manifest, `${JSON.stringify(photos, null, 2)}\n`)
const manifestBytes = (await stat(manifest)).size
console.log(
  `Prepared ${photos.length} selected photos (${sources.length} source files): ` +
    `${(sourceBytes / 1024 / 1024).toFixed(1)} MiB originals, ` +
    `${(outputBytes / 1024 / 1024).toFixed(1)} MiB web images, ` +
    `${(manifestBytes / 1024).toFixed(1)} KiB manifest.`,
)
