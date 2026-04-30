"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Check, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TemplatePreview } from "@/components/template-preview"
import {
  sampleBrand,
  letterheadTemplates,
  spreadsheetTemplates,
  kitTemplates,
  type LetterheadTemplate,
  type SpreadsheetTemplate,
} from "@/lib/template-data"

type Category = "all" | "letterhead" | "spreadsheet" | "kit"

const SOFTWARE_COLORS: Record<string, string> = {
  Word: "bg-blue-50 text-blue-700 border-blue-200",
  "Google Docs": "bg-green-50 text-green-700 border-green-200",
  Excel: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Google Sheets": "bg-teal-50 text-teal-700 border-teal-200",
}

const BADGE_COLORS: Record<string, string> = {
  "Best value": "bg-amber-50 text-amber-700 border-amber-200",
  Popular: "bg-blue-50 text-blue-700 border-blue-200",
  Complete: "bg-violet-50 text-violet-700 border-violet-200",
}

const COMPAT_OPTIONS = ["Word", "Google Docs", "Excel", "Google Sheets"]
const STYLE_OPTIONS = ["Bold", "Minimal", "Classic", "Modern", "Compact", "Editorial"]

function SoftwarePill({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${SOFTWARE_COLORS[label] ?? "bg-gray-50 text-gray-600 border-gray-200"
        }`}
    >
      {label}
    </span>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap ${active
          ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
        }`}
    >
      {label}
      {active && <X className="h-3 w-3" />}
    </button>
  )
}

export default function TemplatesPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<Category>("all")
  const [activeCompat, setActiveCompat] = useState<string[]>([])
  const [activeStyles, setActiveStyles] = useState<string[]>([])

  const toggleCompat = (v: string) =>
    setActiveCompat((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))

  const toggleStyle = (v: string) =>
    setActiveStyles((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))

  const clearAll = () => {
    setSearch("")
    setCategory("all")
    setActiveCompat([])
    setActiveStyles([])
  }

  const hasFilters = search || category !== "all" || activeCompat.length || activeStyles.length

  // Combine + filter all templates
  const allTemplates = useMemo(() => {
    const lh = letterheadTemplates.map((t) => ({ ...t, _type: "letterhead" as const }))
    const ss = spreadsheetTemplates.map((t) => ({ ...t, _type: "spreadsheet" as const }))
    const kits = kitTemplates.map((t) => ({ ...t, _type: "kit" as const, style: undefined }))

    let pool = [...lh, ...ss, ...kits] as (
      | (LetterheadTemplate & { _type: "letterhead" })
      | (SpreadsheetTemplate & { _type: "spreadsheet" })
      | (typeof kitTemplates[number] & { _type: "kit"; style: undefined })
    )[]

    // Category filter
    if (category !== "all") pool = pool.filter((t) => t._type === category)

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      pool = pool.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    }

    // Compatible with (OR logic)
    if (activeCompat.length) {
      pool = pool.filter((t) => activeCompat.some((c) => t.compatibleWith.includes(c)))
    }

    // Style (OR logic, letterhead only)
    if (activeStyles.length) {
      pool = pool.filter((t) => {
        if (t._type !== "letterhead") return true // don't hide non-letterhead when style filter is on
        return activeStyles.map((s) => s.toLowerCase()).includes((t as LetterheadTemplate).style)
      })
    }

    return pool
  }, [search, category, activeCompat, activeStyles])

  const counts = {
    all: letterheadTemplates.length + spreadsheetTemplates.length + kitTemplates.length,
    letterhead: letterheadTemplates.length,
    spreadsheet: spreadsheetTemplates.length,
    kit: kitTemplates.length,
  }

  const categoryTabs: { key: Category; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "letterhead", label: `Letterhead (${counts.letterhead})` },
    { key: "spreadsheet", label: `Spreadsheets (${counts.spreadsheet})` },
    { key: "kit", label: `Kits (${counts.kit})` },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ── Page hero ── */}
      <div className="bg-white border-b border-gray-200 px-6 pt-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Branddoc Templates</p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a] tracking-tight">Document templates</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-lg">
            Blank branded templates for Word, Google Docs, Excel, and Sheets — your logo, colors, and font applied automatically.
          </p>
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <Input
              id="template-search"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm border-gray-200 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Category chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categoryTabs.map((t) => (
              <FilterChip
                key={t.key}
                label={t.label}
                active={category === t.key}
                onClick={() => setCategory(t.key)}
              />
            ))}
          </div>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Software compat chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {COMPAT_OPTIONS.map((c) => (
              <FilterChip
                key={c}
                label={c}
                active={activeCompat.includes(c)}
                onClick={() => toggleCompat(c)}
              />
            ))}
          </div>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Style chips (letterhead-relevant) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STYLE_OPTIONS.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={activeStyles.includes(s)}
                onClick={() => toggleStyle(s)}
              />
            ))}
          </div>

          {/* Clear all */}
          {hasFilters && (
            <>
              <div className="h-5 w-px bg-gray-200" />
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-[#1a1a1a] transition-colors duration-150 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </>
          )}

          {/* Result count — pushed to right on large screens */}
          <span className="text-xs text-gray-400 ml-auto hidden sm:block">
            {allTemplates.length} result{allTemplates.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {allTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SlidersHorizontal className="h-8 w-8 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No templates match your filters</p>
            <button onClick={clearAll} className="mt-2 text-xs text-[#4f46e5] hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allTemplates.map((t) => {
              const isKit = t._type === "kit"

              if (isKit) {
                const kit = t as typeof kitTemplates[number] & { _type: "kit" }
                return (
                  <div
                    key={kit.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-150 flex flex-col gap-4 relative col-span-1"
                  >
                    {/* Value badge */}
                    <div
                      className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BADGE_COLORS[kit.badge] ?? "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                    >
                      {kit.badge}
                    </div>

                    {/* Kit icon area */}
                    <div className="h-24 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <div className="flex gap-1.5">
                        {[sampleBrand.primaryColor, sampleBrand.secondaryColor, "#e5e7eb"].map(
                          (c, i) => (
                            <div
                              key={i}
                              className="w-8 rounded-sm border border-gray-200"
                              style={{
                                height: 40 + i * 8,
                                backgroundColor: c,
                                opacity: 0.85,
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div className="pr-12">
                      <p className="font-semibold text-[#1a1a1a] text-sm">{kit.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{kit.description}</p>
                    </div>

                    <div className="space-y-1">
                      {kit.includes.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-gray-600">
                          <Check className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {kit.compatibleWith.map((s) => (
                        <SoftwarePill key={s} label={s} />
                      ))}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[#1a1a1a]">${kit.price.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400">one-time</p>
                      </div>
                      <Button size="sm" className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-xs">
                        Get kit
                      </Button>
                    </div>
                  </div>
                )
              }

              // Letterhead or Spreadsheet card
              const tmpl = t as (LetterheadTemplate | SpreadsheetTemplate) & {
                _type: "letterhead" | "spreadsheet"
              }

              return (
                <div
                  key={tmpl.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all duration-150 group flex flex-col cursor-pointer"
                  onClick={() => router.push(`/templates/${tmpl.id}`)}
                >
                  {/* Preview */}
                  <div
                    className="w-full bg-[#f8f8f8] border-b border-gray-100 overflow-hidden flex-shrink-0"
                    style={{ height: 172 }}
                  >
                    <TemplatePreview templateId={tmpl.id} brand={sampleBrand} size="card" />
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-[#1a1a1a] text-sm leading-tight">{tmpl.name}</p>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium border-gray-200 text-gray-400 whitespace-nowrap flex-shrink-0"
                        >
                          {tmpl._type === "letterhead" ? "Letterhead" : "Sheet"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tmpl.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {tmpl.compatibleWith.map((s) => (
                        <SoftwarePill key={s} label={s} />
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-1">
                      <span className="text-sm font-semibold text-[#1a1a1a]">
                        ${tmpl.price.toFixed(2)}
                      </span>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-3 text-xs border-gray-300 hover:border-gray-500"
                          onClick={() => router.push(`/templates/${tmpl.id}`)}
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
