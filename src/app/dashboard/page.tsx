"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LeaveChart } from "@/components/dashboard/LeaveChart";
import { EmployeeService } from "@/services/employee-service";
import { LeaveService } from "@/services/leave-service";
import { AuthService } from "@/services/auth-service";
import { LeaveRequest, Employee, LeaveStatusCounts, LeaveStatus } from "@/types";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  CalendarDays,
  BarChart3,
  Leaf,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStatusStyle(status: string) {
  switch (status) {
    case "APPROVED":
      return { dot: "bg-emerald-500", badge: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40" };
    case "REJECTED":
      return { dot: "bg-rose-500", badge: "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40" };
    default:
      return { dot: "bg-amber-500", badge: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40" };
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [leaveCounts, setLeaveCounts] = useState<LeaveStatusCounts>({ pending: 0, approved: 0, rejected: 0 });
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState<LeaveStatus | null>(null);

  useEffect(() => {
    const session = AuthService.getSession();
    if (!session?.isAuthenticated) { router.push("/login"); return; }
    if (session.role !== "admin") { router.push("/leave"); return; }
    loadDashboard();
  }, [router]);

  const loadDashboard = async () => {
    try {
      const [allEmployees, allRequests, counts] = await Promise.all([
        EmployeeService.getAll(),
        LeaveService.getAll(),
        LeaveService.countByStatus(),
      ]);
      setTotalEmployees(allEmployees.length);
      setLeaveCounts(counts);
      setRequests(allRequests);
      setEmployees(allEmployees);
      setMounted(true);
    } catch {
      // Silently handle - empty dashboard
    } finally {
      setLoading(false);
    }
  };

  const recentRequests = useMemo(() => {
    const filtered = chartFilter ? requests.filter((r) => r.status === chartFilter) : requests;
    return [...filtered]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 6);
  }, [requests, chartFilter]);

  const getEmployeeName = (id: string) => employees.find((e) => e.id === id)?.name ?? "Unknown";

  const activityTitle = chartFilter
    ? `${chartFilter.charAt(0) + chartFilter.slice(1).toLowerCase()} Requests`
    : "Recent Activity";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ═══════════ WELCOME BANNER ═══════════ */}
      <div className={`relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 40%, #0891b2 100%)" }}
      >
        {/* Decorative shapes */}
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/[0.07] blur-xl" />
        <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-teal-300/10 blur-lg" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-200" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Dashboard</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">{getGreeting()}, Admin</h1>
            <p className="text-sm text-white/60">
              {leaveCounts.pending > 0 ? (
                <>You have <span className="font-bold text-amber-300">{leaveCounts.pending} pending</span> request{leaveCounts.pending !== 1 ? "s" : ""} awaiting review.</>
              ) : (
                <>All caught up — no pending requests today! 🎉</>
              )}
            </p>
          </div>
          <Link href="/leave">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/10 backdrop-blur-sm shadow-none transition-all">
              Review Requests
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ═══════════ STATS ═══════════ */}
      <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-700 delay-100 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        <StatsCard
          title="Employees"
          count={totalEmployees}
          icon={Users}
          accentColor="bg-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          iconText="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          title="Pending"
          count={leaveCounts.pending}
          icon={Clock}
          accentColor="bg-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/50"
          iconText="text-amber-600 dark:text-amber-400"
        />
        <StatsCard
          title="Approved"
          count={leaveCounts.approved}
          icon={CheckCircle2}
          accentColor="bg-teal-500"
          iconBg="bg-teal-50 dark:bg-teal-950/50"
          iconText="text-teal-600 dark:text-teal-400"
        />
        <StatsCard
          title="Rejected"
          count={leaveCounts.rejected}
          icon={XCircle}
          accentColor="bg-rose-500"
          iconBg="bg-rose-50 dark:bg-rose-950/50"
          iconText="text-rose-600 dark:text-rose-400"
        />
      </div>

      {/* ═══════════ CHART + ACTIVITY ═══════════ */}
      <div className={`grid gap-4 lg:grid-cols-5 transition-all duration-700 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>

        {/* ── Chart Panel ── */}
        <div className="lg:col-span-3 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/20 bg-white dark:bg-gray-900/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Leave Overview</h2>
          </div>
          <LeaveChart
            requests={requests}
            onFilterChange={setChartFilter}
            activeFilter={chartFilter}
          />
        </div>

        {/* ── Activity Panel ── */}
        <div className="lg:col-span-2 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/20 bg-white dark:bg-gray-900/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">{activityTitle}</h2>
            </div>
            <Link href="/leave" className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
              View all →
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[260px] text-center">
              <CalendarDays className="h-8 w-8 text-emerald-500/15 mb-3" />
              <p className="text-xs text-gray-400 dark:text-gray-600">
                {chartFilter ? `No ${chartFilter.toLowerCase()} requests` : "No recent activity"}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recentRequests.map((req, i) => {
                const status = getStatusStyle(req.status);
                const initials = getEmployeeName(req.employeeId).split(" ").map((n) => n[0]).join("").slice(0, 2);
                return (
                  <div
                    key={req.id}
                    className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                    style={{
                      opacity: 0,
                      transform: "translateX(8px)",
                      animationName: "fadeSlideIn",
                      animationDuration: "0.3s",
                      animationTimingFunction: "ease-out",
                      animationFillMode: "forwards",
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/60 dark:to-teal-900/60 ring-1 ring-emerald-200/50 dark:ring-emerald-800/30">
                        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">{initials}</span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${status.dot} ring-2 ring-white dark:ring-gray-900`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {getEmployeeName(req.employeeId)}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {formatDate(req.startDate)} – {formatDate(req.endDate)}
                      </p>
                    </div>

                    {/* Status */}
                    <Badge variant="outline" className={`text-[9px] px-2 py-0 h-[18px] border-0 font-semibold rounded-full ${status.badge}`}>
                      {req.status.charAt(0) + req.status.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
