import { supabase } from "@/lib/supabase";
import { Employee, EmployeeFormData } from "@/types";

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
    const { data, error } = await supabase
      .from("employees")
      .insert({
        name: formData.name,
        department: formData.department,
        position: formData.position,
        username: formData.username,
        password: formData.password,
      })
      .select()
      .single();
    if (error) throw error;
    return mapRow(data);
  },

  async update(id: string, formData: EmployeeFormData): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("employees")
      .update({
        name: formData.name,
        department: formData.department,
        position: formData.position,
        username: formData.username,
        password: formData.password,
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
      .eq("password", password)
      .single();
    if (error || !data) return null;
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
  };
}
