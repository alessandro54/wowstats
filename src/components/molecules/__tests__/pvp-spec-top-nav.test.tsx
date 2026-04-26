import { render, screen } from "@testing-library/react"
import { usePathname } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import { TopNavProvider, useTopNav } from "@/components/providers/top-nav-provider"
import { PvpSpecTopNav } from "../pvp-spec-top-nav"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/pvp/warrior/arms"),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

vi.mock("@/hooks/use-active-color", () => ({
  useActiveColor: vi.fn(() => "#C69B6D"),
}))

function NavReader() {
  const { config } = useTopNav()
  return (
    <div>
      <div data-testid="left">{config.left}</div>
      <div data-testid="center">{config.center ?? "none"}</div>
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

describe("pvpSpecTopNav", () => {
  it("renders breadcrumb with class and spec names", () => {
    wrap(<PvpSpecTopNav className="Warrior" classSlug="warrior" specSlug="arms" />)
    const left = screen.getByTestId("left")
    expect(left.textContent).toContain("PvP")
    expect(left.textContent).toContain("Warrior")
    expect(left.textContent).toContain("Arms")
  })

  it("does not render a center slot when not on a bracket route", () => {
    vi.mocked(usePathname).mockReturnValue("/pvp/warrior/arms")
    wrap(<PvpSpecTopNav className="Warrior" classSlug="warrior" specSlug="arms" />)
    expect(screen.getByTestId("center").textContent).toBe("none")
  })

  it("renders BracketSelector in center when on a bracket route", () => {
    vi.mocked(usePathname).mockReturnValue("/pvp/warrior/arms/2v2")
    wrap(<PvpSpecTopNav className="Warrior" classSlug="warrior" specSlug="arms" />)
    expect(screen.getByTestId("center").textContent).not.toBe("none")
  })

  it("renders BracketSelector for all bracket slugs", () => {
    for (const bracket of [
      "2v2",
      "3v3",
      "shuffle",
    ]) {
      vi.mocked(usePathname).mockReturnValue(`/pvp/warrior/arms/${bracket}`)
      const { unmount } = wrap(
        <PvpSpecTopNav className="Warrior" classSlug="warrior" specSlug="arms" />,
      )
      expect(screen.getByTestId("center").textContent).not.toBe("none")
      unmount()
    }
  })

  it("renders nothing itself — only configures the nav", () => {
    const { container } = render(
      <TopNavProvider>
        <PvpSpecTopNav className="Warrior" classSlug="warrior" specSlug="arms" />
      </TopNavProvider>,
    )
    expect(container.firstChild).toBeNull()
  })
})
