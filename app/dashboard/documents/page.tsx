"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  FileEdit,
  Plus,
} from "lucide-react";
import { useDashboard } from "../components/DashboardContext";

export default function DocumentsPage() {
  const { setCta, setSearch, setHeaderTitle } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");

  const documents = useMemo(() => [
    { id: 1, name: "Consultancy Agreement - April", date: "Apr 28, 2024", type: "Legal", status: "Finalized", size: "1.2 MB" },
    { id: 2, name: "Project Requirements Specification", date: "Apr 29, 2024", type: "Technical", status: "Draft", size: "850 KB" },
    { id: 3, name: "Mutual NDA - Startup Inc", date: "Apr 25, 2024", type: "Legal", status: "Finalized", size: "450 KB" },
    { id: 4, name: "Service Level Agreement v3", date: "Apr 22, 2024", type: "Service", status: "Pending", size: "2.1 MB" },
    { id: 5, name: "Annual Brand Guidelines", date: "Apr 15, 2024", type: "Branding", status: "Finalized", size: "8.4 MB" },
    { id: 6, name: "Website Content Draft", date: "Apr 12, 2024", type: "Marketing", status: "In Progress", size: "120 KB" },
  ], []);

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Set static header parts
  useEffect(() => {
    setHeaderTitle("Documents");
    setCta({
      label: "Create New",
      onClick: () => console.log("Create New Document clicked"),
      icon: <Plus size={14} />
    });

    return () => {
      setCta(null);
      setHeaderTitle("");
    };
  }, [setHeaderTitle, setCta]);

  // Sync search state independently
  useEffect(() => {
    setSearch({
      placeholder: "Search documents...",
      value: searchTerm,
      onChange: (v) => setSearchTerm(v),
      hidden: false
    });

    return () => {
      setSearch({ value: "" });
    };
  }, [searchTerm, setSearch]);

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Docs", value: "24", icon: <FileText size={20} />, color: "#1D4ED8" },
          { label: "Finalized", value: "18", icon: <CheckCircle2 size={20} />, color: "#059669" },
          { label: "Pending", value: "4", icon: <Clock size={20} />, color: "#D97706" },
          { label: "Drafts", value: "2", icon: <FileEdit size={20} />, color: "#2563EB" },
        ].map((stat, i) => (
          <div key={i} style={{
            background: "white", padding: "20px", borderRadius: 12, border: "0.5px solid #E5E7EB",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 4px 0" }}>{stat.label}</p>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>{stat.value}</h3>
            </div>
            <div style={{ color: stat.color, opacity: 0.8 }}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #E5E7EB", overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "0.5px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>Document Library</h2>
        </div>
        
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              <th style={{ padding: "12px 20px", fontWeight: 500, color: "#6B7280" }}>Name</th>
              <th style={{ padding: "12px 20px", fontWeight: 500, color: "#6B7280" }}>Type</th>
              <th style={{ padding: "12px 20px", fontWeight: 500, color: "#6B7280" }}>Date</th>
              <th style={{ padding: "12px 20px", fontWeight: 500, color: "#6B7280" }}>Status</th>
              <th style={{ padding: "12px 20px", fontWeight: 500, color: "#6B7280", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr key={doc.id} style={{ borderTop: "0.5px solid #F3F4F6" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ 
                      width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", 
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#1D4ED8" 
                    }}>
                      <FileText size={16} />
                    </div>
                    <span style={{ fontWeight: 500, color: "#111827" }}>{doc.name}</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", color: "#4B5563" }}>{doc.type}</td>
                <td style={{ padding: "16px 20px", color: "#4B5563" }}>{doc.date}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 100,
                    background: doc.status === "Finalized" ? "#ECFDF5" : "#F3F4F6",
                    color: doc.status === "Finalized" ? "#065F46" : "#374151",
                    textTransform: "uppercase", letterSpacing: "0.02em"
                  }}>
                    {doc.status}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                  <button style={{ 
                    background: "none", border: "none", color: "#2563EB", 
                    fontSize: 13, fontWeight: 500, cursor: "pointer" 
                  }}>
                    {doc.status === "Finalized" ? "Download" : "Edit"}
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
