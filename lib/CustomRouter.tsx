"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppContext } from "./AppContext"

interface Route {
  path: string
  component: React.ComponentType
}

interface CustomRouterProps {
  routes: Route[]
}

export function CustomRouter({ routes }: CustomRouterProps) {
  const { currentPage, setCurrentPage } = useAppContext()
  const [Component, setComponent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    const route = routes.find((r) => r.path === currentPage)
    if (route) {
      setComponent(() => route.component)
    }
  }, [currentPage, routes])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [setCurrentPage])

  if (!Component) return null

  return <Component />
}

export function CustomLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { setCurrentPage } = useAppContext()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.history.pushState(null, "", to)
    setCurrentPage(to)
  }

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}

