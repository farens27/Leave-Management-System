"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmployeeForm } from "@/components/employee/EmployeeForm";
import { EmployeeService } from "@/services/employee-service";
import { AuthService } from "@/services/auth-service";
import { EmployeeFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewEmployeePage() {
  const router = useRouter();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      await EmployeeService.create(data);
      toast.success("Employee created successfully");
      router.push("/employees");
    } catch {
      toast.error("Failed to create employee");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Employee"
        description="Create a new employee record"
        action={
          <Button
            variant="outline"
            onClick={() => router.push("/employees")}
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />
      <div className="mx-auto max-w-lg">
        <EmployeeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
