import { LandingNavbar } from "@/components/landing-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const jobs = [
  { title: "Senior Frontend Engineer", location: "Remote / San Francisco", type: "Full-time" },
  { title: "Product Designer", location: "London / Remote", type: "Full-time" },
  { title: "Customer Success Manager", location: "New York", type: "Full-time" },
  { title: "Backend Engineer (Go)", location: "Remote", type: "Contract" },
]

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-6">Join the Team</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Help us build the most powerful document management platform on the planet.
          </p>

          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <Card key={job.title} className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription>{job.location} • {job.type}</CardDescription>
                    </div>
                    <Button variant="outline">Apply Now</Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {jobs.length === 0 && <p className="text-center text-muted-foreground py-12">No open positions at the moment. Check back later!</p>}
          </div>

          <section className="mt-20 p-12 bg-primary/5 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">Values we live by</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div>
                <h3 className="font-bold mb-2">Innovation first</h3>
                <p className="text-sm text-muted-foreground">We always look for a better way to solve old problems.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">User obsessed</h3>
                <p className="text-sm text-muted-foreground">Every feature is built with the user in the front of our mind.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Radical transparency</h3>
                <p className="text-sm text-muted-foreground">We believe in being open and honest with our team and users.</p>
              </div>
            </div>
          </section>
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
