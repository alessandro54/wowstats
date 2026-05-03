import { fireEvent, render, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CopyLinkButton } from "../copy-link-button"

describe("CopyLinkButton", () => {
  const writeText = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText,
      },
    })
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        href: "https://wowstats.test/character/eu/outland/synthracks",
      },
    })
    writeText.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders the default copy label", () => {
    const { getByRole } = render(<CopyLinkButton />)
    expect(getByRole("button").textContent?.toLowerCase()).toContain("copy link")
  })

  it("writes the current URL to the clipboard on click", () => {
    const { getByRole } = render(<CopyLinkButton />)
    fireEvent.click(getByRole("button"))
    expect(writeText).toHaveBeenCalledWith("https://wowstats.test/character/eu/outland/synthracks")
  })

  it("flips to a Copied label after a successful copy", async () => {
    const { getByRole } = render(<CopyLinkButton />)
    fireEvent.click(getByRole("button"))
    await waitFor(() => {
      expect(getByRole("button").textContent?.toLowerCase()).toContain("copied")
    })
  })

  it("does not throw when clipboard write rejects", async () => {
    writeText.mockRejectedValueOnce(new Error("blocked"))
    const { getByRole } = render(<CopyLinkButton />)
    expect(() => fireEvent.click(getByRole("button"))).not.toThrow()
  })
})
