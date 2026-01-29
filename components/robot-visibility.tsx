"use client"

import React, { createContext, useContext, useState, useMemo } from "react"

type RobotVisibilityContextValue = {
  visible: boolean
  setVisible: (next: boolean) => void
  toggle: () => void
}

const RobotVisibilityContext = createContext<RobotVisibilityContextValue | null>(null)

export function RobotVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState<boolean>(false)
  const value = useMemo(
    () => ({ visible, setVisible, toggle: () => setVisible((v) => !v) }),
    [visible]
  )
  return <RobotVisibilityContext.Provider value={value}>{children}</RobotVisibilityContext.Provider>
}

export function useRobotVisibility(): RobotVisibilityContextValue {
  const ctx = useContext(RobotVisibilityContext)
  if (!ctx) {
    throw new Error("useRobotVisibility must be used within RobotVisibilityProvider")
  }
  return ctx
}


