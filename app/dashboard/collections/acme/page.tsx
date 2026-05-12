"use client";

import React from "react";
import { Building2, Plus, Search, Folder, MoreHorizontal } from "lucide-react";

export default function AcmeCollectionPage() {
  const documents = [
    { name: "Acme_Invoice_May_2024", date: "May 10", status: "Paid" },
    { name: "Acme_Consultancy_Agreement", date: "Apr 28", status: "Finalized" },
    { name: "Brand_Guidelines_v2", date: "Apr 15", status: "Finalized" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, background: "#EFF6FF", 
            display: "flex", alignItems: "center", justifyContent: "center", color: "#1D4ED8",
            border: "0.5px solid #BFDBFE"
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>Acme Corp</h1>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>Shared documents and brand assets for Acme Corp.</p>
          </div>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
          background: "#111827", color: "white", border: "none", borderRadius: 8,
          fontSize: 14, fontWeight: 500, cursor: "pointer"
        }}>
          <Plus size={16} /> Add Document
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Assets", value: "14", sub: "Documents & Files" },
          { label: "Last Modified", value: "May 10, 2024", sub: "by Devrizal M." },
          { label: "Storage", value: "420 MB", sub: "of 1 GB pooled" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", padding: 20, borderRadius: 12, border: "0.5px solid #E5E7EB" }}>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 6px 0" }}>{stat.label}</p>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>{stat.value}</h3>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB" }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Folder Contents</h3>
            <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input placeholder="Search this folder..." style={{ padding: "6px 10px 6px 30px", fontSize: 13, border: "0.5px solid #E5E7EB", borderRadius: 6, outline: "none" }} />
            </div>
        </div>
        <div style={{ padding: 10 }}>
            {documents.map((doc, i) => (
                <div key={i} style={{ 
                    padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, 
                    borderRadius: 8, cursor: "pointer"
                }} onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <Folder size={18} color="#9CA3AF" />
                    <span style={{ flex: 1, fontSize: 14, color: "#374151" }}>{doc.name}</span>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>{doc.date}</span>
                    <MoreHorizontal size={16} color="#D1D5DB" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
