import React from "react";
import {
  LayoutDashboard,
  Files,
  LayoutTemplate,
  Palette,
  Receipt,
  FileCheck,
  BarChart3,
  Mail,
  Building2,
  User,
} from "lucide-react";

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  count?: number;
  id: string;
  href: string;
}

export const NAV_WORKSPACE: NavItem[] = [
  { icon: <LayoutDashboard size={15} />, label: "Dashboard", id: "dashboard", href: "/dashboard" },
  { icon: <Files size={15} />, label: "My Documents", count: 24, id: "docs", href: "/dashboard/documents" },
  { icon: <LayoutTemplate size={15} />, label: "Templates", count: 80, id: "templates", href: "/dashboard/templates" },
  { icon: <Palette size={15} />, label: "My Brand", id: "brand", href: "/dashboard/brand" },
];

export const NAV_DOCS: NavItem[] = [
  { icon: <Receipt size={15} />, label: "Invoices", count: 6, id: "invoices", href: "/dashboard/invoices" },
  { icon: <FileCheck size={15} />, label: "Quotations", count: 4, id: "quotations", href: "/dashboard/quotations" },
  { icon: <BarChart3 size={15} />, label: "Reports", count: 3, id: "reports", href: "/dashboard/reports" },
  { icon: <Mail size={15} />, label: "Letters", count: 2, id: "letters", href: "/dashboard/letters" },
];

export const NAV_COLLECTIONS: NavItem[] = [
  { icon: <Building2 size={15} />, label: "Acme Corp", id: "acme", href: "/dashboard/collections/acme" },
  { icon: <User size={15} />, label: "Personal", id: "personal", href: "/dashboard/collections/personal" },
];
