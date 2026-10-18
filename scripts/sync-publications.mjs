import { createHash } from 'node:crypto'
import { readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

export const PROFILE_ID = 'BWUpn24AAAAJ'
const ORIGIN = 'https://scholar.google.com'
const PAGE_SIZE = 100
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ignoredFields = new Set([
  'Description',
  'Total citations',
  'Scholar articles',
])
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const normalize = (value = '') =>
  value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '')
const cleanAuthor = (value) => value.replace(/[*#†‡]+$/u, '').trim()

function decode(value) {
  const entities = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    ndash: '–',
    mdash: '—',
    hellip: '…',
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
  }
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, entity) => {
    if (entity[0] !== '#') return entities[entity] ?? all
    const number =
      entity[1].toLowerCase() === 'x'
        ? parseInt(entity.slice(2), 16)
        : Number(entity.slice(1))
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : all
  })
}

// A small HTML tree reader for Scholar's public list/detail markup. Scripts are
// discarded; this does not execute page content or require a browser dependency.
function documentTree(html) {
  if (
    /unusual traffic from your computer network|id=["'](?:gs_captcha|captcha-form)|class=["']g-recaptcha/i.test(
      html,
    )
  )
    throw new Error(
      'Google Scholar requested a CAPTCHA; synchronization stopped.',
    )
  if (!/<\/html\s*>/i.test(html))
    throw new Error('Incomplete Google Scholar response.')
  const root = { tag: '', attrs: {}, children: [] }
  let current = root
  const source = html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
  const voidTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ])
  for (const token of source.matchAll(/<[^>]+>|[^<]+/g)) {
    const part = token[0]
    if (!part.startsWith('<')) {
      current.children.push(decode(part))
      continue
    }
    if (/^<\//.test(part)) {
      const tag = part.match(/^<\/\s*([^\s>]+)/)?.[1].toLowerCase()
      let node = current
      while (node.parent && node.tag !== tag) node = node.parent
      if (node.parent) current = node.parent
      continue
    }
    const match = part.match(/^<([a-z][a-z0-9]*)\b/i)
    if (!match) continue
    const attrs = {}
    for (const attr of part
      .slice(match[0].length, -1)
      .matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))
      attrs[attr[1].toLowerCase()] = decode(attr[2] ?? attr[3] ?? attr[4] ?? '')
    const node = {
      tag: match[1].toLowerCase(),
      attrs,
      children: [],
      parent: current,
    }
    current.children.push(node)
    if (!voidTags.has(node.tag) && !/\/>$/.test(part)) current = node
  }
  return root
}

function find(node, predicate) {
  return node.children.flatMap((child) =>
    typeof child === 'string'
      ? []
      : [...(predicate(child) ? [child] : []), ...find(child, predicate)],
  )
}
const byId = (node, id) => find(node, (child) => child.attrs.id === id)[0]
const byClass = (node, name) =>
  find(node, (child) => (child.attrs.class ?? '').split(/\s+/).includes(name))
const text = (node) =>
  node
    ? node.children
        .map((child) => (typeof child === 'string' ? child : text(child)))
        .join('')
        .replace(/\s+/g, ' ')
        .trim()
    : ''

export function scholarId(url) {
  const parsed = new URL(url, ORIGIN)
  const id = parsed.searchParams.get('citation_for_view')
  if (
    parsed.origin !== ORIGIN ||
    !id?.startsWith(`${PROFILE_ID}:`) ||
    !/^[\w:-]+$/.test(id)
  )
    throw new Error(`Unexpected Scholar record URL: ${url}`)
  return id
}

export function parseList(html, start = 0) {
  const doc = documentTree(html)
  const table = byId(doc, 'gsc_a_b')
  const more = byId(doc, 'gsc_bpf_more')
  if (!table || !more)
    throw new Error('Google Scholar list or pagination controls are missing.')
  const profileName = text(byId(doc, 'gsc_prf_in'))
  if (profileName && normalize(profileName) !== 'heyehuang')
    throw new Error('Unexpected Google Scholar profile.')
  const rows = byClass(table, 'gsc_a_tr').map((row) => {
    const title = byClass(row, 'gsc_a_at')[0]
    const scholarUrl = new URL(title?.attrs.href ?? '', ORIGIN).href
    const id = scholarId(scholarUrl)
    if (!text(title)) throw new Error(`Empty Scholar title: ${id}`)
    return { id, title: text(title), scholarUrl }
  })
  if (!rows.length || rows.length > PAGE_SIZE)
    throw new Error('Empty or malformed Google Scholar list.')
  const range = text(byId(doc, 'gsc_a_nn')).match(/Articles\s+(\d+)[–-](\d+)/)
  if (
    !range ||
    Number(range[1]) !== start + 1 ||
    Number(range[2]) !== start + rows.length
  )
    throw new Error(
      'Google Scholar article range does not match the retrieved rows.',
    )
  const hasMore =
    !Object.hasOwn(more.attrs, 'disabled') &&
    more.attrs['aria-disabled'] !== 'true'
  if (hasMore && rows.length !== PAGE_SIZE)
    throw new Error('Incomplete Google Scholar page before the next page.')
  return { rows, hasMore }
}

function safeUrl(value, fallback) {
  if (typeof value !== 'string' || !value.trim()) return fallback
  try {
    const url = new URL(value, ORIGIN)
    return /^https?:$/.test(url.protocol) ? url.href : fallback
  } catch {
    return fallback
  }
}

export function parseDetail(html, row) {
  const doc = documentTree(html)
  const pageIds = find(
    doc,
    (node) => node.tag === 'input' && node.attrs.name === 's',
  ).map((node) => node.attrs.value)
  if (pageIds.some((id) => id !== row.id))
    throw new Error(`Scholar detail record ID mismatch: ${row.id}`)
  const table = byId(doc, 'gsc_oci_table')
  const titleNode = byId(doc, 'gsc_oci_title')
  if (!table || !text(titleNode))
    throw new Error(`Missing Scholar detail: ${row.id}`)
  const allFields = {}
  for (const field of byClass(table, 'gsc_oci_field')) {
    const values = byClass(field.parent, 'gsc_oci_value')
    if (values.length !== 1)
      throw new Error(`Malformed Scholar field: ${row.id}`)
    allFields[text(field)] = text(values[0])
  }
  if (
    !(allFields.Authors || allFields.Inventors) ||
    !/^\d{4}(?:\/\d{1,2}){0,2}$/.test(allFields['Publication date'] ?? '')
  )
    throw new Error(`Missing authors or publication date: ${row.title}`)
  if (/…|\.\.\./.test(allFields.Authors ?? allFields.Inventors))
    throw new Error(`Truncated author list: ${row.title}`)
  const title = text(titleNode)
  // The list can abbreviate a long title with an ellipsis, but its visible prefix
  // must still identify the detail page we requested.
  const listPrefix = normalize(row.title.replace(/(?:…|\.\.\.).*$/, ''))
  if (!normalize(title).startsWith(listPrefix))
    throw new Error(`Scholar list/detail title mismatch: ${row.title}`)
  const anchor = byClass(titleNode, 'gsc_oci_title_link')[0]
  return {
    scholarUrl: row.scholarUrl,
    title,
    fields: Object.fromEntries(
      Object.entries(allFields).filter(([key]) => !ignoredFields.has(key)),
    ),
    abstractAvailable: Boolean(allFields.Description),
    url: safeUrl(anchor?.attrs.href, row.scholarUrl),
  }
}

export function nonPaperReason(record) {
  const field = record.fields
  if (
    field.Inventors ||
    field['Patent office'] ||
    field['Application number'] ||
    /\bpatent\b|\[P\]|\b[A-Z]{2}\d{7,}[A-Z]\b/i.test(record.title)
  )
    return 'Patent or application; this page lists research papers.'
  if (
    /\bdata management plan\b|\bresearch report\b|\btechnical report\b/i.test(
      record.title,
    ) ||
    field['Report number']
  )
    return 'Research report or data management plan; this page lists research papers.'
  return null
}

const venueOf = (fields) =>
  fields.Conference || fields.Book || fields.Journal || ''
const isPreprint = (fields) =>
  /arxiv|ssrn|biorxiv|medrxiv|preprint|research square/i.test(venueOf(fields))
const authorList = (fields) =>
  (fields.Authors ?? '')
    .split(/[,，]/)
    .map((author) => cleanAuthor(author))
    .filter(Boolean)
function identifier(record) {
  const values = [
    record.url ?? '',
    record.fields.doi ?? '',
    venueOf(record.fields),
  ].join(' ')
  const doi = values
    .match(/10\.\d{4,9}\/[^\s?#]+/i)?.[0]
    ?.replace(/[.,;)]+$/, '')
    .toLowerCase()
  const arxiv = values.match(
    /(?:arxiv(?:\.org\/(?:abs|pdf)\/|[:\s]+))(\d{4}\.\d{4,5})(?:v\d+)?/i,
  )?.[1]
  return { doi, arxiv }
}

export function samePaper(a, b) {
  const left = identifier(a),
    right = identifier(b)
  if (
    (left.doi && left.doi === right.doi) ||
    (left.arxiv && left.arxiv === right.arxiv)
  )
    return true
  return (
    normalize(a.title) === normalize(b.title) &&
    same(
      authorList(a.fields).map(normalize),
      authorList(b.fields).map(normalize),
    )
  )
}

function bibEscape(value) {
  return String(value)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%#_{}]/g, '\\$&')
    .replace(/–/g, '--')
    .replace(/‐/g, '-')
    .replace(/’/g, "'")
}

function bibAuthor(name) {
  const parts = name.split(' ')
  if (parts.length === 2 && /^[A-Z]+$/.test(parts[0]))
    return `${parts[0][0]}${parts[0].slice(1).toLowerCase()}, ${parts[1]}`
  return name
}

export function buildPublication(record, previous, day) {
  const overrides = record.verifiedOverrides ?? {}
  const fields = {
    ...record.fields,
    ...Object.fromEntries(
      Object.entries(overrides).filter(
        ([key]) => !['source', 'doi'].includes(key),
      ),
    ),
  }
  let title = record.title.split(';[')[0].replace(/\*$/, '').trim()
  if (previous && normalize(previous.title) === normalize(title))
    title = previous.title
  const authorsDisplay = fields.Authors.split(/[,，]/)
    .map((part) => part.trim())
    .join(', ')
  const authors = authorList(fields)
  const [year, month = 0] = fields['Publication date'].split('/').map(Number)
  if (
    !authors.length ||
    year < 1900 ||
    year > new Date(day).getUTCFullYear() + 2 ||
    month < 0 ||
    month > 12
  )
    throw new Error(`Invalid bibliographic data: ${title}`)
  const venue = venueOf(fields)
  if (!venue) throw new Error(`Missing venue: ${title}`)
  const preprint = isPreprint(fields)
  const conference = Boolean(
    fields.Conference || fields.Book || /Proceedings/i.test(venue),
  )
  const key =
    previous?.key ??
    `huang-${year}-${
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 70) || 'paper'
    }-${createHash('sha256').update(scholarId(record.scholarUrl)).digest('hex').slice(0, 8)}`
  const url = safeUrl(record.url, record.scholarUrl)
  const volume = fields.Volume,
    issue = fields.Issue,
    pages = fields.Pages
  const details =
    venue +
    (volume ? ` ${volume}` : '') +
    (issue ? `(${issue})` : '') +
    (pages ? `, ${pages}` : '')
  const doi = overrides.doi || fields.doi || identifier(record).doi
  const bib = {
    title,
    author: authors.map(bibAuthor).join(' and '),
    year: String(year),
  }
  if (preprint) {
    const arxiv = identifier(record).arxiv
    if (arxiv) Object.assign(bib, { eprint: arxiv, archivePrefix: 'arXiv' })
    else bib.howpublished = venue
  } else bib[conference ? 'booktitle' : 'journal'] = venue
  if (volume) bib.volume = volume
  if (issue) bib.number = issue
  if (pages) bib.pages = pages.replace(/(?<=\d)-(?=\d)/g, '--')
  if (doi) bib.doi = doi
  bib.url = url
  const result = {
    key,
    type: preprint ? 'preprint' : 'publication',
    title,
    authors,
    authorsDisplay,
    year,
    month,
    keywords: [],
    citation: `${authors.join(', ')}. ${title}. ${details} (${year}).`,
    venue,
    url,
    bibtex: `@${preprint ? 'misc' : conference ? 'inproceedings' : 'article'}{${key},\n${Object.entries(
      bib,
    )
      .map(([name, value]) => `  ${name} = {${bibEscape(value)}}`)
      .join(',\n')}\n}`,
    abstractUrl: /\.pdf(?:$|[?])|\/pdf\/|\/download|scholar\?cluster/i.test(url)
      ? record.scholarUrl
      : url,
    abstractAvailable: record.abstractAvailable,
    scholarUrl: record.scholarUrl,
    source: record.scholarUrl,
    sourceChecked: day,
  }
  if (doi) result.doi = doi
  if (overrides.source) result.metadataSource = overrides.source
  return result
}

function recordChanged(previous, incoming) {
  return (
    previous.title !== incoming.title ||
    !same(previous.fields, incoming.fields) ||
    previous.abstractAvailable !== incoming.abstractAvailable ||
    (previous.url && previous.url !== incoming.url)
  )
}

const bibliographyKeys = [
  'type',
  'title',
  'authors',
  'authorsDisplay',
  'year',
  'month',
  'venue',
  'citation',
  'bibtex',
  'doi',
]

export function reconcile(publications, audit, details, day) {
  const nextPubs = structuredClone(publications)
  const nextAudit = structuredClone(audit)
  const bySource = new Map(
    nextAudit.records.map((record) => [scholarId(record.scholarUrl), record]),
  )
  const byKey = new Map(nextPubs.map((item) => [item.key, item]))
  const summary = {
    retrieved: details.length,
    added: [],
    updated: [],
    merged: [],
    excluded: [],
    review: [],
    changed: false,
  }

  // A missing known source can mean an incomplete response or a Scholar merge.
  // Neither is permission to silently erase a checked-in publication.
  const incomingIds = new Set(
    details.map((record) => scholarId(record.scholarUrl)),
  )
  for (const id of bySource.keys())
    if (!incomingIds.has(id))
      throw new Error(
        `Previously recorded Scholar item is missing (${id}); review the profile before updating its audit.`,
      )

  for (const incoming of details) {
    const id = scholarId(incoming.scholarUrl)
    const previous = bySource.get(id)
    if (!previous || !recordChanged(previous, incoming)) continue
    if (previous.decision !== 'include') {
      // Keep manually reviewed exclusions and merges authoritative.
      Object.assign(previous, incoming)
      continue
    }
    const item = byKey.get(previous.key)
    if (!item)
      throw new Error(
        `Audit points to an unknown publication key: ${previous.key}`,
      )
    const oldGenerated = buildPublication(
      { ...previous, url: previous.url ?? item.url },
      item,
      item.sourceChecked ?? day,
    )
    const overrides = previous.verifiedOverrides
    const nextSource = {
      ...incoming,
      verifiedOverrides: overrides,
      url: overrides || item.metadataSource ? item.url : incoming.url,
    }
    const generated = buildPublication(nextSource, item, day)
    const conflicts = bibliographyKeys.filter(
      (key) =>
        !same(item[key], oldGenerated[key]) && !same(item[key], generated[key]),
    )
    if (conflicts.length) {
      previous.pendingSourceChange = { ...incoming, protectedFields: conflicts }
      summary.review.push(
        `${item.title}: manually edited ${conflicts.join(', ')}`,
      )
      continue
    }
    Object.assign(item, generated)
    Object.assign(previous, incoming)
    delete previous.pendingSourceChange
    summary.updated.push(item.title)
  }

  // Known records are reconciled first, so a new duplicate can match an existing
  // paper even if Scholar puts the new version earlier in the profile list.
  for (const incoming of details) {
    const id = scholarId(incoming.scholarUrl)
    if (bySource.has(id)) continue
    const record = { ...incoming }
    const exclusion = nonPaperReason(record)
    if (exclusion) {
      Object.assign(record, { decision: 'exclude', reason: exclusion })
      summary.excluded.push(record.title)
    } else if (!venueOf(record.fields)) {
      Object.assign(record, {
        decision: 'review',
        reason:
          'No research-paper venue; verify the source before including this record.',
      })
      summary.review.push(record.title)
    } else {
      const duplicate = nextAudit.records.find(
        (known) =>
          known.decision === 'include' &&
          samePaper(record, {
            ...known,
            url: known.url ?? byKey.get(known.key)?.url,
          }),
      )
      if (duplicate) {
        const retained = byKey.get(duplicate.key)
        // A confirmed preprint -> published version keeps its stable website key
        // and all manually supplied awards, code, images and other annotations.
        if (
          retained.type === 'preprint' &&
          !isPreprint(record.fields) &&
          !duplicate.verifiedOverrides &&
          !retained.metadataSource
        ) {
          Object.assign(retained, buildPublication(record, retained, day))
          Object.assign(record, { decision: 'include', key: retained.key })
          Object.assign(duplicate, {
            decision: 'merge',
            retainedScholarUrl: record.scholarUrl,
            reason:
              'Same title and complete author list or publication identifier; retain the published version.',
          })
          delete duplicate.key
          summary.updated.push(retained.title)
        } else
          Object.assign(record, {
            decision: 'merge',
            retainedScholarUrl: duplicate.scholarUrl,
            reason:
              'Same title and complete author list or publication identifier; retain the existing verified record.',
          })
        summary.merged.push(record.title)
      } else {
        const publication = buildPublication(record, null, day)
        if (byKey.has(publication.key))
          throw new Error(`Publication key collision: ${publication.key}`)
        Object.assign(record, { decision: 'include', key: publication.key })
        nextPubs.push(publication)
        byKey.set(publication.key, publication)
        summary.added.push(publication.title)
      }
    }
    nextAudit.records.push(record)
    bySource.set(id, record)
  }
  if (!same(nextPubs, publications))
    nextPubs.sort(
      (a, b) =>
        b.year - a.year ||
        b.month - a.month ||
        a.title.toLowerCase().localeCompare(b.title.toLowerCase(), 'en'),
    )
  summary.changed = !same(nextPubs, publications) || !same(nextAudit, audit)
  if (summary.changed) {
    nextAudit.checkedOn = day
    nextAudit.pagination = {
      requestedPageSize: PAGE_SIZE,
      retrievedRows: details.length,
      showMoreDisabled: true,
      detailPagesRetrieved: details.length,
    }
    nextAudit.included = nextPubs.length
    nextAudit.excludedNonPapers = nextAudit.records.filter(
      (record) => record.decision === 'exclude',
    ).length
    nextAudit.mergedDuplicates = nextAudit.records.filter(
      (record) => record.decision === 'merge',
    ).length
    nextAudit.pendingReview = nextAudit.records.filter(
      (record) => record.decision === 'review' || record.pendingSourceChange,
    ).length
  }
  return { publications: nextPubs, audit: nextAudit, summary }
}

export function createFetcher({ fetchImpl = fetch, delay = 1500 } = {}) {
  let requests = 0
  return async (url) => {
    if (requests++) await setTimeout(delay)
    const response = await fetchImpl(url, {
      signal: AbortSignal.timeout(30000),
      headers: {
        'User-Agent':
          'ACES-Lab-Publication-Sync/1.0 (+https://aces-kaist.github.io)',
        'Accept-Language': 'en',
      },
    })
    if (!response.ok)
      throw new Error(
        `Google Scholar returned HTTP ${response.status}; no retry or files changed.`,
      )
    if (response.url && new URL(response.url).hostname !== 'scholar.google.com')
      throw new Error(
        'Google Scholar redirected to a consent or access-check page; synchronization stopped.',
      )
    const bytes = new Uint8Array(await response.arrayBuffer())
    const declared =
      response.headers.get('content-type')?.match(/charset=([\w-]+)/i)?.[1] ??
      new TextDecoder('latin1')
        .decode(bytes.slice(0, 2048))
        .match(/charset=([\w-]+)/i)?.[1] ??
      'utf-8'
    return new TextDecoder(declared).decode(bytes)
  }
}

export async function collectDetails(fetchHtml) {
  const rows = [],
    seen = new Set()
  for (let page = 0; page < 25; page++) {
    const url = new URL('/citations', ORIGIN)
    url.search = new URLSearchParams({
      user: PROFILE_ID,
      hl: 'en',
      cstart: String(rows.length),
      pagesize: String(PAGE_SIZE),
      sortby: 'pubdate',
    }).toString()
    const list = parseList(await fetchHtml(url.href), rows.length)
    for (const row of list.rows) {
      if (seen.has(row.id))
        throw new Error(
          'Repeated Scholar record across pagination; synchronization stopped.',
        )
      seen.add(row.id)
      rows.push(row)
    }
    if (!list.hasMore) {
      const details = []
      for (const row of rows)
        details.push(parseDetail(await fetchHtml(row.scholarUrl), row))
      return details
    }
  }
  throw new Error('Google Scholar pagination exceeded the safety limit.')
}

export async function runSync({
  root = ROOT,
  dryRun = false,
  fetchHtml = createFetcher(),
  day = new Date().toISOString().slice(0, 10),
} = {}) {
  const paths = [
    resolve(root, 'src/data/publications.json'),
    resolve(root, 'docs/publication-source-audit.json'),
  ]
  const original = await Promise.all(
    paths.map((path) => readFile(path, 'utf8')),
  )
  const [publications, audit] = original.map(JSON.parse)
  if (!Array.isArray(publications) || !audit.records?.length)
    throw new Error('Publication snapshot or source audit is missing.')
  const details = await collectDetails(fetchHtml)
  const result = reconcile(publications, audit, details, day)
  if (!dryRun && result.summary.changed) {
    // No output file is touched until every request, parse and merge succeeds.
    // Temporary files are on the same filesystem for atomic per-file renames.
    const temp = paths.map((path) => `${path}.${process.pid}.tmp`)
    try {
      if (
        !(await Promise.all(paths.map((path) => readFile(path, 'utf8')))).every(
          (value, i) => value === original[i],
        )
      )
        throw new Error(
          'Publication files changed during synchronization; retry after those edits finish.',
        )
      await Promise.all(
        [result.publications, result.audit].map((value, i) =>
          writeFile(temp[i], `${JSON.stringify(value, null, 2)}\n`, {
            flag: 'wx',
          }),
        ),
      )
      for (let i = 0; i < paths.length; i++) await rename(temp[i], paths[i])
    } finally {
      await Promise.all(temp.map((path) => rm(path, { force: true })))
    }
  }
  return { ...result.summary, dryRun, papers: result.publications.length }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const flags = process.argv.slice(2)
  if (flags.some((flag) => !['--dry-run', '--check'].includes(flag))) {
    console.error(
      'Usage: node scripts/sync-publications.mjs [--dry-run|--check]',
    )
    process.exitCode = 1
  } else {
    try {
      console.log(
        JSON.stringify(await runSync({ dryRun: flags.length > 0 }), null, 2),
      )
    } catch (error) {
      console.error(`Publication sync failed: ${error.message}`)
      process.exitCode = 1
    }
  }
}
