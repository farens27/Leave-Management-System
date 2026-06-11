"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { EmployeeService } from "@/services/employee-service";
import { AuthService } from "@/services/auth-service";
import { Employee } from "@/types";
import { UserPlus, Search, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/export";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = AuthService.getSession();
    if (!session?.isAuthenticated) {
      router.push("/login");
      return;
    }
    if (session.role !== "admin") {
      router.push("/leave");
      return;
    }
    loadEmployees();
  }, [router]);

  const loadEmployees = async () => {
    try {
      const data = await EmployeeService.getAll();
      setEmployees(data);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    return employees.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const handleDelete = async (id: string) => {
    const success = await EmployeeService.delete(id);
    if (success) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.success("Employee deleted", {
        description: "Employee and their leave requests have been removed.",
      });
    } else {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage your employee records"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const csvData = employees.map((e) => ({
                  Name: e.name,
                  Department: e.department,
                  Position: e.position,
                  Username: e.username,
                  "Leave Balance": e.leaveBalance,
                }));
                exportToCSV(csvData, `employees-${new Date().toISOString().split("T")[0]}.csv`);
                toast.success("Exported to CSV");
              }}
              className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              onClick={() => router.push("/employees/new")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search employees by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onEdit={(id) => router.push(`/employees/edit/${id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
