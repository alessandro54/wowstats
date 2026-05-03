import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CenterCard } from "../center-card"

const baseProps = {
  classSlug: "demon-hunter" as const,
  activeColor: "#a330c9",
}

describe("CenterCard", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <TooltipProvider>
        <CenterCard {...baseProps} />
      </TooltipProvider>,
    )
    expect(container.firstChild).toBeDefined()
  })

  it("renders spec name and class name when both provided", () => {
    const { container } = render(
      <TooltipProvider>
        <CenterCard {...baseProps} specName="Havoc" className="Demon Hunter" />
      </TooltipProvider>,
    )
    expect(container.textContent).toContain("Havoc")
    expect(container.textContent).toContain("Demon Hunter")
  })

  it("renders bracket label when provided", () => {
    const { container } = render(
      <TooltipProvider>
        <CenterCard {...baseProps} specName="Havoc" className="Demon Hunter" bracketLabel="3v3" />
      </TooltipProvider>,
    )
    expect(container.textContent).toContain("3v3")
  })
})
