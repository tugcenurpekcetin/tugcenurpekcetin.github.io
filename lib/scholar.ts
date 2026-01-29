import { load } from "cheerio"

export type ScholarPublication = {
  id: string
  title: string
  authors: string
  venue: string
  year: number
  doi?: string
  pdf?: string
  tags?: string[]
}

export async function fetchScholarPublications(scholarUserId: string): Promise<ScholarPublication[]> {
  const url = `https://scholar.google.com/citations?user=${encodeURIComponent(scholarUserId)}&hl=en&view_op=list_works&sortby=pubdate`
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
  if (!res.ok) return []
  const html = await res.text()
  const $ = load(html)

  const pubs: ScholarPublication[] = []
  $("#gsc_a_b .gsc_a_tr").each((_, el) => {
    const titleLink = $(el).find(".gsc_a_t a.gsc_a_at")
    const title = titleLink.text().trim()
    const yearText = $(el).find(".gsc_a_y span").text().trim()
    const year = Number(yearText) || new Date().getFullYear()
    const rawId = `${title}-${year}`
    const id = rawId
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    const authors = $(el).find(".gsc_a_t .gsc_a_at").parent().find(".gsc_a_t div:nth-child(2)").text().trim()
    const venue = $(el).find(".gsc_a_t .gsc_a_at").parent().find(".gsc_a_t div:nth-child(3)").text().trim()

    const pub: ScholarPublication = {
      id,
      title,
      authors,
      venue,
      year,
    }

    pubs.push(pub)
  })

  return pubs
}


