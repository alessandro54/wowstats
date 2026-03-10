import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MetaBarChart } from "../meta-bar-chart"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

const entries = [
  { key: "arms", specName: "Arms", normPct: 100, metaScore: 0.82, meanRating: 1850, winRate: 0.54, presence: 0.12, color: "#c79c6e", iconUrl: "https://example.com/icon.jpg", tier: "S" as const },
  { key: "frost", specName: "Frost", normPct: 66, metaScore: 0.54, meanRating: 1720, winRate: 0.51, presence: 0.08, color: "#69ccf0", tier: "A" as const },
]

describe("metaBarChart", () => {
  it("renders spec names", () => {
    const { container } = render(<MetaBarChart entries={entries} />)
    expect(container.textContent).toContain("Arms")
    expect(container.textContent).toContain("Frost")
  })

  it("renders percentage labels", () => {
    const { container } = render(<MetaBarChart entries={entries} />)
    expect(container.textContent).toContain("100%")
    expect(container.textContent).toContain("66%")
  })

  it("renders spec icons when present", () => {
    const { container } = render(<MetaBarChart entries={entries} />)
    expect(container.querySelector("img")).toBeInTheDocument()
  })

  it("renders colored squares when no icon", () => {
    const noIcons = entries.map(({ iconUrl: _, ...e }) => e)
    const { container } = render(<MetaBarChart entries={noIcons} />)
    expect(container.querySelector("img")).toBeNull()
  })

  it("handles empty entries", () => {
    const { container } = render(<MetaBarChart entries={[]} />)
    expect(container.querySelector("div")).toBeInTheDocument()
  })
})
