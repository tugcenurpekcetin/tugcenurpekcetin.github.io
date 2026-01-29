"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { RobotToggle } from "./theme-toggle" // repurposed button

const nav = [
  { href: "/", label: "Home" },
  { href: "/publications", label: "Publications" },
  { href: "/research", label: "Research" },
  { href: "/awards", label: "Awards" },
  { href: "/teaching", label: "Teaching" },
  { href: "/cv", label: "CV" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-14 items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">
            Tuğçe Nur Pekçetin
          </Link>

          <nav className="ml-8 hidden md:flex items-center gap-5">
            {nav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "relative text-sm transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    "after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0",
                    "after:bg-emerald-500/70 after:transition-all after:duration-200",
                    "hover:after:w-full",
                    isActive ? "after:w-full" : "",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:inline-flex">
              <RobotToggle />
            </div>
            <button
              aria-label="Toggle menu"
              className="md:hidden inline-flex items-center justify-center rounded-md border px-2 py-2 text-sm"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <nav className="mx-auto max-w-5xl px-4 py-2 grid gap-1">
            {nav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={[
                    "relative py-2 text-sm",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    "after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0",
                    "after:bg-emerald-500/70 after:transition-all after:duration-200 hover:after:w-full",
                    isActive ? "after:w-full" : "",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
