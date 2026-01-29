import { SiteHeader } from "@/components/site-header"
import SidebarProfile from "@/components/sidebar-profile"
import MobileProfileHeader from "@/components/mobile-profile-header"
import { promises as fs } from "fs"
import path from "path"

export const metadata = { title: "Teaching — Tuğçe Nur Pekçetin" }

type Role = {
  title: string
  department: string
  institution: string
  location: string
  period: string
  details: string
  courses: string[]
}

type TeachingContent = {
  pageTitle: string
  roles: Role[]
}

async function getTeachingContent(): Promise<TeachingContent> {
  const filePath = path.join(process.cwd(), "content", "teaching.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function TeachingPage() {
  const content = await getTeachingContent()

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
            <h1 className="text-[22px] font-semibold tracking-tight">{content.pageTitle}</h1>
            <div className="mt-6 grid gap-4">
              {content.roles.map((r, idx) => (
                <article key={idx} className="rounded-lg border p-4">
                  <header className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-medium leading-snug">
                      {r.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">{r.period}</span>
                  </header>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.department}, {r.institution} · {r.location}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.details}</p>
                  {r.courses.length > 0 ? (
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                      {r.courses.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
