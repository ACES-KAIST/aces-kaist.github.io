export const site = {
  name: 'ACES Lab',
  fullName: 'Autonomous Cognitive and Embodied Systems Lab',
  institution: 'KAIST',
  department: 'Cho Chun Shik Graduate School of Mobility',
  director: 'Heye Huang',
  email: 'heye.huang@kaist.ac.kr',
  homepage: 'https://huangheye.github.io/',
  scholar: 'https://scholar.google.com/citations?user=BWUpn24AAAAJ&hl=en&oi=ao',
} as const

// Next Link handles basePath itself; ordinary image/video URLs need this helper.
export function assetPath(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`
}
