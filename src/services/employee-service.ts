import { supabase } from "@/lib/supabase";
import { Employee, EmployeeFormData } from "@/types";
import { hashPassword, verifyPassword, isHashed } from "@/utils/hash";

export const EmployeeService = {
  async getAll(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  },

  async getById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return mapRow(data);
  },

  async create(formData: EmployeeFormData): Promise<Employee> {
    const hashedPwd = await hashPassword(formData.password);
    const { data, error } = await supabase
      .from("employees")
      .insert({
        name: formData.name,
        department: formData.department,
        position: formData.position,
        username: formData.username,
        password: hashedPwd,
        leave_balance: 12,
      })
      .select()
      .single();
    if (error) throw error;
    return mapRow(data);
  },

  async update(id: string, formData: EmployeeFormData): Promise<Employee | null> {
    const hashedPwd = isHashed(formData.password) ? formData.password : await hashPassword(formData.password);
    const { data, error } = await supabase
      .from("employees")
      .update({
        name: formData.name,
        department: formData.department,
        position: formData.position,
        username: formData.username,
        password: hashedPwd,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) return null;
    return mapRow(data);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
    return !error;
  },

  async findByCredentials(username: string, password: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("username", username)
      .single();
    if (error || !data) return null;

    // Support both hashed and legacy plaintext passwords
    if (isHashed(data.password)) {
      const match = await verifyPassword(password, data.password);
      if (!match) return null;
    } else {
      if (data.password !== password) return null;
      // Migrate to hashed password on successful login
      const hashed = await hashPassword(password);
      await supabase.from("employees").update({ password: hashed }).eq("id", data.id);
    }

    return mapRow(data);
  },

  async isUsernameTaken(username: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from("employees")
      .select("id")
      .eq("username", username);
    if (excludeId) {
      query = query.neq("id", excludeId);
    }
    const { data } = await query;
    return (data ?? []).length > 0;
  },

  async getLeaveBalance(id: string): Promise<number> {
    const { data, error } = await supabase
      .from("employees")
      .select("leave_balance")
      .eq("id", id)
      .single();
    if (error || !data) return 0;
    return data.leave_balance ?? 12;
  },

  async updateLeaveBalance(id: string, newBalance: number): Promise<void> {
    await supabase
      .from("employees")
      .update({ leave_balance: newBalance })
      .eq("id", id);
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Employee {
  return {
    id: row.id,
    name: row.name,
    department: row.department ?? "",
    position: row.position ?? "",
    username: row.username,
    password: row.password,
    leaveBalance: row.leave_balance ?? 12,
  };
}
