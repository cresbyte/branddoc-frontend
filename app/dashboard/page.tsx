"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Files,
  LayoutTemplate,
  Palette,
  Receipt,
  FileText,
  BarChart3,
  Mail,
  Building2,
  User,
  Plus,
  Settings,
  ChevronsUpDown,
  Bell,
  Search,
  TrendingUp,
  MoreVertical,
  FileCheck,
  FilePlus,
  Briefcase,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react"

/* ─── Types ────────────────────────────────────────────────── */
interface NavItem {
  icon: React.ReactNode;
  label: string;
  count?: number;
  id: string;
}

interface TemplateCard {
  icon: React.ReactNode;
  label: string;
  styles: number;
  color: string;
  badge?: "popular" | "new";
  id: string;
}

interface DocRow {
  name: string;
  date: string;
  type: "invoice" | "quotation" | "letter" | "report" | "draft";
  id: string;
}

/* ─── Data ─────────────────────────────────────────────────── */
const NAV_WORKSPACE: NavItem[] = [
  { icon: <LayoutDashboard size={15} />, label: "Dashboard", id: "dashboard" },
  { icon: <Files size={15} />, label: "My Documents", count: 24, id: "docs" },
  { icon: <LayoutTemplate size={15} />, label: "Templates", count: 80, id: "templates" },
  { icon: <Palette size={15} />, label: "My Brand", id: "brand" },
];

const NAV_DOCS: NavItem[] = [
  { icon: <Receipt size={15} />, label: "Invoices", count: 6, id: "invoices" },
  { icon: <FileCheck size={15} />, label: "Quotations", count: 4, id: "quotations" },
  { icon: <BarChart3 size={15} />, label: "Reports", count: 3, id: "reports" },
  { icon: <Mail size={15} />, label: "Letters", count: 2, id: "letters" },
];

const NAV_COLLECTIONS: NavItem[] = [
  { icon: <Building2 size={15} />, label: "Acme Corp", id: "acme" },
  { icon: <User size={15} />, label: "Personal", id: "personal" },
];

const TEMPLATES: TemplateCard[] = [
  {
    icon: <Receipt size={18} />,
    label: "Invoice",
    styles: 6,
    color: "blue",
    badge: "popular",
    id: "invoice",
  },
  {
    icon: <FileCheck size={18} />,
    label: "Quotation",
    styles: 4,
    color: "amber",
    id: "quotation",
  },
  {
    icon: <Mail size={18} />,
    label: "Business letter",
    styles: 5,
    color: "teal",
    id: "letter",
  },
  {
    icon: <BarChart3 size={18} />,
    label: "Report",
    styles: 3,
    color: "purple",
    badge: "new",
    id: "report",
  },
  {
    icon: <Briefcase size={18} />,
    label: "Proposal",
    styles: 4,
    color: "coral",
    id: "proposal",
  },
  {
    icon: <FilePlus size={18} />,
    label: "Blank doc",
    styles: 0,
    color: "neutral",
    id: "blank",
  },
];

const DOCS: DocRow[] = [
  { name: "Invoice_1241B_Balance_Shipping", date: "Today, 2:14 pm", type: "invoice", id: "d1" },
  { name: "Quotation_WebDesign_Client03", date: "Yesterday", type: "quotation", id: "d2" },
  { name: "Cover_Letter_TechRole", date: "2 days ago", type: "letter", id: "d3" },
  { name: "Q3_Performance_Report_2024", date: "4 days ago", type: "report", id: "d4" },
  { name: "Draft_Partnership_Proposal", date: "1 week ago", type: "draft", id: "d5" },
];

/* ─── Style helpers ─────────────────────────────────────────── */
const TEMPLATE_COLORS: Record<string, { bg: string; icon: string; border: string }> = {
  blue:    { bg: "#EFF6FF", icon: "#1D4ED8", border: "#BFDBFE" },
  amber:   { bg: "#FFFBEB", icon: "#B45309", border: "#FDE68A" },
  teal:    { bg: "#F0FDFA", icon: "#0F766E", border: "#99F6E4" },
  purple:  { bg: "#F5F3FF", icon: "#6D28D9", border: "#DDD6FE" },
  coral:   { bg: "#FFF7ED", icon: "#C2410C", border: "#FED7AA" },
  neutral: { bg: "#F9FAFB", icon: "#6B7280", border: "#E5E7EB" },
};

const DOC_TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  invoice:   { bg: "#ECFDF5", color: "#065F46", label: "Invoice" },
  quotation: { bg: "#FFFBEB", color: "#78350F", label: "Quotation" },
  letter:    { bg: "#EFF6FF", color: "#1E3A8A", label: "Letter" },
  report:    { bg: "#F5F3FF", color: "#4C1D95", label: "Report" },
  draft:     { bg: "#F3F4F6", color: "#374151", label: "Draft" },
};

const DOC_ICON_COLOR: Record<string, string> = {
  invoice: "#059669", quotation: "#D97706", letter: "#2563EB",
  report: "#7C3AED", draft: "#9CA3AF",
};

/* ─── Sub-components ────────────────────────────────────────── */
function SidebarSection({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "#9CA3AF",
      padding: "16px 16px 4px",
    }}>
      {label}
    </div>
  );
}

function NavLink({
  item, active, onClick,
}: { item: NavItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        width: "100%", padding: "7px 10px", margin: "1px 8px",
        width: "calc(100% - 16px)",
        border: "none", borderRadius: 7, cursor: "pointer",
        background: active ? "#EFF6FF" : "transparent",
        color: active ? "#1D4ED8" : "#4B5563",
        fontSize: 13.5, textAlign: "left",
        transition: "background 0.12s, color 0.12s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "#F9FAFB";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{item.icon}</span>
      <span style={{ flex: 1, fontWeight: active ? 500 : 400 }}>{item.label}</span>
      {item.count !== undefined && (
        <span style={{
          fontSize: 11, background: active ? "#DBEAFE" : "#F3F4F6",
          color: active ? "#1D4ED8" : "#6B7280",
          borderRadius: 10, padding: "1px 6px", fontWeight: 500,
        }}>
          {item.count}
        </span>
      )}
    </button>
  );
}

function StatCard({
  label, value, sub, subColor,
}: { label: string; value: string; sub: string; subColor?: string }) {
  return (
    <div style={{
      background: "#F9FAFB", borderRadius: 10, padding: "14px 16px",
      border: "0.5px solid #F3F4F6",
    }}>
      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 5, fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: subColor || "#6B7280", marginTop: 3 }}>{sub}</div>
    </div>
  );
}

function TemplateCardUI({ card }: { card: TemplateCard }) {
  const [hovered, setHovered] = useState(false);
  const c = TEMPLATE_COLORS[card.color];
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: `0.5px solid ${hovered ? c.border : "#E5E7EB"}`,
        borderRadius: 12, padding: "16px 14px", cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 9, background: c.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 12, color: c.icon,
        border: `0.5px solid ${c.border}`,
      }}>
        {card.icon}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: "#111827", marginBottom: 2 }}>
        {card.label}
      </div>
      <div style={{ fontSize: 12, color: "#9CA3AF" }}>
        {card.styles > 0 ? `${card.styles} styles` : "Start fresh"}
      </div>
      {card.badge && (
        <div style={{
          display: "inline-block", marginTop: 8, fontSize: 10, fontWeight: 600,
          padding: "2px 7px", borderRadius: 4,
          background: card.badge === "popular" ? "#ECFDF5" : "#EFF6FF",
          color: card.badge === "popular" ? "#065F46" : "#1D4ED8",
          letterSpacing: "0.04em", textTransform: "uppercase",
        }}>
          {card.badge === "popular" ? "Popular" : "New"}
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#F9FAFB",
        fontFamily: "'DM Sans', 'Geist', system-ui, sans-serif",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 232,
          flexShrink: 0,
          background: "#FFFFFF",
          borderRight: "0.5px solid #E5E7EB",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "18px 16px 14px",
            borderBottom: "0.5px solid #F3F4F6",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={15} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.01em",
            }}
          >
            DocCraft
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: "#EFF6FF",
              color: "#1D4ED8",
              borderRadius: 4,
              padding: "2px 5px",
              marginLeft: 2,
            }}
          >
            Beta
          </span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1 }}>
          <SidebarSection label="Workspace" />
          {NAV_WORKSPACE.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={activeNav === item.id}
              onClick={() => setActiveNav(item.id)}
            />
          ))}

          <SidebarSection label="Documents" />
          {NAV_DOCS.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={activeNav === item.id}
              onClick={() => setActiveNav(item.id)}
            />
          ))}

          <SidebarSection label="Collections" />
          {NAV_COLLECTIONS.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={activeNav === item.id}
              onClick={() => setActiveNav(item.id)}
            />
          ))}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              width: "calc(100% - 16px)",
              margin: "1px 8px",
              padding: "7px 10px",
              border: "none",
              borderRadius: 7,
              background: "transparent",
              cursor: "pointer",
              color: "#2563EB",
              fontSize: 13.5,
              fontFamily: "inherit",
            }}
          >
            <Plus size={15} />
            <span>New collection</span>
          </button>
        </div>

        {/* User */}
        <div
          style={{ padding: "8px 8px 12px", borderTop: "0.5px solid #F3F4F6" }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 10px",
              border: "none",
              borderRadius: 8,
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#1D4ED8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              DM
            </div>
            <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#111827",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Devrizal M.
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Free plan</div>
            </div>
            <ChevronsUpDown size={14} color="#9CA3AF" />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            height: 52,
            background: "#FFFFFF",
            borderBottom: "0.5px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9CA3AF",
              }}
            />
            <input
              placeholder="Search documents, templates…"
              style={{
                width: "100%",
                height: 34,
                paddingLeft: 32,
                paddingRight: 12,
                border: "0.5px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 13.5,
                background: "#F9FAFB",
                color: "#111827",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginLeft: "auto",
            }}
          >
            <button
              style={{
                width: 34,
                height: 34,
                border: "0.5px solid #E5E7EB",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6B7280",
              }}
            >
              <Bell size={15} />
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 34,
                padding: "0 14px",
                background: "#1D4ED8",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            >
              <Plus size={14} />
              New document
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 48px" }}>
          {/* Page heading */}
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#111827",
                letterSpacing: "-0.02em",
                marginBottom: 3,
              }}
            >
              Good morning, Devrizal 👋
            </h1>
            <p style={{ fontSize: 13.5, color: "#6B7280" }}>
              Here's what's happening with your documents today.
            </p>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <StatCard
              label="Total documents"
              value="24"
              sub="↑ 4 this month"
              subColor="#059669"
            />
            <StatCard
              label="Templates used"
              value="11"
              sub="Across 3 categories"
            />
            <StatCard
              label="Brand kit"
              value="Acme Corp"
              sub="Applied to 18 documents"
              subColor="#2563EB"
            />
          </div>

          {/* Brand banner */}
          <div
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #E5E7EB",
              borderRadius: 12,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "#EFF6FF",
                border: "0.5px solid #BFDBFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1D4ED8",
                flexShrink: 0,
              }}
            >
              <Palette size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#111827",
                  marginBottom: 2,
                }}
              >
                Your brand kit is active
              </div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                New documents automatically use your Acme Corp letterhead and
                footer.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                borderRadius: 8,
                background: "#F9FAFB",
                border: "0.5px solid #E5E7EB",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#1D4ED8",
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                Acme Corp
              </span>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 13px",
                border: "0.5px solid #E5E7EB",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
                fontSize: 13,
                color: "#374151",
                fontFamily: "inherit",
                flexShrink: 0,
              }}
            >
              Edit brand
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Upgrade nudge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: 10,
              background: "#FFFBEB",
              border: "0.5px solid #FDE68A",
              marginBottom: 28,
            }}
          >
            <Sparkles size={15} color="#D97706" />
            <span style={{ fontSize: 13, color: "#78350F", flex: 1 }}>
              Unlock unlimited templates and custom brand colors with DocCraft
              Pro.
            </span>
            <button
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#B45309",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textDecoration: "underline",
              }}
            >
              Try Pro free →
            </button>
          </div>

          {/* Templates */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
              Start from a template
            </h2>
            <button
              style={{
                fontSize: 13,
                color: "#2563EB",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              See all templates →
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 10,
              marginBottom: 32,
            }}
          >
            {TEMPLATES.map((card) => (
              <TemplateCardUI key={card.id} card={card} />
            ))}
          </div>

          {/* Recent docs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
              Recent documents
            </h2>
            <button
              style={{
                fontSize: 13,
                color: "#2563EB",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              See all →
            </button>
          </div>
          <div
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #E5E7EB",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 110px 44px",
                padding: "8px 16px",
                borderBottom: "0.5px solid #F3F4F6",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#9CA3AF",
              }}
            >
              <span>File name</span>
              <span>Date</span>
              <span>Type</span>
              <span />
            </div>

            {DOCS.map((doc, i) => {
              const ts = DOC_TYPE_STYLES[doc.type]
              const ic = DOC_ICON_COLOR[doc.type]
              return (
                <div
                  key={doc.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 140px 110px 44px",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderTop: i > 0 ? "0.5px solid #F9FAFB" : undefined,
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F9FAFB")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 9 }}
                  >
                    <FileText size={15} color={ic} style={{ flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: 13.5,
                        color: "#111827",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {doc.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>
                    {doc.date}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 11.5,
                      fontWeight: 500,
                      padding: "3px 9px",
                      borderRadius: 5,
                      background: ts.bg,
                      color: ts.color,
                      width: "fit-content",
                    }}
                  >
                    {ts.label}
                  </span>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9CA3AF",
                        padding: 4,
                        borderRadius: 5,
                        display: "flex",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#F3F4F6"
                        e.currentTarget.style.color = "#374151"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "none"
                        e.currentTarget.style.color = "#9CA3AF"
                      }}
                    >
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
