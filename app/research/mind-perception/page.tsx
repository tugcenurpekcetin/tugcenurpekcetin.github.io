import { SiteHeader } from "@/components/site-header"
import SidebarProfile from "@/components/sidebar-profile"
import MobileProfileHeader from "@/components/mobile-profile-header"
import Image from "next/image"
import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"

type Publication = {
  title: string
  authors: string
  venue: string
  link: string
}

type ResearchDetailContent = {
  title: string
  pageTitle: string
  image: string
  imageAlt: string
  overviewParagraphs: string[]
  keyQuestions: string[]
  videoUrl: string
  videoTitle: string
  relatedPublications: Publication[]
}

async function getContent(): Promise<ResearchDetailContent> {
  const filePath = path.join(process.cwd(), "content", "research-mind-perception.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export async function generateMetadata() {
  const content = await getContent()
  return { title: content.pageTitle }
}

export default async function MindPerceptionPage() {
  const content = await getContent()
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-6">
          <MobileProfileHeader />
        </div>
        <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-[260px_minmax(0,1fr)]">
          <SidebarProfile />
          <article className="min-w-0 animate-in slide-in-from-left-8 duration-500">
            <div className="mb-6">
              <Link href="/research" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Research
              </Link>
            </div>

            <h1 className="text-[28px] font-bold tracking-tight mb-6">{content.title}</h1>
            
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-muted mb-8">
              <Image
                src={content.image}
                alt={content.imageAlt}
                fill
                className="object-cover"
              />
            </div>

            <section className="space-y-6 text-[15px] leading-relaxed">
              <h2 className="text-xl font-semibold mt-8">Overview</h2>
              {content.overviewParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              <h2 className="text-xl font-semibold mt-8">Key Research Questions</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {content.keyQuestions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold mt-8">Video</h2>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={content.videoUrl}
                  title={content.videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
              </div>

              <h2 className="text-xl font-semibold mt-8">Related Publications</h2>
              <div className="space-y-4">
                {content.relatedPublications.map((pub, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4">
                    <p className="font-medium">
                      <Link href={pub.link} className="hover:underline" target="_blank" rel="noopener noreferrer">
                        {pub.title}
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: pub.authors.replace(/T\. N\. Pekçetin/g, '<strong>T. N. Pekçetin</strong>') }}></p>
                    <p className="text-sm text-muted-foreground">{pub.venue}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  )
}
