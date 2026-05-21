"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Plus,
  ChevronsUpDown,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";
import {
  NAV_WORKSPACE,
  NAV_DOCS,
  NAV_COLLECTIONS,
  NAV_ADMIN,
  NavItem,
} from "./components/NavData";
import { DashboardProvider, useDashboard } from "./components/DashboardContext";
import { useAuth } from "@/lib/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

/* ─── Sub-components ────────────────────────────────────────── */
function SidebarSection({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#9CA3AF",
        padding: "16px 16px 4px",
      }}
    >
      {label}
    </div>
  );
}

function NavLink({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        width: "calc(100% - 16px)",
        padding: "7px 10px",
        margin: "1px 8px",
        borderRadius: 7,
        textDecoration: "none",
        background: active ? "#EFF6FF" : "transparent",
        color: active ? "#1D4ED8" : "#4B5563",
        fontSize: 13.5,
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
        <span
          style={{
            fontSize: 11,
            background: active ? "#DBEAFE" : "#F3F4F6",
            color: active ? "#1D4ED8" : "#6B7280",
            borderRadius: 10,
            padding: "1px 6px",
            fontWeight: 500,
          }}
        >
          {item.count}
        </span>
      )}
    </Link>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { cta, search, headerTitle, extra } = useDashboard();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

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
          {NAV_WORKSPACE.filter(item => item.id !== "admin-templates" || user?.is_staff).map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={pathname === item.href}
            />
          ))}

          <SidebarSection label="Documents" />
          {NAV_DOCS.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={pathname === item.href}
            />
          ))}

          {NAV_COLLECTIONS.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={pathname === item.href}
            />
          ))}

          {NAV_COLLECTIONS.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={pathname === item.href}
            />
          ))}

          {user?.is_staff && (
            <>
              <SidebarSection label="Admin Center" />
              {NAV_ADMIN.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  active={pathname === item.href}
                />
              ))}
            </>
          )}
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
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 10px",
              border: "none",
              borderRadius: 8,
              backgroundColor: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.12s",
              position: "relative",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "#1D4ED8",
                backgroundImage: user?.profile_picture ? `url(${user.profile_picture})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {!user?.profile_picture && userInitial}
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
                {user?.name || "User"}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{user?.email || "Account"}</div>
            </div>
            <ChevronsUpDown size={14} color="#9CA3AF" />

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 4px)",
                left: 8,
                right: 8,
                background: "#FFFFFF",
                border: "0.5px solid #E5E7EB",
                borderRadius: 10,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                padding: "4px",
                zIndex: 100,
                animation: "slideUp 0.15s ease-out",
              }}>
                <Link href="/dashboard/profile" style={{ textDecoration: "none" }}>
                  <button style={dropdownItemStyle} onMouseEnter={hHover} onMouseLeave={lHover}>
                    Profile Settings
                  </button>
                </Link>
                <div style={{ height: "0.5px", background: "#F3F4F6", margin: "4px 0" }} />
                <button 
                  onClick={(e) => { e.stopPropagation(); logout(); }} 
                  style={{ ...dropdownItemStyle, color: "#EF4444" }}
                  onMouseEnter={hHoverRed} onMouseLeave={lHover}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
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
            gap: 16,
            flexShrink: 0,
          }}
        >
          {headerTitle && (
            <div style={{ marginRight: 8, paddingRight: 16, borderRight: "0.5px solid #F3F4F6", height: 24, display: "flex", alignItems: "center" }}>
               <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0, whiteSpace: "nowrap" }}>{headerTitle}</h2>
            </div>
          )}

          {!search.hidden && (
            <div style={{ position: "relative", width: 240, transition: "width 0.2s" }}>
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
                placeholder={search.placeholder}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                style={{
                  width: "100%",
                  height: 32,
                  paddingLeft: 30,
                  paddingRight: 10,
                  border: "0.5px solid #E5E7EB",
                  borderRadius: 7,
                  fontSize: 13,
                  background: "#F9FAFB",
                  color: "#111827",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
              {extra}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <button
                style={{
                  width: 32,
                  height: 32,
                  border: "0.5px solid #E5E7EB",
                  borderRadius: 7,
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6B7280",
                }}
              >
                <Bell size={14} />
              </button>
              
              {cta && (
                <button
                  onClick={cta.onClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    height: 32,
                    padding: "0 12px",
                    background: "#1D4ED8",
                    border: "none",
                    borderRadius: 7,
                    cursor: "pointer",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cta.icon || <Plus size={14} />}
                  {cta.label}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 48px" }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

const dropdownItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "none",
  borderRadius: 6,
  background: "transparent",
  fontSize: 13,
  fontWeight: 500,
  color: "#374151",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "background 0.1s",
};

const hHover = (e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = "#F9FAFB");
const hHoverRed = (e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = "#FEF2F2");
const lHover = (e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = "transparent");

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <DashboardProvider>
        <DashboardContent>{children}</DashboardContent>
      </DashboardProvider>
    </QueryClientProvider>
  );
}
