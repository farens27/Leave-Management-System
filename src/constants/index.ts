export const STORAGE_KEYS = {
  EMPLOYEES: "employees",
  LEAVE_REQUESTS: "leaveRequests",
  AUTH_SESSION: "authSession",
  THEME: "theme",
} as const;

export const CREDENTIALS = {
  USERNAME: "admin",
  PASSWORD: "admin123",
} as const;

export const LEAVE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const DEFAULT_EMPLOYEE_PASSWORD = "password123";
