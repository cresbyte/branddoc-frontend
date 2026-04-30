import { LandingNavbar } from "@/components/landing-navbar"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-center">About Branddoc</h1>
          <div className="prose prose-lg dark:prose-invert mx-auto space-y-6">
            <p className="text-xl text-muted-foreground text-center mb-12">
              Empowering organizations to manage documents and clients with efficiency and security.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p>At Branddoc, our mission is to simplify the complex world of document management and client relations. We believe that by providing intuitive and powerful tools, we can help businesses of all sizes focus on what they do best.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p>We envision a future where documentation is seamless, collaborative, and entirely secure. We strive to be the platform of choice for industries where compliance and organization are paramount.</p>
              </div>
            </div>
            <div className="bg-muted p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-center">Why Branddoc?</h2>
              <p className="text-center">Born from the need for a more robust document management system, Branddoc was built from the ground up to handle the unique challenges of modern workflows.</p>
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
