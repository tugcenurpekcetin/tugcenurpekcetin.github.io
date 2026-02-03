import Link from "next/link"

export type Publication = {
  id: string
  title: string
  authors: string
  venue: string
  year: number
  tags?: string[]
  pdf?: string | null // points to a PDF or a page that serves a PDF; embedded via viewer route
  doi?: string | null
  link?: string | null // alternative to doi
  project?: string
}

export default function PublicationCard({
  pub = {
    id: "demo",
    title: "Example Paper Title in HRI",
    authors: "A. Rivera, B. Kim, C. Patel",
    venue: "HRI",
    year: 2025,
    tags: ["HRI", "Trust", "Evaluation"],
    pdf: undefined,
    doi: "#",
  },
}: { pub?: Publication }) {
  const isFirstAuthor = (() => {
    const normalize = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // strip diacritics
        .toLowerCase()
        .replace(/[\.]/g, "")
        .replace(/[,]/g, " ")
        .replace(/\s+/g, " ")
        .trim()

    const firstAuthorRaw = (pub.authors.split(/[;,]/)[0] ?? "").trim()
    const first = normalize(firstAuthorRaw)
    const compact = first.replace(/\s+/g, " ")

    const hasSurname = compact.includes("pekcetin")
    const hasGivenName = compact.includes("tugce")
    const tnBeforeSurname = compact.includes("tn pekcetin") || compact.includes("t n pekcetin")
    const tnAfterSurname = compact.includes("pekcetin tn") || compact.includes("pekcetin t n")
    const reversedWithName = hasSurname && hasGivenName

    return reversedWithName || tnBeforeSurname || tnAfterSurname
  })()

  const formatAuthors = (authors: string) => {
    const authorList = authors.split(/[;,]/).map((a) => a.trim())
    return authorList.map((author, idx) => {
      const normalized = author
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[\.]/g, "")
        .replace(/[,]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
      
      const hasPekcetin = normalized.includes("pekcetin")
      const hasTugce = normalized.includes("tugce") || normalized.includes("tn") || normalized.includes("t n")
      const isTugce = hasPekcetin && hasTugce
      
      const separator = idx === authorList.length - 1 ? "" : idx === authorList.length - 2 ? " and " : ", "
      
      return (
        <span key={idx}>
          {isTugce ? <strong>{author}</strong> : author}
          {separator}
        </span>
      )
    })
  }

  return (
    <article
      className={[
        "rounded-lg border p-4 transition-all duration-500 hover:shadow-sm",
        isFirstAuthor ? "border-l-2 border-l-emerald-500/30 animate-in slide-in-from-left-2 fade-in duration-700" : "",
      ].join(" ")}
    >
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <h3 className="font-medium leading-snug">
          {pub.pdf ? (
            <Link href={`/publications/${encodeURIComponent(pub.id)}`} className="hover:underline">
              {pub.title}
            </Link>
          ) : pub.doi || pub.link ? (
            <Link href={pub.doi || pub.link || "#"} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {pub.title}
            </Link>
          ) : (
            pub.title
          )}
        </h3>
        <span className="text-xs text-muted-foreground">
          {pub.venue} {pub.year}
        </span>
      </header>

      <p className="mt-1 text-sm text-muted-foreground">
        {formatAuthors(pub.authors)}
      </p>

      {pub.tags && pub.tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {pub.tags.map((t) => (
            <li key={t} className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
              {t}
            </li>
          ))}
        </ul>
      ) : null}

      {(pub.pdf || pub.doi || pub.link || pub.project) && (
        <div className="mt-3 flex flex-wrap gap-5 text-sm">
          {pub.pdf ? (
            <Link
              href={`/publications/${encodeURIComponent(pub.id)}`}
              className="relative text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
            >
              <span className="after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full">
                View PDF
              </span>
            </Link>
          ) : null}

          {pub.doi || pub.link ? (
            <Link
              href={pub.doi || pub.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
            >
              <span className="after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full">
                {pub.doi ? "DOI" : "Link"}
              </span>
            </Link>
          ) : null}

          {pub.project ? (
            <Link
              href={pub.project}
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
            >
            </Link>
          ) : null}
        </div>
      )}
    </article>
  )
}
