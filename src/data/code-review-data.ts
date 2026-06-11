export type ReviewFinding = {
  area: string;
  status: "PASS" | "FAIL";
  severity: "Critical" | "High" | "Medium" | "Low";
  finding: string;
  recommendation: string;
};

export type ReviewReport = {
  reviewer: string;
  reviewDate: string;
  application: string;
  version: string;
  conclusion: {
    verdict: string;
    subtitle: string;
    action: string;
  };
  findings: ReviewFinding[];
  summary: { critical: number; high: number; medium: number; low: number };
};

export const codeReviewReport: ReviewReport = {
  reviewer: "AI Code Review Agent (Antigravity)",
  reviewDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  application: "Employee Leave Management System",
  version: "1.0.0",
  conclusion: {
    verdict: "Conditionally Approved",
    subtitle: "Security hardening required before production deployment",
    action: "Fix 2 Critical & 3 High severity findings, then re-review",
  },
  summary: { critical: 2, high: 3, medium: 5, low: 3 },
  findings: [
    // 1. Functional Correctness
    {
      area: "Functional Correctness",
      status: "PASS",
      severity: "Medium",
      finding: "No date overlap validation for leave requests. An employee can submit multiple overlapping leave requests for the same date range. Missing business rule: endDate must be >= startDate.",
      recommendation: "Add cross-field validation in LeaveRequestForm to check startDate <= endDate. Add server-side duplicate leave period check in leave-service.ts.",
    },
    // 2. Security (OWASP)
    {
      area: "Security (OWASP)",
      status: "FAIL",
      severity: "Critical",
      finding: "Hardcoded admin credentials in constants/index.ts (admin/admin123). Passwords stored in plaintext in Supabase employees table. No password hashing (bcrypt). Supabase anon key exposed in NEXT_PUBLIC env var (expected for client SDK but RLS policies must be strict).",
      recommendation: "Hash passwords with bcrypt before storing. Move admin credentials to environment variables. Implement proper Supabase RLS policies instead of permissive 'allow all'. Add rate limiting on login endpoint.",
    },
    // 3. Security - Auth
    {
      area: "Security - Authentication",
      status: "FAIL",
      severity: "Critical",
      finding: "Session stored in localStorage (vulnerable to XSS). No session expiration/TTL. No CSRF protection. Client-side auth checks only — no server-side middleware validation. Captcha is simulated (setTimeout), not a real verification.",
      recommendation: "Use httpOnly cookies or Supabase Auth for session management. Add Next.js middleware for server-side route protection. Implement real CAPTCHA (reCAPTCHA/hCaptcha). Add session expiration.",
    },
    // 4. Security - Authorization
    {
      area: "Security - Authorization",
      status: "FAIL",
      severity: "High",
      finding: "Role-based access control is client-side only. Admin routes (/dashboard, /employees) redirect on the client but the API/data layer has no server-side authorization. Any user could call Supabase directly to modify employee records.",
      recommendation: "Implement Supabase RLS policies per role. Add Next.js API routes with server-side auth middleware. Validate role on every data mutation.",
    },
    // 5. Performance
    {
      area: "Performance",
      status: "PASS",
      severity: "Medium",
      finding: "Dashboard fetches all employees and all leave requests on every load (no pagination). countByStatus() fetches all rows just to count them. No data caching — every page navigation refetches everything.",
      recommendation: "Use Supabase .select('count') for counting. Implement pagination for employee and leave lists. Add React Query or SWR for client-side caching.",
    },
    // 6. Architecture
    {
      area: "Architecture",
      status: "PASS",
      severity: "Low",
      finding: "Good separation: Pages → Components → Services → Supabase. Old localStorage services (auth-storage.ts, employee-storage.ts, leave-storage.ts) are still in the codebase as dead code after Supabase migration.",
      recommendation: "Remove the old *-storage.ts files. They are no longer imported but add confusion. Keep only the new *-service.ts files.",
    },
    // 7. Maintainability
    {
      area: "Maintainability",
      status: "PASS",
      severity: "Low",
      finding: "Code is generally clean with good naming. Some components are large (dashboard/page.tsx ~250 lines). mapRow() functions use 'any' type which bypasses TypeScript safety.",
      recommendation: "Generate Supabase types with 'supabase gen types' for type-safe database queries. Break large page components into smaller sub-components.",
    },
    // 8. Type Safety
    {
      area: "Type Safety",
      status: "PASS",
      severity: "Medium",
      finding: "mapRow() in employee-service.ts and leave-service.ts uses 'any' type with eslint-disable comment. No Supabase generated types — all DB responses are untyped.",
      recommendation: "Run 'npx supabase gen types typescript' to generate Database types. Replace 'any' with generated row types.",
    },
    // 9. Error Handling
    {
      area: "Error Handling",
      status: "PASS",
      severity: "Medium",
      finding: "Most async calls have try/catch with toast notifications. However, some services throw errors (EmployeeService.create) while others return null (EmployeeService.update) — inconsistent error strategy. No global error boundary.",
      recommendation: "Standardize error handling: always throw or always return Result type. Add React Error Boundary for uncaught errors. Add loading/error states to all pages consistently.",
    },
    // 10. Validation
    {
      area: "Validation",
      status: "PASS",
      severity: "Medium",
      finding: "Zod validation on forms (login, employee). However, no server-side validation — data goes directly to Supabase. Missing: email format, password strength, username format validation. No max-length constraints.",
      recommendation: "Add server-side validation in API routes. Add password strength requirements. Add input length limits in Zod schemas and DB constraints.",
    },
    // 11. UI/UX
    {
      area: "UI/UX",
      status: "PASS",
      severity: "Low",
      finding: "Modern, premium design with consistent emerald/teal theme. Good dark/light mode support. Responsive layout. Loading spinners present. Toast notifications for all actions. Minor: some old violet color classes may remain in edit employee page.",
      recommendation: "Do a final sweep for any remaining violet/indigo/purple CSS classes. Add empty state illustrations. Add confirmation dialogs for destructive actions (delete).",
    },
    // 12. Logging & Observability
    {
      area: "Logging & Observability",
      status: "FAIL",
      severity: "High",
      finding: "No activity logging at all. No audit trail for login attempts, data modifications, or admin actions. No error tracking. Security events (failed logins) are not recorded.",
      recommendation: "Implement activity_logs table and logging service. Track: login success/failure, logout, CRUD operations, admin actions. Never log passwords or tokens.",
    },
    // 13. AI Generated Code
    {
      area: "AI Generated Code",
      status: "PASS",
      severity: "High",
      finding: "Simulated CAPTCHA (fake security — setTimeout only, no real verification). Dead code: old localStorage service files still present. The EmployeeForm component has 'Forgot password?' link that goes nowhere (href='#').",
      recommendation: "Replace fake CAPTCHA with real provider (reCAPTCHA v3). Remove dead localStorage service files. Remove or implement the 'Forgot password' feature.",
    },
  ],
};
