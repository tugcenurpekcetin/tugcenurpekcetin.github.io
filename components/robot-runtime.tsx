"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Application } from "@splinetool/runtime"

export type RobotRuntimeProps = {
  scene: string
  width?: number
  height?: number
  cropRight?: number
  cropBottom?: number
  cropLeft?: number
  cropTop?: number
  dockRight?: number
  dockBottom?: number
  offsetX?: number
  offsetY?: number
  scale?: number
  pointerEvents?: "auto" | "none"
  canvasRef?: React.RefObject<HTMLCanvasElement>
}

export default function RobotRuntime({
  scene,
  width = 220,
  height = 240,
  cropRight = 0,
  cropBottom = 0,
  cropLeft = 0,
  cropTop = 0,
  dockRight = 24,
  dockBottom = 24,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  pointerEvents = "none",
  canvasRef,
}: RobotRuntimeProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const actualCanvasRef = canvasRef ?? internalCanvasRef
  const appRef = useRef<Application | null>(null)

  useEffect(() => {
    const canvas = actualCanvasRef.current
    if (!canvas) return

    const app = new Application(canvas)
    appRef.current = app
    let cancelled = false

    const load = async () => {
      try {
        await app.load(scene)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load Spline scene", err)
      }
    }
    load()

    // Handle context loss gracefully
    const onContextLost = () => {
      try {
        // @ts-ignore - Spline API may have varying signatures
        app.start()
      } catch {}
    }
    canvas.addEventListener("webglcontextlost", onContextLost)

    return () => {
      cancelled = true
      canvas.removeEventListener("webglcontextlost", onContextLost)
      try {
        appRef.current?.dispose()
      } catch {}
      appRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])

  // Visible box; cropBottom visually shortens the dock height
  const visibleWidth = Math.max(60, width)
  const visibleHeight = Math.max(60, height - cropBottom)

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
        contain: "layout paint size style",
        isolation: "isolate",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-transparent"
        style={{
          border: "0",
          outline: "none",
          boxShadow: "none",
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
          contain: "layout paint style",
        }}
      >
        <div style={stageStyle}>
          <canvas
            ref={actualCanvasRef}
            className="block h-full w-full"
            style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none" }}
          />
        </div>
      </div>
    </div>
  )
}


