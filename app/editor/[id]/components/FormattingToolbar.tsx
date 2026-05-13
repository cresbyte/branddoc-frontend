"use client";

import React, { useEffect, useReducer, useState } from "react";
import {
  Bold, Italic, Underline, AlignLeft, Link, Image, Minus, Plus,
  Search, Undo, Redo, Printer, PaintBucket, Pencil, ChevronDown,
  ChevronUp, List, ListOrdered, Indent, Outdent, RemoveFormatting,
  Star, FolderOpen, Cloud, History, MessageSquare, Video, Zap, Lock,
  SpellCheck,
} from "lucide-react";
import { useEditorContext } from "./EditorContext";
import { Block } from "./types";

interface FormattingToolbarProps {
  selectedBlock: Block | undefined;
  updateBlockStyle: (id: string, updates: any) => void;
}

const PARAGRAPH_STYLES = ["Normal text","Title","Subtitle","Heading 1","Heading 2","Heading 3","Heading 4"];
const FONT_FAMILIES = ["Arial","Times New Roman","Georgia","Verdana","Trebuchet MS","Courier New"];

/* ─── primitives ─────────────────────────────────────────── */

function Sep() {
  return <div style={{ width: 1, height: 20, backgroundColor: "#e0e0e0", flexShrink: 0, margin: "0 2px" }} />;
}

function TBtn({ active, onClick, title, disabled, children, style }: {
  active?: boolean; onClick?: () => void; title?: string; disabled?: boolean;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); if (!disabled && onClick) onClick(); }}
      title={title} disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 28, minWidth: 28, padding: "0 4px", border: "none", borderRadius: 4,
        background: active ? "#e8f0fe" : "transparent",
        color: disabled ? "#bdbdbd" : active ? "#1a73e8" : "#3c4043",
        cursor: disabled ? "default" : "pointer", flexShrink: 0, gap: 2, fontSize: 13,
        fontFamily: "'Google Sans', Arial, sans-serif", transition: "background 0.1s", ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && !active) (e.currentTarget as HTMLElement).style.background = "#f1f3f4"; }}
      onMouseLeave={(e) => { if (!disabled && !active) (e.currentTarget as HTMLElement).style.background = active ? "#e8f0fe" : "transparent"; }}
    >{children}</button>
  );
}

function GSelect({ value, onChange, options, title }: {
  value: string | number; onChange: (v: string) => void;
  options: (string | number)[]; title?: string;
}) {
  return (
    <div title={title} style={{
      position: "relative", display: "flex", alignItems: "center", height: 28,
      borderRadius: 4, padding: "0 6px", cursor: "pointer", flexShrink: 0,
      background: "transparent", border: "1px solid transparent", transition: "border-color 0.1s, background 0.1s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f1f3f4"; (e.currentTarget as HTMLElement).style.borderColor = "#e0e0e0"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
    >
      <span style={{ fontSize: 13, color: "#3c4043", fontFamily: "'Google Sans', Arial, sans-serif", whiteSpace: "nowrap", pointerEvents: "none", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis" }}>
        {value}
      </span>
      <ChevronDown size={12} style={{ color: "#5f6368", marginLeft: 3, pointerEvents: "none", flexShrink: 0 }} />
      <select value={value} onChange={(e) => onChange(e.target.value)} onMouseDown={(e) => e.stopPropagation()}
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FontSizeControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", height: 28, border: "1px solid #e0e0e0", borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
      <button onMouseDown={(e) => { e.preventDefault(); onChange(Math.max(6, value - 1)); }}
        style={{ border: "none", background: "transparent", width: 22, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3c4043", flexShrink: 0 }} title="Decrease font size">
        <Minus size={11} strokeWidth={2.5} />
      </button>
      <input type="text" value={value} onChange={(e) => { const n = parseInt(e.target.value); if (!isNaN(n) && n > 0) onChange(n); }}
        style={{ width: 30, height: 28, border: "none", borderLeft: "1px solid #e0e0e0", borderRight: "1px solid #e0e0e0", textAlign: "center", fontSize: 13, fontFamily: "'Google Sans', Arial, sans-serif", color: "#3c4043", background: "#fff", outline: "none" }} />
      <button onMouseDown={(e) => { e.preventDefault(); onChange(Math.min(400, value + 1)); }}
        style={{ border: "none", background: "transparent", width: 22, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3c4043", flexShrink: 0 }} title="Increase font size">
        <Plus size={11} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ─── Row 1: Title bar ────────────────────────────────────── */

function TitleBar() {
  return (
    <div style={{ height: 44, backgroundColor: "#fff", display: "flex", alignItems: "center", padding: "0 12px", gap: 0, flexShrink: 0 }}>
      {/* Google Docs blue icon */}
      <div style={{ width: 36, height: 36, flexShrink: 0, marginRight: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <rect x="4" y="1" width="17" height="22" rx="1.5" fill="#4285f4" />
          <path d="M17 1l4 4h-3.5A0.5 0.5 0 0117 4.5V1z" fill="#2a5db0" />
          <rect x="7" y="9"  width="10" height="1.5" rx="0.75" fill="white" opacity="0.95" />
          <rect x="7" y="12" width="10" height="1.5" rx="0.75" fill="white" opacity="0.95" />
          <rect x="7" y="15" width="7"  height="1.5" rx="0.75" fill="white" opacity="0.95" />
        </svg>
      </div>

      {/* Filename */}
      <span style={{ fontSize: 18, color: "#202124", fontFamily: "'Google Sans', Arial, sans-serif", fontWeight: 400, cursor: "text", marginRight: 4, whiteSpace: "nowrap" }}>
        Invoice_1241B_Balance_Shipping
      </span>

      {/* Star */}
      <TBtn title="Star" style={{ minWidth: 28, height: 28, color: "#5f6368" }}>
        <Star size={16} />
      </TBtn>
      {/* Move to folder */}
      <TBtn title="Move to folder" style={{ minWidth: 28, height: 28, color: "#5f6368" }}>
        <FolderOpen size={16} />
      </TBtn>
      {/* Cloud save */}
      <TBtn title="All changes saved in Drive" style={{ minWidth: 28, height: 28, color: "#5f6368" }}>
        <Cloud size={16} />
      </TBtn>

      {/* Push right */}
      <div style={{ flex: 1 }} />

      {/* Right-side icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Version history */}
        <TBtn title="See version history">
          <History size={18} style={{ color: "#444746" }} />
        </TBtn>

        {/* Comments */}
        <TBtn title="Open comment history">
          <MessageSquare size={18} style={{ color: "#444746" }} />
        </TBtn>

        {/* Meet icon + chevron */}
        <div style={{ display: "flex", alignItems: "center", borderRadius: 4 }}>
          <TBtn title="Join a call">
            <Video size={18} style={{ color: "#444746" }} />
          </TBtn>
          <TBtn style={{ minWidth: 18, padding: 0 }}>
            <ChevronDown size={12} style={{ color: "#5f6368" }} />
          </TBtn>
        </div>

        <div style={{ width: 8 }} />

        {/* Share split button */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px",
            background: "#c2e7ff", border: "none", borderRadius: "20px 0 0 20px",
            cursor: "pointer", color: "#001d35", fontSize: 14,
            fontFamily: "'Google Sans', Arial, sans-serif", fontWeight: 500,
          }}>
            <Lock size={14} />
            Share
          </button>
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 34, width: 26, background: "#c2e7ff", border: "none",
            borderLeft: "1px solid #a0d0ee", borderRadius: "0 20px 20px 0",
            cursor: "pointer", color: "#001d35",
          }}>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Upgrade */}
        <button style={{
          display: "flex", alignItems: "center", height: 34, padding: "0 16px",
          background: "#fff", border: "1px solid #dadce0", borderRadius: 20,
          cursor: "pointer", color: "#3c4043", fontSize: 14,
          fontFamily: "'Google Sans', Arial, sans-serif", fontWeight: 500, marginLeft: 4,
        }}>
          Upgrade
        </button>

        {/* Extension/plugin icon */}
        <TBtn title="Extensions" style={{ marginLeft: 4 }}>
          <Zap size={17} style={{ color: "#444746" }} />
        </TBtn>

        {/* User avatar circle */}
        <div style={{
          width: 34, height: 34, borderRadius: "50%", marginLeft: 4,
          background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Google Sans', Arial, sans-serif" }}>U</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Row 2: Menu bar ─────────────────────────────────────── */

function MenuBar() {
  const menus = ["File","Edit","View","Insert","Format","Tools","Extensions","Help"];
  return (
    <div style={{ height: 30, backgroundColor: "#fff", display: "flex", alignItems: "center", padding: "0 10px", gap: 0, flexShrink: 0 }}>
      {menus.map((m) => (
        <button key={m} style={{
          height: 26, padding: "0 8px", border: "none", borderRadius: 4,
          background: "transparent", cursor: "pointer", color: "#3c4043", fontSize: 13,
          fontFamily: "'Google Sans', Arial, sans-serif",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >{m}</button>
      ))}
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────── */

export function FormattingToolbar({ selectedBlock, updateBlockStyle }: FormattingToolbarProps) {
  const [tick, rerender] = useReducer((x) => x + 1, 0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const { getEditor } = useEditorContext();
  const editor = getEditor();

  useEffect(() => {
    if (!editor) return;
    const fn = () => rerender();
    editor.on("transaction", fn);
    return () => { editor.off("transaction", fn); };
  }, [editor]);

  const blockId = selectedBlock?.id ?? "";
  const fontSize = selectedBlock?.style?.fontSize ?? 10;
  const textAlign = selectedBlock?.style?.textAlign ?? "left";

  return (
    <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, borderBottom: "1px solid #e0e0e0" }}>

      {/* ── Row 1 & 2: Title & Menu bars (collapsible) ── */}
      {headerVisible && (
        <>
          <TitleBar />
          <MenuBar />
        </>
      )}

      {/* ── Row 3: Formatting toolbar (Always visible) ── */}
      <div style={{
        height: 40, backgroundColor: "#f8f9fa", display: "flex", alignItems: "center",
        padding: "0 8px", gap: 1, flexShrink: 0, overflowX: "auto", overflowY: "hidden", userSelect: "none",
      }}>
        {/* Menus search pill */}
        <TBtn title="Search menus (Alt+/)" style={{ gap: 5, padding: "0 10px", borderRadius: 20, border: "1px solid transparent" }}>
          <Search size={13} style={{ color: "#5f6368" }} />
          <span style={{ fontSize: 13, color: "#3c4043", fontFamily: "'Google Sans', Arial, sans-serif" }}>Menus</span>
        </TBtn>

        <Sep />

        <TBtn title="Undo (Ctrl+Z)" onClick={() => editor?.chain().focus().undo().run()}><Undo size={16} /></TBtn>
        <TBtn title="Redo (Ctrl+Y)" onClick={() => editor?.chain().focus().redo().run()}><Redo size={16} /></TBtn>
        <TBtn title="Print (Ctrl+P)"><Printer size={15} /></TBtn>
        <TBtn title="Spell check (Ctrl+Alt+X)"><SpellCheck size={15} /></TBtn>
        <TBtn title="Paint format"><PaintBucket size={14} /></TBtn>

        <Sep />

        <GSelect value="100%" onChange={() => {}} options={["50%","75%","90%","100%","125%","150%","200%"]} title="Zoom" />

        <Sep />

        <GSelect value="Normal text" onChange={() => {}} options={PARAGRAPH_STYLES} title="Paragraph styles" />

        <Sep />

        <GSelect value="Arial" onChange={() => {}} options={FONT_FAMILIES} title="Font" />

        <Sep />

        <FontSizeControl value={fontSize} onChange={(v) => { if (blockId) updateBlockStyle(blockId, { fontSize: v }); }} />

        <Sep />

        <TBtn active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)">
          <Bold size={15} strokeWidth={2.5} />
        </TBtn>
        <TBtn active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)">
          <Italic size={15} />
        </TBtn>
        <TBtn active={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)">
          <Underline size={15} />
        </TBtn>

        {/* Text color */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", flexShrink: 0 }} title="Text color">
          <TBtn>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, fontFamily: "'Google Sans', Arial, sans-serif" }}>A</span>
              <div style={{ width: 13, height: 3, backgroundColor: "#ea4335", borderRadius: 1 }} />
            </div>
          </TBtn>
          <input type="color" defaultValue="#ea4335"
            onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
            style={{ position: "absolute", opacity: 0, inset: 0, cursor: "pointer", width: "100%", height: "100%" }} />
        </div>

        {/* Highlight pen */}
        <TBtn title="Highlight color">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Pencil size={13} />
            <div style={{ width: 13, height: 3, backgroundColor: "#fbbc04", borderRadius: 1 }} />
          </div>
        </TBtn>

        <Sep />

        <TBtn title="Insert link (Ctrl+K)"><Link size={15} /></TBtn>
        <TBtn title="Insert image"><Image size={15} /></TBtn>

        <Sep />

        <TBtn active={textAlign === "left"} onClick={() => blockId && updateBlockStyle(blockId, { textAlign: "left" })} title="Align left">
          <AlignLeft size={15} />
        </TBtn>

        {/* Line spacing icon (manual SVG-ish) */}
        <TBtn title="Line & paragraph spacing">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <div style={{ width: 4, height: 1.5, background: "#3c4043", borderRadius: 1 }} />
                <div style={{ width: 9, height: 1.5, background: "#3c4043", borderRadius: 1 }} />
              </div>
            ))}
          </div>
        </TBtn>

        {/* Checklist */}
        <TBtn title="Checklist">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ display: "flex", gap: 3, alignItems: "center" }}>
                <div style={{ width: 5, height: 5, border: "1.5px solid #3c4043", borderRadius: 1 }} />
                <div style={{ width: 8, height: 1.5, background: "#3c4043", borderRadius: 1 }} />
              </div>
            ))}
          </div>
        </TBtn>

        <TBtn active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bulleted list">
          <List size={15} />
        </TBtn>
        <TBtn active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Numbered list">
          <ListOrdered size={15} />
        </TBtn>
        <TBtn title="Decrease indent" onClick={() => editor?.chain().focus().liftListItem("listItem").run()}>
          <Outdent size={15} />
        </TBtn>
        <TBtn title="Increase indent" onClick={() => editor?.chain().focus().sinkListItem("listItem").run()}>
          <Indent size={15} />
        </TBtn>

        <Sep />

        <TBtn title="Clear formatting (Ctrl+\)" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}>
          <RemoveFormatting size={15} />
        </TBtn>

        {/* ── Spacer ── */}
        <div style={{ flex: 1, minWidth: 4 }} />

        {/* Editing mode dropdown */}
        <div style={{ display: "flex", alignItems: "center", borderRadius: 4, flexShrink: 0 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 5, height: 28, padding: "0 8px",
            border: "none", background: "transparent", cursor: "pointer", color: "#3c4043",
            fontSize: 13, fontFamily: "'Google Sans', Arial, sans-serif", borderRadius: "4px 0 0 4px",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Pencil size={13} style={{ color: "#5f6368" }} />
            <span>Editing</span>
          </button>
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 28, width: 20, border: "none", background: "transparent",
            cursor: "pointer", color: "#5f6368", borderRadius: "0 4px 4px 0",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Toggle header visibility */}
        <TBtn title={headerVisible ? "Hide the menus" : "Show the menus"} onClick={() => setHeaderVisible(!headerVisible)} style={{ minWidth: 26 }}>
          {headerVisible ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </TBtn>
      </div>
    </div>
  );
}
