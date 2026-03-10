import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MetaSpecTable } from "../meta-spec-table"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

const entries = [
  { key: "arms", specName: "Arms", normPct: 100, metaScore: 0.82, meanRating: 1850, winRate: 0.54, presence: 0.12, color: "#c79c6e", iconUrl: "https://example.com/icon.jpg", tier: "S" as const },
  { key: "frost", specName: "Frost", normPct: 66, metaScore: 0.54, meanRating: 1720, winRate: 0.51, presence: 0.08, color: "#69ccf0", tier: "B" as const },
]

describe("metaSpecTable", () => {
  it("renders header columns", () => {
    const { container } = render(<MetaSpecTable entries={entries} />)
    expect(container.textContent).toContain("Spec")
    expect(container.textContent).toContain("Tier")
    expect(container.textContent).toContain("Meta")
    expect(container.textContent).toContain("Rating")
  })

  it("renders spec names", () => {
    const { container } = render(<MetaSpecTable entries={entries} />)
    expect(container.textContent).toContain("Arms")
    expect(container.textContent).toContain("Frost")
  })

  it("shows tier badges", () => {
    const { container } = render(<MetaSpecTable entries={entries} />)
    expect(container.textContent).toContain("S")
    expect(container.textContent).toContain("B")
  })

  it("shows rating values", () => {
    const { container } = render(<MetaSpecTable entries={entries} />)
    expect(container.textContent).toContain("1850")
    expect(container.textContent).toContain("1720")
  })

  it("shows win rate percentages", () => {
    const { container } = render(<MetaSpecTable entries={entries} />)
    expect(container.textContent).toContain("54.0%")
    expect(container.textContent).toContain("51.0%")
  })

  it("renders rank numbers", () => {
    const { container } = render(<MetaSpecTable entries={entries} />)
    expect(container.textContent).toContain("1")
    expect(container.textContent).toContain("2")
  })
})
