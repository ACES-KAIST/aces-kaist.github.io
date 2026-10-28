'use client'

import { motion, useReducedMotion } from 'framer-motion'

// Fades content up the first time it scrolls into view.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }
      }
    >
      {children}
    </motion.div>
  )
}
