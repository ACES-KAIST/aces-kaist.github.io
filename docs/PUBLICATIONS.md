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

## Future updates

1. Read the complete Scholar list, following **Show more** until disabled. Stop if access is blocked; do not bypass CAPTCHA.
2. Read new or changed record details and check the article/publisher source when metadata conflicts.
3. Merge translated titles and preprint/journal versions only when their authors, subject, and publication identifiers establish that they are the same work. Keep reports and patents outside the paper tabs.
4. Update the local records and source audit. Preserve verified award/code information from the professor’s homepage unless newer evidence replaces it.
5. Check that every entry has an author list, year, citation, BibTeX and source link, then run the project build and check the publication tabs and copy controls.
