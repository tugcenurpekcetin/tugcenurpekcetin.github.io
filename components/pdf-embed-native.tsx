"use client"

import { useEffect, useState, useRef } from "react"

export default function PdfEmbedNative({
  src,
  title = "PDF",
  height = 1000,
  width = "100%",
}: {
  src: string
  title?: string
  height?: number
  width?: number | string
}) {
  const [canEmbed, setCanEmbed] = useState(true)
  const [allowPointerEvents, setAllowPointerEvents] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // Try a small delay; if no load event fires on iframe we still show it,
    // but provide a visible fallback link below for manual open.
    setCanEmbed(true)
  }, [src])

  const handleMouseEnter = () => {
    // Don't enable pointer events on hover, keep robot tracking active
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleMouseLeave = () => {
    // Disable pointer events when leaving the area
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setAllowPointerEvents(false)
  }

  const handleClick = () => {
    // Enable pointer events only when user actually clicks to interact with PDF
    setAllowPointerEvents(true)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="w-full">
      <div
        className="relative rounded-md border overflow-hidden bg-muted/10"
        style={{ contain: "layout paint style", isolation: "isolate" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* The native Chrome PDF viewer will render in this iframe */}
        <iframe
          title={title}
          src={src}
          className="w-full"
          style={{ 
            height, 
            width, 
            transform: "translateZ(0)", 
            willChange: "transform", 
            backfaceVisibility: "hidden",
            pointerEvents: allowPointerEvents ? "auto" : "none"
          }}
          onError={() => setCanEmbed(false)}
          loading="lazy"
        />
        {/* Transparent overlay to prevent initial pointer capture */}
        {!allowPointerEvents && (
          <div
            className="absolute inset-0 z-10"
            style={{ pointerEvents: "none", background: "transparent" }}
          />
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {!canEmbed ? (
          <span>
            If the PDF didn{"'"}t load, open it directly:{" "}
            <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
              {src}
            </a>
          </span>
        ) : (
          <span>
            Having trouble?{" "}
            <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
              Open in a new tab
            </a>
          </span>
        )}
      </div>
    </div>
  )
}
