'use client'

import { clsx } from 'clsx'
import { useId, type CSSProperties, type ReactNode } from 'react'

// Perception, reasoning, and action share an eight-second animation cycle.
const VW = 760
const VH = 800
const CYCLE_S = 8
const PHASE_S = CYCLE_S / 4 // perceive / reason / act / feedback

// Inline Heroicons (24x24 outline) + one hand-drawn robot glyph.
const ICONS: Record<string, ReactNode> = {
  vision: (
    <>
      <path d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </>
  ),
  depth: (
    <path d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
  ),
  state: (
    <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  ),
  language: (
    <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  ),
  agent: (
    <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  ),
  memory: (
    <path d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
  ),
  sim: (
    <path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  ),
  planning: (
    <path d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
  ),
  robot: (
    <>
      <path d="M12 4.6v3.4" />
      <circle cx="12" cy="3.4" r="1.2" />
      <rect x="5.5" y="8" width="13" height="10.4" rx="2.6" />
      <circle cx="9.4" cy="12.6" r="1.15" />
      <circle cx="14.6" cy="12.6" r="1.15" />
      <path d="M9.6 15.7h4.8" />
      <path d="M5.5 12.2H4M18.5 12.2H20" />
    </>
  ),
}

// Reusable rounded chip with an icon + one or two text lines.
function Chip({
  x,
  y,
  w,
  h,
  icon,
  label,
  sublabel,
  labelSize = 17,
  className,
  style,
}: {
  x: number
  y: number
  w: number
  h: number
  icon: ReactNode
  label: string
  sublabel?: string
  labelSize?: number
  className?: string
  style?: CSSProperties
}) {
  const iconSize = 23
  const iconX = x + 16
  const iconY = y + h / 2 - iconSize / 2
  const textX = iconX + iconSize + 12
  return (
    <g className={className} style={style}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth={1.2}
      />
      <svg
        x={iconX}
        y={iconY}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0369A1"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
      <text
        x={textX}
        y={sublabel ? y + h / 2 - 5 : y + h / 2 + 1}
        fill="#0F172A"
        fontSize={labelSize}
        fontWeight={600}
        dominantBaseline="middle"
      >
        {label}
      </text>
      {sublabel ? (
        <text
          x={textX}
          y={y + h / 2 + 14}
          fill="#475569"
          fontSize={12.5}
          dominantBaseline="middle"
        >
          {sublabel}
        </text>
      ) : null}
    </g>
  )
}

function Caption({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <text
      x={x}
      y={y}
      fill="#0369A1"
      fontSize={13}
      fontWeight={700}
      letterSpacing={2.4}
      textAnchor="middle"
    >
      {children}
    </text>
  )
}

// ---- layout geometry (single vertical axis at x = 340) ----
const AXIS = 340

const SENSOR_W = 196
const SENSOR_H = 62
const SENSORS = [
  { key: 'vision', label: 'Vision', sub: 'RGB cameras', x: 136, y: 100 },
  { key: 'depth', label: 'Depth', sub: 'LiDAR + range', x: 348, y: 100 },
  { key: 'state', label: 'Proprioception', sub: 'joint + body state', x: 136, y: 176 },
  { key: 'language', label: 'Language', sub: 'task instructions', x: 348, y: 176 },
] as const

// faint container around the perception chips (feedback arrow targets this)
const PBOX = { x: 120, y: 86, w: 444, h: 168 }

const CORE = { x: 188, y: 350, w: 304, h: 122 }
const CORE_CX = CORE.x + CORE.w / 2
const CORE_CY = CORE.y + CORE.h / 2

const TOOL_X = 540
const TOOL_W = 172
const TOOL_H = 46
const TOOLS = [
  { key: 'memory', label: 'Spatial memory', y: CORE_CY - 81 },
  { key: 'sim', label: 'Simulation', y: CORE_CY - 23 },
  { key: 'planning', label: 'Planning', y: CORE_CY + 35 },
] as const

const ROBOT = { x: AXIS - 140, y: 600, w: 280, h: 96 }

// stage delays (negative => phase offset within the shared cycle)
const DELAY_PERCEIVE = '0s'
const DELAY_REASON = `${-PHASE_S}s`
const DELAY_ACT = `${-2 * PHASE_S}s`

export function EmbodiedAgentLoop({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const coreGlowId = `eal-core-${uid}`
  const gridId = `eal-grid-${uid}`
  const arrowFbId = `eal-arrow-fb-${uid}`
  const arrowToolId = `eal-arrow-tool-${uid}`
  const arrowActId = `eal-arrow-act-${uid}`

  const feedbackPath = `M${ROBOT.x + 44} ${ROBOT.y + ROBOT.h} C 150 748, 64 720, 64 596 L 64 250 C 64 152, 86 ${PBOX.y + 78}, ${PBOX.x - 8} ${PBOX.y + 82}`

  return (
    <div
      role="img"
      aria-label="An embodied agent loop: multi-modal perception (vision, depth, proprioception, language) feeds an agent that reasons and calls tools (spatial memory, simulation, planning), produces an action for a robot, and observes the result, closing the loop."
      className={clsx(
        'relative h-full w-full overflow-hidden rounded-2xl',
        'bg-white ring-1 ring-slate-200',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(56,189,248,0.06),transparent_40%),radial-gradient(circle_at_50%_52%,rgba(59,130,246,0.08),transparent_46%),radial-gradient(circle_at_50%_86%,rgba(20,184,166,0.05),transparent_44%)]" />

      <svg viewBox={`0 0 ${VW} ${VH}`} className="relative size-full" style={{ fontFamily: 'inherit' }}>
        <defs>
          <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgba(100,116,139,0.08)" strokeWidth="1" />
          </pattern>
          <radialGradient id={coreGlowId}>
            <stop offset="0%" stopColor="rgba(56,189,248,0.16)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0)" />
          </radialGradient>
          <marker id={arrowActId} markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#0369A1" />
          </marker>
          <marker id={arrowFbId} markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#0F766E" />
          </marker>
          <marker id={arrowToolId} markerWidth="8" markerHeight="8" refX="6" refY="2.6" orient="auto">
            <path d="M0,0 L6,2.6 L0,5.2 Z" fill="#64748B" />
          </marker>
        </defs>

        <rect x="0" y="0" width={VW} height={VH} fill={`url(#${gridId})`} opacity={0.6} />

        {/* ambient halo behind the agent core */}
        <circle cx={CORE_CX} cy={CORE_CY} r={158} fill={`url(#${coreGlowId})`} className="eal-halo" />

        {/* ---- feedback / embodiment loop: starts at the robot box, ends at the perception box ---- */}
        <path
          d={feedbackPath}
          fill="none"
          stroke="#0F766E"
          strokeWidth={1.9}
          strokeDasharray="7 7"
          className="eal-flow-fb"
          markerEnd={`url(#${arrowFbId})`}
        />
        <text
          transform={`rotate(-90 42 ${(PBOX.y + ROBOT.y) / 2})`}
          x={42}
          y={(PBOX.y + ROBOT.y) / 2}
          fill="#0F766E"
          fontSize={13}
          fontWeight={700}
          letterSpacing={2.4}
          textAnchor="middle"
        >
          WORLD FEEDBACK
        </text>

        {/* perception group box */}
        <rect
          x={PBOX.x}
          y={PBOX.y}
          width={PBOX.w}
          height={PBOX.h}
          rx={20}
          fill="#F8FAFC"
          stroke="#94A3B8"
          strokeWidth={1.2}
          strokeDasharray="2 5"
        />

        {/* ---- perceive -> reason links (solid base + flowing overlay), drawn before the box so it hides them ---- */}
        {SENSORS.map((s) => {
          const sx = s.x + SENSOR_W / 2
          const sy = s.y + SENSOR_H
          const d = `M${sx} ${sy} C ${sx} ${sy + 60}, ${CORE_CX} ${CORE.y - 45}, ${CORE_CX} ${CORE.y}`
          return (
            <g key={`lnk-${s.key}`}>
              <path d={d} fill="none" stroke="#5B87A4" strokeWidth={1.4} />
              <path d={d} fill="none" stroke="#0284C7" strokeWidth={1.5} strokeLinecap="round" className="eal-pulse" />
            </g>
          )
        })}

        {/* ---- agent -> tool links (single arrowhead at the tool end) ---- */}
        {TOOLS.map((t) => {
          const x1 = CORE.x + CORE.w
          const y1 = CORE_CY
          const x2 = TOOL_X - 2
          const y2 = t.y + TOOL_H / 2
          return (
            <g key={`tl-${t.key}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748B" strokeWidth={1.3} markerEnd={`url(#${arrowToolId})`} />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0284C7" strokeWidth={1.4} strokeLinecap="round" className="eal-pulse" style={{ animationDelay: DELAY_REASON }} />
            </g>
          )
        })}

        {/* ---- reason -> act link ---- */}
        <line
          x1={AXIS}
          y1={CORE.y + CORE.h}
          x2={AXIS}
          y2={ROBOT.y - 2}
          stroke="#5B87A4"
          strokeWidth={1.7}
          markerEnd={`url(#${arrowActId})`}
        />
        <line
          x1={AXIS}
          y1={CORE.y + CORE.h}
          x2={AXIS}
          y2={ROBOT.y - 2}
          stroke="#0284C7"
          strokeWidth={1.6}
          strokeLinecap="round"
          className="eal-pulse"
          style={{ animationDelay: DELAY_ACT }}
        />

        {/* ---- captions ---- */}
        <Caption x={AXIS} y={74}>
          01 · PERCEIVE
        </Caption>
        <Caption x={CORE_CX} y={332}>
          02 · REASON
        </Caption>
        {/* 03 caption: the separator dot sits exactly on the action arrow */}
        <text x={AXIS - 12} y={584} fill="#0369A1" fontSize={13} fontWeight={700} letterSpacing={2.4} textAnchor="end">
          03
        </text>
        <circle cx={AXIS} cy={580} r={2.4} fill="#0369A1" />
        <text x={AXIS + 12} y={584} fill="#0369A1" fontSize={13} fontWeight={700} letterSpacing={2.4} textAnchor="start">
          ACT
        </text>
        <text x={AXIS + 16} y={(CORE.y + CORE.h + ROBOT.y) / 2 + 4} fill="#0369A1" fontSize={13.5} fontWeight={600}>
          action
        </text>
        <text x={TOOL_X + TOOL_W / 2} y={TOOLS[0].y - 18} fill="#475569" fontSize={12} fontWeight={700} letterSpacing={2.2} textAnchor="middle">
          TOOL USE
        </text>

        {/* ---- perception sensors (pulse together: beat 1) ---- */}
        {SENSORS.map((s) => (
          <Chip
            key={s.key}
            x={s.x}
            y={s.y}
            w={SENSOR_W}
            h={SENSOR_H}
            icon={ICONS[s.key]}
            label={s.label}
            sublabel={s.sub}
            className="eal-node"
            style={{ animationDelay: DELAY_PERCEIVE }}
          />
        ))}

        {/* ---- agent core (breathes continuously: always reasoning) ---- */}
        <g className="eal-core">
          <rect
            x={CORE.x}
            y={CORE.y}
            width={CORE.w}
            height={CORE.h}
            rx={20}
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth={1.6}
          />
          <svg
            x={CORE.x + 24}
            y={CORE_CY - 17}
            width={34}
            height={34}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0369A1"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS.agent}
          </svg>
          <text x={CORE.x + 72} y={CORE_CY - 7} fill="#0F172A" fontSize={23} fontWeight={700}>
            Embodied agent
          </text>
          <text x={CORE.x + 72} y={CORE_CY + 18} fill="#475569" fontSize={14}>
            grounded reasoning · tool use
          </text>
        </g>

        {/* ---- tools (pulse: beat 2, fired by the agent) ---- */}
        {TOOLS.map((t) => (
          <Chip
            key={t.key}
            x={TOOL_X}
            y={t.y}
            w={TOOL_W}
            h={TOOL_H}
            icon={ICONS[t.key]}
            label={t.label}
            labelSize={14.5}
            className="eal-node"
            style={{ animationDelay: DELAY_REASON }}
          />
        ))}

        {/* ---- robot embodiment (pulse: beat 3) ---- */}
        <g className="eal-node" style={{ animationDelay: DELAY_ACT }}>
          <rect
            x={ROBOT.x}
            y={ROBOT.y}
            width={ROBOT.w}
            height={ROBOT.h}
            rx={18}
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth={1.4}
          />
          <svg
            x={ROBOT.x + 24}
            y={ROBOT.y + ROBOT.h / 2 - 17}
            width={34}
            height={34}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0369A1"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS.robot}
          </svg>
          <text x={ROBOT.x + 72} y={ROBOT.y + ROBOT.h / 2 - 6} fill="#0F172A" fontSize={19} fontWeight={600}>
            Robot embodiment
          </text>
          <text x={ROBOT.x + 72} y={ROBOT.y + ROBOT.h / 2 + 16} fill="#475569" fontSize={13}>
            acts in the physical world
          </text>
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />

      <style jsx>{`
        @keyframes eal-flow {
          to {
            stroke-dashoffset: -28;
          }
        }
        @keyframes eal-flow-fb {
          to {
            stroke-dashoffset: -28;
          }
        }
        @keyframes eal-node {
          0%,
          7% {
            opacity: 0.9;
            transform: scale(1);
          }
          13% {
            opacity: 1;
            transform: scale(1.035);
          }
          26%,
          100% {
            opacity: 0.9;
            transform: scale(1);
          }
        }
        @keyframes eal-breathe {
          0%,
          100% {
            opacity: 0.94;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
        @keyframes eal-halo {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.95;
          }
        }

        .eal-pulse {
          stroke-dasharray: 4 11;
          animation: eal-flow 1.5s linear infinite;
          will-change: stroke-dashoffset;
        }
        .eal-flow-fb {
          animation: eal-flow-fb 2.2s linear infinite;
          will-change: stroke-dashoffset;
        }
        .eal-node {
          transform-box: fill-box;
          transform-origin: center;
          animation: eal-node ${CYCLE_S}s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .eal-core {
          transform-box: fill-box;
          transform-origin: center;
          animation: eal-breathe 4.5s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .eal-halo {
          animation: eal-halo 4.5s ease-in-out infinite;
          will-change: opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .eal-pulse {
            animation: none;
            stroke-dasharray: none;
            opacity: 0;
          }
          .eal-flow-fb {
            animation: none;
          }
          .eal-node,
          .eal-core,
          .eal-halo {
            animation: none;
            transform: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
