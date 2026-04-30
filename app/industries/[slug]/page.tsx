import { LandingNavbar } from "@/components/landing-navbar"
import { notFound } from "next/navigation"

const industryData: Record<string, { title: string, description: string, image: string }> = {
  "healthcare": {
    title: "Branddoc for Healthcare",
    description: "Secure, HIPAA-compliant document management for medical practices and healthcare providers.",
    image: "medical-grid"
  },
  "legal": {
    title: "Branddoc for Legal Services",
    description: "Streamline case documentation, client contracts, and secure signatures for law firms.",
    image: "legal-balance"
  },
  "finance": {
    title: "Branddoc for Finance",
    description: "Robust security and audit trails for financial institutions and wealth management.",
    image: "finance-chart"
  },
  "real-estate": {
    title: "Branddoc for Real Estate",
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
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <section className="bg-primary/5 py-32 border-b">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">{industry.title}</h1>
            <p className="text-2xl text-muted-foreground">{industry.description}</p>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-muted aspect-video rounded-3xl flex items-center justify-center text-muted-foreground text-xl font-medium">
              [ Industry Specific Illustration: {industry.image} ]
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
              <div>
                <h2 className="text-3xl font-bold mb-6">Tailored for your needs</h2>
                <p className="text-lg text-muted-foreground">We understand the specific regulatory requirements and workflow challenges of the {slug} industry. Our platform is built to handle the complexities unique to your business.</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-xl flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium text-lg">Industry Specific Compliance</span>
                </div>
                <div className="p-4 border rounded-xl flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium text-lg">Secure Client Portal</span>
                </div>
                <div className="p-4 border rounded-xl flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium text-lg">Custom Workflow Templates</span>
                </div>
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
