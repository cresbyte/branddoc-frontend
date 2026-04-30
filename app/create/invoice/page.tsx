"use client"

import { useState } from "react"
import Link from "next/link"
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
import { Plus, Trash2, ChevronLeft, Download } from "lucide-react"

const sampleBrand = {
  companyName: "Acme Studio",
  email: "hello@acme.com",
  phone: "+1 234 567 8900",
  website: "https://acme.com",
  address: "123 Creative Lane, New York, USA",
  primaryColor: "#1a1a1a",
  secondaryColor: "#4f46e5",
  font: "Poppins",
  initials: "AS",
}

const CURRENCIES: Record<string, { symbol: string; label: string }> = {
  USD: { symbol: "$", label: "USD $" },
  GBP: { symbol: "£", label: "GBP £" },
  EUR: { symbol: "€", label: "EUR €" },
  KES: { symbol: "Ksh", label: "KES Ksh" },
}

type LineItem = { description: string; qty: number; price: number }
type Layout = "bold" | "minimal" | "classic"

export default function CreateInvoicePage() {
  const router = useRouter()

  // Invoice state
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-003")
  const [currency, setCurrency] = useState("USD")
  const [issueDate, setIssueDate] = useState("2026-04-30")
  const [dueDate, setDueDate] = useState("2026-05-30")
  const [clientName, setClientName] = useState("Bright & Co.")
  const [clientEmail, setClientEmail] = useState("accounts@bright.co")
  const [clientAddress, setClientAddress] = useState("14 Commerce Lane\nLondon, UK")
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "Brand identity design", qty: 1, price: 1200 },
    { description: "Website UI mockups", qty: 3, price: 350 },
  ])
  const [notes, setNotes] = useState(
    "Payment due within 30 days. Bank transfer preferred. Thank you for your business!"
  )
  const [layout, setLayout] = useState<Layout>("bold")

  const TAX_RATE = 0.16
  const sym = CURRENCIES[currency].symbol

  const subtotal = lineItems.reduce((acc, item) => acc + item.qty * item.price, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const fmt = (n: number) => `${sym}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const addLineItem = () =>
    setLineItems([...lineItems, { description: "", qty: 1, price: 0 }])

  const updateLineItem = (i: number, field: keyof LineItem, value: string) => {
    const updated = [...lineItems]
    if (field === "qty" || field === "price") {
      updated[i] = { ...updated[i], [field]: parseFloat(value) || 0 }
    } else {
      updated[i] = { ...updated[i], [field]: value }
    }
    setLineItems(updated)
  }

  const removeLineItem = (i: number) =>
    setLineItems(lineItems.filter((_, idx) => idx !== i))

  const docTabs = [
    { label: "Invoice", href: "/create/invoice", active: true },
    { label: "Letterhead", href: "/create/letterhead", active: false },
    { label: "Receipt", href: "/create/receipt", active: false },
    { label: "Email signature", href: "/create/email-signature", active: false },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 sticky top-0 z-30 gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#1a1a1a]">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-lg font-semibold tracking-tight text-[#1a1a1a]">Branddoc</span>
        <span className="text-gray-300 text-lg">/</span>
        <span className="text-sm text-gray-500">Create document</span>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* ─────────── LEFT: FORM (42%) ─────────── */}
        <div className="w-full lg:w-[42%] border-r border-gray-200 flex flex-col bg-white">
          {/* Document type tabs */}
          <div className="flex border-b border-gray-100 px-6 overflow-x-auto">
            {docTabs.map((tab) => (
              <Link key={tab.label} href={tab.href}>
                <div
                  className={`py-4 px-1 mr-6 text-sm whitespace-nowrap border-b-2 transition-colors duration-150 cursor-pointer ${tab.active
                      ? "border-[#1a1a1a] text-[#1a1a1a] font-medium"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab.label}
                </div>
              </Link>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* YOUR BUSINESS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Your business</p>
                <Link href="/dashboard/brand">
                  <span className="text-xs text-[#4f46e5] hover:underline cursor-pointer">Edit</span>
                </Link>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">Company name</Label>
                  <Input value={sampleBrand.companyName} readOnly className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input value={sampleBrand.email} readOnly className="bg-gray-50 text-gray-500 cursor-not-allowed flex-1" />
                    <div
                      className="h-9 w-9 rounded-full flex-shrink-0 border border-gray-200"
                      style={{ backgroundColor: sampleBrand.primaryColor }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* INVOICE DETAILS */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Invoice details</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="inv-number" className="text-xs text-gray-500">Invoice number</Label>
                    <Input id="inv-number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CURRENCIES).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="issue-date" className="text-xs text-gray-500">Issue date</Label>
                    <Input id="issue-date" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="due-date" className="text-xs text-gray-500">Due date</Label>
                    <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* BILL TO */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Bill to</p>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="client-name" className="text-xs text-gray-500">Client name</Label>
                  <Input id="client-name" placeholder="Client or company name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="client-email" className="text-xs text-gray-500">Client email</Label>
                  <Input id="client-email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="client-address" className="text-xs text-gray-500">Client address</Label>
                  <Textarea
                    id="client-address"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="resize-none min-h-[70px]"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* LINE ITEMS */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Line items</p>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 px-1">
                  <span className="col-span-6 text-xs text-gray-400">Description</span>
                  <span className="col-span-2 text-xs text-gray-400 text-center">Qty</span>
                  <span className="col-span-3 text-xs text-gray-400 text-right">Price</span>
                  <span className="col-span-1" />
                </div>
                {lineItems.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <Input
                      className="col-span-6 text-sm"
                      value={item.description}
                      onChange={(e) => updateLineItem(i, "description", e.target.value)}
                      placeholder="Item description"
                    />
                    <Input
                      className="col-span-2 text-sm text-center"
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateLineItem(i, "qty", e.target.value)}
                    />
                    <Input
                      className="col-span-3 text-sm text-right"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateLineItem(i, "price", e.target.value)}
                    />
                    <button
                      onClick={() => removeLineItem(i)}
                      className="col-span-1 flex justify-center text-gray-300 hover:text-red-400 transition-colors duration-150"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addLineItem}
                  className="w-full mt-1 py-2.5 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all duration-150 flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add line item
                </button>
              </div>
            </div>

            <Separator />

            {/* NOTES */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Notes</p>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                className="resize-none min-h-[80px] text-sm"
              />
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
            <span className="text-sm text-gray-500">Download for <span className="font-medium text-[#1a1a1a]">$4.99</span></span>
            <Button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white gap-2">
              <Download className="h-4 w-4" />
              Pay &amp; download
            </Button>
          </div>
        </div>

        {/* ─────────── RIGHT: LIVE PREVIEW (58%) ─────────── */}
        <div className="w-full lg:w-[58%] bg-[#f0eeeb] flex flex-col">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0ddd9]">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Live preview</span>
            <div className="flex items-center gap-1.5">
              {(["bold", "minimal", "classic"] as Layout[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-all duration-150 capitalize ${layout === l
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-white text-gray-500 border-gray-300 hover:border-gray-500"
                    }`}
                >
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* A4 paper */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex justify-center">
            <div className="w-full max-w-[640px] bg-white shadow-xl rounded-sm overflow-hidden text-[11px] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              <InvoicePreview
                layout={layout}
                brand={sampleBrand}
                invoiceNumber={invoiceNumber}
                issueDate={issueDate}
                dueDate={dueDate}
                currency={currency}
                sym={sym}
                clientName={clientName}
                clientEmail={clientEmail}
                clientAddress={clientAddress}
                lineItems={lineItems}
                notes={notes}
                subtotal={subtotal}
                tax={tax}
                total={total}
                fmt={fmt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Invoice Preview Component ───────────────────────────────────────────────

function InvoicePreview({
  layout,
  brand,
  invoiceNumber,
  issueDate,
  dueDate,
  clientName,
  clientEmail,
  clientAddress,
  lineItems,
  notes,
  subtotal,
  tax,
  total,
  fmt,
}: {
  layout: Layout
  brand: typeof sampleBrand
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  sym: string
  clientName: string
  clientEmail: string
  clientAddress: string
  lineItems: LineItem[]
  notes: string
  subtotal: number
  tax: number
  total: number
  fmt: (n: number) => string
}) {
  const LogoBox = ({ circle = true, size = 36 }: { circle?: boolean; size?: number }) => (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: circle ? "rgba(255,255,255,0.2)" : brand.primaryColor,
        borderRadius: circle ? "50%" : 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 600,
        fontSize: size * 0.33,
        flexShrink: 0,
        border: circle ? "none" : "none",
      }}
    >
      {brand.initials}
    </div>
  )

  const LineItemsTable = () => (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
          <th style={{ textAlign: "left", paddingBottom: 8, color: "#9ca3af", fontWeight: 500, fontSize: 10 }}>Description</th>
          <th style={{ textAlign: "center", paddingBottom: 8, color: "#9ca3af", fontWeight: 500, fontSize: 10 }}>Qty</th>
          <th style={{ textAlign: "right", paddingBottom: 8, color: "#9ca3af", fontWeight: 500, fontSize: 10 }}>Unit price</th>
          <th style={{ textAlign: "right", paddingBottom: 8, color: "#9ca3af", fontWeight: 500, fontSize: 10 }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((item, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
            <td style={{ paddingTop: 10, paddingBottom: 10, color: "#1a1a1a" }}>{item.description || "—"}</td>
            <td style={{ paddingTop: 10, paddingBottom: 10, textAlign: "center", color: "#6b7280" }}>{item.qty}</td>
            <td style={{ paddingTop: 10, paddingBottom: 10, textAlign: "right", color: "#6b7280" }}>{fmt(item.price)}</td>
            <td style={{ paddingTop: 10, paddingBottom: 10, textAlign: "right", color: "#1a1a1a", fontWeight: 500 }}>{fmt(item.qty * item.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const Totals = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
      <div style={{ width: 220 }}>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, color: "#6b7280" }}>
          <span>Subtotal</span><span>{fmt(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, color: "#6b7280" }}>
          <span>Tax (16%)</span><span>{fmt(tax)}</span>
        </div>
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 600, color: brand.primaryColor, fontSize: 13 }}>
          <span>Total</span><span>{fmt(total)}</span>
        </div>
      </div>
    </div>
  )

  const Notes = () => notes ? (
    <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
      <p style={{ color: "#9ca3af", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Notes</p>
      <p style={{ color: "#6b7280" }}>{notes}</p>
    </div>
  ) : null

  const Footer = () => (
    <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 9, paddingTop: 12, borderTop: "1px solid #f3f4f6", marginTop: 20 }}>
      {brand.companyName} · {invoiceNumber}
    </div>
  )

  const Body = () => (
    <div style={{ padding: "24px 32px" }}>
      {/* Bill to + dates */}
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 4 }}>Bill to</p>
          <p style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{clientName || "—"}</p>
          <p style={{ color: "#6b7280" }}>{clientEmail}</p>
          <p style={{ color: "#6b7280", whiteSpace: "pre-line" }}>{clientAddress}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 4 }}>Dates</p>
          <p style={{ color: "#6b7280" }}>Issued: <span style={{ color: "#1a1a1a" }}>{issueDate}</span></p>
          <p style={{ color: "#6b7280" }}>Due: <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{dueDate}</span></p>
        </div>
      </div>
      <LineItemsTable />
      <Totals />
      <Notes />
      <Footer />
    </div>
  )

  // ── BOLD LAYOUT ──
  if (layout === "bold") {
    return (
      <>
        <div style={{ backgroundColor: brand.primaryColor, padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LogoBox circle size={40} />
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: 13 }}>{brand.companyName}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 10 }}>{brand.email}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em" }}>Invoice</p>
            <p style={{ color: "white", fontWeight: 600, fontSize: 13 }}>{invoiceNumber}</p>
          </div>
        </div>
        <Body />
        <div style={{ backgroundColor: brand.primaryColor, padding: "10px 32px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>{brand.companyName}</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>{invoiceNumber}</span>
        </div>
      </>
    )
  }

  // ── MINIMAL LAYOUT ──
  if (layout === "minimal") {
    return (
      <>
        <div style={{ padding: "32px 32px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb" }}>
          <p style={{ fontWeight: 600, fontSize: 18, color: "#1a1a1a", letterSpacing: "-0.02em" }}>{brand.companyName}</p>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: brand.primaryColor, fontWeight: 600, fontSize: 14 }}>INVOICE</p>
            <p style={{ color: "#6b7280", fontSize: 11 }}>{invoiceNumber}</p>
          </div>
        </div>
        <Body />
      </>
    )
  }

  // ── CLASSIC LAYOUT ──
  return (
    <>
      <div style={{ backgroundColor: "#f8f7f4", padding: "24px 32px", borderBottom: `3px solid ${brand.primaryColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 4, backgroundColor: brand.primaryColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 600, fontSize: 13,
          }}>
            {brand.initials}
          </div>
          <div>
            <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: 13 }}>{brand.companyName}</p>
            <p style={{ color: "#6b7280", fontSize: 10 }}>{brand.email}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "#9ca3af", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em" }}>Invoice</p>
          <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: 13 }}>{invoiceNumber}</p>
        </div>
      </div>
      <Body />
    </>
  )
}
