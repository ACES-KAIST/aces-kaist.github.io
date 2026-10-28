import { assetPath } from '@/lib/site'
import { Container } from './container'
import { FieldBackdrop } from './risk-field/backdrop'
import { SubTabs, type SubTab } from './sub-tabs'

export function PageHeader({
  eyebrow,
  title,
  lead,
  image,
  imagePosition = 'center',
  tabs,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  lead?: React.ReactNode
  /** Optional photograph shown under a navy wash. */
  image?: string
  imagePosition?: string
  tabs?: SubTab[]
  children?: React.ReactNode
}) {
  return (
    <>
      <header className="relative isolate overflow-hidden bg-navy-950 text-white">
        {image && (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-20 bg-cover opacity-60 grayscale-[35%]"
              style={{
                backgroundImage: `url('${assetPath(image)}')`,
                backgroundPosition: imagePosition,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-20 bg-linear-to-r from-navy-950 via-navy-950/85 to-navy-950/50"
            />
          </>
        )}
        <div className="absolute inset-0 -z-10">
          <FieldBackdrop className="size-full" />
        </div>
        <Container className="pt-36 pb-16 sm:pt-40 sm:pb-20">
          <p className="font-mono text-xs tracking-[0.2em] text-signal uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl/[1.08] font-medium tracking-tight text-balance sm:text-6xl/[1.04]">
            {title}
          </h1>
          {lead && (
            <div className="mt-6 max-w-3xl text-lg/8 text-white/70 sm:text-xl/8 [&_strong]:font-semibold [&_strong]:text-white">
              {lead}
            </div>
          )}
          {children}
        </Container>
      </header>
      {tabs && <SubTabs items={tabs} />}
    </>
  )
}
