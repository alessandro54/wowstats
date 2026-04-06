import { describe, expect, it } from "vitest"
import { shannonEntropy } from "@/lib/utils/stats"

describe("shannonEntropy", () => {
  it("returns 0 for an empty array", () => {
    expect(shannonEntropy([])).toBe(0)
  })

  it("returns 0 when all values are zero", () => {
    expect(
      shannonEntropy([
        0,
        0,
        0,
      ]),
    ).toBe(0)
  })

  it("returns log2(n) for a uniform distribution of n equal values", () => {
    // 4 equal values → max entropy = log2(4) = 2
    expect(
      shannonEntropy([
        1,
        1,
        1,
        1,
      ]),
    ).toBeCloseTo(Math.log2(4), 10)
    // 8 equal values → max entropy = log2(8) = 3
    expect(
      shannonEntropy([
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
      ]),
    ).toBeCloseTo(Math.log2(8), 10)
  })

  it("returns 0 when a single non-zero value is present", () => {
    expect(
      shannonEntropy([
        5,
      ]),
    ).toBeCloseTo(0)
    expect(
      shannonEntropy([
        0,
        0,
        7,
        0,
      ]),
    ).toBeCloseTo(0)
  })

  it("returns expected entropy for a known distribution", () => {
    // p(A) = 0.5, p(B) = 0.25, p(C) = 0.25
    // H = -(0.5*log2(0.5) + 0.25*log2(0.25) + 0.25*log2(0.25))
    //   = -(0.5*(-1) + 0.25*(-2) + 0.25*(-2))
    //   = -(-0.5 - 0.5 - 0.5) = 1.5
    expect(
      shannonEntropy([
        2,
        1,
        1,
      ]),
    ).toBeCloseTo(1.5, 10)
  })
})
