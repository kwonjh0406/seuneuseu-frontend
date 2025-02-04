"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"

interface PageState {
  scrollPosition: number
  data: any // This can be more specific based on your needs
}

interface AppContextType {
  currentPage: string
  setCurrentPage: (page: string) => void
  pageStates: Record<string, PageState>
  setPageState: (page: string, state: PageState) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState("/")
  const [pageStates, setPageStates] = useState<Record<string, PageState>>({})

  const setPageState = (page: string, state: PageState) => {
    setPageStates((prev) => ({ ...prev, [page]: state }))
  }

  return (
    <AppContext.Provider value={{ currentPage, setCurrentPage, pageStates, setPageState }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

