import { useState } from "react"

export function useSortableTable<T, K extends string>(
  entries: T[],
  comparators: Record<K, (a: T, b: T) => number>,
  defaultKey: K,
  defaultAsc = false,
) {
  const [sortKey, setSortKey] = useState<K>(defaultKey)
  const [sortAsc, setSortAsc] = useState(defaultAsc)

  const handleSort = (key: K) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const sorted = [
    ...entries,
  ].sort((a, b) => {
    const cmp = comparators[sortKey](a, b)
    return sortAsc ? -cmp : cmp
  })

  const sortIndicator = (key: K): string => {
    if (sortKey !== key) return ""
    return sortAsc ? " \u25B2" : " \u25BC"
  }

  return {
    sorted,
    sortKey,
    sortAsc,
    handleSort,
    sortIndicator,
  }
}
