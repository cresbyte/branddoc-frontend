"use client";

import React from "react";
import { User, Plus, Search, Folder, MoreHorizontal } from "lucide-react";

export default function PersonalCollectionPage() {
  const documents = [
    { name: "My_Resume_Final", date: "May 08", type: "PDF" },
    { name: "Personal_Letterhead_Draft", date: "May 04", type: "Doc" },
    { name: "Household_Budget_Tracker", date: "Apr 20", type: "Sheet" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, background: "#F3F4F6", 
            display: "flex", alignItems: "center", justifyContent: "center", color: "#374151",
            border: "0.5px solid #D1D5DB"
          }}>
            <User size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>Personal Docs</h1>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>Private workspace for your individual documents.</p>
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

      <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB" }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Private Files</h3>
            <Search size={14} color="#9CA3AF" style={{ cursor: "pointer" }} />
        </div>
        <div style={{ padding: 10 }}>
            {documents.map((doc, i) => (
                <div key={i} style={{ 
                    padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, 
                    borderRadius: 8, cursor: "pointer"
                }} onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <Folder size={18} color="#D1D5DB" />
                    <span style={{ flex: 1, fontSize: 14, color: "#374151" }}>{doc.name}</span>
                    <span style={{ fontSize: 12, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 6px", borderRadius: 4 }}>{doc.type}</span>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>{doc.date}</span>
                    <MoreHorizontal size={16} color="#D1D5DB" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
