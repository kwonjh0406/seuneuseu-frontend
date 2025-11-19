"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface TabState {
  activeTab: string
  scrollPosition: number
  data?: any
  searchQuery?: string
}

interface PageState {
  tabs: Record<string, TabState>
  scrollPosition: number
  data?: any
}

interface AppContextType {
  getTabState: (pageKey: string, tabKey: string) => TabState | null
  setTabState: (pageKey: string, tabKey: string, state: Partial<TabState>) => void
  saveScrollPosition: (pageKey: string, tabKey: string, position: number) => void
  restoreScrollPosition: (pageKey: string, tabKey: string) => void
  savePageScrollPosition: (pathname: string, position: number) => void
  restorePageScrollPosition: (pathname: string) => void
  pageStates: Record<string, PageState>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [pageStates, setPageStates] = useState<Record<string, PageState>>({})

  const getTabState = useCallback((pageKey: string, tabKey: string): TabState | null => {
    const pageState = pageStates[pageKey]
    if (!pageState) return null
    return pageState.tabs[tabKey] || null
  }, [pageStates])

  const setTabState = useCallback((pageKey: string, tabKey: string, state: Partial<TabState>) => {
    setPageStates((prev) => {
      const currentPageState = prev[pageKey] || { tabs: {}, scrollPosition: 0 }
      const currentTabState = currentPageState.tabs[tabKey] || { activeTab: tabKey, scrollPosition: 0 }
      
      return {
        ...prev,
        [pageKey]: {
          ...currentPageState,
          tabs: {
            ...currentPageState.tabs,
            [tabKey]: {
              ...currentTabState,
              ...state,
            },
          },
        },
      }
    })
  }, [])

  const saveScrollPosition = useCallback((pageKey: string, tabKey: string, position: number) => {
    setTabState(pageKey, tabKey, { scrollPosition: position })
  }, [setTabState])

  const restoreScrollPosition = useCallback((pageKey: string, tabKey: string) => {
    const tabState = getTabState(pageKey, tabKey)
    if (tabState?.scrollPosition) {
      // 다음 틱에서 스크롤 복원 (DOM 업데이트 후)
      setTimeout(() => {
        window.scrollTo({ top: tabState.scrollPosition, behavior: 'auto' })
      }, 0)
    }
  }, [getTabState])

  const savePageScrollPosition = useCallback((pathname: string, position: number) => {
    setPageStates((prev) => {
      const currentPageState = prev[pathname] || { tabs: {}, scrollPosition: 0 }
      return {
        ...prev,
        [pathname]: {
          ...currentPageState,
          scrollPosition: position,
        },
      }
    })
  }, [])

  const restorePageScrollPosition = useCallback((pathname: string) => {
    const pageState = pageStates[pathname]
    if (pageState?.scrollPosition) {
      // DOM 업데이트 후 스크롤 복원
      setTimeout(() => {
        window.scrollTo({ top: pageState.scrollPosition, behavior: 'auto' })
      }, 100)
    }
  }, [pageStates])

  return (
    <AppContext.Provider value={{ 
      getTabState, 
      setTabState, 
      saveScrollPosition, 
      restoreScrollPosition,
      savePageScrollPosition,
      restorePageScrollPosition,
      pageStates 
    }}>
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

