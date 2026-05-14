import { Geist, Geist_Mono, Inter, Fraunces, DM_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})
const fraunces = Fraunces({subsets:['latin'],variable:'--font-serif'})
const dmSans = DM_Sans({subsets:['latin'],variable:'--font-dm-sans', weight: ['400', '500', '700']})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, inter.variable, fraunces.variable, dmSans.variable)}
    >
      <body>
        <GoogleOAuthProvider clientId="898368192915-rdtfu51uk3gu20n5cpumvq88jn7vcmma.apps.googleusercontent.com">
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
