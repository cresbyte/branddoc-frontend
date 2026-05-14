"use client";

import React from "react";
import {
  History, MessageSquare, Video, Zap, Lock, ChevronDown,
  FolderOpen, Cloud, Star,
} from "lucide-react";

interface EditorTitleBarProps {
  title: string;
  onTitleChange?: (t: string) => void;
}

export function EditorTitleBar({ title, onTitleChange }: EditorTitleBarProps) {
  return (
    <div style={{ height: 44, backgroundColor: "#fff", display: "flex", alignItems: "center", padding: "0 12px", gap: 0, flexShrink: 0 }}>
      {/* Docs icon */}
      <div style={{ width: 36, height: 36, flexShrink: 0, marginRight: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <rect x="4" y="1" width="17" height="22" rx="1.5" fill="#4285f4" />
          <path d="M17 1l4 4h-3.5A0.5.5 0 0117 4.5V1z" fill="#2a5db0" />
          <rect x="7" y="9"  width="10" height="1.5" rx=".75" fill="white" opacity=".95" />
          <rect x="7" y="12" width="10" height="1.5" rx=".75" fill="white" opacity=".95" />
          <rect x="7" y="15" width="7"  height="1.5" rx=".75" fill="white" opacity=".95" />
        </svg>
      </div>

      {/* Editable title */}
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onTitleChange?.(e.currentTarget.textContent || "")}
        style={{ fontSize: 18, color: "#202124", fontFamily: "'Google Sans', Arial, sans-serif", fontWeight: 400, cursor: "text", marginRight: 4, whiteSpace: "nowrap", outline: "none", minWidth: 60 }}
      >
        {title}
      </span>

      {/* Quick icons */}
      {[
        { icon: <Star size={16} />,       title: "Star" },
        { icon: <FolderOpen size={16} />, title: "Move to folder" },
        { icon: <Cloud size={16} />,      title: "All changes saved" },
      ].map(({ icon, title: t }) => (
        <button key={t} title={t} style={{ height: 28, width: 28, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: "#5f6368", flexShrink: 0 }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f1f3f4")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
        >{icon}</button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Right toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {[
          { icon: <History size={18} />,       title: "Version history" },
          { icon: <MessageSquare size={18} />, title: "Comments" },
          { icon: <Video size={18} />,         title: "Meet" },
        ].map(({ icon, title: t }) => (
          <button key={t} title={t} style={{ height: 28, width: 28, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: "#444746", flexShrink: 0 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f1f3f4")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >{icon}</button>
        ))}

        <div style={{ width: 8 }} />

        {/* Share button */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", background: "#c2e7ff", border: "none", borderRadius: "20px 0 0 20px", cursor: "pointer", color: "#001d35", fontSize: 14, fontFamily: "'Google Sans', Arial, sans-serif", fontWeight: 500 }}>
            <Lock size={14} /> Share
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 34, width: 26, background: "#c2e7ff", border: "none", borderLeft: "1px solid #a0d0ee", borderRadius: "0 20px 20px 0", cursor: "pointer", color: "#001d35" }}>
            <ChevronDown size={14} />
          </button>
        </div>

        <Zap size={17} style={{ color: "#444746", marginLeft: 6, cursor: "pointer" }} />

        {/* Avatar */}
        <div style={{ width: 34, height: 34, borderRadius: "50%", marginLeft: 4, background: "linear-gradient(135deg,#4285f4,#34a853)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>U</span>
        </div>
      </div>
    </div>
  );
}
