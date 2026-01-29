"use client"

import { useEffect, useRef, useState } from "react"

export type NewsCategory = "award" | "grant" | "publication" | "talk" | "press" | "other"

export type NewsItem = {
  date: string
  text: string
  category: NewsCategory
  href?: string
  external?: boolean
}

export default function NewsTicker({
  items,
  visibleCount = 3,
  intervalMs = 4000,
}: {
  items: NewsItem[]
  visibleCount?: number
  intervalMs?: number
}) {
  const [slotIndices, setSlotIndices] = useState<number[]>(() => 
    Array.from({ length: visibleCount }, (_, i) => i % items.length)
  )
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)
  const [fadingSlots, setFadingSlots] = useState<Set<number>>(new Set())
  const timersRef = useRef<(NodeJS.Timeout | null)[]>([])
  const startTimeRef = useRef<number>(Date.now())

  const visibleItems = slotIndices.map(index => items[index] || null).filter(Boolean)

  const badgeClass = (category: NewsCategory) => {
    switch (category) {
      case "award":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300"
      case "grant":
        return "bg-sky-500/10 text-sky-700 dark:text-sky-300"
      case "publication":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      case "talk":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300"
      case "press":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-300"
      default:
        return "bg-muted/40 text-muted-foreground"
    }
  }

  const startSlotTimer = (slotIndex: number, delay = 0) => {
    // Clear existing timer for this slot
    if (timersRef.current[slotIndex]) {
      clearInterval(timersRef.current[slotIndex]!)
      timersRef.current[slotIndex] = null
    }

    const timer = setTimeout(() => {
      const slotTimer = setInterval(() => {
        // Check current hover state, not closure value
        setHoveredSlot(currentHovered => {
          if (currentHovered === slotIndex) return currentHovered // Skip if this slot is hovered
          
          // Proceed with slot change
          setFadingSlots(prev => new Set(prev).add(slotIndex))
          
          setTimeout(() => {
            setSlotIndices(prev => {
              const newIndices = [...prev]
              // Find next item that's not currently visible
              let nextIndex = (newIndices[slotIndex] + 1) % items.length
              let attempts = 0
              
              while (newIndices.includes(nextIndex) && attempts < items.length) {
                nextIndex = (nextIndex + 1) % items.length
                attempts++
              }
              
              newIndices[slotIndex] = nextIndex
              return newIndices
            })
            
            setFadingSlots(prev => {
              const newSet = new Set(prev)
              newSet.delete(slotIndex)
              return newSet
            })
          }, 150)
          
          return currentHovered // Don't change hover state
        })
      }, intervalMs)
      
      timersRef.current[slotIndex] = slotTimer
    }, delay)
  }

  // Initialize timers
  useEffect(() => {
    if (items.length <= visibleCount) return

    // Reset start time
    startTimeRef.current = Date.now()

    // Start individual timers for each slot with staggered delays
    for (let i = 0; i < visibleCount; i++) {
      const delay = i * (intervalMs / visibleCount)
      startSlotTimer(i, delay)
    }

    return () => {
      timersRef.current.forEach(timer => {
        if (timer) clearInterval(timer)
      })
      timersRef.current = []
    }
  }, [items.length, visibleCount, intervalMs])

  // Handle hover timer reset
  useEffect(() => {
    if (hoveredSlot !== null) {
      // Stop the hovered slot's timer
      if (timersRef.current[hoveredSlot]) {
        clearInterval(timersRef.current[hoveredSlot]!)
        timersRef.current[hoveredSlot] = null
      }
    }
  }, [hoveredSlot])

  // Restart timer when hover ends
  const handleMouseLeave = (slotIndex: number) => {
    setHoveredSlot(null)
    
    // Calculate when this slot should next change based on global timing
    const now = Date.now()
    const elapsedSinceStart = now - startTimeRef.current
    const slotStagger = slotIndex * (intervalMs / visibleCount)
    const nextChangeTime = Math.ceil((elapsedSinceStart - slotStagger) / intervalMs) * intervalMs + slotStagger
    const delay = Math.max(0, nextChangeTime - elapsedSinceStart)
    
    startSlotTimer(slotIndex, delay)
  }

  function NewsRow({ item, offset }: { item: NewsItem; offset: number }) {
    const isHovered = hoveredSlot === offset
    
    const Article = (
      <article
        className={[
          "rounded-lg border p-4",
          isHovered 
            ? "ring-1 ring-emerald-400/40 bg-emerald-50/30 dark:bg-emerald-950/30 scale-[1.01] shadow-md transition-all duration-300 ease-out" 
            : "transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-md",
        ].join(" ")}
        onMouseEnter={() => setHoveredSlot(offset)}
        onMouseLeave={() => handleMouseLeave(offset)}
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-muted-foreground">{item.date}</span>
          <span className={["rounded-sm px-1.5 py-0.5 text-[11px]", badgeClass(item.category)].join(" ")}>
            {item.category}
          </span>
        </div>
        <p className="mt-1 text-[15px] leading-relaxed">{item.text}</p>
      </article>
    )

    const isClickable = !!item.href && (item.external || item.category === "publication")
    if (isClickable && item.href) {
      return item.external ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">{Article}</a>
      ) : (
        <a href={item.href} className="block">{Article}</a>
      )
    }
    return Article
  }

  return (
    <div className="relative">
      <div role="list" aria-label="News items" className="grid gap-4">
        {Array.from({ length: visibleCount }, (_, i) => {
          const item = visibleItems[i]
          if (!item) return null
          const isFading = fadingSlots.has(i)
          const isHovered = hoveredSlot === i
          return (
            <div 
              key={`slot-${i}`} 
              className={[
                isHovered ? "" : "transition-all duration-300 ease-out",
                isFading && !isHovered ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
                isHovered ? "z-10" : "",
              ].join(" ")}
            >
              <NewsRow item={item} offset={i} />
            </div>
          )
        })}
      </div>
      {/* Removed visual next arrow button for a cleaner UI */}
    </div>
  )
}