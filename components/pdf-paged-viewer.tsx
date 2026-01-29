"use client"

import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Configure PDF.js worker from local dependency (avoids CDN/CORS and matches installed version)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

type PdfPagedViewerProps = {
  file: string
  className?: string
  renderAnnotations?: boolean
  widthPx?: number
  heightPx?: number
  fitWidthFraction?: number // used when widthPx/heightPx not provided
}

export default function PdfPagedViewer({
  file,
  className,
  renderAnnotations = true,
  widthPx,
  heightPx,
  fitWidthFraction = 0.85,
}: PdfPagedViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastScrollYRef = useRef<number>(0)
  const scrollRestoredRef = useRef<boolean>(false)
  const previousPageRef = useRef<number>(1)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [transitioning, setTransitioning] = useState<boolean>(false)
  const [targetPage, setTargetPage] = useState<number | null>(null)
  const [nextReady, setNextReady] = useState<boolean>(false)
  const [prevReady, setPrevReady] = useState<boolean>(false)
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false)
  const [pendingSwap, setPendingSwap] = useState<boolean>(false)

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

  useEffect(() => {
    // Reset to first page when file changes
    setPage(1)
    scrollRestoredRef.current = false
    previousPageRef.current = 1
  }, [file])

  const startTransition = useCallback((next: number) => {
    if (transitioning) return
    lastScrollYRef.current = window.scrollY
    scrollRestoredRef.current = false
    previousPageRef.current = page
    setTransitioning(true)
    setTargetPage(next)
    setOverlayVisible(false)
  }, [transitioning, page])

  const goPrev = useCallback(() => {
    if (page <= 1) return
    startTransition(page - 1)
  }, [page, startTransition])

  const goNext = useCallback(() => {
    if (!numPages) return
    if (page >= numPages) return
    startTransition(page + 1)
  }, [page, numPages, startTransition])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      }
    },
    [goPrev, goNext]
  )

  const innerWidth = useMemo(() => 
    widthPx
      ? Math.floor(widthPx)
      : Math.max(100, Math.floor(containerWidth * (fitWidthFraction ?? 0.9)))
  , [widthPx, containerWidth, fitWidthFraction])

  // Finalize transition when next page is rendered and fade completed
  // Kick off fade once overlay (next/prev) is ready
  useEffect(() => {
    if (!transitioning) return
    if (targetPage === page + 1 && nextReady) setOverlayVisible(true)
    if (targetPage === page - 1 && prevReady) setOverlayVisible(true)
  }, [transitioning, targetPage, page, nextReady, prevReady])

  // Finalize transition after fade
  useEffect(() => {
    if (!transitioning || !overlayVisible) return
    // Overlay is fully visible; swap base content underneath
    if (typeof targetPage === "number") {
      setPendingSwap(true)
      setPage(targetPage)
    }
  }, [transitioning, overlayVisible, targetPage])

  // When size or page changes, clear readiness to re-render overlays with correct dimensions
  useEffect(() => {
    // Only clear readiness if page actually changed (not just state updates)
    if (previousPageRef.current !== page) {
      setNextReady(false)
      setPrevReady(false)
      previousPageRef.current = page
    }
  }, [page])
  
  // Separate effect for dimension changes to avoid unnecessary readiness resets
  useEffect(() => {
    if (containerWidth > 0) {
      setNextReady(false)
      setPrevReady(false)
    }
  }, [innerWidth, heightPx])

  return (
    <div
      ref={containerRef}
      className={["relative w-full rounded-md border bg-muted/10", className || ""].join(" ")}
      style={{ contain: "layout paint style", isolation: "isolate" }}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <Document
        file={file}
        loading={<div className="p-6 text-sm text-muted-foreground">Loading PDF…</div>}
        error={<div className="p-6 text-sm text-muted-foreground">Could not load PDF.</div>}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <div className="relative mx-auto" style={{ width: innerWidth }}>
          {/* Current page defines layout height */}
          <div 
            className={["transition-opacity duration-200", overlayVisible ? "opacity-0" : "opacity-100"].join(" ")}
            style={{ willChange: transitioning ? "opacity" : "auto" }}
          >
            <Page
              pageNumber={page}
              {...(heightPx ? { height: Math.floor(heightPx) } : { width: innerWidth })}
              renderTextLayer
              renderAnnotationLayer={renderAnnotations}
              className="!m-0 !p-0"
              onRenderSuccess={() => {
                // Only restore scroll position during page transitions, not on every render
                if (!scrollRestoredRef.current && transitioning && pendingSwap) {
                  const y = lastScrollYRef.current
                  if (typeof y === "number" && y > 0) {
                    requestAnimationFrame(() => {
                      window.scrollTo({ top: y, behavior: 'instant' })
                      scrollRestoredRef.current = true
                    })
                  }
                }
                
                // If we swapped base while overlay visible, hide overlay only after base is ready
                if (pendingSwap) {
                  setTransitioning(false)
                  setTargetPage(null)
                  setOverlayVisible(false)
                  setNextReady(false)
                  setPrevReady(false)
                  setPendingSwap(false)
                }
              }}
            />
          </div>

          {/* Always pre-render neighbors off-screen; reveal with crossfade instantly */}
          {numPages > 0 && page < numPages ? (
            <div
              className={[
                "pointer-events-none absolute inset-0 transition-opacity duration-200",
                transitioning && targetPage === page + 1 && overlayVisible ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{ 
                visibility: nextReady ? "visible" : "hidden",
                willChange: transitioning ? "opacity" : "auto"
              }}
            >
              <Page
                pageNumber={page + 1}
                {...(heightPx ? { height: Math.floor(heightPx) } : { width: innerWidth })}
                renderTextLayer
                renderAnnotationLayer={renderAnnotations}
                className="!m-0 !p-0"
                onRenderSuccess={() => {
                  if (!nextReady) setNextReady(true)
                }}
              />
            </div>
          ) : null}

          {numPages > 0 && page > 1 ? (
            <div
              className={[
                "pointer-events-none absolute inset-0 transition-opacity duration-200",
                transitioning && targetPage === page - 1 && overlayVisible ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{ 
                visibility: prevReady ? "visible" : "hidden",
                willChange: transitioning ? "opacity" : "auto"
              }}
            >
              <Page
                pageNumber={page - 1}
                {...(heightPx ? { height: Math.floor(heightPx) } : { width: innerWidth })}
                renderTextLayer
                renderAnnotationLayer={renderAnnotations}
                className="!m-0 !p-0"
                onRenderSuccess={() => {
                  if (!prevReady) setPrevReady(true)
                }}
              />
            </div>
          ) : null}

          {/* Left/Right navigation controls */}
          <button
            type="button"
            aria-label="Previous page"
            onClick={goPrev}
            disabled={page <= 1 || transitioning}
            className="group absolute left-2 top-1/2 z-10 -translate-y-1/2 inline-flex items-center justify-center rounded-md border bg-background/80 px-2 py-2 shadow-sm backdrop-blur transition hover:bg-accent disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            onClick={goNext}
            disabled={page >= (numPages || page) || transitioning}
            className="group absolute right-2 top-1/2 z-10 -translate-y-1/2 inline-flex items-center justify-center rounded-md border bg-background/80 px-2 py-2 shadow-sm backdrop-blur transition hover:bg-accent disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Page indicator */}
          <div className="pointer-events-none absolute right-2 top-2 rounded-md border bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
            {page} / {numPages || "?"}
          </div>
        </div>
      </Document>
    </div>
  )
}


