import { render, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SlidingSwitch } from "../sliding-switch"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/pvp/warrior/arms/3v3"),
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useHoverSlug: vi.fn(() => null),
}))

const options = [
  {
    value: "a" as const,
    label: <span>Option A</span>,
  },
  {
    value: "b" as const,
    label: <span>Option B</span>,
  },
  {
    value: "c" as const,
    label: <span>Option C</span>,
  },
]

describe("slidingSwitch", () => {
  it("renders all option labels", () => {
    const { container } = render(
      <SlidingSwitch options={options} value="a" onValueChange={vi.fn()} />,
    )
    expect(container.textContent).toContain("Option A")
    expect(container.textContent).toContain("Option B")
    expect(container.textContent).toContain("Option C")
  })

  it("calls onValueChange when clicking an option", () => {
    const handler = vi.fn()
    const { container } = render(
      <SlidingSwitch options={options} value="a" onValueChange={handler} />,
    )
    const buttons = container.querySelectorAll("button")
    fireEvent.click(buttons[1])
    expect(handler).toHaveBeenCalledWith("b")
  })

  it("renders the sliding indicator", () => {
    const { container } = render(
      <SlidingSwitch options={options} value="a" onValueChange={vi.fn()} />,
    )
    // Indicator is the first child div inside the container
    const indicator = container.querySelector(".absolute.rounded")
    expect(indicator).toBeInTheDocument()
  })

  it("renders border by default", () => {
    const { container } = render(
      <SlidingSwitch options={options} value="a" onValueChange={vi.fn()} />,
    )
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain("border")
  })

  it("hides border when bordered is false", () => {
    const { container } = render(
      <SlidingSwitch options={options} value="a" onValueChange={vi.fn()} bordered={false} />,
    )
    const wrapper = container.firstElementChild
    expect(wrapper?.className).not.toContain("border")
  })

  it("applies active style to selected option", () => {
    const { container } = render(
      <SlidingSwitch options={options} value="b" onValueChange={vi.fn()} />,
    )
    const buttons = container.querySelectorAll("button")
    // Active button should not have text-muted-foreground
    expect(buttons[1].className).not.toContain("text-muted-foreground")
    // Inactive buttons should have text-muted-foreground
    expect(buttons[0].className).toContain("text-muted-foreground")
  })
})
