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
import { Employee } from "@/types";
import { Edit, Trash2, Users, User } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

type EmployeeTableProps = {
  employees: Employee[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-12 text-center">
        <Users className="mb-4 h-12 w-12 text-emerald-300 dark:text-emerald-600" />
        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">No employees found</h3>
        <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">Add your first employee to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-100 dark:border-emerald-900 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-950 dark:hover:to-teal-950">
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Name</TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Username</TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Department</TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-100">Position</TableHead>
            <TableHead className="text-right font-semibold text-emerald-900 dark:text-emerald-100">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {employee.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">{employee.username}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(employee.id)}
                    className="border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700"
                  >
                    <Edit className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    }
                    title="Delete Employee?"
                    description={`This will permanently delete ${employee.name} and all their leave requests. This action cannot be undone.`}
                    onConfirm={() => onDelete(employee.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

