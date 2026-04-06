import type { WowClassConfig } from "@/config/wow/classes/classes-config"
import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ClassAccordion } from "../class-accordion"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useSetHoverSlug: () => vi.fn(),
}))

const classes: WowClassConfig[] = [
  {
    id: 1,
    name: "Warrior",
    slug: "warrior",
    iconUrl: "/warrior.jpg",
    specs: [
      {
        id: 71,
        name: "arms" as any,
        url: "",
        iconUrl: "/arms.jpg",
      },
      {
        id: 72,
        name: "fury" as any,
        url: "",
        iconUrl: "/fury.jpg",
      },
    ],
  },
  {
    id: 2,
    name: "Mage",
    slug: "mage",
    iconUrl: "/mage.jpg",
    specs: [
      {
        id: 62,
        name: "fire" as any,
        url: "",
        iconUrl: "/fire.jpg",
      },
    ],
  },
]

describe("classAccordion", () => {
  it("renders class names", () => {
    const { container } = render(<ClassAccordion classes={classes} />)
    expect(container.textContent).toContain("Warrior")
    expect(container.textContent).toContain("Mage")
  })

  it("renders class icons", () => {
    const { container } = render(<ClassAccordion classes={classes} />)
    const imgs = container.querySelectorAll("img")
    expect(imgs.length).toBeGreaterThanOrEqual(2)
  })

  it("expands specs on click", () => {
    const { container } = render(<ClassAccordion classes={classes} />)
    const buttons = container.querySelectorAll("button")
    fireEvent.click(buttons[0])
    expect(container.textContent).toContain("arms")
    expect(container.textContent).toContain("fury")
  })

  it("renders spec links with correct hrefs", () => {
    const { container } = render(<ClassAccordion classes={classes} />)
    const buttons = container.querySelectorAll("button")
    fireEvent.click(buttons[0])
    const links = container.querySelectorAll("a")
    const hrefs = Array.from(links).map((l) => l.getAttribute("href"))
    expect(hrefs).toContain("/pvp/warrior/arms")
    expect(hrefs).toContain("/pvp/warrior/fury")
  })
})
