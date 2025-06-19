import type { Metadata, Viewport } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getLoggedInUsername } from "@/lib/getLoggedInUsername"
import ClientLayout from "./ClientLayout"
import { AppProviders } from "./AppProviders"
import { cookies } from "next/headers"
import { getUser } from "./lib/getUser"
import { UserProvider } from "./context/UserContext"

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies(); // ✅ 현재 요청의 쿠키
  const cookie = cookieStore.toString(); // 모든 쿠키를 문자열로 변환

  const user = await getUser(cookie);

  const loggedInUsername = await getLoggedInUsername();

  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider initialUser={user}>
            <div className="min-h-screen bg-background">

              {children}
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
