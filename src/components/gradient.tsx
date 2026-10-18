import { assetPath } from '@/lib/site'
import { clsx } from 'clsx'

export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className)}
      style={{
        backgroundImage: `url(${assetPath('/Background_Blue.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-xl transform-gpu md:right-0',
          'rotate-[-10deg] rounded-full opacity-50 blur-3xl',
        )}
        style={{
          backgroundImage: `url(${assetPath('/Background_Blue.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </div>
  )
}
