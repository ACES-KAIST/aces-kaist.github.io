// Signalised four-way intersection with vehicles, pedestrians and robots.
// Each agent emits an anisotropic risk field; vehicles slow down for whatever
// sits on their planned path, so the field and the behaviour stay consistent.
// Units: metres and seconds. Origin at the intersection centre, +x east, +y south.

import { buildLut, RiskField, type Kernel, type View } from './field'

type Vec = { x: number; y: number }
type Group = 'NS' | 'EW'
type Light = 'green' | 'yellow' | 'red'
export type AgentKind = 'car' | 'ped' | 'quad' | 'rover' | 'user'

interface Route {
  xs: Float32Array
  ys: Float32Array
  cum: Float32Array
  cap: Float32Array
  length: number
  /** Distance along the route where the agent must wait for its signal. */
  stopS: number
  group: Group
}

interface Agent {
  id: number
  kind: AgentKind
  route: Route | null
  s: number
  seg: number
  v: number
  v0: number
  acc: number
  x: number
  y: number
  h: number
  vx: number
  vy: number
  px: number
  py: number
  alpha: number
  ego: boolean
  waited: number
  phase: number
  state: string
  trail: Vec[]
  trailClock: number
}

const HALF = 7
const LANES = [1.75, 5.25]
const WALK = 9
const STOP = 11.5
const FAR = 150
const CAR_HALF = 2.3

const PHASES: { NS: Light; EW: Light; d: number }[] = [
  { NS: 'green', EW: 'red', d: 11 },
  { NS: 'yellow', EW: 'red', d: 2.5 },
  { NS: 'red', EW: 'red', d: 1.5 },
  { NS: 'red', EW: 'green', d: 11 },
  { NS: 'red', EW: 'yellow', d: 2.5 },
  { NS: 'red', EW: 'red', d: 1.5 },
]
const CYCLE = PHASES.reduce((t, p) => t + p.d, 0)

const APPROACHES: { d: Vec; group: Group }[] = [
  { d: { x: 0, y: 1 }, group: 'NS' },
  { d: { x: 0, y: -1 }, group: 'NS' },
  { d: { x: 1, y: 0 }, group: 'EW' },
  { d: { x: -1, y: 0 }, group: 'EW' },
]

const right = (d: Vec): Vec => ({ x: -d.y, y: d.x })
const left = (d: Vec): Vec => ({ x: d.y, y: -d.x })
const add = (a: Vec, b: Vec, k = 1): Vec => ({ x: a.x + b.x * k, y: a.y + b.y * k })
const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k })

function makeRoute(points: Vec[], caps: number[], stopS: number, group: Group): Route {
  const n = points.length
  const xs = new Float32Array(n)
  const ys = new Float32Array(n)
  const cum = new Float32Array(n)
  const cap = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    xs[i] = points[i].x
    ys[i] = points[i].y
    cap[i] = caps[i]
    if (i > 0) cum[i] = cum[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1])
  }
  return { xs, ys, cum, cap, length: cum[n - 1], stopS, group }
}

function bezier(p0: Vec, p1: Vec, p2: Vec, p3: Vec, steps: number): Vec[] {
  const out: Vec[] = []
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const u = 1 - t
    out.push({
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    })
  }
  return out
}

function carRoute(d: Vec, group: Group, turn: 'S' | 'R' | 'L'): Route {
  const lane = turn === 'R' ? 1 : turn === 'L' ? 0 : Math.random() < 0.5 ? 0 : 1
  const r = right(d)
  const lat = LANES[lane]
  const start = add(mul(d, -FAR), r, lat)
  let d2 = d
  let lat2 = lat
  let enter = HALF
  let curveCap = 99
  if (turn === 'R') {
    d2 = r
    lat2 = LANES[1]
    enter = 10.5
    curveCap = 5
  } else if (turn === 'L') {
    d2 = left(d)
    lat2 = LANES[0]
    curveCap = 7
  }
  const pin = add(mul(d, -enter), r, lat)
  const pout = add(mul(d2, enter), right(d2), lat2)
  const points: Vec[] = [start, pin]
  const caps: number[] = [99, curveCap]
  if (turn !== 'S') {
    const k = 0.55 * Math.hypot(pout.x - pin.x, pout.y - pin.y) * Math.SQRT1_2
    for (const p of bezier(pin, add(pin, d, k), add(pout, d2, -k), pout, 10)) {
      points.push(p)
      caps.push(curveCap)
    }
  }
  points.push(pout, add(pout, d2, FAR))
  caps.push(curveCap, 99)
  return makeRoute(points, caps, FAR - STOP, group)
}

// Pedestrian corners sit on the sidewalks, one per quadrant.
const CORNERS: Vec[] = [
  { x: WALK, y: -WALK },
  { x: -WALK, y: -WALK },
  { x: -WALK, y: WALK },
  { x: WALK, y: WALK },
]

function walkRoute(): Route {
  const c1 = Math.floor(Math.random() * 4)
  // Adjacent corners share a crosswalk; crossing between x-signs crosses the NS road.
  const c2 = (c1 + (Math.random() < 0.5 ? 1 : 3)) % 4
  const a = CORNERS[c1]
  const b = CORNERS[c2]
  const group: Group = Math.sign(a.x) !== Math.sign(b.x) ? 'NS' : 'EW'
  const legIn = Math.random() < 0.5 ? { x: Math.sign(a.x), y: 0 } : { x: 0, y: Math.sign(a.y) }
  const legOut = Math.random() < 0.5 ? { x: Math.sign(b.x), y: 0 } : { x: 0, y: Math.sign(b.y) }
  const o = { x: (Math.random() - 0.5) * 1.4, y: (Math.random() - 0.5) * 1.4 }
  const from = add(add(a, legIn, 14 + Math.random() * 26), o)
  const points = [from, add(a, o), add(b, o), add(add(b, legOut, 34), o)]
  const toCorner = Math.hypot(a.x - from.x + o.x, a.y - from.y + o.y)
  return makeRoute(points, [9, 9, 9, 9], toCorner - 0.2, group)
}

let nextId = 1

function makeAgent(kind: AgentKind, route: Route | null, v0: number): Agent {
  const agent: Agent = {
    id: nextId++,
    kind,
    route,
    s: 0,
    seg: 0,
    v: kind === 'car' ? v0 * 0.85 : v0,
    v0,
    acc: 0,
    x: 0,
    y: 0,
    h: 0,
    vx: 0,
    vy: 0,
    px: 0,
    py: 0,
    alpha: kind === 'car' ? 1 : 0,
    ego: false,
    waited: 0,
    phase: Math.random() * Math.PI * 2,
    state: 'CRUISE',
    trail: [],
    trailClock: 0,
  }
  if (route) place(agent)
  return agent
}

function routePoint(route: Route, s: number, hint = 0) {
  const { cum, xs, ys } = route
  let i = Math.min(hint, cum.length - 2)
  if (cum[i] > s) i = 0
  while (i < cum.length - 2 && cum[i + 1] < s) i++
  const span = cum[i + 1] - cum[i] || 1
  const t = Math.min(1, Math.max(0, (s - cum[i]) / span))
  return {
    x: xs[i] + (xs[i + 1] - xs[i]) * t,
    y: ys[i] + (ys[i + 1] - ys[i]) * t,
    h: Math.atan2(ys[i + 1] - ys[i], xs[i + 1] - xs[i]),
    seg: i,
  }
}

function place(agent: Agent) {
  const p = routePoint(agent.route!, agent.s, agent.seg)
  agent.seg = p.seg
  agent.x = p.x
  agent.y = p.y
  // Ease the heading so turns read as smooth arcs between route samples.
  const dh = Math.atan2(Math.sin(p.h - agent.h), Math.cos(p.h - agent.h))
  agent.h = agent.trailClock === 0 && agent.s === 0 ? p.h : agent.h + dh * 0.35
  agent.vx = Math.cos(p.h) * agent.v
  agent.vy = Math.sin(p.h) * agent.v
}

function kernelFor(a: Agent): Kernel {
  const v = a.v
  switch (a.kind) {
    case 'car':
      return { x: a.x, y: a.y, h: a.h, a: 0.95 * a.alpha, sf: 2.6 + 0.48 * v, sb: 2, sw: 1.3 + 0.03 * v }
    case 'ped':
      return { x: a.x, y: a.y, h: a.h, a: 0.7 * a.alpha, sf: 1 + 0.8 * v, sb: 0.85, sw: 0.85 }
    case 'user':
      return { x: a.x, y: a.y, h: a.h, a: 1 * a.alpha, sf: 1.8 + 0.4 * v, sb: 1.5, sw: 1.5 }
    default:
      return { x: a.x, y: a.y, h: a.h, a: 0.85 * a.alpha, sf: 1.2 + 1 * v, sb: 1, sw: 1 }
  }
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

const HEAT = buildLut([
  [0, [30, 70, 200, 0]],
  [0.08, [36, 90, 230, 0.06]],
  [0.3, [44, 132, 255, 0.2]],
  [0.52, [70, 205, 255, 0.28]],
  [0.72, [245, 184, 74, 0.36]],
  [0.9, [255, 98, 112, 0.48]],
  [1, [255, 120, 136, 0.56]],
])
const LEVELS = [0.16, 0.34, 0.52, 0.7, 0.86]
const LEVEL_COLORS = [
  'rgba(96,150,255,0.30)',
  'rgba(90,209,255,0.42)',
  'rgba(150,232,255,0.55)',
  'rgba(245,184,74,0.70)',
  'rgba(255,107,120,0.85)',
]
const LIGHT_COLORS: Record<Light, string> = {
  green: '#3ee08f',
  yellow: '#f5b84a',
  red: '#ff5a6a',
}

export class TrafficScene {
  private ctx: CanvasRenderingContext2D
  private field = new RiskField(7)
  private base: HTMLCanvasElement | null = null
  private agents: Agent[] = []
  private user: Agent | null = null
  private pointer: { x: number; y: number; t: number } | null = null
  private time = Math.random() * CYCLE
  private spawnClock = [0, 0, 0, 0]
  private width = 0
  private height = 0
  private dpr = 1
  private view: View = { cx: 0, cy: 0, scale: 10 }
  private fieldClock = 0
  private font = 'monospace'

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
    const family = getComputedStyle(canvas).fontFamily
    if (family) this.font = family
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.canvas.width = Math.round(width * this.dpr)
    this.canvas.height = Math.round(height * this.dpr)
    // Wide screens put the junction right of the text; narrow ones below it.
    const wide = width >= 1024
    this.view = wide
      ? { cx: width * 0.7, cy: height * 0.54, scale: Math.max(7.5, Math.min(13, height / 66)) }
      : { cx: width * 0.55, cy: height - 150, scale: 9.5 }
    this.field.resize(width, height)
    this.drawBase()
    if (this.agents.length === 0) this.warmUp()
  }

  /** Run the simulation unseen so the first frame already shows traffic. */
  warmUp(seconds = 24) {
    for (let t = 0; t < seconds; t += 1 / 30) this.step(1 / 30)
    this.fieldClock = 1
  }

  setPointer(x: number, y: number) {
    const now = performance.now()
    const wx = (x - this.view.cx) / this.view.scale
    const wy = (y - this.view.cy) / this.view.scale
    if (!this.user) {
      this.user = makeAgent('user', null, 0)
      this.user.x = wx
      this.user.y = wy
      this.agents.push(this.user)
    }
    if (this.pointer) {
      const dt = Math.max(16, now - this.pointer.t) / 1000
      const vx = (wx - this.user.x) / dt
      const vy = (wy - this.user.y) / dt
      this.user.vx = this.user.vx * 0.8 + vx * 0.2
      this.user.vy = this.user.vy * 0.8 + vy * 0.2
    }
    this.user.x = wx
    this.user.y = wy
    this.pointer = { x, y, t: now }
  }

  clearPointer() {
    this.pointer = null
  }

  private light(group: Group): { state: Light; remaining: number } {
    let t = this.time % CYCLE
    for (const p of PHASES) {
      if (t < p.d) return { state: p[group], remaining: p.d - t }
      t -= p.d
    }
    return { state: 'red', remaining: 0 }
  }

  private walkAllowed(crossed: Group) {
    const other: Group = crossed === 'NS' ? 'EW' : 'NS'
    const l = this.light(other)
    return this.light(crossed).state === 'red' && l.state === 'green' && l.remaining > 4
  }

  private spawn(dt: number) {
    const cars = this.agents.filter((a) => a.kind === 'car').length
    APPROACHES.forEach((ap, i) => {
      this.spawnClock[i] -= dt
      if (this.spawnClock[i] > 0 || cars > 22) return
      const roll = Math.random()
      const turn = roll < 0.62 ? 'S' : roll < 0.82 ? 'R' : 'L'
      const route = carRoute(ap.d, ap.group, turn)
      const blocked = this.agents.some(
        (a) => a.kind === 'car' && Math.hypot(a.x - route.xs[0], a.y - route.ys[0]) < 14,
      )
      this.spawnClock[i] = blocked ? 0.6 : 3.2 + Math.random() * 4.5
      if (blocked) return
      this.agents.push(makeAgent('car', route, 8.5 + Math.random() * 3.5))
    })
    const walkers = this.agents.filter((a) => a.kind === 'ped').length
    const robots = this.agents.filter((a) => a.kind === 'quad' || a.kind === 'rover').length
    if (walkers < 9 && Math.random() < dt * 0.9)
      this.agents.push(makeAgent('ped', walkRoute(), 1.15 + Math.random() * 0.4))
    if (robots < 3 && Math.random() < dt * 0.35) {
      const kind = robots % 2 === 0 ? 'quad' : 'rover'
      this.agents.push(makeAgent(kind, walkRoute(), kind === 'quad' ? 1.55 : 1.25))
    }
    if (!this.agents.some((a) => a.ego)) {
      // Prefer a car that is about to cross the visible part of the junction.
      // Cars from the west spend most of their time under the headline text.
      const candidate = this.agents.find(
        (a) =>
          a.kind === 'car' &&
          a.route!.xs[0] > -FAR + 1 &&
          a.s < a.route!.stopS - 25 &&
          a.s > a.route!.stopS - 70,
      )
      if (candidate) candidate.ego = true
    }
  }

  private predict(dt: number) {
    for (const a of this.agents) {
      if (a.route) {
        const p = routePoint(a.route, a.s + a.v * 1.2, a.seg)
        a.px = p.x
        a.py = p.y
      } else {
        a.px = a.x + a.vx * 0.8
        a.py = a.y + a.vy * 0.8
      }
    }
    if (this.user) {
      const u = this.user
      const speed = Math.hypot(u.vx, u.vy)
      u.v = Math.min(speed, 8)
      if (speed > 0.3) u.h = Math.atan2(u.vy, u.vx)
      if (!this.pointer) {
        u.vx *= 0.9
        u.vy *= 0.9
      }
      u.alpha = Math.max(0, Math.min(1, u.alpha + (this.pointer ? dt * 3 : -dt * 1.5)))
    }
  }

  private driveCar(a: Agent, dt: number) {
    const route = a.route!
    const hx = Math.cos(a.h)
    const hy = Math.sin(a.h)
    let v0 = a.v0
    // Slow down early for the curve ahead.
    const look = 8 + a.v * 3
    for (let i = a.seg; i < route.cum.length && route.cum[i] < a.s + look; i++) {
      const dist = Math.max(0, route.cum[i] - a.s - CAR_HALF)
      v0 = Math.min(v0, Math.sqrt(route.cap[i] ** 2 + 2 * 2.2 * dist))
    }

    const amax = 1.8
    const b = 2.6
    let acc = amax * (1 - (a.v / v0) ** 4)
    let state = v0 < a.v0 - 1 ? 'TURN' : 'CRUISE'
    const constrain = (gap: number, vLead: number, s0: number, label: string) => {
      const sStar = s0 + a.v * 1.1 + (a.v * (a.v - vLead)) / (2 * Math.sqrt(amax * b))
      const c = amax * (1 - (a.v / v0) ** 4 - (sStar / Math.max(gap, 0.1)) ** 2)
      if (c < acc) {
        acc = c
        state = label
      }
    }

    // Signal: stop at the line unless already committed.
    const front = a.s + CAR_HALF
    if (front < route.stopS + 0.3) {
      const l = this.light(route.group).state
      const dist = route.stopS - front
      if (l === 'red' || (l === 'yellow' && dist > (a.v * a.v) / 6 + 1.5))
        constrain(dist, 0, 0.6, l === 'red' ? 'STOP · RED' : 'STOP · AMBER')
    }

    // Anything on, or about to enter, the planned path.
    const stuck = a.waited > 3.5
    const reach = Math.min(70, 6 + a.v * 2.4 + (a.v * a.v) / 5)
    outer: for (let ds = 1.5; ds < reach; ds += 1.5) {
      const sp = a.s + CAR_HALF + ds
      if (sp > route.length) break
      const p = routePoint(route, sp, a.seg)
      for (const o of this.agents) {
        if (o === a || o.alpha < 0.3) continue
        if (stuck && o.kind === 'car' && a.waited > 7) continue
        const rad = o.kind === 'car' ? 2 : o.kind === 'user' ? 2.7 : 2
        const r2 = rad * rad
        const nowHit = (o.x - p.x) ** 2 + (o.y - p.y) ** 2 < r2
        const soonHit = !stuck && o.v > 0.3 && (o.px - p.x) ** 2 + (o.py - p.y) ** 2 < r2
        if (!nowHit && !soonHit) continue
        if ((o.x - a.x) * hx + (o.y - a.y) * hy < 0) continue
        const vLead = nowHit ? Math.max(0, o.vx * hx + o.vy * hy) : 0
        const label =
          o.kind === 'car'
            ? vLead > 1.5
              ? 'FOLLOW'
              : 'YIELD · VEHICLE'
            : o.kind === 'ped'
              ? 'YIELD · PEDESTRIAN'
              : o.kind === 'user'
                ? 'YIELD · YOU'
                : 'YIELD · ROBOT'
        constrain(ds - (o.kind === 'car' ? CAR_HALF : 0.5), vLead, 2, label)
        break outer
      }
    }

    acc = Math.max(-7, Math.min(amax, acc))
    a.acc = acc
    a.v = Math.max(0, a.v + acc * dt)
    a.s += a.v * dt
    a.state = a.v < 0.2 && state === 'CRUISE' ? 'HOLD' : state
    a.waited = a.v < 0.3 && !state.startsWith('STOP') ? a.waited + dt : 0
  }

  private walk(a: Agent, dt: number) {
    const route = a.route!
    let target = a.v0
    if (a.s < route.stopS) {
      const dist = route.stopS - a.s
      if (dist < 0.8 && !this.walkAllowed(route.group)) target = 0
    } else if (a.s < route.stopS + 2 * WALK + 1) {
      target = a.v0 * 1.12
    }
    a.v += (target - a.v) * Math.min(1, dt * 4)
    a.s += a.v * dt
    a.phase += a.v * dt * (a.kind === 'quad' ? 9 : 6)
    a.state = target === 0 ? 'WAIT' : 'WALK'
    const end = route.length - a.s
    a.alpha = Math.max(0, Math.min(1, Math.min(a.alpha + dt * 1.5, end / 4)))
  }

  step(dt: number) {
    this.time += dt
    this.spawn(dt)
    this.predict(dt)
    for (const a of this.agents) {
      if (!a.route) continue
      if (a.kind === 'car') this.driveCar(a, dt)
      else this.walk(a, dt)
      place(a)
      if (a.kind === 'car') {
        a.trailClock += dt
        if (a.trailClock > 0.07) {
          a.trailClock = 0
          a.trail.push({ x: a.x - Math.cos(a.h) * CAR_HALF, y: a.y - Math.sin(a.h) * CAR_HALF })
          if (a.trail.length > 16) a.trail.shift()
        }
      }
    }
    this.agents = this.agents.filter((a) => {
      if (a === this.user) return a.alpha > 0 || this.pointer !== null
      return a.route !== null && a.s < a.route.length - 0.5 && !(a.kind !== 'car' && a.alpha <= 0 && a.s > 5)
    })
    if (this.user && !this.agents.includes(this.user)) this.user = null
  }

  private risk(x: number, y: number, skip: Agent): number {
    let sum = 0
    for (const o of this.agents) {
      if (o === skip) continue
      const k = kernelFor(o)
      const dx = x - k.x
      const dy = y - k.y
      if (Math.abs(dx) > 30 || Math.abs(dy) > 30) continue
      const c = Math.cos(k.h)
      const s = Math.sin(k.h)
      const u = dx * c + dy * s
      const w = -dx * s + dy * c
      const su = u >= 0 ? k.sf : k.sb
      sum += k.a * Math.exp(-0.5 * ((u * u) / (su * su) + (w * w) / (k.sw * k.sw)))
    }
    return 1 - Math.exp(-sum * 1.1)
  }

  private toScreen(x: number, y: number): [number, number] {
    return [x * this.view.scale + this.view.cx, y * this.view.scale + this.view.cy]
  }

  private drawBase() {
    const base = (this.base ??= document.createElement('canvas'))
    base.width = this.canvas.width
    base.height = this.canvas.height
    const ctx = base.getContext('2d')!
    const { width: w, height: h } = this
    const { cx, cy, scale: k } = this.view
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.8)
    bg.addColorStop(0, '#0c1a3a')
    bg.addColorStop(0.55, '#081330')
    bg.addColorStop(1, '#040a1a')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Survey grid every 5 m, heavier every 25 m.
    ctx.lineWidth = 1
    for (const [step, alpha] of [
      [5, 0.035],
      [25, 0.07],
    ] as const) {
      ctx.strokeStyle = `rgba(140,170,255,${alpha})`
      ctx.beginPath()
      const g = step * k
      for (let x = cx % g; x < w; x += g) {
        ctx.moveTo(Math.round(x) + 0.5, 0)
        ctx.lineTo(Math.round(x) + 0.5, h)
      }
      for (let y = cy % g; y < h; y += g) {
        ctx.moveTo(0, Math.round(y) + 0.5)
        ctx.lineTo(w, Math.round(y) + 0.5)
      }
      ctx.stroke()
    }

    // City blocks in the four quadrants, laid out like a cadastral map.
    let seed = 7
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    ctx.lineWidth = 1
    for (const sx of [-1, 1])
      for (const sy of [-1, 1])
        for (let bx = 13; bx < 140; bx += 19)
          for (let by = 13; by < 90; by += 17) {
            if (rand() < 0.18) continue
            const bw = 9 + rand() * 7
            const bh = 8 + rand() * 6
            const x0 = sx > 0 ? bx : -bx - bw
            const y0 = sy > 0 ? by : -by - bh
            const [px, py] = this.toScreen(x0, y0)
            if (px > w + 50 || py > h + 50 || px + bw * k < -50 || py + bh * k < -50) continue
            roundedRect(ctx, px, py, bw * k, bh * k, 2)
            ctx.fillStyle = 'rgba(130,160,230,0.035)'
            ctx.fill()
            ctx.strokeStyle = 'rgba(130,160,230,0.09)'
            ctx.stroke()
          }

    // Carriageways and sidewalks.
    const road = HALF * k
    ctx.fillStyle = 'rgba(120,150,220,0.07)'
    ctx.fillRect(0, cy - road, w, road * 2)
    ctx.fillRect(cx - road, 0, road * 2, h)
    ctx.fillStyle = 'rgba(120,150,220,0.035)'
    const side = 11 * k
    ctx.fillRect(0, cy - side, w, side - road)
    ctx.fillRect(0, cy + road, w, side - road)
    ctx.fillRect(cx - side, 0, side - road, h)
    ctx.fillRect(cx + road, 0, side - road, h)

    const line = (x0: number, y0: number, x1: number, y1: number) => {
      const [a, b] = this.toScreen(x0, y0)
      const [c, d] = this.toScreen(x1, y1)
      ctx.moveTo(a, b)
      ctx.lineTo(c, d)
    }
    const far = 200
    // Curbs, broken at the junction.
    ctx.strokeStyle = 'rgba(150,180,255,0.28)'
    ctx.beginPath()
    for (const s of [-1, 1]) {
      line(-far, s * HALF, -HALF, s * HALF)
      line(HALF, s * HALF, far, s * HALF)
      line(s * HALF, -far, s * HALF, -HALF)
      line(s * HALF, HALF, s * HALF, far)
    }
    ctx.stroke()
    // Lane dividers (dashed) and the yellow centre line (double, solid).
    ctx.setLineDash([3 * k, 3 * k])
    ctx.strokeStyle = 'rgba(220,230,255,0.16)'
    ctx.beginPath()
    for (const s of [-1, 1]) {
      line(-far, s * 3.5, -STOP, s * 3.5)
      line(STOP, s * 3.5, far, s * 3.5)
      line(s * 3.5, -far, s * 3.5, -STOP)
      line(s * 3.5, STOP, s * 3.5, far)
    }
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(245,184,74,0.32)'
    ctx.beginPath()
    for (const o of [-0.15, 0.15]) {
      line(-far, o, -STOP, o)
      line(STOP, o, far, o)
      line(o, -far, o, -STOP)
      line(o, STOP, o, far)
    }
    ctx.stroke()
    // Zebra crossings on all four arms.
    ctx.fillStyle = 'rgba(220,230,255,0.10)'
    for (let t = -HALF + 0.4; t < HALF - 0.4; t += 1.1) {
      for (const s of [-1, 1]) {
        let [x, y] = this.toScreen(t, s > 0 ? 7.6 : -10.6)
        ctx.fillRect(x, y, 0.55 * k, 3 * k)
        ;[x, y] = this.toScreen(s > 0 ? 7.6 : -10.6, t)
        ctx.fillRect(x, y, 3 * k, 0.55 * k)
      }
    }
  }

  draw(dt: number) {
    const ctx = this.ctx
    const { scale: k } = this.view
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    if (this.base) ctx.drawImage(this.base, 0, 0, this.width, this.height)

    this.fieldClock -= dt
    if (this.fieldClock <= 0) {
      this.field.compute(this.agents.map(kernelFor), this.view, 1.1)
      this.fieldClock = 1 / 30
    }
    this.field.drawHeat(ctx, HEAT)
    this.field.drawContours(ctx, LEVELS, LEVEL_COLORS, 1)

    // Signal heads and their stop bars.
    for (const ap of APPROACHES) {
      const l = this.light(ap.group).state
      const color = LIGHT_COLORS[l]
      const r = right(ap.d)
      const [x0, y0] = this.toScreen(-ap.d.x * STOP, -ap.d.y * STOP)
      const [x1, y1] = this.toScreen(-ap.d.x * STOP + r.x * HALF, -ap.d.y * STOP + r.y * HALF)
      ctx.strokeStyle = color
      ctx.globalAlpha = l === 'green' ? 0.35 : 0.55
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x1, y1)
      ctx.stroke()
      const [sx, sy] = this.toScreen(
        -ap.d.x * (STOP + 0.6) + r.x * (HALF + 1.4),
        -ap.d.y * (STOP + 0.6) + r.y * (HALF + 1.4),
      )
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 1.6 * k)
      glow.addColorStop(0, color)
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalAlpha = 0.45
      ctx.fillStyle = glow
      ctx.fillRect(sx - 1.6 * k, sy - 1.6 * k, 3.2 * k, 3.2 * k)
      ctx.globalAlpha = 1
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(sx, sy, Math.max(2.5, 0.42 * k), 0, Math.PI * 2)
      ctx.fill()
    }

    // Tail-light trails.
    ctx.lineWidth = Math.max(1, 0.18 * k)
    ctx.lineCap = 'round'
    for (const a of this.agents) {
      if (a.kind !== 'car' || a.trail.length < 2) continue
      for (let i = 1; i < a.trail.length; i++) {
        const [x0, y0] = this.toScreen(a.trail[i - 1].x, a.trail[i - 1].y)
        const [x1, y1] = this.toScreen(a.trail[i].x, a.trail[i].y)
        ctx.strokeStyle = a.ego ? 'rgb(90,209,255)' : 'rgb(255,96,120)'
        ctx.globalAlpha = (i / a.trail.length) * 0.35
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1

    const ego = this.agents.find((a) => a.ego)
    if (ego) this.drawPlan(ego)
    for (const a of this.agents) this.drawAgent(a)
    if (ego) this.drawTag(ego, ['EGO VEHICLE', `${ego.v.toFixed(1)} m/s · ${ego.state}`], '#5ad1ff')
    for (const a of this.agents)
      if ((a.kind === 'quad' || a.kind === 'rover') && a.alpha > 0.6)
        this.drawTag(a, [a.kind === 'quad' ? 'QUADRUPED' : 'DELIVERY ROBOT', `${a.v.toFixed(1)} m/s · ${a.state}`], '#b9a4ff')
    if (this.user && this.user.alpha > 0.05) this.drawTag(this.user, ['YOU', 'risk source'], '#ffffff')
  }

  private drawPlan(ego: Agent) {
    const ctx = this.ctx
    const route = ego.route!
    const k = this.view.scale
    ctx.save()
    // Perception range rings.
    const [ex, ey] = this.toScreen(ego.x, ego.y)
    ctx.strokeStyle = 'rgba(90,209,255,0.10)'
    ctx.lineWidth = 1
    for (const r of [10, 20, 30]) {
      ctx.beginPath()
      ctx.arc(ex, ey, r * k, 0, Math.PI * 2)
      ctx.stroke()
    }
    // Planned path.
    ctx.setLineDash([4, 5])
    ctx.strokeStyle = 'rgba(90,209,255,0.7)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    const horizon = Math.min(route.length, ego.s + 12 + ego.v * 3.5)
    for (let s = ego.s + CAR_HALF; s <= horizon; s += 1) {
      const p = routePoint(route, s, ego.seg)
      const [x, y] = this.toScreen(p.x, p.y)
      if (s === ego.s + CAR_HALF) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.setLineDash([])
    // Predicted footprints, coloured by the risk other agents put there.
    for (let i = 1; i <= 6; i++) {
      const s = ego.s + Math.max(ego.v, 2) * 0.5 * i
      if (s > route.length) break
      const p = routePoint(route, s, ego.seg)
      const r = this.risk(p.x, p.y, ego)
      const [x, y] = this.toScreen(p.x, p.y)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(p.h)
      ctx.globalAlpha = 0.75 - i * 0.09
      ctx.strokeStyle = r > 0.55 ? '#ff6b78' : r > 0.3 ? '#f5b84a' : '#5ad1ff'
      ctx.lineWidth = 1
      roundedRect(ctx, -CAR_HALF * k, -0.95 * k, CAR_HALF * 2 * k, 1.9 * k, 0.5 * k)
      ctx.stroke()
      ctx.restore()
    }
    ctx.restore()
  }

  private drawAgent(a: Agent) {
    const ctx = this.ctx
    const k = this.view.scale
    const [x, y] = this.toScreen(a.x, a.y)
    if (x < -60 || y < -60 || x > this.width + 60 || y > this.height + 60) return
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(a.h)
    ctx.globalAlpha = a.alpha
    switch (a.kind) {
      case 'car': {
        const L = CAR_HALF * k
        const W = 0.95 * k
        // Headlight throw.
        const beam = ctx.createLinearGradient(L, 0, L + 7 * k, 0)
        beam.addColorStop(0, a.ego ? 'rgba(90,209,255,0.22)' : 'rgba(255,244,220,0.14)')
        beam.addColorStop(1, 'rgba(255,244,220,0)')
        ctx.fillStyle = beam
        ctx.beginPath()
        ctx.moveTo(L, -W * 0.8)
        ctx.lineTo(L + 7 * k, -W * 2.2)
        ctx.lineTo(L + 7 * k, W * 2.2)
        ctx.lineTo(L, W * 0.8)
        ctx.fill()
        if (a.ego) {
          ctx.shadowColor = 'rgba(90,209,255,0.9)'
          ctx.shadowBlur = 14
        }
        roundedRect(ctx, -L, -W, L * 2, W * 2, 0.45 * k)
        ctx.fillStyle = a.ego ? '#7fe3ff' : 'rgba(222,231,255,0.92)'
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = 'rgba(8,19,48,0.55)'
        ctx.fillRect(0.35 * k, -W * 0.72, 0.55 * k, W * 1.44)
        ctx.fillRect(-1.55 * k, -W * 0.66, 0.4 * k, W * 1.32)
        if (a.acc < -0.8) {
          ctx.fillStyle = '#ff4d63'
          ctx.shadowColor = '#ff4d63'
          ctx.shadowBlur = 8
          ctx.fillRect(-L - 0.5, -W * 0.85, 1.5, W * 0.45)
          ctx.fillRect(-L - 0.5, W * 0.4, 1.5, W * 0.45)
          ctx.shadowBlur = 0
        }
        break
      }
      case 'ped': {
        ctx.fillStyle = 'rgba(236,241,255,0.95)'
        ctx.beginPath()
        ctx.arc(0, 0, Math.max(2.4, 0.3 * k), 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(236,241,255,0.35)'
        ctx.beginPath()
        ctx.arc(0, 0, Math.max(4.5, 0.62 * k), 0, Math.PI * 2)
        ctx.stroke()
        break
      }
      case 'quad': {
        const s = Math.max(1, k / 9)
        const gait = Math.sin(a.phase) * 1.6 * s
        ctx.fillStyle = '#b9a4ff'
        for (const [lx, ly, sign] of [
          [5, -3.4, 1],
          [5, 3.4, -1],
          [-5, -3.4, -1],
          [-5, 3.4, 1],
        ] as const) {
          ctx.beginPath()
          ctx.arc(lx * s + gait * sign, ly * s, 1.3 * s, 0, Math.PI * 2)
          ctx.fill()
        }
        roundedRect(ctx, -6 * s, -2.6 * s, 12 * s, 5.2 * s, 2.2 * s)
        ctx.fill()
        ctx.fillStyle = '#e6deff'
        ctx.beginPath()
        ctx.arc(7 * s, 0, 1.9 * s, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'rover': {
        const s = Math.max(1, k / 9)
        ctx.fillStyle = '#9f86ff'
        for (const lx of [-3.6, 0, 3.6])
          for (const ly of [-3.9, 3.9]) ctx.fillRect(lx * s - 1.2 * s, ly * s - 0.8 * s, 2.4 * s, 1.6 * s)
        roundedRect(ctx, -5 * s, -3.4 * s, 10 * s, 6.8 * s, 1.8 * s)
        ctx.fillStyle = '#c8b9ff'
        ctx.fill()
        ctx.strokeStyle = 'rgba(8,19,48,0.45)'
        ctx.beginPath()
        ctx.moveTo(1.5 * s, -3.4 * s)
        ctx.lineTo(1.5 * s, 3.4 * s)
        ctx.stroke()
        break
      }
      case 'user': {
        const pulse = 1 + Math.sin(performance.now() / 300) * 0.12
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(0, 0, 0.9 * k * pulse, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(0, 0, Math.max(2.5, 0.3 * k), 0, Math.PI * 2)
        ctx.fill()
        break
      }
    }
    ctx.restore()
  }

  /** Keep labels out of the area covered by the hero text. */
  private clearOfText(x: number, y: number) {
    return this.width >= 1024 ? x > this.width * 0.5 : y > this.height * 0.74
  }

  private drawTag(a: Agent, lines: string[], color: string) {
    const ctx = this.ctx
    const [x, y] = this.toScreen(a.x, a.y)
    if (x < 0 || y < 0 || x > this.width - 150 || y > this.height) return
    if (!this.clearOfText(x, y)) return
    ctx.save()
    ctx.globalAlpha = a.alpha
    ctx.font = `500 10.5px ${this.font}`
    const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 14
    const h = lines.length * 14 + 8
    const tx = x + 16
    const ty = y - h - 14
    ctx.strokeStyle = color
    ctx.globalAlpha = a.alpha * 0.5
    ctx.beginPath()
    ctx.moveTo(x + 3, y - 3)
    ctx.lineTo(tx, ty + h)
    ctx.stroke()
    ctx.globalAlpha = a.alpha
    roundedRect(ctx, tx, ty, w, h, 3)
    ctx.fillStyle = 'rgba(5,11,26,0.78)'
    ctx.fill()
    ctx.strokeStyle = color
    ctx.globalAlpha = a.alpha * 0.55
    ctx.stroke()
    ctx.globalAlpha = a.alpha
    lines.forEach((l, i) => {
      ctx.fillStyle = i === 0 ? color : 'rgba(226,234,255,0.85)'
      ctx.fillText(l, tx + 7, ty + 15 + i * 14)
    })
    ctx.restore()
  }
}
