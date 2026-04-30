import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { BracketDropdown } from "../bracket-dropdown"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/pvp/meta/2v2/dps",
}))

describe("BracketDropdown", () => {
  it("renders without crashing", () => {
    const { container } = render(<BracketDropdown current="2v2" />)
    expect(container.firstChild).toBeDefined()
  })
})
