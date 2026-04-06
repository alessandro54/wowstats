import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/fx/home-bg-webgl", () => ({
  createHomeBgRenderer: vi.fn(() => ({
    dispose: vi.fn(),
  })),
}))

const { BgCanvasInner } = await import("../home-bg-canvas")

describe("BgCanvasInner", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders canvas element", () => {
    const { container } = render(<BgCanvasInner />)
    expect(container.querySelector("canvas")).toBeInTheDocument()
  })
})
