import { PlusGrid, PlusGridItem, PlusGridRow } from '@/components/plus-grid'
import { Container } from './container'
import { SocialLinks } from './logo-cloud'

export function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-2 rounded-4xl bg-white/80" />
      <Container className="relative">
        <PlusGrid className="py-8">
          <PlusGridRow className="flex flex-wrap justify-between gap-x-8">
            <PlusGridItem className="py-3">
              <a
                href="https://www.kaist.ac.kr/en/"
                className="text-base font-semibold"
              >
                KAIST
              </a>
              <p className="text-sm/6 text-gray-950">
                &copy; {new Date().getFullYear()} ACES Lab, KAIST
              </p>
              <p className="mt-1 text-xs/5 text-gray-500">
                Website adapted from{' '}
                <a
                  href="https://github.com/StanfordASL/stanfordasl.github.io"
                  className="underline underline-offset-2"
                >
                  Stanford ASL
                </a>
                .
              </p>
            </PlusGridItem>
            <PlusGridItem className="flex items-center py-3">
              <SocialLinks />
            </PlusGridItem>
          </PlusGridRow>
        </PlusGrid>
      </Container>
    </footer>
  )
}
