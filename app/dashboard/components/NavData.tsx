import React from "react";
import {
  LayoutDashboard,
  Files,
  LayoutTemplate,
  Receipt,
  FileCheck,
  BarChart3,
  Mail,
  Building2,
  User,
  GalleryVertical,
  Palette,
  ShieldCheck,
  Users,
  BarChart,
  CreditCard,
  Settings,
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
  { icon: <GalleryVertical size={15} />, label: "Browse Templates", id: "templates-gallery", href: "/dashboard/templates" },
  { icon: <Palette size={15} />, label: "My Designs", id: "designs", href: "/dashboard/designs" },
  { icon: <Building2 size={15} />, label: "Brand Kit", id: "brand-kit", href: "/dashboard/brand" },
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

export const NAV_ADMIN: NavItem[] = [
  { icon: <ShieldCheck size={15} />, label: "Manage Templates", id: "admin-templates", href: "/dashboard/admin/templates" },
  { icon: <Users size={15} />, label: "Users", id: "admin-users", href: "/dashboard/admin/users" },
  { icon: <BarChart size={15} />, label: "Analytics", id: "admin-analytics", href: "/dashboard/admin/analytics" },
  { icon: <CreditCard size={15} />, label: "Payments", id: "admin-payments", href: "/dashboard/admin/payments" },
  { icon: <Settings size={15} />, label: "Settings", id: "admin-settings", href: "/dashboard/admin/settings" },
];
