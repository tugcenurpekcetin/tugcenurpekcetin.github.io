export function getBaseUrl(): string {
  // On the client, relative URLs are fine
  if (typeof window !== "undefined") return ""

  // During build/static generation, use environment variables
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  
  // Fallback for local development
  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""
}


