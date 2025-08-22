export type Project = {
  slug: string
  title: string
  timeline?: string
  industry?: string
  deliverables?: string
  team?: string
  platforms?: string
  tech?: string[]
  services?: string[]
  description: string
  highlights?: string[]
  problems?: { task: string; solution: string }[]
}

export const projects: Project[] = [
  {
    slug: "ekho",
    title: "Ekho – Persona‑Based Voice Assistants and Agents",
    timeline: "July 2024 – Aug 2024",
    industry: "Sales",
    deliverables: "Backend",
    team: "Team lead, Backend Engineer, AI Engineer, DevOps",
    platforms: "Web",
    tech: [
      "Python",
      "Flask",
      "LangChain",
      "VAPI",
      "LiveKit",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
    services: ["OpenAI", "AWS", "Postgres", "Docker"],
    description:
      "Ekho is an AI‑powered platform for training sales agents through interactive voice conversations. It simulates real‑world cold‑calling scenarios and provides feedback with summaries, scores, and improvement tips. The system includes secure account management, persona CRUD, and scalable infra.",
    highlights: [
      "Switched from LiveKit to VAPI for reliable voice detection and RTT.",
      "Persona‑based agents with memory and summaries/scores.",
      "Deployed on AWS with Docker; Postgres for state and analytics.",
    ],
    problems: [
      {
        task: "Backend APIs",
        solution:
          "Implemented Flask APIs for AI interactions, auth, persona CRUD, and secure data ops.",
      },
      {
        task: "LLM Integration",
        solution:
          "Integrated LLMs for dynamic, voice‑driven simulations and real‑time feedback.",
      },
      {
        task: "Call feature",
        solution:
          "Integrated voice stack (VAPI/LiveKit) enabling live, bi‑directional calls with the agent.",
      },
      {
        task: "Conversation history & memory",
        solution:
          "Stored transcripts and state to allow continuity across sessions and targeted coaching.",
      },
      {
        task: "Security & Ops",
        solution:
          "JWT auth, SSL, CORS, CI/CD with GitHub pipelines; backups to S3 and scheduled jobs.",
      },
    ],
  },
]



