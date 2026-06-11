import { supabase } from "@/lib/supabase";

export type ActivityLogEntry = {
  id: string;
  event_type: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "LOGOUT" | "EMPLOYEE_CREATED" | "EMPLOYEE_UPDATED" | "EMPLOYEE_DELETED" | "LEAVE_CREATED" | "LEAVE_APPROVED" | "LEAVE_REJECTED" | "ERROR";
  username: string;
  role: string;
  details: string;
  ip_address: string;
  created_at: string;
};

export const ActivityLogService = {
  async log(entry: Omit<ActivityLogEntry, "id" | "created_at" | "ip_address">): Promise<void> {
    try {
      await supabase.from("activity_logs").insert({
        event_type: entry.event_type,
        username: entry.username,
        role: entry.role,
        details: entry.details,
        ip_address: "client",
      });
    } catch {
      // Silently fail - logging should not break the app
      console.error("Failed to write activity log");
    }
  },

  async getAll(limit = 100): Promise<ActivityLogEntry[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return data ?? [];
  },

  async getByEventType(eventType: string, limit = 50): Promise<ActivityLogEntry[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("event_type", eventType)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return data ?? [];
  },

  async getStats(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("event_type");
    if (error) return {};
    const counts: Record<string, number> = {};
    (data ?? []).forEach((row) => {
      counts[row.event_type] = (counts[row.event_type] || 0) + 1;
    });
    return counts;
  },

  async getRecentByDay(days = 7): Promise<{ date: string; logins: number; failures: number; logouts: number }[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    const { data, error } = await supabase
      .from("activity_logs")
      .select("event_type, created_at")
      .gte("created_at", since.toISOString())
      .in("event_type", ["LOGIN_SUCCESS", "LOGIN_FAILED", "LOGOUT"])
      .order("created_at", { ascending: true });
    
    if (error) return [];
    
    const byDay: Record<string, { logins: number; failures: number; logouts: number }> = {};
    (data ?? []).forEach((row) => {
      const day = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!byDay[day]) byDay[day] = { logins: 0, failures: 0, logouts: 0 };
      if (row.event_type === "LOGIN_SUCCESS") byDay[day].logins++;
      else if (row.event_type === "LOGIN_FAILED") byDay[day].failures++;
      else if (row.event_type === "LOGOUT") byDay[day].logouts++;
    });
    
    return Object.entries(byDay).map(([date, counts]) => ({ date, ...counts }));
  },
};
