/**
 * Computes the Shannon entropy of a distribution.
 *
 * @param values - Array of non-negative counts or frequencies.
 * @returns Entropy in bits (base-2). Returns 0 for empty or all-zero arrays.
 */
export function shannonEntropy(values: number[]): number {
  const total = values.reduce((s, v) => s + v, 0)
  if (total === 0) return 0
  return -values.reduce((s, v) => {
    if (v === 0) return s
    const p = v / total
    return s + p * Math.log2(p)
  }, 0)
}
