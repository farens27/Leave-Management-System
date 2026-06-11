"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leaveRequestSchema, LeaveRequestSchemaType } from "@/validators/leave";
import { Employee, LeaveRequestFormData, AuthSession } from "@/types";
import { CalendarPlus, User } from "lucide-react";

type LeaveRequestFormProps = {
  employees: Employee[];
  session: AuthSession;
  onSubmit: (data: LeaveRequestFormData) => void | Promise<void>;
};

export function LeaveRequestForm({ employees, session, onSubmit }: LeaveRequestFormProps) {
  const isEmployee = session.role === "employee";
  const currentEmployee = isEmployee
    ? employees.find((e) => e.id === session.employeeId)
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestSchemaType>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      employeeId: isEmployee && session.employeeId ? session.employeeId : "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const handleFormSubmit = (data: LeaveRequestSchemaType) => {
    onSubmit(data);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          New Leave Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {isEmployee && currentEmployee ? (
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Requesting as</p>
                  <p className="text-base font-semibold text-emerald-700 dark:text-emerald-300">{currentEmployee.name}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee</Label>
              <Select
                onValueChange={(value) => setValue("employeeId", value as string, { shouldValidate: true })}
              >
                <SelectTrigger
                  className={errors.employeeId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} — {emp.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeId && (
                <p className="text-sm text-red-500">{errors.employeeId.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                className={errors.startDate ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
                className={errors.endDate ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for leave..."
              rows={4}
              {...register("reason")}
              className={errors.reason ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300"
          >
            {isSubmitting ? "Submitting..." : "Submit Leave Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
