"use client";

import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  count: number;
  icon: LucideIcon;
  accentColor: string;
  iconBg: string;
  iconText: string;
  trend?: string;
};

export function StatsCard({ title, count, icon: Icon, accentColor, iconBg, iconText, trend }: StatsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-emerald-100/60 dark:border-emerald-900/20 bg-white dark:bg-gray-900/80 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/5 hover:-translate-y-0.5">
      {/* Background glow */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${accentColor} opacity-[0.07] blur-2xl transition-all duration-500 group-hover:opacity-[0.14] group-hover:scale-150`} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{count}</p>
            {trend && (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{trend}</span>
            )}
          </div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} shadow-sm`}>
          <Icon className={`h-5 w-5 ${iconText}`} />
        </div>
      </div>

      {/* Animated bottom accent */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 ${accentColor} transition-all duration-500 ease-out group-hover:w-full`} />
    </div>
  );
}
