import { PublicNavbar } from "@/components/PublicNavbar"
import { PublicFooter } from "@/components/PublicFooter"

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <PublicNavbar />
      
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      <PublicFooter />
    </div>
  )
}
