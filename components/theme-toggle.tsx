"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  // 초기 테마에 맞게 theme-color 메타 태그 설정
  useEffect(() => {
    const currentTheme = theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", currentTheme === "light" ? "#FAFAFA" : "#131313")
    } else {
      const newMeta = document.createElement("meta")
      newMeta.name = "theme-color"
      newMeta.content = currentTheme === "light" ? "#FAFAFA" : "#131313"
      document.head.appendChild(newMeta)
    }
  }, [theme])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)

    // theme-color 메타 태그 업데이트
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", newTheme === "light" ? "#FAFAFA" : "#131313")
    } else {
      const newMeta = document.createElement("meta")
      newMeta.name = "theme-color"
      newMeta.content = newTheme === "light" ? "#FAFAFA" : "#131313"
      document.head.appendChild(newMeta)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
