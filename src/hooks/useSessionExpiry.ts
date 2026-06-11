"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth-service";

export function useSessionExpiry(timeoutMinutes: number = 30): void {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  const handleExpiry = useCallback(async () => {
    clearTimers();
    await AuthService.logout();
    toast.error("Session expired due to inactivity");
    router.push("/login");
  }, [clearTimers, router]);

  const resetTimers = useCallback(() => {
    if (!AuthService.isAuthenticated()) return;

    clearTimers();

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = timeoutMs - 2 * 60 * 1000;

    // Only show warning if timeout is longer than 2 minutes
    if (warningMs > 0) {
      warningRef.current = setTimeout(() => {
        toast.warning("Session expiring soon. Move your mouse to stay logged in.");
      }, warningMs);
    }

    timeoutRef.current = setTimeout(() => {
      handleExpiry();
    }, timeoutMs);
  }, [timeoutMinutes, clearTimers, handleExpiry]);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) return;

    const activityEvents: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
    ];

    // Start initial timers
    resetTimers();

    const handleActivity = () => {
      resetTimers();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearTimers();
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimers, clearTimers]);
}
