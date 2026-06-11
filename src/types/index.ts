export type UserRole = "admin" | "employee";

export type Employee = {
  id: string;
  name: string;
  department: string;
  position: string;
  username: string;
  password: string;
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
};

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AuthSession = {
  isAuthenticated: boolean;
  username: string;
  role: UserRole;
  employeeId: string | null;
};

export type EmployeeFormData = Omit<Employee, "id">;

export type LeaveRequestFormData = Omit<LeaveRequest, "id" | "status">;

export type LeaveStatusCounts = {
  pending: number;
  approved: number;
  rejected: number;
};
