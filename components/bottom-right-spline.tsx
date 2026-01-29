"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Spline from "@splinetool/react-spline"

/**
BottomRightSpline props

- width, height: size of the visible box (px).
- cropRight, cropBottom, cropLeft, cropTop: trim pixels inside the box on each side.
  • cropRight/cropLeft extend the inner stage beyond the edges; overflow hidden performs the trim.
  • cropBottom reduces the visible height and extends stage down.
  • cropTop extends stage up (trim from top).
- offsetX, offsetY, scale: pan/zoom the scene inside the box (does not move the box).
- dockRight, dockBottom: distance from viewport right/bottom (px).
- pointerEvents: keep "none" so it never blocks page interactions; set "auto" for interactive embeds.
*/
export type BottomRightSplineProps = {
  scene: string
  width?: number
  height?: number
  forceTransparentCanvas?: boolean
  fadeMask?: boolean
  pointerEvents?: "auto" | "none"
  offsetX?: number
  offsetY?: number
  scale?: number
  cropRight?: number
  cropBottom?: number
  cropLeft?: number
  cropTop?: number
  dockRight?: number
  dockBottom?: number
}

export default function BottomRightSpline({
  scene,
  width = 200,
  height = 200,
  forceTransparentCanvas = true,
  fadeMask = false,
  pointerEvents = "none",
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  cropRight = 0,
  cropBottom = 0,
  cropLeft = 0,
  cropTop = 0,
  dockRight = 24,
  dockBottom = 24,
}: BottomRightSplineProps) {
  const [enabled] = useState(true)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  // Force Spline canvas transparent if the scene wasn't published with alpha=0
  useEffect(() => {
    if (!forceTransparentCanvas) return
    const el = wrapRef.current
    if (!el) return
    const apply = () => {
      const canvas = el.querySelector("canvas") as HTMLCanvasElement | null
      if (canvas) {
        canvas.style.background = "transparent"
        canvas.style.backgroundColor = "transparent"
      }
    }
    apply()
    const t1 = window.setTimeout(apply, 200)
    const t2 = window.setTimeout(apply, 600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [enabled, forceTransparentCanvas])

  if (!enabled) return null

  // Visible box; cropBottom visually shortens the dock height
  const visibleWidth = Math.max(60, width)
  const visibleHeight = Math.max(60, height - cropBottom)

  const maskStyle: React.CSSProperties = fadeMask
    ? {
        maskImage: "radial-gradient(72% 72% at 50% 50%, black 72%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(72% 72% at 50% 50%, black 72%, transparent 100%)",
      }
    : {}

  // Stage extends beyond edges and is clipped by wrapper overflow to achieve per-side cropping.
  const stageStyle: React.CSSProperties = {
    position: "absolute",
    top: cropTop ? -cropTop : 0,
    left: cropLeft ? -cropLeft : 0,
    right: cropRight ? -cropRight : 0,
    bottom: cropBottom ? -cropBottom : 0,
    transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
    transformOrigin: "center",
    willChange: "transform",
  }

  return (
    <div
      aria-hidden="true"
      className="fixed z-[100]"
      style={{
        right: dockRight,
        bottom: dockBottom,
        width: visibleWidth,
        height: visibleHeight,
        pointerEvents,
        // Keep the robot in its own composited layer to avoid plugin/iframe interference
        contain: "layout paint size style",
        isolation: "isolate",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <div
        ref={wrapRef}
        // No borders or shadows; transparent in light mode, solid black in dark mode
        className="relative h-full w-full overflow-hidden bg-transparent dark:bg-black"
        style={{
          ...maskStyle,
          border: "0",
          outline: "none",
          boxShadow: "none",
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
          contain: "layout paint style",
        }}
      >
        <div style={stageStyle}>
          <Spline scene={scene} />
        </div>
      </div>
    </div>
  )
}
