import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  buildPublication,
  collectDetails,
  collectSerpApiDetails,
  createFetcher,
  createSerpApiClient,
  parseDetail,
  parseList,
  parseSerpApiDetail,
  parseSerpApiList,
  PROFILE_ID,
  reconcile,
  runSync,
  samePaper,
} from './sync-publications.mjs'

const day = '2026-10-18'
const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
const url = (id) =>
  `https://scholar.google.com/citations?user=${PROFILE_ID}&citation_for_view=${PROFILE_ID}:${id}&view_op=view_citation`
function record(id, extra = {}) {
  return {
    scholarUrl: url(id),
    title: `Paper ${id}`,
    fields: {
      Authors: 'Ada Lovelace, Heye Huang*',
      'Publication date': '2026/10/1',
      Journal: 'Journal of Robotics',
    },
    abstractAvailable: true,
    url: `https://example.org/papers/${id}`,
    ...extra,
  }
}
function listPage(records, { start = 0, more = false } = {}) {
  return `<html><body><div id="gsc_prf_in">Heye Huang</div><table><tbody id="gsc_a_b">${records.map((r) => `<tr class="gsc_a_tr"><td><a class="gsc_a_at" href="${escape(r.scholarUrl)}">${escape(r.title)}</a></td></tr>`).join('')}</tbody></table><span id="gsc_a_nn">Articles ${start + 1}&ndash;${start + records.length}</span><button id="gsc_bpf_more" ${more ? '' : 'disabled'}>Show more</button></body></html>`
}
function detailPage(r) {
  return `<html><body><div id="gsc_oci_title"><a class="gsc_oci_title_link" href="${escape(r.url)}">${escape(r.title)}</a></div><div id="gsc_oci_table">${Object.entries(
    {
      ...r.fields,
      ...(r.abstractAvailable
        ? { Description: 'Source abstract with <span>nested text</span>.' }
        : {}),
    },
  )
    .map(
      ([name, value]) =>
        `<div><div class="gsc_oci_field">${escape(name)}</div><div class="gsc_oci_value">${name === 'Description' ? value : escape(value)}</div></div>`,
    )
    .join('')}</div></body></html>`
}
function snapshot(records) {
  const publications = records
    .filter((r) => !r.decision || r.decision === 'include')
    .map((r) => buildPublication(r, null, day))
  return {
    publications,
    audit: {
      checkedOn: day,
      profile: `https://scholar.google.com/citations?user=${PROFILE_ID}&hl=en`,
      records: records.map((r) => ({
        ...r,
        decision: r.decision ?? 'include',
        ...(!r.decision || r.decision === 'include'
          ? { key: publications.find((p) => p.scholarUrl === r.scholarUrl).key }
          : {}),
      })),
    },
  }
}
function fixtureFetcher(records) {
  return async (address) => {
    const parsed = new URL(address)
    const id = parsed.searchParams.get('citation_for_view')
    if (id) {
      const found = records.find(
        (r) =>
          new URL(r.scholarUrl).searchParams.get('citation_for_view') === id,
      )
      assert.ok(found, 'Detail request must refer to a listed record')
      return detailPage(found)
    }
    const start = Number(parsed.searchParams.get('cstart'))
    return listPage(records.slice(start, start + 100), {
      start,
      more: start + 100 < records.length,
    })
  }
}
async function fixtureRoot(t, state) {
  const root = await mkdtemp(join(tmpdir(), 'aces-publication-sync-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(join(root, 'src/data'), { recursive: true })
  await mkdir(join(root, 'docs'), { recursive: true })
  const paths = [
    join(root, 'src/data/publications.json'),
    join(root, 'docs/publication-source-audit.json'),
  ]
  await Promise.all(
    [state.publications, state.audit].map((value, i) =>
      writeFile(paths[i], `${JSON.stringify(value, null, 2)}\n`),
    ),
  )
  return {
    root,
    contents: () => Promise.all(paths.map((path) => readFile(path, 'utf8'))),
  }
}

test('parses complete Scholar list/detail markup, entities and source abstract links', () => {
  const source = record('entities', {
    title: 'Safe & Adaptive Decisions',
    fields: {
      Authors: 'René Smith, Heye Huang*',
      'Publication date': '2026/10',
      Journal: 'Research & Robotics',
    },
  })
  const list = parseList(listPage([source]))
  assert.equal(list.rows[0].title, source.title)
  assert.equal(list.hasMore, false)
  const detail = parseDetail(detailPage(source), list.rows[0])
  assert.equal(detail.fields.Authors, source.fields.Authors)
  assert.equal(detail.abstractAvailable, true)
  assert.equal(detail.fields.Description, undefined)
  assert.equal(detail.url, source.url)
  const publication = buildPublication(detail, null, day)
  assert.deepEqual(publication.authors, ['René Smith', 'Heye Huang'])
  assert.match(publication.bibtex, /Safe \\& Adaptive/)
  assert.equal(publication.abstract, undefined)
})

test('missing, blank and unsafe article URLs fall back to the Scholar record', () => {
  const source = record('link')
  const row = parseList(listPage([source])).rows[0]
  for (const replacement of [
    '',
    'href=""',
    'href="   "',
    'href="javascript:alert(1)"',
  ]) {
    const html = detailPage(source).replace(`href="${source.url}"`, replacement)
    const detail = parseDetail(html, row)
    assert.equal(detail.url, row.scholarUrl)
    assert.equal(
      buildPublication(detail, null, day).abstractUrl,
      row.scholarUrl,
    )
  }
  assert.throws(
    () =>
      parseDetail(
        detailPage(source).replace(
          '<body>',
          `<body><input name="s" value="${PROFILE_ID}:wrong">`,
        ),
        row,
      ),
    /ID mismatch/,
  )
})

test('follows pagination through the disabled final button and retrieves every detail', async () => {
  const source = Array.from({ length: 101 }, (_, i) => record(`row${i}`))
  const requests = []
  const fetchHtml = fixtureFetcher(source)
  const details = await collectDetails(async (address) => {
    requests.push(address)
    return fetchHtml(address)
  })
  assert.equal(details.length, 101)
  assert.equal(requests.length, 103)
  assert.equal(new URL(requests[1]).searchParams.get('cstart'), '100')
  assert.equal(details[100].title, 'Paper row100')
})

test('rejects CAPTCHA, truncation, missing controls, incorrect counts and repeated pages', async () => {
  assert.throws(
    () =>
      parseList(
        '<html>Our systems have detected unusual traffic from your computer network</html>',
      ),
    /CAPTCHA/,
  )
  assert.throws(() => parseList('<html><div>partial'), /Incomplete/)
  assert.throws(
    () => parseList('<html><body>temporarily unavailable</body></html>'),
    /missing/,
  )
  assert.throws(
    () => parseList(listPage([record('one')], { more: true })),
    /Incomplete/,
  )
  assert.throws(
    () =>
      parseList(listPage([record('one')]).replace('1&ndash;1', '1&ndash;20')),
    /range/,
  )
  const rows = Array.from({ length: 100 }, (_, i) => record(`row${i}`))
  await assert.rejects(
    () =>
      collectDetails(async (address) => {
        const start = Number(new URL(address).searchParams.get('cstart'))
        return start
          ? listPage([rows[0]], { start })
          : listPage(rows, { more: true })
      }),
    /Repeated/,
  )
})

test('stops on HTTP 429 without retries and decodes the declared source charset', async () => {
  let calls = 0
  const blocked = createFetcher({
    delay: 0,
    fetchImpl: async () => {
      calls++
      return new Response('Blocked', { status: 429 })
    },
  })
  await assert.rejects(
    () => blocked('https://scholar.google.com/citations'),
    /HTTP 429/,
  )
  assert.equal(calls, 1)
  const latin = createFetcher({
    delay: 0,
    fetchImpl: async () =>
      new Response(Uint8Array.from([82, 101, 110, 233]), {
        headers: { 'content-type': 'text/html; charset=ISO-8859-1' },
      }),
  })
  assert.equal(await latin('https://scholar.google.com/citations'), 'René')
})

test('new papers receive complete citation/BibTeX; patents and confirmed duplicates stay out', () => {
  const old = record('old')
  const { publications, audit } = snapshot([old])
  const fresh = record('new', {
    fields: {
      Authors: 'Alan Turing, Heye Huang',
      'Publication date': '2026/10',
      Journal: 'arXiv preprint arXiv:2610.12345',
    },
    url: 'https://arxiv.org/abs/2610.12345',
  })
  const duplicate = { ...fresh, scholarUrl: url('duplicate') }
  const patent = record('patent', {
    fields: {
      Inventors: 'Ada Lovelace, Heye Huang',
      'Publication date': '2026/10',
      'Patent office': 'US',
    },
  })
  const result = reconcile(
    publications,
    audit,
    [old, fresh, duplicate, patent],
    day,
  )
  assert.equal(result.publications.length, 2)
  assert.equal(result.summary.added.length, 1)
  assert.equal(result.summary.merged.length, 1)
  assert.equal(result.summary.excluded.length, 1)
  const added = result.publications.find((r) => r.title === fresh.title)
  assert.match(added.bibtex, /eprint = \{2610\.12345\}/)
  assert.match(added.citation, /Alan Turing, Heye Huang/)
  assert.equal(added.type, 'preprint')
  assert.equal(added.codeUrl, undefined)
  assert.equal(added.note, undefined)
  assert.equal(
    samePaper(fresh, {
      ...fresh,
      fields: { ...fresh.fields, Authors: 'Someone Else' },
      url: 'https://arxiv.org/abs/2610.99999',
      title: 'Different paper',
    }),
    false,
  )
})

test('updates Scholar metadata while preserving code, awards, media and publisher overrides', () => {
  const source = record('protected', {
    verifiedOverrides: {
      'Publication date': '2026/11',
      Authors: 'Ada Lovelace, Jinxin Liu, Heye Huang',
      doi: '10.1234/verified',
      source: 'https://publisher.example/article',
    },
  })
  const { publications, audit } = snapshot([source])
  Object.assign(publications[0], {
    codeUrl: 'https://github.com/example/code',
    note: 'Oral Presentation',
    media: [{ type: 'image', src: '/figure.webp', alt: 'Paper figure' }],
  })
  const updated = {
    ...source,
    fields: {
      ...source.fields,
      'Publication date': '2025/12',
      Authors: 'Ada Lovelace, Wrong Author, Heye Huang',
      Volume: '42',
      Pages: '10-20',
    },
  }
  const result = reconcile(publications, audit, [updated], day)
  const item = result.publications[0]
  assert.equal(result.summary.updated.length, 1)
  assert.equal(item.year, 2026)
  assert.equal(item.month, 11)
  assert.deepEqual(item.authors, ['Ada Lovelace', 'Jinxin Liu', 'Heye Huang'])
  assert.match(item.citation, /42, 10-20/)
  assert.equal(item.note, publications[0].note)
  assert.equal(item.codeUrl, publications[0].codeUrl)
  assert.deepEqual(item.media, publications[0].media)
  assert.equal(item.doi, '10.1234/verified')
})

test('manual bibliography edits are retained and source changes are recorded for review', () => {
  const source = record('manual')
  const { publications, audit } = snapshot([source])
  publications[0].year = 2027
  const changed = { ...source, fields: { ...source.fields, Volume: '42' } }
  const result = reconcile(publications, audit, [changed], day)
  assert.deepEqual(result.publications, publications)
  assert.deepEqual(
    result.audit.records[0].pendingSourceChange.protectedFields,
    ['year'],
  )
  assert.equal(result.summary.review.length, 1)
})

test('promotes a confirmed preprint version, retaining the stable key and annotations', () => {
  const preprint = record('preprint', {
    fields: {
      Authors: 'Ada Lovelace, Heye Huang*',
      'Publication date': '2025/10',
      Journal: 'arXiv preprint arXiv:2510.12345',
    },
    url: 'https://arxiv.org/abs/2510.12345',
  })
  const { publications, audit } = snapshot([preprint])
  publications[0].codeUrl = 'https://github.com/example/paper'
  const published = { ...record('journal'), title: preprint.title }
  const result = reconcile(publications, audit, [published, preprint], day)
  assert.equal(result.publications.length, 1)
  assert.equal(result.publications[0].key, publications[0].key)
  assert.equal(result.publications[0].type, 'publication')
  assert.equal(result.publications[0].codeUrl, publications[0].codeUrl)
  assert.equal(result.audit.records[0].decision, 'merge')
  assert.equal(result.audit.records[1].decision, 'include')
})

test('reviewed exclusions remain excluded, and unchanged checks do not generate date-only commits', () => {
  const keep = record('keep')
  const exclude = record('exclude', {
    decision: 'exclude',
    reason: 'Reviewed technical report.',
  })
  const state = snapshot([keep, exclude])
  const result = reconcile(
    state.publications,
    state.audit,
    [keep, exclude],
    '2026-10-25',
  )
  assert.equal(result.summary.changed, false)
  assert.deepEqual(result.audit, state.audit)
  assert.equal(result.publications.length, 1)
})

test('missing known records and incomplete author lists cannot silently change the website', () => {
  const old = record('old')
  const state = snapshot([old])
  assert.throws(
    () =>
      reconcile(state.publications, state.audit, [record('replacement')], day),
    /missing/,
  )
  const row = parseList(listPage([old])).rows[0]
  assert.throws(
    () =>
      parseDetail(
        detailPage({
          ...old,
          fields: { ...old.fields, Authors: 'Ada Lovelace, …' },
        }),
        row,
      ),
    /Truncated author/,
  )
})

test('a detail failure after valid new data leaves both files byte-for-byte unchanged', async (t) => {
  const old = record('old'),
    fresh = record('new')
  const files = await fixtureRoot(t, snapshot([old]))
  const before = await files.contents()
  const fetchHtml = fixtureFetcher([fresh, old])
  await assert.rejects(
    () =>
      runSync({
        root: files.root,
        day,
        fetchHtml: async (address) => {
          if (address === old.scholarUrl) throw new Error('HTTP 429')
          return fetchHtml(address)
        },
      }),
    /HTTP 429/,
  )
  assert.deepEqual(await files.contents(), before)
})

test('dry-run computes additions without writes; a successful sync writes both validated files', async (t) => {
  const old = record('old'),
    fresh = record('new')
  const files = await fixtureRoot(t, snapshot([old]))
  const before = await files.contents()
  const options = {
    root: files.root,
    day,
    fetchHtml: fixtureFetcher([fresh, old]),
  }
  const dry = await runSync({ ...options, dryRun: true })
  assert.equal(dry.added.length, 1)
  assert.deepEqual(await files.contents(), before)
  const result = await runSync(options)
  assert.equal(result.papers, 2)
  const after = (await files.contents()).map(JSON.parse)
  assert.equal(after[0].length, 2)
  assert.equal(after[1].records.length, 2)
})

function apiResponse(parameters, extra) {
  return {
    search_metadata: { status: 'Success' },
    search_parameters: {
      engine: 'google_scholar_author',
      author_id: PROFILE_ID,
      ...parameters,
    },
    ...extra,
  }
}
function apiList(records, start = 0, more = false) {
  return apiResponse(
    { start: String(start) },
    {
      author: { name: 'Heye Huang' },
      articles: records.map((r) => ({
        citation_id: new URL(r.scholarUrl).searchParams.get(
          'citation_for_view',
        ),
        title: r.title,
        link: r.scholarUrl,
        authors: (r.fields.Authors ?? r.fields.Inventors)
          .split(/[,，]/)
          .map((name) =>
            name
              .trim()
              .split(' ')
              .map((part, i, parts) =>
                i === parts.length - 1 ? part : part[0],
              )
              .join(' '),
          )
          .join(', '),
        publication: [
          r.fields.Conference || r.fields.Book || r.fields.Journal,
          r.fields.Volume,
          r.fields.Issue,
          r.fields.Pages,
          r.fields['Publication date'].slice(0, 4),
        ]
          .filter(Boolean)
          .join(' '),
        year: r.fields['Publication date'].slice(0, 4),
      })),
      ...(more
        ? {
            serpapi_pagination: {
              next: `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${PROFILE_ID}&cstart=${start + records.length}`,
            },
          }
        : {}),
    },
  )
}
function apiDetail(r) {
  const names = {
    Authors: 'authors',
    Inventors: 'inventors',
    'Publication date': 'publication_date',
    Journal: 'journal',
    Conference: 'conference',
    Book: 'book',
    Volume: 'volume',
    Issue: 'issue',
    Pages: 'pages',
    Publisher: 'publisher',
    'Patent office': 'patent_office',
    'Application number': 'application_number',
  }
  return apiResponse(
    {
      view_op: 'view_citation',
      citation_id: new URL(r.scholarUrl).searchParams.get('citation_for_view'),
    },
    {
      citation: {
        title: r.title,
        link: r.url,
        ...Object.fromEntries(
          Object.entries(r.fields).map(([name, value]) => [names[name], value]),
        ),
        ...(r.abstractAvailable ? { description: 'Source abstract.' } : {}),
      },
    },
  )
}
function apiFixture(records, requests = []) {
  return async (parameters) => {
    requests.push(parameters)
    if (parameters.citation_id)
      return apiDetail(
        records.find(
          (r) =>
            new URL(r.scholarUrl).searchParams.get('citation_for_view') ===
            parameters.citation_id,
        ),
      )
    const start = Number(parameters.start)
    return apiList(
      records.slice(start, start + 100),
      start,
      start + 100 < records.length,
    )
  }
}

test('SerpApi requires a secret before making a request, and never echoes private error text', async () => {
  let requests = 0
  assert.throws(
    () =>
      createSerpApiClient({
        apiKey: '',
        fetchImpl: () => {
          requests++
        },
      }),
    /SERPAPI_API_KEY/,
  )
  assert.equal(requests, 0)
  const secret = 'private-test-key'
  const failing = createSerpApiClient({
    apiKey: secret,
    fetchImpl: async (address) => {
      throw new Error(address)
    },
  })
  await assert.rejects(
    () => failing({ start: '0' }),
    (error) =>
      !error.message.includes(secret) && !error.message.includes('api_key'),
  )
  const providerError = createSerpApiClient({
    apiKey: secret,
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          error: `Failure https://serpapi.com/search?api_key=${secret}`,
        }),
        { status: 200 },
      ),
  })
  await assert.rejects(
    () => providerError({ start: '0' }),
    (error) =>
      !error.message.includes(secret) &&
      /successful result/.test(error.message),
  )
  const throttled = createSerpApiClient({
    apiKey: secret,
    fetchImpl: async () => {
      requests++
      return new Response('', { status: 429 })
    },
  })
  await assert.rejects(() => throttled({ start: '0' }), /HTTP 429/)
  assert.equal(requests, 1)
})

test('SerpApi parses the documented citation schema without storing abstracts or truncated list authors', () => {
  const source = record('json', {
    fields: {
      Authors: 'Ada Lovelace, Heye Huang*',
      'Publication date': '2026/10',
      Conference: 'Robotics Conference',
      Volume: '5',
      Pages: '1-9',
    },
  })
  const row = parseSerpApiList(apiList([source])).rows[0]
  assert.equal(row.authors, 'A Lovelace, H Huang*')
  const detail = parseSerpApiDetail(apiDetail(source), row)
  assert.equal(detail.fields.Authors, source.fields.Authors)
  assert.equal(detail.fields.Conference, 'Robotics Conference')
  assert.equal(detail.abstractAvailable, true)
  assert.equal(detail.description, undefined)
  const malformed = apiDetail(source)
  malformed.citation.authors = 'Ada Lovelace, …'
  assert.throws(() => parseSerpApiDetail(malformed, row), /truncated/)
})

test('SerpApi rejects wrong profiles, wrong citations, malformed results and untrusted next links', () => {
  const source = record('wrong')
  const profile = apiList([source])
  profile.search_parameters.author_id = 'someone_else'
  assert.throws(() => parseSerpApiList(profile), /unexpected author/)
  assert.throws(
    () => parseSerpApiList(apiResponse({}, { articles: [] })),
    /empty/,
  )
  const partial = apiList([source])
  delete partial.articles[0].year
  assert.throws(() => parseSerpApiList(partial), /incomplete/)
  const next = apiList([source])
  next.serpapi_pagination = {
    next: 'https://example.com/search.json?api_key=private',
  }
  assert.throws(() => parseSerpApiList(next), /pagination/)
  const row = parseSerpApiList(apiList([source])).rows[0]
  const citation = apiDetail(source)
  citation.search_parameters.citation_id = `${PROFILE_ID}:another`
  assert.throws(() => parseSerpApiDetail(citation, row), /unexpected citation/)
  assert.throws(
    () =>
      parseSerpApiList(
        apiList(Array.from({ length: 100 }, (_, i) => record(`full${i}`))),
      ),
    /no next cursor/,
  )
  const badLink = apiList([source])
  badLink.articles[0].link = 'https://serpapi.com/search?api_key=private'
  assert.throws(
    () => parseSerpApiList(badLink),
    (error) =>
      !error.message.includes('private') && /disagree/.test(error.message),
  )
})

test('SerpApi follows validated cstart pagination, seeds audited summaries, and limits detail calls', async () => {
  const records = Array.from({ length: 101 }, (_, i) => record(`json${i}`))
  const state = snapshot(records),
    requests = []
  const result = await collectSerpApiDetails(
    apiFixture(records, requests),
    state.audit,
    state.publications,
    { day },
  )
  assert.equal(result.pages, 2)
  assert.equal(result.detailRequests, 2)
  assert.equal(result.details.length, 101)
  assert.equal(Object.keys(result.state.fingerprints).length, 101)
  assert.equal(requests.length, 4)
  assert.equal(requests[1].start, '100')
  assert.equal(requests[0].num, '100')
  assert.equal(requests[0].sort, 'pubdate')
  assert.ok(requests.every((parameters) => !('api_key' in parameters)))
})

test('SerpApi caches fingerprints, ignores citation counts, and rotates existing detail refreshes', async () => {
  const records = Array.from({ length: 4 }, (_, i) => record(`rotate${i}`))
  const state = snapshot(records)
  const first = await collectSerpApiDetails(
    apiFixture(records),
    state.audit,
    state.publications,
    { day },
  )
  const requests = []
  const next = await collectSerpApiDetails(
    apiFixture(records, requests),
    { ...state.audit, serpApi: first.state },
    state.publications,
    { day },
  )
  assert.equal(next.detailRequests, 2)
  assert.equal(requests[1].citation_id, `${PROFILE_ID}:rotate2`)
  assert.equal(requests[2].citation_id, `${PROFILE_ID}:rotate3`)
  const before = parseSerpApiList(apiList(records)).rows[0].fingerprint
  const response = apiList(records)
  response.articles[0].cited_by = { value: 100000 }
  assert.equal(parseSerpApiList(response).rows[0].fingerprint, before)
})

test('SerpApi retrieves changed summaries and details-only metadata while retaining overrides', async () => {
  const source = record('changes', {
    verifiedOverrides: {
      'Publication date': '2026/11',
      source: 'https://publisher.example/paper',
    },
  })
  const state = snapshot([source])
  const seeded = await collectSerpApiDetails(
    apiFixture([source]),
    state.audit,
    state.publications,
    { day },
  )
  const changed = {
    ...source,
    fields: { ...source.fields, Pages: '10-20', 'Publication date': '2025/12' },
  }
  const request = apiFixture([changed])
  const incoming = await collectSerpApiDetails(
    request,
    { ...state.audit, serpApi: seeded.state },
    state.publications,
    { day },
  )
  const updated = reconcile(
    state.publications,
    state.audit,
    incoming.details,
    day,
  )
  assert.equal(updated.publications[0].year, 2026)
  assert.equal(updated.publications[0].month, 11)
  assert.match(updated.publications[0].citation, /10-20/)
  // Author initials can remain identical; rotating detail refresh still sees
  // a correction that the list fingerprint cannot represent.
  const changedAuthor = {
    ...source,
    fields: { ...source.fields, Authors: 'Alice Lovelace, Heye Huang*' },
  }
  const rotated = await collectSerpApiDetails(
    apiFixture([changedAuthor]),
    { ...state.audit, serpApi: seeded.state },
    state.publications,
    { day },
  )
  assert.equal(rotated.details[0].fields.Authors, changedAuthor.fields.Authors)
})

test('SerpApi queues excess new details without exposing unverified records and resumes next run', async () => {
  const old = record('known'),
    additions = Array.from({ length: 23 }, (_, i) => record(`added${i}`))
  const state = snapshot([old])
  const first = await collectSerpApiDetails(
    apiFixture([old, ...additions]),
    state.audit,
    state.publications,
    { day },
  )
  assert.equal(first.detailRequests, 20)
  assert.equal(first.pendingDetails, 3)
  assert.equal(first.details.length, 21)
  const merged = reconcile(state.publications, state.audit, first.details, day)
  assert.equal(merged.publications.length, 21)
  const next = await collectSerpApiDetails(
    apiFixture([old, ...additions]),
    { ...merged.audit, serpApi: first.state },
    merged.publications,
    { day },
  )
  assert.equal(next.pendingDetails, 0)
  assert.equal(next.detailRequests, 5)
  assert.equal(
    reconcile(merged.publications, merged.audit, next.details, day).publications
      .length,
    24,
  )
})

test('SerpApi fails missing known records before detail costs and preserves files after partial API failure', async (t) => {
  const old = record('known'),
    fresh = record('fresh')
  const state = snapshot([old]),
    requests = []
  await assert.rejects(
    () =>
      collectSerpApiDetails(
        apiFixture([fresh], requests),
        state.audit,
        state.publications,
        { day },
      ),
    /missing/,
  )
  assert.equal(requests.length, 1)
  const files = await fixtureRoot(t, state),
    before = await files.contents()
  const request = apiFixture([old, fresh])
  await assert.rejects(
    () =>
      runSync({
        root: files.root,
        day,
        fetchJson: async (parameters) => {
          if (parameters.citation_id === `${PROFILE_ID}:known`)
            throw new Error('Provider unavailable')
          return request(parameters)
        },
      }),
    /unavailable/,
  )
  assert.deepEqual(await files.contents(), before)
})
