import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { LeaderboardFiltersBar } from "../filters-bar"

const noop = vi.fn()
const setN = vi.fn()
const setS = vi.fn()

const REGIONS = [
  {
    value: "all",
    label: "ALL",
  },
  {
    value: "us",
    label: "US",
  },
] as const

describe("LeaderboardFiltersBar", () => {
  it("renders the search input and region buttons", () => {
    const { container } = render(
      <LeaderboardFiltersBar
        search=""
        setSearch={setS}
        classSlug=""
        setClassSlug={setS}
        setSpecName={setS}
        classConfig={null}
        specName=""
        minRating=""
        setMinRating={setS}
        maxRating=""
        setMaxRating={setS}
        minWr=""
        setMinWr={setS}
        perPage={10}
        setPerPage={setN}
        regions={REGIONS}
        currentRegion="all"
        setRegion={setS}
        hasFilters={false}
        resetFilters={noop}
      />,
    )
    expect(container.querySelector("input[type='text']")).toBeTruthy()
    expect(container.textContent).toContain("ALL")
  })

  it("shows the reset button when filters are active", () => {
    const { container } = render(
      <LeaderboardFiltersBar
        search="cdew"
        setSearch={setS}
        classSlug=""
        setClassSlug={setS}
        setSpecName={setS}
        classConfig={null}
        specName=""
        minRating=""
        setMinRating={setS}
        maxRating=""
        setMaxRating={setS}
        minWr=""
        setMinWr={setS}
        perPage={10}
        setPerPage={setN}
        regions={REGIONS}
        currentRegion="all"
        setRegion={setS}
        hasFilters
        resetFilters={noop}
      />,
    )
    expect(container.textContent).toContain("Reset")
  })
})
