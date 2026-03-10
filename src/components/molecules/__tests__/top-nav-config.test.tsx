import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TopNavProvider, useTopNav } from "@/components/providers/top-nav-provider"
import { TopNavConfig } from "../top-nav-config"

function NavReader() {
  const { config } = useTopNav()
  return (
    <div>
      <div data-testid="left">{config.left ?? "none"}</div>
      <div data-testid="center">{config.center ?? "none"}</div>
      <div data-testid="hidden">{config.hidden ? "hidden" : "visible"}</div>
    </div>
  )
}

function wrap(ui: React.ReactNode) {
  return render(
    <TopNavProvider>
      {ui}
      <NavReader />
    </TopNavProvider>,
  )
}

describe("topNavConfig", () => {
  it("sets left slot on mount", () => {
    wrap(<TopNavConfig left={<span>Breadcrumb</span>} />)
    expect(screen.getByTestId("left").textContent).toBe("Breadcrumb")
  })

  it("sets center slot on mount", () => {
    wrap(<TopNavConfig center={<span>Actions</span>} />)
    expect(screen.getByTestId("center").textContent).toBe("Actions")
  })

  it("sets hidden flag on mount", () => {
    wrap(<TopNavConfig hidden />)
    expect(screen.getByTestId("hidden").textContent).toBe("hidden")
  })

  it("sets left and center together", () => {
    wrap(<TopNavConfig left={<span>Left</span>} center={<span>Center</span>} />)
    expect(screen.getByTestId("left").textContent).toBe("Left")
    expect(screen.getByTestId("center").textContent).toBe("Center")
  })

  it("resets config on unmount", () => {
    const { rerender } = wrap(<TopNavConfig left={<span>Was Here</span>} />)
    expect(screen.getByTestId("left").textContent).toBe("Was Here")

    // Unmount by removing TopNavConfig
    rerender(
      <TopNavProvider>
        <NavReader />
      </TopNavProvider>,
    )
    expect(screen.getByTestId("left").textContent).toBe("none")
  })

  it("renders nothing itself", () => {
    const { container } = render(
      <TopNavProvider>
        <TopNavConfig left={<span>x</span>} />
      </TopNavProvider>,
    )
    // TopNavConfig has no DOM output of its own — only the Provider wrapper
    expect(container.firstChild).toBeNull()
  })
})
