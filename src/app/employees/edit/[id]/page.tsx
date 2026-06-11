"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeForm } from "@/components/employee/EmployeeForm";
import { EmployeeService } from "@/services/employee-service";
import { AuthService } from "@/services/auth-service";
import { Employee, EmployeeFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
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
    loadEmployee();
  }, [params.id, router]);

  const loadEmployee = async () => {
    const id = params.id as string;
    const found = await EmployeeService.getById(id);
    if (!found) {
      toast.error("Employee not found");
      router.push("/employees");
      return;
    }
    setEmployee(found);
    setLoading(false);
  };

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      const id = params.id as string;
      await EmployeeService.update(id, data);
      toast.success("Employee updated successfully");
      router.push("/employees");
    } catch {
      toast.error("Failed to update employee");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Employee"
        description={`Editing ${employee?.name}`}
        action={
          <Button
            variant="outline"
            onClick={() => router.push("/employees")}
            className="border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />
      <div className="mx-auto max-w-lg">
        {employee && (
          <EmployeeForm
            initialData={employee}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
