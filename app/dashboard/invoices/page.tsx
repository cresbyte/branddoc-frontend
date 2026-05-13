"use client";

import React, { useEffect } from "react";
import { Receipt, Plus, ArrowUpRight, Filter, Search, MoreVertical } from "lucide-react";
import { useDashboard } from "../components/DashboardContext";

export default function InvoicesPage() {
  const { setHeaderTitle, setCta, setSearch } = useDashboard();

  useEffect(() => {
    setHeaderTitle("Invoices");
    setCta({
      label: "Create Invoice",
      onClick: () => console.log("Create invoice"),
      icon: <Plus size={14} />,
    });
    setSearch({ placeholder: "Search invoices...", hidden: false });

    return () => {
      setHeaderTitle("");
      setCta(null);
    };
  }, [setHeaderTitle, setCta, setSearch]);

  const invoices = [
    { id: "INV-001", client: "Acme Corp", date: "May 10, 2024", amount: "$2,400.00", status: "Paid", type: "Service" },
    { id: "INV-002", client: "Global Tech", date: "May 08, 2024", amount: "$1,250.00", status: "Pending", type: "License" },
    { id: "INV-003", client: "Loomis inc", date: "May 05, 2024", amount: "$3,800.00", status: "Overdue", type: "Retainer" },
    { id: "INV-004", client: "River Side", date: "May 02, 2024", amount: "$950.00", status: "Paid", type: "One-time" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Billed this month", value: "$12,450.00", sub: "+12% from last month", color: "#111827" },
          { label: "Pending invoices", value: "8", sub: "Totaling $4,200.00", color: "#B45309" },
          { label: "Overdue", value: "2", sub: "Action required", color: "#EF4444" },
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
                <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>All Invoices</span>
                <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 4 }}>{invoices.length} results</span>
            </div>
            <button style={{ 
                fontSize: 12.5, fontWeight: 500, color: "#2563EB", 
                background: "none", border: "none", cursor: "pointer" 
            }}>
                Export CSV
            </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr style={{ textAlign: "left", borderBottom: "0.5px solid #F3F4F6" }}>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Invoice</th>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Client</th>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Type</th>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Amount</th>
                    <th style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Status</th>
                    <th style={{ padding: "12px 20px", textAlign: "right" }}></th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((inv, idx) => (
                    <tr key={inv.id} 
                        style={{ 
                            borderBottom: idx === invoices.length - 1 ? "none" : "0.5px solid #F3F4F6",
                            transition: "background 0.1s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                        <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ 
                                    width: 32, height: 32, borderRadius: 8, background: "#F3F4F6",
                                    display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280"
                                }}>
                                    <Receipt size={15} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "#111827" }}>{inv.id}</div>
                                    <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{inv.date}</div>
                                </div>
                            </div>
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: 13.5, color: "#374151" }}>{inv.client}</td>
                        <td style={{ padding: "16px 20px", fontSize: 13, color: "#6B7280" }}>{inv.type}</td>
                        <td style={{ padding: "16px 20px", fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{inv.amount}</td>
                        <td style={{ padding: "16px 20px" }}>
                            <div style={{ 
                                display: "inline-flex", alignItems: "center", gap: 5,
                                fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                                background: inv.status === "Paid" ? "#ECFDF5" : inv.status === "Overdue" ? "#FEF2F2" : "#FFFBEB",
                                color: inv.status === "Paid" ? "#065F46" : inv.status === "Overdue" ? "#991B1B" : "#92400E",
                                textTransform: "uppercase", letterSpacing: "0.03em"
                            }}>
                                <div style={{ 
                                    width: 5, height: 5, borderRadius: "50%", 
                                    background: inv.status === "Paid" ? "#10B981" : inv.status === "Overdue" ? "#EF4444" : "#F59E0B" 
                                }} />
                                {inv.status}
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
