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
            
            <div className="space-y-16"> {/* Projeler arası boşluğu biraz açtık */}
              {content.projects.map((project) => (
                <article key={project.id} className="group overflow-hidden">
                  
                  {/* Başlık her zaman en üstte kalabilir veya resmin yanına alınabilir. 
                      Akademik düzende başlığın üstte kalması daha okunaklıdır. */}
                  <h2 className="text-xl font-semibold mb-4">
                    <Link href={project.href} className="hover:text-emerald-600 transition-colors">
                      {project.title}
                    </Link>
                  </h2>
                  
                  <div className="block">
                    {/* GÖRSEL: Mobilde tam genişlik, masaüstünde 1/3 genişlik */}
                    <div className="relative w-full md:w-1/3 aspect-[16/9] md:float-left md:mr-6 mb-4 rounded-lg overflow-hidden border bg-muted group-hover:opacity-90 transition-opacity">
                      <Link href={project.href}>
                        <Image
                          src={project.image}
                          alt={project.title}
                          unoptimized
                          fill
                          className="object-cover"
                        />
                      </Link>
                    </div>
                    
                    {/* AÇIKLAMA METNİ */}
                    <p className="text-[15px] leading-relaxed text-gray-700">
                      {project.description}
                      <Link 
                        href={project.href} 
                        className="ml-2 text-emerald-600 hover:underline font-medium inline-block"
                      >
                        Read more →
                      </Link>
                    </p>
                  </div>
                  
                  {/* Bir sonraki projenin float'tan etkilenmemesi için temizleyici */}
                  <div className="clear-both"></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
