"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Palette,
  CheckCircle2,
  ArrowLeft,
  Settings2,
  Trash2,
  Copy,
  Star,
  Pencil,
} from "lucide-react";
import { useDashboard } from "../components/DashboardContext";

/* ─── Types ──────────────────────────────────────────────────── */
interface Brand {
  id: string;
  name: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoText: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  active: boolean;
  docsCount: number;
  createdAt: string;
}

type ViewMode = "list" | "detail" | "edit";

/* ─── Data & Constants ───────────────────────────────────────── */
const INITIAL_BRANDS: Brand[] = [
  {
    id: "acme",
    name: "Acme Corp",
    tagline: "Building tomorrow's solutions",
    primaryColor: "#0C4A6E",
    secondaryColor: "#0369A1",
    accentColor: "#38BDF8",
    fontHeading: "Playfair Display",
    fontBody: "DM Sans",
    logoText: "AC",
    website: "acmecorp.com",
    email: "hello@acmecorp.com",
    phone: "+254 700 000 000",
    address: "Westlands, Nairobi, Kenya",
    active: true,
    docsCount: 18,
    createdAt: "Jan 2024",
  },
  {
    id: "personal",
    name: "Personal",
    tagline: "My personal brand identity",
    primaryColor: "#3B0764",
    secondaryColor: "#6B21A8",
    accentColor: "#C084FC",
    fontHeading: "Syne",
    fontBody: "Outfit",
    logoText: "DM",
    website: "",
    email: "devrizal@gmail.com",
    phone: "",
    address: "",
    active: false,
    docsCount: 6,
    createdAt: "Feb 2024",
  },
];

/* ─── Sub-components ────────────────────────────────────────── */

function BrandPreviewCard({ brand, onClick }: { brand: Brand; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 12,
        padding: "20px",
        border: hovered ? `0.5px solid ${brand.primaryColor}` : "0.5px solid #E5E7EB",
        cursor: "pointer",
        transition: "all 0.15s",
        position: "relative",
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: brand.primaryColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: brand.accentColor, fontSize: 13, fontWeight: 800,
        }}>
          {brand.logoText}
        </div>
        {brand.active && (
          <div style={{
            background: "#ECFDF5", color: "#065F46",
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
            display: "flex", alignItems: "center", gap: 3, textTransform: "uppercase", letterSpacing: "0.04em"
          }}>
            <CheckCircle2 size={10} /> Active
          </div>
        )}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 3 }}>{brand.name}</h3>
      <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{brand.tagline || "Brand identity kit"}</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: brand.primaryColor, border: "0.5px solid #fff", boxShadow: "0 0 0 1px #E5E7EB" }} />
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: brand.secondaryColor, border: "0.5px solid #fff", boxShadow: "0 0 0 1px #E5E7EB" }} />
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: brand.accentColor, border: "0.5px solid #fff", boxShadow: "0 0 0 1px #E5E7EB" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 14, borderTop: "0.5px solid #F3F4F6", fontSize: 11.5, color: "#9CA3AF" }}>
        <span>{brand.docsCount} Docs</span>
        <span>•</span>
        <span>{brand.createdAt}</span>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function BrandPage() {
  const { setHeaderTitle, setCta, setSearch } = useDashboard();
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [view, setView] = useState<ViewMode>("list");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    if (view === "list") {
      setHeaderTitle("Brand Assets");
      setCta({
        label: "New Brand",
        onClick: () => setView("edit"),
        icon: <Plus size={14} />
      });
      setSearch({ placeholder: "Search brands...", hidden: false });
    } else if (view === "detail" && selectedBrand) {
      setHeaderTitle(selectedBrand.name);
      setCta(null);
      setSearch({ hidden: true });
    } else {
      setHeaderTitle(selectedBrand ? "Edit Brand" : "New Brand");
      setCta(null);
      setSearch({ hidden: true });
    }

    return () => {
      setHeaderTitle("");
      setCta(null);
      setSearch({ hidden: false });
    };
  }, [view, selectedBrand, setHeaderTitle, setCta, setSearch]);

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setView("detail");
  };

  const toggleActive = (id: string) => {
    setBrands(brands.map(b => ({ ...b, active: b.id === id })));
    if (selectedBrand?.id === id) {
      setSelectedBrand(prev => prev ? { ...prev, active: true } : null);
    } else if (selectedBrand) {
      setSelectedBrand(prev => prev ? { ...prev, active: false } : null);
    }
  };

  /* ─── View: Brand List ─── */
  if (view === "list") {
    return (
      <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16
        }}>
          {brands.map(brand => (
            <BrandPreviewCard
              key={brand.id}
              brand={brand}
              onClick={() => handleSelectBrand(brand)}
            />
          ))}

          <div
            onClick={() => setView("edit")}
            style={{
              minHeight: 180, border: "0.5px dashed #E5E7EB", borderRadius: 12,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 10, color: "#9CA3AF", cursor: "pointer", transition: "all 0.1s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Plus size={20} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Add new identity</span>
          </div>
      </div>
    );
  }

  /* ─── View: Brand Detail ─── */
  if (view === "detail" && selectedBrand) {
    return (
      <>
        {/* Sub-header inside page */}
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setView("list")}
            style={{
              width: 32, height: 32, borderRadius: 8, border: "0.5px solid #E5E7EB",
              background: "white", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#6B7280"
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <p style={{ fontSize: 13.5, color: "#6B7280" }}>{selectedBrand.tagline}</p>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB",
              padding: 24, marginBottom: 24
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Visual Identity</h3>
                <button
                  onClick={() => setView("edit")}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, fontSize: 12.5,
                    color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 500
                  }}
                >
                  <Pencil size={13} /> Edit Kit
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Logo Mark</div>
                    <div style={{
                      width: 64, height: 64, borderRadius: 10, background: selectedBrand.primaryColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: selectedBrand.accentColor, fontSize: 20, fontWeight: 800
                    }}>
                      {selectedBrand.logoText}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Colors</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { color: selectedBrand.primaryColor, label: "Pri" },
                        { color: selectedBrand.secondaryColor, label: "Sec" },
                        { color: selectedBrand.accentColor, label: "Acc" }
                      ].map(c => (
                        <div key={c.label} style={{ flex: 1 }}>
                          <div style={{ height: 36, borderRadius: 6, background: c.color, marginBottom: 4, border: "0.5px solid #F3F4F6" }} />
                          <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "monospace" }}>{c.color}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10, fontWeight: 600, textTransform: "uppercase" }}>Typography</div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>{selectedBrand.fontHeading}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", fontFamily: `'${selectedBrand.fontHeading}', serif` }}>
                      Ag
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>{selectedBrand.fontBody}</div>
                    <div style={{ fontSize: 13, color: "#4B5563", fontFamily: `'${selectedBrand.fontBody}', sans-serif`, lineHeight: 1.5 }}>
                      The visual identity system.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Applications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
               <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB", padding: 16 }}>
                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                   <span style={{ fontSize: 11, fontWeight: 700, color: selectedBrand.primaryColor }}>INVOICE</span>
                   <div style={{ width: 18, height: 18, borderRadius: 4, background: selectedBrand.primaryColor }} />
                 </div>
                 <div style={{ height: 3, background: "#F3F4F6", borderRadius: 1, width: "40%", marginBottom: 6 }} />
               </div>

               <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB", padding: 16 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 3, background: selectedBrand.primaryColor }} />
                    <div style={{ height: 3, background: "#F3F4F6", borderRadius: 1, width: "30%" }} />
                  </div>
                  <div style={{ height: 2, background: "#F9FAFB", borderRadius: 1, width: "100%" }} />
               </div>
            </div>
          </div>

          <div style={{ width: 280 }}>
            <div style={{
              background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB",
              padding: "20px", position: "sticky", top: 100
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Status</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => toggleActive(selectedBrand.id)}
                  disabled={selectedBrand.active}
                  style={{
                    height: 36, borderRadius: 8, border: selectedBrand.active ? "none" : "0.5px solid #E5E7EB",
                    background: selectedBrand.active ? "#ECFDF5" : "white",
                    color: selectedBrand.active ? "#065F46" : "#374151",
                    fontSize: 12.5, fontWeight: 600, cursor: selectedBrand.active ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}
                >
                  {selectedBrand.active ? <><CheckCircle2 size={14} /> Active</> : <><Star size={14} /> Set Active</>}
                </button>
                <button style={{ height: 36, marginTop: 8, borderRadius: 8, border: "none", background: "#FEF2F2", color: "#EF4444", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ─── View: Edit Placeholder ─── */
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setView(selectedBrand ? "detail" : "list")}
            style={{
              width: 32, height: 32, borderRadius: 8, border: "0.5px solid #E5E7EB",
              background: "white", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#6B7280"
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <p style={{ fontSize: 13.5, color: "#6B7280" }}>Configure your brand assets</p>
        </div>
      <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB", padding: 32, textAlign: "center" }}>
          <Settings2 size={40} style={{ color: "#9CA3AF", marginBottom: 16, opacity: 0.5 }} />
          <p style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 24 }}>Brand configuration engine</p>
          <button onClick={() => setView("list")} style={{ height: 36, padding: "0 20px", background: "#111827", color: "white", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            Save and return
          </button>
      </div>
    </div>
  );
}
