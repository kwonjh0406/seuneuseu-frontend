import { create } from 'zustand'

type UserStore = {
  username: string | null
  setUsername: (username: string) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
  logout: () => set({ username: null }),
}))
