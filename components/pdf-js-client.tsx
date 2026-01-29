"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const PdfJsViewer = dynamic(() => import("./pdf-js-viewer"), { ssr: false }) as ComponentType<{
  file: string
  className?: string
  renderAnnotations?: boolean
}>

export default PdfJsViewer


