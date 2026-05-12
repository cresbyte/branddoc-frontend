import { Block, BlockType, sampleBrand } from "./types";
import {
  Type,
  Heading2,
  AlignLeft,
  List,
  ListOrdered,
  Quote,
  Minus,
  MoveVertical,
  Columns,
  Table as TableIcon,
  Image as ImageIcon,
  Square,
  PenTool,
  Palette,
  Stamp,
} from "lucide-react";

export const initialBlocks: Block[] = [
  {
    id: "b1",
    type: "heading",
    content: { text: "Project Proposal" },
    style: { fontSize: 28, fontWeight: 600, color: "#1a1a1a", textAlign: "center" },
  },
  {
    id: "b2",
    type: "paragraph",
    content: { text: "Dear Bright & Co., thank you for considering Acme Studio for your upcoming project. Below you will find our detailed proposal outlining scope, deliverables, and investment." },
    style: { fontSize: 14, color: "#444444", lineHeight: 1.7 },
  },
  {
    id: "b3",
    type: "divider",
    content: {},
    style: { color: "#e5e5e5", thickness: 1, width: "100%" },
  },
  {
    id: "b4",
    type: "two-columns",
    content: {
      left: {
        heading: "Scope of work",
        items: ["Brand identity design", "Website UI mockups", "Brand guidelines document"],
      },
      right: {
        heading: "Timeline",
        items: ["Week 1–2: Discovery", "Week 3–5: Design", "Week 6: Delivery"],
      },
    },
    style: { split: "50/50", gap: 24 },
  },
  {
    id: "b5",
    type: "spacer",
    content: {},
    style: { height: 24 },
  },
  {
    id: "b6",
    type: "table",
    content: {
      headers: ["Description", "Qty", "Amount"],
      rows: [
        ["Brand identity design", "1", "$1,200"],
        ["Website UI mockups", "3", "$1,050"],
        ["Brand guidelines", "1", "$800"],
      ],
      totalsRow: "Total: $3,050",
    },
    style: { headerBg: "#f5f5f5", alternating: true, borderStyle: "light" },
  },
  {
    id: "b7",
    type: "paragraph",
    content: { text: "Payment is due within 30 days of invoice. Bank transfer details will be provided separately." },
    style: { fontSize: 14, color: "#444444", lineHeight: 1.7 },
  },
  {
    id: "b8",
    type: "signature",
    content: { closing: "Sincerely,", name: "Jane Doe", title: "Acme Studio", email: "hello@acme.com" },
    style: { showLine: true, lineStyle: "blank" },
  },
];

export const BLOCK_CATEGORIES = [
  {
    name: "Text",
    items: [
      { type: "heading", label: "Heading", icon: Type },
      { type: "subheading", label: "Subheading", icon: Heading2 },
      { type: "paragraph", label: "Paragraph", icon: AlignLeft },
      { type: "bullet-list", label: "Bullet list", icon: List },
      { type: "numbered-list", label: "Numbered list", icon: ListOrdered },
      { type: "blockquote", label: "Blockquote", icon: Quote },
    ]
  },
  {
    name: "Structure",
    items: [
      { type: "divider", label: "Divider", icon: Minus },
      { type: "spacer", label: "Spacer", icon: MoveVertical },
      { type: "two-columns", label: "Two columns", icon: Columns },
      { type: "three-columns", label: "Three columns", icon: Columns },
    ]
  },
  {
    name: "Content",
    items: [
      { type: "table", label: "Table", icon: TableIcon },
      { type: "image-placeholder", label: "Image placeholder", icon: ImageIcon },
      { type: "button", label: "Button / CTA", icon: Square },
      { type: "signature", label: "Signature block", icon: PenTool },
    ]
  },
  {
    name: "Brand blocks (locked to brand)",
    items: [
      { type: "brand-color-bar", label: "Brand color bar", icon: Palette },
      { type: "company-stamp", label: "Company stamp", icon: Stamp },
    ]
  }
];

export const getDefaultForType = (type: BlockType): { content: any, style: any } => {
  switch (type) {
    case "heading": return { content: { text: "New Heading" }, style: { fontSize: 28, fontWeight: 600, color: "#1a1a1a", textAlign: "left" } };
    case "subheading": return { content: { text: "New Subheading" }, style: { fontSize: 20, fontWeight: 500, color: "#1a1a1a", textAlign: "left" } };
    case "paragraph": return { content: { text: "Start typing..." }, style: { fontSize: 14, color: "#444444", lineHeight: 1.7 } };
    case "bullet-list": return { content: { items: ["Item 1", "Item 2"] }, style: { listStyleType: "disc", fontSize: 14, color: "#444444" } };
    case "numbered-list": return { content: { items: ["Item 1", "Item 2"] }, style: { listStyleType: "decimal", fontSize: 14, color: "#444444" } };
    case "blockquote": return { content: { text: "Quote text..." }, style: { fontSize: 14, fontStyle: "italic", color: "#666666" } };
    case "divider": return { content: {}, style: { color: "#e5e5e5", thickness: 1, width: "100%", style: "solid" } };
    case "spacer": return { content: {}, style: { height: 40 } };
    case "two-columns": return { content: { left: { heading: "", items: [] }, right: { heading: "", items: [] } }, style: { split: "50/50", gap: 24 } };
    case "three-columns": return { content: { col1: "", col2: "", col3: "" }, style: { gap: 24 } };
    case "table": return { content: { headers: ["H1", "H2", "H3"], rows: [["", "", ""]], totalsRow: "" }, style: { headerBg: "#f5f5f5", alternating: true, borderStyle: "light" } };
    case "image-placeholder": return { content: {}, style: {} };
    case "button": return { content: { text: "Click here" }, style: { bgColor: sampleBrand.primaryColor, color: "#ffffff" } };
    case "signature": return { content: { closing: "Sincerely,", name: "", title: "", email: "" }, style: { showLine: true, lineStyle: "blank" } };
    case "brand-color-bar": return { content: {}, style: { color: "primary", height: 4 } };
    case "company-stamp": return { content: {}, style: { size: 80 } };
    default: return { content: {}, style: {} };
  }
};

export interface TableStyle {
  id: string;
  name: string;
  group: string;
  headerBg: string;
  headerColor: string;
  altRowBg: string;
  borderColor: string;
  outerBorderColor: string;
  accentLeft?: string; // colored left border on first column
}

/** Inspired by Word's built-in table style gallery */
export const TABLE_STYLES: TableStyle[] = [
  // ── Plain Tables ─────────────────────────────────────────────────
  {
    id: "plain-none",
    name: "Plain (no borders)",
    group: "Plain Tables",
    headerBg: "transparent",
    headerColor: "#1a1a1a",
    altRowBg: "transparent",
    borderColor: "transparent",
    outerBorderColor: "transparent",
  },
  {
    id: "plain-1",
    name: "Plain Table 1",
    group: "Plain Tables",
    headerBg: "transparent",
    headerColor: "#1a1a1a",
    altRowBg: "transparent",
    borderColor: "#d1d5db",
    outerBorderColor: "transparent",
  },
  {
    id: "plain-2",
    name: "Plain Table 2",
    group: "Plain Tables",
    headerBg: "#f3f4f6",
    headerColor: "#1a1a1a",
    altRowBg: "transparent",
    borderColor: "transparent",
    outerBorderColor: "transparent",
  },
  // ── Grid Tables ───────────────────────────────────────────────────
  {
    id: "grid-dark",
    name: "Grid Table (Dark)",
    group: "Grid Tables",
    headerBg: "#1a1a1a",
    headerColor: "#ffffff",
    altRowBg: "transparent",
    borderColor: "#1a1a1a",
    outerBorderColor: "#1a1a1a",
  },
  {
    id: "grid-blue",
    name: "Grid Table (Blue)",
    group: "Grid Tables",
    headerBg: "#1e3a8a",
    headerColor: "#ffffff",
    altRowBg: "#eff6ff",
    borderColor: "#bfdbfe",
    outerBorderColor: "#1e3a8a",
  },
  {
    id: "grid-green",
    name: "Grid Table (Green)",
    group: "Grid Tables",
    headerBg: "#14532d",
    headerColor: "#ffffff",
    altRowBg: "#f0fdf4",
    borderColor: "#bbf7d0",
    outerBorderColor: "#14532d",
  },
  {
    id: "grid-orange",
    name: "Grid Table (Orange)",
    group: "Grid Tables",
    headerBg: "#7c2d12",
    headerColor: "#ffffff",
    altRowBg: "#fff7ed",
    borderColor: "#fed7aa",
    outerBorderColor: "#7c2d12",
  },
  // ── List Tables ───────────────────────────────────────────────────
  {
    id: "list-light",
    name: "List Table (Light)",
    group: "List Tables",
    headerBg: "#f8fafc",
    headerColor: "#1a1a1a",
    altRowBg: "#f1f5f9",
    borderColor: "transparent",
    outerBorderColor: "transparent",
  },
  {
    id: "list-blue",
    name: "List Table (Blue)",
    group: "List Tables",
    headerBg: "#dbeafe",
    headerColor: "#1e3a8a",
    altRowBg: "#f0f9ff",
    borderColor: "transparent",
    outerBorderColor: "transparent",
    accentLeft: "#3b82f6",
  },
  {
    id: "list-green",
    name: "List Table (Green)",
    group: "List Tables",
    headerBg: "#dcfce7",
    headerColor: "#14532d",
    altRowBg: "#f0fdf4",
    borderColor: "transparent",
    outerBorderColor: "transparent",
    accentLeft: "#22c55e",
  },
  {
    id: "list-amber",
    name: "List Table (Amber)",
    group: "List Tables",
    headerBg: "#fef3c7",
    headerColor: "#78350f",
    altRowBg: "#fffbeb",
    borderColor: "transparent",
    outerBorderColor: "transparent",
    accentLeft: "#f59e0b",
  },
];

export interface MarginPreset {
  id: string;
  name: string;
  label: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Standard Word page margin presets (in px at 96dpi; 1 inch = 96px) */
export const MARGIN_PRESETS: MarginPreset[] = [
  { id: "normal",   name: "Normal",   label: "Top/Bottom 1" + '\u2033' + " · Left/Right 1" + '\u2033',   top: 96,  right: 96,  bottom: 96,  left: 96  },
  { id: "narrow",   name: "Narrow",   label: "All 0.5" + '\u2033',                                          top: 48,  right: 48,  bottom: 48,  left: 48  },
  { id: "moderate", name: "Moderate", label: "Top/Bottom 1" + '\u2033' + " · Left/Right 0.75" + '\u2033',  top: 96,  right: 72,  bottom: 96,  left: 72  },
  { id: "wide",     name: "Wide",     label: "Top/Bottom 1" + '\u2033' + " · Left/Right 2" + '\u2033',     top: 96,  right: 192, bottom: 96,  left: 192 },
  { id: "mirrored", name: "Mirrored", label: "Outer 1" + '\u2033' + " · Inner 1.25" + '\u2033',            top: 96,  right: 96,  bottom: 96,  left: 120 },
  { id: "office07", name: "Office 2003 Default", label: "Top/Bottom 1" + '\u2033' + " · Left/Right 1.25" + '\u2033', top: 96, right: 120, bottom: 96, left: 120 },
];
