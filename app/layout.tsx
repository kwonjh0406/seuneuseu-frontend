import type { Metadata, Viewport } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getLoggedInUsername } from "@/lib/getLoggedInUsername"
import ClientLayout from "./ClientLayout"
import { AppProviders } from "./AppProviders"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "스느스",
  description: "새로운 소통의 시작, 여러분의 생각을 공유하세요",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loggedInUsername = await getLoggedInUsername();

  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientLayout loggedInUsername={loggedInUsername}>
            <div className="min-h-screen bg-background">

              <AppProviders>{children}</AppProviders>
            </div>
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
