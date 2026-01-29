"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const PdfPagedViewer = dynamic(() => import("./pdf-paged-viewer"), { ssr: false }) as ComponentType<{
  file: string
  className?: string
  renderAnnotations?: boolean
}>

export default PdfPagedViewer


