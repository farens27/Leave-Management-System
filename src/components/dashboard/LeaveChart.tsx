"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { LeaveRequest, LeaveStatus } from "@/types";
import { useTheme } from "next-themes";
import { useEffect, useState, useMemo, useCallback } from "react";
import { BarChart3, X } from "lucide-react";

type LeaveChartProps = {
  requests: LeaveRequest[];
  onFilterChange?: (status: LeaveStatus | null) => void;
  activeFilter?: LeaveStatus | null;
};

type ChartDataPoint = {
  date: string;
  approved: number;
  pending: number;
  rejected: number;
  total: number;
  rawDate: string;
};

type StatusKey = "approved" | "pending" | "rejected";

const STATUS_CONFIG: Record<StatusKey, { color: string; dim: string; label: string; status: LeaveStatus }> = {
  approved: { color: "#34d399", dim: "#059669", label: "Approved", status: "APPROVED" },
  pending: { color: "#fbbf24", dim: "#d97706", label: "Pending", status: "PENDING" },
  rejected: { color: "#fb7185", dim: "#e11d48", label: "Rejected", status: "REJECTED" },
};

function buildChartData(requests: LeaveRequest[]): ChartDataPoint[] {
  const dateMap = new Map<string, { approved: number; pending: number; rejected: number; rawDate: string }>();

  for (const req of requests) {
    const dateKey = new Date(req.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, { approved: 0, pending: 0, rejected: 0, rawDate: req.startDate });
    }

    const entry = dateMap.get(dateKey)!;
    if (req.status === "APPROVED") entry.approved++;
    else if (req.status === "PENDING") entry.pending++;
    else if (req.status === "REJECTED") entry.rejected++;
  }

  return Array.from(dateMap.entries())
    .sort((a, b) => new Date(a[1].rawDate).getTime() - new Date(b[1].rawDate).getTime())
    .slice(-14)
    .map(([date, counts]) => ({
      date,
      ...counts,
      total: counts.approved + counts.pending + counts.rejected,
    }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const visibleEntries = payload.filter((e: { value: number }) => e.value > 0);
  if (visibleEntries.length === 0) return null;

  return (
    <div className="rounded-xl border border-emerald-500/10 bg-gray-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-[11px] font-bold text-emerald-300 mb-2">{label}</p>
      <div className="space-y-1.5">
        {visibleEntries.map((entry: { name: string; value: number; color: string }, i: number) => (
          <div key={i} className="flex items-center justify-between gap-6 text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-white/60">{entry.name}</span>
            </div>
            <span className="font-bold text-white tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaveChart({ requests, onFilterChange, activeFilter }: LeaveChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visibleBars, setVisibleBars] = useState<Set<StatusKey>>(new Set(["approved", "pending", "rejected"]));

  useEffect(() => setMounted(true), []);

  const data = useMemo(() => buildChartData(requests), [requests]);
  const isDark = resolvedTheme === "dark";

  const toggleBar = useCallback((key: StatusKey) => {
    setVisibleBars((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleBarClick = useCallback((status: LeaveStatus) => {
    if (onFilterChange) {
      onFilterChange(activeFilter === status ? null : status);
    }
  }, [onFilterChange, activeFilter]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[280px]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[240px] text-center">
        <BarChart3 className="h-8 w-8 text-emerald-500/20 mb-2" />
        <p className="text-xs text-muted-foreground/50">No leave data yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend + Filter indicator */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          {(Object.entries(STATUS_CONFIG) as [StatusKey, typeof STATUS_CONFIG[StatusKey]][]).map(([key, config]) => {
            const isVisible = visibleBars.has(key);
            return (
              <button
                key={key}
                onClick={() => toggleBar(key)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-200 cursor-pointer select-none border ${
                  isVisible
                    ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                    : "border-transparent opacity-40 hover:opacity-60"
                }`}
              >
                <div
                  className="h-2 w-2 rounded-full transition-all duration-200"
                  style={{ backgroundColor: isVisible ? config.color : isDark ? "#555" : "#bbb" }}
                />
                <span className={isVisible ? "" : "line-through"}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>

        {activeFilter && (
          <button
            onClick={() => onFilterChange?.(null)}
            className="flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 transition-all hover:bg-emerald-200 dark:hover:bg-emerald-800/40 cursor-pointer"
          >
            Filtered: {activeFilter.charAt(0) + activeFilter.slice(1).toLowerCase()}
            <X className="h-2.5 w-2.5 ml-0.5" />
          </button>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="25%" barGap={2}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: isDark ? "#6b7280" : "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            dy={5}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10, fill: isDark ? "#6b7280" : "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}
          />

          {(Object.entries(STATUS_CONFIG) as [StatusKey, typeof STATUS_CONFIG[StatusKey]][]).map(([key, config]) => {
            if (!visibleBars.has(key)) return null;
            const isActive = activeFilter === config.status;
            const isOtherActive = activeFilter && activeFilter !== config.status;

            return (
              <Bar
                key={key}
                dataKey={key}
                name={config.label}
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                onClick={() => handleBarClick(config.status)}
                animationDuration={500}
                animationEasing="ease-out"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={isActive ? config.dim : config.color}
                    fillOpacity={isOtherActive ? 0.15 : isActive ? 1 : 0.8}
                  />
                ))}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>

      <p className="text-[10px] text-center text-muted-foreground/30 select-none">
        Click legend to toggle • Click bars to filter activity
      </p>
    </div>
  );
}
