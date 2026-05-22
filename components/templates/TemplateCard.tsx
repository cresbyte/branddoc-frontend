"use client";

import React, { useState } from "react";
import { FileText, ArrowRight, Layers } from "lucide-react";

interface Template {
  id: string;
  title: string;
  category: string;
  thumbnail_url?: string;
  element_count?: number;
}

interface TemplateCardProps {
  template: Template;
  onSelect: (id: string) => void;
}

const CATEGORY_STYLES: Record<string, { bg: string, text: string }> = {
  letterhead:  { bg: "#EFF6FF", text: "#1D4ED8" },
  invoice:     { bg: "#ECFDF5", text: "#059669" },
  certificate: { bg: "#F5F3FF", text: "#6D28D9" },
  proposal:    { bg: "#FFF7ED", text: "#C2410C" },
  other:       { bg: "#F9FAFB", text: "#6B7280" },
};

export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false);
  const theme = CATEGORY_STYLES[template.category] ?? CATEGORY_STYLES.other;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        border: `0.5px solid ${hovered ? "#BFDBFE" : "#E5E7EB"}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.15s, transform 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
      onClick={() => onSelect(template.id)}
    >
      {/* Thumbnail Area */}
      <div style={{
        position: "relative", height: 160, background: "#F9FAFB",
        borderBottom: "0.5px solid #F3F4F6",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
      }}>
        {template.thumbnail_url ? (
          <img
            src={template.thumbnail_url}
            alt={template.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.4s",
              transform: hovered ? "scale(1.05)" : "scale(1)"
            }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#D1D5DB" }}>
            <FileText size={32} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>No Preview</span>
          </div>
        )}

        {/* Category Badge - Over Thumbnail */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          padding: "3px 8px", borderRadius: 6,
          background: theme.bg, color: theme.text,
          fontSize: 10, fontWeight: 600, textTransform: "capitalize",
          border: `0.5px solid ${theme.text}20`
        }}>
          {template.category}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
        <div>
          <h3 style={{
            fontSize: 14, fontWeight: 600, color: "#111827",
            lineHeight: "1.4", margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {template.title}
          </h3>
          {template.element_count !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11.5, color: "#9CA3AF" }}>
              <Layers size={11} />
              {template.element_count} elements
            </div>
          )}
        </div>

        <div style={{
          marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 6, padding: "8px 12px", borderRadius: 8,
          background: hovered ? "#1D4ED8" : "#F9FAFB",
          color: hovered ? "#FFFFFF" : "#4B5563",
          fontSize: 13, fontWeight: 500,
          border: hovered ? "0.5px solid #1D4ED8" : "0.5px solid #E5E7EB",
          transition: "all 0.15s"
        }}>
          Use Template
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
