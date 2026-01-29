"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { robotDock } from "@/lib/robot-config"

const RobotRuntime = dynamic(() => import("@/components/robot-runtime"), {
  ssr: false,
})

const STORAGE_KEY = "robotEnabled"
const EVENT_NAME = "robot-visibility-changed"

export default function RobotMount() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const read = () => {
      try {
        const v = localStorage.getItem(STORAGE_KEY)
        setEnabled(v === "true")
      } catch {
        setEnabled(false)
      }
    }
    read()
    const onChange = () => read()
    window.addEventListener(EVENT_NAME, onChange)
    window.addEventListener("storage", onChange)
    return () => {
      window.removeEventListener(EVENT_NAME, onChange)
      window.removeEventListener("storage", onChange)
    }
  }, [])

  if (!enabled) return null

  const dockRight = Math.max(-200, (robotDock.dockRight ?? 24) - (robotDock.moveRight ?? 0))
  const dockBottom = Math.max(0, (robotDock.dockBottom ?? 24) + (robotDock.moveUp ?? 0))

  return (
    <RobotRuntime
      scene="https://prod.spline.design/e5-J3rv908yyZ3hX/scene.splinecode"
      width={robotDock.width}
      height={robotDock.height}
      cropRight={robotDock.cropRight}
      cropBottom={robotDock.cropBottom}
      cropLeft={robotDock.cropLeft}
      cropTop={robotDock.cropUp}
      offsetX={robotDock.offsetX}
      offsetY={robotDock.offsetY}
      scale={robotDock.scale}
      dockRight={dockRight}
      dockBottom={dockBottom}
      pointerEvents="none"
    />
  )
}
