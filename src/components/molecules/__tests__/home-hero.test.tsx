import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { HomeHero } from "../home-hero"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

describe("HomeHero", () => {
  it("renders season number and total entries", () => {
    render(<HomeHero seasonId={41} totalEntries={38534} />)
    expect(screen.getByText(/Season 41/)).toBeDefined()
    expect(screen.getByText(/38,534/)).toBeDefined()
  })

  it("renders nothing for specs when topSpecs not provided", () => {
    const { container } = render(<HomeHero seasonId={41} totalEntries={38534} />)
    expect(container.querySelector("a")).toBeNull()
  })
})
