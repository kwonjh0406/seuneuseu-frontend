import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "스느스",
  description: "새로운 소통의 시작, 여러분의 생각을 공유하세요",
}

export const viewport = 'width=device-width, initial-scale=1, user-scalable=no';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          {children}
        </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

