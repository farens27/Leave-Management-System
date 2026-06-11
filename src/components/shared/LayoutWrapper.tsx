"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Toaster } from "sonner";
import { ReactNode } from "react";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStandalonePage = pathname === "/login" || pathname === "/" || pathname === "/code-review";

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      {isStandalonePage ? (
        children
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 dark:from-gray-950 dark:via-emerald-950/20 dark:to-teal-950/10 transition-colors duration-300">
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      )}
    </>
  );
}

