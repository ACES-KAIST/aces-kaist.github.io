import { clsx } from 'clsx'

type HeadingProps = {
  as?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  dark?: boolean
} & React.ComponentPropsWithoutRef<
  'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

export function Heading({
  className,
  as: Element = 'h2',
  dark = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'text-3xl font-medium tracking-tight text-balance text-gray-950 data-dark:text-white sm:text-5xl',
      )}
    />
  )
}

export function Subheading({
  className,
  as: Element = 'h2',
  dark = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'font-mono text-xs/5 font-medium tracking-[0.18em] text-brand-600 uppercase data-dark:text-signal',
      )}
    />
  )
}

/** Eyebrow, title and optional lead, with an optional action on the right. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  dark = false,
  as = 'h2',
}: {
  eyebrow: string
  title: React.ReactNode
  lead?: React.ReactNode
  action?: React.ReactNode
  dark?: boolean
  as?: 'h1' | 'h2'
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <Subheading as="p" dark={dark}>
          {eyebrow}
        </Subheading>
        <Heading as={as} dark={dark} className="mt-3">
          {title}
        </Heading>
        {lead && (
          <p
            className={clsx(
              'mt-5 text-lg/8 [&_strong]:font-semibold',
              dark
                ? 'text-white/70 [&_strong]:text-white'
                : 'text-gray-600 [&_strong]:text-gray-950',
            )}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function Lead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={clsx(className, 'text-2xl font-medium text-gray-500')}
      {...props}
    />
  )
}
