import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-indigo-100/50 max-w-lg w-full text-center relative z-10 border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8">
                <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            
            <h1 className="text-7xl font-extrabold text-indigo-600 tracking-tight mb-4">404</h1>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Document not found</h2>
            <p className="text-gray-500 text-lg mb-10 font-medium px-4">
                We couldn't locate the page or document you're looking for. It might have been moved or deleted.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm">
                        <Home className="w-4 h-4 mr-2" /> Back to home
                    </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl border-gray-200 text-slate-900 font-bold hover:bg-gray-50">
                        Go to dashboard
                    </Button>
                </Link>
            </div>
        </div>
    </div>
  )
}
