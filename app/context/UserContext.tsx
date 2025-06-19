// app/context/UserContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  username: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
