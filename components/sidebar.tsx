"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react'
import { useEffect, useState } from "react"

interface SidebarProps {
  username: string | null
}

export function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  const routes = [
    {
      icon: Home,
      href: "/",
      label: "홈"
    },
    {
      icon: Search,
      href: "/search",
      label: "검색"
    },
    {
      icon: PlusSquare,
      href: username ? `/${username}` : "/create",
      label: "새 게시물"
    },
    {
      icon: Heart,
      href: username ? `/${username}` : "/notification",
      label: "알림"
    },
    {
      icon: User,
      href: username ? `/${username}` : "/login",
      label: "프로필"
    }
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <nav className="flex items-center justify-around h-16 px-2 max-w-screen-xl mx-auto">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`
                flex items-center justify-center p-2 rounded-lg
                ${pathname === route.href ? "text-primary" : "text-muted-foreground"}
              `}
            >
              <route.icon className="w-7 h-7" strokeWidth={2} />
            </Link>
          ))}
        </nav>
      </div>
    )
  }

  return (
    <div className="fixed left-0 flex flex-col h-full border-r bg-background z-50">
      <div className="w-[72px] lg:w-[245px] h-full py-4">

        <Link href="/" className="flex items-center px-6 py-2 mb-2">
          <div className="relative w-7 h-7">
            <svg viewBox="0 0 120 28" height="28" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="hidden lg:block">
              <text x="0" y="24" fontSize="28" fontFamily="Arial" fontWeight="bold" fill="black">스느스</text>
            </svg>
            <svg viewBox="0 0 500 500" fill="currentColor" className="lg:hidden">
              <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)">
                <path d="M646 3404 c-158 -405 -291 -745 -293 -755 -5 -18 4 -19 225 -19 172 0 232 3 239 13 6 6 70 164 143 350 73 185 136 337 139 337 4 0 96 -156 206 -347 l200 -348 253 -3 c138 -1 252 1 252 4 0 15 -553 994 -561 994 -5 0 -72 -32 -149 -70 -77 -39 -140 -68 -140 -65 0 3 55 141 121 307 67 167 124 311 126 321 5 16 -11 17 -233 17 l-239 0 -289 -736z" />
                <path d="M3282 3398 c-161 -409 -292 -749 -292 -755 0 -10 53 -13 230 -13 208 0 230 2 239 18 5 9 68 168 141 352 73 184 133 336 135 338 1 1 80 -134 175 -300 96 -167 189 -327 207 -355 l33 -53 244 0 c135 0 247 3 249 8 3 5 -533 974 -550 992 -2 2 -69 -28 -149 -68 -79 -40 -146 -72 -148 -72 -3 0 53 144 125 320 71 176 129 322 129 325 0 3 -107 5 -238 5 l-239 0 -291 -742z" />
                <path d="M1890 1390 l0 -750 790 0 790 0 -2 178 -3 177 -557 3 -558 2 0 570 0 570 -230 0 -230 0 0 -750z" />
              </g>
            </svg>
          </div>
        </Link>

        <nav className="flex flex-col space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`
                flex items-center px-6 py-3 hover:bg-accent rounded-lg transition-colors
                ${pathname === route.href ? "text-primary font-medium" : "text-muted-foreground"}
              `}
            >
              <route.icon className="w-7 h-7 lg:w-6 lg:h-6 lg:mr-4" strokeWidth={2} />
              <span className="hidden lg:block text-base">{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

