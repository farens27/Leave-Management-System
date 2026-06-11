"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthStorageService } from "@/services/auth-storage";
import { AuthSession } from "@/types";

export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentSession = AuthStorageService.getSession();
    setSession(currentSession);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (username: string, password: string): AuthSession | null => {
      const result = AuthStorageService.login(username, password);
      if (result) {
        setSession(result);
        router.push(result.role === "admin" ? "/dashboard" : "/leave");
      }
      return result;
    },
    [router]
  );

  const logout = useCallback(() => {
    AuthStorageService.logout();
    setSession(null);
    router.push("/login");
  }, [router]);

  return {
    session,
    isAuthenticated: session?.isAuthenticated ?? false,
    isAdmin: session?.role === "admin",
    isLoading,
    login,
    logout,
  };
}
