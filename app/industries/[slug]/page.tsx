import { PublicNavbar } from "@/components/PublicNavbar"
import { PublicFooter } from "@/components/PublicFooter"
import { notFound } from "next/navigation"

const industryData: Record<string, { title: string, description: string, image: string }> = {
  "healthcare": {
    title: "Healthcare",
    description: "Secure, HIPAA-compliant document management for medical practices and healthcare providers.",
    image: "medical-grid"
  },
  "legal": {
    title: "Legal Services",
    description: "Streamline case documentation, client contracts, and secure signatures for law firms.",
    image: "legal-balance"
  },
  "finance": {
    title: "Finance",
    description: "Robust security and audit trails for financial institutions and wealth management.",
    image: "finance-chart"
  },
  "real-estate": {
    title: "Real Estate",
    description: "Manage property listings, contracts, and tenant documentation in one place.",
    image: "property-key"
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industryData[slug]

  if (!industry) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F8FAFC" }}>
      <PublicNavbar />
      <main className="flex-1">
        <section style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", paddingTop: 140, paddingBottom: 80 }}>
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Industries</div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 20 }}>DocCraft for {industry.title}</h1>
            <p style={{ fontSize: 18, color: "#64748B", fontFamily: "var(--font-dm-sans)", maxWidth: 640, margin: "0 auto" }}>{industry.description}</p>
          </div>
        </section>

        <section style={{ padding: "80px 24px" }}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", aspectRatio: "16/9", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
              [ Industry Specific Illustration: {industry.image} ]
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 18 }}>Tailored for your needs</h2>
                <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.8, fontFamily: "var(--font-dm-sans)" }}>
                  We understand the specific regulatory requirements and workflow challenges of the {slug} industry. Our platform is built to handle the complexities unique to your business, from security to specialized branding.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "Industry Specific Compliance",
                  "Secure Client Portal",
                  "Custom Workflow Templates",
                  "Automated Document Routing"
                ].map((item) => (
                  <div key={item} style={{ padding: "16px 20px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ height: 8, width: 8, borderRadius: "50%", background: "#1D4ED8" }} />
                    <span style={{ fontSize: 16, fontWeight: 500, color: "#374151", fontFamily: "var(--font-dm-sans)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
