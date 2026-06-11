import { AuthSession } from "@/types";
import { STORAGE_KEYS, CREDENTIALS } from "@/constants";
import { EmployeeService } from "./employee-service";
import { ActivityLogService } from "./activity-log-service";

export const AuthService = {
  async login(username: string, password: string): Promise<AuthSession | null> {
    // Check admin credentials first (hardcoded)
    if (username === CREDENTIALS.USERNAME && password === CREDENTIALS.PASSWORD) {
      const session: AuthSession = {
        isAuthenticated: true,
        username,
        role: "admin",
        employeeId: null,
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      
      await ActivityLogService.log({
        event_type: "LOGIN_SUCCESS",
        username,
        role: "admin",
        details: "Admin logged in successfully",
      });
      
      return session;
    }

    // Check employee credentials from Supabase
    const employee = await EmployeeService.findByCredentials(username, password);
    if (employee) {
      const session: AuthSession = {
        isAuthenticated: true,
        username: employee.username,
        role: "employee",
        employeeId: employee.id,
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      
      await ActivityLogService.log({
        event_type: "LOGIN_SUCCESS",
        username: employee.username,
        role: "employee",
        details: `Employee "${employee.name}" logged in successfully`,
      });
      
      return session;
    }

    // Failed login
    await ActivityLogService.log({
      event_type: "LOGIN_FAILED",
      username: username || "(empty)",
      role: "unknown",
      details: `Failed login attempt with username "${username}"`,
    });

    return null;
  },

  async logout(): Promise<void> {
    const session = this.getSession();
    if (session) {
      await ActivityLogService.log({
        event_type: "LOGOUT",
        username: session.username,
        role: session.role,
        details: `User "${session.username}" logged out`,
      });
    }
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
