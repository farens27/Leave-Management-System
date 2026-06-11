"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeaveRequestTable } from "@/components/leave/LeaveRequestTable";
import { LeaveService } from "@/services/leave-service";
import { EmployeeService } from "@/services/employee-service";
import { AuthService } from "@/services/auth-service";
import { LeaveRequest, Employee, LeaveStatus, AuthSession } from "@/types";
import { CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FilterStatus = "ALL" | LeaveStatus;

export default function LeavePage() {
  const router = useRouter();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

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

  const filteredRequests = useMemo(() => {
    if (filter === "ALL") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const isAdmin = session?.role === "admin";

  const handleApprove = async (id: string) => {
    await LeaveService.updateStatus(id, "APPROVED");
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "APPROVED" as LeaveStatus } : r));
    toast.success("Leave request approved");
  };

  const handleReject = async (id: string) => {
    await LeaveService.updateStatus(id, "REJECTED");
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "REJECTED" as LeaveStatus } : r));
    toast.error("Leave request rejected");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? "Leave Requests" : "My Leave Requests"}
        description={isAdmin ? "Manage all employee leave requests" : "View and submit your leave requests"}
        action={
          <Button
            onClick={() => router.push("/leave/new")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        }
      />

      <Tabs defaultValue="ALL" onValueChange={(v) => setFilter(v as FilterStatus)}>
        <TabsList className="bg-emerald-50 dark:bg-emerald-950/30">
          <TabsTrigger value="ALL" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">All</TabsTrigger>
          <TabsTrigger value="PENDING" className="data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-800 dark:data-[state=active]:text-amber-300">Pending</TabsTrigger>
          <TabsTrigger value="APPROVED" className="data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-300">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED" className="data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/30 data-[state=active]:text-red-800 dark:data-[state=active]:text-red-300">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <LeaveRequestTable
          requests={filteredRequests}
          employees={employees}
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={isAdmin}
        />
      )}
    </div>
  );
}
