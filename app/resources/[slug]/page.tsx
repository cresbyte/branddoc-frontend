import { LandingNavbar } from "@/components/landing-navbar"
import { notFound } from "next/navigation"

const resourcesData: Record<string, { title: string, content: string, type: string }> = {
  "guides": {
    title: "Comprehensive Guides",
    content: "Deep dives into best practices for document management and client onboarding in the digital age.",
    type: "Free Guide"
  },
  "legal-tips": {
    title: "Legal Documentation Tips",
    content: "Expert advice on staying compliant with your business documents and legal workflows.",
    type: "Expert Advice"
  },
  "security-whitepaper": {
    title: "Security Whitepaper",
    content: "A detailed look at how Branddoc handles data encryption, privacy, and secure client communication.",
    type: "Whitepaper"
  }
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = resourcesData[slug]

  if (!resource) {
    if (slug === "guides") { // Fallback for basic navigation demo
      return <ResourceDetail title="Guides Listing" content="Browse our library of industry guides." type="Listing" />
    }
    return notFound()
  }

  return <ResourceDetail {...resource} />
}

function ResourceDetail({ title, content, type }: { title: string, content: string, type: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-4 inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            {type}
          </div>
          <h1 className="text-5xl font-extrabold mb-8">{title}</h1>
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-2xl text-muted-foreground mb-12 leading-relaxed">
              {content}
            </p>
            <div className="p-8 border rounded-2xl bg-muted/30">
              <h2 className="text-xl font-bold mb-4 italic">Sample Resource Content</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p className="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Branddoc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
