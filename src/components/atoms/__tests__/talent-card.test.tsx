import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TalentCard } from "../talent-card"

describe("talentCard", () => {
  it("renders children", () => {
    const { getByText } = render(<TalentCard>Hello</TalentCard>)
    expect(getByText("Hello")).toBeInTheDocument()
  })

  it("renders as a section element", () => {
    const { container } = render(<TalentCard>content</TalentCard>)
    expect(container.querySelector("section")).toBeInTheDocument()
  })

  it("applies class-color gradient when classSlug is provided", () => {
    const { container } = render(<TalentCard classSlug="warrior">content</TalentCard>)
    const section = container.querySelector("section")!
    expect(section.style.background).toContain("var(--color-class-warrior)")
  })

  it("applies fallback background when no classSlug", () => {
    const { container } = render(<TalentCard>content</TalentCard>)
    const section = container.querySelector("section")!
    expect(section.style.background).toContain("hsl(var(--card)")
  })

  it("merges custom className", () => {
    const { container } = render(<TalentCard className="custom-class">content</TalentCard>)
    expect(container.querySelector("section")!.classList.contains("custom-class")).toBe(true)
  })

  it("merges custom style prop", () => {
    const { container } = render(
      <TalentCard
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        content
      </TalentCard>,
    )
    const section = container.querySelector("section")!
    expect(section.style.backfaceVisibility).toBe("hidden")
  })
})
