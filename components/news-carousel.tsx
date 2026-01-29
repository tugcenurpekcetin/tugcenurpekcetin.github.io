"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export type NewsItem = {
  date: string
  text: string
}

export default function NewsCarousel({ items, intervalMs = 8000 }: { items: NewsItem[]; intervalMs?: number }) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canAutoPlay = useMemo(() => items.length > 1, [items.length])

  useEffect(() => {
    if (!api || !canAutoPlay) return

    const start = () => {
      stop()
      timerRef.current = setInterval(() => api.scrollNext(), intervalMs)
    }
    const stop = () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }

    start()
    return () => stop()
  }, [api, canAutoPlay, intervalMs])

  return (
    <div
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onMouseLeave={() => api && (timerRef.current = setInterval(() => api.scrollNext(), intervalMs))}
    >
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {items.map((item, idx) => (
            <CarouselItem key={idx}>
              <article className="rounded-lg border p-4">
                <span className="text-xs text-muted-foreground">{item.date}</span>
                <p className="mt-1 text-[15px] leading-relaxed">{item.text}</p>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length > 1 ? (
          <div>
            <CarouselPrevious className="hidden md:flex" />
          </div>
        ) : null}
      </Carousel>
    </div>
  )
}


