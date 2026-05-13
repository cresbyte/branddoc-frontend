import { PublicNavbar } from "@/components/PublicNavbar"
import { PublicFooter } from "@/components/PublicFooter"
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
    content: "A detailed look at how DocCraft handles data encryption, privacy, and secure client communication.",
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
    <div className="flex min-h-screen flex-col" style={{ background: "#F8FAFC" }}>
      <PublicNavbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div style={{ padding: "6px 14px", background: "#EFF6FF", color: "#1D4ED8", borderRadius: "100px", fontSize: 13, fontWeight: 700, display: "inline-block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 24 }}>
            {type}
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 32, lineHeight: 1.1 }}>{title}</h1>
          
          <div style={{ fontFamily: "var(--font-dm-sans)" }}>
            <p style={{ fontSize: 22, color: "#64748B", lineHeight: 1.6, marginBottom: 48 }}>
              {content}
            </p>
            
            <div style={{ padding: "40px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 20 }}>Resource Overview</h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
                This resource provides an in-depth exploration of the subject matter, designed to help professional teams optimize their workflows. We cover everything from initial setup to advanced brand management strategies.
              </p>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8 }}>
                Our goal is to ensure that your team is equipped with the best possible information to maintain high standards across all documentation.
              </p>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
