import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MetaDonutChart } from "../meta-donut-chart"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

const slices = [
  {
    key: "arms",
    label: "Arms Warrior",
    value: 0.15,
    color: "#c79c6e",
    iconUrl: "https://example.com/icon.jpg",
  },
  {
    key: "frost",
    label: "Frost Mage",
    value: 0.12,
    color: "#69ccf0",
  },
  {
    key: "ret",
    label: "Ret Paladin",
    value: 0.1,
    color: "#f58cba",
  },
]

describe("metaDonutChart", () => {
  it("renders SVG element", () => {
    const { container } = render(<MetaDonutChart slices={slices} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders legend entries", () => {
    const { container } = render(<MetaDonutChart slices={slices} />)
    expect(container.textContent).toContain("Arms Warrior")
    expect(container.textContent).toContain("Frost Mage")
    expect(container.textContent).toContain("Ret Paladin")
  })

  it("shows percentage values", () => {
    const { container } = render(<MetaDonutChart slices={slices} />)
    expect(container.textContent).toContain("15.0%")
    expect(container.textContent).toContain("12.0%")
  })

  it("renders icon images when iconUrl provided", () => {
    const { container } = render(<MetaDonutChart slices={slices} />)
    expect(container.querySelector("img")).toBeInTheDocument()
  })

  it("renders colored squares when no iconUrl", () => {
    const noIcons = slices.map(({ iconUrl: _, ...s }) => s)
    const { container } = render(<MetaDonutChart slices={noIcons} />)
    expect(container.querySelector("img")).toBeNull()
  })

  it("shows Presence in center", () => {
    const { container } = render(<MetaDonutChart slices={slices} />)
    expect(container.textContent).toContain("Presence")
  })
})
