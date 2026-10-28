// Scalar risk field on a coarse screen-space grid, drawn as a soft heat map
// plus iso-risk contour lines. World units are metres; the caller supplies the
// metre-to-pixel transform.

export interface Kernel {
  x: number
  y: number
  /** Heading in radians; the field stretches forward along it. */
  h: number
  /** Peak amplitude before the probabilistic union below. */
  a: number
  /** Spread ahead of the agent, behind it, and to either side (metres). */
  sf: number
  sb: number
  sw: number
}

export interface View {
  cx: number
  cy: number
  scale: number
}

export type Rgba = [number, number, number, number]

export function buildLut(stops: [number, Rgba][]): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256 * 4)
  for (let i = 0; i < 256; i++) {
    const t = i / 255
    let k = 0
    while (k < stops.length - 2 && t > stops[k + 1][0]) k++
    const [t0, c0] = stops[k]
    const [t1, c1] = stops[k + 1]
    const f = Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1)))
    for (let c = 0; c < 3; c++) lut[i * 4 + c] = c0[c] + (c1[c] - c0[c]) * f
    lut[i * 4 + 3] = (c0[3] + (c1[3] - c0[3]) * f) * 255
  }
  return lut
}

// Marching-squares edge pairs for each of the 16 corner cases.
// Edges: 0 top, 1 right, 2 bottom, 3 left.
const CASES: number[][] = [
  [],
  [3, 2],
  [2, 1],
  [3, 1],
  [0, 1],
  [3, 0, 2, 1],
  [0, 2],
  [3, 0],
  [3, 0],
  [0, 2],
  [0, 1, 3, 2],
  [0, 1],
  [3, 1],
  [2, 1],
  [3, 2],
  [],
]

export class RiskField {
  readonly cell: number
  gw = 0
  gh = 0
  values = new Float32Array(0)
  private sum = new Float32Array(0)
  private wx = new Float32Array(0)
  private wy = new Float32Array(0)
  private image: ImageData | null = null
  private canvas: HTMLCanvasElement | null = null
  private view: View = { cx: 0, cy: 0, scale: 1 }

  constructor(cellPx: number) {
    this.cell = cellPx
  }

  resize(width: number, height: number) {
    this.gw = Math.ceil(width / this.cell) + 2
    this.gh = Math.ceil(height / this.cell) + 2
    this.values = new Float32Array(this.gw * this.gh)
    this.sum = new Float32Array(this.gw * this.gh)
    this.wx = new Float32Array(this.gw)
    this.wy = new Float32Array(this.gh)
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.gw
    this.canvas.height = this.gh
    this.image = new ImageData(this.gw, this.gh)
  }

  compute(kernels: Kernel[], view: View, gain = 1) {
    const { gw, gh, cell, sum, wx, wy } = this
    this.view = view
    for (let i = 0; i < gw; i++) wx[i] = (i * cell - view.cx) / view.scale
    for (let j = 0; j < gh; j++) wy[j] = (j * cell - view.cy) / view.scale
    sum.fill(0)

    for (const k of kernels) {
      if (k.a <= 0.001) continue
      const reach = 3.1 * Math.max(k.sf, k.sb, k.sw)
      const i0 = Math.max(0, Math.floor(((k.x - reach) * view.scale + view.cx) / cell))
      const i1 = Math.min(gw - 1, Math.ceil(((k.x + reach) * view.scale + view.cx) / cell))
      const j0 = Math.max(0, Math.floor(((k.y - reach) * view.scale + view.cy) / cell))
      const j1 = Math.min(gh - 1, Math.ceil(((k.y + reach) * view.scale + view.cy) / cell))
      if (i0 > i1 || j0 > j1) continue
      const cos = Math.cos(k.h)
      const sin = Math.sin(k.h)
      const isf = 1 / (k.sf * k.sf)
      const isb = 1 / (k.sb * k.sb)
      const isw = 1 / (k.sw * k.sw)
      for (let j = j0; j <= j1; j++) {
        const dy = wy[j] - k.y
        const row = j * gw
        for (let i = i0; i <= i1; i++) {
          const dx = wx[i] - k.x
          const u = dx * cos + dy * sin
          const w = -dx * sin + dy * cos
          const e = 0.5 * (u * u * (u >= 0 ? isf : isb) + w * w * isw)
          if (e < 4.8) sum[row + i] += k.a * Math.exp(-e)
        }
      }
    }

    const values = this.values
    for (let n = 0; n < values.length; n++) values[n] = 1 - Math.exp(-sum[n] * gain)
  }

  /** Field value at a world point, from the last computed grid. */
  sample(x: number, y: number): number {
    const fx = (x * this.view.scale + this.view.cx) / this.cell
    const fy = (y * this.view.scale + this.view.cy) / this.cell
    const i = Math.floor(fx)
    const j = Math.floor(fy)
    if (i < 0 || j < 0 || i >= this.gw - 1 || j >= this.gh - 1) return 0
    const tx = fx - i
    const ty = fy - j
    const v = this.values
    const n = j * this.gw + i
    const top = v[n] * (1 - tx) + v[n + 1] * tx
    const bottom = v[n + this.gw] * (1 - tx) + v[n + this.gw + 1] * tx
    return top * (1 - ty) + bottom * ty
  }

  drawHeat(
    ctx: CanvasRenderingContext2D,
    lut: Uint8ClampedArray,
    composite: GlobalCompositeOperation = 'lighter',
  ) {
    if (!this.image || !this.canvas) return
    const data = this.image.data
    const values = this.values
    for (let n = 0; n < values.length; n++) {
      const l = Math.min(255, Math.round(values[n] * 255)) * 4
      const p = n * 4
      data[p] = lut[l]
      data[p + 1] = lut[l + 1]
      data[p + 2] = lut[l + 2]
      data[p + 3] = lut[l + 3]
    }
    this.canvas.getContext('2d')!.putImageData(this.image, 0, 0)
    ctx.save()
    ctx.globalCompositeOperation = composite
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    const half = this.cell / 2
    ctx.drawImage(this.canvas, -half, -half, this.gw * this.cell, this.gh * this.cell)
    ctx.restore()
  }

  drawContours(
    ctx: CanvasRenderingContext2D,
    levels: number[],
    colors: string[],
    lineWidth = 1,
  ) {
    const { gw, gh, cell, values: v } = this
    const lowest = levels[0]
    const paths = levels.map(() => new Path2D())
    for (let j = 0; j < gh - 1; j++) {
      for (let i = 0; i < gw - 1; i++) {
        const n = j * gw + i
        const tl = v[n]
        const tr = v[n + 1]
        const br = v[n + gw + 1]
        const bl = v[n + gw]
        if (tl < lowest && tr < lowest && br < lowest && bl < lowest) continue
        const x = i * cell
        const y = j * cell
        for (let l = 0; l < levels.length; l++) {
          const t = levels[l]
          const index =
            (tl >= t ? 8 : 0) | (tr >= t ? 4 : 0) | (br >= t ? 2 : 0) | (bl >= t ? 1 : 0)
          const edges = CASES[index]
          if (edges.length === 0) continue
          for (let e = 0; e < edges.length; e += 2) {
            const a = edgePoint(edges[e], x, y, cell, tl, tr, br, bl, t)
            const b = edgePoint(edges[e + 1], x, y, cell, tl, tr, br, bl, t)
            paths[l].moveTo(a[0], a[1])
            paths[l].lineTo(b[0], b[1])
          }
        }
      }
    }
    ctx.save()
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    for (let l = 0; l < levels.length; l++) {
      ctx.strokeStyle = colors[l]
      ctx.stroke(paths[l])
    }
    ctx.restore()
  }
}

function edgePoint(
  edge: number,
  x: number,
  y: number,
  c: number,
  tl: number,
  tr: number,
  br: number,
  bl: number,
  t: number,
): [number, number] {
  const f = (a: number, b: number) => (t - a) / (b - a || 1e-6)
  switch (edge) {
    case 0:
      return [x + c * f(tl, tr), y]
    case 1:
      return [x + c, y + c * f(tr, br)]
    case 2:
      return [x + c * f(bl, br), y + c]
    default:
      return [x, y + c * f(tl, bl)]
  }
}
