"use client"

import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"

// Configure PDF.js worker from local dependency (avoids CDN/CORS and matches installed version)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

type PdfContinuousViewerProps = {
  file: string
  className?: string
  renderAnnotations?: boolean
  widthPx?: number
  fitWidthFraction?: number // used when widthPx not provided
}

export default function PdfContinuousViewer({
  file,
  className,
  renderAnnotations = true,
  widthPx,
  fitWidthFraction = 0.85,
}: PdfContinuousViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [numPages, setNumPages] = useState<number>(0)
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())

  // Optimize container width updates with debouncing
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    
    let resizeTimeout: NodeJS.Timeout | null = null
    const update = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const w = Math.max(100, Math.floor(el.clientWidth))
        setContainerWidth((prev) => {
          const diff = Math.abs(prev - w)
          // Only update if difference is significant (more than 5px) to prevent micro-adjustments
          return diff > 5 ? w : prev
        })
      }, 100) // Debounce resize updates
    }
    
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      ro.disconnect()
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [])

  // Reset state when file changes
  useEffect(() => {
    setNumPages(0)
    setLoadedPages(new Set())
  }, [file])

  const innerWidth = useMemo(() => 
    widthPx
      ? Math.floor(widthPx)
      : Math.max(100, Math.floor(containerWidth * (fitWidthFraction ?? 0.85)))
  , [widthPx, containerWidth, fitWidthFraction])

  const handlePageLoadSuccess = useCallback((pageNumber: number) => {
    setLoadedPages(prev => new Set(prev).add(pageNumber))
  }, [])

  // Generate array of page numbers
  const pageNumbers = useMemo(() => 
    Array.from({ length: numPages }, (_, i) => i + 1)
  , [numPages])

  return (
    <div
      ref={containerRef}
      className={["relative w-full rounded-md border bg-muted/10", className || ""].join(" ")}
      style={{ contain: "layout paint style", isolation: "isolate" }}
    >
      <Document
        file={file}
        loading={<div className="p-6 text-sm text-muted-foreground">Loading PDF…</div>}
        error={<div className="p-6 text-sm text-muted-foreground">Could not load PDF.</div>}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <div className="relative mx-auto space-y-4 p-4" style={{ width: innerWidth }}>
          {pageNumbers.map((pageNumber) => (
            <div
              key={pageNumber}
              className="relative"
              style={{ 
                // Add a subtle shadow between pages
                boxShadow: pageNumber < numPages ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                marginBottom: pageNumber < numPages ? "8px" : "0"
              }}
            >
              <Page
                pageNumber={pageNumber}
                width={innerWidth}
                renderTextLayer
                renderAnnotationLayer={renderAnnotations}
                className="!m-0 !p-0"
                loading={
                  <div 
                    className="flex items-center justify-center bg-muted/5 border border-muted/20 rounded"
                    style={{ 
                      width: innerWidth, 
                      height: Math.floor(innerWidth * 1.414) // Approximate A4 ratio
                    }}
                  >
                    <div className="text-sm text-muted-foreground">Loading page {pageNumber}…</div>
                  </div>
                }
                onRenderSuccess={() => handlePageLoadSuccess(pageNumber)}
              />
              
              {/* Page number indicator */}
              <div className="absolute top-2 right-2 rounded-md border bg-background/70 backdrop-blur-sm px-2 py-0.5 text-xs text-muted-foreground">
                {pageNumber}
              </div>
            </div>
          ))}
          
          {/* Overall progress indicator */}
          {numPages > 0 && (
            <div className="sticky bottom-4 left-4 inline-block rounded-md border bg-background/80 backdrop-blur-sm px-3 py-2 text-sm text-muted-foreground shadow-md">
              {loadedPages.size} / {numPages} pages loaded
            </div>
          )}
        </div>
      </Document>
    </div>
  )
}
