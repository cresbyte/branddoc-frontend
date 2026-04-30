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
