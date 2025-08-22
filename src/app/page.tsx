"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useEffect as useClientEffect } from "react"
import { fetchProjects, type ClientProject } from "@/lib/projects-client"
import { ProjectModal } from "@/components/project-modal"

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([])
  const trackRef = useRef<HTMLDivElement | null>(null)

  const getFirstSentences = (text: string, count = 2): string => {
    if (!text) return ""
    const sentences = text
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
    return sentences.slice(0, count).join(" ")
  }

  // Client-side load of JSON-backed projects
  useClientEffect(() => {
    fetchProjects().then(setClientProjects).catch(() => setClientProjects([]))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "work", "thoughts", "connect"].map((section) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-[80rem] px-8 lg:px-16">
        <header
          id="intro"
          ref={(el) => { sectionsRef.current[0] = el }}
          className="min-h-screen flex items-center opacity-0"
        >
          <div className="grid lg:grid-cols-5 gap-16 w-full">
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">PORTFOLIO / 2025</div>
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight">
                  Nauman
                  <br />
                  <span className="text-muted-foreground">Rao</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Senior AI Engineer crafting production-grade intelligent systems at the intersection of
                  <span className="text-foreground"> LLMs</span>,<span className="text-foreground"> retrieval</span>, and
                  <span className="text-foreground"> voice/agentic experiences</span>.
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available for work
                  </div>
                  <div>Lahore, Pakistan</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-8">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">CURRENTLY</div>
                <div className="space-y-2">
                  <div className="text-foreground">Senior AI Engineer</div>
                  <div className="text-muted-foreground">@ DeltaDots</div>
                  <div className="text-xs text-muted-foreground">Oct 2024 — Present</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                <div className="flex flex-wrap gap-2">
                  {["AI/ML", "LLMs", "RAG", "LangChain", "Python", "AWS"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          id="work"
          ref={(el) => {
            sectionsRef.current[1] = el
          }}
          className="min-h-screen py-32 opacity-0"
        >
          <div className="space-y-16">
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-light">Work Experience</h2>
              <div className="text-sm text-muted-foreground font-mono">2022 — 2025</div>
            </div>

            <div className="space-y-12">
              {[
                {
                  year: "2024",
                  role: "Senior AI Engineer",
                  company: "DeltaDots",
                  description:
                    "Optimized RAG (65%→95%), deployed Llama-3.3-70B/Claude 3.5 (Bedrock), and scaled infra for larger knowledge bases.",
                  tech: ["Python", "LangChain", "RAG", "Claude", "Llama"],
                },
                {
                  year: "2024",
                  role: "Senior AI Engineer (Contract)",
                  company: "The Hexaa",
                  description:
                    "Built voice AI agents with VAPI/LiveKit; Streamlit + SageMaker analytics & text-to-SQL; mentored interns.",
                  tech: ["VAPI", "LiveKit", "SageMaker", "LangChain"],
                },
                {
                  year: "2023",
                  role: "Data Scientist",
                  company: "Five Rivers Technology",
                  description:
                    "Integrated ChatGPT chatbots using LangChain; delivered CLIP/YOLO vision models and RAG pipelines.",
                  tech: ["ChatGPT", "LangChain", "CLIP", "YOLO"],
                },
                {
                  year: "2022",
                  role: "Associate ML Engineer",
                  company: "5ItSolutions",
                  description:
                    "Zero-shot OWL‑ViT, YOLOv8 training with Roboflow/LabelImg; OCR automation via EasyOCR.",
                  tech: ["OWL‑ViT", "YOLOv8", "EasyOCR"],
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-8 py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-xl font-medium">{job.role}</h3>
                      <div className="text-muted-foreground">{job.company}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{job.description}</p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="thoughts"
          ref={(el) => {
            sectionsRef.current[2] = el
          }}
          className="min-h-screen py-32 opacity-0"
        >
          <div className="mx-auto max-w-[1600px] space-y-8">
            <h2 className="text-4xl font-light">Project Case Studies</h2>

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => {
                    const el = trackRef.current
                    if (el) el.scrollBy({ left: -el.clientWidth, behavior: "smooth" })
                  }}
                  className="px-3 py-2 text-sm rounded border border-border hover:border-muted-foreground/50"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => {
                    const el = trackRef.current
                    if (el) el.scrollBy({ left: el.clientWidth, behavior: "smooth" })
                  }}
                  className="px-3 py-2 text-sm rounded border border-border hover:border-muted-foreground/50"
                >
                  Next →
                </button>
              </div>

              <div ref={trackRef} className="no-scrollbar overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
                <div className="flex gap-8 w-full">
                  {clientProjects.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => setOpenSlug(p.slug)}
                      className="text-left group p-6 md:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-lg snap-start shrink-0 flex flex-col min-h-[380px]"
                      style={{ flex: "0 0 calc((100% - 6rem) / 4)" }}
                    >
                      <div className="flex h-full flex-col">
                        <div className="text-xs text-muted-foreground font-mono flex items-center justify-between gap-2 min-h-[24px]">
                          <span className="truncate max-w-[60%]">{p.timeline ?? ""}</span>
                          <span className="shrink-0">{p.industry ?? ""}</span>
                        </div>

                        <h3 className="mt-2 text-lg md:text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300 min-h-[48px] line-clamp-2 flex items-end">
                          {p.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-7 flex-grow min-h-[72px] max-h-[72px] overflow-hidden">{getFirstSentences(p.description || "", 2)}</p>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground min-h-[24px]">
                          {(p.tech ?? []).slice(0, 4).map((t) => (
                            <span key={t} className="px-2 py-1 border border-border rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ProjectModal project={clientProjects.find((x) => x.slug === openSlug) ?? null} onClose={() => setOpenSlug(null)} />
        </section>

        <section
          id="connect"
          ref={(el) => {
            sectionsRef.current[3] = el
          }}
          className="py-32 opacity-0"
        >
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-light">Let&apos;s Connect</h2>

              <div className="space-y-6">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Always interested in new opportunities, collaborations, and conversations about technology and design.
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:naumanrao1254@outlook.com"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-lg">naumanrao1254@outlook.com</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "GitHub", handle: "klaus073", url: "https://github.com/klaus073" },
                  { name: "LinkedIn", handle: "rao-nauman-7042161b0", url: "https://www.linkedin.com/in/rao-nauman-7042161b0/" },
                  { name: "Phone", handle: "+92 304 402 9852", url: "tel:+923044029852" },
                  { name: "Email", handle: "naumanrao1254@outlook.com", url: "mailto:naumanrao1254@outlook.com" },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        {social.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{social.handle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">© 2025 Nauman Rao. All rights reserved.</div>
              
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <button className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300">
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </div>
      </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
