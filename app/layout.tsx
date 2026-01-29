import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import RobotMount from "@/components/robot-mount"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Tuğçe Nur Pekçetin",
  description: "Tuğçe Nur Pekçetin's academic site",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html { font-family: ${GeistSans.style.fontFamily}; --font-sans: ${GeistSans.variable}; --font-mono: ${GeistMono.variable}; }
        `}</style>
      </head>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <RobotMount />
          </Suspense>

          <div className="relative z-10">
            {children}
            <footer className="mx-auto max-w-5xl px-4 md:px-6 mt-14 border-t py-6 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Tuğçe Nur Pekçetin
            </footer>
          </div>

          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
