import type { Metadata, Viewport } from "next"
import { Geist_Mono, Roboto, Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const interHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Fakebook — Connect and Share",
    template: "%s | Fakebook",
  },
  description:
    "Fakebook is a modern social networking platform. Connect with friends, share posts, leave reactions, and stay in touch.",
  applicationName: "Fakebook",
  authors: [{ name: "Fakebook Team" }],
  keywords: ["social", "posts", "reactions", "friends", "community"],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        roboto.variable,
        interHeading.variable
      )}
    >
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
