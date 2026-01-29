import { SiteHeader } from "@/components/site-header"
import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Github, GraduationCap, Globe, Linkedin } from "lucide-react"
import { promises as fs } from "fs"
import path from "path"

export const metadata = { title: "Profile — Tuğçe Nur Pekçetin" }

type ProfileContent = {
  name: string
  title: string
  bio: string
  profileImage: string
  location: string
  email: string
  socialLinks: {
    linkedin: string
    linkedinUsername: string
    github: string
    twitter: string
    googleScholar: string
  }
}

async function getProfileContent(): Promise<ProfileContent> {
  const filePath = path.join(process.cwd(), "content", "profile.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function ProfilePage() {
  const content = await getProfileContent()

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 md:px-6 mt-6">
        <div className="rounded-lg border bg-card text-card-foreground p-4">
          <div className="flex gap-4 items-start">
            <div className="relative h-20 w-20 flex-shrink-0">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src={content.profileImage}
                  alt={content.name}
                  fill
                  sizes="80px"
                  className="object-cover object-bottom"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold">{content.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {content.title}
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {content.bio}
              </p>
            </div>
          </div>
          
          <ul className="mt-4 grid gap-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{content.location}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <Link className="hover:underline truncate" href={`mailto:${content.email}`}>
                {content.email}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 flex-shrink-0" />
              <Link className="hover:underline" href={content.socialLinks.linkedin} target="_blank">
                {content.socialLinks.linkedinUsername}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Github className="h-4 w-4 flex-shrink-0" />
              <Link className="hover:underline" href={content.socialLinks.github} target="_blank">
                {content.socialLinks.github.replace('https://', '')}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="h-4 w-4 flex-shrink-0" />
              <Link className="hover:underline" href={content.socialLinks.twitter} target="_blank">
                X (Twitter)
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 flex-shrink-0" />
              <Link className="hover:underline" href={content.socialLinks.googleScholar} target="_blank">
                Google Scholar
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
