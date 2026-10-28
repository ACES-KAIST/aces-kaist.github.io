import { assetPath, site } from '@/lib/site'
import { clsx } from 'clsx'

// Light-lettered copy of the lab logo for the navy navbar and footer.
// The original, on a white ground, is public/brand/aces-logo.webp.
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={assetPath('/brand/aces-logo-dark.webp')}
      width={1200}
      height={321}
      alt={`${site.name}, ${site.fullName}`}
      className={clsx('block w-auto', className ?? 'h-11 lg:h-13')}
    />
  )
}
