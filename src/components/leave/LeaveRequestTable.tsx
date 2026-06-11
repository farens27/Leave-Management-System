"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/shared/Avatar";
import { LeaveRequest, Employee, LeaveStatus, LeaveType } from "@/types";
import { Check, X, CalendarDays } from "lucide-react";

type LeaveRequestTableProps = {
  requests: LeaveRequest[];
  employees: Employee[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason?: string) => void;
  onBulkApprove?: (ids: string[]) => void;
  onBulkReject?: (ids: string[], reason: string) => void;
  showActions?: boolean;
};

function getEmployee(employeeId: string, employees: Employee[]): Employee | undefined {
  return employees.find((e) => e.id === employeeId);
}

function getEmployeeName(employeeId: string, employees: Employee[]): string {
  const employee = getEmployee(employeeId, employees);
  return employee?.name ?? "Unknown Employee";
}

function getStatusBadge(status: LeaveStatus) {
  const styles: Record<LeaveStatus, string> = {
    PENDING:
      "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    APPROVED:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    REJECTED:
      "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {status}
    </Badge>
  );
}

function getLeaveTypeBadge(leaveType: LeaveType) {
  const styles: Record<LeaveType, string> = {
    ANNUAL:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    SICK:
      "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    PERSONAL:
      "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    MATERNITY:
      "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    PATERNITY:
      "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  };

  const labels: Record<LeaveType, string> = {
    ANNUAL: "Annual",
    SICK: "Sick",
    PERSONAL: "Personal",
    MATERNITY: "Maternity",
    PATERNITY: "Paternity",
  };

  return (
    <Badge variant="outline" className={styles[leaveType]}>
      {labels[leaveType]}
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
  onBulkApprove,
  onBulkReject,
  showActions = true,
}: LeaveRequestTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState<
    { type: "single"; id: string } | { type: "bulk"; ids: string[] } | null
  >(null);

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const pendingIds = pendingRequests.map((r) => r.id);
  const allPendingSelected =
    pendingIds.length > 0 && pendingIds.every((id) => selectedIds.has(id));
  const somePendingSelected =
    pendingIds.some((id) => selectedIds.has(id)) && !allPendingSelected;

  const isBulkEnabled = !!(onBulkApprove || onBulkReject);

  function toggleSelectAll() {
    if (allPendingSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingIds));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function openRejectDialog(target: { type: "single"; id: string } | { type: "bulk"; ids: string[] }) {
    setRejectTarget(target);
    setRejectionReason("");
    setRejectDialogOpen(true);
  }

  function handleRejectConfirm() {
    if (!rejectTarget || rejectionReason.trim().length < 10) return;

    if (rejectTarget.type === "single" && onReject) {
      onReject(rejectTarget.id, rejectionReason.trim());
    } else if (rejectTarget.type === "bulk" && onBulkReject) {
      onBulkReject(rejectTarget.ids, rejectionReason.trim());
      clearSelection();
    }

    setRejectDialogOpen(false);
    setRejectTarget(null);
    setRejectionReason("");
  }

  function handleRejectCancel() {
    setRejectDialogOpen(false);
    setRejectTarget(null);
    setRejectionReason("");
  }

  function handleBulkApprove() {
    if (onBulkApprove) {
      onBulkApprove(Array.from(selectedIds));
      clearSelection();
    }
  }

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
    <>
      <div className="rounded-xl border border-emerald-100 dark:border-emerald-900 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-950 dark:hover:to-teal-950">
              {isBulkEnabled && showActions && (
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={allPendingSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = somePendingSelected;
                    }}
                    onChange={toggleSelectAll}
                    disabled={pendingIds.length === 0}
                    className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Select all pending requests"
                  />
                </TableHead>
              )}
              <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Employee</TableHead>
              <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Type</TableHead>
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
            {requests.map((request) => {
              const employeeName = getEmployeeName(request.employeeId, employees);
              const isPending = request.status === "PENDING";
              const isSelected = selectedIds.has(request.id);

              return (
                <TableRow
                  key={request.id}
                  className={`hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors ${
                    isSelected ? "bg-emerald-50 dark:bg-emerald-950/40" : ""
                  }`}
                >
                  {isBulkEnabled && showActions && (
                    <TableCell className="w-10">
                      {isPending ? (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(request.id)}
                          className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                          aria-label={`Select request from ${employeeName}`}
                        />
                      ) : (
                        <span className="block h-4 w-4" />
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={employeeName} size="sm" />
                      <span className="font-medium">{employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
                  <TableCell>{formatDate(request.startDate)}</TableCell>
                  <TableCell>{formatDate(request.endDate)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      {isPending && onApprove && onReject && (
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
                            onClick={() => openRejectDialog({ type: "single", id: request.id })}
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Floating bulk action bar */}
      {isBulkEnabled && selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-900 px-5 py-3 shadow-2xl shadow-emerald-500/10">
          <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
            {selectedIds.size} selected
          </span>
          <div className="h-5 w-px bg-emerald-200 dark:bg-emerald-800" />
          {onBulkApprove && (
            <Button
              size="sm"
              onClick={handleBulkApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Approve All
            </Button>
          )}
          {onBulkReject && (
            <Button
              size="sm"
              onClick={() => openRejectDialog({ type: "bulk", ids: Array.from(selectedIds) })}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Reject All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Rejection reason modal */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
            <DialogDescription>
              {rejectTarget?.type === "bulk"
                ? `Please provide a reason for rejecting ${rejectTarget.ids.length} selected request(s).`
                : "Please provide a reason for rejecting this leave request."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Enter rejection reason (minimum 10 characters)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px] border-emerald-200 dark:border-emerald-800 focus-visible:border-emerald-400 focus-visible:ring-emerald-500/30"
              aria-label="Rejection reason"
            />
            {rejectionReason.length > 0 && rejectionReason.trim().length < 10 && (
              <p className="mt-1.5 text-xs text-red-500">
                Reason must be at least 10 characters ({rejectionReason.trim().length}/10)
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectCancel}
              className="border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRejectConfirm}
              disabled={rejectionReason.trim().length < 10}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
