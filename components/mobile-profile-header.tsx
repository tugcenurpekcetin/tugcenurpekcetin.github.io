import Image from "next/image"
import Link from "next/link"
import profilePic from "@/Tugceinfo/info/profilepic.jpg"
import { Mail, MapPin, Github, GraduationCap, Globe, Linkedin } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function MobileProfileHeader() {
  return (
    <div className="md:hidden rounded-lg border bg-card text-card-foreground p-3 mb-6">
      <div className="flex gap-3 items-center">
        <div className="relative h-16 w-16 flex-shrink-0">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src={profilePic}
              alt="Tuğçe Nur Pekçetin"
              fill
              sizes="64px"
              className="object-cover object-bottom"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold">Tuğçe Nur Pekçetin</h2>
          <p className="text-xs text-muted-foreground">
            Cognitive Science Ph.D Postdoctoral Fulbright Scholar
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              Follow
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="mailto:tugce.nur.pekcetin@gmail.com" className="flex items-center gap-2 cursor-pointer">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="https://tr.linkedin.com/in/tugcenurpekcetin" target="_blank" className="flex items-center gap-2 cursor-pointer">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="https://github.com/TPekcetin" target="_blank" className="flex items-center gap-2 cursor-pointer">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="https://x.com/tugcenpekcetin?lang=en" target="_blank" className="flex items-center gap-2 cursor-pointer">
                <Globe className="h-4 w-4" />
                <span>X (Twitter)</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="https://scholar.google.com/citations?user=2ks3ZYYAAAAJ&hl=en" target="_blank" className="flex items-center gap-2 cursor-pointer">
                <GraduationCap className="h-4 w-4" />
                <span>Google Scholar</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
