"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Check, X, SlidersHorizontal, ChevronRight, Filter } from "lucide-react"
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

const COMPAT_OPTIONS = ["Word", "Google Docs", "Excel", "Google Sheets"]
const STYLE_OPTIONS = ["Bold", "Minimal", "Classic", "Modern", "Compact", "Editorial"]

export default function TemplatesPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<Category>("all")
  const [activeCompat, setActiveCompat] = useState<string[]>([])
  const [activeStyles, setActiveStyles] = useState<string[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

    if (category !== "all") pool = pool.filter((t) => t._type === category)

    if (search.trim()) {
      const q = search.toLowerCase()
      pool = pool.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    }

    if (activeCompat.length) {
      pool = pool.filter((t) => activeCompat.some((c) => t.compatibleWith.includes(c)))
    }

    if (activeStyles.length) {
      pool = pool.filter((t) => {
        if (t._type !== "letterhead") return true 
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

  return (
    <div className="bg-[#fcfdfd] min-h-screen">
      
      {/* ── Page Hero ── */}
      <div className="bg-gradient-to-b from-indigo-50/50 to-transparent pt-20 pb-16 px-6 relative overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <svg className="absolute -top-24 -left-24 w-96 h-96 text-indigo-50 opacity-50" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50"/></svg>
           <svg className="absolute top-12 right-0 w-64 h-64 text-indigo-100/30 opacity-50" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2"><path d="M0 80L80 0M0 60L60 0M0 40L40 0"/></svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Document templates for your <span className="text-indigo-600">business</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Beautiful, ready-to-use branded templates for Word, Google Docs, Excel, and Sheets. 
            Grow your brand with professionally designed documents designed to convert.
          </p>
          <div className="flex items-center justify-center max-w-md mx-auto">
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search templates (e.g. 'Invoice' or 'Minimal')..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-14 rounded-full text-[15px] border-gray-200 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white w-full"
                />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 lg:gap-12 relative items-start">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden w-full flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-900">Filters</span>
          <Button variant="outline" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Filter className="w-4 h-4 mr-2" />
            {mobileMenuOpen ? "Hide" : "Show"} filters
          </Button>
        </div>

        {/* ── Sidebar Filters ── */}
        <aside className={`w-full md:w-64 lg:w-72 flex-shrink-0 flex-col gap-8 sticky top-[104px] z-10 ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
          
          {/* Categories */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">Categories</h3>
            <div className="space-y-1.5">
              {[
                { id: "all", label: "All templates", count: counts.all },
                { id: "letterhead", label: "Letterheads", count: counts.letterhead },
                { id: "spreadsheet", label: "Spreadsheets", count: counts.spreadsheet },
                { id: "kit", label: "Brand Kits", count: counts.kit },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id as Category)}
                  className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
                    category === c.id
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${category === c.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Software Compatibility */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">Compatible with</h3>
            <div className="space-y-2">
              {COMPAT_OPTIONS.map((c) => {
                const isActive = activeCompat.includes(c)
                return (
                  <button
                    key={c}
                    onClick={() => toggleCompat(c)}
                    className="flex items-center gap-3 w-full group"
                  >
                    <div className={`w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center transition-colors ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white text-transparent group-hover:border-indigo-400'}`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className={`text-[15px] ${isActive ? 'text-slate-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{c}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Style */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">Style</h3>
            <div className="space-y-2">
              {STYLE_OPTIONS.map((s) => {
                const isActive = activeStyles.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className="flex items-center gap-3 w-full group"
                  >
                    <div className={`w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center transition-colors ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white text-transparent group-hover:border-indigo-400'}`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className={`text-[15px] ${isActive ? 'text-slate-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{s}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {(activeCompat.length > 0 || activeStyles.length > 0 || category !== 'all' || search) && (
            <Button variant="ghost" className="text-indigo-600 p-0 h-auto justify-start hover:text-indigo-700 hover:bg-transparent mt-2" onClick={clearAll}>
              <X className="w-4 h-4 mr-1.5" />
              Clear all filters
            </Button>
          )}

        </aside>

        {/* ── Grid Area ── */}
        <main className="flex-1 w-full min-w-0 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {category === "all" ? "All templates" : 
               category === "letterhead" ? "Letterhead templates" : 
               category === "spreadsheet" ? "Spreadsheet templates" : "Brand Kits"}
            </h2>
            <span className="text-sm font-medium text-gray-500">{allTemplates.length} results</span>
          </div>

          {allTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-200 border-dashed">
              <SlidersHorizontal className="h-10 w-10 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No templates found</h3>
              <p className="text-[15px] text-gray-500 mb-4 max-w-sm">Try adjusting your filters or search query to find what you're looking for.</p>
              <Button onClick={clearAll} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTemplates.map((t) => {
                  const isKit = t._type === "kit"

                  // KIT CARD
                  if (isKit) {
                    const kit = t as typeof kitTemplates[number] & { _type: "kit" }
                    return (
                      <div
                        key={kit.id}
                        className="bg-white border flex flex-col border-gray-200 rounded-2xl overflow-hidden hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 group cursor-pointer"
                        onClick={() => router.push(`/templates/${kit.id}`)}
                      >
                        <div className="h-[280px] bg-slate-50 relative flex items-center justify-center border-b border-gray-100">
                          {/* Value badge */}
                          <div className={`absolute top-4 left-4 text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${kit.badge === "Best value" ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"}`}>
                            {kit.badge}
                          </div>
                          
                          {/* Kit visual representation */}
                          <div className="flex gap-2 p-6 w-full h-full items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            {[sampleBrand.primaryColor, sampleBrand.secondaryColor, "#cbd5e1", "#e2e8f0"].map((c, i) => (
                              <div
                                key={i}
                                className="w-10 rounded shadow-sm border border-black/5"
                                style={{
                                  height: 80 + (i % 2 === 0 ? 20 : 0) + i * 15,
                                  backgroundColor: c,
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="mb-4">
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{kit.name}</h3>
                            <p className="text-[14px] text-gray-500 line-clamp-2 leading-relaxed">{kit.description}</p>
                          </div>
                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="font-bold text-slate-900">${kit.price}</span>
                            <div className="flex items-center text-indigo-600 text-[14px] font-semibold group-hover:text-indigo-700 transition-colors">
                              View details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  // TEMPLATE CARD (Letterhead / Spreadsheet)
                  const tmpl = t as (LetterheadTemplate | SpreadsheetTemplate) & { _type: "letterhead" | "spreadsheet" }
                  
                  return (
                    <div
                      key={tmpl.id}
                      className="bg-white border flex flex-col border-gray-200 rounded-2xl overflow-hidden hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 group cursor-pointer"
                      onClick={() => router.push(`/templates/${tmpl.id}`)}
                    >
                      {/* Preview Container - Taller ratio */}
                      <div className="w-full bg-[#f8f9fa] border-b border-gray-100 overflow-hidden relative group aspect-[3/4]">
                        <div className="absolute inset-0 p-4 lg:p-6 pb-0 group-hover:scale-[1.02] transition-transform duration-500 flex justify-center">
                           <div className="w-full h-full bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)] ring-1 ring-gray-900/5 overflow-hidden rounded-t-lg">
                              <TemplatePreview templateId={tmpl.id} brand={sampleBrand} size="card" />
                           </div>
                        </div>
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300 z-10" />
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col flex-1 bg-white relative z-20">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-indigo-600 transition-colors">{tmpl.name}</h3>
                          <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-500 whitespace-nowrap">
                            {tmpl._type === "letterhead" ? "Letterhead" : "Sheet"}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
                           {tmpl.compatibleWith.map(sw => (
                             <span key={sw} className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">
                               {sw}
                             </span>
                           ))}
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="font-bold text-slate-900">${tmpl.price}</span>
                          <div className="flex items-center text-indigo-600 text-[14px] font-semibold group-hover:text-indigo-700 transition-colors">
                            Preview <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Load More Button */}
              {allTemplates.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <Button variant="outline" className="rounded-full px-8 py-6 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-semibold text-[15px]">
                    Load more templates
                  </Button>
                </div>
              )}
            </>
          )}

          {/* ── SEO / Info Content Section below grid ── */}
          <div className="mt-28 border-t border-gray-200 pt-16">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-20 max-w-5xl mx-auto">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight leading-snug text-indigo-600">
                      Types of document templates for modern businesses
                   </h2>
                </div>
                <div className="space-y-6 text-gray-600 text-[15px] leading-relaxed">
                   <p>
                     Save time and maintain a professional brand image with our comprehensive library of document templates. Whether you need to send a formal proposal, a client invoice, or internal communications, we have you covered.
                   </p>
                   <ul className="space-y-4">
                      <li className="flex gap-3">
                         <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                         <span><strong>Letterheads:</strong> Custom designed headers and footers that beautifully integrate your logo, contact details, and brand colors.</span>
                      </li>
                      <li className="flex gap-3">
                         <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                         <span><strong>Invoices & Receipts:</strong> Sleek spreadsheet templates formulated to automatically calculate totals while looking undeniably premium.</span>
                      </li>
                      <li className="flex gap-3">
                         <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                         <span><strong>Brand Kits:</strong> Complete packages containing all the essential documents styled uniformly to match your brand identity perfectly.</span>
                      </li>
                   </ul>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-10 max-w-5xl mx-auto">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight leading-snug text-indigo-600">
                      How to choose a document template
                   </h2>
                </div>
                <div className="space-y-6 text-gray-600 text-[15px] leading-relaxed">
                   <p>
                     Choosing the right template is crucial for conveying the right message to your clients and partners. Follow these simple steps:
                   </p>
                   <ul className="space-y-4">
                      <li className="flex gap-3">
                         <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-[13px] font-bold mt-0.5">1</span>
                         <span><strong>Identify your needs:</strong> Are you sending a formal letter or an itemized bill? Select the category that fits your use case.</span>
                      </li>
                      <li className="flex gap-3">
                         <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-[13px] font-bold mt-0.5">2</span>
                         <span><strong>Choose your software:</strong> Ensure the template is compatible with the tools you already use, such as Word or Google Docs.</span>
                      </li>
                      <li className="flex gap-3">
                         <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-[13px] font-bold mt-0.5">3</span>
                         <span><strong>Match your brand vibe:</strong> Select a style—like Minimal, Bold, or Classic—that resonates with your brand's personality and values.</span>
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}
