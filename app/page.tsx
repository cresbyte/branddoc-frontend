"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Menu, Check, ArrowRight, Star, PenTool, LayoutTemplate, Share2, Layers, DownloadCloud, Zap, MonitorSmartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
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

      {/* spacer for fixed nav */}
      <div className="h-[72px]" />

      <main className="flex-1 w-full flex flex-col">
        
        {/* ── 1. Hero Section (Deep Indigo) ── */}
        <section className="bg-indigo-700 relative pt-20 pb-48 lg:pt-28 lg:pb-56 overflow-hidden">
          {/* Subtle background waves/blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
             <div className="absolute top-10 right-20 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
               The go-to document template builder that converts
             </h1>
             <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 font-medium">
               Fast-track your brand's growth. Design, manage, and share beautifully crafted branded templates across your organization with zero design experience required.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button className="bg-[#fc5c65] hover:bg-[#eb4d55] text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                    Start designing
                  </Button>
                </Link>
             </div>
          </div>
        </section>

        {/* ── 2. Hero Mockup Overlay ── */}
        <section className="relative z-20 -mt-32 lg:-mt-40 mb-16 container mx-auto px-4 max-w-5xl">
           <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
              {/* Fake Browser Chrome */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                 </div>
                 <div className="mx-auto bg-white border border-gray-200 rounded-md py-1 px-4 text-xs text-gray-400 font-mono w-64 text-center">app.11docs.com</div>
              </div>
              {/* Fake Dashboard View */}
              <div className="flex bg-[#fcfdfd] h-[400px] md:h-[600px]">
                 {/* Sidebar */}
                 <div className="w-16 md:w-56 border-r border-gray-100 p-4 hidden sm:flex flex-col gap-4">
                    <div className="h-8 w-full bg-gray-100 rounded-md"></div>
                    <div className="h-4 w-3/4 bg-indigo-50 rounded-md"></div>
                    <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-gray-100 rounded-md"></div>
                 </div>
                 {/* Main Canvas */}
                 <div className="flex-1 p-8 overflow-hidden relative flex flex-col items-center">
                    <div className="w-full max-w-xl bg-white shadow-xl rotate-[1deg] aspect-[3/4] p-8 flex flex-col gap-6 ring-1 ring-gray-900/5">
                       <div className="w-20 h-20 rounded-full bg-indigo-100 mx-auto mt-4"></div>
                       <div className="h-10 bg-gray-100 rounded mx-auto w-3/4"></div>
                       <div className="h-4 bg-gray-50 rounded mx-auto w-1/2 mt-4"></div>
                       <div className="space-y-3 mt-8">
                          <div className="h-3 bg-gray-100 rounded w-full"></div>
                          <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-100 rounded w-full"></div>
                       </div>
                       <div className="mt-auto h-12 bg-indigo-600 rounded-md mx-auto w-1/3"></div>
                    </div>
                    {/* Floating fake tools */}
                    <div className="absolute top-1/4 right-8 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-3">
                       <div className="w-8 h-8 rounded bg-blue-50"></div>
                       <div className="w-8 h-8 rounded bg-green-50"></div>
                       <div className="w-8 h-8 rounded bg-amber-50"></div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ── 3. Logos ── */}
        <section className="py-10 border-b border-gray-100">
          <div className="container mx-auto px-4 text-center">
             <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Trusted by top agencies & brands worldwide</p>
             <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* using simple text/svg patterns for logos */}
                <div className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-blue-500 rounded-sm"></div> Netflix</div>
                <div className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 rounded-full border-4 border-red-500"></div> Target</div>
                <div className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-cyan-500 rotate-45"></div> Dropbox</div>
                <div className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-orange-500 rounded-full"></div> Amazon</div>
                <div className="font-bold text-xl flex items-center gap-2 hidden md:flex"><div className="w-6 h-6 bg-green-500 rounded-tl-xl rounded-br-xl"></div> Spotify</div>
             </div>
          </div>
        </section>

        {/* ── 4. Testimonials & Stats (Light purple bg) ── */}
        <section className="py-24 bg-indigo-50/50">
           <div className="container mx-auto px-4 max-w-[1200px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 {/* Left: Text & Stats */}
                 <div className="space-y-12">
                    <div>
                       <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                         Try what builder made to deliver everywhere.
                       </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <div className="text-4xl font-extrabold text-indigo-600 mb-2">90%</div>
                          <p className="text-gray-600 text-[15px] font-medium">Faster template creation compared to Word directly</p>
                       </div>
                       <div>
                          <div className="text-4xl font-extrabold text-indigo-600 mb-2">75%</div>
                          <p className="text-gray-600 text-[15px] font-medium">Increase in brand compliance across all teams</p>
                       </div>
                       <div>
                          <div className="text-4xl font-extrabold text-indigo-600 mb-2">640k+</div>
                          <p className="text-gray-600 text-[15px] font-medium">Documents generated successfully this year</p>
                       </div>
                       <div>
                          <div className="text-4xl font-extrabold text-indigo-600 mb-2">70%</div>
                          <p className="text-gray-600 text-[15px] font-medium">Reduction in design resource bottleneck</p>
                       </div>
                    </div>
                 </div>

                 {/* Right: Testimonial Cards */}
                 <div className="relative">
                    <div className="bg-white rounded-2xl shadow-xl p-8 relative z-10 border border-gray-100 -rotate-2">
                       <div className="flex gap-1 text-amber-400 mb-4">
                          <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                       </div>
                       <p className="text-lg text-slate-900 font-medium mb-6 leading-relaxed">
                         "We used to spend hours fixing broken layouts in Google Docs whenever someone copy-pasted. 11docs solved this entirely. It's truly a game-changer for our agency workflows."
                       </p>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">MR</div>
                          <div>
                             <p className="font-bold text-slate-900">Michael Ross</p>
                             <p className="text-sm text-gray-500">Creative Director, Apex Digital</p>
                          </div>
                          <div className="ml-auto w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">A</div>
                       </div>
                    </div>
                    {/* decorative background element */}
                    <div className="absolute top-10 -right-6 w-full h-full bg-indigo-200/50 rounded-2xl border border-indigo-200 rotate-3 z-0"></div>
                 </div>
              </div>
           </div>
        </section>

        {/* ── 5. Integration Callout ── */}
        <section className="py-24 overflow-hidden">
           <div className="container mx-auto px-4 max-w-[1000px] text-center">
              <div className="bg-white border shadow-lg shadow-indigo-100/50 rounded-[40px] p-10 md:p-16 flex flex-col items-center">
                 <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 max-w-2xl leading-tight">
                    Use 11docs with the tools your team already knows
                 </h2>
                 <p className="text-lg text-gray-500 mb-10">Export seamlessly with one click.</p>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                       <FileText className="w-10 h-10 text-blue-600" />
                       <span className="font-bold text-blue-900">Word</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                       <FileText className="w-10 h-10 text-emerald-600" />
                       <span className="font-bold text-emerald-900">Excel</span>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                       <FileText className="w-10 h-10 text-green-600" />
                       <span className="font-bold text-green-900">Docs</span>
                    </div>
                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                       <FileText className="w-10 h-10 text-teal-600" />
                       <span className="font-bold text-teal-900">Sheets</span>
                    </div>
                 </div>
                 
                 <Button variant="link" className="text-indigo-600 font-bold text-lg mt-10 tracking-tight">
                    Explore all 40+ integrations <ArrowRight className="w-5 h-5 ml-2" />
                 </Button>
              </div>
           </div>
        </section>

        {/* ── 6. Alternating Features ── */}
        <section className="py-24 bg-indigo-50/30">
           <div className="container mx-auto px-4 max-w-[1200px]">
              
              <div className="text-center max-w-3xl mx-auto mb-20">
                 <h2 className="text-3xl md:text-5xl font-bold text-indigo-600 mb-6 leading-tight">
                    We don't want to just shave hours off your workflow, we want to revolutionize it.
                 </h2>
              </div>

              {/* Feature 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                 <div className="order-2 lg:order-1 relative">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                       <div className="bg-[#f8f9fa] rounded-xl h-[400px] flex items-center justify-center relative overflow-hidden">
                          {/* Fake UI component */}
                          <div className="w-[80%] h-[120%] bg-white shadow-lg border border-gray-100 rotate-[-5deg] p-6 flex flex-col">
                             <div className="h-6 w-1/3 bg-indigo-100 rounded mb-4"></div>
                             <div className="h-2 w-full bg-gray-100 rounded mb-2"></div>
                             <div className="h-2 w-5/6 bg-gray-100 rounded mb-8"></div>
                             
                             <div className="flex gap-4 mb-4">
                               <div className="w-12 h-12 rounded-full bg-orange-100"></div>
                               <div className="flex-1 mt-2 space-y-2">
                                <div className="h-2 w-1/4 bg-gray-300 rounded"></div>
                                <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                               </div>
                             </div>
                             <div className="flex gap-4">
                               <div className="w-12 h-12 rounded-full bg-teal-100"></div>
                               <div className="flex-1 mt-2 space-y-2">
                                <div className="h-2 w-1/4 bg-gray-300 rounded"></div>
                                <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                               </div>
                             </div>
                          </div>
                          
                          {/* Top UI element floating */}
                          <div className="absolute top-10 -right-4 bg-white p-4 rounded-xl shadow-xl w-48 border border-gray-100">
                             <div className="text-xs font-bold text-emerald-600 flex items-center mb-2"><Check className="w-3 h-3 mr-1" /> Styles locked</div>
                             <div className="h-1.5 w-full bg-gray-100 rounded mb-1.5"></div>
                             <div className="h-1.5 w-4/5 bg-gray-100 rounded"></div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="order-1 lg:order-2 space-y-6">
                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                       <PenTool className="w-7 h-7 text-indigo-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Total brand compliance</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                       Lock in your colors, fonts, and logos so your team can't go rogue. Empower them to create documents while never compromising your brand identity.
                    </p>
                    <ul className="space-y-4 pt-4">
                       <li className="flex items-start gap-3">
                          <div className="mt-1 bg-indigo-100 rounded-full p-1"><Check className="w-4 h-4 text-indigo-600" /></div>
                          <span className="text-gray-700 font-medium">Dynamic brand kits synced across all templates</span>
                       </li>
                       <li className="flex items-start gap-3">
                          <div className="mt-1 bg-indigo-100 rounded-full p-1"><Check className="w-4 h-4 text-indigo-600" /></div>
                          <span className="text-gray-700 font-medium">Locked header/footer constraints</span>
                       </li>
                       <li className="flex items-start gap-3">
                          <div className="mt-1 bg-indigo-100 rounded-full p-1"><Check className="w-4 h-4 text-indigo-600" /></div>
                          <span className="text-gray-700 font-medium">Approval workflows before export</span>
                       </li>
                    </ul>
                 </div>
              </div>

              {/* Feature 2 */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="space-y-6">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                       <Zap className="w-7 h-7 text-purple-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Create once, use everywhere</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                       Stop duplicating work. Design your master template inside our intuitive builder and immediately make it available to the entire suite of productivity tools.
                    </p>
                    <ul className="space-y-4 pt-4">
                       <li className="flex gap-3 text-gray-700 font-medium border-l-2 border-indigo-600 pl-4">
                          Convert to Word instantly
                       </li>
                       <li className="flex gap-3 text-gray-700 font-medium border-l-2 border-gray-200 pl-4 hover:border-indigo-400 transition-colors">
                          Native Google Docs formats
                       </li>
                       <li className="flex gap-3 text-gray-700 font-medium border-l-2 border-gray-200 pl-4 hover:border-indigo-400 transition-colors">
                          Spreadsheet auto-formulas
                       </li>
                    </ul>
                 </div>
                 <div className="relative border border-gray-100 p-2 bg-white rounded-2xl shadow-xl">
                    <div className="bg-indigo-50 rounded-xl h-[400px] flex items-center justify-center relative overflow-hidden">
                       <div className="flex gap-6 animate-pulse-slow px-8">
                         <div className="bg-white w-40 h-56 rounded-lg shadow border border-indigo-100 flex flex-col p-4 opacity-80 transform -translate-y-4">
                           <div className="w-8 h-8 rounded-full bg-blue-100 mb-2"></div>
                           <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                           <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                         </div>
                         <div className="bg-white w-48 h-64 rounded-lg shadow-xl border border-indigo-200 flex flex-col p-4 relative z-10">
                           <div className="w-12 h-12 rounded-full bg-indigo-600 mb-4 mx-auto flex items-center justify-center text-white font-bold">11</div>
                           <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                           <div className="h-2 bg-gray-100 rounded w-full mb-1"></div>
                           <div className="h-2 bg-gray-100 rounded w-full mb-1"></div>
                           <div className="h-2 bg-gray-100 rounded w-4/5 mb-8"></div>
                           <div className="mt-auto h-8 bg-indigo-50 rounded border border-indigo-100"></div>
                         </div>
                         <div className="bg-white w-40 h-56 rounded-lg shadow border border-indigo-100 flex flex-col p-4 opacity-80 transform translate-y-4">
                           <div className="w-8 h-8 rounded bg-emerald-100 mb-2"></div>
                           <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                           <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ── 7. Pricing Intro ── */}
        <section className="py-24 bg-indigo-700 text-white">
           <div className="container mx-auto px-4 max-w-[1200px]">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-bold mb-4">Start for free.<br />Scale as you grow.</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                 
                 {[
                   { name: "Starter", price: "$0", desc: "For individuals", btn: "Start now", active: false },
                   { name: "Professional", price: "$25/mo", desc: "For small teams", btn: "Start Free Trial", active: true },
                   { name: "Business", price: "$65/mo", desc: "For growing orgs", btn: "Start Free Trial", active: false },
                   { name: "Enterprise", price: "Custom", desc: "For scale", btn: "Contact Sales", active: false },
                 ].map(plan => (
                   <div key={plan.name} className={`bg-white rounded-2xl p-8 flex flex-col shadow-xl ${plan.active ? 'ring-4 ring-indigo-300 transform md:-translate-y-2' : ''}`}>
                      <h4 className="text-indigo-600 font-bold text-lg mb-1">{plan.name}</h4>
                      <p className="text-gray-500 text-sm mb-6">{plan.desc}</p>
                      <div className="text-3xl font-extrabold text-slate-900 mb-6">{plan.price}</div>
                      <Button className={`w-full py-6 rounded-xl font-bold mt-auto ${plan.active ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'}`}>
                         {plan.btn}
                      </Button>
                      {plan.active && <div className="text-center text-xs text-gray-500 mt-4 leading-tight">Most popular for agencies</div>}
                   </div>
                 ))}
                 
              </div>
           </div>
        </section>

        {/* ── 8. Templates Previews ── */}
        <section className="py-24 overflow-hidden relative">
           <div className="container mx-auto px-4 max-w-[1200px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="relative">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-4">
                          <div className="bg-gray-100 aspect-[3/4] rounded-xl overflow-hidden border border-gray-200">
                            <div className="h-16 bg-blue-800 w-full"></div>
                            <div className="p-4 space-y-2"><div className="h-2 bg-gray-200 w-full"/><div className="h-2 bg-gray-200 w-5/6"/></div>
                          </div>
                          <div className="bg-gray-100 aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 relative">
                             <div className="absolute top-4 left-4 text-xs font-bold bg-white px-2 py-1 rounded">Spreadsheet</div>
                          </div>
                       </div>
                       <div className="space-y-4 mt-12">
                           <div className="bg-indigo-900 aspect-square rounded-xl overflow-hidden border border-gray-200 relative flex items-center justify-center">
                             <div className="w-16 h-16 rounded-full bg-white opacity-20"></div>
                             <div className="absolute bottom-4 center text-xs font-bold text-white px-2 py-1 rounded">Letterhead</div>
                          </div>
                          <div className="bg-gray-100 aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 hover:scale-105 transition-transform">
                             <div className="h-full border-4 border-indigo-600 bg-white m-2 rounded">
                                <div className="p-4"><div className="w-8 h-8 rounded bg-indigo-600 mb-8"></div><div className="h-2 bg-gray-200 w-full mb-2"/><div className="h-2 bg-gray-200 w-full"/></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                       One template doesn't fit all: try it to see for yourself
                    </h2>
                    <p className="text-lg text-gray-600">
                       Browse an extensive, ever-growing catalog of professionally designed templates tailored for a myriad of industries. Customize them to fit your exact brand guidelines in clicks.
                    </p>
                    <Link href="/templates" className="inline-block mt-4">
                      <Button className="bg-white border-2 border-indigo-600 hover:bg-indigo-50 text-indigo-600 rounded-full px-8 py-6 font-bold text-lg">
                        View all templates
                      </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>

        {/* ── 9. Roles / Use Cases ── */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
           <div className="container mx-auto px-4 max-w-[1200px]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                 
                 <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32 self-start">
                    <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
                       For every team: a high-performing document machine
                    </h2>
                    <p className="text-lg text-gray-600">
                       Whether you're selling a vision or sending an invoice, 11docs scales directly to your team's unique requirements.
                    </p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 font-bold text-lg mt-4">
                       Get started
                    </Button>
                 </div>

                 <div className="lg:col-span-7 space-y-6">
                    {/* Role Card 1 */}
                    <div className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                             <Layers className="w-6 h-6 text-blue-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900">For Agencies</h3>
                       </div>
                       <p className="text-gray-600 mb-6 leading-relaxed">
                          Manage multiple client brands from a single interface. Toggle brand kits instantly to generate proposals, reports, and onboarding materials exactly in your client's style.
                       </p>
                       <span className="text-indigo-600 font-bold group-hover:underline flex items-center">Learn more <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </div>

                    {/* Role Card 2 */}
                    <div className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                             <MonitorSmartphone className="w-6 h-6 text-emerald-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900">For Marketing</h3>
                       </div>
                       <p className="text-gray-600 mb-6 leading-relaxed">
                          Empower sales, support, and success teams to generate their own branded collateral without needing to submit requests to the design queue. Total brand control, decentralized generation.
                       </p>
                       <span className="text-indigo-600 font-bold group-hover:underline flex items-center">Learn more <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </div>

                 </div>

              </div>
           </div>
        </section>

        {/* ── 10. Bottom CTA (Dark Purple) ── */}
        <section className="bg-slate-900 text-white py-24 border-b border-gray-800">
           <div className="container mx-auto px-4 max-w-[1000px]">
              <div className="flex flex-col md:flex-row items-center gap-12 bg-[#1a2035] rounded-3xl p-10 lg:p-16 border border-slate-700">
                 <div className="hidden md:block w-48 h-48 bg-slate-800 rounded-xl relative shadow-2xl p-4">
                    <div className="bg-indigo-600 w-full h-8 rounded-md mb-4 opacity-50"></div>
                    <div className="h-3 bg-slate-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-600 rounded w-5/6 mb-8"></div>
                    <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-full">Convert</div>
                 </div>
                 <div className="flex-1 text-center md:text-left space-y-6">
                    <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                       Ready to start? <br/>Build beautiful document templates. Fast.
                    </h2>
                    <Button className="bg-[#fc5c65] hover:bg-[#eb4d55] text-white rounded-full px-8 py-6 text-lg font-bold">
                       Try 11docs for free
                    </Button>
                 </div>
              </div>
           </div>
        </section>

      </main>

      {/* ── Footer (Match Templates Page) ── */}
      <footer className="bg-white pt-20 pb-10">
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
