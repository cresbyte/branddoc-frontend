"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Receipt,
  FileCheck,
  BarChart3,
  Mail,
  Briefcase,
  Shield,
  FileText,
  Users,
  Megaphone,
  Sparkles,
  X,
  Eye,
  Palette,
  SlidersHorizontal,
  ArrowUpRight,
  Layers,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useDashboard } from "../components/DashboardContext";

/* ─── Types ─────────────────────────────────────────────────── */
type Industry = "all" | "business" | "legal" | "finance" | "marketing" | "hr";
type SortBy = "popular" | "newest" | "az";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  industry: Industry[];
  color: string;
  accent: string;
  tags: string[];
  popular?: boolean;
  isNew?: boolean;
  isPro?: boolean;
  useCount: number;
  previewLines: { w: number; h: number; indent?: boolean; accent?: boolean }[][];
}

/* ─── Color palettes per category ───────────────────────────── */
const PALETTE: Record<string, { bg: string; accent: string; icon: string; border: string; tag: string; tagText: string }> = {
  invoice: { bg: "#EFF6FF", accent: "#1D4ED8", icon: "#3B82F6", border: "#BFDBFE", tag: "#DBEAFE", tagText: "#1E40AF" },
  quotation: { bg: "#FFFBEB", accent: "#D97706", icon: "#F59E0B", border: "#FDE68A", tag: "#FEF3C7", tagText: "#92400E" },
  sla: { bg: "#F0FDF4", accent: "#15803D", icon: "#22C55E", border: "#BBF7D0", tag: "#DCFCE7", tagText: "#166534" },
  letter: { bg: "#F0F9FF", accent: "#0369A1", icon: "#0EA5E9", border: "#BAE6FD", tag: "#E0F2FE", tagText: "#0C4A6E" },
  report: { bg: "#F5F3FF", accent: "#6D28D9", icon: "#8B5CF6", border: "#DDD6FE", tag: "#EDE9FE", tagText: "#4C1D95" },
  proposal: { bg: "#FFF7ED", accent: "#C2410C", icon: "#F97316", border: "#FED7AA", tag: "#FFEDD5", tagText: "#9A3412" },
  contract: { bg: "#FDF2F8", accent: "#9D174D", icon: "#EC4899", border: "#FBCFE8", tag: "#FCE7F3", tagText: "#831843" },
  hr: { bg: "#F0FDFA", accent: "#0F766E", icon: "#14B8A6", border: "#99F6E4", tag: "#CCFBF1", tagText: "#134E4A" },
  marketing: { bg: "#FFF1F2", accent: "#BE123C", icon: "#F43F5E", border: "#FECDD3", tag: "#FFE4E6", tagText: "#9F1239" },
  finance: { bg: "#F7FEE7", accent: "#3F6212", icon: "#65A30D", border: "#D9F99D", tag: "#ECFCCB", tagText: "#365314" },
};

/* ─── Template data ──────────────────────────────────────────── */
const ALL_TEMPLATES: Template[] = [
  // ... (Data blocks from previous turn)
  { id: "inv-classic", name: "Classic Invoice", description: "Clean, professional invoice layout trusted by thousands of businesses.", category: "Invoice", categoryId: "invoice", industry: ["business", "finance"], color: PALETTE.invoice.bg, accent: PALETTE.invoice.accent, tags: ["billing", "payment", "tax"], popular: true, useCount: 8420, previewLines: [[{ w: 60, h: 6, accent: true }, { w: 30, h: 6 }], [{ w: 80, h: 3 }, { w: 40, h: 3 }], [{ w: 40, h: 3 }], [{ w: 100, h: 1 }], [{ w: 70, h: 3 }, { w: 25, h: 3, accent: true }], [{ w: 65, h: 3 }, { w: 25, h: 3 }], [{ w: 60, h: 3 }, { w: 25, h: 3 }], [{ w: 100, h: 1 }], [{ w: 50, h: 4, accent: true }]] },
  { id: "inv-minimal", name: "Minimal Invoice", description: "Ultra-clean invoice with generous whitespace for modern agencies.", category: "Invoice", categoryId: "invoice", industry: ["business", "marketing"], color: PALETTE.invoice.bg, accent: PALETTE.invoice.accent, tags: ["modern", "minimal", "agency"], isNew: true, useCount: 2140, previewLines: [[{ w: 30, h: 8, accent: true }], [{ w: 90, h: 1 }], [{ w: 55, h: 3 }], [{ w: 80, h: 2 }], [{ w: 100, h: 1 }], [{ w: 70, h: 3 }, { w: 22, h: 3 }], [{ w: 60, h: 3 }, { w: 22, h: 3 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }]] },
  { id: "inv-detailed", name: "Detailed Invoice", description: "Multi-line item invoice with tax breakdown and payment terms.", category: "Invoice", categoryId: "invoice", industry: ["business", "finance"], color: PALETTE.invoice.bg, accent: PALETTE.invoice.accent, tags: ["tax", "detailed", "accounting"], isPro: true, useCount: 3800, previewLines: [[{ w: 50, h: 6, accent: true }, { w: 40, h: 4 }], [{ w: 85, h: 2 }], [{ w: 100, h: 1 }], [{ w: 65, h: 3 }, { w: 22, h: 3 }], [{ w: 60, h: 3 }, { w: 22, h: 3 }], [{ w: 55, h: 3 }, { w: 22, h: 3 }], [{ w: 50, h: 3 }, { w: 22, h: 3 }], [{ w: 100, h: 1 }], [{ w: 45, h: 5, accent: true }]] },
  { id: "quo-standard", name: "Standard Quotation", description: "Professional quotation with itemised pricing and validity period.", category: "Quotation", categoryId: "quotation", industry: ["business", "finance"], color: PALETTE.quotation.bg, accent: PALETTE.quotation.accent, tags: ["pricing", "estimate", "proposal"], popular: true, useCount: 5210, previewLines: [[{ w: 55, h: 6, accent: true }, { w: 35, h: 4 }], [{ w: 75, h: 2 }], [{ w: 100, h: 1 }], [{ w: 68, h: 3 }, { w: 24, h: 3, accent: true }], [{ w: 62, h: 3 }, { w: 24, h: 3 }], [{ w: 58, h: 3 }, { w: 24, h: 3 }], [{ w: 100, h: 1 }], [{ w: 48, h: 4, accent: true }]] },
  { id: "quo-service", name: "Service Quotation", description: "Tailored for service-based businesses with deliverables section.", category: "Quotation", categoryId: "quotation", industry: ["business", "marketing"], color: PALETTE.quotation.bg, accent: PALETTE.quotation.accent, tags: ["services", "deliverables", "scope"], isNew: true, useCount: 1650, previewLines: [[{ w: 45, h: 7, accent: true }], [{ w: 80, h: 2 }], [{ w: 65, h: 2 }], [{ w: 100, h: 1 }], [{ w: 90, h: 3 }], [{ w: 85, h: 3 }], [{ w: 100, h: 1 }], [{ w: 42, h: 5, accent: true }]] },
  { id: "sla-standard", name: "Standard SLA", description: "Service Level Agreement covering uptime, response times and escalation.", category: "SLA", categoryId: "sla", industry: ["business", "legal"], color: PALETTE.sla.bg, accent: PALETTE.sla.accent, tags: ["service", "uptime", "support"], popular: true, useCount: 3100, previewLines: [[{ w: 70, h: 6, accent: true }], [{ w: 85, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }], [{ w: 90, h: 2 }], [{ w: 88, h: 2 }], [{ w: 80, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }]] },
  { id: "sla-it", name: "IT Services SLA", description: "Purpose-built for IT providers with incident severity matrix.", category: "SLA", categoryId: "sla", industry: ["business", "legal"], color: PALETTE.sla.bg, accent: PALETTE.sla.accent, tags: ["IT", "incidents", "severity"], isPro: true, useCount: 1890, previewLines: [[{ w: 60, h: 5, accent: true }], [{ w: 78, h: 2 }], [{ w: 100, h: 1 }], [{ w: 85, h: 2 }], [{ w: 82, h: 2 }], [{ w: 78, h: 2 }], [{ w: 100, h: 1 }], [{ w: 38, h: 4, accent: true }]] },
  { id: "let-business", name: "Business Letter", description: "Formal business correspondence following standard letter format.", category: "Letter", categoryId: "letter", industry: ["business"], color: PALETTE.letter.bg, accent: PALETTE.letter.accent, tags: ["formal", "correspondence", "B2B"], popular: true, useCount: 6700, previewLines: [[{ w: 45, h: 5, accent: true }], [{ w: 55, h: 2 }], [{ w: 50, h: 2 }], [{ w: 100, h: 1 }], [{ w: 92, h: 2 }], [{ w: 88, h: 2 }], [{ w: 84, h: 2 }], [{ w: 60, h: 2 }], [{ w: 35, h: 4, accent: true }]] },
  { id: "let-cover", name: "Cover Letter", description: "Job application cover letter with strong opening paragraph.", category: "Letter", categoryId: "letter", industry: ["hr", "business"], color: PALETTE.letter.bg, accent: PALETTE.letter.accent, tags: ["job", "application", "HR"], useCount: 4200, previewLines: [[{ w: 40, h: 5, accent: true }], [{ w: 60, h: 2 }], [{ w: 100, h: 1 }], [{ w: 90, h: 2 }], [{ w: 85, h: 2 }], [{ w: 80, h: 2 }], [{ w: 70, h: 2 }], [{ w: 40, h: 4, accent: true }]] },
  { id: "rep-executive", name: "Executive Report", description: "Board-ready report with summary, charts placeholder, and insights.", category: "Report", categoryId: "report", industry: ["business", "finance"], color: PALETTE.report.bg, accent: PALETTE.report.accent, tags: ["executive", "board", "summary"], popular: true, isPro: true, useCount: 4500, previewLines: [[{ w: 65, h: 7, accent: true }], [{ w: 80, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }], [{ w: 90, h: 2 }], [{ w: 85, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }]] },
  { id: "rep-project", name: "Project Status Report", description: "Weekly/monthly project update with milestones and blockers.", category: "Report", categoryId: "report", industry: ["business"], color: PALETTE.report.bg, accent: PALETTE.report.accent, tags: ["project", "milestones", "status"], isNew: true, useCount: 2300, previewLines: [[{ w: 55, h: 6, accent: true }], [{ w: 75, h: 2 }], [{ w: 100, h: 1 }], [{ w: 88, h: 2 }], [{ w: 82, h: 2 }], [{ w: 78, h: 2 }], [{ w: 100, h: 1 }], [{ w: 38, h: 4, accent: true }]] },
  { id: "pro-business", name: "Business Proposal", description: "Comprehensive proposal with problem statement, solution and pricing.", category: "Proposal", categoryId: "proposal", industry: ["business", "marketing"], color: PALETTE.proposal.bg, accent: PALETTE.proposal.accent, tags: ["pitch", "solution", "pricing"], popular: true, useCount: 5800, previewLines: [[{ w: 60, h: 7, accent: true }], [{ w: 78, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }], [{ w: 88, h: 2 }], [{ w: 84, h: 2 }], [{ w: 100, h: 1 }], [{ w: 42, h: 4, accent: true }]] },
  { id: "pro-grant", name: "Grant Proposal", description: "Structured grant application with objectives and budget sections.", category: "Proposal", categoryId: "proposal", industry: ["business"], color: PALETTE.proposal.bg, accent: PALETTE.proposal.accent, tags: ["grant", "funding", "NGO"], isPro: true, useCount: 980, previewLines: [[{ w: 50, h: 6, accent: true }], [{ w: 72, h: 2 }], [{ w: 100, h: 1 }], [{ w: 86, h: 2 }], [{ w: 80, h: 2 }], [{ w: 74, h: 2 }], [{ w: 100, h: 1 }], [{ w: 36, h: 4, accent: true }]] },
  { id: "con-freelance", name: "Freelance Contract", description: "Protects both parties with scope, payment and IP clauses.", category: "Contract", categoryId: "contract", industry: ["business", "legal"], color: PALETTE.contract.bg, accent: PALETTE.contract.accent, tags: ["freelance", "IP", "scope"], popular: true, useCount: 7200, previewLines: [[{ w: 65, h: 6, accent: true }], [{ w: 80, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }], [{ w: 88, h: 2 }], [{ w: 84, h: 2 }], [{ w: 80, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }]] },
  { id: "con-nda", name: "NDA Agreement", description: "Mutual non-disclosure agreement for business partnerships.", category: "Contract", categoryId: "contract", industry: ["business", "legal"], color: PALETTE.contract.bg, accent: PALETTE.contract.accent, tags: ["NDA", "confidential", "legal"], useCount: 5400, previewLines: [[{ w: 55, h: 6, accent: true }], [{ w: 75, h: 2 }], [{ w: 100, h: 1 }], [{ w: 86, h: 2 }], [{ w: 80, h: 2 }], [{ w: 74, h: 2 }], [{ w: 100, h: 1 }], [{ w: 36, h: 4, accent: true }]] },
  { id: "hr-offer", name: "Offer Letter", description: "Formal employment offer with compensation and start date.", category: "HR", categoryId: "hr", industry: ["hr", "business"], color: PALETTE.hr.bg, accent: PALETTE.hr.accent, tags: ["employment", "offer", "onboarding"], popular: true, useCount: 4100, previewLines: [[{ w: 50, h: 5, accent: true }], [{ w: 70, h: 2 }], [{ w: 100, h: 1 }], [{ w: 88, h: 2 }], [{ w: 82, h: 2 }], [{ w: 76, h: 2 }], [{ w: 70, h: 2 }], [{ w: 36, h: 4, accent: true }]] },
  { id: "hr-policy", name: "HR Policy Document", description: "Company policy template covering leave, conduct and procedures.", category: "HR", categoryId: "hr", industry: ["hr", "business"], color: PALETTE.hr.bg, accent: PALETTE.hr.accent, tags: ["policy", "conduct", "leave"], isPro: true, useCount: 1700, previewLines: [[{ w: 60, h: 6, accent: true }], [{ w: 78, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }], [{ w: 88, h: 2 }], [{ w: 82, h: 2 }], [{ w: 100, h: 1 }], [{ w: 38, h: 4, accent: true }]] },
  { id: "mkt-brief", name: "Marketing Brief", description: "Campaign brief with objectives, audience, channels and budget.", category: "Marketing", categoryId: "marketing", industry: ["marketing", "business"], color: PALETTE.marketing.bg, accent: PALETTE.marketing.accent, tags: ["campaign", "brief", "strategy"], isNew: true, useCount: 1200, previewLines: [[{ w: 55, h: 6, accent: true }], [{ w: 72, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }], [{ w: 86, h: 2 }], [{ w: 80, h: 2 }], [{ w: 100, h: 1 }], [{ w: 38, h: 4, accent: true }]] },
  { id: "mkt-casestudy", name: "Case Study", description: "Client success story with problem, solution and measurable results.", category: "Marketing", categoryId: "marketing", industry: ["marketing", "business"], color: PALETTE.marketing.bg, accent: PALETTE.marketing.accent, tags: ["case study", "results", "client"], isPro: true, useCount: 890, previewLines: [[{ w: 65, h: 6, accent: true }], [{ w: 80, h: 2 }], [{ w: 100, h: 1 }], [{ w: 88, h: 2 }], [{ w: 82, h: 2 }], [{ w: 76, h: 2 }], [{ w: 100, h: 1 }], [{ w: 40, h: 4, accent: true }]] },
];

const CATEGORIES = [
  { id: "all", label: "All templates", icon: <Layers size={13} />, count: ALL_TEMPLATES.length },
  { id: "invoice", label: "Invoices", icon: <Receipt size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "invoice").length },
  { id: "quotation", label: "Quotations", icon: <FileCheck size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "quotation").length },
  { id: "sla", label: "SLAs", icon: <Shield size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "sla").length },
  { id: "letter", label: "Letters", icon: <Mail size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "letter").length },
  { id: "report", label: "Reports", icon: <BarChart3 size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "report").length },
  { id: "proposal", label: "Proposals", icon: <Briefcase size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "proposal").length },
  { id: "contract", label: "Contracts", icon: <FileText size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "contract").length },
  { id: "hr", label: "HR Documents", icon: <Users size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "hr").length },
  { id: "marketing", label: "Marketing", icon: <Megaphone size={13} />, count: ALL_TEMPLATES.filter(t => t.categoryId === "marketing").length },
];

/* ─── Category Dropdown Component ────────────────────────────── */
function CategoryDropdown({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeCat = CATEGORIES.find((c) => c.id === active) || CATEGORIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          height: 32,
          background: "#fff",
          border: "0.5px solid #E5E7EB",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.15s",
          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ color: "#1D4ED8", display: "flex", alignItems: "center" }}>{activeCat.icon}</div>
        <span style={{ flex: 1, textAlign: "left" }}>{activeCat.label}</span>
        <ChevronDown size={14} style={{ color: "#9CA3AF", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          width: 200,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          zIndex: 50,
          padding: "6px",
          maxHeight: 300,
          overflowY: "auto",
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelect(cat.id);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: isActive ? "#EFF6FF" : "transparent",
                  color: isActive ? "#1D4ED8" : "#4B5563",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ opacity: isActive ? 1 : 0.6 }}>{cat.icon}</div>
                <span style={{ flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 11, color: isActive ? "#1D4ED8" : "#9CA3AF", fontWeight: 500 }}>{cat.count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Template Components ────────────────────────────────────── */
function TemplateCard({ template, onPreview, onUse }: { template: Template; onPreview: (t: Template) => void; onUse: (t: Template) => void; }) {
  const [hovered, setHovered] = useState(false);
  const p = PALETTE[template.categoryId];
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: "#fff", border: `0.5px solid ${hovered ? p.border : "#E5E7EB"}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.15s", boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.06)" : "0 1px 2px rgba(0,0,0,0.02)", transform: hovered ? "translateY(-1px)" : "none", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px", background: p.bg, position: "relative" }}>
        <div style={{ width: "100%", aspectRatio: "3.2/4", background: "#fff", border: `1px solid ${p.border}`, borderRadius: 6, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 3, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.accent, borderRadius: "6px 6px 0 0" }} /><div style={{ height: 4 }} />
          {template.previewLines.map((row, ri) => (<div key={ri} style={{ display: "flex", justifyContent: "space-between", gap: 3, flexShrink: 0 }}>{row.map((seg, si) => (<div key={si} style={{ width: `${seg.w}%`, height: seg.h, borderRadius: 1.5, background: seg.accent ? p.accent : "#E5E7EB", opacity: seg.accent ? 1 : 0.8, flexShrink: 0 }} />))}</div>))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}>
          <button onClick={(e) => { e.stopPropagation(); onPreview(template); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}><Eye size={13} /> Preview</button>
          <button onClick={(e) => { e.stopPropagation(); onUse(template); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: p.accent, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#fff", fontFamily: "inherit" }}>Use <ArrowUpRight size={13} /></button>
        </div>
      </div>
      <div style={{ padding: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{template.name}</div><div style={{ fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{template.useCount} uses</div></div>
        <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4, margin: "0 0 10px 0" }}>{template.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{template.tags.slice(0, 2).map((tag) => (<span key={tag} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: p.tag, color: p.tagText, fontWeight: 500 }}>{tag}</span>))}</div>
      </div>
    </div>
  );
}

function PreviewModal({ template, onClose, onUse }: { template: Template; onClose: () => void; onUse: (t: Template) => void; }) {
  const p = PALETTE[template.categoryId];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 820, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "0.5px solid #E5E7EB" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>{template.name}</div><div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{template.category}</div></div><button onClick={onClose} style={{ width: 32, height: 32, border: "0.5px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}><X size={16} /></button></div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ flex: 1, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, overflow: "auto" }}>
            <div style={{ width: 380, background: "#fff", border: `1px solid ${p.border}`, borderRadius: 8, padding: "24px 20px", position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: p.accent, borderRadius: "8px 8px 0 0" }} /><div style={{ height: 4 }} />{template.previewLines.map((row, ri) => (<div key={ri} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>{row.map((seg, si) => <div key={si} style={{ width: `${seg.w}%`, height: seg.h * 2, borderRadius: 3, background: seg.accent ? p.accent : "#E5E7EB" }} />)}</div>))}</div>
          </div>
          <div style={{ width: 260, borderLeft: "0.5px solid #E5E7EB", padding: "20px", display: "flex", flexDirection: "column", gap: 20, overflow: "auto" }}>
            <div><div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>About</div><p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{template.description}</p></div>
            <div><div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Details</div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{[{ label: "Used by", value: `${template.useCount.toLocaleString()}` }, { label: "Brand support", value: "Full" }, { label: "Plan", value: template.isPro ? "Pro" : "Free" }].map(({ label, value }) => (<div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ fontSize: 12.5, color: "#9CA3AF" }}>{label}</span><span style={{ fontSize: 12.5, color: "#111827", fontWeight: 500 }}>{value}</span></div>))}</div></div>
            <button onClick={() => { onUse(template); onClose(); }} style={{ width: "100%", padding: "10px", marginTop: "auto", background: p.accent, border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>Use Template <ArrowUpRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [showProOnly, setShowProOnly] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const { setHeaderTitle, setSearch, setExtra } = useDashboard();

  // Sync basic header
  useEffect(() => {
    setHeaderTitle("Templates");
    return () => setHeaderTitle("");
  }, [setHeaderTitle]);

  // Sync search
  useEffect(() => {
    setSearch({
      placeholder: "Search templates...",
      value: searchTerm,
      onChange: (v) => setSearchTerm(v),
    });
    return () => setSearch({ value: "" });
  }, [searchTerm, setSearch]);

  // Sync navbar controls (Dropdown + Sort + Pro toggle)
  useEffect(() => {
    setExtra(
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Category Dropdown */}
        <CategoryDropdown active={activeCategory} onSelect={setActiveCategory} />
        
        <div style={{ width: 0.5, height: 16, background: "#E5E7EB", margin: "0 2px" }} />

        {/* Sort select */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal size={14} color="#9CA3AF" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            style={{
              height: 32, padding: "0 10px", border: "0.5px solid #E5E7EB",
              borderRadius: 8, fontSize: 12, background: "#fff",
              color: "#4B5563", cursor: "pointer", fontFamily: "inherit",
              outline: "none",
            }}
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="az">A-Z</option>
          </select>
        </div>

        {/* Pro toggle */}
        <button
          onClick={() => setShowProOnly(!showProOnly)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 32, padding: "0 12px",
            border: `0.5px solid ${showProOnly ? "#F59E0B" : "#E5E7EB"}`,
            borderRadius: 8, cursor: "pointer",
            background: showProOnly ? "#FFFBEB" : "#fff",
            color: showProOnly ? "#92400E" : "#6B7280",
            fontSize: 12, fontWeight: 500, fontFamily: "inherit",
            transition: "all 0.15s",
          }}
        >
          <Sparkles size={13} color={showProOnly ? "#D97706" : "#9CA3AF"} />
          Pro
        </button>
      </div>
    );
    return () => setExtra(null);
  }, [activeCategory, sortBy, showProOnly, setExtra]);

  const filtered = useMemo(() => {
    let list = ALL_TEMPLATES;
    if (activeCategory !== "all") list = list.filter(t => t.categoryId === activeCategory);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
    }
    if (showProOnly) list = list.filter(t => t.isPro);
    if (sortBy === "popular") list = [...list].sort((a, b) => b.useCount - a.useCount);
    else if (sortBy === "newest") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else if (sortBy === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, searchTerm, sortBy, showProOnly]);

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={setPreviewTemplate}
            onUse={(t) => console.log("Use:", t.id)}
          />
        ))}
      </div>
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={(t) => console.log("Use:", t.id)}
        />
      )}
    </div>
  );
}
