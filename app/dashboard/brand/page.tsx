"use client"

import { useState, useRef } from "react"
import Link from "next/link"
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
import { ChevronLeft, Upload, Check } from "lucide-react"

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

export default function EditBrandPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState(false)

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
  })

  const updateBrand = (key: string, value: string) =>
    setBrand((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&family=Lato:wght@400;700&family=Playfair+Display:wght@400;500;600&family=Merriweather:wght@400;700&family=Raleway:wght@400;500;600&family=Nunito:wght@400;500;600&family=EB+Garamond:wght@400;500;600&display=swap');
      `}</style>

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#1a1a1a]">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <span className="text-lg font-semibold tracking-tight text-[#1a1a1a]">Branddoc</span>
          <span className="text-gray-300 text-lg">/</span>
          <span className="text-sm text-gray-500">Edit brand profile</span>
        </div>
        <Button
          onClick={handleSave}
          className={`gap-2 transition-all duration-150 ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"} text-white`}
        >
          {saved && <Check className="h-4 w-4" />}
          {saved ? "Saved!" : "Save changes"}
        </Button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        {/* ── Section 1: Company info ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
          <div>
            <h2 className="text-base font-medium text-[#1a1a1a]">Company information</h2>
            <p className="text-sm text-gray-500 mt-1">This appears on all your generated documents.</p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-companyName">Company name <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-companyName"
                  value={brand.companyName}
                  onChange={(e) => updateBrand("companyName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-tagline">
                  Tagline <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="edit-tagline"
                  value={brand.tagline}
                  onChange={(e) => updateBrand("tagline", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-email">Email address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={brand.email}
                  onChange={(e) => updateBrand("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-phone">Phone number</Label>
                <Input
                  id="edit-phone"
                  value={brand.phone}
                  onChange={(e) => updateBrand("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                value={brand.website}
                onChange={(e) => updateBrand("website", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-address">Physical address</Label>
              <Textarea
                id="edit-address"
                value={brand.address}
                onChange={(e) => updateBrand("address", e.target.value)}
                className="resize-none min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Logo ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
          <div>
            <h2 className="text-base font-medium text-[#1a1a1a]">Logo</h2>
            <p className="text-sm text-gray-500 mt-1">PNG or SVG recommended. Max 2MB.</p>
          </div>
          <Separator />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/svg+xml"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-150"
          >
            <div
              className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.initials}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150">
              <Upload className="h-4 w-4" />
              <span>Click to replace logo</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">For best results, use a PNG with a transparent background</p>
        </div>

        {/* ── Section 3: Brand colors ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
          <div>
            <h2 className="text-base font-medium text-[#1a1a1a]">Brand colors</h2>
            <p className="text-sm text-gray-500 mt-1">These colors will appear on all your documents.</p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex gap-6">
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="edit-primaryColor">Primary color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border border-gray-200 flex-shrink-0 relative overflow-hidden cursor-pointer"
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
                    id="edit-primaryColor"
                    value={brand.primaryColor}
                    onChange={(e) => updateBrand("primaryColor", e.target.value)}
                    className="font-mono text-sm uppercase"
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="edit-secondaryColor">Secondary color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border border-gray-200 flex-shrink-0 relative overflow-hidden cursor-pointer"
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
                    id="edit-secondaryColor"
                    value={brand.secondaryColor}
                    onChange={(e) => updateBrand("secondaryColor", e.target.value)}
                    className="font-mono text-sm uppercase"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
            {/* Preview bar */}
            <div className="rounded-lg overflow-hidden border border-gray-200 h-14 flex">
              <div
                className="flex-1 flex items-center px-4"
                style={{ backgroundColor: brand.primaryColor }}
              >
                <span className="text-white text-sm font-medium truncate">{brand.companyName}</span>
              </div>
              <div className="flex-1" style={{ backgroundColor: brand.secondaryColor }} />
            </div>
            <p className="text-xs text-gray-400">These colors will appear on all your documents</p>
          </div>
        </div>

        {/* ── Section 4: Font & Industry ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
          <div>
            <h2 className="text-base font-medium text-[#1a1a1a]">Font &amp; industry</h2>
            <p className="text-sm text-gray-500 mt-1">Tailor the look and feel of your documents.</p>
          </div>
          <Separator />
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label>Font family</Label>
              <Select value={brand.font} onValueChange={(v) => updateBrand("font", v)}>
                <SelectTrigger id="edit-font">
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
              <div
                className="mt-2 p-4 border border-gray-100 rounded-lg bg-gray-50 text-center"
                style={{ fontFamily: FONT_STYLES[brand.font] }}
              >
                <span className="text-lg text-[#1a1a1a]">{brand.companyName}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Select value={brand.industry} onValueChange={(v) => updateBrand("industry", v)}>
                <SelectTrigger id="edit-industry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Save button (bottom) ── */}
        <div className="flex justify-end pb-10">
          <Button
            onClick={handleSave}
            className={`gap-2 transition-all duration-150 ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"} text-white px-8`}
          >
            {saved && <Check className="h-4 w-4" />}
            {saved ? "Changes saved!" : "Save changes"}
          </Button>
        </div>
      </main>
    </div>
  )
}
