"use client";

import { useState } from "react";
import { codeReviewReport, ReviewFinding, ReviewHistory } from "@/data/code-review-data";
import {
  ShieldCheck, ShieldAlert, AlertTriangle, Info, CheckCircle2, XCircle,
  BarChart3, FileText, ArrowLeft, ChevronDown, ChevronUp, Leaf, Filter,
  History, ArrowUpRight, Wrench, Clock, TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

const severityConfig: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Critical: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-900/50", icon: ShieldAlert },
  High: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-900/50", icon: AlertTriangle },
  Medium: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-900/50", icon: Info },
  Low: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-900/50", icon: CheckCircle2 },
};

const PIE_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#10b981"];

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = severityConfig[severity];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: "PASS" | "FAIL" | "FIXED" }) {
  if (status === "FIXED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase">
        <Wrench className="h-3 w-3" /> Fixed
      </span>
    );
  }
  return status === "PASS" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
      <CheckCircle2 className="h-3 w-3" /> Pass
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 px-2.5 py-0.5 text-[11px] font-bold text-red-700 dark:text-red-300 uppercase">
      <XCircle className="h-3 w-3" /> Fail
    </span>
  );
}

function FindingCard({ finding }: { finding: ReviewFinding }) {
  const [open, setOpen] = useState(false);
  const cfg = finding.status === "FIXED" 
    ? { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-900/50", icon: Wrench }
    : severityConfig[finding.severity];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
      >
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${cfg.bg} border ${cfg.border}`}>
          <Icon className={`h-5 w-5 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{finding.area}</span>
            <StatusBadge status={finding.status} />
            {finding.status === "FIXED" && finding.originalStatus && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                was <span className={finding.originalStatus === "FAIL" ? "text-red-400" : "text-emerald-400"}>{finding.originalStatus}</span>
              </span>
            )}
            <SeverityBadge severity={finding.severity} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{finding.finding.slice(0, 120)}...</p>
        </div>
        <span className="text-gray-400">
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>
      {open && (
        <div className="border-t border-inherit px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {/* Fix description (for FIXED items) */}
          {finding.status === "FIXED" && finding.fixDescription && (
            <div className="rounded-lg bg-blue-100/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-0.5">
                    Fixed in v{finding.fixedInVersion}
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300/80 leading-relaxed">{finding.fixDescription}</p>
                </div>
              </div>
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Current Status</h4>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{finding.finding}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Recommendation</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{finding.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryTimeline({ history }: { history: ReviewHistory[] }) {
  return (
    <div className="space-y-0">
      {history.map((entry, idx) => (
        <div key={entry.version} className="relative flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 z-10 ${
              idx === history.length - 1
                ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
            }`}>
              {idx === history.length - 1 ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </div>
            {idx < history.length - 1 && (
              <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-300 dark:from-gray-700 to-gray-200 dark:to-gray-800 min-h-[20px]" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">v{entry.version}</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{entry.date}</span>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {entry.scoreChange.from} → {entry.scoreChange.to}
                </span>
              </div>
            </div>
            <ul className="space-y-1">
              {entry.changes.map((change, ci) => (
                <li key={ci} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CodeReviewPage() {
  const report = codeReviewReport;
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredFindings = report.findings.filter((f) => {
    if (filterSeverity && f.severity !== filterSeverity) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    return true;
  });

  const barData = [
    { name: "Critical", count: report.summary.critical, fill: "#ef4444" },
    { name: "High", count: report.summary.high, fill: "#f97316" },
    { name: "Medium", count: report.summary.medium, fill: "#f59e0b" },
    { name: "Low", count: report.summary.low, fill: "#10b981" },
  ];

  const pieData = [
    { name: "Critical", value: report.summary.critical },
    { name: "High", value: report.summary.high },
    { name: "Medium", value: report.summary.medium },
    { name: "Low", value: report.summary.low },
  ].filter((d) => d.value > 0);

  const passCount = report.findings.filter((f) => f.status === "PASS").length;
  const failCount = report.findings.filter((f) => f.status === "FAIL").length;
  const fixedCount = report.findings.filter((f) => f.status === "FIXED").length;
  const totalFindings = report.summary.critical + report.summary.high + report.summary.medium + report.summary.low;

  // Score: higher because most issues are fixed
  const passRate = (passCount + fixedCount) / report.findings.length;
  const severityPenalty = report.summary.critical * 5 + report.summary.high * 2;
  const overallScore = Math.round(Math.max(0, Math.min(100, passRate * 100 - severityPenalty)));

  // Score history for the line chart
  const scoreHistory = report.history.map((h) => ({
    version: `v${h.version}`,
    score: h.scoreChange.to,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-[#030712]">
      {/* ═══ Header ═══ */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Code Review Report</h1>
              <p className="text-[11px] text-gray-400">LeaveManager v{report.version} • {report.reviewDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
        {/* ═══ Conclusion Banner ═══ */}
        <div className="relative overflow-hidden rounded-2xl p-8"
          style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 25%, #0f766e 50%, #155e75 100%)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/[0.08] blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-teal-300/[0.06] blur-2xl" />
          <div className="absolute right-1/4 top-0 h-32 w-32 rounded-full bg-cyan-400/[0.05] blur-2xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300/70" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/60">Final Verdict</p>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">{report.conclusion.verdict}</h2>
              <p className="text-sm text-emerald-100/50 leading-relaxed max-w-md">
                {report.conclusion.subtitle}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-semibold text-emerald-300/80">{report.conclusion.action}</p>
              </div>
              <p className="text-[11px] text-emerald-100/40">
                First reviewed on <span className="font-bold text-emerald-100/70">{report.firstReviewDate}</span> •
                Latest by <span className="font-bold text-emerald-100/70">{report.reviewer}</span>
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="text-center rounded-2xl bg-white/[0.08] backdrop-blur-md px-6 py-4 border border-white/[0.08] shadow-lg shadow-black/10">
                <p className="text-3xl font-extrabold text-white">{totalFindings}</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Open</p>
              </div>
              <div className="text-center rounded-2xl bg-emerald-400/[0.12] backdrop-blur-md px-6 py-4 border border-emerald-400/[0.15] shadow-lg shadow-emerald-900/20">
                <p className="text-3xl font-extrabold text-emerald-300">{passCount}</p>
                <p className="text-[10px] text-emerald-300/50 font-bold uppercase tracking-wider mt-0.5">Passed</p>
              </div>
              <div className="text-center rounded-2xl bg-blue-400/[0.12] backdrop-blur-md px-6 py-4 border border-blue-400/[0.15] shadow-lg shadow-blue-900/20">
                <p className="text-3xl font-extrabold text-blue-300">{fixedCount}</p>
                <p className="text-[10px] text-blue-300/50 font-bold uppercase tracking-wider mt-0.5">Fixed</p>
              </div>
              <div className="text-center rounded-2xl bg-rose-400/[0.12] backdrop-blur-md px-6 py-4 border border-rose-400/[0.15] shadow-lg shadow-rose-900/20">
                <p className="text-3xl font-extrabold text-rose-300">{failCount}</p>
                <p className="text-[10px] text-rose-300/50 font-bold uppercase tracking-wider mt-0.5">Failed</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Score Section ═══ */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Overall Score Gauge */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-6 shadow-sm flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Overall Security Score</p>
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8"
                  className="text-gray-100 dark:text-gray-800" />
                <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 327} 327`}
                  className={overallScore >= 70 ? "text-emerald-500" : overallScore >= 50 ? "text-amber-500" : "text-red-500"}
                  stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold ${overallScore >= 70 ? "text-emerald-600 dark:text-emerald-400" : overallScore >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                  {overallScore}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">/100</span>
              </div>
            </div>
            <p className={`text-xs font-bold mt-3 ${overallScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : overallScore >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
              {overallScore >= 80 ? "Good" : overallScore >= 60 ? "Needs Improvement" : "At Risk"}
            </p>
            {/* Score improvement badge */}
            <div className="flex items-center gap-1 mt-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 border border-emerald-200 dark:border-emerald-800/40">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+{overallScore - 62} from v1.0</span>
            </div>
          </div>

          {/* Pass / Fail / Fixed Breakdown */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Finding Status</p>
            <div className="space-y-4">
              {/* Passed */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Passed</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{passCount}/{report.findings.length}</span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(passCount / report.findings.length) * 100}%` }} />
                </div>
              </div>
              {/* Fixed */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Fixed</span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{fixedCount}/{report.findings.length}</span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(fixedCount / report.findings.length) * 100}%` }} />
                </div>
              </div>
              {/* Failed */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Failed</span>
                  </div>
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">{failCount}/{report.findings.length}</span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(failCount / report.findings.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Severity Score Cards */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Remaining Issues</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 text-center">
                <ShieldAlert className="h-5 w-5 text-red-500 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-red-600 dark:text-red-400">{report.summary.critical}</p>
                <p className="text-[9px] font-bold text-red-500/60 uppercase tracking-wider">Critical</p>
              </div>
              <div className="rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 p-3 text-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400">{report.summary.high}</p>
                <p className="text-[9px] font-bold text-orange-500/60 uppercase tracking-wider">High</p>
              </div>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3 text-center">
                <Info className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{report.summary.medium}</p>
                <p className="text-[9px] font-bold text-amber-500/60 uppercase tracking-wider">Medium</p>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-3 text-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{report.summary.low}</p>
                <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-wider">Low</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Charts ═══ */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Bar Chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Remaining by Severity</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Severity Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={PIE_COLORS[["Critical", "High", "Medium", "Low"].indexOf(entry.name)] ?? "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Score Trend Line Chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Score Progression</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis dataKey="version" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ═══ History Section ═══ */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Review History</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {report.history.length} reviews
              </span>
            </div>
            <span className="text-gray-400">
              {showHistory ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </span>
          </button>
          {showHistory && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-5 animate-in slide-in-from-top-2">
              <HistoryTimeline history={report.history} />
            </div>
          )}
        </div>

        {/* ═══ Filter ═══ */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity:</span>
          {["Critical", "High", "Medium", "Low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all border ${
                filterSeverity === sev
                  ? `${severityConfig[sev].color} ${severityConfig[sev].bg} ${severityConfig[sev].border}`
                  : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {sev}
            </button>
          ))}
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status:</span>
          {(["PASS", "FIXED", "FAIL"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(filterStatus === st ? null : st)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all border ${
                filterStatus === st
                  ? st === "FIXED"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50"
                    : st === "PASS"
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50"
                      : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50"
                  : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {st}
            </button>
          ))}
          {(filterSeverity || filterStatus) && (
            <button onClick={() => { setFilterSeverity(null); setFilterStatus(null); }} className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline ml-1">
              Clear All
            </button>
          )}
        </div>

        {/* ═══ Findings ═══ */}
        <div className="space-y-3">
          {filteredFindings.map((f, i) => (
            <FindingCard key={i} finding={f} />
          ))}
        </div>

        {/* ═══ Footer ═══ */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Report generated by {report.reviewer} • {report.application} v{report.version} • First reviewed: {report.firstReviewDate}
          </p>
        </div>
      </div>
    </div>
  );
}
