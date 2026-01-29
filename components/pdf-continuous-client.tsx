"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const PdfContinuousViewer = dynamic(() => import("./pdf-continuous-viewer"), { ssr: false }) as ComponentType<{
  file: string
  className?: string
  renderAnnotations?: boolean
  widthPx?: number
  fitWidthFraction?: number
}>

export default PdfContinuousViewer
