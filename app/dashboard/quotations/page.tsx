"use client";

import React, { useEffect } from "react";
import { FileCheck, Plus, Filter, MoreVertical } from "lucide-react";
import { useDashboard } from "../components/DashboardContext";

export default function QuotationsPage() {
  const { setHeaderTitle, setCta, setSearch } = useDashboard();

  useEffect(() => {
    setHeaderTitle("Quotations");
    setCta({
      label: "New Quotation",
      onClick: () => console.log("New quotation"),
      icon: <Plus size={14} />,
    });
    setSearch({ placeholder: "Search quotations...", hidden: false });

    return () => {
      setHeaderTitle("");
      setCta(null);
    };
  }, [setHeaderTitle, setCta, setSearch]);

  const quotations = [
    { id: "QT-882", client: "Nexus Design", date: "May 12, 2024", expires: "Jun 12, 2024", total: "$1,850.00", status: "Sent", type: "Creative" },
    { id: "QT-881", client: "Urban Green", date: "May 11, 2024", expires: "Jun 11, 2024", total: "$4,200.00", status: "Accepted", type: "Fixed Price" },
    { id: "QT-880", client: "Driftwood Co", date: "May 09, 2024", expires: "Jun 09, 2024", total: "$950.00", status: "Draft", type: "Estimate" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Active Quotations", value: "12", sub: "Waiting for response", color: "#2563EB" },
          { label: "Conversion Rate", value: "68%", sub: "+5% from last month", color: "#059669" },
          { label: "Draft Proposals", value: "4", sub: "Click to continue", color: "#6B7280" },
        ].map((stat, i) => (
          <div key={i} style={{ 
            background: "white", padding: "16px 20px", borderRadius: 10, 
            border: "0.5px solid #E5E7EB",
          }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6, fontWeight: 500 }}>{stat.label}</p>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: stat.color, letterSpacing: "-0.02em" }}>{stat.value}</h3>
            <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div style={{ 
        background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB", 
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
      }}>
        <div style={{ 
          padding: "14px 20px", borderBottom: "0.5px solid #F3F4F6", 
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#FAFAFA"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Filter size={13} color="#6B7280" />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>All Quotations</span>
            </div>
            <button style={{ 
                fontSize: 12.5, fontWeight: 500, color: "#2563EB", 
                background: "none", border: "none", cursor: "pointer" 
            }}>
                Download Summary
            </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr style={{ textAlign: "left", borderBottom: "0.5px solid #F3F4F6" }}>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Quotation</th>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Client</th>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Expires</th>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total</th>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Status</th>
                    <th style={{ padding: "12px 20px", textAlign: "right" }}></th>
                </tr>
            </thead>
            <tbody>
                {quotations.map((q, idx) => (
                    <tr key={q.id} 
                        style={{ borderBottom: idx === quotations.length - 1 ? "none" : "0.5px solid #F3F4F6", transition: "background 0.1s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                        <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ 
                                    width: 32, height: 32, borderRadius: 8, background: "#F3F4F6",
                                    display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280"
                                }}>
                                    <FileCheck size={15} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "#111827" }}>{q.id}</div>
                                    <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{q.date}</div>
                                </div>
                            </div>
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: 13.5, color: "#374151" }}>{q.client}</td>
                        <td style={{ padding: "16px 20px", fontSize: 13, color: "#6B7280" }}>{q.expires}</td>
                        <td style={{ padding: "16px 20px", fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{q.total}</td>
                        <td style={{ padding: "16px 20px" }}>
                            <div style={{ 
                                display: "inline-flex", alignItems: "center", gap: 5,
                                fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                                background: q.status === "Accepted" ? "#ECFDF5" : q.status === "Sent" ? "#EFF6FF" : "#F3F4F6",
                                color: q.status === "Accepted" ? "#065F46" : q.status === "Sent" ? "#1D4ED8" : "#4B5563",
                                textTransform: "uppercase", letterSpacing: "0.03em"
                            }}>
                                <div style={{ 
                                    width: 5, height: 5, borderRadius: "50%", 
                                    background: q.status === "Accepted" ? "#10B981" : q.status === "Sent" ? "#3B82F6" : "#9CA3AF" 
                                }} />
                                {q.status}
                            </div>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                            <button style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 4 }}>
                                <MoreVertical size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
