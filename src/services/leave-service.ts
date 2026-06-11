import { supabase } from "@/lib/supabase";
import { LeaveRequest, LeaveRequestFormData, LeaveStatus, LeaveStatusCounts } from "@/types";
import { EmployeeService } from "@/services/employee-service";
import { NotificationService } from "@/services/notification-service";

function countBusinessDays(start: string, end: string): number {
  let count = 0;
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export const LeaveService = {
  async getAll(): Promise<LeaveRequest[]> {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  },

  async getById(id: string): Promise<LeaveRequest | null> {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return mapRow(data);
  },

  async checkOverlap(employeeId: string, startDate: string, endDate: string): Promise<boolean> {
    const { data } = await supabase
      .from("leave_requests")
      .select("id")
      .eq("employee_id", employeeId)
      .neq("status", "REJECTED")
      .lte("start_date", endDate)
      .gte("end_date", startDate);
    return (data?.length ?? 0) > 0;
  },

  async create(formData: LeaveRequestFormData): Promise<LeaveRequest> {
    // Check for overlapping leave
    const hasOverlap = await this.checkOverlap(formData.employeeId, formData.startDate, formData.endDate);
    if (hasOverlap) {
      throw new Error("OVERLAP: You already have a leave request for this date range.");
    }

    const { data, error } = await supabase
      .from("leave_requests")
      .insert({
        employee_id: formData.employeeId,
        start_date: formData.startDate,
        end_date: formData.endDate,
        reason: formData.reason,
        leave_type: formData.leaveType ?? "ANNUAL",
        status: "PENDING",
      })
      .select()
      .single();
    if (error) throw error;

    // Notify admin about new leave request
    try {
      const emp = await EmployeeService.getById(formData.employeeId);
      if (emp) {
        await NotificationService.notifyAdmin(
          "New Leave Request",
          `${emp.name} submitted a ${(formData.leaveType ?? "ANNUAL").toLowerCase()} leave request (${formData.startDate} to ${formData.endDate})`
        );
      }
    } catch { /* non-critical */ }

    return mapRow(data);
  },

  async updateStatus(id: string, status: LeaveStatus, rejectionReason?: string): Promise<LeaveRequest | null> {
    const updateData: Record<string, unknown> = { status };
    if (rejectionReason) updateData.rejection_reason = rejectionReason;

    const { data, error } = await supabase
      .from("leave_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) return null;

    const leave = mapRow(data);

    // Handle leave balance and notifications
    try {
      const emp = await EmployeeService.getById(leave.employeeId);
      if (emp) {
        const days = countBusinessDays(leave.startDate, leave.endDate);

        if (status === "APPROVED") {
          const newBalance = Math.max(0, emp.leaveBalance - days);
          await EmployeeService.updateLeaveBalance(emp.id, newBalance);

          await NotificationService.create({
            userId: emp.username,
            title: "Leave Approved ✅",
            message: `Your ${leave.leaveType.toLowerCase()} leave (${leave.startDate} to ${leave.endDate}) has been approved. ${days} day(s) deducted. Remaining: ${newBalance} days.`,
            type: "success",
          });
        } else if (status === "REJECTED") {
          const reasonMsg = rejectionReason ? ` Reason: "${rejectionReason}"` : "";
          await NotificationService.create({
            userId: emp.username,
            title: "Leave Rejected ❌",
            message: `Your ${leave.leaveType.toLowerCase()} leave (${leave.startDate} to ${leave.endDate}) has been rejected.${reasonMsg}`,
            type: "error",
          });
        }
      }
    } catch { /* non-critical */ }

    return leave;
  },

  async bulkUpdateStatus(ids: string[], status: LeaveStatus, rejectionReason?: string): Promise<void> {
    for (const id of ids) {
      await this.updateStatus(id, status, rejectionReason);
    }
  },

  async getByEmployeeId(employeeId: string): Promise<LeaveRequest[]> {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  },

  async countByStatus(): Promise<LeaveStatusCounts> {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("status");
    if (error) throw error;
    const rows = data ?? [];
    return {
      pending: rows.filter((r) => r.status === "PENDING").length,
      approved: rows.filter((r) => r.status === "APPROVED").length,
      rejected: rows.filter((r) => r.status === "REJECTED").length,
    };
  },

  async getAllWithEmployeeNames(): Promise<(LeaveRequest & { employeeName: string })[]> {
    const [leaves, employees] = await Promise.all([
      this.getAll(),
      EmployeeService.getAll(),
    ]);
    const empMap = new Map(employees.map((e) => [e.id, e.name]));
    return leaves.map((l) => ({
      ...l,
      employeeName: empMap.get(l.employeeId) ?? "Unknown",
    }));
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): LeaveRequest {
  return {
    id: row.id,
    employeeId: row.employee_id,
    startDate: row.start_date,
    endDate: row.end_date,
    reason: row.reason,
    status: row.status,
    leaveType: row.leave_type ?? "ANNUAL",
    rejectionReason: row.rejection_reason ?? undefined,
  };
}
