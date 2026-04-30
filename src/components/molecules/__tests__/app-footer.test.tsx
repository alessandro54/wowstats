import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { AppFooter } from "../app-footer"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe("AppFooter", () => {
  it("renders without crashing", () => {
    const { container } = render(<AppFooter />)
    expect(container.firstChild).toBeDefined()
  })
})
