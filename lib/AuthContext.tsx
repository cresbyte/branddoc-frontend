"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser, getStoredUser, clearTokens, getAccessToken } from "./auth";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initial check
    const storedUser = getStoredUser();
    const token = getAccessToken();
    
    if (storedUser && token) {
      setUser(storedUser);
      // Sync cookie if missing
      if (!Cookies.get("authenticated")) {
        Cookies.set("authenticated", "true", { expires: 7 });
      }
    } else {
      clearTokens();
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
