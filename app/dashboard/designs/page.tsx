"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileText, Pencil, Trash2, Plus, Calendar } from "lucide-react";
import { getUserDesigns, deleteUserDesign } from "@/services/templates";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function DashboardDesignsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["designs"],
    queryFn: getUserDesigns,
  });

  const designs = data?.results ?? data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserDesign(id),
    onSuccess: () => {
      toast.success("Design deleted.");
      qc.invalidateQueries({ queryKey: ["designs"] });
    },
    onError: () => toast.error("Failed to delete design."),
  });

  return (
    <>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.02em",
              marginBottom: 3,
            }}
          >
            My Designs
          </h1>
          <p style={{ fontSize: 13.5, color: "#6B7280" }}>
            View and manage all your saved document designs.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/templates")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            background: "#1D4ED8",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Plus size={16} />
          New Design
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 140, background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
          ))}
        </div>
      ) : designs.length === 0 ? (
        <div style={{ 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
          padding: "80px 20px", textAlign: "center", background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12 
        }}>
          <div style={{ 
            width: 56, height: 56, borderRadius: 14, background: "#F9FAFB", border: "0.5px solid #E5E7EB",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "#9CA3AF"
          }}>
            <FileText size={24} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>No designs yet</h3>
          <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 300, marginBottom: 20 }}>
            Start by choosing a template from our library to create your first design.
          </p>
          <button
            onClick={() => router.push("/dashboard/templates")}
            style={{
              padding: "8px 16px", borderRadius: 10, background: "#fff", border: "0.5px solid #E5E7EB",
              fontSize: 14, fontWeight: 500, color: "#111827", cursor: "pointer", fontFamily: "inherit"
            }}
          >
            Browse Templates
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {designs.map((design: any) => (
            <div
              key={design.id}
              style={{
                display: "flex", flexDirection: "column", gap: 12, background: "#FFFFFF",
                border: "0.5px solid #E5E7EB", borderRadius: 12, padding: "16px",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#BFDBFE";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 600, color: "#111827", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {design.title}
                  </h3>
                  {design.template && (
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      Model: {design.template.title}
                    </div>
                  )}
                </div>
                <div style={{ 
                  width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", border: "0.5px solid #BFDBFE",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#1D4ED8", flexShrink: 0
                }}>
                  <FileText size={16} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9CA3AF" }}>
                <Calendar size={12} />
                Updated {formatDate(design.updated_at)}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button
                  onClick={() =>
                    router.push(`/dashboard/templates/${design.template?.id}/edit?design_id=${design.id}`)
                  }
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "7px 12px", borderRadius: 8, background: "#1D4ED8", color: "#fff",
                    fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit"
                  }}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(design.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "7px", borderRadius: 8, background: "#fff", border: "0.5px solid #FEE2E2",
                    color: "#EF4444", cursor: "pointer", fontFamily: "inherit"
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Design"
        message="Are you sure you want to permanently delete this design?"
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
