import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingNavbar } from "@/components/landing-navbar"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center gap-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Manage your documents and clients with <span className="text-primary">Branddoc</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A powerful platform to streamline your workflow, manage clients, and keep your documentation organized.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8 text-lg">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-xl border bg-muted/50 aspect-video flex items-center justify-center text-muted-foreground font-medium">
            [Dashboard Preview Placeholder]
          </div>
        </section>

        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border bg-background space-y-2">
                <h3 className="font-bold text-xl">Client Management</h3>
                <p className="text-muted-foreground">Keep track of all your clients in one place with detailed profiles and history.</p>
              </div>
              <div className="p-6 rounded-lg border bg-background space-y-2">
                <h3 className="font-bold text-xl">Document Storage</h3>
                <p className="text-muted-foreground">Securely store and organize your documents with easy search and tagging.</p>
              </div>
              <div className="p-6 rounded-lg border bg-background space-y-2">
                <h3 className="font-bold text-xl">Collaboration</h3>
                <p className="text-muted-foreground">Work together with your team and clients seamlessly with shared access.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Branddoc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
