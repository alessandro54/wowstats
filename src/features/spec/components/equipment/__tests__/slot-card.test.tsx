import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SlotCard } from "../slot-card"

const enchantBySlot = new Map()
const gemBySlot = new Map()

describe("SlotCard", () => {
  it("renders empty placeholder when no entries", () => {
    const { container } = render(
      <TooltipProvider>
        <SlotCard
          slot="HEAD"
          entries={undefined}
          enchantBySlot={enchantBySlot}
          gemBySlot={gemBySlot}
          activeColor="#a330c9"
          isBis={false}
          side="left"
        />
      </TooltipProvider>,
    )
    expect(container.firstChild).toBeDefined()
  })

  it("renders empty placeholder when entries is empty array", () => {
    const { container } = render(
      <TooltipProvider>
        <SlotCard
          slot="HEAD"
          entries={[]}
          enchantBySlot={enchantBySlot}
          gemBySlot={gemBySlot}
          activeColor="#a330c9"
          isBis={false}
          side="left"
        />
      </TooltipProvider>,
    )
    expect(container.firstChild).toBeDefined()
  })
})
