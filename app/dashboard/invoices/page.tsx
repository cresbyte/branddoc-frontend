"use client";

import React from "react";
import { Receipt, Search, Plus, Filter, ArrowUpRight } from "lucide-react";

export default function InvoicesPage() {
  const invoices = [
    { id: "INV-001", client: "Acme Corp", date: "May 10, 2024", amount: "$2,400.00", status: "Paid" },
    { id: "INV-002", client: "Global Tech", date: "May 08, 2024", amount: "$1,250.00", status: "Pending" },
    { id: "INV-003", client: "Loomis inc", date: "May 05, 2024", amount: "$3,800.00", status: "Overdue" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>Invoices</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Manage and track your document-based billing.</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
          background: "#111827", color: "white", border: "none", borderRadius: 8,
          fontSize: 14, fontWeight: 500, cursor: "pointer"
        }}>
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Billed this month", value: "$12,450.00", sub: "+12% from last month" },
          { label: "Pending invoices", value: "8", sub: "Totaling $4,200.00" },
          { label: "Overdue", value: "2", sub: "Action required" },
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
                    <input placeholder="Search invoices..." style={{ padding: "8px 10px 8px 32px", fontSize: 13, border: "0.5px solid #E5E7EB", borderRadius: 6, outline: "none" }} />
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", background: "white", border: "0.5px solid #E5E7EB", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
                    <Filter size={14} /> Filter
                </button>
            </div>
            <button style={{ color: "#2563EB", background: "none", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Export CSV</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
                <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>ID</th>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>Client</th>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>Date</th>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>Amount</th>
                    <th style={{ padding: "12px 20px", color: "#6B7280", fontWeight: 500 }}>Status</th>
                    <th style={{ padding: "12px 20px", textAlign: "right" }}></th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((inv) => (
                    <tr key={inv.id} style={{ borderTop: "0.5px solid #F3F4F6" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 500 }}>{inv.id}</td>
                        <td style={{ padding: "16px 20px" }}>{inv.client}</td>
                        <td style={{ padding: "16px 20px", color: "#6B7280" }}>{inv.date}</td>
                        <td style={{ padding: "16px 20px", fontWeight: 600 }}>{inv.amount}</td>
                        <td style={{ padding: "16px 20px" }}>
                            <span style={{ 
                                fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                                background: inv.status === "Paid" ? "#ECFDF5" : inv.status === "Overdue" ? "#FEF2F2" : "#FFFBEB",
                                color: inv.status === "Paid" ? "#065F46" : inv.status === "Overdue" ? "#991B1B" : "#92400E"
                            }}>
                                {inv.status}
                            </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                            <ArrowUpRight size={16} color="#9CA3AF" style={{ cursor: "pointer" }} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
