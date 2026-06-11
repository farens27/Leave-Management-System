"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeaveRequest, Employee, LeaveStatus } from "@/types";
import { Check, X, CalendarDays } from "lucide-react";

type LeaveRequestTableProps = {
  requests: LeaveRequest[];
  employees: Employee[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
};

function getEmployeeName(employeeId: string, employees: Employee[]): string {
  const employee = employees.find((e) => e.id === employeeId);
  return employee?.name ?? "Unknown Employee";
}

function getStatusBadge(status: LeaveStatus) {
  const styles: Record<LeaveStatus, string> = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    REJECTED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {status}
    </Badge>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function LeaveRequestTable({
  requests,
  employees,
  onApprove,
  onReject,
  showActions = true,
}: LeaveRequestTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-12 text-center">
        <CalendarDays className="mb-4 h-12 w-12 text-emerald-300 dark:text-emerald-600" />
        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">No leave requests found</h3>
        <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">Create a new leave request to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-100 dark:border-emerald-900 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-950 dark:hover:to-teal-950">
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Employee</TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Start Date</TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">End Date</TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Reason</TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Status</TableHead>
            {showActions && (
              <TableHead className="text-right font-semibold text-emerald-900 dark:text-emerald-100">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
              <TableCell className="font-medium">
                {getEmployeeName(request.employeeId, employees)}
              </TableCell>
              <TableCell>{formatDate(request.startDate)}</TableCell>
              <TableCell>{formatDate(request.endDate)}</TableCell>
              <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              {showActions && (
                <TableCell className="text-right">
                  {request.status === "PENDING" && onApprove && onReject && (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprove(request.id)}
                        className="border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700"
                      >
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(request.id)}
                        className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700"
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
