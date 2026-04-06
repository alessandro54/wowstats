const MAGNIFY_FLEX = [
  12,
  2.5,
  1.6,
  1.1,
  0.7,
  0.4,
]

export function flexForDistance(distance: number): number {
  return MAGNIFY_FLEX[Math.min(distance, MAGNIFY_FLEX.length - 1)]
}
