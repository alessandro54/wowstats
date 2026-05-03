import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CharacterHero } from "../character-hero"

const baseProps = {
  name: "Synthracks",
  realm: "Outland",
  region: "EU",
  classSlug: "demon-hunter",
  className: "Demon Hunter",
  armoryUrl: "https://worldofwarcraft.blizzard.com/en-gb/character/eu/outland/synthracks",
}

describe("CharacterHero", () => {
  it("renders without crashing", () => {
    const { container } = render(<CharacterHero {...baseProps} />)
    expect(container.firstChild).toBeDefined()
  })

  it("renders the character name", () => {
    const { container } = render(<CharacterHero {...baseProps} />)
    expect(container.textContent).toContain("Synthracks")
  })

  it("renders the realm and region", () => {
    const { container } = render(<CharacterHero {...baseProps} />)
    expect(container.textContent).toContain("Outland")
    expect(container.textContent).toContain("EU")
  })

  it("renders the class name", () => {
    const { container } = render(<CharacterHero {...baseProps} />)
    expect(container.textContent).toContain("Demon Hunter")
  })

  it("renders spec name when provided", () => {
    const { container } = render(<CharacterHero {...baseProps} specName="havoc" />)
    expect(container.textContent).toContain("Havoc")
  })

  it("renders race when provided", () => {
    const { container } = render(<CharacterHero {...baseProps} race="Night Elf" />)
    expect(container.textContent).toContain("Night Elf")
  })

  it("renders armory link", () => {
    const { container } = render(<CharacterHero {...baseProps} />)
    const link = container.querySelector("a[href*='worldofwarcraft.blizzard.com']")
    expect(link).not.toBeNull()
  })

  it("renders avatar image when avatarUrl provided", () => {
    const { container } = render(
      <CharacterHero {...baseProps} avatarUrl="https://example.com/avatar.jpg" />,
    )
    const images = container.querySelectorAll("img")
    expect(images.length).toBeGreaterThan(0)
  })

  it("falls back to spec icon when no avatar", () => {
    const { container } = render(
      <CharacterHero {...baseProps} specIconUrl="https://example.com/spec.jpg" />,
    )
    const images = container.querySelectorAll("img")
    expect(images.length).toBeGreaterThan(0)
  })

  it("renders no portrait when neither avatar nor spec icon provided", () => {
    const { container } = render(<CharacterHero {...baseProps} />)
    const images = container.querySelectorAll("img")
    expect(images.length).toBe(0)
  })
})
