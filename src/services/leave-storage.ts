import { LeaveRequest, LeaveRequestFormData, LeaveStatus, LeaveStatusCounts } from "@/types";
import { STORAGE_KEYS } from "@/constants";

function generateId(): string {
  return crypto.randomUUID();
}

function getStoredRequests(): LeaveRequest[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
  if (!data) return [];
  try {
    return JSON.parse(data) as LeaveRequest[];
  } catch {
    return [];
  }
}

function saveRequests(requests: LeaveRequest[]): void {
  localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(requests));
}

export const LeaveStorageService = {
  getAll(): LeaveRequest[] {
    return getStoredRequests();
  },

  getById(id: string): LeaveRequest | null {
    const requests = getStoredRequests();
    return requests.find((r) => r.id === id) ?? null;
  },

  create(data: LeaveRequestFormData): LeaveRequest {
    const requests = getStoredRequests();
    const newRequest: LeaveRequest = {
      id: generateId(),
      ...data,
      status: "PENDING",
    };
    requests.push(newRequest);
    saveRequests(requests);
    return newRequest;
  },

  updateStatus(id: string, status: LeaveStatus): LeaveRequest | null {
    const requests = getStoredRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return null;
    requests[index] = { ...requests[index], status };
    saveRequests(requests);
    return requests[index];
  },

  getByStatus(status: LeaveStatus): LeaveRequest[] {
    return getStoredRequests().filter((r) => r.status === status);
  },

  getByEmployeeId(employeeId: string): LeaveRequest[] {
    return getStoredRequests().filter((r) => r.employeeId === employeeId);
  },

  deleteByEmployeeId(employeeId: string): void {
    const requests = getStoredRequests();
    const filtered = requests.filter((r) => r.employeeId !== employeeId);
    saveRequests(filtered);
  },

  countByStatus(): LeaveStatusCounts {
    const requests = getStoredRequests();
    return {
      pending: requests.filter((r) => r.status === "PENDING").length,
      approved: requests.filter((r) => r.status === "APPROVED").length,
      rejected: requests.filter((r) => r.status === "REJECTED").length,
    };
  },
};
