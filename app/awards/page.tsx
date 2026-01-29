import { SiteHeader } from "@/components/site-header"
import SidebarProfile from "@/components/sidebar-profile"
import Awards from "@/components/awards"
import MobileProfileHeader from "@/components/mobile-profile-header"

export const metadata = {
  title: "Awards — Tuğçe Nur Pekçetin",
}

export default function AwardsPage() {
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
            <h1 className="text-[22px] font-semibold tracking-tight">Awards</h1>
            <Awards />
          </section>
        </div>
      </main>
    </div>
  )
}


