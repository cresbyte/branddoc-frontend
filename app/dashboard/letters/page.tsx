"use client";

import React from "react";
import { Mail, Plus, Search, Star, MoreVertical } from "lucide-react";

export default function LettersPage() {
  const letters = [
    { id: 1, recipient: "Johnathan Smith", subject: "Partnership Inquiry", date: "Today", starred: true },
    { id: 2, recipient: "Sarah Jenkins", subject: "Employment Offer Letter", date: "Yesterday", starred: false },
    { id: 3, recipient: "Michael Brown", subject: "Service Termination Notice", date: "May 08, 2024", starred: false },
    { id: 4, recipient: "Emily Davis", subject: "Project Kickoff Welcome", date: "May 05, 2024", starred: true },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>Business Letters</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Professional correspondence on your branded letterhead.</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
          background: "#1D4ED8", color: "white", border: "none", borderRadius: 8,
          fontSize: 14, fontWeight: 500, cursor: "pointer"
        }}>
          <Plus size={16} /> Compose Letter
        </button>
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB", overflow: "hidden" }}>
        <div style={{ padding: 16, borderBottom: "0.5px solid #F3F4F6", display: "flex", gap: 12 }}>
            <div style={{ position: "relative", flex: 1 }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input placeholder="Search letters..." style={{ width: "100%", padding: "8px 10px 8px 32px", fontSize: 13, border: "0.5px solid #E5E7EB", borderRadius: 6, outline: "none" }} />
            </div>
            <button style={{ padding: "0 14px", background: "white", border: "0.5px solid #E5E7EB", borderRadius: 6, fontSize: 13, cursor: "pointer", color: "#4B5563" }}>Starred</button>
            <button style={{ padding: "0 14px", background: "white", border: "0.5px solid #E5E7EB", borderRadius: 6, fontSize: 13, cursor: "pointer", color: "#4B5563" }}>Drafts</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
            {letters.map((letter) => (
                <div key={letter.id} style={{ 
                    padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
                    borderBottom: "0.5px solid #F3F4F6", cursor: "pointer", 
                    transition: "background 0.1s"
                }} onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <Star size={16} fill={letter.starred ? "#EAB308" : "none"} color={letter.starred ? "#EAB308" : "#D1D5DB"} />
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{letter.recipient}</span>
                            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{letter.date}</span>
                        </div>
                        <span style={{ fontSize: 13, color: "#6B7280" }}>{letter.subject}</span>
                    </div>
                    <MoreVertical size={16} color="#9CA3AF" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
