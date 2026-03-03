import { ThemeSwitcher } from "@/components/atoms/theme-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface Props {
  children?: React.ReactNode
  centerSlot?: React.ReactNode
}

export function PageHeader({ children, centerSlot }: Props) {
  return (
    <header className="bg-background/40 sticky top-0 z-20 flex h-[60px] shrink-0 items-center gap-2 border-b p-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <div className="hidden min-w-0 flex-1 items-center sm:flex">{children}</div>
      {centerSlot && <div className="flex flex-1 justify-center">{centerSlot}</div>}
      {!centerSlot && <div className="flex-1" />}
      <div className="hidden sm:block">
        <ThemeSwitcher />
      </div>
    </header>
  )
}
