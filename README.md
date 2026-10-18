# ACES Lab website

Website for the Autonomous Cognitive and Embodied Systems Lab at KAIST, adapted from the Stanford ASL website. Content is based on [Heye Huang’s homepage](https://huangheye.github.io/).

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

Research illustrations and the temporary Unitree G1 photograph are credited on their pages. Original license terms remain in [LICENSE.md](LICENSE.md).
