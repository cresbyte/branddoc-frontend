"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Branddoc</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/industries/healthcare" className="text-sm font-medium hover:text-primary transition-colors">
            Industries
          </Link>
          <Link href="/resources/guides" className="text-sm font-medium hover:text-primary transition-colors">
            Resources
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/careers" className="text-sm font-medium hover:text-primary transition-colors">
            Careers
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
