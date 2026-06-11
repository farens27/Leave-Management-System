"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { EmployeeService } from "@/services/employee-service";
import { LeaveService } from "@/services/leave-service";
import { supabase } from "@/lib/supabase";
import { hashPassword, verifyPassword } from "@/utils/hash";
import { Employee, LeaveRequest, AuthSession } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Lock,
  Shield,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [allLeaveRequests, setAllLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const currentSession = AuthService.getSession();
    if (!currentSession?.isAuthenticated) {
      router.push("/login");
      return;
    }
    setSession(currentSession);
    loadProfileData(currentSession);
  }, [router]);

  const loadProfileData = async (s: AuthSession) => {
    try {
      if (s.role === "employee" && s.employeeId) {
        const [emp, leaves] = await Promise.all([
          EmployeeService.getById(s.employeeId),
          LeaveService.getByEmployeeId(s.employeeId),
        ]);
        setEmployee(emp);
        setLeaveRequests(leaves);
      }
      if (s.role === "admin") {
        const [emps, leaves] = await Promise.all([
          EmployeeService.getAll(),
          LeaveService.getAll(),
        ]);
        setAllEmployees(emps);
        setAllLeaveRequests(leaves);
      }
      setMounted(true);
    } catch {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!session) return;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      if (session.role === "employee" && session.employeeId && employee) {
        // Verify current password against stored hash
        const isValid = await verifyPassword(currentPassword, employee.password);
        if (!isValid) {
          toast.error("Current password is incorrect");
          setChangingPassword(false);
          return;
        }

        const hashedNewPassword = await hashPassword(newPassword);
        await supabase
          .from("employees")
          .update({ password: hashedNewPassword })
          .eq("id", session.employeeId);

        // Update local state
        setEmployee({ ...employee, password: hashedNewPassword });
        toast.success("Password changed successfully!");
      } else if (session.role === "admin") {
        // Admin password change — verify against hardcoded credentials
        const { CREDENTIALS } = await import("@/constants");
        if (currentPassword !== CREDENTIALS.PASSWORD) {
          toast.error("Current password is incorrect");
          setChangingPassword(false);
          return;
        }
        toast.error("Admin password cannot be changed (hardcoded credentials)");
        setChangingPassword(false);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Leave summary counts
  const leaveSummary = {
    total: leaveRequests.length,
    approved: leaveRequests.filter((r) => r.status === "APPROVED").length,
    rejected: leaveRequests.filter((r) => r.status === "REJECTED").length,
    pending: leaveRequests.filter((r) => r.status === "PENDING").length,
  };

  // Team availability for admin
  const todayStr = new Date().toISOString().split("T")[0];
  const employeesOnLeaveToday = new Set(
    allLeaveRequests
      .filter(
        (r) =>
          r.status === "APPROVED" &&
          r.startDate <= todayStr &&
          r.endDate >= todayStr
      )
      .map((r) => r.employeeId)
  );

  const leaveBalance = employee?.leaveBalance ?? 12;
  const maxLeave = 12;
  const leaveUsed = maxLeave - leaveBalance;
  const balancePercent = (leaveBalance / maxLeave) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View your profile information and manage your account settings"
      />

      <div
        className={`space-y-6 transition-all duration-700 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {/* ═══════════ PROFILE INFO CARD ═══════════ */}
        <Card className="overflow-hidden border-emerald-100/60 dark:border-emerald-900/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
          <div
            className="h-28 relative"
            style={{
              background:
                "linear-gradient(135deg, #059669 0%, #0d9488 40%, #0891b2 100%)",
            }}
          >
            {/* Decorative shapes */}
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/[0.07] blur-xl" />
            <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-teal-300/10 blur-lg" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>
          <CardContent className="-mt-10 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0 rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg">
                <Avatar
                  name={
                    session?.role === "admin"
                      ? "Admin"
                      : employee?.name ?? "User"
                  }
                  size="lg"
                />
              </div>

              <div className="flex-1 pb-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {session?.role === "admin"
                    ? "Administrator"
                    : employee?.name ?? "Employee"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  {session?.role === "admin" ? (
                    <>
                      <Shield className="h-3.5 w-3.5 text-emerald-500" />
                      System Administrator
                    </>
                  ) : (
                    <>
                      <User className="h-3.5 w-3.5 text-emerald-500" />
                      {employee?.position || "Employee"}
                      {employee?.department && ` · ${employee.department}`}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {session?.role === "admin" ? (
                <>
                  <InfoItem
                    icon={User}
                    label="Username"
                    value={session.username}
                  />
                  <InfoItem icon={Shield} label="Role" value="Admin" />
                </>
              ) : (
                <>
                  <InfoItem
                    icon={User}
                    label="Full Name"
                    value={employee?.name ?? "—"}
                  />
                  <InfoItem
                    icon={Shield}
                    label="Department"
                    value={employee?.department ?? "—"}
                  />
                  <InfoItem
                    icon={KeyRound}
                    label="Position"
                    value={employee?.position ?? "—"}
                  />
                  <InfoItem
                    icon={Lock}
                    label="Username"
                    value={employee?.username ?? "—"}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ═══════════ EMPLOYEE-ONLY SECTIONS ═══════════ */}
        {session?.role === "employee" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Leave Balance ── */}
            <Card className="border-emerald-100/60 dark:border-emerald-900/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                    <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Leave Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {leaveUsed} of {maxLeave} days used
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {leaveBalance} remaining
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${balancePercent}%`,
                        background:
                          balancePercent > 50
                            ? "linear-gradient(90deg, #059669, #0d9488)"
                            : balancePercent > 25
                            ? "linear-gradient(90deg, #f59e0b, #d97706)"
                            : "linear-gradient(90deg, #ef4444, #dc2626)",
                      }}
                    />
                  </div>
                </div>

                {/* Balance Detail */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/20 p-3 text-center">
                    <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                      {maxLeave}
                    </p>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/20 p-3 text-center">
                    <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                      {leaveUsed}
                    </p>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Used
                    </p>
                  </div>
                  <div className="rounded-xl bg-teal-50/80 dark:bg-teal-950/20 border border-teal-100/50 dark:border-teal-900/20 p-3 text-center">
                    <p className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
                      {leaveBalance}
                    </p>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Left
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Leave History Summary ── */}
            <Card className="border-emerald-100/60 dark:border-emerald-900/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/50">
                    <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  Leave History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <SummaryCard
                    label="Total Requests"
                    value={leaveSummary.total}
                    color="emerald"
                    icon={CalendarDays}
                  />
                  <SummaryCard
                    label="Approved"
                    value={leaveSummary.approved}
                    color="teal"
                    icon={CheckCircle2}
                  />
                  <SummaryCard
                    label="Rejected"
                    value={leaveSummary.rejected}
                    color="rose"
                    icon={XCircle}
                  />
                  <SummaryCard
                    label="Pending"
                    value={leaveSummary.pending}
                    color="amber"
                    icon={Clock}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════ CHANGE PASSWORD ═══════════ */}
        <Card className="border-emerald-100/60 dark:border-emerald-900/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50">
                <KeyRound className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm"
              >
                {changingPassword ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                {changingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ═══════════ TEAM AVAILABILITY (ADMIN ONLY) ═══════════ */}
        {session?.role === "admin" && allEmployees.length > 0 && (
          <Card className="border-emerald-100/60 dark:border-emerald-900/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                  <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                Team Availability Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allEmployees.map((emp) => {
                  const isOnLeave = employeesOnLeaveToday.has(emp.id);
                  return (
                    <div
                      key={emp.id}
                      className={`flex items-center gap-3 rounded-xl p-3 transition-all duration-200 border ${
                        isOnLeave
                          ? "bg-rose-50/50 dark:bg-rose-950/10 border-rose-100/60 dark:border-rose-900/20"
                          : "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100/60 dark:border-emerald-900/20"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar name={emp.name} size="md" />
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${
                            isOnLeave ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {emp.name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                          {emp.department} · {emp.position}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOnLeave
                            ? "text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/40"
                            : "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/40"
                        }`}
                      >
                        {isOnLeave ? "On Leave" : "Available"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ─── Helper Components ─── */

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100/60 dark:border-gray-700/30 p-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: {
    bg: "bg-emerald-50/80 dark:bg-emerald-950/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100/50 dark:border-emerald-900/20",
  },
  teal: {
    bg: "bg-teal-50/80 dark:bg-teal-950/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-100/50 dark:border-teal-900/20",
  },
  rose: {
    bg: "bg-rose-50/80 dark:bg-rose-950/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100/50 dark:border-rose-900/20",
  },
  amber: {
    bg: "bg-amber-50/80 dark:bg-amber-950/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100/50 dark:border-amber-900/20",
  },
};

function SummaryCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const c = colorMap[color] ?? colorMap.emerald;
  return (
    <div
      className={`rounded-xl ${c.bg} border ${c.border} p-4 flex items-center gap-3`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${c.bg}`}
      >
        <Icon className={`h-5 w-5 ${c.text}`} />
      </div>
      <div>
        <p className={`text-xl font-extrabold ${c.text}`}>{value}</p>
        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}
