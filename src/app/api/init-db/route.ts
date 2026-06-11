import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create employees table
    const { error: empError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS employees (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          department TEXT DEFAULT '',
          position TEXT DEFAULT '',
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        );
      `,
    });

    // Create leave_requests table
    const { error: leaveError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS leave_requests (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          reason TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
          created_at TIMESTAMPTZ DEFAULT now()
        );
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Database initialized. If RPC errors, please create tables manually in Supabase SQL Editor.",
      errors: { empError, leaveError },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Use Supabase SQL Editor to create tables manually.", error: String(err) },
      { status: 500 }
    );
  }
}
