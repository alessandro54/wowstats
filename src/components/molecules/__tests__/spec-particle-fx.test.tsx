import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpecParticleFx } from "../spec-particle-fx"

describe("SpecParticleFx", () => {
  it("renders without crashing with no effect", () => {
    const { container } = render(<SpecParticleFx />)
    expect(container).toBeDefined()
  })

  it("renders without crashing with effect prop", () => {
    const { container } = render(<SpecParticleFx effect="snow" />)
    expect(container).toBeDefined()
  })
})
