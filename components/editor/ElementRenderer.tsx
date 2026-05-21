"use client";

import React from "react";

interface Element {
  id: string;
  element_type: string;
  content?: string;
  asset_url?: string;
  font_family?: string;
  font_size?: number;
  font_weight?: string;
  font_style?: string;
  text_align?: string;
  color?: string;
  line_height?: number;
  letter_spacing?: number;
  background_color?: string;
  border_radius?: number;
  opacity?: number;
  object_fit?: string;
  is_editable?: boolean;
  is_locked?: boolean;
  is_visible?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ElementRendererProps {
  element: Element;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, value: string) => void;
}

export default function ElementRenderer({
  element,
  isSelected,
  onSelect,
  onChange,
}: ElementRendererProps) {
  if (!element.is_visible) return null;

  const interactive = element.is_editable && !element.is_locked;

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    opacity: element.opacity ?? 1,
    cursor: interactive ? "pointer" : "default",
    outline: isSelected ? "2px solid #2563EB" : "none",
    outlineOffset: "1px",
    zIndex: 10,
    userSelect: "none",
    boxSizing: "border-box",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (interactive) onSelect(element.id);
  };

  // ── TEXT ──────────────────────────────────────────────────────────────────
  if (element.element_type === "text") {
    const textStyle: React.CSSProperties = {
      fontFamily: element.font_family || "Inter, sans-serif",
      fontSize: element.font_size ? `${element.font_size}px` : "inherit",
      fontWeight: element.font_weight || "normal",
      fontStyle: element.font_style || "normal",
      textAlign: (element.text_align as any) || "left",
      color: element.color || "#000000",
      lineHeight: element.line_height ?? 1.4,
      letterSpacing: element.letter_spacing ? `${element.letter_spacing}px` : undefined,
      width: "100%",
      height: "100%",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      overflow: "hidden",
      outline: "none",
      border: "none",
      background: "transparent",
      padding: 0,
      margin: 0,
      resize: "none",
    };

    return (
      <div style={containerStyle} onClick={handleClick}>
        {isSelected && interactive ? (
          <div
            contentEditable
            suppressContentEditableWarning
            style={textStyle}
            onInput={(e) =>
              onChange(element.id, (e.currentTarget as HTMLDivElement).innerText)
            }
            dangerouslySetInnerHTML={{ __html: element.content || "" }}
          />
        ) : (
          <div style={textStyle}>{element.content || ""}</div>
        )}
      </div>
    );
  }

  // ── IMAGE ─────────────────────────────────────────────────────────────────
  if (element.element_type === "image") {
    return (
      <div style={containerStyle} onClick={handleClick}>
        {element.asset_url ? (
          <img
            src={element.asset_url}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: (element.object_fit as any) || "contain",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              fontSize: "11px",
              textAlign: "center",
            }}
          >
            Logo
          </div>
        )}
      </div>
    );
  }

  // ── SVG ───────────────────────────────────────────────────────────────────
  if (element.element_type === "svg") {
    return (
      <div style={containerStyle} onClick={handleClick}>
        {element.asset_url && (
          <img
            src={element.asset_url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </div>
    );
  }

  // ── LINE ──────────────────────────────────────────────────────────────────
  if (element.element_type === "line") {
    return (
      <div
        style={{
          ...containerStyle,
          height: "2px",
          backgroundColor: element.background_color || "#000000",
        }}
        onClick={handleClick}
      />
    );
  }

  // ── SHAPE (default) ───────────────────────────────────────────────────────
  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: element.background_color || "transparent",
        borderRadius: element.border_radius ? `${element.border_radius}px` : 0,
      }}
      onClick={handleClick}
    />
  );
}
