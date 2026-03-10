import type { WowClassConfig } from "@/config/wow/classes/classes-config"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ClassPanels } from "../class-panels"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useSetHoverSlug: () => vi.fn(),
}))

const classes: WowClassConfig[] = [
  {
    id: 1, name: "Warrior", slug: "warrior", iconUrl: "/warrior.jpg", color: "#c79c6e", colorOlkch: "",
    specs: [{ id: 71, name: "arms" as any, url: "", iconUrl: "/arms.jpg" }],
  },
  {
    id: 2, name: "Mage", slug: "mage", iconUrl: "/mage.jpg", color: "#69ccf0", colorOlkch: "",
    specs: [{ id: 62, name: "fire" as any, url: "", iconUrl: "/fire.jpg" }],
  },
  {
    id: 3, name: "Rogue", slug: "rogue", iconUrl: "/rogue.jpg", color: "#fff569", colorOlkch: "",
    specs: [{ id: 259, name: "assassination" as any, url: "", iconUrl: "/sin.jpg" }],
  },
]

describe("classPanels", () => {
  it("renders class icons for all classes", () => {
    const { container } = render(<ClassPanels classes={classes} />)
    const imgs = container.querySelectorAll("img")
    expect(imgs.length).toBeGreaterThanOrEqual(3)
  })

  it("renders slider track", () => {
    const { container } = render(<ClassPanels classes={classes} />)
    // The slider track is a div with class h-px
    const track = container.querySelector(".h-px")
    expect(track).toBeInTheDocument()
  })

  it("renders panels container", () => {
    const { container } = render(<ClassPanels classes={classes} />)
    expect(container.querySelector(".flex.min-h-0.flex-1")).toBeInTheDocument()
  })
})
