"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FileText,
  Mail,
  Receipt,
  File,
  Download,
  Pencil,
  ArrowRight,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react"
import { TemplatePreview } from "@/components/template-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const sampleBrand = {
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
}

const recentDocuments = [
  { id: "INV-2026-001", type: "Invoice", created: "Apr 28, 2026", status: "Downloaded" },
  { id: "INV-2026-002", type: "Invoice", created: "Apr 25, 2026", status: "Downloaded" },
  { id: "LTR-2026-001", type: "Letterhead", created: "Apr 20, 2026", status: "Downloaded" },
]

const documentTypes = [
  {
    id: "invoice",
    name: "Invoice",
    description: "Professional invoices with your branding",
    icon: FileText,
    href: "/create/invoice",
    price: "$4.99",
  },
  {
    id: "letterhead",
    name: "Letterhead",
    description: "Branded letterhead for formal correspondence",
    icon: File,
    href: "/create/letterhead",
    price: "$4.99",
  },
  {
    id: "receipt",
    name: "Receipt",
    description: "Clean receipts for every transaction",
    icon: Receipt,
    href: "/create/receipt",
    price: "$4.99",
  },
  {
    id: "email-signature",
    name: "Email Signature",
    description: "HTML email signature ready to copy",
    icon: Mail,
    href: "/create/email-signature",
    price: "$4.99",
  },
]

export default function BranddocDashboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-10">

        {/* ── Welcome + user ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-medium text-[#1a1a1a]">Good morning, Jane.</h1>
            <p className="text-gray-500 mt-1">Your brand is saved. Pick a document to create.</p>
          </div>
          <Avatar className="h-9 w-9 mt-1 flex-shrink-0">
            <AvatarFallback className="bg-[#1a1a1a] text-white text-xs font-medium">JD</AvatarFallback>
          </Avatar>
        </div>

        {/* ── Brand profile card ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-5">
          <div
            className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
            style={{ backgroundColor: sampleBrand.primaryColor }}
          >
            {sampleBrand.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#1a1a1a]">{sampleBrand.companyName}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-3.5 w-3.5 rounded-sm border border-gray-200"
                  style={{ backgroundColor: sampleBrand.primaryColor }}
                />
                <div
                  className="h-3.5 w-3.5 rounded-sm border border-gray-200"
                  style={{ backgroundColor: sampleBrand.secondaryColor }}
                />
              </div>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{sampleBrand.font}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{sampleBrand.industry}</span>
            </div>
          </div>
          <Link href="/dashboard/brand">
            <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-[#1a1a1a] gap-1 flex-shrink-0">
              <Pencil className="h-3 w-3" />
              Edit brand
            </Button>
          </Link>
        </div>

        {/* ── Document type grid ── */}
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">Create a document</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {documentTypes.map((doc) => {
              const Icon = doc.icon
              return (
                <Card
                  key={doc.id}
                  className="border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all duration-150 cursor-pointer group bg-white"
                  onClick={() => router.push(doc.href)}
                >
                  <CardContent className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors duration-150">
                        <Icon className="h-5 w-5 text-[#1a1a1a]" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs font-medium text-gray-500 border-gray-200"
                      >
                        {doc.price}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a1a] text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{doc.description}</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-xs mt-auto"
                      onClick={(e) => { e.stopPropagation(); router.push(doc.href) }}
                    >
                      Create
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* ── Recent documents ── */}
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">Recent documents</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Document</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Type</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Created</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Action</span>
            </div>
            {recentDocuments.map((doc, i) => (
              <div key={doc.id}>
                <div className="grid grid-cols-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors duration-150">
                  <span className="text-sm font-medium text-[#1a1a1a]">{doc.id}</span>
                  <span className="text-sm text-gray-600">{doc.type}</span>
                  <span className="text-sm text-gray-500">{doc.created}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" className="text-xs">
                      {doc.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-gray-500 hover:text-[#1a1a1a] gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Re-download
                    </Button>
                  </div>
                </div>
                {i < recentDocuments.length - 1 && (
                  <Separator className="mx-5 w-auto" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Document templates section ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Document templates</h2>
              <p className="text-xs text-gray-400 mt-0.5">Blank branded templates for Word, Google Docs, Excel, and Sheets</p>
            </div>
            <Link href="/templates">
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-[#1a1a1a] gap-1">
                Browse all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {/* Template card 1: Executive */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all duration-150 flex-shrink-0 w-[200px]">
              <div className="w-full overflow-hidden bg-[#f8f8f8] border-b border-gray-100" style={{ height: 120 }}>
                <TemplatePreview templateId="lh-001" brand={sampleBrand} size="card" />
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#1a1a1a]">Executive</p>
                  <span className="text-xs text-gray-500">$4.99</span>
                </div>
                <Link href="/templates/lh-001">
                  <Button variant="outline" size="sm" className="w-full h-6 text-[10px] border-gray-200">Preview</Button>
                </Link>
              </div>
            </div>
            {/* Template card 2: Minimal Line */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all duration-150 flex-shrink-0 w-[200px]">
              <div className="w-full overflow-hidden bg-[#f8f8f8] border-b border-gray-100" style={{ height: 120 }}>
                <TemplatePreview templateId="lh-002" brand={sampleBrand} size="card" />
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#1a1a1a]">Minimal Line</p>
                  <span className="text-xs text-gray-500">$4.99</span>
                </div>
                <Link href="/templates/lh-002">
                  <Button variant="outline" size="sm" className="w-full h-6 text-[10px] border-gray-200">Preview</Button>
                </Link>
              </div>
            </div>
            {/* Template card 3: Invoice Sheet */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all duration-150 flex-shrink-0 w-[200px]">
              <div className="w-full overflow-hidden bg-[#f8f8f8] border-b border-gray-100" style={{ height: 120 }}>
                <TemplatePreview templateId="ss-001" brand={sampleBrand} size="card" />
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#1a1a1a]">Invoice Sheet</p>
                  <span className="text-xs text-gray-500">$4.99</span>
                </div>
                <Link href="/templates/ss-001">
                  <Button variant="outline" size="sm" className="w-full h-6 text-[10px] border-gray-200">Preview</Button>
                </Link>
              </div>
            </div>
            {/* Browse all card */}
            <Link href="/templates" className="flex-shrink-0">
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl h-full min-h-[188px] w-[160px] flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-100 transition-all duration-150 cursor-pointer p-4">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-[#1a1a1a] text-center">Browse all templates</p>
                <p className="text-[10px] text-gray-400 text-center">10 designs available</p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer / Account ── */}
      <footer className="max-w-5xl w-full mx-auto px-6 pb-10">
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          {/* User identity row */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#1a1a1a] text-white text-xs font-medium">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1a1a1a]">Jane Doe</p>
              <p className="text-xs text-gray-400">jane@example.com</p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Free plan</span>
          </div>

          {/* Action links */}
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <Link href="/dashboard/brand">
              <div className="flex items-center justify-center gap-2 px-4 py-3 text-xs text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
                <Settings className="h-3.5 w-3.5" />
                Brand settings
              </div>
            </Link>
            <div className="flex items-center justify-center gap-2 px-4 py-3 text-xs text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
              <HelpCircle className="h-3.5 w-3.5" />
              Help &amp; support
            </div>
            <Link href="/">
              <div className="flex items-center justify-center gap-2 px-4 py-3 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer">
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </div>
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-300 mt-4">
          Branddoc · Brand-persistent document generator
        </p>
      </footer>
    </div>
  )
}
