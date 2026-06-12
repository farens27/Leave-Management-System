# Feature Pack — Implementation Plan

Adding 9 features to LeaveManager: Leave Balance, Notifications, Security, Avatars, Export, Calendar + Indonesia Holidays.

## Proposed Changes

### 1. 📅 Leave Balance Tracker
- Add `leave_balance` column to employees table (default: 12 days/year)
- Auto-deduct on approval, auto-refund on rejection
- Show balance on dashboard & leave form
- Block requests that exceed remaining balance

### 2. 🔔 In-App Notifications
- Create `notifications` table in Supabase
- Bell icon with unread badge in Navbar
- Dropdown panel showing recent notifications
- Auto-notify on: leave approved/rejected, new request (admin)

### 3. 🔒 Password Hashing
- Add API route `/api/auth/hash` using Web Crypto API (SHA-256)
- Migrate existing plaintext passwords on first login
- Hash new passwords on employee creation/edit

### 4. ⏱️ Session Expiry
- Auto-logout after 30 minutes of inactivity
- Show warning toast 2 minutes before expiry
- Reset timer on user activity (click/keypress)

### 5. 👤 Profile Avatars
- Generate initials-based colored avatars (no upload needed)
- Show in Navbar, Employee table, and Leave request table
- Consistent color per employee based on name hash

### 6. 📊 Export to PDF/CSV
- Export employee list as CSV
- Export leave reports as CSV
- Export activity logs as CSV
- Download buttons on each page

### 7. 📅 Leave Calendar View
- Full calendar view showing approved leaves
- Color-coded by employee
- Indonesia public holidays highlighted (red)
- Holiday tooltip with name

### 8. 📅 Indonesia Holiday Calendar
- 2025 & 2026 national holidays data
- Holidays shown on leave calendar
- Holiday warning when submitting leave on a holiday date
- Holiday list section on dashboard

### 9. 📧 Email-style Notifications (In-App)
- Notification center replaces email (no external service needed)
- Rich notification messages with timestamps
- Mark as read / clear all

## Database Changes (Supabase SQL)

```sql
-- Add leave balance to employees
ALTER TABLE employees ADD COLUMN IF NOT EXISTS leave_balance INTEGER DEFAULT 12;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

## New/Modified Files

| Action | File | Purpose |
|--------|------|---------|
| NEW | `src/data/indonesia-holidays.ts` | Holiday data 2025-2026 |
| NEW | `src/components/shared/NotificationBell.tsx` | Bell icon + dropdown |
| NEW | `src/components/shared/Avatar.tsx` | Initials avatar component |
| NEW | `src/components/leave/LeaveCalendar.tsx` | Calendar view |
| NEW | `src/services/notification-service.ts` | CRUD for notifications |
| NEW | `src/hooks/useSessionExpiry.ts` | Inactivity timer |
| NEW | `src/utils/export.ts` | CSV export utility |
| NEW | `src/utils/hash.ts` | Password hashing |
| MODIFY | `src/services/employee-service.ts` | Leave balance, hashing |
| MODIFY | `src/services/leave-service.ts` | Balance deduction, notifications |
| MODIFY | `src/services/auth-service.ts` | Hash verification, session expiry |
| MODIFY | `src/components/shared/Navbar.tsx` | Avatar, notifications, session |
| MODIFY | `src/app/leave/page.tsx` | Calendar tab, balance display |
| MODIFY | `src/app/employees/page.tsx` | Export button, avatars |
| MODIFY | `src/app/dashboard/page.tsx` | Holiday list, balance stats |

## Verification
- Build passes (`npm run build`)
- All features work in dev server
- Push to GitHub → auto-deploy on Vercel
