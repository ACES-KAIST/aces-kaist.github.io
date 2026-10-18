import { PlusGrid, PlusGridItem, PlusGridRow } from '@/components/plus-grid'
import { Container } from './container'

export function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-2 rounded-4xl bg-white/80" />
      <Container className="relative">
        <PlusGrid className="py-8">
          <PlusGridRow className="flex justify-between">
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
            </PlusGridItem>
          </PlusGridRow>
        </PlusGrid>
      </Container>
    </footer>
  )
}
