export type ClientProject = {
  slug: string
  title: string
  description: string
  timeline?: string
  industry?: string
  deliverables?: string
  team?: string
  platforms?: string
  tech?: string[]
  services?: string[]
  libraries?: string[]
  links?: { demo?: string; repo?: string; docs?: string }
  images?: { src: string; alt?: string }[]
  tags?: string[]
  highlights?: string[]
  problems?: { task: string; solution: string }[]
}

export async function fetchProjects(): Promise<ClientProject[]> {
  const res = await fetch("/api/projects", { cache: "no-store" })
  if (!res.ok) return []
  const data = (await res.json()) as { projects: ClientProject[] }
  return data.projects ?? []
}



