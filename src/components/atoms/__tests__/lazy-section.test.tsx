import { act, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { LazySection } from "../lazy-section"

let lastCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null = null
let lastOptions: IntersectionObserverInit | undefined

class MockIntersectionObserver {
  constructor(
    cb: (entries: Partial<IntersectionObserverEntry>[]) => void,
    options?: IntersectionObserverInit,
  ) {
    lastCallback = cb
    lastOptions = options
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)

describe("lazySection", () => {
  beforeEach(() => {
    lastCallback = null
    lastOptions = undefined
  })

  it("renders a wrapper div", () => {
    const { container } = render(
      <LazySection>
        <span>child content</span>
      </LazySection>,
    )
    expect(container.firstElementChild?.tagName).toBe("DIV")
  })

  it("does not render children before intersection", () => {
    render(
      <LazySection>
        <span>hidden content</span>
      </LazySection>,
    )
    expect(screen.queryByText("hidden content")).not.toBeInTheDocument()
  })

  it("renders children after intersection fires", () => {
    render(
      <LazySection>
        <span>visible content</span>
      </LazySection>,
    )
    expect(screen.queryByText("visible content")).not.toBeInTheDocument()
    act(() => {
      lastCallback?.([
        {
          isIntersecting: true,
        } as IntersectionObserverEntry,
      ])
    })
    expect(screen.getByText("visible content")).toBeInTheDocument()
  })

  it("applies className to the wrapper div", () => {
    const { container } = render(
      <LazySection className="my-custom-class">
        <span>child</span>
      </LazySection>,
    )
    expect(container.firstElementChild?.className).toContain("my-custom-class")
  })

  it("uses default rootMargin of 200px", () => {
    render(
      <LazySection>
        <span>child</span>
      </LazySection>,
    )
    expect(lastOptions?.rootMargin).toBe("200px")
  })

  it("uses custom rootMargin", () => {
    render(
      <LazySection rootMargin="500px">
        <span>child</span>
      </LazySection>,
    )
    expect(lastOptions?.rootMargin).toBe("500px")
  })
})
