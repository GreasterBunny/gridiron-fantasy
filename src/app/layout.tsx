import type { Metadata } from "next"
import { Inter, Syne } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
})

export const metadata: Metadata = {
  title: "Gridiron — Full-Roster Fantasy Football",
  description:
    "Fantasy football where every position matters. Draft OL, IDP, and skill players in the most complete fantasy experience available.",
  openGraph: {
    title: "Gridiron — Full-Roster Fantasy Football",
    description: "Fantasy football where every position matters.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#08090C] text-[#F1F3F9]">
        {children}
      </body>
    </html>
  )
}
