import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MetaKpiRow } from "../meta-kpi-row"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

const props = {
  totalPlayers: 12500,
  weightedAvgRating: 1847,
  weightedAvgWinRate: 0.523,
  topSpec: { name: "Arms", className: "Warrior", color: "#c79c6e", iconUrl: "https://example.com/icon.jpg" },
}

describe("metaKpiRow", () => {
  it("renders player count", () => {
    const { container } = render(<MetaKpiRow {...props} />)
    expect(container.textContent).toContain("12,500")
  })

  it("renders avg rating", () => {
    const { container } = render(<MetaKpiRow {...props} />)
    expect(container.textContent).toContain("1847")
  })

  it("renders win rate percentage", () => {
    const { container } = render(<MetaKpiRow {...props} />)
    expect(container.textContent).toContain("52.3%")
  })

  it("renders top spec name", () => {
    const { container } = render(<MetaKpiRow {...props} />)
    expect(container.textContent).toContain("Arms")
  })

  it("renders icon when provided", () => {
    const { container } = render(<MetaKpiRow {...props} />)
    expect(container.querySelector("img")).toBeInTheDocument()
  })

  it("handles topSpec without icon", () => {
    const noIcon = { ...props, topSpec: { ...props.topSpec, iconUrl: undefined } }
    const { container } = render(<MetaKpiRow {...noIcon} />)
    expect(container.querySelector("img")).toBeNull()
    expect(container.textContent).toContain("Arms")
  })
})
