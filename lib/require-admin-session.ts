// lib/require-admin-session.ts
import type { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

export function requireAdminSession(request: NextRequest) {
  const token = request.cookies.get("bru_admin_session")?.value;
  return verifyAdminSession(token);
}