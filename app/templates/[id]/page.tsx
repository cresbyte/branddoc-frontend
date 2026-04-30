"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Check, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TemplatePreview } from "@/components/template-preview"
import { sampleBrand } from "@/lib/template-data"

// Hardcoded for lh-001 Executive letterhead
const template = {
  id: "lh-001",
  name: "Executive",
  category: "Letterhead",
  description: "A commanding full-width header bar with your logo and company name on the left, contact details right-aligned. A thin accent rule in your secondary color separates the header from the body. Clean and authoritative — suitable for proposals, formal letters, and official correspondence.",
  compatibleWith: ["Word", "Google Docs"],
  price: 4.99,
  features: [
    "Branded header with your logo and colors",
    "Branded footer with contact details",
    "Editable in Microsoft Word",
    "Compatible with Google Docs",
    "Unlimited use after download",
    "Re-download anytime from your dashboard",
  ],
}

const relatedTemplates = [
  { id: "ss-001", name: "Invoice Sheet", price: 4.99, badge: null },
  { id: "kit-001", name: "Starter Business Kit", price: 9.99, badge: "Best value" },
]

const SOFTWARE_COLORS: Record<string, string> = {
  Word: "bg-blue-50 text-blue-700 border-blue-200",
  "Google Docs": "bg-green-50 text-green-700 border-green-200",
}

export default function TemplateDetailPage() {
  const router = useRouter()
  const [activePage, setActivePage] = useState(1)
  const [format, setFormat] = useState<"word" | "gdocs">("word")

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/templates">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#1a1a1a]">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <span className="text-lg font-semibold tracking-tight text-[#1a1a1a]">Branddoc</span>
          <span className="text-gray-300 text-lg">/</span>
          <Link href="/templates" className="text-sm text-gray-400 hover:text-gray-600">Templates</Link>
          <span className="text-gray-300 text-lg">/</span>
          <span className="text-sm text-gray-700">{template.name}</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
        {/* ─── LEFT: Preview panel (60%) ─── */}
        <div className="w-full lg:w-[60%] bg-[#f0eeeb] flex flex-col items-center py-10 px-6 lg:px-12 border-r border-[#e0ddd9]">
          {/* Preview label */}
          <div className="w-full max-w-[560px] flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Preview</span>
            <span className="text-xs text-gray-400">Your brand applied</span>
          </div>

          {/* A4 paper mockup */}
          <div
            className="w-full max-w-[560px] bg-white shadow-xl rounded-sm overflow-hidden"
            style={{ aspectRatio: "1 / 1.414" }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <TemplatePreview templateId={template.id} brand={sampleBrand} size="full" />
            </div>
          </div>

          {/* Page selector */}
          <div className="flex items-center gap-2 mt-5">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all duration-150 ${activePage === p
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-white text-gray-500 border-gray-300 hover:border-gray-500"
                  }`}
              >
                Page {p}
              </button>
            ))}
          </div>

          {/* Software compatibility */}
          <div className="mt-6 w-full max-w-[560px]">
            <p className="text-xs text-gray-400 mb-2">Compatible with</p>
            <div className="flex gap-2">
              {template.compatibleWith.map((sw) => (
                <span key={sw} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${SOFTWARE_COLORS[sw]}`}>
                  {sw}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Download once, use forever in your preferred software.</p>
          </div>
        </div>

        {/* ─── RIGHT: Details panel (40%) ─── */}
        <div className="w-full lg:w-[40%] bg-white flex flex-col">
          <div className="flex-1 p-8 space-y-7 overflow-y-auto">
            {/* Name + category */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-[#1a1a1a]">{template.name}</h1>
                <Badge variant="outline" className="mt-1 text-xs border-gray-300 text-gray-500 font-normal">
                  {template.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{template.description}</p>
            </div>

            <Separator />

            {/* Format selector */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Format</p>
              <div className="space-y-2">
                {[
                  { key: "word" as const, label: "Word (.docx)", sub: "Best for editing in Microsoft Word" },
                  { key: "gdocs" as const, label: "Google Docs ready (.docx)", sub: "Upload directly to Google Drive" },
                ].map((f) => (
                  <div
                    key={f.key}
                    onClick={() => setFormat(f.key)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${format === f.key ? "border-[#1a1a1a] bg-gray-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${format === f.key ? "border-[#1a1a1a]" : "border-gray-300"}`}>
                      {format === f.key && <div className="h-2 w-2 rounded-full bg-[#1a1a1a]" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">{f.label}</p>
                      <p className="text-xs text-gray-400">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* What's included */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">What&apos;s included</p>
              <div className="space-y-2">
                {template.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Pricing</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-[#1a1a1a]">${template.price.toFixed(2)}</span>
                <span className="text-sm text-gray-400">one-time payment</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <Button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white gap-2">
                <Download className="h-4 w-4" />
                Pay ${template.price.toFixed(2)} &amp; download
              </Button>
              <Button variant="outline" className="w-full border-gray-300 hover:border-gray-500 text-gray-700 text-sm">
                Add to kit — save with bundle
              </Button>
            </div>

            <Separator />

            {/* Also purchased */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Often purchased together</p>
              <div className="space-y-2">
                {relatedTemplates.map((rt) => (
                  <div
                    key={rt.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-150 cursor-pointer group"
                    onClick={() => router.push(`/templates/${rt.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      {rt.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          {rt.badge}
                        </span>
                      )}
                      <span className="text-sm font-medium text-[#1a1a1a]">{rt.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">${rt.price.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-gray-400 hover:text-[#1a1a1a] gap-1"
                      >
                        View <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
