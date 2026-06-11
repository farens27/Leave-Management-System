"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { employeeSchema, EmployeeSchemaType } from "@/validators/employee";
import { Employee, EmployeeFormData } from "@/types";
import { UserPlus, KeyRound } from "lucide-react";

type EmployeeFormProps = {
  initialData?: Employee;
  onSubmit: (data: EmployeeFormData) => void | Promise<void>;
};

export function EmployeeForm({ initialData, onSubmit }: EmployeeFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeSchemaType>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          department: initialData.department,
          position: initialData.position,
          username: initialData.username,
          password: initialData.password,
        }
      : undefined,
  });

  const handleFormSubmit = (data: EmployeeSchemaType) => {
    onSubmit(data);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          {isEditing ? "Edit Employee" : "New Employee"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              {...register("name")}
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g. Engineering"
                {...register("department")}
                className={errors.department ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="e.g. Software Engineer"
                {...register("position")}
                className={errors.position ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.position && (
                <p className="text-sm text-red-500">{errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <KeyRound className="h-4 w-4" />
              Login Credentials
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="e.g. john.doe"
                  {...register("username")}
                  className={errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 6 characters"
                  {...register("password")}
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Employee"
              : "Create Employee"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

