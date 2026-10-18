import path from 'node:path'

// Read only the EXIF fields used for capture dates. Offset checks also handle
// absent or truncated EXIF without turning file copy times into photo dates.
function readExifDates(buffer) {
  if (!buffer) return {}
  const start = buffer.toString('ascii', 0, 6) === 'Exif\0\0' ? 6 : 0
  const tiff = buffer.subarray(start)
  const order = tiff.toString('ascii', 0, 2)
  if (tiff.length < 8 || !['II', 'MM'].includes(order)) return {}
  const little = order === 'II'
  const uint16 = (offset) => {
    if (offset < 0 || offset + 2 > tiff.length) throw new Error('EXIF bounds')
    return little ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset)
  }
  const uint32 = (offset) => {
    if (offset < 0 || offset + 4 > tiff.length) throw new Error('EXIF bounds')
    return little ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset)
  }
  const readDirectory = (offset) => {
    const tags = new Map()
    const length = uint16(offset)
    for (let index = 0; index < length; index += 1) {
      const entry = offset + 2 + index * 12
      const tag = uint16(entry)
      const type = uint16(entry + 2)
      const count = uint32(entry + 4)
      if (type === 2) {
        const valueOffset = count <= 4 ? entry + 8 : uint32(entry + 8)
        if (valueOffset + count > tiff.length) throw new Error('EXIF bounds')
        tags.set(
          tag,
          tiff
            .toString('ascii', valueOffset, valueOffset + count)
            .replace(/\0+$/, ''),
        )
      } else if (type === 4 && count === 1) {
        tags.set(tag, uint32(entry + 8))
      }
    }
    return tags
  }
  try {
    if (uint16(2) !== 42) return {}
    const main = readDirectory(uint32(4))
    const pointer = main.get(0x8769)
    const exif =
      typeof pointer === 'number' ? readDirectory(pointer) : new Map()
    return {
      original: exif.get(0x9003),
      offset: exif.get(0x9011),
      subsecond: exif.get(0x9291),
    }
  } catch {
    return {}
  }
}

function validDate(parts) {
  const [year, month, day, hour, minute, second] = parts.map(Number)
  const value = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  return (
    value.getUTCFullYear() === year &&
    value.getUTCMonth() === month - 1 &&
    value.getUTCDate() === day &&
    value.getUTCHours() === hour &&
    value.getUTCMinutes() === minute &&
    value.getUTCSeconds() === second
  )
}

export function photoDate(metadata, filename) {
  const exif = readExifDates(metadata.exif)
  const original =
    typeof exif.original === 'string'
      ? exif.original.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)
      : null
  const named = path
    .basename(filename)
    .match(
      /^(?:IMG|MVIMG|MEITU|IDG)_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d{3})?/,
    )
  const fromExif = original && validDate(original.slice(1, 7))
  const match = fromExif
    ? original
    : named && validDate(named.slice(1, 7))
      ? named
      : null
  if (!match) {
    return {
      capturedAt: null,
      dateSource: {
        kind: 'unknown',
        reason: 'No capture date in metadata or filename.',
      },
    }
  }
  const [, year, month, day, hour, minute, second] = match
  const rawSubsecond = fromExif ? exif.subsecond : match[7]
  const subsecond =
    typeof rawSubsecond === 'string' && /^\d+$/.test(rawSubsecond)
      ? `.${rawSubsecond.slice(0, 3).padEnd(3, '0')}`
      : ''
  const offset =
    typeof exif.offset === 'string' &&
    /^[+-](?:0\d|1[0-4]):[0-5]\d$/.test(exif.offset)
      ? exif.offset
      : ''
  return {
    capturedAt: `${year}-${month}-${day}T${hour}:${minute}:${second}${subsecond}${offset}`,
    dateSource: {
      kind: fromExif ? 'exif' : 'filename',
      field: fromExif ? 'DateTimeOriginal' : match[0],
      timeZone: offset ? 'OffsetTimeOriginal' : 'not recorded',
    },
  }
}

export function newestPhotoFirst(a, b) {
  if (a.capturedAt === null)
    return b.capturedAt === null ? a.id.localeCompare(b.id) : 1
  if (b.capturedAt === null) return -1
  // Compare known offsets as absolute time. If either image lacks an offset,
  // compare its recorded local date instead of inventing a time zone.
  const hasZone = (value) => /(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  const difference =
    hasZone(a.capturedAt) && hasZone(b.capturedAt)
      ? Date.parse(b.capturedAt) - Date.parse(a.capturedAt)
      : b.capturedAt.slice(0, 19).localeCompare(a.capturedAt.slice(0, 19))
  return difference || a.id.localeCompare(b.id)
}
