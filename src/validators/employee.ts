import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  department: z
    .string()
    .min(1, "Department is required")
    .max(100, "Department must be at most 100 characters"),
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be at most 100 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dots, and underscores"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export type EmployeeSchemaType = z.infer<typeof employeeSchema>;
