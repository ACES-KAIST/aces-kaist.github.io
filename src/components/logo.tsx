import { assetPath } from '@/lib/site'
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
        'inline-flex items-center gap-2 text-xl leading-none font-semibold tracking-tight whitespace-nowrap sm:gap-2.5 sm:text-2xl',
        isLight ? 'text-white' : 'text-gray-950',
        className,
      )}
    >
      <img
        src={assetPath('/lab-sign.svg')}
        width={68}
        height={62}
        alt=""
        className="block h-9 w-auto shrink-0 sm:h-11"
      />
      <span className="leading-none">ACES Lab</span>
    </span>
  )
}

export const Mark = Logo
