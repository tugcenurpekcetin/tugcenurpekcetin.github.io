"use client"

import { useEffect, useState } from "react"

export default function PdfViewer({
  src,
  title = "PDF Viewer",
  height = 900,
  fallbackHref,
}: {
  src: string
  title?: string
  height?: number
  fallbackHref?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setShowFallback(false)
    const t = window.setTimeout(() => {
      // If not loaded after timeout, likely blocked by X-Frame-Options/CSP
      if (!loaded) setShowFallback(true)
    }, 2500)
    return () => clearTimeout(t)
  }, [src, loaded])

  return (
    <div className="w-full">
      <div
        className="rounded-md border overflow-hidden bg-muted/10"
        style={{ contain: "layout paint style", isolation: "isolate" }}
      >
        {!showFallback ? (
          <iframe
            title={title}
            src={src}
            className="w-full"
            style={{ height, transform: "translateZ(0)", willChange: "transform", backfaceVisibility: "hidden" }}
            onLoad={() => setLoaded(true)}
            loading="lazy"
          />
        ) : (
          <div className="p-6 text-sm text-muted-foreground">
            <p className="mb-3">
              The PDF couldn{"'"}t be embedded, possibly due to the source site blocking embeds. You can open it in a
              new tab instead.
            </p>
            <a
              href={fallbackHref || src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border px-3 py-2 hover:bg-accent"
            >
              Open PDF
            </a>
          </div>
        )}
      </div>
      <p className="sr-only">{loaded ? "PDF loaded" : "Loading PDF..."}</p>
    </div>
  )
}
