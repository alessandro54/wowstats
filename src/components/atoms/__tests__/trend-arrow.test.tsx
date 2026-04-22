import { render, screen } from "@testing-library/react"
import { TrendArrow } from "../trend-arrow"

describe("TrendArrow", () => {
  it("renders ▲ for up", () => {
    render(<TrendArrow trend="up" />)
    expect(screen.getByText("▲")).toBeInTheDocument()
  })

  it("renders ▼ for down", () => {
    render(<TrendArrow trend="down" />)
    expect(screen.getByText("▼")).toBeInTheDocument()
  })

  it("renders 'new' label for new", () => {
    render(<TrendArrow trend="new" />)
    expect(screen.getByText("new")).toBeInTheDocument()
  })

  it("renders nothing for stable", () => {
    const { container } = render(<TrendArrow trend="stable" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing for undefined", () => {
    const { container } = render(<TrendArrow trend={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })
})
