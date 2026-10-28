import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { assetPath, site } from '@/lib/site'
import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { template: '%s - ACES Lab', default: 'ACES Lab - KAIST' },
  description: `${site.fullName} at KAIST. Research on embodied intelligence for safe autonomous vehicles and robots: risk-aware autonomy, world models, and embodied agents.`,
  icons: { icon: assetPath('/brand/aces-mark.png') },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plexMono.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&display=swap"
        />
      </head>
      <body className="bg-white text-gray-950 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
