"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { ActivityLogService, ActivityLogEntry } from "@/services/activity-log-service";
import {
  Activity, ShieldAlert, LogIn, LogOut, UserPlus, UserMinus, Pencil,
  CalendarPlus, CheckCircle2, XCircle, AlertTriangle, Loader2, Filter, Leaf
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell,
} from "recharts";

const eventConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  LOGIN_SUCCESS: { label: "Login Success", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: LogIn },
  LOGIN_FAILED: { label: "Login Failed", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", icon: ShieldAlert },
  LOGOUT: { label: "Logout", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-800/50", icon: LogOut },
  EMPLOYEE_CREATED: { label: "Employee Created", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30", icon: UserPlus },
  EMPLOYEE_UPDATED: { label: "Employee Updated", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/30", icon: Pencil },
  EMPLOYEE_DELETED: { label: "Employee Deleted", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", icon: UserMinus },
  LEAVE_CREATED: { label: "Leave Created", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", icon: CalendarPlus },
  LEAVE_APPROVED: { label: "Leave Approved", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: CheckCircle2 },
  LEAVE_REJECTED: { label: "Leave Rejected", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30", icon: XCircle },
  ERROR: { label: "Error", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", icon: AlertTriangle },
};

const PIE_COLORS = ["#10b981", "#ef4444", "#94a3b8", "#14b8a6", "#06b6d4", "#f97316", "#3b82f6", "#10b981", "#f43f5e", "#f59e0b"];

export default function LogMonitoringPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [dailyData, setDailyData] = useState<{ date: string; logins: number; failures: number; logouts: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    const session = AuthService.getSession();
    if (!session?.isAuthenticated) { router.push("/login"); return; }
    if (session.role !== "admin") { router.push("/leave"); return; }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [allLogs, allStats, daily] = await Promise.all([
        ActivityLogService.getAll(200),
        ActivityLogService.getStats(),
        ActivityLogService.getRecentByDay(7),
      ]);
      setLogs(allLogs);
      setStats(allStats);
      setDailyData(daily);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filterType ? logs.filter((l) => l.event_type === filterType) : logs;

  const pieData = Object.entries(stats).map(([name, value]) => ({ name: eventConfig[name]?.label || name, value }));
  const totalEvents = Object.values(stats).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Log Monitoring"
        description="Track all user activity, login attempts, and system events"
      />

      {/* ═══ Stats Cards ═══ */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-100/60 dark:border-emerald-900/20 bg-white dark:bg-gray-900/80 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
              <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalEvents}</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Events</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100/60 dark:border-emerald-900/20 bg-white dark:bg-gray-900/80 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
              <LogIn className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.LOGIN_SUCCESS || 0}</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Successful Logins</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-100/60 dark:border-red-900/20 bg-white dark:bg-gray-900/80 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/50">
              <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.LOGIN_FAILED || 0}</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Failed Logins</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100/60 dark:border-gray-800/50 bg-white dark:bg-gray-900/80 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.LOGOUT || 0}</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Logouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Charts ═══ */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Daily Activity Chart */}
        <div className="lg:col-span-3 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/20 bg-white dark:bg-gray-900/80 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Login Activity (Last 7 Days)
          </h3>
          {dailyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
              <Activity className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-xs">No activity data yet. Events will appear here.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Bar dataKey="logins" fill="#10b981" name="Logins" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failures" fill="#ef4444" name="Failed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="logouts" fill="#94a3b8" name="Logouts" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Event Distribution Pie */}
        <div className="lg:col-span-2 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/20 bg-white dark:bg-gray-900/80 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Event Distribution
          </h3>
          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
              <Leaf className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-xs">No events recorded yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ═══ Filter ═══ */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-gray-400" />
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filter:</span>
        {Object.entries(eventConfig).map(([key, cfg]) => {
          const count = stats[key] || 0;
          if (count === 0 && filterType !== key) return null;
          return (
            <button
              key={key}
              onClick={() => setFilterType(filterType === key ? null : key)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-all border ${
                filterType === key
                  ? `${cfg.color} ${cfg.bg} border-current`
                  : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
        {filterType && (
          <button onClick={() => setFilterType(null)} className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline ml-1">
            Clear
          </button>
        )}
      </div>

      {/* ═══ Log Feed ═══ */}
      <div className="rounded-2xl border border-emerald-100/60 dark:border-emerald-900/20 bg-white dark:bg-gray-900/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Activity Feed ({filteredLogs.length} events)</h3>
        </div>
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Activity className="h-10 w-10 mb-3 opacity-15" />
            <p className="text-sm font-medium">No activity logs yet</p>
            <p className="text-xs mt-1">Events will appear here as users interact with the system.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800/50 max-h-[500px] overflow-y-auto">
            {filteredLogs.map((log) => {
              const cfg = eventConfig[log.event_type] || eventConfig.ERROR;
              const Icon = cfg.icon;
              const time = new Date(log.created_at).toLocaleString("en-US", {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
              });
              return (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{log.username || "unknown"}</span>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 font-semibold border-0 ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </Badge>
                      {log.role && (
                        <span className="text-[9px] text-gray-400 font-medium">{log.role}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 font-mono">{time}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
