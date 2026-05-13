"use client";

import React, { useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, ArrowDownRight, ArrowUpRight, Share2, Download } from "lucide-react";
import { useDashboard } from "../components/DashboardContext";

export default function ReportsPage() {
  const { setHeaderTitle, setCta, setSearch } = useDashboard();

  useEffect(() => {
    setHeaderTitle("Reports & Analytics");
    setCta({
      label: "Download Report",
      onClick: () => console.log("Download report"),
      icon: <Download size={14} />,
    });
    setSearch({ hidden: true });

    return () => {
      setHeaderTitle("");
      setCta(null);
    };
  }, [setHeaderTitle, setCta, setSearch]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Overview Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 16 }}>
        {/* Main Chart */}
        <div style={{ background: "white", padding: 24, borderRadius: 12, border: "0.5px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Document Generation</h3>
                  <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Monthly volume of documents created</p>
                </div>
                <div style={{ display: "flex", gap: 8, padding: "5px 12px", background: "#F9FAFB", border: "0.5px solid #E5E7EB", borderRadius: 8, fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
                    <Calendar size={14} /> Last 30 days
                </div>
            </div>
            {/* Chart Placeholder */}
            <div style={{ height: 220, width: "100%", display: "flex", alignItems: "flex-end", gap: 12, paddingBottom: 10 }}>
                {[40, 65, 45, 90, 55, 80, 60, 45, 75, 40, 85, 50].map((h, i) => (
                    <div key={i} style={{ 
                        flex: 1, 
                        background: i === 10 ? "#1D4ED8" : "#EFF6FF", 
                        height: `${h}%`, 
                        borderRadius: "4px 4px 1px 1px",
                        transition: "all 0.2s"
                    }} />
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, borderTop: "0.5px solid #F3F4F6", paddingTop: 12 }}>
                {["Jan", "Feb", "Mar", "Apr", "May"].map(m => (
                    <span key={m} style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{m}</span>
                ))}
            </div>
        </div>

        {/* Small Stats Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
                { label: "Active Users", value: "842", change: "+14.2%", positive: true },
                { label: "Storage Used", value: "1.2 GB", change: "-2.4%", positive: false },
                { label: "Avg. Completion", value: "4.2m", change: "+0.8m", positive: true },
            ].map((stat, i) => (
                <div key={i} style={{ background: "white", padding: "18px 20px", borderRadius: 12, border: "0.5px solid #E5E7EB", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6, fontWeight: 500 }}>{stat.label}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <h3 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>{stat.value}</h3>
                        <span style={{ 
                            fontSize: 10.5, fontWeight: 700, 
                            color: stat.positive ? "#059669" : "#991B1B", 
                            display: "flex", alignItems: "center", gap: 2,
                            background: stat.positive ? "#ECFDF5" : "#FEF2F2",
                            padding: "2px 6px", borderRadius: 4
                        }}>
                            {stat.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            {stat.change}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Breakdown Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: 12, border: "0.5px solid #E5E7EB" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Top Document Types</h3>
              <div style={{ display: "grid", gap: 18 }}>
                {[
                    { label: "Business Invoices", count: 124, percentage: 45, color: "#1D4ED8" },
                    { label: "Client Proposals", count: 86, percentage: 32, color: "#2563EB" },
                    { label: "Legal Agreements", count: 42, percentage: 15, color: "#3B82F6" },
                    { label: "Others", count: 22, percentage: 8, color: "#93C5FD" },
                ].map((item, i) => (
                    <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12.5 }}>
                            <span style={{ fontWeight: 500, color: "#4B5563" }}>{item.label}</span>
                            <span style={{ color: "#9CA3AF", fontSize: 11.5 }}>{item.count} docs • {item.percentage}%</span>
                        </div>
                        <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", background: item.color, width: `${item.percentage}%` }} />
                        </div>
                    </div>
                ))}
              </div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: 12, border: "0.5px solid #E5E7EB", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#1D4ED8", marginBottom: 16 }}>
                    <TrendingUp size={24} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Performance Insight</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, maxWidth: 240 }}>
                    Your document generation speed has improved by <strong style={{ color: "#059669" }}>18%</strong> since last month.
                </p>
                <button style={{ marginTop: 20, fontSize: 12.5, fontWeight: 500, color: "#2563EB", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <Share2 size={14} /> Share Insights
                </button>
          </div>
      </div>
    </div>
  );
}
