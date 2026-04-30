"use client"

/**
 * TemplatePreview — renders each letterhead/spreadsheet design as an
 * inline SVG-like HTML mockup inside a fixed bounding box.
 * No external images are used.
 */

type Brand = {
  companyName: string
  tagline: string
  email: string
  phone: string
  website: string
  primaryColor: string
  secondaryColor: string
  initials: string
}

type TemplatePreviewProps = {
  templateId: string
  brand: Brand
  /** "card" = ~280×180 compact preview; "full" = A4-proportioned full preview */
  size?: "card" | "full"
}

// ─── Shared sub-elements ─────────────────────────────────────────────────────

function BodyLines({ count = 5, color = "#f0f0f0" }: { count?: number; color?: string }) {
  return (
    <div className="flex flex-col gap-[8px] flex-1 px-[8%] justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ height: 1, backgroundColor: color, borderRadius: 1 }} />
      ))}
    </div>
  )
}

function InitialsCircle({
  initials,
  size,
  bg,
  textColor = "white",
  fontSize,
}: {
  initials: string
  size: number
  bg: string
  textColor?: string
  fontSize: number
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: textColor,
        fontWeight: 700,
        fontSize,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

// ─── Individual design previews (card size ~280×180) ─────────────────────────

/** lh-001 Executive — dark full-width header bar */
function ExecutivePreview({ brand, full }: { brand: Brand; full: boolean }) {
  const hh = full ? 72 : 36
  const fs = full ? 13 : 7
  const fs2 = full ? 10 : 5
  const circleSize = full ? 40 : 20
  const footerH = full ? 36 : 16

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "white", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ backgroundColor: brand.primaryColor, height: hh, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${full ? 24 : 10}px`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: full ? 10 : 5 }}>
          <InitialsCircle initials={brand.initials} size={circleSize} bg="rgba(255,255,255,0.2)" textColor="white" fontSize={full ? 14 : 7} />
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: fs, lineHeight: 1.2 }}>{brand.companyName}</div>
            {full && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: fs2 }}>{brand.tagline}</div>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          {[brand.email, brand.phone, brand.website].map((t, i) => (
            <div key={i} style={{ width: full ? "auto" : 28, height: full ? "auto" : 1.5, backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 1, color: "rgba(255,255,255,0.7)", fontSize: fs2 }}>
              {full ? t : ""}
            </div>
          ))}
        </div>
      </div>
      {/* Accent rule */}
      <div style={{ height: 2, backgroundColor: brand.secondaryColor, flexShrink: 0 }} />
      {/* Body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {full
          ? <div style={{ textAlign: "center", color: "#e5e7eb", fontSize: 13, padding: "0 40px" }}>Your content goes here</div>
          : <BodyLines count={4} />}
      </div>
      {/* Footer */}
      <div style={{ height: footerH, backgroundColor: brand.primaryColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${full ? 24 : 10}px` }}>
        {full && <>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{brand.website}</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{brand.companyName}</span>
        </>}
      </div>
    </div>
  )
}

/** lh-002 Minimal Line — white header, large company name, colored rule */
function MinimalLinePreview({ brand, full }: { brand: Brand; full: boolean }) {
  const fs = full ? 22 : 12
  const fs2 = full ? 10 : 5
  const pad = full ? 24 : 10
  const headerH = full ? 64 : 32

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "white", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ height: headerH, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px`, flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: fs, color: brand.primaryColor, letterSpacing: "-0.02em" }}>{brand.companyName}</div>
        {full && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: fs2, color: "#9ca3af" }}>{brand.email}</div>
            <div style={{ fontSize: fs2, color: "#9ca3af" }}>{brand.phone}</div>
          </div>
        )}
      </div>
      {/* Colored rule */}
      <div style={{ height: full ? 2.5 : 1.5, backgroundColor: brand.secondaryColor, flexShrink: 0 }} />
      {/* Body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: `0 ${pad}px` }}>
        {full
          ? <div style={{ color: "#e5e7eb", fontSize: 13, textAlign: "center" }}>Your content goes here</div>
          : <BodyLines count={4} />}
      </div>
      {/* Footer */}
      <div style={{ height: full ? 36 : 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px`, borderTop: "1px solid #f3f4f6", flexShrink: 0 }}>
        <div style={{ width: full ? "auto" : 24, height: full ? "auto" : 1, backgroundColor: "#e5e7eb", color: "#9ca3af", fontSize: fs2 }}>
          {full ? brand.website : ""}
        </div>
        <div style={{ width: full ? "auto" : 20, height: full ? "auto" : 1, backgroundColor: "#e5e7eb", color: "#9ca3af", fontSize: fs2 }}>
          {full ? brand.companyName : ""}
        </div>
      </div>
    </div>
  )
}

/** lh-003 Centered Classic — centered logo + name + rule */
function CenteredClassicPreview({ brand, full }: { brand: Brand; full: boolean }) {
  const fs = full ? 16 : 8
  const fs2 = full ? 10 : 5
  const circleSize = full ? 44 : 20
  const headerH = full ? 100 : 48
  const pad = full ? 24 : 10

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "white", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ height: headerH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: full ? 6 : 3, padding: `${full ? 16 : 6}px ${pad}px 0`, flexShrink: 0 }}>
        <InitialsCircle initials={brand.initials} size={circleSize} bg={brand.primaryColor} textColor="white" fontSize={full ? 16 : 8} />
        <div style={{ fontWeight: 700, fontSize: fs, color: brand.primaryColor, letterSpacing: "-0.01em" }}>{brand.companyName}</div>
        {full && <div style={{ fontSize: fs2, color: "#9ca3af" }}>{brand.tagline}</div>}
        <div style={{ width: full ? 60 : 30, height: full ? 2 : 1, backgroundColor: brand.secondaryColor, marginTop: full ? 4 : 2 }} />
        {full && <div style={{ fontSize: 9, color: "#9ca3af" }}>{brand.email} · {brand.phone}</div>}
      </div>
      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: `0 ${pad}px` }}>
        {full
          ? <div style={{ color: "#e5e7eb", fontSize: 13, textAlign: "center", width: "100%" }}>Your content goes here</div>
          : <BodyLines count={4} />}
      </div>
      {/* Footer */}
      <div style={{ height: full ? 28 : 12, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #f3f4f6", flexShrink: 0 }}>
        {full && <span style={{ fontSize: 9, color: "#9ca3af" }}>{brand.website} · {brand.companyName}</span>}
        {!full && <div style={{ width: 40, height: 1, backgroundColor: "#e5e7eb" }} />}
      </div>
    </div>
  )
}

/** lh-004 Split Modern — left accent border */
function SplitModernPreview({ brand, full }: { brand: Brand; full: boolean }) {
  const accentW = full ? 5 : 3
  const fs = full ? 15 : 8
  const fs2 = full ? 10 : 5
  const headerH = full ? 64 : 32
  const pad = full ? 20 : 8
  const footerH = full ? 32 : 14

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "white", overflow: "hidden" }}>
      {/* Left accent */}
      <div style={{ width: accentW, backgroundColor: brand.secondaryColor, flexShrink: 0 }} />
      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ height: headerH, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px`, flexShrink: 0, borderBottom: `1px solid #f0f0f0` }}>
          <div style={{ fontWeight: 700, fontSize: fs, color: brand.primaryColor }}>{brand.companyName}</div>
          {full
            ? <div style={{ textAlign: "right" }}><div style={{ fontSize: fs2, color: "#9ca3af" }}>{brand.email}</div><div style={{ fontSize: fs2, color: "#9ca3af" }}>{brand.phone}</div></div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{[20, 16].map((w, i) => <div key={i} style={{ width: w, height: 1.5, backgroundColor: "#d1d5db" }} />)}</div>
          }
        </div>
        {/* Body */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: `0 ${pad}px` }}>
          {full
            ? <div style={{ color: "#e5e7eb", fontSize: 13 }}>Your content goes here</div>
            : <div style={{ flex: 1 }}><BodyLines count={4} /></div>}
        </div>
        {/* Footer */}
        <div style={{ height: footerH, backgroundColor: brand.primaryColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px` }}>
          {full && <>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{brand.website}</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{brand.companyName}</span>
          </>}
        </div>
      </div>
    </div>
  )
}

/** lh-005 Compact Top — single-line header */
function CompactTopPreview({ brand, full }: { brand: Brand; full: boolean }) {
  const circleSize = full ? 28 : 14
  const fs = full ? 13 : 7
  const fs2 = full ? 10 : 5
  const headerH = full ? 48 : 22
  const pad = full ? 24 : 10

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "white", overflow: "hidden" }}>
      {/* Single-line header */}
      <div style={{ height: headerH, display: "flex", alignItems: "center", gap: full ? 10 : 5, padding: `0 ${pad}px`, flexShrink: 0 }}>
        <InitialsCircle initials={brand.initials} size={circleSize} bg={brand.primaryColor} textColor="white" fontSize={full ? 10 : 5} />
        <div style={{ fontWeight: 700, fontSize: fs, color: brand.primaryColor }}>{brand.companyName}</div>
        <div style={{ width: 1, height: full ? 18 : 10, backgroundColor: "#d1d5db", flexShrink: 0 }} />
        <div style={{ fontSize: fs2, color: "#9ca3af", display: "flex", gap: full ? 10 : 4 }}>
          {full
            ? <>{brand.email} · {brand.phone} · {brand.website}</>
            : [24, 18, 20].map((w, i) => <div key={i} style={{ width: w, height: 1.5, backgroundColor: "#e5e7eb", borderRadius: 1 }} />)}
        </div>
      </div>
      {/* Thin rule */}
      <div style={{ height: full ? 1.5 : 1, backgroundColor: brand.secondaryColor, flexShrink: 0 }} />
      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: `0 ${pad}px` }}>
        {full
          ? <div style={{ color: "#e5e7eb", fontSize: 13 }}>Your content goes here</div>
          : <BodyLines count={5} />}
      </div>
      {/* Footer */}
      <div style={{ height: full ? 28 : 12, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px`, borderTop: "1px solid #f3f4f6", flexShrink: 0 }}>
        {full
          ? <><span style={{ fontSize: 9, color: "#9ca3af" }}>{brand.website}</span><span style={{ fontSize: 9, color: "#9ca3af" }}>{brand.companyName}</span></>
          : <><div style={{ width: 20, height: 1, backgroundColor: "#e5e7eb" }} /><div style={{ width: 16, height: 1, backgroundColor: "#e5e7eb" }} /></>}
      </div>
    </div>
  )
}

/** lh-006 Editorial — watermark giant text */
function EditorialPreview({ brand, full }: { brand: Brand; full: boolean }) {
  const fs = full ? 14 : 7
  const fs2 = full ? 10 : 5
  const watermarkFs = full ? 72 : 36
  const headerH = full ? 72 : 36
  const pad = full ? 24 : 10

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "white", overflow: "hidden", position: "relative" }}>
      {/* Watermark */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: full ? 100 : 48, display: "flex", alignItems: "center", justifyContent: "flex-start", padding: `0 ${full ? 12 : 6}px`, overflow: "hidden", pointerEvents: "none" }}>
        <span style={{ fontSize: watermarkFs, fontWeight: 900, color: "#f0f0f0", letterSpacing: "0.01em", userSelect: "none", lineHeight: 1, whiteSpace: "nowrap" }}>
          {brand.companyName.split(" ")[0].toUpperCase()}
        </span>
      </div>
      {/* Header on top of watermark */}
      <div style={{ height: headerH, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px`, flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: fs, color: brand.primaryColor }}>{brand.companyName}</div>
        {full
          ? <div style={{ textAlign: "right" }}><div style={{ fontSize: fs2, color: "#9ca3af" }}>{brand.email}</div><div style={{ fontSize: fs2, color: "#9ca3af" }}>{brand.phone}</div></div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{[20, 14].map((w, i) => <div key={i} style={{ width: w, height: 1.5, backgroundColor: "#d1d5db" }} />)}</div>}
      </div>
      {/* Rule */}
      <div style={{ height: full ? 2.5 : 1.5, backgroundColor: brand.secondaryColor, flexShrink: 0 }} />
      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: `0 ${pad}px` }}>
        {full
          ? <div style={{ color: "#e5e7eb", fontSize: 13 }}>Your content goes here</div>
          : <BodyLines count={4} />}
      </div>
      {/* Footer */}
      <div style={{ height: full ? 28 : 12, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px`, flexShrink: 0 }}>
        <div style={{ flex: 1, height: full ? 1.5 : 1, backgroundColor: brand.secondaryColor, marginRight: full ? 12 : 6 }} />
        {full && <span style={{ fontSize: 9, color: "#9ca3af", whiteSpace: "nowrap" }}>{brand.companyName}</span>}
      </div>
    </div>
  )
}

// ─── Spreadsheet previews ─────────────────────────────────────────────────────

function SpreadsheetPreview({
  brand,
  style,
  full,
}: {
  brand: Brand
  style: string
  full: boolean
}) {
  const headerH = full ? 52 : 24
  const rowH = full ? 24 : 11
  const pad = full ? 16 : 6
  const fs = full ? 11 : 5.5
  const cols = style === "expense" ? [80, 60, 50, 50] : [90, 30, 50, 50]
  const rows = full ? 6 : 4

  const titles: Record<string, string> = {
    invoice: "Invoice",
    receipt: "Receipt",
    quote: "Quotation",
    expense: "Expenses",
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "white", overflow: "hidden" }}>
      {/* Branded header */}
      <div style={{ height: headerH, backgroundColor: brand.primaryColor, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: full ? 8 : 4 }}>
          <div style={{ width: full ? 28 : 12, height: full ? 28 : 12, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: full ? 10 : 5, color: "white", fontWeight: 700 }}>
            {brand.initials}
          </div>
          <div style={{ color: "white", fontWeight: 700, fontSize: full ? 12 : 6 }}>{brand.companyName}</div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: full ? 11 : 5.5, fontWeight: 500 }}>{titles[style]}</div>
      </div>
      {/* Column headers */}
      <div style={{ display: "flex", backgroundColor: "#f9fafb", borderBottom: `2px solid ${brand.secondaryColor}`, flexShrink: 0 }}>
        {cols.map((w, i) => (
          <div key={i} style={{ flex: i === 0 ? 2 : 1, padding: `${full ? 5 : 2}px ${full ? 8 : 3}px`, fontSize: fs, fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>
            {full ? (i === 0 ? "Description" : i === 1 ? "Qty" : i === 2 ? "Price" : "Total") : ""}
          </div>
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", borderBottom: "1px solid #f3f4f6", height: rowH, backgroundColor: i % 2 === 0 ? "white" : "#fafafa", flexShrink: 0 }}>
          {cols.map((_, j) => (
            <div key={j} style={{ flex: j === 0 ? 2 : 1, borderRight: "1px solid #f0f0f0", height: "100%" }} />
          ))}
        </div>
      ))}
      {/* Total row */}
      <div style={{ display: "flex", borderTop: `2px solid ${brand.primaryColor}`, height: rowH, backgroundColor: "#f9fafb", flexShrink: 0 }}>
        <div style={{ flex: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: `0 ${full ? 8 : 3}px`, fontSize: fs, fontWeight: 700, color: brand.primaryColor }}>
          {full ? "Total" : ""}
        </div>
      </div>
    </div>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export function TemplatePreview({ templateId, brand, size = "card" }: TemplatePreviewProps) {
  const full = size === "full"

  if (templateId === "lh-001") return <ExecutivePreview brand={brand} full={full} />
  if (templateId === "lh-002") return <MinimalLinePreview brand={brand} full={full} />
  if (templateId === "lh-003") return <CenteredClassicPreview brand={brand} full={full} />
  if (templateId === "lh-004") return <SplitModernPreview brand={brand} full={full} />
  if (templateId === "lh-005") return <CompactTopPreview brand={brand} full={full} />
  if (templateId === "lh-006") return <EditorialPreview brand={brand} full={full} />
  if (templateId.startsWith("ss-")) {
    const styleMap: Record<string, string> = {
      "ss-001": "invoice",
      "ss-002": "receipt",
      "ss-003": "quote",
      "ss-004": "expense",
    }
    return <SpreadsheetPreview brand={brand} style={styleMap[templateId] ?? "invoice"} full={full} />
  }
  return null
}
