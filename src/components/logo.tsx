import { clsx } from 'clsx'

export function Logo({
  className,
  isLight = false,
}: {
  className?: string
  isLight?: boolean
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center text-2xl font-semibold tracking-tight whitespace-nowrap',
        isLight ? 'text-white' : 'text-gray-950',
        className,
      )}
    >
      ACES Lab
    </span>
  )
}

export const Mark = Logo
