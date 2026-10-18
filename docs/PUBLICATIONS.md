# Publication sources and maintenance

The publication list was checked on **18 October 2026** against [Heye Huang’s Google Scholar profile](https://scholar.google.com/citations?user=BWUpn24AAAAJ&hl=en).

## Coverage

The request used `cstart=0`, `pagesize=100`, and `sortby=pubdate`. Scholar returned 93 records and a disabled **Show more** button. All 93 record-detail pages were retrieved. The website includes **75 distinct research papers: 60 publications and 15 preprints**.

- Ten duplicate records were merged: one preprint/journal pair and nine translated or alternate-title records. The published version and the most complete English metadata were retained.
- Five research reports/data management plans and three patent/application records were excluded from the paper tabs.
- [publication-source-audit.json](./publication-source-audit.json) preserves all 93 source titles, bibliographic fields, source URLs, inclusion decisions, and merge targets. No citation counts are stored.

## Display and source rules

`src/data/publications.json` is the build input. Builds do not contact Google Scholar or a publisher.

- Each entry has a citation icon that opens its citation and BibTeX, with copy controls.
- Each abstract icon opens the verified source abstract in a new tab. Abstracts are not fabricated or reproduced locally. Scholar’s record-detail page is used when the article target is a PDF or a search-results link.
- Code icons appear only for links found on the professor’s homepage, a Scholar record description, or the author’s code repository. All ten existing code links were retained; CoEM and the vehicle dynamics model repository were added from those sources.
- Awards and presentation notes remain visible below the author/venue line. The six existing notes, including **Oral Presentation**, are retained from the professor’s homepage.
- Corresponding-author and equal-contribution markers are displayed when supplied by the source. These markers are removed from citation and BibTeX author fields.
- Bibliographic fields missing from a source remain omitted. BibTeX is formatted from verified metadata; no volume, pages, DOI, or author name is guessed.

## Metadata conflicts resolved

Scholar sometimes keeps the first preprint/online year after a journal record is added. Publisher metadata takes precedence where verified:

- **SMART:** the publisher lists October 2026, volume 191, article 105793, DOI `10.1016/j.trc.2026.105793`. Its final author list includes Jinxin Liu as the fifth author; the Scholar/preprint list still has Xiaopeng Li. The website uses the final publisher list.
- **Learning from Risk:** publisher-deposited Crossref metadata lists 2026, volume 215, article 105110, DOI `10.1016/j.tre.2026.105110`. The journal version replaces the former preprint entry.
- **RiskNet:** Crossref lists the January 2026 issue, volume 205, article 104478, DOI `10.1016/j.tre.2025.104478`. A DOI containing 2025 does not imply a 2025 issue year.
- **REACT:** the professor’s publication list gives 2026; Scholar retains its December 2025 online date. The website retains the 2026 bibliography year.
- **Risk-Controllable Multi-View Diffusion:** the author’s arXiv record identifies **CVPR Workshops (VGBE)**; the website does not label it as a main-conference paper.
- **Adaptive Drift Control:** the author’s repository gives the final June 2024 journal citation, DOI `10.1109/TIE.2023.3294594`. Scholar retains the 2023 online date.

Other records retain the publication date and bibliographic fields in the retrieved Scholar detail page. Online-first and issue years can differ. The source audit records the original values and every explicit override. Some publisher pages were unavailable through the research browser, and Crossref rate-limited additional checks; no blocked endpoint was repeatedly retried.

## Automatic updates

The **Update publications** workflow in `.github/workflows/update-publications.yml` runs every **Monday at 09:17 Korea time** (00:17 UTC). GitHub may delay scheduled jobs. Repository maintainers can also start it from **Actions → Update publications → Run workflow**. Changes to the updater script or workflow also trigger a run on `main`. GitHub disables scheduled workflows in public repositories after 60 days without repository activity; if that happens, re-enable this workflow from the Actions page.

The workflow uses Node.js 22, [SerpApi's Google Scholar Author API](https://serpapi.com/google-scholar-author-api), and the repository's `GITHUB_TOKEN`. Add your SerpApi key under **Settings → Secrets and variables → Actions → New repository secret**, with the exact name **`SERPAPI_API_KEY`**. Do not put the key in source files or send it in chat. The API account's quota and plan apply; see [SerpApi pricing](https://serpapi.com/pricing). The code does not create an account or purchase a plan. Without a configured key, the command makes no network request and explains which secret is missing.

The workflow runs the source checks, publication tests and site build before committing changed publication data to `main`. It then explicitly starts the Pages deployment workflow. This dispatch is necessary because a push made with `GITHUB_TOKEN` does not itself start another push-triggered workflow. The repository must allow Actions to write contents and run workflows, and any branch protection must allow this bot commit. No data changes means no new commit.

`scripts/sync-publications.mjs` requests the complete profile list through SerpApi, 100 articles per page, sorted by publication date. It compares title, author summary, publication and year fingerprints, excluding citation counts. Only new or changed records require new citation details. Two existing records are also refreshed in rotation each run, within the same request budget, to detect details such as full author names that might change without altering the list summary. The static site continues to use checked-in JSON; ordinary site builds make no external bibliography requests.

On the first API run, an existing source record can reuse its previously audited detail when the title, year, abbreviated author list and venue agree. This seeds the fingerprints without rereading all 93 detail pages. A normal unchanged run for the current profile uses **one list request and two detail requests**. Any first-run mismatch is checked through the citation endpoint. Requests are limited to **five list pages and 20 citation details per run**. Additional new or changed records are queued in the source audit for subsequent runs; a paper is never added before its full detail has been retrieved and validated. Existing queued papers retain their displayed metadata.

```sh
# Set SERPAPI_API_KEY in your local environment before using these commands.
# Fetch the profile and selected citation details without modifying files.
npm run publications:sync -- --dry-run

# Fetch and update the checked-in publication records and source audit.
npm run publications:sync

# Run deterministic regression tests without network access.
npm run publications:test
```

`--check` is an alias for `--dry-run`. A dry run still uses API requests but does not save the cache or data. Successful commands exit with status 0 and print a JSON summary of additions, updates, merges, exclusions, records requiring review, request counts and queued details. A dry run can report proposed changes without treating them as a failure. The fingerprints, detail refresh dates, queue and rotation cursor are stored under `serpApi` in the source audit.

### What is updated

- New papers receive full author metadata from the detail page, date, venue, citation, BibTeX, paper link and source abstract link. The script does not invent an abstract, code repository, award, image, DOI or missing bibliographic field.
- Existing Scholar metadata is updated when it changes and still agrees with the last source snapshot. Manually supplied code links, awards, presentation notes, images and supplementary sources remain in place.
- The `verifiedOverrides` in `docs/publication-source-audit.json` take precedence over Scholar for fields such as issue dates, authors, venue and DOI. The six corrections documented above remain protected.
- Other manual bibliography edits are detected by comparing the current entry with its previous generated source metadata. A conflicting Scholar change is saved as `pendingSourceChange` in the audit for review; the displayed paper remains unchanged.
- A repeated DOI or arXiv identifier, or an identical normalized title and complete author list, identifies a duplicate. A confirmed published version can replace its preprint while retaining its website key and annotations. Existing reviewed merges and exclusions are preserved. Translations with different titles and no shared identifier still need manual verification.
- Clearly identified patents, research reports and data management plans remain outside the paper tabs. A new record without a research-paper venue is recorded for review rather than being presented as a paper.

### Failures and manual review

If SerpApi returns an HTTP error, an unsuccessful JSON status, malformed data, truncated authors, incomplete pagination or a missing previously audited item, the command fails **before writing either data file**. HTTP 429 can reflect a request or quota limit; check the service dashboard before rerunning. A full 100-row page without a next-page cursor is treated as ambiguous and stops for review, including the boundary case of a profile with exactly 100 records. A missing old record can also indicate a legitimate merge or deletion on Scholar; check that change before updating its audit entry. These checks prevent an empty or partial API response from replacing the deployed bibliography.

There are no automatic retries, direct Google Scholar scraping fallbacks or CAPTCHA workarounds. API keys and raw provider errors are not printed. Check failed runs in **Actions → Update publications**; the existing website remains available. The adapter follows the documented [article](https://serpapi.com/google-scholar-author-articles) and [citation](https://serpapi.com/google-scholar-author-citation) schemas. Tests use mocked API responses; the first credentialed run should be checked after adding the repository secret.

For a manual correction, update the publication and its audit together. Add source-backed field corrections to `verifiedOverrides` and include a `source` URL. Resolve `pendingSourceChange` only after checking the cited source; then update the stored source fields and remove that pending field. New code links and awards should have a verifiable source. Run the tests and build before pushing.
