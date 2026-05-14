"use client";

import React, { useEffect, useReducer, useState } from "react";
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, Link, Image, Minus, Plus, Search, Undo, Redo,
  Printer, PaintBucket, Pencil, ChevronDown, ChevronUp,
  List, ListOrdered, Indent, Outdent, RemoveFormatting, SpellCheck,
} from "lucide-react";
import { useEditorContext } from "./EditorContext";
import { EditorTitleBar } from "./EditorTitleBar";
import { EditorMenuBar, FindBar } from "./EditorMenuBar";

/* ── Primitives ────────────────────────────────────────────── */

function Sep() {
  return <div style={{ width: 1, height: 20, backgroundColor: "#e0e0e0", flexShrink: 0, margin: "0 2px" }} />;
}

function TBtn({ active, onClick, title, disabled, children, style }: {
  active?: boolean; onClick?: () => void; title?: string;
  disabled?: boolean; children: React.ReactNode; style?: React.CSSProperties;
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
    >
      {children}
    </button>
  );
}

function GSelect({ value, onChange, options, title }: {
  value: string | number; onChange: (v: string) => void;
  options: (string | number)[]; title?: string;
}) {
  return (
    <div title={title} style={{ position: "relative", display: "flex", alignItems: "center", height: 28, borderRadius: 4, padding: "0 6px", cursor: "pointer", flexShrink: 0, border: "1px solid transparent", transition: "border-color 0.1s, background 0.1s" }}
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
      <input type="text" value={value}
        onChange={(e) => { const n = parseInt(e.target.value); if (!isNaN(n) && n > 0) onChange(n); }}
        style={{ width: 30, height: 28, border: "none", borderLeft: "1px solid #e0e0e0", borderRight: "1px solid #e0e0e0", textAlign: "center", fontSize: 13, fontFamily: "'Google Sans', Arial, sans-serif", color: "#3c4043", background: "#fff", outline: "none" }} />
      <button onMouseDown={(e) => { e.preventDefault(); onChange(Math.min(400, value + 1)); }}
        style={{ border: "none", background: "transparent", width: 22, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3c4043", flexShrink: 0 }} title="Increase font size">
        <Plus size={11} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ── Constants ──────────────────────────────────────────── */
const PARAGRAPH_STYLES = ["Normal text", "Title", "Subtitle", "Heading 1", "Heading 2", "Heading 3"];
const FONT_FAMILIES    = ["Arial", "Times New Roman", "Georgia", "Verdana", "Trebuchet MS", "Courier New"];
const FONT_SIZES       = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

/* ── Main export ────────────────────────────────────────── */
interface FormattingToolbarProps {
  title: string;
  onTitleChange: (t: string) => void;
  docHtml: string;
}

export function FormattingToolbar({ title, onTitleChange, docHtml }: FormattingToolbarProps) {
  const [tick,          rerender]       = useReducer((x) => x + 1, 0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showFind,      setShowFind]    = useState(false);
  const { getEditor } = useEditorContext();
  const editor = getEditor();

  // Re-render when editor state changes (selection, marks, etc.)
  useEffect(() => {
    if (!editor) return;
    const fn = () => rerender();
    editor.on("transaction", fn);
    return () => { editor.off("transaction", fn); };
  }, [editor]);

  /* ── derived state at cursor ── */
  const activeFontSize  = parseInt(editor?.getAttributes("textStyle").fontSize ?? "0") || 11;
  const activeFontFamily = editor?.getAttributes("textStyle").fontFamily || "Arial";
  const activeAlign =
    editor?.isActive({ textAlign: "center"  }) ? "center"  :
    editor?.isActive({ textAlign: "right"   }) ? "right"   :
    editor?.isActive({ textAlign: "justify" }) ? "justify" : "left";
  const activeStyle =
    editor?.isActive("heading", { level: 1 }) ? "Heading 1" :
    editor?.isActive("heading", { level: 2 }) ? "Heading 2" :
    editor?.isActive("heading", { level: 3 }) ? "Heading 3" : "Normal text";

  const setStyle = (v: string) => {
    if (v === "Normal text") editor?.chain().focus().setParagraph().run();
    else if (v === "Heading 1") editor?.chain().focus().toggleHeading({ level: 1 }).run();
    else if (v === "Heading 2") editor?.chain().focus().toggleHeading({ level: 2 }).run();
    else if (v === "Heading 3") editor?.chain().focus().toggleHeading({ level: 3 }).run();
  };

  const setAlign = (a: string) => editor?.chain().focus().setTextAlign(a).run();

  return (
    <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, borderBottom: "1px solid #e0e0e0" }}>

      {/* Title bar + menu bar (collapsible) */}
      {headerVisible && (
        <>
          <EditorTitleBar title={title} onTitleChange={onTitleChange} />
          <EditorMenuBar editor={editor} docHtml={docHtml} onShowFind={() => setShowFind(true)} />
        </>
      )}

      {/* Find bar */}
      {showFind && <FindBar onClose={() => setShowFind(false)} />}

      {/* ── Formatting strip ──────────────────────────────── */}
      <div style={{ height: 40, backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", padding: "0 8px", gap: 1, flexShrink: 0, overflowX: "auto", overflowY: "hidden", userSelect: "none" }}>

        {/* Search menus pill */}
        <TBtn title="Search menus (Alt+/)" style={{ gap: 5, padding: "0 10px", borderRadius: 20, border: "1px solid transparent" }}>
          <Search size={13} style={{ color: "#5f6368" }} />
          <span style={{ fontSize: 13, color: "#3c4043" }}>Menus</span>
        </TBtn>

        <Sep />

        <TBtn title="Undo (Ctrl+Z)"  onClick={() => editor?.chain().focus().undo().run()}><Undo size={16} /></TBtn>
        <TBtn title="Redo (Ctrl+Y)"  onClick={() => editor?.chain().focus().redo().run()}><Redo size={16} /></TBtn>
        <TBtn title="Print (Ctrl+P)" onClick={() => window.print()}><Printer size={15} /></TBtn>
        <TBtn title="Spell check"    onClick={() => document.execCommand("spellCheck", false, "")}><SpellCheck size={15} /></TBtn>
        <TBtn title="Clear formatting" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}><PaintBucket size={14} /></TBtn>

        <Sep />

        {/* Zoom (visual only — layout is CSS) */}
        <GSelect value="100%" onChange={() => {}} options={["50%","75%","90%","100%","125%","150%","200%"]} title="Zoom" />

        <Sep />

        {/* Paragraph style */}
        <GSelect value={activeStyle} onChange={setStyle} options={PARAGRAPH_STYLES} title="Paragraph styles" />

        <Sep />

        {/* Font family */}
        <GSelect
          value={activeFontFamily}
          onChange={(v) => (editor as any)?.chain().focus().setFontFamily(v).run()}
          options={FONT_FAMILIES}
          title="Font"
        />

        <Sep />

        {/* Font size */}
        <FontSizeControl
          value={activeFontSize}
          onChange={(v) => (editor as any)?.chain().focus().setFontSize(`${v}pt`).run()}
        />

        <Sep />

        <TBtn active={editor?.isActive("bold")}      onClick={() => editor?.chain().focus().toggleBold().run()}      title="Bold (Ctrl+B)"><Bold size={15} strokeWidth={2.5} /></TBtn>
        <TBtn active={editor?.isActive("italic")}    onClick={() => editor?.chain().focus().toggleItalic().run()}    title="Italic (Ctrl+I)"><Italic size={15} /></TBtn>
        <TBtn active={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)"><Underline size={15} /></TBtn>
        <TBtn active={editor?.isActive("strike")}    onClick={() => editor?.chain().focus().toggleStrike().run()}    title="Strikethrough">
          <span style={{ fontSize: 14, textDecoration: "line-through", fontWeight: 500 }}>S</span>
        </TBtn>

        {/* Text color */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", flexShrink: 0 }} title="Text color">
          <TBtn>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>A</span>
              <div style={{ width: 13, height: 3, backgroundColor: "#ea4335", borderRadius: 1 }} />
            </div>
          </TBtn>
          <input type="color" defaultValue="#ea4335"
            onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
            style={{ position: "absolute", opacity: 0, inset: 0, cursor: "pointer", width: "100%", height: "100%" }} />
        </div>

        {/* Highlight */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", flexShrink: 0 }} title="Highlight color">
          <TBtn>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Pencil size={13} />
              <div style={{ width: 13, height: 3, backgroundColor: "#fbbc04", borderRadius: 1 }} />
            </div>
          </TBtn>
          <input type="color" defaultValue="#fbbc04"
            onChange={(e) => editor?.chain().focus().setMark?.("textStyle", { backgroundColor: e.target.value }).run?.()}
            style={{ position: "absolute", opacity: 0, inset: 0, cursor: "pointer", width: "100%", height: "100%" }} />
        </div>

        <Sep />

        <TBtn title="Insert link"  onClick={() => { const url = prompt("URL"); if (url) editor?.chain().focus().setLink({ href: url }).run(); }}><Link size={15} /></TBtn>
        <TBtn title="Insert image" onClick={() => { const url = prompt("Image URL"); if (url) editor?.chain().focus().insertContent(`<img src="${url}" alt="image" style="max-width:100%"/>`).run(); }}><Image size={15} /></TBtn>

        <Sep />

        <TBtn active={activeAlign === "left"}    onClick={() => setAlign("left")}    title="Align left"><AlignLeft size={15} /></TBtn>
        <TBtn active={activeAlign === "center"}  onClick={() => setAlign("center")}  title="Align center"><AlignCenter size={15} /></TBtn>
        <TBtn active={activeAlign === "right"}   onClick={() => setAlign("right")}   title="Align right"><AlignRight size={15} /></TBtn>
        <TBtn active={activeAlign === "justify"} onClick={() => setAlign("justify")} title="Justify"><AlignJustify size={15} /></TBtn>

        <Sep />

        <TBtn active={editor?.isActive("bulletList")}  onClick={() => editor?.chain().focus().toggleBulletList().run()}       title="Bulleted list"><List size={15} /></TBtn>
        <TBtn active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}      title="Numbered list"><ListOrdered size={15} /></TBtn>
        <TBtn title="Decrease indent" onClick={() => editor?.chain().focus().liftListItem("listItem").run()}><Outdent size={15} /></TBtn>
        <TBtn title="Increase indent" onClick={() => editor?.chain().focus().sinkListItem("listItem").run()}><Indent size={15} /></TBtn>

        <Sep />

        <TBtn title="Clear formatting" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}><RemoveFormatting size={15} /></TBtn>

        <div style={{ flex: 1 }} />

        {/* Editing mode label */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, height: 28, padding: "0 8px", color: "#3c4043", fontSize: 13, fontFamily: "'Google Sans', Arial, sans-serif" }}>
          <Pencil size={13} style={{ color: "#5f6368" }} />
          <span>Editing</span>
        </div>

        {/* Toggle header */}
        <TBtn title={headerVisible ? "Collapse toolbar" : "Expand toolbar"} onClick={() => setHeaderVisible(!headerVisible)} style={{ minWidth: 26 }}>
          {headerVisible ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </TBtn>
      </div>
    </div>
  );
}
