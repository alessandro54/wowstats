import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ChoiceChevrons } from "../choice-chevrons"

describe("choiceChevrons", () => {
  it("renders without crashing", () => {
    const { container } = render(<ChoiceChevrons activeColor="#ff0000" />)
    expect(container).toBeTruthy()
  })

  it("renders two SVG elements", () => {
    const { container } = render(<ChoiceChevrons activeColor="#ff0000" />)
    const svgs = container.querySelectorAll("svg")
    expect(svgs).toHaveLength(2)
  })

  it("applies activeColor to svg paths", () => {
    const { container } = render(<ChoiceChevrons activeColor="#ab1234" />)
    const paths = container.querySelectorAll("path")
    for (const path of paths) {
      expect(path.getAttribute("stroke")).toBe("#ab1234")
    }
  })

  it("renders left and right chevron paths", () => {
    const { container } = render(<ChoiceChevrons activeColor="blue" />)
    const paths = container.querySelectorAll("path")
    expect(paths).toHaveLength(2)
    // Left chevron points left: M5 1 L1 5 L5 9
    expect(paths[0].getAttribute("d")).toBe("M5 1 L1 5 L5 9")
    // Right chevron points right: M1 1 L5 5 L1 9
    expect(paths[1].getAttribute("d")).toBe("M1 1 L5 5 L1 9")
  })

  it("positions svgs with pointer-events-none", () => {
    const { container } = render(<ChoiceChevrons activeColor="red" />)
    const svgs = container.querySelectorAll("svg")
    for (const svg of svgs) {
      expect(svg.className.baseVal).toContain("pointer-events-none")
    }
  })
})
