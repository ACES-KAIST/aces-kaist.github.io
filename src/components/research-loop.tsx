'use client'

import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import { useState } from 'react'
import { Link } from './link'
import { Reveal } from './reveal'
import { Subheading } from './text'

export interface LoopStep {
  id: string
  verb: string
  text: string
  /** Title of the research direction this step leads to. */
  title: string
}

// Ring colours on the navy diagram, and matching colours on the white list.
const TONES = [
  { ring: '#7aa2ff', text: 'text-brand-600', badge: 'bg-brand-50 text-brand-700 ring-brand-100' },
  { ring: '#5ad1ff', text: 'text-cyan-700', badge: 'bg-cyan-50 text-cyan-700 ring-cyan-100' },
  { ring: '#b9a4ff', text: 'text-violet-600', badge: 'bg-violet-50 text-violet-700 ring-violet-100' },
]

// Nodes sit on a circle of radius 132 around (200, 200), at -90°, 30° and 150°.
// Lower labels sit outward and below the bottom arc.
const NODES = [
  { x: 200, y: 68, labelX: 200, labelY: 30 },
  { x: 314.3, y: 266, labelX: 336, labelY: 342 },
  { x: 85.7, y: 266, labelX: 64, labelY: 342 },
]
// Clockwise arcs between the nodes, stopping short of each node.
const ARCS = [
  'M 238.6 73.8 A 132 132 0 0 1 328.6 229.7',
  'M 290 296.5 A 132 132 0 0 1 110 296.5',
  'M 71.4 229.7 A 132 132 0 0 1 161.4 73.8',
]
const ORBIT = 'M 200 68 A 132 132 0 0 1 200 332 A 132 132 0 0 1 200 68'
// One lap of the travelling dot; it passes a node every third of a lap.
const LAP = 9

function LoopDiagram({ steps, active }: { steps: LoopStep[]; active: number | null }) {
  return (
    <svg viewBox="0 0 400 372" aria-hidden="true" className="relative w-full overflow-visible">
      <defs>
        {ARCS.map((_, i) => {
          const from = NODES[i]
          const to = NODES[(i + 1) % 3]
          return (
            <linearGradient
              key={i}
              id={`loop-arc-${i}`}
              gradientUnits="userSpaceOnUse"
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
            >
              <stop offset="0" stopColor={TONES[i].ring} />
              <stop offset="1" stopColor={TONES[(i + 1) % 3].ring} />
            </linearGradient>
          )
        })}
        {TONES.map((tone, i) => (
          <marker
            key={i}
            id={`loop-head-${i}`}
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={tone.ring} />
          </marker>
        ))}
        <radialGradient id="loop-spark">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#5ad1ff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5ad1ff" stopOpacity="0" />
        </radialGradient>
        <path id="loop-feedback" d="M 51.9 234.2 A 152 152 0 0 1 155.6 54.6" />
      </defs>

      <circle cx="200" cy="200" r="132" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="18" />
      <circle cx="200" cy="200" r="78" fill="none" stroke="white" strokeOpacity="0.1" strokeDasharray="2 5" />

      {ARCS.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={`url(#loop-arc-${i})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={i === 2 ? '5 5' : undefined}
          markerEnd={`url(#loop-head-${(i + 1) % 3})`}
        />
      ))}
      <text className="fill-white/45 font-mono text-[10px] tracking-[0.18em] uppercase">
        <textPath href="#loop-feedback" startOffset="50%" textAnchor="middle">
          Outcomes feed back
        </textPath>
      </text>

      <g className="motion-reduce:hidden">
        <circle r="11" fill="url(#loop-spark)" />
        <circle r="2.5" fill="white" />
        <animateMotion dur={`${LAP}s`} repeatCount="indefinite" path={ORBIT} />
      </g>

      {NODES.map((node, i) => {
        const tone = TONES[i]
        const on = active === i
        return (
          <g key={i}>
            <circle
              cx={node.x}
              cy={node.y}
              r="28"
              fill="none"
              stroke={tone.ring}
              strokeWidth="1.5"
              opacity="0"
              className="motion-reduce:hidden"
            >
              <animate
                attributeName="r"
                values="28;50;50"
                keyTimes="0;0.18;1"
                dur={`${LAP}s`}
                begin={`${(i * LAP) / 3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0;0"
                keyTimes="0;0.18;1"
                dur={`${LAP}s`}
                begin={`${(i * LAP) / 3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={node.x}
              cy={node.y}
              r="40"
              fill={tone.ring}
              className={clsx('transition-opacity duration-300', on ? 'opacity-20' : 'opacity-0')}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="26"
              fill="#081330"
              stroke={tone.ring}
              strokeWidth={on ? 2.5 : 1.5}
              className="transition-[stroke-width] duration-300"
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fill={tone.ring}
              className="font-mono text-[12px] font-medium"
            >
              0{i + 1}
            </text>
            <text
              x={node.labelX}
              y={node.labelY}
              textAnchor="middle"
              className={clsx(
                'text-[14px] font-medium transition-[fill] duration-300 [paint-order:stroke] [stroke-linejoin:round]',
                on ? 'fill-white' : 'fill-white/80',
              )}
              stroke="#050b1a"
              strokeWidth="6"
            >
              {steps[i].verb}
            </text>
          </g>
        )
      })}

      <text x="200" y="196" textAnchor="middle" className="fill-signal font-mono text-[10px] tracking-[0.22em] uppercase">
        Embodied agent
      </text>
      <text x="200" y="216" textAnchor="middle" className="fill-white/60 text-[12px]">
        in the physical world
      </text>
    </svg>
  )
}

// The three research directions drawn as one closed loop of embodied intelligence.
export function ResearchLoop({ steps }: { steps: LoopStep[] }) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <div className="relative isolate mx-auto max-w-md overflow-hidden rounded-3xl bg-navy-950 px-8 py-10 shadow-2xl shadow-navy-950/20 lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(140,170,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(140,170,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,108,246,0.3),transparent_60%)]"
          />
          <LoopDiagram steps={steps} active={active} />
        </div>
      </Reveal>
      <div className="lg:col-span-7">
        <Subheading as="p">One loop, three directions</Subheading>
        <h2 className="mt-3 text-3xl/tight font-medium tracking-tight text-balance text-gray-950 sm:text-4xl/tight">
          Perceive, predict and act, then learn from what happens.
        </h2>
        <p className="mt-4 max-w-xl text-base/7 text-gray-600">
          Our three research directions are stages of one embodied loop. What
          happens in the physical world feeds back into how we assess risk and
          model the world.
        </p>
        <ol className="mt-8 space-y-1">
          {steps.map((step, i) => (
            <li key={step.id}>
              <Link
                href={`#${step.id}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={clsx(
                  'group -mx-4 grid grid-cols-[auto_1fr_auto] items-start gap-x-5 rounded-2xl px-4 py-5 transition focus-visible:outline-none',
                  active === i && 'bg-gray-50',
                )}
              >
                <span
                  className={clsx(
                    'flex size-10 items-center justify-center rounded-full font-mono text-xs font-medium ring-1 ring-inset',
                    TONES[i].badge,
                  )}
                >
                  0{i + 1}
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-tight text-gray-950">
                    {step.verb}
                  </span>
                  <span className="mt-1 block text-sm/6 text-gray-600">{step.text}</span>
                  <span className={clsx('mt-2 block text-sm font-medium', TONES[i].text)}>
                    {step.title}
                  </span>
                </span>
                <ArrowRightIcon className="mt-2.5 size-5 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-900" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
