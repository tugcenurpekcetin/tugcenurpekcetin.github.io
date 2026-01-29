import { SiteHeader } from "@/components/site-header"
import SidebarProfile from "@/components/sidebar-profile"
import MobileProfileHeader from "@/components/mobile-profile-header"
import { promises as fs } from "fs"
import path from "path"

export const metadata = {
  title: "Tuğçe Nur Pekçetin",
  description: "Tuğçe Nur Pekçetin's academic site",
}

type HomeContent = {
  pageTitle: string
  heroText: string
  news: Array<{
    date: string
    text: string
  }>
}

async function getHomeContent(): Promise<HomeContent> {
  const filePath = path.join(process.cwd(), "content", "home.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function Page() {
  const content = await getHomeContent()

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-6">
          <MobileProfileHeader />
        </div>
        <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-[260px_minmax(0,1fr)]">
          <SidebarProfile />
          <section className="min-w-0">
            <header className="mb-8">
              <h1 className="text-[28px] font-bold tracking-tight">{content.pageTitle}</h1>
              <div className="space-y-4 text-sm leading-relaxed">
                <p className="text-justify">{content.heroText}</p>
              </div>
            </header>

            <div className="grid gap-12">
              <section aria-labelledby="news">
                <h2 id="news" className="text-lg font-semibold">
                  News
                </h2>
                <div className="mt-4 space-y-4">
                  {content.news.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 -mx-2 px-2 py-2 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-sm cursor-pointer"
                    >
                      <span className="text-sm text-muted-foreground font-mono min-w-[80px] mt-0.5">
                        {item.date}
                      </span>
                      <span className="text-sm leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
