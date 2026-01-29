"use client"

import BottomRightSpline from "@/components/bottom-right-spline"
import { useRobotVisibility } from "@/components/robot-visibility"
import { robotDock } from "@/lib/robot-config"

export default function RobotGate() {
  const { visible } = useRobotVisibility()
  if (!visible) return null

  const dockRight = Math.max(-200, (robotDock.dockRight ?? 24) - (robotDock.moveRight ?? 0))
  const dockBottom = Math.max(0, (robotDock.dockBottom ?? 24) + (robotDock.moveUp ?? 0))

  return (
    <BottomRightSpline
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
      forceTransparentCanvas
      fadeMask={false}
      pointerEvents="none"
    />
  )
}


