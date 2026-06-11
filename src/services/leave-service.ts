import { supabase } from "@/lib/supabase";
import { LeaveRequest, LeaveRequestFormData, LeaveStatus, LeaveStatusCounts } from "@/types";

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

  async create(formData: LeaveRequestFormData): Promise<LeaveRequest> {
    const { data, error } = await supabase
      .from("leave_requests")
      .insert({
        employee_id: formData.employeeId,
        start_date: formData.startDate,
        end_date: formData.endDate,
        reason: formData.reason,
        status: "PENDING",
      })
      .select()
      .single();
    if (error) throw error;
    return mapRow(data);
  },

  async updateStatus(id: string, status: LeaveStatus): Promise<LeaveRequest | null> {
    const { data, error } = await supabase
      .from("leave_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) return null;
    return mapRow(data);
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
  };
}
