"use client";

import React from "react";
import { FileCheck, Search, Plus, Filter, ChevronRight } from "lucide-react";

export default function QuotationsPage() {
  const quotations = [
    { id: "QT-882", client: "Nexus Design", date: "May 12, 2024", expires: "Jun 12, 2024", total: "$1,850.00", status: "Sent" },
    { id: "QT-881", client: "Urban Green", date: "May 11, 2024", expires: "Jun 11, 2024", total: "$4,200.00", status: "Accepted" },
    { id: "QT-880", client: "Driftwood Co", date: "May 09, 2024", expires: "Jun 09, 2024", total: "$950.00", status: "Draft" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>Quotations</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Track your proposals and cost estimates.</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
          background: "#111827", color: "white", border: "none", borderRadius: 8,
          fontSize: 14, fontWeight: 500, cursor: "pointer"
        }}>
          <Plus size={16} /> New Quotation
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Active Quotations", value: "12", sub: "Waiting for response" },
          { label: "Conversion Rate", value: "68%", sub: "+5% from last month" },
          { label: "Draft Proposals", value: "4", sub: "Click to continue" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", padding: 24, borderRadius: 12, border: "0.5px solid #E5E7EB" }}>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 8px 0" }}>{stat.label}</p>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: 0 }}>{stat.value}</h3>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB", overflow: "hidden" }}>
        <div style={{ padding: 20, borderBottom: "0.5px solid #E5E7EB", display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 12 }}>
                <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                    <input placeholder="Search quotations..." style={{ padding: "8px 10px 8px 32px", fontSize: 13, border: "0.5px solid #E5E7EB", borderRadius: 6, outline: "none" }} />
                </div>
            </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
                <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>ID</th>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>Client</th>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>Expires</th>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>Total</th>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>Status</th>
                    <th style={{ padding: "12px 20px", textAlign: "right" }}></th>
                </tr>
            </thead>
            <tbody>
                {quotations.map((q) => (
                    <tr key={q.id} style={{ borderTop: "0.5px solid #F3F4F6" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 500 }}>{q.id}</td>
                        <td style={{ padding: "16px 20px" }}>{q.client}</td>
                        <td style={{ padding: "16px 20px", color: "#6B7280" }}>{q.expires}</td>
                        <td style={{ padding: "16px 20px", fontWeight: 600 }}>{q.total}</td>
                        <td style={{ padding: "16px 20px" }}>
                            <span style={{ 
                                fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                                background: q.status === "Accepted" ? "#ECFDF5" : q.status === "Sent" ? "#EFF6FF" : "#F3F4F6",
                                color: q.status === "Accepted" ? "#065F46" : q.status === "Sent" ? "#1D4ED8" : "#4B5563"
                            }}>
                                {q.status}
                            </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                            <ChevronRight size={16} color="#9CA3AF" style={{ cursor: "pointer" }} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
