import { Employee, EmployeeFormData } from "@/types";
import { STORAGE_KEYS, DEFAULT_EMPLOYEE_PASSWORD } from "@/constants";
import { LeaveStorageService } from "./leave-storage";

function generateId(): string {
  return crypto.randomUUID();
}

function migrateEmployee(emp: Record<string, unknown>): Employee {
  const name = (emp.name as string) || "user";
  return {
    id: (emp.id as string) || generateId(),
    name,
    department: (emp.department as string) || "",
    position: (emp.position as string) || "",
    username: (emp.username as string) || name.toLowerCase().replace(/\s+/g, "."),
    password: (emp.password as string) || DEFAULT_EMPLOYEE_PASSWORD,
  };
}

function getStoredEmployees(): Employee[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
  if (!data) return [];
  try {
    const raw = JSON.parse(data) as Record<string, unknown>[];
    const migrated = raw.map(migrateEmployee);
    // Check if migration happened (any record lacked username)
    const needsSave = raw.some((r) => !r.username);
    if (needsSave) {
      saveEmployees(migrated);
    }
    return migrated;
  } catch {
    return [];
  }
}

function saveEmployees(employees: Employee[]): void {
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
}

export const EmployeeStorageService = {
  getAll(): Employee[] {
    return getStoredEmployees();
  },

  getById(id: string): Employee | null {
    const employees = getStoredEmployees();
    return employees.find((e) => e.id === id) ?? null;
  },

  create(data: EmployeeFormData): Employee {
    const employees = getStoredEmployees();
    const newEmployee: Employee = {
      id: generateId(),
      ...data,
    };
    employees.push(newEmployee);
    saveEmployees(employees);
    return newEmployee;
  },

  update(id: string, data: EmployeeFormData): Employee | null {
    const employees = getStoredEmployees();
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) return null;
    employees[index] = { ...employees[index], ...data };
    saveEmployees(employees);
    return employees[index];
  },

  delete(id: string): boolean {
    const employees = getStoredEmployees();
    const filtered = employees.filter((e) => e.id !== id);
    if (filtered.length === employees.length) return false;
    saveEmployees(filtered);
    // Cascade delete: remove all leave requests for this employee
    LeaveStorageService.deleteByEmployeeId(id);
    return true;
  },

  searchByName(query: string): Employee[] {
    const employees = getStoredEmployees();
    const lowerQuery = query.toLowerCase();
    return employees.filter((e) => e.name.toLowerCase().includes(lowerQuery));
  },

  findByCredentials(username: string, password: string): Employee | null {
    const employees = getStoredEmployees();
    return employees.find((e) => e.username === username && e.password === password) ?? null;
  },

  isUsernameTaken(username: string, excludeId?: string): boolean {
    const employees = getStoredEmployees();
    return employees.some((e) => e.username === username && e.id !== excludeId);
  },
};
