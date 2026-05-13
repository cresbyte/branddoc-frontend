import { PublicNavbar } from "@/components/PublicNavbar"
import { PublicFooter } from "@/components/PublicFooter"
import { Check } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section style={{ background: "#0F172A", paddingTop: 140, paddingBottom: 100, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: "radial-gradient(circle at 20% 30%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 80% 70%, #1D4ED8 0%, transparent 50%)" }} />
          <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: "#fff", fontFamily: "var(--font-serif)", marginBottom: 24, tracking: "-0.02em" }}>
              Our mission is to simplify <br/> <span style={{ color: "#3B82F6" }}>brand consistency.</span>
            </h1>
            <p style={{ fontSize: 20, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-dm-sans)", lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
              Empowering organization to manage, distribute and scale their brand collaterals with absolute precision.
            </p>
          </div>
        </section>

        {/* Mission/Vision */}
        <section style={{ padding: "100px 24px" }}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 20 }}>Our Mission</h2>
                <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.8, fontFamily: "var(--font-dm-sans)" }}>
                  At DocCraft, we believe that brand integrity shouldn't be a luxury. We're building tools that bridge the gap between design vision and document execution, ensuring every piece of communication reflects the highest standards of your brand identity.
                </p>
              </div>
              <div>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 20 }}>Our Vision</h2>
                <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.8, fontFamily: "var(--font-dm-sans)" }}>
                  We envision a world where professional documents are created in seconds, not hours. A future where "rogue formatting" is a thing of the past and teams can focus on crafting their message while the platform handles the aesthetics.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 100, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 32, padding: "80px 40px", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
               <h2 style={{ fontSize: 36, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 24 }}>The DocCraft Story</h2>
               <p style={{ fontSize: 18, color: "#64748B", lineHeight: 1.8, fontFamily: "var(--font-dm-sans)", maxWidth: 800, margin: "0 auto" }}>
                 Born from the frustration of managing disorganized Word documents and inconsistent PDFs, DocCraft was founded to provide a "single source of truth" for branded documents. We started with a simple idea: what if your brand guide could live inside your document editor? Today, we help thousands of teams stay on-brand with every click.
               </p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
