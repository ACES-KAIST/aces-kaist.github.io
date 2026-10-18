# ACES Lab website

Website for the Autonomous Cognitive and Embodied Systems Lab at KAIST, adapted from the Stanford ASL website. Lab information is based on [Heye Huang’s homepage](https://huangheye.github.io/). Publications were checked against Google Scholar and publication sources; see [Publication sources and maintenance](docs/PUBLICATIONS.md). The contact address is based on official KAIST faculty and campus pages.

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

See [GitHub Pages 操作说明](docs/GITHUB_PAGES_ZH.md) for repository setup, publishing, and content updates. See [Photo maintenance](scripts/photo-assets.md) for photo selection and processing.

Research 1 uses the LEAD video from Heye Huang’s homepage; Research 2 uses the Risk-Controllable Multi-View Diffusion figure. The original embodied-agent animation, research header background, and Unitree G1 reference photograph remain from the template. Source notes are kept in [the maintenance guide](docs/GITHUB_PAGES_ZH.md), without captions on the pages. The G1 photograph is still awaiting replacement. Original license terms remain in [LICENSE.md](LICENSE.md).
