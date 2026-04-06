import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useSortableTable } from "@/hooks/use-sortable-table"

interface Item {
  name: string
  score: number
  rating: number
}

const entries: Item[] = [
  {
    name: "Alpha",
    score: 3,
    rating: 100,
  },
  {
    name: "Beta",
    score: 1,
    rating: 300,
  },
  {
    name: "Gamma",
    score: 2,
    rating: 200,
  },
]

type SortKey = "score" | "rating"

const comparators: Record<SortKey, (a: Item, b: Item) => number> = {
  score: (a, b) => b.score - a.score,
  rating: (a, b) => b.rating - a.rating,
}

describe("useSortableTable", () => {
  it("sorts by the default key in descending order by default", () => {
    const { result } = renderHook(() =>
      useSortableTable<Item, SortKey>(entries, comparators, "score", false),
    )
    const names = result.current.sorted.map((e) => e.name)
    expect(names).toEqual([
      "Alpha",
      "Gamma",
      "Beta",
    ])
  })

  it("sorts in ascending order when defaultAsc is true", () => {
    const { result } = renderHook(() =>
      useSortableTable<Item, SortKey>(entries, comparators, "score", true),
    )
    const names = result.current.sorted.map((e) => e.name)
    expect(names).toEqual([
      "Beta",
      "Gamma",
      "Alpha",
    ])
  })

  it("toggles sort direction when the same key is clicked", () => {
    const { result } = renderHook(() =>
      useSortableTable<Item, SortKey>(entries, comparators, "score", false),
    )
    act(() => {
      result.current.handleSort("score")
    })
    expect(result.current.sortAsc).toBe(true)
    const names = result.current.sorted.map((e) => e.name)
    expect(names).toEqual([
      "Beta",
      "Gamma",
      "Alpha",
    ])
  })

  it("switches to a new key in descending order when a different key is clicked", () => {
    const { result } = renderHook(() =>
      useSortableTable<Item, SortKey>(entries, comparators, "score", false),
    )
    act(() => {
      result.current.handleSort("rating")
    })
    expect(result.current.sortKey).toBe("rating")
    expect(result.current.sortAsc).toBe(false)
    const names = result.current.sorted.map((e) => e.name)
    expect(names).toEqual([
      "Beta",
      "Gamma",
      "Alpha",
    ])
  })

  it("returns empty string for sortIndicator when key does not match", () => {
    const { result } = renderHook(() =>
      useSortableTable<Item, SortKey>(entries, comparators, "score", false),
    )
    expect(result.current.sortIndicator("rating")).toBe("")
  })

  it("returns descending indicator when sorted descending on current key", () => {
    const { result } = renderHook(() =>
      useSortableTable<Item, SortKey>(entries, comparators, "score", false),
    )
    expect(result.current.sortIndicator("score")).toBe(" \u25BC")
  })

  it("returns ascending indicator when sorted ascending on current key", () => {
    const { result } = renderHook(() =>
      useSortableTable<Item, SortKey>(entries, comparators, "score", true),
    )
    expect(result.current.sortIndicator("score")).toBe(" \u25B2")
  })
})
