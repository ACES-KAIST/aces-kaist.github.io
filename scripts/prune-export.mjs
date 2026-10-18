import { rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Keep upstream archives in the checkout, but do not publish them as ACES content.
const excluded = [
  'BARS2016',
  'BARS2018',
  'SBRS2014',
  '_people',
  'wp-content',
  'img',
  'lab-logo',
  'Freeflyer.mp4',
  'Background_White.png',
  'aces/sources.json',
]
for (const item of excluded) {
  await rm(path.join(process.cwd(), 'out', item), {
    recursive: true,
    force: true,
  })
}
await writeFile(path.join(process.cwd(), 'out', '.nojekyll'), '')
console.log('Static export ready. Upstream archives excluded from publication.')
