import Image from "next/image"
import profilePic from "@/Tugceinfo/info/profilepic.jpg"
import Link from "next/link"
import { Mail, MapPin, Github, GraduationCap, Globe, BadgeIcon as IdCard, Linkedin, Phone } from "lucide-react"

export default function SidebarProfile() {
  return (
    <aside className="sticky top-16 hidden h-fit w-full md:block md:w-71">
      <div className="rounded-lg border bg-card text-card-foreground p-5">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-[180px] w-[180px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full blur-[8px] bg-[radial-gradient(closest-side,_rgba(0,0,0,0.45),_transparent_70%)]"
            />
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src={profilePic}
                alt="Photo"
                fill
                unoptimized
                sizes="180px"
                className="object-cover object-bottom"
                loading="eager"
                priority={false}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 rounded-full border border-black/35 dark:border-white/25"
              />
            </div>
          </div>
          <h2 className="mt-3 text-xl font-bold">Tuğçe Nur Pekçetin</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Cognitive Science Ph.D<br />Human-Robot Interaction Researcher<br />Fulbright Postdoctoral Scholar</p>
        </div>
        <ul className="mt-5 grid gap-2 text-sm">
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Madison, WI, USA
          </li>
          
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <Link className="hover:underline" href="mailto:pekcetin@wisc.edu">
              pekcetin@wisc.edu
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <Link className="hover:underline" href="mailto:tugce.nur.pekcetin@gmail.com">
              tugce.nur.pekcetin@gmail.com
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <Link className="hover:underline" href="https://scholar.google.com/citations?user=2ks3ZYYAAAAJ&hl=en" target="_blank">
              Google Scholar
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            <Link className="hover:underline" href="https://tr.linkedin.com/in/tugcenurpekcetin" target="_blank">
              tugcenurpekcetin
            </Link>
          </li>      
        </ul>
      </div>
    </aside>
  )
}
