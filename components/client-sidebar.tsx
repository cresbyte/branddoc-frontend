"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  User,
  Settings,
  LogOut,
  HelpCircle,
  FolderOpen,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react"

const clientRoutes = [
  {
    label: "Workspace Home",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "My Documents",
    icon: FolderOpen,
    href: "/dashboard/documents",
  },
  {
    label: "Client Messages",
    icon: MessageSquare,
    href: "/dashboard/messages",
  },
  {
    label: "Profile Settings",
    icon: User,
    href: "/dashboard/profile",
  },
]

export function ClientSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r bg-background w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold">11</div>
          <span className="text-xl font-bold tracking-tight">Branddoc</span>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-1">
        {clientRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              pathname === route.href
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="font-medium">{route.label}</span>
          </Link>
        ))}
      </div>
      <div className="p-4 border-t space-y-1">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="font-medium">Support</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  )
}
