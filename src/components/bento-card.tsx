'use client'

import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Subheading } from './text'

export function BentoCard({
  dark = false,
  className = '',
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
}: {
  dark?: boolean
  className?: string
  eyebrow: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  graphic: React.ReactNode
  fade?: ('top' | 'bottom')[]
}) {
  return (
    <motion.div
      initial="idle"
      whileHover="active"
      variants={{ idle: {}, active: {} }}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'group relative flex flex-col overflow-hidden rounded-lg',
        'bg-white shadow-xs ring-1 ring-black/5',
        'data-dark:bg-gray-800 data-dark:ring-white/15',
      )}
    >
      <div className="relative px-8 pt-8">
        <Subheading as="div" dark={dark}>
          {eyebrow}
        </Subheading>
        <h3 className="mt-3 text-2xl/8 font-semibold tracking-tight text-gray-950 group-data-dark:text-white lg:min-h-24 xl:min-h-16">
          {title}
        </h3>
      </div>
      <div className="relative mt-4 h-64 shrink-0">
        {graphic}
        {fade.includes('top') && (
          <div className="absolute inset-0 bg-linear-to-b from-white to-50% group-data-dark:from-gray-800 group-data-dark:from-[-25%]" />
        )}
        {fade.includes('bottom') && (
          <div className="absolute inset-0 bg-linear-to-t from-white/70 to-15% group-data-dark:from-gray-800 group-data-dark:from-[-25%] group-data-dark:to-50%" />
        )}
      </div>
      <div className="relative px-8 pt-4 pb-8">
        <p className="max-w-[600px] text-base/7 text-gray-600 group-data-dark:text-gray-400 [&_strong]:font-semibold [&_strong]:text-gray-900">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
