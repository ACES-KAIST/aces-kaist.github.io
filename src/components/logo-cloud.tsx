import { site } from '@/lib/site'
import { clsx } from 'clsx'

export function SocialLinks({
  className,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        'flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium',
        className,
      )}
    >
      <a
        href={`mailto:${site.email}`}
        className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950"
      >
        Email
      </a>
      <a
        href={site.scholar}
        className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950"
      >
        Google Scholar
      </a>
      <a
        href={site.homepage}
        className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950"
      >
        Heye Huang
      </a>
    </div>
  )
}
