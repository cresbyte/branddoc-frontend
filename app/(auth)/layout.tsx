import Link from "next/link"
import { FileText, Star } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white font-sans overflow-hidden">
      {/* ── Left Pane: Auth Forms ── */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col relative z-10 transition-all duration-500 bg-white">
        {/* Brand Logo Header */}
        <div className="absolute top-0 left-0 w-full p-6 md:p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">11docs</span>
          </Link>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-16 xl:px-24">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* ── Right Pane: Visual Showcase ── */}
      <div className="hidden lg:flex flex-1 relative bg-indigo-700 items-center justify-center p-12 overflow-hidden">
        {/* Decorative background blobs (matching hero) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
           <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>

        {/* Visual Content */}
        <div className="relative z-10 w-full max-w-lg mb-16">
           <div className="mb-10 text-indigo-100">
             <div className="flex gap-1 mb-4">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" /><Star className="w-5 h-5 fill-amber-400 text-amber-400" /><Star className="w-5 h-5 fill-amber-400 text-amber-400" /><Star className="w-5 h-5 fill-amber-400 text-amber-400" /><Star className="w-5 h-5 fill-amber-400 text-amber-400" />
             </div>
             <p className="text-3xl font-bold leading-tight mb-6 text-white">
               "We deployed 11docs across our entire enterprise in days. The brand consistency is finally locked down."
             </p>
             <p className="font-semibold">— Sarah Jenkins, VP of Marketing</p>
           </div>
           
           {/* Abstract UI representation */}
           <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:bg-white/15 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-400"></div>
              <div className="flex items-center gap-4 mb-6 opacity-80">
                 <div className="w-10 h-10 rounded-full bg-white/20"></div>
                 <div className="h-3 w-1/3 bg-white/20 rounded"></div>
              </div>
              <div className="space-y-3 opacity-60">
                 <div className="h-2 w-full bg-white/20 rounded"></div>
                 <div className="h-2 w-5/6 bg-white/20 rounded"></div>
                 <div className="h-2 w-4/6 bg-white/20 rounded"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
