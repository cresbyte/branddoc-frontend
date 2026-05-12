"use client";

import React from "react";
import { BarChart3, TrendingUp, Calendar, ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>Reports & Analytics</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Insights into your document activity and brand performance.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 12, border: "0.5px solid #E5E7EB", height: 300 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>Document Generation</h3>
                <div style={{ display: "flex", gap: 8, padding: "4px 10px", background: "#F9FAFB", border: "0.5px solid #E5E7EB", borderRadius: 6, fontSize: 12, color: "#6B7280" }}>
                    <Calendar size={14} /> Last 30 days
                </div>
            </div>
            {/* Chart Placeholder */}
            <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "flex-end", gap: 10, paddingBottom: 40 }}>
                {[40, 65, 45, 90, 55, 80, 60].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i === 3 ? "#1D4ED8" : "#EFF6FF", height: `${h}%`, borderRadius: "4px 4px 0 0" }} />
                ))}
            </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
                { label: "Active Users", value: "842", change: "+14.2%", positive: true },
                { label: "Storage Used", value: "1.2 GB", change: "-2.4%", positive: false },
                { label: "Avg. Completion", value: "4.2m", change: "+0.8m", positive: true },
            ].map((stat, i) => (
                <div key={i} style={{ background: "white", padding: 20, borderRadius: 12, border: "0.5px solid #E5E7EB", flex: 1 }}>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 4px 0" }}>{stat.label}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>{stat.value}</h3>
                        <span style={{ fontSize: 11, fontWeight: 600, color: stat.positive ? "#059669" : "#991B1B", display: "flex", alignItems: "center" }}>
                            {stat.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            {stat.change}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: 12, border: "0.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Top Document Types</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {[
                { label: "Business Invoices", count: 124, percentage: 45 },
                { label: "Client Proposals", count: 86, percentage: 32 },
                { label: "Legal Agreements", count: 42, percentage: 15 },
                { label: "Others", count: 22, percentage: 8 },
            ].map((item, i) => (
                <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                        <span style={{ fontWeight: 500, color: "#4B5563" }}>{item.label}</span>
                        <span style={{ color: "#9CA3AF" }}>{item.count} docs ({item.percentage}%)</span>
                    </div>
                    <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: "#1D4ED8", width: `${item.percentage}%` }} />
                    </div>
                </div>
            ))}
          </div>
      </div>
    </div>
  );
}
