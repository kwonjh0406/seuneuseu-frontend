'use client';

import { ReactNode, createContext, useContext } from "react";

const UsernameContext = createContext<string | null>(null);

export function useUsername() {
  return useContext(UsernameContext);
}

export default function ClientLayout({
  children,
  loggedInUsername,
}: {
  children: ReactNode;
  loggedInUsername: string | null;
}) {
  return (
    <UsernameContext.Provider value={loggedInUsername}>
      {children}
    </UsernameContext.Provider>
  );
}
