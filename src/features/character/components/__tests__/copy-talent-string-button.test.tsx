import { fireEvent, render, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CopyTalentStringButton } from "../copy-talent-string-button"

const SAMPLE_CODE = "C0BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"

describe("CopyTalentStringButton", () => {
  const writeText = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText,
      },
    })
    writeText.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders the copy talent string label by default", () => {
    const { getByRole } = render(<CopyTalentStringButton code={SAMPLE_CODE} />)
    expect(getByRole("button").textContent?.toLowerCase()).toContain("copy talent string")
  })

  it("writes the provided code to the clipboard on click", () => {
    const { getByRole } = render(<CopyTalentStringButton code={SAMPLE_CODE} />)
    fireEvent.click(getByRole("button"))
    expect(writeText).toHaveBeenCalledWith(SAMPLE_CODE)
  })

  it("flips to a copied label after a successful copy", async () => {
    const { getByRole } = render(<CopyTalentStringButton code={SAMPLE_CODE} />)
    fireEvent.click(getByRole("button"))
    await waitFor(() => {
      expect(getByRole("button").textContent?.toLowerCase()).toContain("copied")
    })
  })

  it("swallows clipboard rejections", () => {
    writeText.mockRejectedValueOnce(new Error("blocked"))
    const { getByRole } = render(<CopyTalentStringButton code={SAMPLE_CODE} />)
    expect(() => fireEvent.click(getByRole("button"))).not.toThrow()
  })
})
