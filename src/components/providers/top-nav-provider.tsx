"use client"

import { createContext, useCallback, useContext, useState } from "react"

interface TopNavConfig {
  left?: React.ReactNode
  center?: React.ReactNode
  hidden?: boolean
}

interface TopNavContextValue {
  config: TopNavConfig
  set: (config: TopNavConfig) => void
  reset: () => void
}

const TopNavContext = createContext<TopNavContextValue>({
  config: {},
  set: () => {},
  reset: () => {},
})

export function TopNavProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TopNavConfig>({})

  const set = useCallback((next: TopNavConfig) => setConfig(next), [])
  const reset = useCallback(() => setConfig({}), [])

  return (
    <TopNavContext.Provider value={{ config, set, reset }}>
      {children}
    </TopNavContext.Provider>
  )
}

export function useTopNav() {
  return useContext(TopNavContext)
}
