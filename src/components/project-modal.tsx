"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { Project } from "@/data/projects"

type Props = {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  const scrollYRef = useRef(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    setMounted(true)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])
  const modal = project ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <article className="relative w-[min(92vw,1100px)] bg-background/85 backdrop-blur-xl text-foreground border border-white/15 rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-sm text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          ×
        </button>
        <header className="space-y-3 mb-6">
          <h3 className="text-2xl md:text-3xl font-semibold leading-snug">{project.title}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-muted-foreground">
            {project.timeline ? (
              <div className="font-mono">Timeline: <span className="text-foreground/80">{project.timeline}</span></div>
            ) : null}
            {project.industry ? (
              <div>Industry: <span className="text-foreground/80">{project.industry}</span></div>
            ) : null}
            {project.deliverables ? (
              <div>Deliverables: <span className="text-foreground/80">{project.deliverables}</span></div>
            ) : null}
            {project.platforms ? (
              <div>Platforms: <span className="text-foreground/80">{project.platforms}</span></div>
            ) : null}
            {project.team ? (
              <div>Team: <span className="text-foreground/80">{project.team}</span></div>
            ) : null}
          </div>
        </header>
        <p className="text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed">{project.description}</p>

        {project.highlights?.length ? (
          <section className="mt-8">
            <div className="text-xs text-muted-foreground font-mono mb-2">HIGHLIGHTS</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.problems?.length ? (
          <section className="mt-8 space-y-3">
            <div className="text-xs text-muted-foreground font-mono">PROBLEMS → SOLUTIONS</div>
            {project.problems.map((p, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-medium">{p.task}</div>
                <div className="text-sm text-muted-foreground mt-1">{p.solution}</div>
              </div>
            ))}
          </section>
        ) : null}

        <footer className="mt-8 grid sm:grid-cols-2 gap-6 text-xs text-muted-foreground">
          {project.tech?.length ? (
            <div>
              <div className="font-mono mb-1">TECH</div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="px-2 py-1 border border-white/15 rounded-full bg-black/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {project.services?.length ? (
            <div>
              <div className="font-mono mb-1">SERVICES</div>
              <div className="flex flex-wrap gap-2">
                {project.services.map((s) => (
                  <span key={s} className="px-2 py-1 border border-white/15 rounded-full bg-black/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </footer>
      </article>
    </div>
  ) : null

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!project) return
    scrollYRef.current = window.scrollY
    const { style } = document.body
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      overflow: style.overflow,
      width: style.width,
    }
    style.position = "fixed"
    style.top = `-${scrollYRef.current}px`
    style.left = "0"
    style.right = "0"
    style.width = "100%"
    style.overflow = "hidden"
    return () => {
      style.position = prev.position
      style.top = prev.top
      style.left = prev.left
      style.right = prev.right
      style.width = prev.width
      style.overflow = prev.overflow
      window.scrollTo(0, scrollYRef.current)
    }
  }, [project])

  if (!mounted || !project || !modal) return null
  return createPortal(modal, document.body)
}


