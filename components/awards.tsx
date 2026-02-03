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

  const fellowshipsscholarships = content.awards
    .filter((a) => a.category === "Fellowships & Scholarships")
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))

  const researchgrantstravelsupport = content.awards
    .filter((a) => a.category === "Research Grants & Travel Support")
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))

  const honorsawards = content.awards
    .filter((a) => a.category === "Honors & Awards")
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))

  return (
    <div className="mt-3 grid gap-8">
      <section>
        <h3 className="text-base font-semibold text-muted-foreground">Fellowships & Scholarships</h3>
        <ul className="mt-2 space-y-2 text-[15px] leading-relaxed">
          {fellowshipsscholarships.map((a, i) => {
            const [title, description] = a.text.split(' — ')
            return (
              <li key={`g-${i}`} className="border-l pl-4 whitespace-pre-line">
                <strong>{title}</strong>{description ? `\n ${description}` : ''}
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-muted-foreground">Honors & Awards</h3>
        <ul className="mt-2 space-y-2 text-[15px] leading-relaxed whitespace-pre-line">
          {honorsawards.map((a, i) => {
            const [title, description] = a.text.split(' — ')
            return (
              <li key={`r-${i}`} className="border-l pl-4">
                <strong>{title}</strong>{description ? `\n ${description}` : ''}
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-muted-foreground">Research Grants & Travel Support</h3>
        <ul className="mt-2 space-y-2 text-[15px] leading-relaxed whitespace-pre-line">
          {researchgrantstravelsupport.map((a, i) => {
            const [title, description] = a.text.split(' — ')
            return (
              <li key={`r-${i}`} className="border-l pl-4">
                <strong>{title}</strong>{description ? `\n ${description}` : ''}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}


