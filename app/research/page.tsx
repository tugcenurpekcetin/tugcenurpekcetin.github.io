import { SiteHeader } from "@/components/site-header"
import SidebarProfile from "@/components/sidebar-profile"
import MobileProfileHeader from "@/components/mobile-profile-header"
import Image from "next/image"
import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"

export const metadata = { title: "Research — Tuğçe Nur Pekçetin" }

type ResearchProject = {
  id: string
  title: string
  image: string
  description: string
  href: string
}

type ResearchContent = {
  pageTitle: string
  projects: ResearchProject[]
}

async function getResearchContent(): Promise<ResearchContent> {
  const filePath = path.join(process.cwd(), "content", "research.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function ResearchPage() {
  const content = await getResearchContent()

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
            <h1 className="text-[22px] font-semibold tracking-tight mb-8">{content.pageTitle}</h1>
            
            <div className="space-y-12">
              {content.projects.map((project) => (
                <article key={project.id} className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    <Link href={project.href} className="hover:underline">
                      {project.title}
                    </Link>
                  </h2>
                  
                  <Link href={project.href} className="block">
                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-muted hover:opacity-90 transition-opacity">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
