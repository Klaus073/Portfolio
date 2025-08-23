"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, Send, Sparkles, Paperclip, Loader2, BookOpen, LinkIcon, Trash2, Sun, Moon } from "lucide-react"

type UploadedDoc = {
  id: string
  name: string
  sizeBytes: number
}

type Source = {
  title: string
  snippet: string
  url?: string
  score?: number
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Source[]
}

export default function RagChatPage() {
  const [isDark, setIsDark] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi! I’m your RAG assistant. Upload PDFs or text files, then ask questions. I’ll ground answers in your docs and cite sources.",
    },
  ])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [demoQALoaded, setDemoQALoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Initialize theme from current document state
  useEffect(() => {
    const html = document.documentElement
    if (!html.classList.contains("dark")) {
      html.classList.add("dark")
      setIsDark(true)
      return
    }
    setIsDark(true)
  }, [])

  // Apply theme toggle to root like the homepage does
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const next: UploadedDoc[] = []
    for (const file of Array.from(files)) {
      // Only demo-level filtering
      if (!/(pdf|txt|md|docx?)$/i.test(file.name)) continue
      next.push({ id: crypto.randomUUID(), name: file.name, sizeBytes: file.size })
    }
    if (next.length) setUploadedDocs((prev) => [...next, ...prev])
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const removeDoc = (id: string) => setUploadedDocs((prev) => prev.filter((d) => d.id !== id))
  const clearDocs = () => setUploadedDocs([])

  const formattedSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const addSampleKnowledge = () => {
    const samples: UploadedDoc[] = [
      { id: crypto.randomUUID(), name: "Employee-Handbook.pdf", sizeBytes: 1_024_000 },
      { id: crypto.randomUUID(), name: "Product-API-Guide.md", sizeBytes: 82_000 },
      { id: crypto.randomUUID(), name: "Pricing-FAQ.txt", sizeBytes: 12_000 },
    ]
    setUploadedDocs((prev) => [...samples, ...prev])

    if (!demoQALoaded) {
      const qa = [
        {
          q: "What is the vacation policy and how many days are allowed?",
          a:
            "According to the Employee Handbook, full-time employees accrue paid vacation with a standard annual allowance. Unused days can carry over up to the policy limit, and requests should be submitted at least 2 weeks in advance.",
          sources: [
            {
              title: "Employee-Handbook.pdf",
              snippet: "Section 2.1 details paid time off, carryover limits, and request timelines.",
              url: undefined,
              score: 0.86,
            },
          ],
        },
        {
          q: "How do I authenticate to the Reporting API and what headers are required?",
          a:
            "Use Bearer token authentication. Include the Authorization header and X-Request-Key for idempotency. Pagination is supported with page and limit parameters.",
          sources: [
            {
              title: "Product-API-Guide.md",
              snippet: "Authentication section outlines Bearer tokens and required headers, including idempotency.",
              url: undefined,
              score: 0.81,
            },
          ],
        },
        {
          q: "What’s the price adjustment or refund policy for annual plans?",
          a:
            "The Pricing FAQ states that adjustments are prorated on plan changes, and refunds are evaluated case-by-case per the standard policy.",
          sources: [
            {
              title: "Pricing-FAQ.txt",
              snippet: "FAQ clarifies plan changes, proration, and refund consideration guidelines.",
              url: undefined,
              score: 0.78,
            },
          ],
        },
      ] as Array<{ q: string; a: string; sources: Source[] }>

      setMessages((prev) => [
        ...prev,
        ...qa.flatMap((item) => [
          { id: crypto.randomUUID(), role: "user" as const, content: item.q },
          { id: crypto.randomUUID(), role: "assistant" as const, content: item.a, sources: item.sources },
        ]),
      ])
      setDemoQALoaded(true)
    }
  }

  const generateMockAnswer = useCallback(
    (question: string): { content: string; sources: Source[] } => {
      const base =
        "Here’s a concise answer based on your knowledge. I’ve grounded the response in the most relevant snippets and included citations below."

      const pool: Source[] = uploadedDocs.length
        ? uploadedDocs.slice(0, 3).map((d, i) => ({
            title: d.name,
            snippet:
              i === 0
                ? "Section 2.1 outlines the exact policy and an example scenario relevant to your query."
                : i === 1
                  ? "Endpoints table describes required headers and pagination strategies."
                  : "FAQ clarifies edge cases and recommended defaults.",
            url: undefined,
            score: 0.83 - i * 0.1,
          }))
        : [
            {
              title: "Company-Wiki: Onboarding",
              snippet: "Quickstart steps 1–3 reduce setup time by ~65%.",
              url: "https://example.com/wiki/onboarding",
              score: 0.82,
            },
            {
              title: "Spec: Reporting API",
              snippet: "Use incremental windows; retries are idempotent with request keys.",
              url: "https://example.com/specs/reporting",
              score: 0.74,
            },
          ]

      const content = `${base}\n\nQ: ${question}`
      return { content, sources: pool }
    },
    [uploadedDocs],
  )

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isThinking) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsThinking(true)

    // Simulate retrieval + generation latency
    await new Promise((r) => setTimeout(r, 900))

    const { content, sources } = generateMockAnswer(trimmed)
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content,
      sources,
    }
    setMessages((prev) => [...prev, assistantMessage])
    setIsThinking(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "New session started. Upload docs and ask away!",
      },
    ])
  }

  const hasDocs = uploadedDocs.length > 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" asChild>
            <Link href="/">← Back</Link>
          </Button>
          <div className="hidden md:block text-sm text-muted-foreground font-mono tracking-wider">DEMO / RAG</div>
        </div>
        <h1 className="text-xl md:text-2xl font-light tracking-tight">RAG Chatbot with Document Grounding</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={addSampleKnowledge}>
            <Sparkles className="w-4 h-4" /> Samples
          </Button>
          <Button size="sm" variant="outline" onClick={resetChat}>New chat</Button>
          <button
            onClick={() => setIsDark((v) => !v)}
            className="group p-2 rounded-md border border-border hover:border-muted-foreground/50 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            )}
          </button>
        </div>
      </header>

      {/* Content area fits viewport height */}
      <div className="h-[calc(100vh-4rem)] px-6 lg:px-12 py-6">
        <div className="grid lg:grid-cols-12 gap-6 h-full">
          {/* Left: Knowledge */}
          <div className="lg:col-span-4 space-y-6 overflow-auto">
            <div className="p-6 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Knowledge</h2>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={clearDocs} disabled={!hasDocs}>
                    <Trash2 className="w-4 h-4" /> Clear
                  </Button>
                </div>
              </div>

              {/* Single Browse button (no drag-and-drop, no extra upload actions) */}
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="w-4 h-4" /> Browse files
                </Button>
                <div className="text-xs text-muted-foreground mt-2">PDF, TXT, MD, DOCX</div>
              </div>

              <div className="mt-6 space-y-3 max-h-64 overflow-auto">
                {uploadedDocs.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No files yet. Add some to ground answers.</div>
                ) : (
                  uploadedDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-3 p-3 border border-border rounded-md">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-4 h-4" />
                        <div className="min-w-0">
                          <div className="truncate">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">{formattedSize(doc.sizeBytes)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDoc(doc.id)}
                        className="p-2 rounded-md border border-border hover:border-muted-foreground/50 transition-colors"
                        aria-label={`Remove ${doc.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-sm text-muted-foreground font-mono">HOW IT WORKS</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Upload files to build a private knowledge base.</li>
                <li>• Ask questions — I retrieve top passages and cite them.</li>
                <li>• Answers stay concise and trustworthy with sources.</li>
              </ul>
            </div>
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-8 h-full">
            <div className="p-6 border border-border rounded-lg flex flex-col h-full">
              <div className="flex-1 overflow-auto space-y-6 pr-2">
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {isThinking ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking… retrieving sources
                  </div>
                ) : null}
                <div ref={chatEndRef} />
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about your documents…"
                    className="flex-1 h-12 resize-none rounded-md border border-border bg-transparent px-3 py-2 focus-visible:ring-ring/50"
                  />
                  <Button className="h-12" onClick={() => void sendMessage()} disabled={!input.trim() || isThinking}>
                    <Send className="w-4 h-4" /> Send
                  </Button>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="text-xs text-muted-foreground">Shift+Enter for newline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 border ${
          isUser
            ? "bg-primary text-primary-foreground border-transparent"
            : "bg-card text-card-foreground border-border"
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        {!isUser && message.sources && message.sources.length ? (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground font-mono">SOURCES</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {message.sources.map((s, idx) => (
                <div key={`${s.title}-${idx}`} className="p-3 rounded-md border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <div className="truncate" title={s.title}>{s.title}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-3">{s.snippet}</div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="opacity-70">score</span>
                      <span>{s.score ? s.score.toFixed(2) : "~"}</span>
                    </div>
                    {s.url ? (
                      <Link href={s.url} className="inline-flex items-center gap-1 hover:underline" target="_blank">
                        <LinkIcon className="w-3 h-3" /> open
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}


