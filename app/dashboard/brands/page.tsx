"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Palette,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  PlusCircle,
  LayoutTemplate,
  CheckCircle2,
  Loader2,
  X,
  Eye,
} from "lucide-react";
import { useDashboard } from "../components/DashboardContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/* ─── Types ──────────────────────────────────────────────────── */
interface BrandProfile {
  id: string;
  company_name: string;
  tagline: string;
  logo: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  created_at: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  description: string;
  schema: any;
  default_content: any;
}

/* ─── Sub-components ────────────────────────────────────────── */
function TemplateCard({ 
  template, 
  onPreview, 
  onUse 
}: { 
  template: DocumentTemplate; 
  onPreview: (t: DocumentTemplate) => void;
  onUse: (t: DocumentTemplate) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 14,
        border: "0.5px solid #E5E7EB",
        overflow: "hidden",
        transition: "all 0.2s ease-out",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 12px 24px rgba(0,0,0,0.06)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", height: 120, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LayoutTemplate size={40} color={hovered ? "#1D4ED8" : "#9CA3AF"} style={{ transition: "color 0.2s" }} />
        {hovered && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(2px)", transition: "all 0.2s"
          }}>
            <button 
              onClick={() => onPreview(template)}
              style={{
                background: "white", color: "#111827", padding: "6px 12px", 
                borderRadius: 8, fontSize: 12, fontWeight: 600, border: "0.5px solid #E5E7EB",
                display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
              }}
            >
              <Eye size={14} /> Preview
            </button>
          </div>
        )}
      </div>
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
          {template.name}
        </h3>
        <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 16, height: 32, overflow: "hidden", textOverflow: "ellipsis" }}>
          {template.description || `Professional ${template.name} template for your business.`}
        </p>
        <button 
          onClick={() => onUse(template)}
          style={{
            width: "100%", height: 34, borderRadius: 8,
            background: hovered ? "#1D4ED8" : "#F3F4F6",
            color: hovered ? "white" : "#4B5563",
            border: "none",
            fontSize: 12.5, fontWeight: 500,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.2s",
            cursor: "pointer"
          }}
        >
          <PlusCircle size={14} /> Use Template
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ template, onClose }: { template: DocumentTemplate; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20
    }}>
      <div style={{
        background: "white", borderRadius: 20, width: "100%", maxWidth: 800,
        height: "85vh", display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "0.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "#EFF6FF", color: "#1D4ED8", padding: 10, borderRadius: 12 }}>
              <LayoutTemplate size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{template.name} Preview</h2>
              <p style={{ fontSize: 12, color: "#6B7280" }}>{template.category.toUpperCase()} · Quick Look</p>
            </div>
          </div>
          <button onClick={onClose} style={{ height: 36, width: 36, borderRadius: 18, border: "none", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B7280" }}>
            <X size={18} />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", padding: 32, background: "#F9FAFB" }}>
          <div style={{ maxWidth: 500, margin: "0 auto", padding: 40, background: "white", borderRadius: 8, boxShadow: "0 4px 6px rgba(0,0,0,0.02)", border: "0.5px solid #E5E7EB" }}>
             {/* Mock rendering of schema structure */}
             <div style={{ borderBottom: "2px solid #E5E7EB", paddingBottom: 20, marginBottom: 20 }}>
                <div style={{ height: 12, width: 100, background: "#F3F4F6", borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 20, width: 200, background: "#E5E7EB", borderRadius: 4 }} />
             </div>
             
             {template.schema?.sections?.map((section: any, idx: number) => (
                <div key={idx} style={{ marginBottom: 20, opacity: section.type.includes('header') || section.type.includes('footer') ? 0.3 : 1 }}>
                   <div style={{ height: 8, width: 60, background: "#F3F4F6", borderRadius: 4, marginBottom: 12 }} />
                   <div style={{ padding: 12, border: "0.5px dashed #E5E7EB", borderRadius: 8 }}>
                      <p style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600 }}>{section.label || section.type.replace('_', ' ')}</p>
                      {section.fields && (
                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                            {section.fields.slice(0, 4).map((f: any, i: number) => (
                               <div key={i} style={{ height: 14, background: "#F9FAFB", borderRadius: 4 }} />
                            ))}
                         </div>
                      )}
                      {section.type === 'table' && (
                         <div style={{ marginTop: 12 }}>
                            <div style={{ height: 20, background: "#F3F4F6", borderRadius: 4, marginBottom: 4 }} />
                            <div style={{ height: 14, background: "#F9FAFB", borderRadius: 4, marginBottom: 4 }} />
                            <div style={{ height: 14, background: "#F9FAFB", borderRadius: 4 }} />
                         </div>
                      )}
                   </div>
                </div>
             ))}
             <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 20 }}>— End of Preview —</p>
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "0.5px solid #E5E7EB", background: "white", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "0.5px solid #E5E7EB", background: "white", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            Close
          </button>
          <button 
            style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#1D4ED8", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            onClick={() => {
              onClose();
              window.location.href = `/dashboard/documents/create/${template.slug}`;
            }}
          >
            Create with Template
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function BrandsPage() {
  const { setHeaderTitle, setCta } = useDashboard();
  const router = useRouter();
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);

  useEffect(() => {
    setHeaderTitle("Brands");
    setCta({
      label: "Create Brand",
      onClick: () => console.log("Create Brand clicked"),
      icon: <Plus size={14} />
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        const [brandsData, templatesData] = await Promise.all([
          api.get("/api/base/brand-profiles/"),
          api.get("/api/base/templates/"),
        ]);
        setBrands(brandsData?.results);
        setTemplates(templatesData?.results);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setHeaderTitle("");
      setCta(null);
    };
  }, [setHeaderTitle, setCta]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 400 }}>
        <Loader2 className="animate-spin" size={32} color="#1D4ED8" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#EF4444" }}>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: 10, padding: "8px 16px", background: "#1D4ED8", color: "white", borderRadius: 8, border: "none", cursor: "pointer" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
        borderRadius: 16, padding: "32px 40px", marginBottom: 32,
        position: "relative", overflow: "hidden", color: "white"
      }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 500 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>
            Design your identity with Brand Templates
          </h2>
          <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.5, marginBottom: 20 }}>
            Choose from professionally crafted brand kits or build your own from scratch.
            All templates include synchronized color systems and optimized typography.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{
              background: "white", color: "#1D4ED8", padding: "10px 20px",
              borderRadius: 10, border: "none", fontSize: 13.5, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              Browse Catalog <ExternalLink size={14} />
            </button>
          </div>
        </div>
        <Palette
          size={200}
          style={{
            position: "absolute", right: -40, top: -40,
            opacity: 0.1, color: "white", transform: "rotate(-15deg)"
          }}
        />
      </div>

      {/* Active Brands Section */}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        My Active Identities
        <span style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 8px", borderRadius: 10 }}>
          {brands.length}
        </span>
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 40 }}>
        {brands.map(brand => (
          <div key={brand.id} style={{
            background: "white", borderRadius: 14, border: "0.5px solid #E5E7EB",
            padding: 20, display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: brand.primary_color,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 16, fontWeight: 700
            }}>
              {brand.company_name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{brand.company_name}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{brand.tagline || "Brand Identity"}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{
                padding: "6px 12px", borderRadius: 8, background: "#ECFDF5",
                color: "#166534", fontSize: 12, fontWeight: 600, border: "none",
                display: "flex", alignItems: "center", gap: 4
              }}>
                <CheckCircle2 size={12} /> Active
              </button>
              <button style={{ height: 32, width: 32, borderRadius: 8, border: "0.5px solid #E5E7EB", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
        ))}
        {brands.length === 0 && (
          <div style={{
            gridColumn: "span 2", padding: 40, textAlign: "center", border: "1px dashed #E5E7EB", borderRadius: 14, color: "#9CA3AF"
          }}>
            <p>No identities found. Create your first brand profile to get started.</p>
          </div>
        )}
        <div style={{
          border: "1px dashed #E5E7EB", borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, color: "#9CA3AF", cursor: "pointer", transition: "all 0.1s",
          padding: 20
        }}>
           <Plus size={18} />
           <span style={{ fontSize: 14, fontWeight: 500 }}>Add Another Identity</span>
        </div>
      </div>

      {/* Catalog Section */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
          <LayoutTemplate size={18} color="#1D4ED8" />
          Template Library
        </h3>
        <button style={{ fontSize: 13, color: "#1D4ED8", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
          View Full Library
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 20
      }}>
        {templates.map(t => (
          <TemplateCard 
            key={t.id} 
            template={t} 
            onPreview={setPreviewTemplate}
            onUse={(tmpl) => router.push(`/dashboard/documents/create/${tmpl.slug}`)}
          />
        ))}
      </div>

      {previewTemplate && (
        <PreviewModal 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
        />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
