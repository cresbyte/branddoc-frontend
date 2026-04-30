"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, ChevronLeft, ChevronRight, Check } from "lucide-react"

const FONTS = [
  "Poppins",
  "Inter",
  "Lato",
  "Playfair Display",
  "Merriweather",
  "Raleway",
  "Nunito",
  "EB Garamond",
]

const INDUSTRIES = [
  "Freelancer / Creative",
  "Retail / Product Store",
  "Food & Beverage",
  "Professional Services",
  "Health & Wellness",
  "Construction / Trades",
  "Photography / Media",
  "Technology",
  "Education",
  "Other",
]

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

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Brand state
  const [brand, setBrand] = useState({
    companyName: "Acme Studio",
    tagline: "Quality you can trust",
    email: "hello@acme.com",
    phone: "+1 234 567 8900",
    website: "https://acme.com",
    address: "123 Creative Lane, New York, USA",
    primaryColor: "#1a1a1a",
    secondaryColor: "#4f46e5",
    font: "Poppins",
    industry: "Freelancer / Creative",
    initials: "AS",
    logoUploaded: true,
  })

  const updateBrand = (key: string, value: string | boolean) =>
    setBrand((prev) => ({ ...prev, [key]: value }))

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1)
    else router.push("/dashboard")
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&family=Lato:wght@400;700&family=Playfair+Display:wght@400;500;600&family=Merriweather:wght@400;700&family=Raleway:wght@400;500;600&family=Nunito:wght@400;500;600&family=EB+Garamond:wght@400;500;600&display=swap');
      `}</style>

      {/* Wordmark */}
      <div className="mb-8 flex items-center gap-2">
        <span className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">Branddoc</span>
      </div>

      <div className="w-full max-w-xl">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-150 ${step > s
                      ? "bg-[#1a1a1a] text-white"
                      : step === s
                        ? "border-2 border-[#1a1a1a] text-[#1a1a1a] bg-white"
                        : "border-2 border-gray-200 text-gray-400 bg-white"
                    }`}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
              </div>
              {s < TOTAL_STEPS && (
                <div
                  className={`flex-1 h-px mx-3 transition-all duration-150 ${step > s ? "bg-[#1a1a1a]" : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step label */}
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-medium">
          Step {step} of {TOTAL_STEPS}
        </p>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {/* ─── STEP 1: Company Info ─── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-[#1a1a1a]">Company information</h2>
                <p className="text-sm text-gray-500 mt-1">This appears on all your generated documents.</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName">Company name <span className="text-red-500">*</span></Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Studio"
                      value={brand.companyName}
                      onChange={(e) => updateBrand("companyName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tagline">
                      Tagline <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="tagline"
                      placeholder="Quality you can trust"
                      value={brand.tagline}
                      onChange={(e) => updateBrand("tagline", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@acme.com"
                      value={brand.email}
                      onChange={(e) => updateBrand("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 234 567 8900"
                      value={brand.phone}
                      onChange={(e) => updateBrand("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website">
                    Website <span className="text-gray-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://acme.com"
                    value={brand.website}
                    onChange={(e) => updateBrand("website", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Physical address <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="address"
                    placeholder="123 Street, City, Country"
                    value={brand.address}
                    onChange={(e) => updateBrand("address", e.target.value)}
                    className="resize-none min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Logo Upload ─── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-[#1a1a1a]">Logo upload</h2>
                <p className="text-sm text-gray-500 mt-1">Your logo will appear on every document you generate.</p>
              </div>
              <Separator />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml"
                className="hidden"
                onChange={() => updateBrand("logoUploaded", true)}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-150 group"
              >
                {brand.logoUploaded ? (
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="h-20 w-20 rounded-xl flex items-center justify-center text-white text-2xl font-semibold"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.initials}
                    </div>
                    <p className="text-sm text-gray-500">Click to replace logo</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors duration-150">
                    <Upload className="h-8 w-8" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Drop your logo here or click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">PNG or SVG recommended. Max 2MB.</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 text-center">
                For best results, use a PNG with a transparent background
              </p>
            </div>
          )}

          {/* ─── STEP 3: Brand Colors ─── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-[#1a1a1a]">Brand colors</h2>
                <p className="text-sm text-gray-500 mt-1">Choose colors that represent your brand identity.</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="primaryColor">Primary color</Label>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg border border-gray-200 shadow-sm cursor-pointer flex-shrink-0 relative overflow-hidden"
                        style={{ backgroundColor: brand.primaryColor }}
                      >
                        <input
                          type="color"
                          value={brand.primaryColor}
                          onChange={(e) => updateBrand("primaryColor", e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <Input
                        id="primaryColor"
                        value={brand.primaryColor}
                        onChange={(e) => updateBrand("primaryColor", e.target.value)}
                        className="font-mono text-sm uppercase"
                        maxLength={7}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="secondaryColor">Secondary color</Label>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg border border-gray-200 shadow-sm cursor-pointer flex-shrink-0 relative overflow-hidden"
                        style={{ backgroundColor: brand.secondaryColor }}
                      >
                        <input
                          type="color"
                          value={brand.secondaryColor}
                          onChange={(e) => updateBrand("secondaryColor", e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <Input
                        id="secondaryColor"
                        value={brand.secondaryColor}
                        onChange={(e) => updateBrand("secondaryColor", e.target.value)}
                        className="font-mono text-sm uppercase"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>

                {/* Live preview bar */}
                <div className="rounded-lg overflow-hidden border border-gray-200 h-16 flex">
                  <div
                    className="flex-1 flex items-center px-4"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    <span className="text-white text-sm font-medium truncate">{brand.companyName || "Your Company"}</span>
                  </div>
                  <div
                    className="flex-1"
                    style={{ backgroundColor: brand.secondaryColor }}
                  />
                </div>
                <p className="text-xs text-gray-400">These colors will appear on all your documents</p>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Font & Industry ─── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-[#1a1a1a]">Font & industry</h2>
                <p className="text-sm text-gray-500 mt-1">Tailor the look and feel of your documents.</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Font family</Label>
                  <Select
                    value={brand.font}
                    onValueChange={(v) => updateBrand("font", v)}
                  >
                    <SelectTrigger id="font-selector">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map((f) => (
                        <SelectItem key={f} value={f} style={{ fontFamily: FONT_STYLES[f] }}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Font preview */}
                  <div
                    className="mt-3 p-4 border border-gray-100 rounded-lg bg-gray-50 text-center"
                    style={{ fontFamily: FONT_STYLES[brand.font] }}
                  >
                    <span className="text-lg text-[#1a1a1a]">{brand.companyName || "Acme Studio"}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Industry</Label>
                  <Select
                    value={brand.industry}
                    onValueChange={(v) => updateBrand("industry", v)}
                  >
                    <SelectTrigger id="industry-selector">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Brand summary card */}
              <Separator />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">Brand summary</p>
                <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.initials}
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a1a]">{brand.companyName || "—"}</p>
                      {brand.tagline && <p className="text-xs text-gray-500">{brand.tagline}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Primary color</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded border border-gray-200"
                          style={{ backgroundColor: brand.primaryColor }}
                        />
                        <span className="font-mono text-xs">{brand.primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Secondary color</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded border border-gray-200"
                          style={{ backgroundColor: brand.secondaryColor }}
                        />
                        <span className="font-mono text-xs">{brand.secondaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Font</p>
                      <span className="text-[#1a1a1a]">{brand.font}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Industry</p>
                      <span className="text-[#1a1a1a]">{brand.industry}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-1 text-gray-500 hover:text-[#1a1a1a]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="gap-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-6"
            >
              {step === TOTAL_STEPS ? "Save my brand profile" : "Continue"}
              {step < TOTAL_STEPS && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
