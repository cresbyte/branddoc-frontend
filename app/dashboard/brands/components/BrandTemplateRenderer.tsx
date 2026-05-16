"use client";

import React from "react";
import { interpolate } from "@/lib/utils";

interface Element {
  type: "text" | "image";
  value?: string;
  src?: string;
  font?: string;
  size?: number;
  color?: string;
  bold?: boolean;
  opacity?: number;
  max_height?: number;
  margin_top?: number;
  fallback?: Element;
}

interface Column {
  width: string;
  align: "left" | "center" | "right";
  padding?: string;
  background?: string;
  elements: Element[];
}

interface Layout {
  style: string;
  height?: number;
  background?: string;
  padding?: string;
  border_top?: { color: string; thickness: number; opacity?: number };
  border_bottom?: { color: string; thickness: number; opacity?: number };
  columns: Column[];
}

export function BrandLayoutRenderer({
  layout,
  context,
  scale = 1
}: {
  layout: Layout;
  context: Record<string, any>;
  scale?: number;
}) {
  if (!layout) return null;

  // Interpolate the layout with context
  const resolvedLayout = interpolate(layout, context) as Layout;

  const containerStyle: React.CSSProperties = {
    background: resolvedLayout.background || "transparent",
    padding: resolvedLayout.padding || 0,
    minHeight: resolvedLayout.height ? resolvedLayout.height * scale : "auto",
    display: "flex",
    width: "100%",
    position: "relative",
    borderTop: resolvedLayout.border_top ? `${resolvedLayout.border_top.thickness * scale}px solid ${resolvedLayout.border_top.color}` : "none",
    borderBottom: resolvedLayout.border_bottom ? `${resolvedLayout.border_bottom.thickness * scale}px solid ${resolvedLayout.border_bottom.color}` : "none",
    overflow: "hidden"
  };

  if (resolvedLayout.border_top?.opacity) {
      // Handle opacity for border color if needed
  }

  return (
    <div style={containerStyle}>
      {resolvedLayout.columns.map((col, idx) => (
        <div
          key={idx}
          style={{
            width: col.width,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: col.align === "left" ? "flex-start" : col.align === "right" ? "flex-end" : "center",
            padding: col.padding || 0,
            background: col.background || "transparent",
            textAlign: col.align,
          }}
        >
          {col.elements.map((el, elIdx) => (
            <div key={elIdx} style={{ marginTop: el.margin_top ? el.margin_top * scale : 0 }}>
              {el.type === "image" && el.src ? (
                <img
                  src={el.src}
                  alt="Logo"
                  style={{
                    maxHeight: el.max_height ? el.max_height * scale : "none",
                    maxWidth: "100%",
                    display: "block"
                  }}
                  onError={(e) => {
                    // If image fails, try fallback
                    (e.target as any).style.display = "none";
                  }}
                />
              ) : el.type === "text" ? (
                <div
                  style={{
                    fontSize: el.size ? el.size * scale : undefined,
                    fontWeight: el.bold ? 700 : 400,
                    color: el.color,
                    opacity: el.opacity,
                    fontFamily: el.font || "inherit",
                    lineHeight: 1.2
                  }}
                >
                  {el.value}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
