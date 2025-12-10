"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface AuthContextType {
  authenticated: boolean;
  ready: boolean;
  user: { email?: { address: string } } | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  ready: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function usePrivy() {
  return useContext(AuthContext);
}

export function PrivyAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);

  // Simulate ready state after mount
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(() => {
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        ready,
        user: authenticated ? { email: { address: "demo@vault.app" } } : null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
