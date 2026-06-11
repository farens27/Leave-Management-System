"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, LogOut, Menu, X, Shield, User, Leaf, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthService } from "@/services/auth-service";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { Avatar } from "@/components/shared/Avatar";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { AuthSession } from "@/types";

const adminNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Leave Requests", href: "/leave", icon: CalendarDays },
  { label: "Logs", href: "/logs", icon: Activity },
];

const employeeNavItems = [
  { label: "My Leave", href: "/leave", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useSessionExpiry(30);

  useEffect(() => {
    setSession(AuthService.getSession());
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = session?.role === "admin";
  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/login");
  };

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm" 
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={isAdmin ? "/dashboard" : "/leave"} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="hidden text-lg font-extrabold text-gray-900 dark:text-white sm:block tracking-tight">
              LeaveManager
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-white/10 dark:text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <div className="ml-2 h-6 w-px bg-gray-200 dark:bg-white/10" />

            {/* User info */}
            <div className="ml-2 flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-white/5 px-2.5 py-1.5">
                <Avatar name={session?.username ?? ""} size="sm" />
                {isAdmin ? (
                  <Shield className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{session?.username}</span>
                <Badge className={`text-[10px] px-1.5 py-0 h-4 ${
                  isAdmin
                    ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
                    : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                }`}>
                  {isAdmin ? "Admin" : "Employee"}
                </Badge>
              </div>
            </div>

            <NotificationBell />

            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-1 text-gray-500 hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 font-semibold"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <NotificationBell />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="border-t border-gray-100 dark:border-white/10 pb-4 pt-2 md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl absolute left-0 right-0 px-4 shadow-xl">
            {/* Mobile user info */}
            <div className="mb-3 flex items-center gap-2 px-3 py-2">
              {isAdmin ? (
                <Shield className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              ) : (
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className="text-sm font-bold text-gray-900 dark:text-white">{session?.username}</span>
              <Badge className={`text-[10px] px-1.5 py-0 h-4 ${
                isAdmin
                  ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
                  : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
              }`}>
                {isAdmin ? "Admin" : "Employee"}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-white/10 dark:text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="justify-start text-gray-600 hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 font-semibold"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
