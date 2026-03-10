import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TopNavProvider, useTopNav } from "../top-nav-provider"

function ConfigDisplay() {
  const { config } = useTopNav()
  return (
    <div>
      <span data-testid="left">{config.left ?? "empty"}</span>
      <span data-testid="center">{config.center ?? "empty"}</span>
      <span data-testid="hidden">{config.hidden ? "hidden" : "visible"}</span>
    </div>
  )
}

function ConfigSetter({ left, center, hidden }: { left?: string, center?: string, hidden?: boolean }) {
  const { set } = useTopNav()
  return (
    <button
      data-testid="setter"
      onClick={() => set({ left: left ? <span>{left}</span> : undefined, center: center ? <span>{center}</span> : undefined, hidden })}
    >
      set
    </button>
  )
}

function Resetter() {
  const { reset } = useTopNav()
  return <button data-testid="resetter" onClick={reset}>reset</button>
}

describe("topNavProvider", () => {
  it("provides empty config by default", () => {
    render(
      <TopNavProvider>
        <ConfigDisplay />
      </TopNavProvider>,
    )
    expect(screen.getByTestId("left").textContent).toBe("empty")
    expect(screen.getByTestId("center").textContent).toBe("empty")
    expect(screen.getByTestId("hidden").textContent).toBe("visible")
  })

  it("updates left slot via set", () => {
    render(
      <TopNavProvider>
        <ConfigSetter left="My Breadcrumb" />
        <ConfigDisplay />
      </TopNavProvider>,
    )
    fireEvent.click(screen.getByTestId("setter"))
    expect(screen.getByTestId("left").textContent).toBe("My Breadcrumb")
  })

  it("updates center slot via set", () => {
    render(
      <TopNavProvider>
        <ConfigSetter center="My Actions" />
        <ConfigDisplay />
      </TopNavProvider>,
    )
    fireEvent.click(screen.getByTestId("setter"))
    expect(screen.getByTestId("center").textContent).toBe("My Actions")
  })

  it("sets hidden flag via set", () => {
    render(
      <TopNavProvider>
        <ConfigSetter hidden />
        <ConfigDisplay />
      </TopNavProvider>,
    )
    fireEvent.click(screen.getByTestId("setter"))
    expect(screen.getByTestId("hidden").textContent).toBe("hidden")
  })

  it("resets config back to empty", () => {
    render(
      <TopNavProvider>
        <ConfigSetter left="Something" hidden />
        <Resetter />
        <ConfigDisplay />
      </TopNavProvider>,
    )
    fireEvent.click(screen.getByTestId("setter"))
    expect(screen.getByTestId("hidden").textContent).toBe("hidden")

    fireEvent.click(screen.getByTestId("resetter"))
    expect(screen.getByTestId("hidden").textContent).toBe("visible")
    expect(screen.getByTestId("left").textContent).toBe("empty")
  })

  it("useTopNav outside provider returns no-op defaults", () => {
    // Should not throw
    render(<ConfigDisplay />)
    expect(screen.getByTestId("hidden").textContent).toBe("visible")
  })
})
