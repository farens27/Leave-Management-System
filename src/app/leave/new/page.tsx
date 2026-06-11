"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { EmployeeService } from "@/services/employee-service";
import { LeaveService } from "@/services/leave-service";
import { AuthService } from "@/services/auth-service";
import { Employee, LeaveRequestFormData, AuthSession } from "@/types";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewLeaveRequestPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const currentSession = AuthService.getSession();
    if (!currentSession?.isAuthenticated) {
      router.push("/login");
      return;
    }
    setSession(currentSession);
    loadEmployees();
  }, [router]);

  const loadEmployees = async () => {
    try {
      const data = await EmployeeService.getAll();
      setEmployees(data);
    } catch {
      toast.error("Failed to load employees");
    }
  };

  const handleSubmit = async (data: LeaveRequestFormData) => {
    try {
      await LeaveService.create(data);
      toast.success("Leave request submitted", {
        description: "Your leave request has been submitted for review.",
      });
      router.push("/leave");
    } catch {
      toast.error("Failed to submit leave request");
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/leave")}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Leave Requests
      </Button>

      <div className="mx-auto max-w-2xl">
        <LeaveRequestForm
          employees={employees}
          session={session}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
