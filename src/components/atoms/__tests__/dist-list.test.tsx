import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import { DistList } from "../dist-list"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

const entries: DistEntry[] = [
  {
    name: "Helm of Glory",
    pct: 45.5,
    quality: "EPIC",
    icon_url: "https://example.com/icon.jpg",
  },
  {
    name: "Crown of Valor",
    pct: 30.2,
    quality: "RARE",
  },
  {
    name: "Basic Hood",
    pct: 15.8,
  },
]

describe("distList", () => {
  it("renders entry names", () => {
    const { container } = render(<DistList entries={entries} />)
    expect(container.textContent).toContain("Helm of Glory")
    expect(container.textContent).toContain("Crown of Valor")
    expect(container.textContent).toContain("Basic Hood")
  })

  it("renders percentage values", () => {
    const { container } = render(<DistList entries={entries} />)
    expect(container.textContent).toContain("45.5%")
    expect(container.textContent).toContain("30.2%")
    expect(container.textContent).toContain("15.8%")
  })

  it("renders icons when icon_url provided", () => {
    const { container } = render(<DistList entries={entries} />)
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
    expect(img?.getAttribute("src")).toContain("example.com/icon.jpg")
  })

  it("handles entries without icons", () => {
    const noIcons: DistEntry[] = [
      {
        name: "No Icon",
        pct: 50.0,
      },
    ]
    const { container } = render(<DistList entries={noIcons} />)
    expect(container.querySelector("img")).toBeNull()
    expect(container.textContent).toContain("No Icon")
  })

  it("handles empty entries", () => {
    const { container } = render(<DistList entries={[]} />)
    expect(container.textContent).toBe("")
  })
})
