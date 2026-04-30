"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TemplatePreview } from "@/components/template-preview"
import { sampleBrand, letterheadTemplates } from "@/lib/template-data"

const FONTS = ["Poppins", "Inter", "Lato", "Playfair Display", "Merriweather", "Raleway", "Nunito", "EB Garamond"]

const FONT_STYLES: Record<string, string> = {
  Poppins: "Poppins, sans-serif",
  Inter: "Inter, sans-serif",
  Lato: "Lato, sans-serif",
  "Playfair Display": "'Playfair Display', serif",
  Merriweather: "Merriweather, serif",
  Raleway: "Raleway, sans-serif",
  Nunito: "Nunito, sans-serif",
  "EB Garamond": "'EB Garamond', serif",
}

export default function TemplatizeCustomizePage() {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0)
  const [primaryColor, setPrimaryColor] = useState(sampleBrand.primaryColor)
  const [secondaryColor, setSecondaryColor] = useState(sampleBrand.secondaryColor)
  const [font, setFont] = useState(sampleBrand.font)
  const [format, setFormat] = useState<"word" | "gdocs">("word")
  const [includePdf, setIncludePdf] = useState(false)
  const [includeSignature, setIncludeSignature] = useState(false)

  const selectedTemplate = letterheadTemplates[selectedTemplateIndex]

  const liveBrand = {
    ...sampleBrand,
    primaryColor,
    secondaryColor,
    font,
  }

  const basePrice = 4.99
  const pdfAddon = includePdf ? 1.0 : 0
  const total = basePrice + pdfAddon

  const prev = () => setSelectedTemplateIndex((i) => (i > 0 ? i - 1 : letterheadTemplates.length - 1))
  const next = () => setSelectedTemplateIndex((i) => (i < letterheadTemplates.length - 1 ? i + 1 : 0))

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&family=Lato:wght@400;700&family=Playfair+Display:wght@400;500;600&family=Merriweather:wght@400;700&family=Raleway:wght@400;500;600&family=Nunito:wght@400;500;600&family=EB+Garamond:wght@400;500;600&display=swap');`}</style>

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0">
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
          <span className="text-sm text-gray-700">Customize</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* ─── LEFT PANEL: Template selector + brand controls ─── */}
        <aside className="hidden lg:flex flex-col w-[220px] border-r border-gray-200 bg-white p-5 gap-6 overflow-y-auto flex-shrink-0">

          {/* Template selector */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Template</p>
            <div className="space-y-0.5">
              {letterheadTemplates.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplateIndex(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${i === selectedTemplateIndex
                      ? "bg-gray-100 text-[#1a1a1a] font-medium"
                      : "text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-50"
                    }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Brand controls */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Your brand</p>
            <div className="space-y-4">
              {/* Primary color */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Primary color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-7 w-7 rounded-md border border-gray-200 flex-shrink-0 relative overflow-hidden cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    maxLength={7}
                    className="flex-1 min-w-0 text-xs font-mono border border-gray-200 rounded px-2 py-1 uppercase focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                  <button
                    onClick={() => setPrimaryColor(sampleBrand.primaryColor)}
                    className="text-[10px] text-[#4f46e5] hover:underline whitespace-nowrap"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Secondary color */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Secondary color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-7 w-7 rounded-md border border-gray-200 flex-shrink-0 relative overflow-hidden cursor-pointer"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    maxLength={7}
                    className="flex-1 min-w-0 text-xs font-mono border border-gray-200 rounded px-2 py-1 uppercase focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                  <button
                    onClick={() => setSecondaryColor(sampleBrand.secondaryColor)}
                    className="text-[10px] text-[#4f46e5] hover:underline whitespace-nowrap"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Company name (read-only) */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Company name</Label>
                <div className="text-sm text-[#1a1a1a] font-medium bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5">
                  {sampleBrand.companyName}
                </div>
                <Link href="/dashboard/brand">
                  <span className="text-[10px] text-[#4f46e5] hover:underline cursor-pointer">Edit in brand profile</span>
                </Link>
              </div>

              {/* Font */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Font</Label>
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger className="h-8 text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map((f) => (
                      <SelectItem key={f} value={f} style={{ fontFamily: FONT_STYLES[f] }}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── CENTER PANEL: Live preview ─── */}
        <main className="flex-1 bg-[#f0eeeb] flex flex-col items-center py-8 px-4 overflow-y-auto min-w-0">
          <div className="w-full max-w-[520px]">
            {/* Template name */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-[#1a1a1a]">{selectedTemplate.name}</h2>
                <p className="text-xs text-gray-400">{selectedTemplate.description}</p>
              </div>
              <span className="text-xs text-gray-400">{selectedTemplateIndex + 1} / {letterheadTemplates.length}</span>
            </div>

            {/* A4 Paper */}
            <div
              className="w-full bg-white shadow-xl rounded-sm overflow-hidden"
              style={{ aspectRatio: "1 / 1.414", fontFamily: FONT_STYLES[font] }}
            >
              <div style={{ width: "100%", height: "100%" }}>
                <TemplatePreview templateId={selectedTemplate.id} brand={liveBrand} size="full" />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={prev}
                className="gap-1 border-[#d4d0cc] hover:border-gray-400 text-gray-600 bg-white/80"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous design
              </Button>
              <div className="flex gap-1">
                {letterheadTemplates.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTemplateIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-150 ${i === selectedTemplateIndex ? "w-4 bg-[#1a1a1a]" : "w-1.5 bg-gray-300 hover:bg-gray-400"}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={next}
                className="gap-1 border-[#d4d0cc] hover:border-gray-400 text-gray-600 bg-white/80"
              >
                Next design
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </main>

        {/* ─── RIGHT PANEL: Download options ─── */}
        <aside className="hidden lg:flex flex-col w-[220px] border-l border-gray-200 bg-white p-5 gap-6 overflow-y-auto flex-shrink-0">
          {/* Download options */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Download options</p>
            <div className="space-y-2">
              {[
                { key: "word" as const, label: "Microsoft Word", sub: ".docx" },
                { key: "gdocs" as const, label: "Google Docs", sub: ".docx" },
              ].map((f) => (
                <div
                  key={f.key}
                  onClick={() => setFormat(f.key)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-150 ${format === f.key ? "border-[#1a1a1a] bg-gray-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${format === f.key ? "border-[#1a1a1a]" : "border-gray-300"}`}>
                    {format === f.key && <div className="h-1.5 w-1.5 rounded-full bg-[#1a1a1a]" />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1a1a1a]">{f.label}</p>
                    <p className="text-[10px] text-gray-400">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Add-ons */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Add more formats</p>
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer group">
                <div
                  onClick={() => setIncludePdf(!includePdf)}
                  className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-150 cursor-pointer ${includePdf ? "bg-[#1a1a1a] border-[#1a1a1a]" : "border-gray-300 group-hover:border-gray-500"}`}
                >
                  {includePdf && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <div>
                  <p className="text-xs text-gray-700">PDF preview <span className="text-gray-400">+$1.00</span></p>
                </div>
              </label>
              <label className="flex items-start gap-2 cursor-pointer group">
                <div
                  onClick={() => setIncludeSignature(!includeSignature)}
                  className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-150 cursor-pointer ${includeSignature ? "bg-[#1a1a1a] border-[#1a1a1a]" : "border-gray-300 group-hover:border-gray-500"}`}
                >
                  {includeSignature && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <div>
                  <p className="text-xs text-gray-700">Email signature HTML <span className="text-gray-400">free</span></p>
                </div>
              </label>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Pricing</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>This template</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              {includePdf && (
                <div className="flex justify-between text-gray-600">
                  <span>PDF preview</span>
                  <span>+$1.00</span>
                </div>
              )}
              <Separator className="my-1" />
              <div className="flex justify-between font-semibold text-[#1a1a1a] text-sm">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-2">
            <Button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-xs">
              Pay &amp; download
            </Button>
            <div className="text-center">
              <Link href="/templates/kit-001">
                <span className="text-[11px] text-gray-400 hover:text-[#1a1a1a] cursor-pointer underline underline-offset-2">
                  Or get the full kit for $9.99
                </span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
