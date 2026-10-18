# ACES Lab website

Website for the Autonomous Cognitive and Embodied Systems Lab at KAIST, adapted from the Stanford ASL website. Lab information is based on [Heye Huang’s homepage](https://huangheye.github.io/). Publications were checked against Google Scholar and publication sources; see [Publication sources and maintenance](docs/PUBLICATIONS.md). The campus address is based on official KAIST pages; the lab confirmed its room as F335.

## Local development

Use Node.js 22 or later.

```bash
npm ci
npm run dev
```

## Build and publish

```bash
npm run build
```

The static website is exported to `out/`. The GitHub Actions workflow deploys it to GitHub Pages and automatically configures the path for a user, organization, or project website.

After configuring the `SERPAPI_API_KEY` repository secret, publications are checked through SerpApi every Monday at 09:17 Korea time. The updater preserves manually verified metadata and starts a Pages deployment after a successful sync. See [Publication sources and maintenance](docs/PUBLICATIONS.md) for setup, manual runs, and source-access failures.

See [GitHub Pages 操作说明](docs/GITHUB_PAGES_ZH.md) for repository setup, publishing, and content updates. See [Photo maintenance](scripts/photo-assets.md) for photo selection and processing.

The homepage and Research page share their direction names and descriptions in `src/data/research.tsx`, based on the lab introduction poster supplied on 18 October 2026. Research 1 uses the LEAD video from Heye Huang’s homepage; Research 2 uses the Risk-Controllable Multi-View Diffusion figure; Research 3 uses the embodied-agent animation, now with a light palette. All three research sections have white backgrounds.

Hardware includes the G1 and Go2 reference photographs from the original template, plus the lab's autonomous vehicle and driving simulator photographs. Asset sources and description scope are recorded in [Hardware maintenance](docs/HARDWARE.md). Original license terms remain in [LICENSE.md](LICENSE.md).
