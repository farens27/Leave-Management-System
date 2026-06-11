# 🍃 LeaveManager — Employee Leave Management System

A modern, full-stack employee leave management system built with **Next.js 16**, **React 19**, **Supabase**, and **Tailwind CSS 4**. Features a sleek emerald/teal design with dark/light mode, real-time data, interactive charts, and activity log monitoring.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)

---

## 🌐 Live Demo

🔗 **[https://leave-management-system-opal.vercel.app](https://leave-management-system-opal.vercel.app)**

---

## ✨ Features

### 🔐 Authentication
- Admin & Employee role-based login
- Show/Hide password toggle
- CAPTCHA verification
- "Remember me" option
- Activity logging on login/logout/failed attempts

### 📊 Admin Dashboard
- Stats cards (Total Employees, Leave Requests, Approval Rate)
- Leave distribution bar chart (Recharts)
- Quick action navigation

### 👥 Employee Management (CRUD)
- Create, Read, Update, Delete employees
- Username uniqueness validation
- Search & filter capabilities
- Responsive data table

### 📅 Leave Request Management
- Submit new leave requests
- Approve / Reject workflow
- Status tracking (Pending, Approved, Rejected)
- Date range validation

### 📈 Activity Log Monitoring (Admin)
- Real-time activity feed
- Daily login activity bar chart
- Event type distribution pie chart
- Filter by event type (Login, Logout, Failed, etc.)

### 📋 Code Review Report (Public)
- Accessible without login from the login page
- Security score gauge (circular SVG)
- Pass/Fail/Vulnerable breakdown with progress bars
- Severity distribution (Critical, High, Medium, Low)
- Interactive finding cards with expand/collapse
- Bar & Pie charts for findings analysis

### 🎨 UI/UX
- Dark / Light theme toggle
- Emerald & Teal color scheme
- Glassmorphism effects
- Smooth animations & micro-interactions
- Fully responsive (mobile, tablet, desktop)

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

-- Disable RLS for development (enable with proper policies for production)
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
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
| Access | Full dashboard, employee CRUD, leave management, logs |

### Employee Account
Create an employee through the admin dashboard, then log in with the employee's credentials:

| Field | Value |
|-------|-------|
| Username | *(set during employee creation)* |
| Password | *(set during employee creation)* |
| Access | View & submit leave requests only |

> **Note:** The default password when creating employees is `password123` unless you specify a different one.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/              # Login page with CAPTCHA
│   ├── dashboard/          # Admin dashboard with charts
│   ├── employees/          # Employee CRUD pages
│   │   ├── new/            # Create employee
│   │   └── edit/[id]/      # Edit employee
│   ├── leave/              # Leave request management
│   │   └── new/            # Submit leave request
│   ├── logs/               # Activity log monitoring
│   ├── code-review/        # Public code review report
│   └── api/init-db/        # Database initialization API
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── shared/             # Navbar, ThemeToggle, PageHeader
│   ├── employee/           # Employee form & table
│   ├── dashboard/          # Stats cards & charts
│   └── leave/              # Leave form & table
├── services/               # Supabase CRUD services
│   ├── auth-service.ts     # Authentication + activity logging
│   ├── employee-service.ts # Employee CRUD operations
│   ├── leave-service.ts    # Leave request operations
│   └── activity-log-service.ts # Event logging
├── lib/
│   └── supabase.ts         # Supabase client initialization
├── types/                  # TypeScript type definitions
├── validators/             # Zod validation schemas
├── constants/              # App constants & config
├── data/                   # Static data (code review findings)
└── hooks/                  # Custom React hooks
```

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
