import { PublicNavbar } from "@/components/PublicNavbar"
import { PublicFooter } from "@/components/PublicFooter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F8FAFC" }}>
      <PublicNavbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#0F172A" }}>Contact Us</h1>
              <p className="text-xl text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Have questions or need support? We&apos;re here to help you get started with DocCraft.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <div className="font-bold">Email</div>
                    <div className="text-muted-foreground">hello@DocCraft.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <div className="font-bold">Office</div>
                    <div className="text-muted-foreground">123 Tech Avenue, Silicon Valley, CA</div>
                  </div>
                </div>
              </div>
            </div>
            <Card className="border-0 shadow-lg shadow-blue-900/5">
              <CardHeader>
                <CardTitle style={{ fontFamily: "var(--font-serif)" }}>Send a Message</CardTitle>
                <CardDescription>Fill out the form below and we&apos;ll get back to you shortly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea id="message" className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How can we help?"></textarea>
                </div>
                <Button className="w-full bg-[#0F172A] hover:bg-[#1D4ED8] transition-colors">Send Message</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
