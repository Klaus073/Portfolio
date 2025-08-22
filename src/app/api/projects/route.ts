import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

type Project = {
  slug: string
  title: string
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
  description: string
  highlights?: string[]
  problems?: { task: string; solution: string }[]
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function splitList(value?: string): string[] | undefined {
  if (!value) return undefined
  return value
    .split(/[\n,|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function GET() {
  try {
    // Preferred structured file
    const jsonPath = path.join(process.cwd(), "data", "projects.json")
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, "utf8")
      type Extra = {
        libraries?: string[]
        links?: { demo?: string; repo?: string; docs?: string }
        images?: { src: string; alt?: string }[]
        tags?: string[]
      }
      const parsed = JSON.parse(raw) as { projects: (Partial<Project> & Extra)[] }
      const items = (parsed.projects || []) as (Partial<Project> & Extra)[]
      const normalized: Project[] = items.map((p) => ({
        slug: p.slug || toSlug(p.title || "project"),
        title: p.title || "Untitled Project",
        timeline: p.timeline,
        industry: p.industry,
        deliverables: p.deliverables,
        team: p.team,
        platforms: p.platforms,
        tech: p.tech?.filter(Boolean),
        services: p.services?.filter(Boolean),
        libraries: p.libraries?.filter(Boolean),
        links: p.links || undefined,
        images: p.images?.filter((img) => Boolean(img && img.src)) || undefined,
        tags: p.tags?.filter(Boolean),
        description: p.description || "",
        highlights: p.highlights?.filter(Boolean),
        problems: p.problems?.filter((x) => x?.task && x?.solution) as { task: string; solution: string }[] | undefined,
      }))
      return NextResponse.json({ projects: normalized })
    }

    // Fallback: old AI_Portfolio.json (legacy heuristic)
    const legacyPath = path.join(process.cwd(), "data", "AI_Portfolio.json")
    const raw = fs
      .readFileSync(legacyPath, "utf8")
      .replace(/: *NaN/g, ": null")
    const json = JSON.parse(raw) as Record<string, Record<string, unknown>>
    const projects: Project[] = Object.entries(json).map(([title, data]) => ({
      slug: toSlug(title),
      title,
      description: (data["Description"] as string) || "",
      industry: (data["Industry"] as string) || undefined,
      timeline: (data["Timeline"] as string) || undefined,
      deliverables: (data["Deliverables"] as string) || undefined,
      team: (data["Project team"] as string) || undefined,
      platforms: (data["Targeted Platforms"] as string) || undefined,
      tech: splitList((data["Technologies Stack"] as string) || ""),
      services: splitList((data["Third Party Services"] as string) || ""),
      highlights: undefined,
      problems: undefined,
    }))
    return NextResponse.json({ projects })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load projects", details: (err as Error).message },
      { status: 500 },
    )
  }
}


