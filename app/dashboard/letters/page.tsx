"use client";

import React, { useEffect } from "react";
import { Mail, Plus, Star, MoreVertical } from "lucide-react";
import { useDashboard } from "../components/DashboardContext";

export default function LettersPage() {
  const { setHeaderTitle, setCta, setSearch } = useDashboard();

  useEffect(() => {
    setHeaderTitle("Business Letters");
    setCta({
      label: "Compose Letter",
      onClick: () => console.log("Compose letter"),
      icon: <Plus size={14} />,
    });
    setSearch({ placeholder: "Search correspondence...", hidden: false });

    return () => {
      setHeaderTitle("");
      setCta(null);
    };
  }, [setHeaderTitle, setCta, setSearch]);

  const letters = [
    { id: 1, recipient: "Johnathan Smith", subject: "Partnership Inquiry", date: "May 13, 2:14 pm", starred: true, status: "Sent" },
    { id: 2, recipient: "Sarah Jenkins", subject: "Employment Offer Letter", date: "May 12", starred: false, status: "Draft" },
    { id: 3, recipient: "Michael Brown", subject: "Service Termination Notice", date: "May 10", starred: false, status: "Sent" },
    { id: 4, recipient: "Emily Davis", subject: "Project Kickoff Welcome", date: "May 08", starred: true, status: "Sent" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats row can be added here if needed, but letters usually follow a clean list pattern */}
      
      <div style={{ 
        background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB", 
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
      }}>
        <div style={{ 
          padding: "14px 20px", borderBottom: "0.5px solid #F3F4F6", 
          display: "flex", gap: 12, background: "#FAFAFA" 
        }}>
            <button style={{ padding: "4px 12px", background: "#EFF6FF", border: "0.5px solid #BFDBFE", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#1D4ED8" }}>All Correspondence</button>
            <button style={{ padding: "4px 12px", background: "white", border: "0.5px solid #E5E7EB", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", color: "#6B7280" }}>Starred</button>
            <button style={{ padding: "4px 12px", background: "white", border: "0.5px solid #E5E7EB", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", color: "#6B7280" }}>Archives</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
            {letters.map((letter, idx) => (
                <div key={letter.id} 
                    style={{ 
                        padding: "14px 20px", display: "flex", alignItems: "center", gap: 16,
                        borderBottom: idx === letters.length - 1 ? "none" : "0.5px solid #F3F4F6", 
                        cursor: "pointer", transition: "background 0.1s"
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"} 
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
                        <Star 
                            size={14} 
                            fill={letter.starred ? "#EAB308" : "none"} 
                            color={letter.starred ? "#EAB308" : "#9CA3AF"} 
                            style={{ flexShrink: 0 }}
                        />
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{letter.recipient}</div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 13.5, color: "#374151", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", display: "block" }}>
                            {letter.subject}
                        </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ fontSize: 11.5, color: "#9CA3AF", textAlign: "right" }}>{letter.date}</div>
                        <div style={{ 
                            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                            background: letter.status === "Sent" ? "#ECFDF5" : "#F3F4F6",
                            color: letter.status === "Sent" ? "#065F46" : "#6B7280",
                            textTransform: "uppercase", letterSpacing: "0.04em", minWidth: 50, textAlign: "center"
                        }}>
                            {letter.status}
                        </div>
                        <button style={{ background: "none", border: "none", color: "#D1D5DB", cursor: "pointer", padding: 2 }}>
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Draft Notification if any */}
      <div style={{ 
          padding: "16px", background: "#EFF6FF", border: "0.5px solid #BFDBFE", 
          borderRadius: 10, display: "flex", alignItems: "center", gap: 12
      }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#1D4ED8" }}>
            <Mail size={16} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1E40AF" }}>You have 2 drafts waiting</div>
            <div style={{ fontSize: 12, color: "#1D4ED8", opacity: 0.8 }}>Continue writing where you left off.</div>
          </div>
          <button style={{ 
              marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#1D4ED8", 
              background: "white", border: "0.5px solid #BFDBFE", padding: "6px 12px", 
              borderRadius: 6, cursor: "pointer" 
          }}>
              View Drafts
          </button>
      </div>
    </div>
  );
}
