"use client"

import { useEffect, useState } from "react"
import { Bot, Power } from "lucide-react"

const STORAGE_KEY = "robotEnabled"
const EVENT_NAME = "robot-visibility-changed"

export function RobotToggle() {
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      setEnabled(v === "true")
    } catch {}
  }, [])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    try {
      localStorage.setItem(STORAGE_KEY, String(next))
    } catch {}
    // notify any listeners (RobotMount) that state changed
    window.dispatchEvent(new Event(EVENT_NAME))
  }

  if (!mounted) return null

  return (
    <button
      type="button"
      aria-label="Toggle robot animation"
      aria-pressed={enabled}
      onClick={toggle}
      title={enabled ? "Hide robot animation" : "Show robot animation"}
      className={[
        "inline-flex items-center gap-2 rounded-md border px-3 h-9 text-sm transition",
        enabled
          ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm hover:bg-emerald-100"
          : "bg-white border-muted-foreground/20 text-foreground hover:bg-accent",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 transition",
          enabled ? "bg-emerald-500/90 ring-emerald-600/50" : "bg-muted ring-muted-foreground/30",
        ].join(" ")}
      >
        <Power className={["h-3.5 w-3.5", enabled ? "text-white" : "text-muted-foreground"].join(" ")} />
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Bot className="h-4 w-4 text-emerald-600" />
        <span className="font-medium">Robot</span>
        <span
          className={[
            "ml-1 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
            enabled ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {enabled ? "On" : "Off"}
        </span>
      </span>
    </button>
  )
}
