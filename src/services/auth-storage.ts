import { AuthSession } from "@/types";
import { STORAGE_KEYS, CREDENTIALS } from "@/constants";
import { EmployeeStorageService } from "./employee-storage";

export const AuthStorageService = {
  login(username: string, password: string): AuthSession | null {
    // Check admin credentials first
    if (username === CREDENTIALS.USERNAME && password === CREDENTIALS.PASSWORD) {
      const session: AuthSession = {
        isAuthenticated: true,
        username,
        role: "admin",
        employeeId: null,
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      return session;
    }

    // Check employee credentials
    const employee = EmployeeStorageService.findByCredentials(username, password);
    if (employee) {
      const session: AuthSession = {
        isAuthenticated: true,
        username: employee.username,
        role: "employee",
        employeeId: employee.id,
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      return session;
    }

    return null;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },

  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data) as AuthSession;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const session = this.getSession();
    return session?.isAuthenticated ?? false;
  },

  isAdmin(): boolean {
    const session = this.getSession();
    return session?.role === "admin";
  },
};
