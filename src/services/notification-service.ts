import { supabase } from "@/lib/supabase";

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
};

export const NotificationService = {
  async getByUser(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return [];
    return (data ?? []).map(mapRow);
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    if (error) return 0;
    return count ?? 0;
  },

  async create(params: {
    userId: string;
    title: string;
    message: string;
    type?: "info" | "success" | "warning" | "error";
  }): Promise<void> {
    await supabase.from("notifications").insert({
      user_id: params.userId,
      title: params.title,
      message: params.message,
      type: params.type ?? "info",
    });
  },

  async notifyAdmin(title: string, message: string): Promise<void> {
    await this.create({ userId: "admin", title, message, type: "info" });
  },

  async markAsRead(id: string): Promise<void> {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  },

  async markAllAsRead(userId: string): Promise<void> {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
  },

  async clearAll(userId: string): Promise<void> {
    await supabase.from("notifications").delete().eq("user_id", userId);
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    isRead: row.is_read,
    type: row.type ?? "info",
    createdAt: row.created_at,
  };
}
