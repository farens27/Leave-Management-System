import { z } from "zod";

export const leaveRequestSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z
      .string()
      .min(1, "Reason is required")
      .max(500, "Reason must be at most 500 characters"),
    leaveType: z.enum(["ANNUAL", "SICK", "PERSONAL", "MATERNITY", "PATERNITY"], {
      required_error: "Leave type is required",
    }),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export type LeaveRequestSchemaType = z.infer<typeof leaveRequestSchema>;
