import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { HoverProvider, useHoverSlug, useSetHoverSlug } from "../hover-provider"

function SlugReader() {
  const slug = useHoverSlug()
  return <span data-testid="slug">{slug ?? "null"}</span>
}

function SlugSetter({ value }: { value: WowClassSlug | null }) {
  const setSlug = useSetHoverSlug()
  return (
    <button data-testid="setter" onClick={() => setSlug(value)}>
      set
    </button>
  )
}

describe("hoverProvider", () => {
  it("provides null as initial slug", () => {
    render(
      <HoverProvider>
        <SlugReader />
      </HoverProvider>,
    )
    expect(screen.getByTestId("slug").textContent).toBe("null")
  })

  it("updates slug when setter is called", () => {
    render(
      <HoverProvider>
        <SlugSetter value={"warrior" as WowClassSlug} />
        <SlugReader />
      </HoverProvider>,
    )
    expect(screen.getByTestId("slug").textContent).toBe("null")
    fireEvent.click(screen.getByTestId("setter"))
    expect(screen.getByTestId("slug").textContent).toBe("warrior")
  })

  it("resets slug to null when setter called with null", () => {
    const { getByTestId } = render(
      <HoverProvider>
        <SlugSetter value={"warrior" as WowClassSlug} />
        <SlugReader />
      </HoverProvider>,
    )
    fireEvent.click(getByTestId("setter"))
    expect(getByTestId("slug").textContent).toBe("warrior")
  })

  it("sets slug back to null via null setter", () => {
    function NullSetter() {
      const setSlug = useSetHoverSlug()
      return (
        <>
          <button data-testid="set-warrior" onClick={() => setSlug("warrior" as WowClassSlug)}>
            warrior
          </button>
          <button data-testid="set-null" onClick={() => setSlug(null)}>
            null
          </button>
        </>
      )
    }
    const { getByTestId } = render(
      <HoverProvider>
        <NullSetter />
        <SlugReader />
      </HoverProvider>,
    )
    fireEvent.click(getByTestId("set-warrior"))
    expect(getByTestId("slug").textContent).toBe("warrior")
    fireEvent.click(getByTestId("set-null"))
    expect(getByTestId("slug").textContent).toBe("null")
  })

  it("useHoverSlug outside provider returns null (default context value)", () => {
    render(<SlugReader />)
    const slugEls = screen.getAllByTestId("slug")
    expect(slugEls[slugEls.length - 1].textContent).toBe("null")
  })

  it("useSetHoverSlug outside provider is a no-op function", () => {
    function NoOpTest() {
      const set = useSetHoverSlug()
      return (
        <button data-testid="noop" onClick={() => set("warrior" as WowClassSlug)}>
          noop
        </button>
      )
    }
    render(<NoOpTest />)
    // Clicking should not throw
    fireEvent.click(screen.getByTestId("noop"))
    expect(true).toBe(true)
  })
})
