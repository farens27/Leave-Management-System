# 🍃 LeaveManager — Employee Leave Management System

A modern, full-stack employee leave management system built with **Next.js 16**, **React 19**, **Supabase**, and **Tailwind CSS 4**. Features a sleek emerald/teal design with dark/light mode, real-time data, interactive charts, Indonesia holiday calendar, and comprehensive security features.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)
![Security Score](https://img.shields.io/badge/Security_Score-85%2F100-10b981)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)

---

## 🌐 Live Demo

🔗 **[https://leave-management-system-opal.vercel.app](https://leave-management-system-opal.vercel.app)**

---

## ✨ Features

### 🔐 Authentication & Security
- Admin & Employee role-based login
- **SHA-256 password hashing** with salt (Web Crypto API)
- Auto-migration from plaintext passwords on first login
- **30-minute session expiry** with 2-minute warning toast
- Show/Hide password toggle
- CAPTCHA verification
- "Remember me" option
- Activity logging on login/logout/failed attempts

### 📊 Admin Dashboard
- Stats cards (Total Employees, Leave Requests, Approval Rate)
- Leave distribution bar chart (Recharts)
- **🇮🇩 Upcoming Indonesia holidays panel** (2025-2026)
- Quick action navigation

### 👥 Employee Management (CRUD)
- Create, Read, Update, Delete employees
- **Profile avatars** with initials-based colors
- **Leave balance column** (12 days/year default)
- Username uniqueness validation
- Search & filter capabilities
- **CSV export** (Excel-compatible with BOM)
- Responsive data table

### 📅 Leave Request Management
- Submit new leave requests
- **5 Leave types**: Annual 🌴, Sick 🩺, Personal 💼, Maternity 👶, Paternity 👶
- **Leave balance tracking** — auto-deducts on approval
- **Holiday warning** — alerts when leave includes public holidays
- Approve / Reject workflow
- **Rejection reason required** — admin must explain rejections
- **Bulk approve/reject** with checkboxes and floating action bar
- **Department filter** — admin can filter by department
- **Calendar view** — monthly calendar with leave overlay
- **CSV export** with leave type and rejection reason
- Date range validation

### 🔔 In-App Notifications
- **Notification bell** with unread badge in navbar
- Auto-notify employees on leave approve/reject
- Auto-notify admin on new leave submissions
- Mark as read / Mark all as read
- Notification dropdown panel

### 👤 Employee Profile Page
- View personal info (name, department, position)
- **Leave balance progress bar** with color-coded status
- Leave history summary (total, approved, rejected, pending)
- **Self-service password change** with validation
- **Team availability view** (admin) — see who's in/out today

### 🇮🇩 Indonesia Holiday Calendar
- **34 national holidays** (2025-2026) from official government data
- Holidays shown on dashboard, leave calendar, and leave form
- Holiday warning when submitting leave during public holidays
- Color-coded holiday markers on calendar view

### 📈 Activity Log Monitoring (Admin)
- Real-time activity feed
- Daily login activity bar chart
- Event type distribution pie chart
- Filter by event type (Login, Logout, Failed, etc.)
- **CSV export** for audit purposes

### 📋 Code Review Report (Public)
- Accessible without login from the login page
- Security score gauge — **85/100** (up from 62)
- **Score progression chart** (v1.0 → v1.5 → v2.0)
- **Review history timeline** with changelogs
- **FIXED status tracking** — shows what was fixed and when
- Pass/Fail/Fixed breakdown with progress bars
- Severity distribution (Critical, High, Medium, Low)
- **Filter by status** (PASS/FIXED/FAIL) and severity
- Interactive finding cards with fix descriptions

### 💬 Help Chat Bot
- Floating chat widget on all authenticated pages
- Pre-built Q&A templates for common issues
- Guided answers for login help, leave management, system usage
- Clear message functionality

### 🎨 UI/UX
- Dark / Light theme toggle
- Emerald & Teal color scheme
- Glassmorphism effects
- Smooth animations & micro-interactions
- Fully responsive (mobile, tablet, desktop)

---

## 🔄 Changelog

### v2.0.0 (Latest)
- ✅ Added **leave types** (Annual, Sick, Personal, Maternity, Paternity)
- ✅ Added **employee profile page** with leave balance visualization
- ✅ Added **self-service password change**
- ✅ Added **bulk approve/reject** with floating action bar
- ✅ Added **rejection reason modal** — admin must explain rejections
- ✅ Added **department filter** on leave requests page
- ✅ Added **team availability view** for admin
- ✅ Updated code review report with **fix tracking and history**
- ✅ Removed dead localStorage code
- 📊 Security score: **78 → 85**

### v1.5.0
- 🔒 Implemented **SHA-256 password hashing** with salt
- ⏱️ Added **30-minute session expiry** with inactivity detection
- 🔔 Added **in-app notification system**
- 👤 Added **profile avatars** (initials-based)
- 📊 Added **CSV export** for employees, leaves, and logs
- 📅 Added **leave calendar** with monthly view
- 🇮🇩 Added **Indonesia holidays** (34 holidays, 2025-2026)
- ⚠️ Added **holiday warning** in leave request form
- 📊 Security score: **62 → 78**

### v1.0.0
- 🚀 Initial release
- 🔐 Basic authentication with admin/employee roles
- 📊 Admin dashboard with charts
- 👥 Employee CRUD management
- 📅 Leave request workflow
- 📈 Activity log monitoring
- 📋 Code review report page
- 💬 Help chat bot

---

## 🛠️ Tech Stack

### Framework & Runtime
| Technology | Version | Purpose |
|-----------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.2.9 | React framework (App Router, SSR) |
| [React](https://react.dev/) | 19.2.4 | UI library |
| [TypeScript](https://typescriptlang.org/) | 5.x | Type safety |
| [Node.js](https://nodejs.org/) | 20+ | Runtime |

### Styling & UI
| Technology | Purpose |
|-----------|---------|
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible component library |
| [Lucide React](https://lucide.dev/) | Modern icon set |
| [Recharts](https://recharts.org/) | Chart library (Bar, Pie, Line) |
| [Sonner](https://sonner.emilkowal.dev/) | Toast notifications |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/Light mode |

### Backend & Database
| Technology | Purpose |
|-----------|---------|
| [Supabase](https://supabase.com/) | PostgreSQL database + API |
| [@supabase/supabase-js](https://github.com/supabase/supabase-js) | JavaScript client |

### Forms & Validation
| Technology | Purpose |
|-----------|---------|
| [React Hook Form](https://react-hook-form.com/) | Performant form handling |
| [Zod](https://zod.dev/) | Schema validation |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | Zod + RHF integration |

### Security
| Feature | Implementation |
|---------|---------------|
| Password Hashing | SHA-256 with salt via Web Crypto API |
| Session Management | 30-min timeout with auto-logout |
| Activity Logging | Full audit trail in Supabase |
| Input Validation | Zod schemas on all forms |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm** (comes with Node.js)
- A **Supabase** account ([free tier](https://supabase.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/farens27/Leave-Management-System.git
cd Leave-Management-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Get these from your Supabase Dashboard → **Settings** → **API**

### 4. Set Up Database

Run the following SQL in your **Supabase SQL Editor**:

```sql
-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '',
  position TEXT NOT NULL DEFAULT '',
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  leave_balance INTEGER DEFAULT 12,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDING',
  leave_type TEXT DEFAULT 'ANNUAL',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  username TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  details TEXT NOT NULL DEFAULT '',
  ip_address TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT now()
);

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

-- Disable RLS for development (enable with proper policies for production)
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

### Admin Account
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |
| Access | Full dashboard, employee CRUD, leave management, logs, team availability |

### Employee Account (Demo)
| Field | Value |
|-------|-------|
| Username | `john.doe` |
| Password | `password123` |
| Access | View & submit leave requests, profile, change password, notifications |

> **Tip:** You can also create more employees through the admin dashboard. The default password is `password123` unless you specify a different one.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/              # Login page with CAPTCHA
│   ├── dashboard/          # Admin dashboard with charts & holidays
│   ├── employees/          # Employee CRUD pages
│   │   ├── new/            # Create employee
│   │   └── edit/[id]/      # Edit employee
│   ├── leave/              # Leave request management
│   │   └── new/            # Submit leave request
│   ├── logs/               # Activity log monitoring
│   ├── profile/            # Employee profile & password change
│   ├── code-review/        # Public code review report
│   └── api/init-db/        # Database initialization API
├── components/
│   ├── ui/                 # shadcn/ui base components (button, input, dialog, etc.)
│   ├── shared/             # Navbar, ThemeToggle, PageHeader, Avatar, NotificationBell
│   ├── employee/           # Employee form & table
│   ├── dashboard/          # Stats cards & charts
│   └── leave/              # Leave form, table, calendar
├── services/               # Supabase CRUD services
│   ├── auth-service.ts     # Authentication + activity logging
│   ├── employee-service.ts # Employee CRUD + leave balance
│   ├── leave-service.ts    # Leave requests + balance deduction
│   ├── activity-log-service.ts # Event logging
│   └── notification-service.ts # In-app notifications
├── lib/
│   └── supabase.ts         # Supabase client initialization
├── types/                  # TypeScript types (Employee, LeaveRequest, LeaveType, etc.)
├── validators/             # Zod schemas (login, employee, leave with leaveType)
├── constants/              # App constants & config
├── data/                   # Static data (holidays, code review findings)
│   ├── indonesia-holidays.ts   # 34 holidays (2025-2026)
│   └── code-review-data.ts     # Review findings with history
├── hooks/                  # Custom React hooks
│   └── useSessionExpiry.ts # Auto-logout on inactivity
└── utils/                  # Utility functions
    ├── export.ts           # CSV export (Excel-compatible)
    └── hash.ts             # SHA-256 password hashing
```

---

## 🔒 Security Features

| Feature | Status | Details |
|---------|:------:|---------|
| Password Hashing | ✅ | SHA-256 + salt via Web Crypto API |
| Session Expiry | ✅ | 30-min timeout, 2-min warning |
| Activity Logging | ✅ | Full audit trail (login, CRUD, leave actions) |
| Input Validation | ✅ | Zod schemas on all forms |
| Rejection Audit | ✅ | Admin must provide reason for rejections |
| Password Change | ✅ | Self-service with current password verification |
| Server-side Auth | ⚠️ | Client-side only (add RLS for production) |
| Rate Limiting | ⚠️ | Not yet implemented |

---

## 🌍 Deployment

This project is deployed on **Vercel** with automatic deployments on every push to `main`.

### Deploy Your Own

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your fork
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

> **Important:** Set Node.js version to **20.x** in Vercel → Settings → General

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💚 using Next.js, Supabase & Tailwind CSS
</p>
