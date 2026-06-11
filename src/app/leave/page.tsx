"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeaveRequestTable } from "@/components/leave/LeaveRequestTable";
import { LeaveCalendar } from "@/components/leave/LeaveCalendar";
import { LeaveService } from "@/services/leave-service";
import { EmployeeService } from "@/services/employee-service";
import { AuthService } from "@/services/auth-service";
import { LeaveRequest, Employee, LeaveStatus, AuthSession } from "@/types";
import { CalendarPlus, Loader2, List, CalendarDays, Download, TreePalm, Building2 } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/export";

type FilterStatus = "ALL" | LeaveStatus;
type ViewMode = "list" | "calendar";

export default function LeavePage() {
  const router = useRouter();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [leaveBalance, setLeaveBalance] = useState<number>(12);
  const [deptFilter, setDeptFilter] = useState<string>("ALL");

  useEffect(() => {
    const currentSession = AuthService.getSession();
    if (!currentSession?.isAuthenticated) {
      router.push("/login");
      return;
    }
    setSession(currentSession);
    loadData(currentSession);
  }, [router]);

  const loadData = async (currentSession: AuthSession) => {
    try {
      const allEmployees = await EmployeeService.getAll();
      setEmployees(allEmployees);

      if (currentSession.role === "employee" && currentSession.employeeId) {
        const myRequests = await LeaveService.getByEmployeeId(currentSession.employeeId);
        setRequests(myRequests);
        const balance = await EmployeeService.getLeaveBalance(currentSession.employeeId);
        setLeaveBalance(balance);
      } else {
        const allRequests = await LeaveService.getAll();
        setRequests(allRequests);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(depts).sort();
  }, [employees]);

  const filteredRequests = useMemo(() => {
    let result = requests;
    if (filter !== "ALL") {
      result = result.filter((r) => r.status === filter);
    }
    if (deptFilter !== "ALL") {
      const deptEmpIds = new Set(employees.filter((e) => e.department === deptFilter).map((e) => e.id));
      result = result.filter((r) => deptEmpIds.has(r.employeeId));
    }
    return result;
  }, [requests, filter, deptFilter, employees]);

  const isAdmin = session?.role === "admin";

  const handleApprove = async (id: string) => {
    await LeaveService.updateStatus(id, "APPROVED");
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "APPROVED" as LeaveStatus } : r));
    toast.success("Leave request approved");
  };

  const handleReject = async (id: string, reason?: string) => {
    await LeaveService.updateStatus(id, "REJECTED", reason);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "REJECTED" as LeaveStatus, rejectionReason: reason } : r));
    toast.error("Leave request rejected");
  };

  const handleBulkApprove = async (ids: string[]) => {
    await LeaveService.bulkUpdateStatus(ids, "APPROVED");
    setRequests((prev) => prev.map((r) => ids.includes(r.id) ? { ...r, status: "APPROVED" as LeaveStatus } : r));
    toast.success(`${ids.length} leave request(s) approved`);
  };

  const handleBulkReject = async (ids: string[], reason: string) => {
    await LeaveService.bulkUpdateStatus(ids, "REJECTED", reason);
    setRequests((prev) => prev.map((r) => ids.includes(r.id) ? { ...r, status: "REJECTED" as LeaveStatus, rejectionReason: reason } : r));
    toast.error(`${ids.length} leave request(s) rejected`);
  };

  const handleExport = () => {
    const empMap = new Map(employees.map((e) => [e.id, e.name]));
    const csvData = filteredRequests.map((r) => ({
      Employee: empMap.get(r.employeeId) ?? "Unknown",
      Type: r.leaveType ?? "ANNUAL",
      "Start Date": r.startDate,
      "End Date": r.endDate,
      Reason: r.reason,
      Status: r.status,
      "Rejection Reason": r.rejectionReason ?? "",
    }));
    exportToCSV(csvData, `leave-requests-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("Exported to CSV");
  };

  const calendarLeaves = useMemo(() => {
    const empMap = new Map(employees.map((e) => [e.id, e.name]));
    return requests.map((r) => ({
      employeeName: empMap.get(r.employeeId) ?? "Unknown",
      startDate: r.startDate,
      endDate: r.endDate,
      status: r.status,
    }));
  }, [requests, employees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? "Leave Requests" : "My Leave Requests"}
        description={isAdmin ? "Manage all employee leave requests" : "View and submit your leave requests"}
        action={
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/30 px-3 py-1.5 mr-2">
                <TreePalm className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{leaveBalance}</span>
                <span className="text-xs text-emerald-500">days left</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              onClick={() => router.push("/leave/new")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        }
      />

      {/* View Toggle + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800/50 p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "list"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "calendar"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Calendar
          </button>
        </div>

        {viewMode === "list" && (
          <>
            <Tabs defaultValue="ALL" onValueChange={(v) => setFilter(v as FilterStatus)}>
              <TabsList className="bg-emerald-50 dark:bg-emerald-950/30">
                <TabsTrigger value="ALL" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">All</TabsTrigger>
                <TabsTrigger value="PENDING" className="data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-800 dark:data-[state=active]:text-amber-300">Pending</TabsTrigger>
                <TabsTrigger value="APPROVED" className="data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-300">Approved</TabsTrigger>
                <TabsTrigger value="REJECTED" className="data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/30 data-[state=active]:text-red-800 dark:data-[state=active]:text-red-300">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            {isAdmin && departments.length > 0 && (
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[180px] h-9 text-xs border-gray-200 dark:border-gray-700">
                  <Building2 className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : viewMode === "list" ? (
        <LeaveRequestTable
          requests={filteredRequests}
          employees={employees}
          onApprove={handleApprove}
          onReject={handleReject}
          onBulkApprove={handleBulkApprove}
          onBulkReject={handleBulkReject}
          showActions={isAdmin}
        />
      ) : (
        <LeaveCalendar leaves={calendarLeaves} />
      )}
    </div>
  );
}
