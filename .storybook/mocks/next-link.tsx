import type { AnchorHTMLAttributes } from "react"

type NextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string | { pathname?: string, query?: Record<string, string> }
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  locale?: string | false
}

export default function Link({
  href,
  prefetch: _,
  replace: _r,
  scroll: _s,
  shallow: _sh,
  locale: _l,
  ...props
}: NextLinkProps) {
  const resolvedHref = typeof href === "string" ? href : (href.pathname ?? "/")
  return <a href={resolvedHref} {...props} />
}
