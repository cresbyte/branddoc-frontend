import { PublicNavbar } from "@/components/PublicNavbar"
import { PublicFooter } from "@/components/PublicFooter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, MapPin, Clock } from "lucide-react"

const jobs = [
  { title: "Senior Frontend Engineer", location: "Remote / San Francisco", type: "Full-time" },
  { title: "Product Designer", location: "London / Remote", type: "Full-time" },
  { title: "Customer Success Manager", location: "New York", type: "Full-time" },
  { title: "Backend Engineer (Go)", location: "Remote", type: "Contract" },
]

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F8FAFC" }}>
      <PublicNavbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Careers</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 20 }}>Join the DocCraft team</h1>
          <p style={{ fontSize: 18, color: "#64748B", fontFamily: "var(--font-dm-sans)", maxWidth: 640, margin: "0 auto 48px" }}>
            Help us build the most powerful document management platform on the planet. We're looking for passionate people to join our mission.
          </p>

          <div className="space-y-6 text-left">
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 24 }}>Open Positions</h2>
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div 
                  key={job.title} 
                  style={{ 
                    padding: "24px 32px", 
                    background: "#fff", 
                    border: "1px solid #E2E8F0", 
                    borderRadius: 16, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  className="hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 group"
                >
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-dm-sans)", marginBottom: 4 }}>{job.title}</h3>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ fontSize: 14, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} /> {job.location}
                      </span>
                      <span style={{ fontSize: 14, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} /> {job.type}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 40, width: 40, borderRadius: "50%", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }} className="group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              ))}
            </div>
            {jobs.length === 0 && <p className="text-center text-muted-foreground py-12">No open positions at the moment. Check back later!</p>}
          </div>

          <section style={{ marginTop: 80, padding: "60px 40px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 32, textAlign: "center" }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-serif)", marginBottom: 40 }}>Values we live by</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { t: "Innovation first", d: "We always look for a better way to solve old problems." },
                { t: "User obsessed", d: "Every feature is built with the user in the front of our mind." },
                { t: "Radical transparency", d: "We believe in being open and honest with our team and users." }
              ].map((val) => (
                <div key={val.t}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-dm-sans)", marginBottom: 12 }}>{val.t}</h3>
                  <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.6 }}>{val.d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
