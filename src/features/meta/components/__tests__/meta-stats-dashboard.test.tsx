import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { MetaDataset } from "../meta-stats-dashboard"
import { MetaStatsDashboard } from "../meta-stats-dashboard"

vi.mock("next/navigation", () => ({
  usePathname: () => "/pvp/meta/2v2/dps",
  useSearchParams: () => new URLSearchParams(),
}))

const emptyDataset: MetaDataset = {
  entries: [],
  totalEntries: 0,
  weightedRating: 0,
  weightedWR: 0,
  topSpec: {
    name: "",
    className: "",
    color: "#fff",
  },
  mostReliable: {
    name: "",
    className: "",
    color: "#fff",
    bK: 0,
  },
}

describe("MetaStatsDashboard", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <MetaStatsDashboard
        bracket="2v2"
        initialRole="dps"
        initialRegion="all"
        datasets={{
          all: emptyDataset,
          us: emptyDataset,
          eu: emptyDataset,
        }}
        allBrackets={{
          "2v2": {
            all: emptyDataset,
            us: emptyDataset,
            eu: emptyDataset,
          },
        }}
      />,
    )
    expect(container).toBeDefined()
  })
})
