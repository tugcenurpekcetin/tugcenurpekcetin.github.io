import { promises as fs } from "fs"
import path from "path"

type Award = {
  category: string
  sortKey: string
  text: string
}

type AwardsContent = {
  pageTitle: string
  awards: Award[]
}

async function getAwardsContent(): Promise<AwardsContent> {
  const filePath = path.join(process.cwd(), "content", "awards.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function Awards() {
  const content = await getAwardsContent()

  const grants = content.awards
    .filter((a) => a.category === "grants")
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))

  const recognition = content.awards
    .filter((a) => a.category === "recognition")
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))

  return (
    <div className="mt-3 grid gap-8">
      <section>
        <h3 className="text-base font-semibold">Grants / Scholarships / Fellowships</h3>
        <ul className="mt-2 space-y-2 text-[15px] leading-relaxed">
          {grants.map((a, i) => {
            const [title, description] = a.text.split(' — ')
            return (
              <li key={`g-${i}`} className="border-l pl-4">
                <strong>{title}</strong>{description ? ` — ${description}` : ''}
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold">Recognition / Awards</h3>
        <ul className="mt-2 space-y-2 text-[15px] leading-relaxed">
          {recognition.map((a, i) => {
            const [title, description] = a.text.split(' — ')
            return (
              <li key={`r-${i}`} className="border-l pl-4">
                <strong>{title}</strong>{description ? ` — ${description}` : ''}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}


