"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Menu, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white overflow-x-hidden">
      
      {/* ── Navbar ── */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-[72px] flex items-center justify-between max-w-[1400px]">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:bg-indigo-700 transition-colors shadow-sm">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">11docs</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/templates" className="text-[15px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Templates</Link>
              <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Customers</Link>
              <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Inspiration</Link>
              <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Features</Link>
              <Link href="#" className="text-[15px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Pricing</Link>
            </nav>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/login" className="text-[15px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Log in</Link>
            <Link href="#" className="text-[15px] font-medium text-indigo-600 hover:text-indigo-700 transition-colors">Contact sales</Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-5 shadow-sm text-[15px] font-semibold transition-all">
                Try for free
              </Button>
            </Link>
          </div>
          <div className="lg:hidden flex items-center">
            <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="h-[72px]" />

      <main className="flex-1 w-full flex flex-col">
        
        {/* ── Hero Section ── */}
        <section className="bg-indigo-700 relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
             <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
               About 11docs
             </h1>
             <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-medium">
               Empowering organizations to manage, distribute, and perfectly scale their brand collaterals.
             </p>
          </div>
        </section>

        {/* ── Content Section ── */}
        <section className="py-24 bg-white relative z-20">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="prose prose-lg dark:prose-invert mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 text-slate-900">
                   <div>
                     <h2 className="text-3xl font-bold mb-6 text-indigo-900">Our Mission</h2>
                     <p className="text-gray-600 leading-relaxed font-medium">
                       At 11docs, our mission is to simplify the complex world of document management and client relations. We believe that by providing intuitive and powerful tools, we can help businesses of all sizes focus on what they do best without constantly battling broken formatting.
                     </p>
                   </div>
                   <div>
                     <h2 className="text-3xl font-bold mb-6 text-indigo-900">Our Vision</h2>
                     <p className="text-gray-600 leading-relaxed font-medium">
                       We envision a future where documentation is seamless, collaborative, and entirely secure. We strive to be the platform of choice for industries where brand compliance and rapid generation are paramount.
                     </p>
                   </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-12 rounded-3xl text-center">
                   <h2 className="text-3xl font-bold mb-6 text-slate-900 tracking-tight">Why 11docs?</h2>
                   <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                     Born from the profound pain of managing disorganized word documents and rogue PDFs, 11docs was built from the ground up to solve the brand governance challenge for modern, fast-moving teams.
                   </p>
                </div>
             </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
            <div className="lg:col-span-2 pr-8">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">11docs</span>
              </Link>
              <p className="text-[15px] text-gray-500 mb-8 max-w-sm leading-relaxed">
                The most intelligent way to create, manage, and share beautifully designed document templates for your brand.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-colors cursor-pointer">in</div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-colors cursor-pointer">tw</div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-colors cursor-pointer">ig</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-5 text-[15px]">Templates</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Letterheads</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Spreadsheets</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Presentations</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Brand Kits</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-5 text-[15px]">Product</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Customers</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-5 text-[15px]">Resources</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-5 text-[15px]">Company</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[14px] text-gray-400">© 2026 11docs Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-[14px] text-gray-400">
              <span>Status: All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
