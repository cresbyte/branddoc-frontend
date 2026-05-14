"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Editor } from "@tiptap/react";

/* ── types ──────────────────────────────────────────────── */
interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface MenuDef {
  label: string;
  items: MenuItem[];
}

/* ── single dropdown ────────────────────────────────────── */
function Dropdown({ label, items, open, onOpen, onClose }: {
  label: string;
  items: MenuItem[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onMouseDown={(e) => { e.preventDefault(); open ? onClose() : onOpen(); }}
        style={{
          height: 26, padding: "0 8px", border: "none", borderRadius: 4,
          background: open ? "#e8eaed" : "transparent", cursor: "pointer",
          color: "#3c4043", fontSize: 13,
          fontFamily: "'Google Sans', Arial, sans-serif",
        }}
        onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "#f1f3f4"; }}
        onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        {label}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, zIndex: 200,
          backgroundColor: "#fff", border: "1px solid #e0e0e0",
          borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          minWidth: 220, paddingTop: 4, paddingBottom: 4,
        }}>
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} style={{ height: 1, backgroundColor: "#e0e0e0", margin: "4px 0" }} />
            ) : (
              <button
                key={i}
                disabled={item.disabled}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (!item.disabled && item.action) {
                    item.action();
                    onClose();
                  }
                }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "5px 16px", border: "none", textAlign: "left",
                  background: "transparent", cursor: item.disabled ? "default" : "pointer",
                  color: item.disabled ? "#bdbdbd" : "#3c4043", fontSize: 13,
                  fontFamily: "'Google Sans', Arial, sans-serif", gap: 24,
                }}
                onMouseEnter={(e) => {
                  if (!item.disabled) (e.currentTarget as HTMLElement).style.background = "#f1f3f4";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span style={{ color: "#9aa0a6", fontSize: 12, whiteSpace: "nowrap" }}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ── word-count modal ────────────────────────────────────── */
function WordCountModal({ html, onClose }: { html: string; onClose: () => void }) {
  const text  = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseDown={onClose}>
      <div style={{ background: "#fff", borderRadius: 10, padding: "28px 36px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", minWidth: 280 }}
        onMouseDown={(e) => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#202124" }}>Word count</h3>
        {[
          ["Words", words],
          ["Characters (no spaces)", charsNoSpaces],
          ["Characters (with spaces)", chars],
        ].map(([label, val]) => (
          <div key={label as string} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#3c4043" }}>
            <span>{label}</span>
            <strong>{val}</strong>
          </div>
        ))}
        <button onClick={onClose} style={{ marginTop: 16, padding: "8px 20px", background: "#1a73e8", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
          Close
        </button>
      </div>
    </div>
  );
}

/* ── find bar ────────────────────────────────────────────── */
export function FindBar({ onClose }: { onClose: () => void }) {
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const find = useCallback((direction: "next" | "prev" = "next") => {
    if (!term) return;
    // Use the browser's native find for simplicity
    if ((window as any).find) {
      (window as any).find(term, false, direction === "prev", true, false, true, false);
    }
  }, [term]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "#fff", borderBottom: "1px solid #e0e0e0", flexShrink: 0 }}>
      <input
        ref={inputRef}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") find(e.shiftKey ? "prev" : "next");
          if (e.key === "Escape") onClose();
        }}
        placeholder="Find in document"
        style={{ height: 26, padding: "0 8px", border: "1px solid #dadce0", borderRadius: 4, fontSize: 13, fontFamily: "'Google Sans', Arial, sans-serif", outline: "none", width: 200 }}
      />
      <button onMouseDown={() => find("prev")} title="Previous" style={btnS}>▲</button>
      <button onMouseDown={() => find("next")} title="Next"     style={btnS}>▼</button>
      <button onMouseDown={onClose} title="Close" style={{ ...btnS, marginLeft: 4, color: "#5f6368" }}>✕</button>
    </div>
  );
}

const btnS: React.CSSProperties = { height: 26, width: 26, border: "1px solid #dadce0", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" };

/* ── main EditorMenuBar ──────────────────────────────────── */
export interface MenuBarProps {
  editor: Editor | null;
  docHtml: string;
  onShowFind: () => void;
}

export function EditorMenuBar({ editor, docHtml, onShowFind }: MenuBarProps) {
  const [openMenu,       setOpenMenu]       = useState<string | null>(null);
  const [showWordCount,  setShowWordCount]  = useState(false);

  const close = useCallback(() => setOpenMenu(null), []);

  const cmd = (fn: () => void) => () => { fn(); };

  const menus: MenuDef[] = [
    {
      label: "File",
      items: [
        { label: "New document", shortcut: "Ctrl+N", action: cmd(() => window.open(window.location.href, "_blank")) },
        { divider: true } as MenuItem,
        { label: "Print…", shortcut: "Ctrl+P", action: cmd(() => window.print()) },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Undo",       shortcut: "Ctrl+Z",   action: cmd(() => editor?.chain().focus().undo().run()) },
        { label: "Redo",       shortcut: "Ctrl+Y",   action: cmd(() => editor?.chain().focus().redo().run()) },
        { divider: true } as MenuItem,
        { label: "Select all", shortcut: "Ctrl+A",   action: cmd(() => editor?.chain().focus().selectAll().run()) },
        { divider: true } as MenuItem,
        { label: "Find…",      shortcut: "Ctrl+F",   action: cmd(onShowFind) },
      ],
    },
    {
      label: "View",
      items: [
        { label: "Compact toolbar", action: cmd(() => {}) },
        { divider: true } as MenuItem,
        { label: "Zoom in",  shortcut: "Ctrl++", action: cmd(() => {}) },
        { label: "Zoom out", shortcut: "Ctrl+-", action: cmd(() => {}) },
      ],
    },
    {
      label: "Insert",
      items: [
        { label: "Heading 1", action: cmd(() => editor?.chain().focus().toggleHeading({ level: 1 }).run()) },
        { label: "Heading 2", action: cmd(() => editor?.chain().focus().toggleHeading({ level: 2 }).run()) },
        { label: "Heading 3", action: cmd(() => editor?.chain().focus().toggleHeading({ level: 3 }).run()) },
        { divider: true } as MenuItem,
        { label: "Bulleted list",  action: cmd(() => editor?.chain().focus().toggleBulletList().run()) },
        { label: "Numbered list",  action: cmd(() => editor?.chain().focus().toggleOrderedList().run()) },
        { divider: true } as MenuItem,
        { label: "Blockquote",     action: cmd(() => editor?.chain().focus().toggleBlockquote().run()) },
        { label: "Horizontal rule",action: cmd(() => editor?.chain().focus().setHorizontalRule().run()) },
        { label: "Hard break",     action: cmd(() => editor?.chain().focus().setHardBreak().run()) },
      ],
    },
    {
      label: "Format",
      items: [
        { label: "Bold",          shortcut: "Ctrl+B", action: cmd(() => editor?.chain().focus().toggleBold().run()) },
        { label: "Italic",        shortcut: "Ctrl+I", action: cmd(() => editor?.chain().focus().toggleItalic().run()) },
        { label: "Underline",     shortcut: "Ctrl+U", action: cmd(() => editor?.chain().focus().toggleUnderline().run()) },
        { label: "Strikethrough", action: cmd(() => editor?.chain().focus().toggleStrike().run()) },
        { divider: true } as MenuItem,
        { label: "Align left",   action: cmd(() => editor?.chain().focus().setTextAlign("left").run()) },
        { label: "Align center", action: cmd(() => editor?.chain().focus().setTextAlign("center").run()) },
        { label: "Align right",  action: cmd(() => editor?.chain().focus().setTextAlign("right").run()) },
        { label: "Justify",      action: cmd(() => editor?.chain().focus().setTextAlign("justify").run()) },
        { divider: true } as MenuItem,
        { label: "Clear formatting", shortcut: "Ctrl+\\", action: cmd(() => editor?.chain().focus().clearNodes().unsetAllMarks().run()) },
      ],
    },
    {
      label: "Tools",
      items: [
        { label: "Word count…",  action: cmd(() => setShowWordCount(true)) },
        { label: "Find in document…", shortcut: "Ctrl+F", action: cmd(onShowFind) },
        { divider: true } as MenuItem,
        { label: "Spell check",  action: cmd(() => { document.execCommand("spellCheck", false, "") }) },
      ],
    },
    {
      label: "Extensions",
      items: [
        { label: "No extensions installed", disabled: true },
      ],
    },
    {
      label: "Help",
      items: [
        { label: "Keyboard shortcuts", shortcut: "Ctrl+?", disabled: true },
        { label: "About BrandDoc",     action: cmd(() => alert("BrandDoc v1.0 – a clean document editor.")) },
      ],
    },
  ];

  return (
    <>
      <div style={{ height: 30, backgroundColor: "#fff", display: "flex", alignItems: "center", padding: "0 10px", gap: 0, flexShrink: 0 }}>
        {menus.map((m) => (
          <Dropdown
            key={m.label}
            label={m.label}
            items={m.items}
            open={openMenu === m.label}
            onOpen={() => setOpenMenu(m.label)}
            onClose={close}
          />
        ))}
      </div>

      {showWordCount && (
        <WordCountModal html={docHtml} onClose={() => setShowWordCount(false)} />
      )}
    </>
  );
}
