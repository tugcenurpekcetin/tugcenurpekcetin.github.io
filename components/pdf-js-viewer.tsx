"use client"

import { useEffect, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
// Enable selectable text layer styles
import "react-pdf/dist/Page/TextLayer.css"

// Configure PDF.js worker from local dependency to avoid CDN/cors issues
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

type PdfJsViewerProps = {
  file: string
  className?: string
  renderAnnotations?: boolean
}

export default function PdfJsViewer({ file, className, renderAnnotations = true }: PdfJsViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [numPages, setNumPages] = useState<number>(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      // Ensure we don't set sub-pixel widths to avoid reflow thrash
      const w = Math.max(100, Math.floor(el.clientWidth))
      setContainerWidth((prev) => (prev !== w ? w : prev))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={["w-full rounded-md border overflow-hidden bg-muted/10", className || ""].join(" ")}
      style={{ contain: "layout paint style", isolation: "isolate" }}
    >
      <Document
        file={file}
        loading={<div className="p-6 text-sm text-muted-foreground">Loading PDF…</div>}
        error={<div className="p-6 text-sm text-muted-foreground">Could not load PDF.</div>}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={`pdf_page_${i + 1}`}
            pageNumber={i + 1}
            width={containerWidth}
            renderTextLayer
            renderAnnotationLayer={renderAnnotations}
            className="!m-0 !p-0"
          />
        ))}
      </Document>
    </div>
  )
}


