"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef } from "react"

type Props = ComponentPropsWithoutRef<typeof Link>

export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, onClick, children, ...props },
  ref,
) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    onClick?.(e)

    const url = href.toString()

    if (!("startViewTransition" in document)) {
      router.push(url)
      return
    }

    document.startViewTransition(() => {
      router.push(url)
    })
  }

  return (
    <Link ref={ref} href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
})

TransitionLink.displayName = "TransitionLink"
