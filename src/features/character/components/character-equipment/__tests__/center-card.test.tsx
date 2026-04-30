import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CenterCard } from "../center-card"

const baseProps = {
  classSlug: "demon-hunter" as const,
  characterName: "Synthracks",
  className: "Demon Hunter",
  avgIlvl: 639,
  activeColor: "#a330c9",
}

describe("CenterCard", () => {
  it("renders without crashing", () => {
    const { container } = render(<CenterCard {...baseProps} />)
    expect(container.firstChild).toBeDefined()
  })

  it("renders character name", () => {
    const { container } = render(<CenterCard {...baseProps} />)
    expect(container.textContent).toContain("Synthracks")
  })

  it("renders class name", () => {
    const { container } = render(<CenterCard {...baseProps} />)
    expect(container.textContent).toContain("Demon Hunter")
  })

  it("renders ilvl when provided", () => {
    const { container } = render(<CenterCard {...baseProps} />)
    expect(container.textContent).toContain("639")
    expect(container.textContent).toContain("Ilvl")
  })

  it("renders spec name when provided", () => {
    const { container } = render(<CenterCard {...baseProps} specName="havoc" />)
    expect(container.textContent).toContain("havoc")
  })

  it("renders avatar when avatarUrl provided", () => {
    const { container } = render(
      <CenterCard {...baseProps} avatarUrl="https://example.com/avatar.jpg" />,
    )
    const images = container.querySelectorAll("img")
    expect(images.length).toBeGreaterThan(0)
  })

  it("falls back to specIconUrl when no avatar", () => {
    const { container } = render(
      <CenterCard {...baseProps} avatarUrl={null} specIconUrl="https://example.com/spec.jpg" />,
    )
    const images = container.querySelectorAll("img")
    expect(images.length).toBeGreaterThan(0)
  })

  it("renders no ilvl section when avgIlvl is null", () => {
    const { container } = render(<CenterCard {...baseProps} avgIlvl={null} />)
    expect(container.textContent).not.toContain("Ilvl")
  })

  it("renders stat bars when statPcts has values", () => {
    const { container } = render(
      <CenterCard
        {...baseProps}
        statPcts={{
          VERSATILITY: 12,
          MASTERY_RATING: 15,
        }}
      />,
    )
    expect(container.textContent).toContain("Vers")
    expect(container.textContent).toContain("Mast")
  })

  it("does not render stat bars when statPcts is undefined", () => {
    const { container } = render(<CenterCard {...baseProps} />)
    expect(container.textContent).not.toContain("Vers")
  })
})
