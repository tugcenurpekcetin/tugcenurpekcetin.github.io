"use client"

import { SiteHeader } from "@/components/site-header"
import SidebarProfile from "@/components/sidebar-profile"
import PdfContinuousClient from "@/components/pdf-continuous-client"
import MobileProfileHeader from "@/components/mobile-profile-header"
import { memo } from "react"

const MemoizedSiteHeader = memo(SiteHeader)
const MemoizedSidebarProfile = memo(SidebarProfile)
const MemoizedMobileProfileHeader = memo(MobileProfileHeader)
const MemoizedStaticContent = memo(({ cvSrc }: { cvSrc: string }) => (
  <header className="mb-4">
    <h1 className="text-2xl font-bold tracking-tight">Curriculum Vitae</h1>
    <p className="mt-2 text-sm text-muted-foreground">
      Embedded PDF viewer (native browser viewer). If it doesn{'"'}t load, <a
        href={cvSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        use this link
      </a> to open in your browser's PDF viewer:
      {" "}
    </p>
  </header>
))
MemoizedStaticContent.displayName = "MemoizedStaticContent"

export default function CVPage() {
  // Point to the static CV PDF.
  const cvSrc = "/cv/tugce_cv.pdf"

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <MemoizedSiteHeader />
      <main className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-6">
          <MemoizedMobileProfileHeader />
        </div>
        {/* Matches other pages so the sidebar remains in the same position */}
        <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-[260px_minmax(0,1fr)]">
          <MemoizedSidebarProfile />
          <section className="min-w-0">
            <MemoizedStaticContent cvSrc={cvSrc} />

            <PdfContinuousClient file={cvSrc} />
          </section>
        </div>
      </main>
      {/* Runtime robot stays global via layout, no duplication here */}
    </div>
  )
}
