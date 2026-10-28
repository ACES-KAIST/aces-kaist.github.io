import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from './link'

// Markdown with site-relative links routed through Next (keeps the base path).
export function Prose({ children }: { children: string }) {
  return (
    <div className="space-y-5 text-lg/8 text-gray-700 [&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&_a]:decoration-brand-100 [&_a]:underline-offset-4 hover:[&_a]:decoration-brand-600 [&_strong]:font-semibold [&_strong]:text-gray-950">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = '', children }) =>
            href.startsWith('/') ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            ),
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
