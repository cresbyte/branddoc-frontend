"use client"

import { cn } from "@/lib/utils"
import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const adminRoutes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "User Management",
    icon: Users,
    href: "/admin/users",
  },
  {
    label: "Platform Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    label: "Document Logs",
    icon: FileText,
    href: "/admin/logs",
  },
  {
    label: "Manage Payments",
    icon: CreditCard,
    href: "/admin/payments",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r bg-slate-950 text-slate-50 w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">Branddoc Admin</span>
      </div>
      <div className="flex-1 px-4 space-y-1">
        {adminRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-slate-900 text-slate-400 hover:text-slate-50"
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="font-medium">{route.label}</span>
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-slate-900 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  )
}
