"use client"

import { useEffect, useRef } from "react"

type PointerCaptureLayerProps = {
  onPointerMove?: (x: number, y: number) => void
  className?: string
  children?: React.ReactNode
}

export default function PointerCaptureLayer({ onPointerMove, className, children }: PointerCaptureLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handle = (e: PointerEvent) => {
      if (onPointerMove) onPointerMove(e.clientX, e.clientY)
    }
    // Capture phase to ensure we see movement even over embedded canvases
    el.addEventListener("pointermove", handle, { passive: true, capture: true })
    return () => el.removeEventListener("pointermove", handle, true as any)
  }, [onPointerMove])

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", contain: "layout paint style", isolation: "isolate" }}
    >
      {children}
    </div>
  )
}


