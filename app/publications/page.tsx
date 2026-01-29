import { SiteHeader } from "@/components/site-header"
import SidebarProfile from "@/components/sidebar-profile"
import PublicationCard, { type Publication } from "@/components/publication-card"
import MobileProfileHeader from "@/components/mobile-profile-header"
import { publications } from "@/lib/publications-data"

export const metadata = { title: "Publications — Tuğçe Nur Pekçetin" }

export default async function PublicationsPage() {
  const byYear = publications.reduce<Record<number, Publication[]>>((acc, p) => {
    acc[p.year] = acc[p.year] ? [...acc[p.year], p] : [p]
    return acc
  }, {})
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-6">
          <MobileProfileHeader />
        </div>
        <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-[260px_minmax(0,1fr)]">
          <SidebarProfile />
          <section>
            <h1 className="text-[22px] font-semibold tracking-tight">Publications</h1>
            {years.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Publications could not be loaded right now.</p>
            ) : (
              <div className="mt-6 grid gap-10">
                {years.map((year) => (
                  <div key={year} className="grid gap-3">
                    <h2 className="text-base font-semibold text-muted-foreground">{year}</h2>
                    <div className="grid gap-3">
                      {byYear[year].map((p) => (
                        <PublicationCard key={p.id} pub={p} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
